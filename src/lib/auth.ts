import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

let _secret: Uint8Array | null = null;

function getSecret(): Uint8Array {
  if (!_secret) {
    const raw = process.env.ADMIN_JWT_SECRET;
    if (!raw && process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_JWT_SECRET non configurato. Imposta la variabile d'ambiente in produzione."
      );
    }
    _secret = new TextEncoder().encode(raw || "dev-secret-change-in-production");
  }
  return _secret;
}

export const COOKIE_NAME = "admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 ore

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

// Per Server Components e Route Handlers
export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

// Per middleware (usa la request direttamente)
export async function getAdminSessionFromRequest(
  req: NextRequest
): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
