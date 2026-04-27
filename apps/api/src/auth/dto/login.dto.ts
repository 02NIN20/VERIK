import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@demo.verik" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Demo123!" })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ description: "Slug del tenant (obligatorio salvo superadmin)", example: "demo" })
  @IsOptional()
  @IsString()
  tenantSlug?: string;
}
