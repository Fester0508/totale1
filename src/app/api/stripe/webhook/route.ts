import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const plan = session.metadata?.plan;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!customerId || !plan) break;

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) {
          console.error("No user found for customer:", customerId);
          break;
        }

        // Update user plan
        const updateData: Record<string, unknown> = {
          tier: plan,
          updated_at: new Date().toISOString(),
        };

        if (subscriptionId) {
          updateData.stripe_subscription_id = subscriptionId;
          updateData.subscription_status = "active";
        }

        await supabase
          .from("user_profiles")
          .update(updateData)
          .eq("id", profile.id);

        // Record payment
        await supabase.from("payments").insert({
          user_id: profile.id,
          amount_cents: session.amount_total || 0,
          currency: session.currency || "eur",
          status: "completed",
          stripe_session_id: session.id,
          product_id: session.metadata?.productId,
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) break;

        await supabase
          .from("user_profiles")
          .update({
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        // Update subscriptions table
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: profile.id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "stripe_subscription_id" });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) break;

        // Check if they have a min_end_at that hasn't passed
        const now = new Date();
        const { data: currentProfile } = await supabase
          .from("user_profiles")
          .select("subscription_min_end_at")
          .eq("id", profile.id)
          .single();

        const minEnd = currentProfile?.subscription_min_end_at
          ? new Date(currentProfile.subscription_min_end_at)
          : null;

        // Downgrade to FREE_FIRST
        await supabase
          .from("user_profiles")
          .update({
            tier: minEnd && minEnd > now ? undefined : "FREE_FIRST",
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (!customerId) break;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) break;

        await supabase.from("payments").insert({
          user_id: profile.id,
          amount_cents: invoice.amount_paid || 0,
          currency: invoice.currency || "eur",
          status: "completed",
          stripe_session_id: invoice.id,
          product_id: "invoice-renewal",
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (!customerId) break;

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) break;

        await supabase
          .from("user_profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error(`Error processing webhook event ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
