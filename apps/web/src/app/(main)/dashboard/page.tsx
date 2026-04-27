"use client";

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0, color: "var(--verik-color-primary)" }}>Tablero</h1>
      <p style={{ color: "var(--verik-color-text-muted)", maxWidth: 640 }}>
        Vista inicial de VERIK. Use el menú para abrir <strong>Clientes</strong> y ver la tabla paginada conectada a la API.
      </p>
      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {[
          { label: "Alertas abiertas", value: "—", tone: "var(--verik-color-accent-warn)" },
          { label: "Casos en revisión", value: "—", tone: "var(--verik-color-secondary)" },
          { label: "Clientes en riesgo alto", value: "—", tone: "var(--verik-color-accent-danger)" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: "var(--verik-color-surface-elevated)",
              border: "1px solid var(--verik-color-border)",
              borderRadius: "var(--verik-radius-md)",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, color: "var(--verik-color-text-muted)" }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: kpi.tone }}>{kpi.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
