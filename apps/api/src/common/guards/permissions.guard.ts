import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "../../auth/auth.types";

export const PERMISSIONS_KEY = "verik_permissions";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload;
    const has = (p: string) => user.isSuperAdmin || user.permissions.includes(p);
    const ok = required.every((p) => has(p));
    if (!ok) {
      throw new ForbiddenException("Permisos insuficientes");
    }
    return true;
  }
}
