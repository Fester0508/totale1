import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const body = await request.json();
  const marketing_consent = Boolean(body.marketing_consent);

  try {
    await prisma.userProfile.update({
      where: { id: user.id },
      data: {
        marketingConsent: marketing_consent,
        marketingConsentAt: marketing_consent ? new Date() : null,
        updatedAt: new Date(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Errore nell'aggiornamento del consenso" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, marketing_consent });
}
