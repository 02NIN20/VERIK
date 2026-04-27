export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string | null;
  permissions: string[];
  isSuperAdmin: boolean;
}
