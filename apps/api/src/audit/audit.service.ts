import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface AuditParams {
  tenantId: string;
  actorUserId: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  payloadSummary?: Record<string, unknown> | null;
  diff?: Record<string, unknown> | null;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: AuditParams) {
    await this.prisma.auditEvent.create({
      data: {
        tenantId: params.tenantId,
        actorUserId: params.actorUserId ?? undefined,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId ?? undefined,
        ip: params.ip ?? undefined,
        userAgent: params.userAgent ?? undefined,
        requestId: params.requestId ?? undefined,
        payloadSummary: params.payloadSummary ?? undefined,
        diff: params.diff ?? undefined,
      },
    });
  }
}
