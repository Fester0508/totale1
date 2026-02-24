import { NextRequest, NextResponse } from "next/server";
import { createPayment, getPaymentUrl } from "@/lib/satispay";
import { getProductById } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // Server-side price lookup -- prevents price tampering
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check Satispay configuration
    if (!process.env.SATISPAY_KEY_ID || !process.env.SATISPAY_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Satispay non configurato. Contatta il supporto." },
        { status: 503 }
      );
    }

    const origin = request.headers.get("origin") || "https://lavoroinchiaro.it";
    const externalCode = `LC-${product.id}-${Date.now()}`;

    const payment = await createPayment({
      flow: "MATCH_CODE",
      amount_unit: product.priceInCents,
      currency: "EUR",
      external_code: externalCode,
      callback_url: `${origin}/api/payments/callback?payment_id={uuid}`,
      redirect_url: `${origin}/pagamento/completato?payment_id={uuid}`,
      metadata: {
        product_id: product.id,
        product_name: product.name,
      },
    });

    const paymentUrl = getPaymentUrl(
      payment.id,
      `${origin}/pagamento/completato?payment_id=${payment.id}`
    );

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl,
      codeIdentifier: payment.code_identifier,
      status: payment.status,
    });
  } catch (error) {
    console.error("[Satispay] Payment creation error:", error);
    return NextResponse.json(
      { error: "Errore nella creazione del pagamento" },
      { status: 500 }
    );
  }
}
