import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: NextRequest) {
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json();
  const marketing_consent = Boolean(body.marketing_consent);

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("user_profiles")
    .update({
      marketing_consent,
      marketing_consent_at: marketing_consent
        ? new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Errore nell'aggiornamento del consenso" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, marketing_consent });
}
