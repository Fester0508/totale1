import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = Math.min(parseInt(searchParams.get("per_page") || "20"), 100);
  const stato = searchParams.get("stato");
  const semaforo = searchParams.get("semaforo");
  const fileType = searchParams.get("file_type");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") === "asc" ? true : false;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("analisi")
    .select("id, stato, semaforo, file_type, numero_anomalie, created_at, file_url", {
      count: "exact",
    });

  if (stato) query = query.eq("stato", stato);
  if (semaforo) query = query.eq("semaforo", semaforo);
  if (fileType) query = query.eq("file_type", fileType);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);

  query = query.order(sort, { ascending: order }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    per_page: perPage,
  });
}
