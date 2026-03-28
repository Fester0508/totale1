import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = Math.min(
    parseInt(searchParams.get("per_page") || "20"),
    100
  );
  const search = searchParams.get("search")?.trim().toLowerCase() || "";

  const skip = (page - 1) * perPage;

  const where = search
    ? { email: { contains: search, mode: "insensitive" as const } }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  // Recupera conteggio analisi per tutti gli utenti
  const userIds = users.map((u) => u.id);

  const analisiCounts = await prisma.analisi.groupBy({
    by: ["userId"],
    where: { userId: { in: userIds } },
    _count: { id: true },
  });

  const countsMap: Record<string, number> = {};
  for (const row of analisiCounts) {
    if (row.userId) countsMap[row.userId] = row._count.id;
  }

  const data = users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.createdAt,
    last_sign_in_at: u.updatedAt,
    analisi_count: countsMap[u.id] || 0,
    profile: u.profile,
  }));

  return NextResponse.json({
    data,
    total,
    page,
    per_page: perPage,
  });
}
