import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo123!";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const permissionKeys = [
    { key: "parties:read", label: "Ver clientes/contrapartes" },
    { key: "parties:write", label: "Crear/editar clientes" },
    { key: "audit:read", label: "Ver auditoría" },
    { key: "dashboard:read", label: "Ver tableros" },
    { key: "users:write", label: "Gestionar usuarios del tenant" },
    { key: "rules:read", label: "Ver reglas" },
    { key: "rules:write", label: "Editar reglas" },
    { key: "admin_terminal:use", label: "Usar terminal administrativa" },
  ];

  const permissions: Record<string, string> = {};
  for (const p of permissionKeys) {
    const row = await prisma.permission.upsert({
      where: { key: p.key },
      update: { label: p.label },
      create: { key: p.key, label: p.label },
    });
    permissions[p.key] = row.id;
  }

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: { name: "Empresa Demo VERIK" },
    create: { name: "Empresa Demo VERIK", slug: "demo" },
  });

  const roleDefs: Array<{ key: string; name: string; description: string; permKeys: string[] }> = [
    {
      key: "admin",
      name: "Admin empresa",
      description: "Configura usuarios, reglas e integraciones.",
      permKeys: permissionKeys.map((p) => p.key),
    },
    {
      key: "oficial",
      name: "Oficial de cumplimiento",
      description: "Riesgos, alertas y decisiones críticas.",
      permKeys: ["parties:read", "parties:write", "audit:read", "dashboard:read", "rules:read", "rules:write"],
    },
    {
      key: "analista",
      name: "Analista de cumplimiento",
      description: "Gestiona casos y alertas asignadas.",
      permKeys: ["parties:read", "parties:write", "dashboard:read"],
    },
    {
      key: "auditor",
      name: "Auditor interno/externo",
      description: "Solo lectura sobre casos, reportes y auditoría.",
      permKeys: ["parties:read", "audit:read", "dashboard:read"],
    },
    {
      key: "ejecutivo",
      name: "Ejecutivo (solo lectura)",
      description: "KPIs y resúmenes agregados.",
      permKeys: ["dashboard:read", "parties:read"],
    },
  ];

  const roles: Record<string, string> = {};
  for (const r of roleDefs) {
    const role = await prisma.role.upsert({
      where: { tenantId_key: { tenantId: tenant.id, key: r.key } },
      update: { name: r.name, description: r.description },
      create: {
        tenantId: tenant.id,
        key: r.key,
        name: r.name,
        description: r.description,
      },
    });
    roles[r.key] = role.id;
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    for (const pk of r.permKeys) {
      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: permissions[pk] },
      });
    }
  }

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@verik.local" },
    update: { passwordHash, isPlatformSuperAdmin: true },
    create: {
      email: "superadmin@verik.local",
      passwordHash,
      isPlatformSuperAdmin: true,
    },
  });

  const demoUsers: Array<{ email: string; roleKey: string }> = [
    { email: "admin@demo.verik", roleKey: "admin" },
    { email: "oficial@demo.verik", roleKey: "oficial" },
    { email: "analista@demo.verik", roleKey: "analista" },
    { email: "auditor@demo.verik", roleKey: "auditor" },
    { email: "ejecutivo@demo.verik", roleKey: "ejecutivo" },
  ];

  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash },
      create: { email: u.email, passwordHash, isPlatformSuperAdmin: false },
    });
    await prisma.membership.upsert({
      where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
      update: { roleId: roles[u.roleKey] },
      create: {
        userId: user.id,
        tenantId: tenant.id,
        roleId: roles[u.roleKey],
      },
    });
  }

  await prisma.consent.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.party.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.party.createMany({
    data: [
      {
        tenantId: tenant.id,
        displayName: "Comercializadora Andina SAS",
        documentType: "NIT",
        documentId: "900.123.456-7",
        riskLevel: "MEDIUM",
      },
      {
        tenantId: tenant.id,
        displayName: "Persona Natural — María López",
        documentType: "CC",
        documentId: "52.123.456",
        riskLevel: "LOW",
      },
      {
        tenantId: tenant.id,
        displayName: "Proveedor Exterior LLC",
        documentType: "FOREIGN",
        documentId: "EIN-12-3456789",
        riskLevel: "HIGH",
      },
    ],
  });

  await prisma.ruleEvaluation.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.ruleVersion.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.ruleVersion.create({
    data: {
      tenantId: tenant.id,
      version: 1,
      status: "draft",
      definition: {
        $schema: "https://verik.dev/schemas/rule-definition/v1.json",
        name: "Ejemplo — monto alto",
        conditions: [{ field: "amount", op: "gt", value: 5_000_000 }],
        actions: [{ type: "create_alert", severity: "medium" }],
      },
      createdByUserId: superAdmin.id,
    },
  });

  console.log("Seed OK. Usuarios demo (contraseña: %s):", DEMO_PASSWORD);
  console.log(
    "  superadmin@verik.local (plataforma), admin@demo.verik, oficial@demo.verik, analista@demo.verik, auditor@demo.verik, ejecutivo@demo.verik",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
