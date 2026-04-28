import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { AuthModule } from "../auth/auth.module";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { PartiesController } from "./parties.controller";
import { PartiesService } from "./parties.service";

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [PartiesController],
  providers: [PartiesService, TenantGuard, PermissionsGuard],
})
export class PartiesModule {}
