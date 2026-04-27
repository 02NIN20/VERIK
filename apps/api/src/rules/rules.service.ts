import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  async simulate(tenantId: string, sample?: Record<string, unknown>) {
    const active = await this.prisma.ruleVersion.findFirst({
      where: { tenantId, status: "active" },
      orderBy: { version: "desc" },
    });
    return {
      simulated: true,
      tenantId,
      activeRuleVersionId: active?.id ?? null,
      sampleReceived: sample ?? {},
      message:
        "Stub v1: en producción aquí se evaluarían reglas declarativas sin persistir alertas (sandbox).",
    };
  }
}
