import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, privacyAcceptedAt, termsAcceptedAt, marketingConsent } =
      await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatori" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La password deve avere almeno 6 caratteri" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Esiste già un account con questa email" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    // Create user + profile in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          emailVerified: true,
        },
      });

      await tx.userProfile.create({
        data: {
          id: user.id,
          privacyAcceptedAt: privacyAcceptedAt ? new Date(privacyAcceptedAt) : now,
          termsAcceptedAt: termsAcceptedAt ? new Date(termsAcceptedAt) : now,
          marketingConsent: marketingConsent ?? false,
          marketingConsentAt: marketingConsent ? now : null,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Errore durante la registrazione" },
      { status: 500 }
    );
  }
}
