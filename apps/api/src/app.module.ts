import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health/health.controller";
import { PartiesModule } from "./parties/parties.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RulesModule } from "./rules/rules.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PartiesModule,
    RulesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
