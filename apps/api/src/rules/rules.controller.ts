import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { EffectiveTenantId } from "../common/decorators/effective-tenant.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { SimulateRulesDto } from "./dto/simulate-rules.dto";
import { RulesService } from "./rules.service";

@ApiTags("rules")
@ApiBearerAuth()
@Controller({ path: "rules", version: "1" })
@UseGuards(AuthGuard("jwt"), TenantGuard, PermissionsGuard)
export class RulesController {
  constructor(private readonly rules: RulesService) {}

  @Post("simulate")
  @RequirePermissions("rules:read")
  @ApiOperation({ summary: "Simulación sandbox de reglas (stub)" })
  simulate(@EffectiveTenantId() tenantId: string, @Body() dto: SimulateRulesDto) {
    return this.rules.simulate(tenantId, dto.sample);
  }
}
