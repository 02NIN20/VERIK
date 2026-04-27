const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("verik_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("verik_token", token);
  else window.localStorage.removeItem("verik_token");
}

export async function apiLogin(body: { email: string; password: string; tenantSlug?: string }) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string | string[] };
    const msg = err.message;
    const text = Array.isArray(msg) ? msg.join(", ") : msg;
    throw new Error(text ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<{ accessToken: string; user: { email: string; tenantSlug?: string; role?: string } }>;
}

export async function apiFetchParties(params: { token: string; tenantHeader?: string; q?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.page) qs.set("page", String(params.page));
  const headers: Record<string, string> = { Authorization: `Bearer ${params.token}` };
  if (params.tenantHeader) headers["X-Tenant-Id"] = params.tenantHeader;
  const res = await fetch(`${API}/v1/parties?${qs.toString()}`, { headers });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string | string[] };
    const msg = err.message;
    const text = Array.isArray(msg) ? msg.join(", ") : msg;
    throw new Error(text ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<{
    items: Array<{
      id: string;
      displayName: string;
      documentType: string | null;
      documentId: string | null;
      riskLevel: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }>;
}
