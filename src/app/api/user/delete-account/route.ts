import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST() {
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 1. Recupera tutte le analisi dell'utente per i file
  const { data: analisi } = await supabase
    .from("analisi")
    .select("id, file_url")
    .eq("user_id", user.id);

  const fileUrls = analisi?.map((a) => a.file_url).filter(Boolean) ?? [];
  const analisiCount = analisi?.length ?? 0;

  // 2. Elimina file da Supabase Storage
  if (fileUrls.length > 0) {
    await supabase.storage.from("documenti").remove(fileUrls);
  }

  // 3. Scrivi nel log GDPR (prima di eliminare l'utente)
  const emailHash = await sha256(user.email ?? "");
  await supabase.from("gdpr_deletion_log").insert({
    user_email_hash: emailHash,
    deletion_type: "user_request",
    items_deleted: {
      analisi_count: analisiCount,
      files_count: fileUrls.length,
    },
    requested_by: "user",
    completed_at: new Date().toISOString(),
  });

  // 4. Elimina l'utente auth (CASCADE elimina user_profiles e analisi)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Errore nell'eliminazione dell'account" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
