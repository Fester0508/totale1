import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = Math.min(
    parseInt(searchParams.get("per_page") || "20"),
    100
  );
  const search = searchParams.get("search")?.trim().toLowerCase() || "";

  // Se c'è ricerca, carica più utenti e filtra in memoria
  const fetchPerPage = search ? 1000 : perPage;
  const fetchPage = search ? 1 : page;

  const {
    data: listData,
    error,
  } = await supabase.auth.admin.listUsers({
    page: fetchPage,
    perPage: fetchPerPage,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let users = listData.users;
  // Total from Supabase Auth (available on the response)
  let total = (listData as unknown as { total?: number }).total ?? users.length;

  // Filtra per email se c'è ricerca
  if (search) {
    users = users.filter((u) =>
      u.email?.toLowerCase().includes(search)
    );
    total = users.length;
    // Pagina manualmente
    const start = (page - 1) * perPage;
    users = users.slice(start, start + perPage);
  }

  // Recupera conteggio analisi e profili per tutti gli utenti
  const userIds = users.map((u) => u.id);

  const [analisiRes, profilesRes] = await Promise.all([
    supabase
      .from("analisi")
      .select("user_id")
      .in("user_id", userIds.length > 0 ? userIds : [""]),
    supabase
      .from("user_profiles")
      .select("*")
      .in("id", userIds.length > 0 ? userIds : [""]),
  ]);

  // Conteggio analisi per utente
  const analisiCounts: Record<string, number> = {};
  for (const row of analisiRes.data ?? []) {
    if (row.user_id) {
      analisiCounts[row.user_id] = (analisiCounts[row.user_id] || 0) + 1;
    }
  }

  // Profili per utente
  const profiles = profilesRes.data ?? [];
  const profilesMap: Record<string, (typeof profiles)[number]> = {};
  for (const p of profiles) {
    profilesMap[p.id] = p;
  }

  const data = users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    analisi_count: analisiCounts[u.id] || 0,
    profile: profilesMap[u.id] || null,
  }));

  return NextResponse.json({
    data,
    total,
    page,
    per_page: perPage,
  });
}
