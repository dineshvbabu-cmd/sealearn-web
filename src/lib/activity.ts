import { prisma } from "@/lib/prisma";

export interface LogActivityInput {
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  entityLabel?: string;
  detail?: string;
  ipAddress?: string;
}

export async function logActivity(input: LogActivityInput) {
  try {
    await prisma.activityLog.create({ data: input });
  } catch {
    // Never let logging break the main operation
  }
}
