import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePartyDto } from "./dto/create-party.dto";
import { ListPartiesQuery } from "./dto/list-parties.query";

@Injectable()
export class PartiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(tenantId: string, query: ListPartiesQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.PartyWhereInput = { tenantId };
    if (query.q?.trim()) {
      const q = query.q.trim();
      where.OR = [
        { displayName: { contains: q, mode: "insensitive" } },
        { documentId: { contains: q, mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      this.prisma.party.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.party.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async create(
    tenantId: string,
    dto: CreatePartyDto,
    ctx: { actorUserId: string; ip?: string; userAgent?: string; requestId?: string },
  ) {
    const party = await this.prisma.party.create({
      data: {
        tenantId,
        displayName: dto.displayName,
        documentType: dto.documentType,
        documentId: dto.documentId,
        riskLevel: dto.riskLevel ?? "UNKNOWN",
      },
    });
    await this.audit.log({
      tenantId,
      actorUserId: ctx.actorUserId,
      action: "party.create",
      resourceType: "Party",
      resourceId: party.id,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      requestId: ctx.requestId,
      payloadSummary: { displayName: party.displayName },
    });
    return party;
  }
}
