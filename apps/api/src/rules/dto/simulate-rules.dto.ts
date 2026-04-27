import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class SimulateRulesDto {
  @ApiPropertyOptional({ description: "Payload de muestra (transacción, cliente, etc.)" })
  @IsOptional()
  @IsObject()
  sample?: Record<string, unknown>;
}
