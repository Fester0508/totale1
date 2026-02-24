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

  // AI usage per questa analisi
  const { data: aiUsage } = await supabase
    .from("ai_usage")
    .select("*")
    .eq("analisi_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    analisi,
    ai_usage: aiUsage ?? [],
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Cancella riga da DB (file_data inline, ai_usage ON DELETE SET NULL)
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
