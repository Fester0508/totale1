import { auth } from "@/lib/auth-config";

/**
 * Get the current user session in server components and route handlers.
 * Returns the session object or null if not authenticated.
 */
export async function getSession() {
  return auth();
}

/**
 * Get the current authenticated user.
 * Returns { id, email } or null.
 */
export async function getUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: session.user.id, email: session.user.email! };
}
