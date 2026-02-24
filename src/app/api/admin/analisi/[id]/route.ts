import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: analisi, error } = await supabase
    .from("analisi")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !analisi) {
    return NextResponse.json(
      { error: "Analisi non trovata" },
      { status: 404 }
    );
  }

  // Signed URL per il file (1 ora)
  let signedUrl: string | null = null;
  if (analisi.file_url) {
    const { data: urlData } = await supabase.storage
      .from("documenti")
      .createSignedUrl(analisi.file_url, 3600);
    signedUrl = urlData?.signedUrl ?? null;
  }

  // AI usage per questa analisi
  const { data: aiUsage } = await supabase
    .from("ai_usage")
    .select("*")
    .eq("analisi_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    analisi,
    signed_url: signedUrl,
    ai_usage: aiUsage ?? [],
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Recupera file_url prima di cancellare
  const { data: analisi, error: fetchError } = await supabase
    .from("analisi")
    .select("file_url")
    .eq("id", id)
    .single();

  if (fetchError || !analisi) {
    return NextResponse.json(
      { error: "Analisi non trovata" },
      { status: 404 }
    );
  }

  // Cancella file da storage
  if (analisi.file_url) {
    const { error: storageError } = await supabase.storage
      .from("documenti")
      .remove([analisi.file_url]);

    if (storageError) {
      return NextResponse.json(
        { error: "Errore nella cancellazione del file" },
        { status: 500 }
      );
    }
  }

  // Cancella riga da DB (ai_usage si gestisce con ON DELETE SET NULL)
  const { error: deleteError } = await supabase
    .from("analisi")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Errore nella cancellazione dell'analisi" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
