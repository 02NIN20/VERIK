import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface AuditParams {
  tenantId: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  payloadSummary?: Record<string, unknown>;
  diff?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: AuditParams) {
    await this.prisma.auditEvent.create({
      data: {
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        ip: params.ip,
        userAgent: params.userAgent,
        requestId: params.requestId,
        payloadSummary: params.payloadSummary,
        diff: params.diff,
      },
    });
  }
}
