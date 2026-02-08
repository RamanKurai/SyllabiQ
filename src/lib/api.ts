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

async function postJson<T = any>(path: string, body: any, init?: RequestInit): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeader(),
  };

  const mergedHeaders = {
    ...(init?.headers as Record<string, string> | undefined),
    ...defaultHeaders,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    headers: mergedHeaders,
    method: "POST",
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
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
  const res = await fetch(`${API_BASE}/v1/subjects`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getTopics(subjectId: string): Promise<Array<{ id: string; name: string }>> {
  const res = await fetch(`${API_BASE}/v1/subjects/${encodeURIComponent(subjectId)}/topics`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getInstitutions(): Promise<Array<{ id: number; name: string }>> {
  const res = await fetch(`${API_BASE}/institutions`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

