import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Estado del servicio" })
  health() {
    return { status: "ok", service: "verik-api", ts: new Date().toISOString() };
  }
}
