import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";
import { timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPw = process.env.ADMIN_PASSWORD;

  if (!adminPw || !password) {
    return NextResponse.json(
      { error: "Credenziali mancanti" },
      { status: 400 }
    );
  }

  // Confronto timing-safe
  const a = Buffer.from(password);
  const b = Buffer.from(adminPw);
  const match = a.length === b.length && timingSafeEqual(a, b);

  if (!match) {
    return NextResponse.json({ error: "Password errata" }, { status: 401 });
  }

  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
