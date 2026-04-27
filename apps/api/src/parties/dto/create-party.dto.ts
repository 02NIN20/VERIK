import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePartyDto {
  @ApiProperty({ example: "Cliente Demo SAS" })
  @IsString()
  @MinLength(2)
  displayName!: string;

  @ApiPropertyOptional({ example: "NIT" })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiPropertyOptional({ example: "901.555.000-1" })
  @IsOptional()
  @IsString()
  documentId?: string;

  @ApiPropertyOptional({ enum: ["LOW", "MEDIUM", "HIGH", "UNKNOWN"], default: "UNKNOWN" })
  @IsOptional()
  @IsIn(["LOW", "MEDIUM", "HIGH", "UNKNOWN"])
  riskLevel?: string;
}
