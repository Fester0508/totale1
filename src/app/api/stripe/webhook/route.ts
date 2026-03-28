import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
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
        const profile = await prisma.userProfile.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!profile) {
          console.error("No user found for customer:", customerId);
          break;
        }

        // Update user plan
        const updateData: Record<string, unknown> = {
          tier: plan,
          updatedAt: new Date(),
        };

        if (subscriptionId) {
          updateData.stripeSubscriptionId = subscriptionId;
          updateData.subscriptionStatus = "active";
        }

        await prisma.userProfile.update({
          where: { id: profile.id },
          data: updateData,
        });

        // Record payment
        await prisma.payment.create({
          data: {
            userId: profile.id,
            amountCents: session.amount_total || 0,
            currency: session.currency || "eur",
            status: "completed",
            stripeSessionId: session.id,
            productId: session.metadata?.productId || "checkout",
          },
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

        const profile = await prisma.userProfile.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!profile) break;

        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            subscriptionStatus: subscription.status,
            updatedAt: new Date(),
          },
        });

        // Update subscriptions table
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          update: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            updatedAt: new Date(),
          },
          create: {
            userId: profile.id,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const profile = await prisma.userProfile.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!profile) break;

        // Check if they have a min_end_at that hasn't passed
        const now = new Date();
        const minEnd = profile.subscriptionMinEndAt;

        // Downgrade to FREE_FIRST
        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            tier: minEnd && minEnd > now ? undefined : "FREE_FIRST",
            subscriptionStatus: "canceled",
            updatedAt: new Date(),
          },
        });

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "canceled",
            canceledAt: new Date(),
            updatedAt: new Date(),
          },
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (!customerId) break;

        const profile = await prisma.userProfile.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!profile) break;

        await prisma.payment.create({
          data: {
            userId: profile.id,
            amountCents: invoice.amount_paid || 0,
            currency: invoice.currency || "eur",
            status: "completed",
            stripeSessionId: invoice.id,
            productId: "invoice-renewal",
          },
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

        const profile = await prisma.userProfile.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!profile) break;

        await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            subscriptionStatus: "past_due",
            updatedAt: new Date(),
          },
        });

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
