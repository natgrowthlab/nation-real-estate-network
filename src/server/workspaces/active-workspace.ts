import { cookies } from "next/headers";
import { db } from "../db";

export const ACTIVE_WORKSPACE_COOKIE = "nexo_active_workspace";

export async function getActiveWorkspaceId(userId: string) {
  const requestedId = (await cookies()).get(ACTIVE_WORKSPACE_COOKIE)?.value;
  if (requestedId) {
    const selected = await db.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: requestedId, userId } },
      select: { workspaceId: true },
    });
    if (selected) return selected.workspaceId;
  }
  const fallback = await db.workspaceMember.findFirst({ where: { userId }, orderBy: { createdAt: "asc" }, select: { workspaceId: true } });
  return fallback?.workspaceId ?? null;
}
