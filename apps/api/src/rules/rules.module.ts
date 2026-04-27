import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RulesController } from "./rules.controller";
import { RulesService } from "./rules.service";

@Module({
  imports: [AuthModule],
  controllers: [RulesController],
  providers: [RulesService, PermissionsGuard],
})
export class RulesModule {}
