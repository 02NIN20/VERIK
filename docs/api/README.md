# API VERIK

## OpenAPI / Swagger

Con la API en ejecución (`pnpm dev` en `apps/api` o contenedor), la especificación interactiva está en:

- `http://localhost:4000/docs`

El documento se genera desde los decoradores de NestJS (`@nestjs/swagger`).

## Versionado

Las rutas versionadas usan prefijo URI **`/v1`** (Nest `VersioningType.URI`), por ejemplo:

- `POST /auth/login`
- `GET /v1/parties`
- `POST /v1/parties`
- `POST /v1/rules/simulate`

## Autenticación

- **Usuarios humanos**: `Authorization: Bearer <JWT>` emitido por `POST /auth/login`.
- **Superadmin plataforma**: además de JWT, enviar cabecera **`X-Tenant-Id`** con el **slug** (`demo`) o el **id** del tenant cuyo contexto se desea operar.

## Variables de entorno

Ver [`.env.example`](../../.env.example) en la raíz del monorepo.
