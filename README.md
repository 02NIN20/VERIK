# VERIK

[![CI](https://github.com/HCHAPS404/VERIK/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/HCHAPS404/VERIK/actions/workflows/ci.yml)

Plataforma **RegTech B2B** de cumplimiento y monitoreo (multi-tenant): **API NestJS** + **Web Next.js** + **PostgreSQL** (Prisma). Ver plan maestro en Cursor y [`docs/INDEX.md`](docs/INDEX.md).

**Repositorio remoto:** [https://github.com/HCHAPS404/VERIK](https://github.com/HCHAPS404/VERIK)

## Requisitos

- Node.js **20+** y **pnpm 9** ([Corepack](https://nodejs.org/api/corepack.html): `corepack enable pnpm`)
- Docker (opcional, recomendado para Postgres local)

## Inicio rápido

```bash
cp .env.example .env
# Ajustar JWT_SECRET y DATABASE_URL si hace falta

docker compose up -d postgres
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- **API:** [http://localhost:4000/health](http://localhost:4000/health) — OpenAPI: [http://localhost:4000/docs](http://localhost:4000/docs)  
- **Web:** [http://localhost:3000](http://localhost:3000) → redirige a `/login`

### Usuarios de prueba (contraseña `Demo123!`)

| Usuario | Rol (plan) |
|-----------|------------|
| `superadmin@verik.local` | SuperAdmin plataforma (usar **X-Tenant-Id: demo** en API) |
| `admin@demo.verik` | Admin empresa |
| `oficial@demo.verik` | Oficial de cumplimiento |
| `analista@demo.verik` | Analista |
| `auditor@demo.verik` | Auditor |
| `ejecutivo@demo.verik` | Ejecutivo solo lectura |

## Estructura del monorepo

```
apps/
  api/        # NestJS — REST + Swagger
  web/        # Next.js (App Router)
packages/
  db/         # Prisma schema, migraciones, seed
  ui/         # Tokens CSS del design system
docs/         # Documentación inicial
```

## Git y GitHub

```bash
git init
git branch -M main
git remote add origin https://github.com/HCHAPS404/VERIK.git
git add .
git commit -m "chore: bootstrap VERIK monorepo"
git push -u origin main
```

> No subas `.env` ni secretos. Usa **GitHub Environments** para `DATABASE_URL` y claves en staging/producción.

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | API + Web en modo desarrollo (Turbo) |
| `pnpm build` | Compilar paquetes y apps |
| `pnpm lint` | ESLint en workspaces |
| `pnpm test` | Tests (placeholder donde aplique) |
| `pnpm db:generate` | Generar cliente Prisma |
| `pnpm db:migrate` | Aplicar migraciones |
| `pnpm db:seed` | Datos demo |

## Seguridad (MVP)

La web guarda el JWT en **`localStorage`** solo para agilizar el prototipo. Antes de piloto con datos reales, migrar a **cookies httpOnly** + CSRF y endurecer CSP.

## Licencia

MIT — ver [LICENSE](LICENSE). Sustituir por licencia propietaria si el producto pasa a código cerrado.
