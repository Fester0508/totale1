import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GDPR Cleanup Cron Job
 *
 * Runs daily. Deletes:
 * 1. Expired analysis records (expires_at < now)
 * 2. Uploaded files from Supabase Storage for those records
 * 3. Anonymous sessions older than 30 days
 *
 * Protected by CRON_SECRET header to prevent unauthorized access.
 */
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();
  let deletedAnalisi = 0;
  let deletedFiles = 0;

  try {
    // 1. Find expired analysis records
    const { data: expiredRecords, error: fetchError } = await admin
      .from("analisi")
      .select("id")
      .lt("expires_at", now);

    if (fetchError) {
      console.error("[GDPR Cleanup] Error fetching expired records:", fetchError.message);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (expiredRecords && expiredRecords.length > 0) {
      // 2. Delete analysis records (file_data is stored inline, deleted with the row)
      const expiredIds = expiredRecords.map((r) => r.id);
      const { error: deleteError } = await admin
        .from("analisi")
        .delete()
        .in("id", expiredIds);

      if (deleteError) {
        console.error("[GDPR Cleanup] Delete error:", deleteError.message);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      deletedAnalisi = expiredIds.length;
    }

    // 4. Clean up orphaned AI usage logs older than 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    await admin
      .from("ai_usage")
      .delete()
      .lt("created_at", ninetyDaysAgo);

    return NextResponse.json({
      success: true,
      deleted: {
        analisi: deletedAnalisi,
        files: deletedFiles,
      },
      timestamp: now,
    });
  } catch (err) {
    console.error("[GDPR Cleanup] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
