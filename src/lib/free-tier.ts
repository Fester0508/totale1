import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const MAX_FREE_FULL = 1; // prima analisi = full access (completa e gratuita)
export const MAX_FREE_USES = process.env.NODE_ENV === "development" ? Infinity : 1;
export const FREE_TIER_COOKIE = "lc_free_tier";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni

interface FreeTierPayload {
  uses: number;
  ids: string[];
}

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_JWT_SECRET non configurato");
  }
  return new TextEncoder().encode(raw || "dev-secret-change-in-production");
}

export async function getFreeTierStatus(
  req: NextRequest
): Promise<FreeTierPayload> {
  const token = req.cookies.get(FREE_TIER_COOKIE)?.value;
  if (!token) return { uses: 0, ids: [] };

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      uses: (payload.uses as number) ?? 0,
      ids: (payload.ids as string[]) ?? [],
    };
  } catch {
    return { uses: 0, ids: [] };
  }
}

export async function setFreeTierCookie(
  response: NextResponse,
  status: FreeTierPayload
): Promise<void> {
  const token = await new SignJWT({
    uses: status.uses,
    ids: status.ids,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());

  response.cookies.set(FREE_TIER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
