import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/satispay";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Satispay callback -- called via GET when payment status changes.
 * Verifies payment and activates plan / unlocks analysis.
 */
export async function GET(request: NextRequest) {
  try {
    const paymentId = request.nextUrl.searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "payment_id is required" },
        { status: 400 }
      );
    }

    if (!process.env.SATISPAY_KEY_ID || !process.env.SATISPAY_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Satispay non configurato" },
        { status: 503 }
      );
    }

    const payment = await getPayment(paymentId);

    console.log(
      `[Satispay] Callback for payment ${paymentId}: status=${payment.status}, amount=${payment.amount_unit}`
    );

    if (payment.status === "ACCEPTED") {
      const admin = createAdminClient();
      const productId = payment.metadata?.product_id;
      const analisiId = payment.metadata?.analisi_id;
      const userId = payment.metadata?.user_id;

      // 1. Log the payment in the audit table
      await admin.from("payments").insert({
        user_id: userId || null,
        analisi_id: analisiId || null,
        satispay_payment_id: payment.id,
        product_id: productId || "unknown",
        amount_cents: payment.amount_unit,
        status: "accepted",
        metadata: payment.metadata || {},
      });

      // 2. Handle per-product logic
      if (productId === "pay-per-error") {
        // Unlock the specific analysis
        if (analisiId) {
          await admin
            .from("analisi")
            .update({ access_level: "full" })
            .eq("id", analisiId);
        }
      } else if (productId === "ultra-low" || productId === "pro-chatbot") {
        // Update user subscription tier
        if (userId) {
          const tier = productId === "ultra-low" ? "sub_099" : "pro_999";
          await admin
            .from("user_profiles")
            .update({
              tier,
              satispay_payment_id: payment.id,
            })
            .eq("id", userId);
        }
      }

      console.log(
        `[Satispay] Payment ACCEPTED: ${paymentId}, product: ${productId}, analisi: ${analisiId}, user: ${userId}`
      );
    }

    return NextResponse.json({
      status: payment.status,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("[Satispay] Callback error:", error);
    return NextResponse.json(
      { error: "Errore nel callback" },
      { status: 500 }
    );
  }
}
