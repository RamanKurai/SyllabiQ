// Lightweight auth helpers
export function saveToken(token: string) {
  try {
    localStorage.setItem('syllabiq_token', token);
  } catch {}
}

export function getToken(): string | null {
  try {
    return localStorage.getItem('syllabiq_token');
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem('syllabiq_token');
  } catch {}
}

export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Decode JWT payload (no verification) - returns parsed payload or null
export function decodeJwt(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

