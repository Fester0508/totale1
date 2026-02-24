import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/satispay";

/**
 * Satispay callback -- called via GET when payment status changes.
 * Used to verify payment completion server-side.
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

    // Log payment status for monitoring
    console.log(
      `[Satispay] Callback for payment ${paymentId}: status=${payment.status}, amount=${payment.amount_unit}, metadata=`,
      payment.metadata
    );

    if (payment.status === "ACCEPTED") {
      // Payment successful -- activate the plan for the user
      // TODO: integrate with Supabase to update user subscription
      console.log(
        `[Satispay] Payment ACCEPTED: ${paymentId}, product: ${payment.metadata?.product_id}`
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
