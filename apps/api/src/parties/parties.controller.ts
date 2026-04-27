import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { JwtPayload } from "../auth/auth.types";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { EffectiveTenantId } from "../common/decorators/effective-tenant.decorator";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { CreatePartyDto } from "./dto/create-party.dto";
import { ListPartiesQuery } from "./dto/list-parties.query";
import { PartiesService } from "./parties.service";

@ApiTags("parties")
@ApiBearerAuth()
@Controller({ path: "parties", version: "1" })
@UseGuards(AuthGuard("jwt"), TenantGuard, PermissionsGuard)
export class PartiesController {
  constructor(private readonly parties: PartiesService) {}

  @Get()
  @RequirePermissions("parties:read")
  @ApiOperation({ summary: "Listar clientes/contrapartes (paginado)" })
  list(@EffectiveTenantId() tenantId: string, @Query() query: ListPartiesQuery) {
    return this.parties.list(tenantId, query);
  }

  @Post()
  @RequirePermissions("parties:write")
  @ApiOperation({ summary: "Crear cliente/contraparte" })
  create(
    @EffectiveTenantId() tenantId: string,
    @Body() dto: CreatePartyDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Headers("x-request-id") requestId?: string,
  ) {
    const ip = req.ip;
    const userAgent = req.headers["user-agent"] ?? undefined;
    return this.parties.create(tenantId, dto, {
      actorUserId: user.sub,
      ip: ip ?? undefined,
      userAgent: typeof userAgent === "string" ? userAgent : undefined,
      requestId: requestId ?? undefined,
    });
  }
}
