import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./auth.types";

const SUPER_PERMISSIONS = [
  "tenants:read",
  "parties:read",
  "parties:write",
  "audit:read",
  "dashboard:read",
  "users:write",
  "rules:read",
  "rules:write",
  "admin_terminal:use",
];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    if (user.isPlatformSuperAdmin) {
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        tenantId: null,
        permissions: SUPER_PERMISSIONS,
        isSuperAdmin: true,
      };
      return {
        accessToken: await this.jwt.signAsync(payload),
        user: { email: user.email, role: "superadmin" as const, tenantSlug: null as string | null },
      };
    }

    const tenantSlug = dto.tenantSlug ?? "demo";
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) {
      throw new UnauthorizedException("Tenant no encontrado");
    }

    const membership = await this.prisma.membership.findUnique({
      where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } },
      include: {
        role: {
          include: {
            rolePermissions: { include: { permission: true } },
          },
        },
      },
    });
    if (!membership) {
      throw new UnauthorizedException("Usuario sin acceso al tenant indicado");
    }

    const permissions = membership.role.rolePermissions.map((rp) => rp.permission.key);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: tenant.id,
      permissions,
      isSuperAdmin: false,
    };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        email: user.email,
        tenantSlug: tenant.slug,
        role: membership.role.key,
      },
    };
  }
}
