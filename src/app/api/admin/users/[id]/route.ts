import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Recupera utente da auth
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(id);

  if (error || !user) {
    return NextResponse.json(
      { error: "Utente non trovato" },
      { status: 404 }
    );
  }

  // Recupera profilo e analisi in parallelo
  const [profileRes, analisiRes] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("id", id).single(),
    supabase
      .from("analisi")
      .select("id, stato, semaforo, file_type, numero_anomalie, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile: profileRes.data,
    analisi: analisiRes.data ?? [],
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Recupera utente per email (per il log)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.admin.getUserById(id);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Utente non trovato" },
      { status: 404 }
    );
  }

  // Conta analisi utente per il log
  const { data: analisi } = await supabase
    .from("analisi")
    .select("id")
    .eq("user_id", id);

  const analisiCount = analisi?.length ?? 0;

  // Log GDPR
  const emailHash = await sha256(user.email ?? "");
  await supabase.from("gdpr_deletion_log").insert({
    user_email_hash: emailHash,
    deletion_type: "admin_request",
    items_deleted: {
      analisi_count: analisiCount,
    },
    requested_by: "admin",
    completed_at: new Date().toISOString(),
  });

  // Elimina utente auth (CASCADE elimina profilo e analisi)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Errore nell'eliminazione dell'utente" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
