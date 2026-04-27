"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiLogin, setStoredToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.verik");
  const [password, setPassword] = useState("Demo123!");
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const isSuper = email.toLowerCase().includes("superadmin");
      const body = isSuper
        ? { email, password }
        : { email, password, tenantSlug: tenantSlug || "demo" };
      const res = await apiLogin(body);
      setStoredToken(res.accessToken);
      if (res.user.role === "superadmin") {
        window.localStorage.setItem("verik_tenant_header", tenantSlug || "demo");
      } else {
        window.localStorage.removeItem("verik_tenant_header");
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "linear-gradient(160deg, #0d3d3a 0%, #1e293b 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: "var(--verik-radius-md)",
          padding: 28,
          boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 22, color: "var(--verik-color-primary)", letterSpacing: "0.06em" }}>
          VERIK
        </div>
        <p style={{ color: "var(--verik-color-text-muted)", marginTop: 8 }}>Acceso a la consola web</p>
        <form onSubmit={onSubmit} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
            Correo
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--verik-color-border)" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
            Contraseña
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--verik-color-border)" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
            Tenant (slug o id; superadmin usa esto en <code>X-Tenant-Id</code>)
            <input
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--verik-color-border)" }}
            />
          </label>
          {error && <div style={{ color: "var(--verik-color-accent-danger)", fontSize: 14 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: "12px 14px",
              borderRadius: 8,
              border: "none",
              background: "var(--verik-color-primary)",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p style={{ fontSize: 12, color: "var(--verik-color-text-muted)", marginTop: 16 }}>
          Demo: <code>admin@demo.verik</code> / <code>Demo123!</code> — tenant <code>demo</code>
        </p>
      </div>
    </div>
  );
}
