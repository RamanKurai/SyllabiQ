import { authHeader } from "../../lib/auth";

async function handleJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  let payload: any = null;
  if (contentType.includes("application/json")) {
    payload = await res.json();
  } else {
    payload = await res.text();
  }
  if (!res.ok) {
    const message = payload?.detail || payload?.message || payload || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return payload;
}

export async function adminGet(path: string) {
  const res = await fetch(`/api/admin${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  return await handleJson(res);
}

export async function adminPost(path: string, body?: any) {
  const res = await fetch(`/api/admin${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  });
  return await handleJson(res);
}

export async function adminPut(path: string, body?: any) {
  const res = await fetch(`/api/admin${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  });
  return await handleJson(res);
}

export async function adminDelete(path: string) {
  const res = await fetch(`/api/admin${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  return await handleJson(res);
}

export async function fetchPendingUsers(institutionId?: number) {
  const q = institutionId ? `?institution_id=${institutionId}` : "";
  return await adminGet(`/users/pending${q}`);
}

export async function approveUser(userId: number, assignRoleId?: number) {
  return await adminPost(`/users/${userId}/approve`, assignRoleId ? { assign_role_id: assignRoleId } : {});
}

export async function denyUser(userId: number) {
  return await adminPost(`/users/${userId}/deny`);
}

export async function suspendUser(userId: number) {
  return await adminPost(`/users/${userId}/suspend`);
}

export async function getInstitutions() {
  return await adminGet(`/institutions`);
}

export async function createInstitution(payload: any) {
  return await adminPost(`/institutions`, payload);
}

export async function updateInstitution(id: number, payload: any) {
  return await adminPut(`/institutions/${id}`, payload);
}

export async function deleteInstitution(id: number) {
  return await adminDelete(`/institutions/${id}`);
}

export async function adminAssignRole(payload: { user_id: number; role_id: number; institution_id?: number | null }) {
  return await adminPost("/role-assignments", payload);
}

// Admin listing with pagination
export async function adminListRoles(limit = 50, offset = 0) {
  return await adminGet(`/roles?limit=${limit}&offset=${offset}`);
}

export async function adminListInstitutions(limit = 50, offset = 0) {
  return await adminGet(`/institutions?limit=${limit}&offset=${offset}`);
}

export async function adminListPendingUsers(limit = 50, offset = 0, institutionId?: number) {
  const q = `?limit=${limit}&offset=${offset}${institutionId ? `&institution_id=${institutionId}` : ""}`;
  return await adminGet(`/users/pending${q}`);
}

export async function adminListUsers(limit = 50, offset = 0, status?: string, institutionId?: number) {
  const q = `?limit=${limit}&offset=${offset}${status ? `&status=${encodeURIComponent(status)}` : ""}${institutionId ? `&institution_id=${institutionId}` : ""}`;
  return await adminGet(`/users${q}`);
}

// Content endpoints (use existing /api/content routes), include auth header
async function contentFetch(path: string, init?: RequestInit) {
  const res = await fetch(`/api/content${path}`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
    ...init,
  });
  return await handleJson(res);
}

export async function contentListCourses() {
  return await contentFetch("/courses");
}

export async function contentListSubjects() {
  return await contentFetch("/subjects");
}

export async function contentListSyllabi() {
  return await contentFetch("/syllabi");
}

export async function contentListTopics() {
  return await contentFetch("/topics");
}

