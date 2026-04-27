# Documento de pendientes, riesgos y vulnerabilidades de VERIK (Versión inicial)

> Copia operativa del plan maestro — revisar tras cada hito de producto.

## 1. Diseño incompleto o por aclarar

- Integraciones reales (Registraduría, proveedores OCR/biometría, listas restrictivas).
- Formatos exactos de reportes regulatorios (UIAF, ROS, RAOS) por versión de anexo.
- Política de retención y borrado por categoría de dato personal.
- Impersonación SuperAdmin y marco legal / contrato con clientes.
- Alineación fina Open Finance (Decreto 0368 y normas complementarias) frente a capacidades del producto.

## 2. Vulnerabilidades técnicas o de diseño

- **IDOR / fuga entre tenants** si no se valida `tenantId` en cada consulta y prueba automatizada de aislamiento.
- **Fuga de PII** en logs, trazas APM y ejemplos de OpenAPI.
- **Motor de reglas**: evitar ejecución de código arbitrario del usuario (riesgo RCE); preferir JSON declarativo validado por esquema.
- **MFA** obligatorio para roles críticos antes de piloto con datos reales.
- **Exportaciones** sin marca de agua / trazabilidad del descargable.

## 3. Riesgos de producto y mercado

- Dependencia de proveedores cloud y de datos externos.
- Cambios normativos frecuentes en entorno 2026+.
- Ciclos de venta enterprise (seguridad, legal, procurement).

## 4. Mitigaciones recomendadas (prioridad)

| Mitigación | Fase | Prioridad |
|------------|------|-----------|
| RLS en PostgreSQL + tests de aislamiento por `tenant_id` | Corto plazo | Alta |
| Política de logging sin PII; revisión de mensajes de error | Corto plazo | Alta |
| MFA (TOTP/WebAuthn) por política de tenant | Mediano | Alta |
| Roadmap evidencias tipo SOC 2 / ISO 27001 | Mediano | Media |
| Contratos y SLA con proveedores críticos | Mediano | Media |
