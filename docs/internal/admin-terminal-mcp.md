# Terminal administrativa y gateway MCP

## Terminal administrativa (allowlist)

Objetivo: permitir a perfiles con permiso `admin_terminal:use` ejecutar **comandos preaprobadas** sobre auditoría y métricas, sin SQL libre.

### Exposición prevista (web)

- Ruta sugerida: `/admin/terminal` (solo front; la API validará permisos).
- Cada comando se mapea a una **consulta parametrizada** con límites fijos (p. ej. máximo 500 filas, ventana temporal máxima 90 días).

### Ejemplos de comandos (contrato v0)

| Comando normalizado | Efecto |
|---------------------|--------|
| `audit last <n> [--user=<id>]` | Lista últimos `AuditEvent`, opcionalmente filtrados por actor. |
| `risk summary [--tenant=<id>] [--days=<n>]` | Agregados de riesgo por tenant (sin PII en respuesta). |
| `anomalies top clients [--days=<n>]` | Ranking de clientes con más alertas (IDs + conteos, no datos sensibles). |

### Auditoría de la propia terminal

Cada invocación debe persistirse en **`AdminQueryLog`**: `command`, `params` (sin PII), `rowCount`, `durationMs`, `actorUserId`, `tenantId` (nullable para operaciones de plataforma).

### Límites de seguridad

- Rate limiting por usuario y por tenant.
- Sin export masivo desde la terminal; usar flujos de export con aprobación y `AuditEvent` dedicado.

---

## MCP / agentes (diseño de seguridad)

### Objetivo

Exponer un **context broker** que un servidor MCP (o agente HTTP) consuma con **token de servicio** y **scopes** explícitos.

### Scopes sugeridos (solo lectura por defecto)

- `read:metrics` — agregados de uso y salud del tenant.
- `read:rules` — metadatos y definiciones de reglas (sin datos de contraparte).
- `read:audit_summary` — conteos y tipos de eventos, sin payloads sensibles.

**Prohibido por defecto**: `read:party_pii` (documentos, nombres completos, etc.). Si se requiere, flujo humano-in-the-loop y consentimiento documentado.

### Contrato

1. Autenticación con **client credentials** o token de servicio rotado.
2. **Allowlist** de herramientas MCP; cada herramienta valida tenant y scope.
3. Registro en `AdminQueryLog` o tabla análoga de integración.
4. Respuestas **minimizadas** (agregados, IDs opacos, categorías).

### Referencias

- [Model Context Protocol](https://modelcontextprotocol.io/) — patrón de herramientas y recursos.
- Plan de producto: sección 5.4 del plan maestro VERIK.
