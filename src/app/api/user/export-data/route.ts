import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Recupera profilo utente
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Recupera tutte le analisi dell'utente
  const { data: analisi } = await supabase
    .from("analisi")
    .select(
      "id, file_type, stato, semaforo, numero_anomalie, dati_estratti, risultato, created_at, expires_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const exportData = {
    esportazione: {
      data_esportazione: new Date().toISOString(),
      formato: "GDPR Art. 20 - Diritto alla portabilità dei dati",
      servizio: "LavoroChiaro",
    },
    profilo: {
      email: user.email,
      registrato_il: user.created_at,
      consenso_privacy: profile?.privacy_accepted_at ?? null,
      consenso_termini: profile?.terms_accepted_at ?? null,
      consenso_marketing: profile?.marketing_consent ?? false,
      consenso_marketing_data: profile?.marketing_consent_at ?? null,
    },
    analisi:
      analisi?.map((a) => ({
        id: a.id,
        data_creazione: a.created_at,
        data_scadenza: a.expires_at,
        tipo_file: a.file_type,
        stato: a.stato,
        semaforo: a.semaforo,
        numero_anomalie: a.numero_anomalie,
        dati_estratti: a.dati_estratti,
        risultato: a.risultato,
      })) ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="lavorochiaro-dati-${Date.now()}.json"`,
    },
  });
}
