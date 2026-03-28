import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * GDPR Cleanup Cron Job
 *
 * Runs daily. Deletes:
 * 1. Expired analysis records (expires_at < now)
 * 2. Uploaded files from local storage for those records
 * 3. Orphaned AI usage logs older than 90 days
 *
 * Protected by CRON_SECRET header to prevent unauthorized access.
 */
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let deletedAnalisi = 0;
  let deletedFiles = 0;

  try {
    // 1. Find expired analysis records
    const expiredRecords = await prisma.analisi.findMany({
      where: { expiresAt: { lt: now } },
      select: { id: true, storagePath: true },
    });

    if (expiredRecords.length > 0) {
      // 2. Delete local files for expired records
      const uploadDir = process.env.UPLOAD_DIR || "/tmp/uploads";
      for (const record of expiredRecords) {
        if (record.storagePath) {
          try {
            await fs.unlink(path.join(uploadDir, record.storagePath));
            deletedFiles++;
          } catch {
            // File may already be deleted
          }
        }
      }

      // 3. Delete analysis records
      const expiredIds = expiredRecords.map((r) => r.id);
      await prisma.analisi.deleteMany({
        where: { id: { in: expiredIds } },
      });
      deletedAnalisi = expiredIds.length;
    }

    // 4. Clean up orphaned AI usage logs older than 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    await prisma.aiUsage.deleteMany({
      where: { createdAt: { lt: ninetyDaysAgo } },
    });

    return NextResponse.json({
      success: true,
      deleted: {
        analisi: deletedAnalisi,
        files: deletedFiles,
      },
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error("[GDPR Cleanup] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
