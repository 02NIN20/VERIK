"use client";

import { useEffect, useState } from "react";
import { apiFetchParties, getStoredToken } from "@/lib/api";

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<
    Array<{ id: string; displayName: string; documentType: string | null; documentId: string | null; riskLevel: string }>
  >([]);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getStoredToken();
      if (!token) throw new Error("Sin sesión");
      const tenantHeader =
        typeof window !== "undefined" ? window.localStorage.getItem("verik_tenant_header") ?? undefined : undefined;
      const data = await apiFetchParties({ token, tenantHeader: tenantHeader || undefined, q: q || undefined });
      setRows(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0, color: "var(--verik-color-primary)" }}>Clientes / Contrapartes</h1>
      <p style={{ color: "var(--verik-color-text-muted)" }}>
        Datos desde <code>GET /v1/parties</code>. Total: <strong>{total}</strong>
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o documento"
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 12px",
            borderRadius: "var(--verik-radius-sm)",
            border: "1px solid var(--verik-color-border)",
          }}
        />
        <button
          type="button"
          onClick={() => void load()}
          style={{
            padding: "10px 16px",
            borderRadius: "var(--verik-radius-sm)",
            border: "none",
            background: "var(--verik-color-primary)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>
      {error && (
        <div style={{ color: "var(--verik-color-accent-danger)", marginBottom: 12 }}>
          {error}
        </div>
      )}
      <div
        style={{
          border: "1px solid var(--verik-color-border)",
          borderRadius: "var(--verik-radius-md)",
          overflow: "auto",
          background: "var(--verik-color-surface-elevated)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#eef4f5" }}>
              <th style={{ padding: "10px 12px" }}>Nombre</th>
              <th style={{ padding: "10px 12px" }}>Documento</th>
              <th style={{ padding: "10px 12px" }}>Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ padding: 16, color: "var(--verik-color-text-muted)" }}>
                  Cargando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 16, color: "var(--verik-color-text-muted)" }}>
                  Sin resultados
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--verik-color-border)" }}>
                  <td style={{ padding: "10px 12px" }}>{r.displayName}</td>
                  <td style={{ padding: "10px 12px", color: "var(--verik-color-text-muted)" }}>
                    {r.documentType ? `${r.documentType} ` : ""}
                    {r.documentId ?? "—"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          r.riskLevel === "HIGH"
                            ? "rgba(220,38,38,0.12)"
                            : r.riskLevel === "MEDIUM"
                              ? "rgba(234,179,8,0.15)"
                              : "rgba(22,163,74,0.12)",
                        color:
                          r.riskLevel === "HIGH"
                            ? "var(--verik-color-accent-danger)"
                            : r.riskLevel === "MEDIUM"
                              ? "#a16207"
                              : "var(--verik-color-accent-ok)",
                      }}
                    >
                      {r.riskLevel}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
