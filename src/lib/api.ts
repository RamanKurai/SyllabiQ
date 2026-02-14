// Simple typed API client for SyllabiQ frontend
// Provides postQuery (full response) and streamQuery (async generator for streaming responses)
export type QueryRequest = {
  query: string;
  workflow?: string;
  marks?: number;
  top_k?: number;
  format?: string;
  subject?: string;
  topic?: string;
};

export type QueryResponse = {
  answer?: string;
  citations?: Array<{ id?: string; source?: string; text?: string; url?: string }>;
  metadata?: Record<string, any>;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000/api';

import { authHeader } from "./auth";

async function fetchJson<T = any>(input: string, init?: RequestInit): Promise<T> {
  const url = input.startsWith("http") ? input : `${API_BASE}${input}`;
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  let payload: any = null;
  try {
    if (contentType.includes("application/json")) {
      payload = await res.json();
    } else {
      payload = await res.text();
    }
  } catch {
    payload = null;
  }

  if (!res.ok) {
    // Try to extract a useful message from common shapes
    let message = `Request failed: ${res.status}`;
    if (payload) {
      if (typeof payload === "string") {
        message = payload;
      } else if (payload.detail) {
        message = payload.detail;
      } else if (payload.message) {
        message = payload.message;
      } else if (payload.error) {
        message = payload.error;
      } else {
        message = JSON.stringify(payload);
      }
    }
    throw new Error(message);
  }

  return payload as T;
}

async function postJson<T = any>(path: string, body: any, init?: RequestInit): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeader(),
  };
  const mergedHeaders = {
    ...(init?.headers as Record<string, string> | undefined),
    ...defaultHeaders,
  };
  return await fetchJson<T>(path, {
    method: "POST",
    headers: mergedHeaders,
    body: JSON.stringify(body),
    ...init,
  });
}

export async function postQuery(req: QueryRequest): Promise<QueryResponse> {
  return await postJson<QueryResponse>('/v1/query', req);
}

// Authentication helpers
export type SignupPayload = {
  email: string;
  password: string;
  full_name?: string | null;
  institution_id?: number | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type?: string;
  roles?: string[];
};

export async function authSignup(payload: SignupPayload) {
  return await postJson('/auth/signup', payload);
}

export async function authLogin(payload: LoginPayload): Promise<Token> {
  return await postJson<Token>('/auth/login', payload);
}

// Streaming helper: attempts to read server streaming (SSE-ish or NDJSON) and yields text chunks.
export async function* streamQuery(req: QueryRequest, signal?: AbortSignal): AsyncGenerator<string> {
  const res = await fetch(`${API_BASE}/v1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Stream request failed: ${res.status}`);
  }

  if (!res.body) {
    // no streaming support; fallback to full response
    const json = await res.json();
    if (json.answer) yield json.answer;
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      // handle SSE-style "data: " lines or plain chunked text
      let parts = buf.split('\n\n');
      // keep last partial
      buf = parts.pop() || '';
      for (const part of parts) {
        const lines = part.split('\n').map((l) => l.trim());
        for (const line of lines) {
          if (!line) continue;
          // SSE "data: {...}" or raw text
          if (line.startsWith('data:')) {
            const payload = line.replace(/^data:\s*/, '');
            try {
              const parsed = JSON.parse(payload);
              if (typeof parsed === 'string') {
                yield parsed;
              } else if (parsed.delta || parsed.chunk || parsed.text) {
                yield (parsed.delta ?? parsed.chunk ?? parsed.text) as string;
              } else if (parsed.answer) {
                yield parsed.answer as string;
              } else {
                // if object unknown, stringify small texts
                yield JSON.stringify(parsed);
              }
            } catch {
              // non-json data after data:
              yield payload;
            }
          } else {
            // plain text chunk
            yield line;
          }
        }
      }
    }
    // flush remaining buffer if any
    if (buf.trim()) {
      yield buf;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
}

export async function getSubjects(): Promise<Array<{ id: string; name: string }>> {
  return await fetchJson(`/v1/subjects`);
}

export async function getTopics(subjectId: string): Promise<Array<{ id: string; name: string }>> {
  return await fetchJson(`/v1/subjects/${encodeURIComponent(subjectId)}/topics`);
}

export async function getInstitutions(): Promise<Array<{ id: number; name: string }>> {
  return await fetchJson('/institutions');
}

export async function getDashboard(): Promise<any> {
  const authHeaders = (await import("./auth")).authHeader();
  return await fetchJson('/dashboard/me', { headers: { "Content-Type": "application/json", ...authHeaders } });
}

export async function getAuthMe(): Promise<any> {
  const authHeaders = (await import("./auth")).authHeader();
  return await fetchJson('/auth/me', { headers: { "Content-Type": "application/json", ...authHeaders } });
}

