import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = Math.min(parseInt(searchParams.get("per_page") || "20"), 100);
  const stato = searchParams.get("stato");
  const semaforo = searchParams.get("semaforo");
  const fileType = searchParams.get("file_type");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const skip = (page - 1) * perPage;

  const where: Prisma.AnalisiWhereInput = {};
  if (stato) where.stato = stato;
  if (semaforo) where.semaforo = semaforo;
  if (fileType) where.fileType = fileType;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  // Map sort field from snake_case to camelCase
  const sortFieldMap: Record<string, string> = {
    created_at: "createdAt",
    stato: "stato",
    semaforo: "semaforo",
    file_type: "fileType",
    numero_anomalie: "numeroAnomalie",
  };
  const sortField = sortFieldMap[sort] || "createdAt";

  const [data, total] = await Promise.all([
    prisma.analisi.findMany({
      where,
      select: {
        id: true,
        stato: true,
        semaforo: true,
        fileType: true,
        numeroAnomalie: true,
        createdAt: true,
        fileUrl: true,
      },
      orderBy: { [sortField]: order },
      skip,
      take: perPage,
    }),
    prisma.analisi.count({ where }),
  ]);

  return NextResponse.json({
    data: data.map((d) => ({
      id: d.id,
      stato: d.stato,
      semaforo: d.semaforo,
      file_type: d.fileType,
      numero_anomalie: d.numeroAnomalie,
      created_at: d.createdAt,
      file_url: d.fileUrl,
    })),
    total,
    page,
    per_page: perPage,
  });
}
