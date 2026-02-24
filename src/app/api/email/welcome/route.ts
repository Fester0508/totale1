import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emails";

export async function POST(req: NextRequest) {
  try {
    const { email, nome } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email richiesta" },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail(email, nome);

    if (!result) {
      return NextResponse.json(
        { error: "Impossibile inviare email. Resend non configurato." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    console.error("[LavoroChiaro] Errore API welcome email:", err);
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
  }
}
