"use server";

import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { PRODUCTS } from "@/lib/products";

/**
 * Creates a Stripe Checkout session for a given product.
 * Handles both one-time payments and subscriptions.
 */
export async function startCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`);
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || headersList.get("referer") || "";

  if (product.stripeMode === "subscription") {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        productId: product.id,
        plan: product.plan,
      },
    });

    return session.client_secret;
  }

  // One-time payment
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      productId: product.id,
      plan: product.plan,
    },
  });

  return session.client_secret;
}
