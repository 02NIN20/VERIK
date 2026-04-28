import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RulesController } from "./rules.controller";
import { RulesService } from "./rules.service";

@Module({
  imports: [AuthModule],
  controllers: [RulesController],
  providers: [RulesService, TenantGuard, PermissionsGuard],
})
export class RulesModule {}
