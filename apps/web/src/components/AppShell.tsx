"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredToken, setStoredToken } from "@/lib/api";

const nav = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/clients", label: "Clientes" },
  { href: "/design", label: "Design system" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = getStoredToken();
    if (!t) router.replace("/login");
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div style={{ padding: 24, color: "var(--verik-color-text-muted)" }}>
        Cargando sesión…
      </div>
    );
  }

  if (!getStoredToken()) {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          background: "var(--verik-color-primary)",
          color: "#e8f5f3",
          padding: "var(--verik-space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--verik-space-3)",
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: "0.04em", fontSize: 18 }}>VERIK</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--verik-radius-sm)",
                  textDecoration: "none",
                  color: active ? "var(--verik-color-primary)" : "#e8f5f3",
                  background: active ? "#fff" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto" }}>
          <button
            type="button"
            onClick={() => {
              setStoredToken(null);
              window.localStorage.removeItem("verik_tenant_header");
              router.replace("/login");
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--verik-radius-sm)",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "var(--verik-space-6)", background: "var(--verik-color-surface)" }}>
        {children}
      </main>
    </div>
  );
}
