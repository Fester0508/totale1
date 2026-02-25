import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== "run-migration-008") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Use rpc to run raw SQL - first create the function, then call it
  // Alternative: just try inserting and selecting to verify columns
  const results: string[] = [];

  // Try adding columns via Supabase's postgrest - we need to use the postgres connection
  // Since we can't run raw SQL via REST, let's use a workaround:
  // Create a temporary rpc function via the management API

  // Actually, the simplest approach: use pg directly
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
  });

  try {
    await pool.query("ALTER TABLE analisi ADD COLUMN IF NOT EXISTS file_data TEXT");
    results.push("file_data column added");
    await pool.query("ALTER TABLE analisi ADD COLUMN IF NOT EXISTS file_mime TEXT");
    results.push("file_mime column added");
    await pool.end();
    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    await pool.end();
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
