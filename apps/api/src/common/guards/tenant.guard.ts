import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtPayload } from "../../auth/auth.types";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload | undefined;
    if (!user) {
      throw new ForbiddenException();
    }
    if (user.isSuperAdmin) {
      const raw = req.headers["x-tenant-id"];
      const headerTenant = Array.isArray(raw) ? raw[0] : raw;
      if (!headerTenant || typeof headerTenant !== "string") {
        throw new BadRequestException("Cabecera X-Tenant-Id requerida para superadmin");
      }
      const tenant = await this.prisma.tenant.findFirst({
        where: { OR: [{ id: headerTenant }, { slug: headerTenant }] },
      });
      if (!tenant) {
        throw new BadRequestException("Tenant no encontrado (use id o slug en X-Tenant-Id)");
      }
      req.effectiveTenantId = tenant.id;
      return true;
    }
    if (!user.tenantId) {
      throw new ForbiddenException("Tenant no resuelto");
    }
    req.effectiveTenantId = user.tenantId;
    return true;
  }
}
