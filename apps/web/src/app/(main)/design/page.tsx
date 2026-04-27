"use client";

export default function DesignPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0, color: "var(--verik-color-primary)" }}>Design system (borrador)</h1>
      <p style={{ color: "var(--verik-color-text-muted)", maxWidth: 720 }}>
        Tokens desde <code>@verik/ui/tokens.css</code>. Estados base para botones, badges y superficies.
      </p>
      <section style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button
          type="button"
          style={{
            padding: "10px 16px",
            borderRadius: "var(--verik-radius-sm)",
            border: "none",
            background: "var(--verik-color-primary)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Primario
        </button>
        <button
          type="button"
          style={{
            padding: "10px 16px",
            borderRadius: "var(--verik-radius-sm)",
            border: "1px solid var(--verik-color-border)",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Secundario
        </button>
        <button type="button" disabled style={{ padding: "10px 16px", opacity: 0.5 }}>
          Deshabilitado
        </button>
      </section>
      <section style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["OK", "Atención", "Riesgo"].map((label, i) => (
          <span
            key={label}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              background:
                i === 0 ? "rgba(22,163,74,0.12)" : i === 1 ? "rgba(234,179,8,0.15)" : "rgba(220,38,38,0.12)",
              color:
                i === 0
                  ? "var(--verik-color-accent-ok)"
                  : i === 1
                    ? "#a16207"
                    : "var(--verik-color-accent-danger)",
            }}
          >
            {label}
          </span>
        ))}
      </section>
    </div>
  );
}
