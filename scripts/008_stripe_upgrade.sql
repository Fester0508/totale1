-- Migration 008: Stripe upgrade + UserPlan enum + storage_path
-- Replaces Satispay with Stripe, migrates tiers to new UserPlan enum

-- 1. Migrate user_profiles.tier to new UserPlan enum
-- First, update existing data to new values
UPDATE user_profiles SET tier = 'FREE_FIRST' WHERE tier = 'free' OR tier IS NULL;
UPDATE user_profiles SET tier = 'SIMPLE_SUBSCRIPTION' WHERE tier = 'sub_099';
UPDATE user_profiles SET tier = 'ONE_SHOT_PRO' WHERE tier IN ('pay_per', 'pro_999');

-- Drop old constraint if exists, add new one
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_tier_check;
ALTER TABLE user_profiles ALTER COLUMN tier SET DEFAULT 'FREE_FIRST';
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_tier_check
  CHECK (tier IN ('FREE_FIRST', 'SIMPLE_SUBSCRIPTION', 'ONE_SHOT_PRO', 'CONSULTING_ADDON'));

-- 2. Add Stripe columns to user_profiles (replace Satispay)
ALTER TABLE user_profiles DROP COLUMN IF EXISTS satispay_payment_id;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_min_end_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';

-- Add constraint for subscription_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_subscription_status_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_subscription_status_check
      CHECK (subscription_status IN ('none', 'active', 'past_due', 'canceled', 'trialing'));
  END IF;
END $$;

-- 3. Add storage_path to analisi (for Supabase Storage migration)
ALTER TABLE analisi ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- 4. Update payments table for Stripe
ALTER TABLE payments DROP COLUMN IF EXISTS satispay_payment_id;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'one_shot';

-- Add constraint for product_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_product_type_check'
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT payments_product_type_check
      CHECK (product_type IN ('one_shot', 'subscription', 'consulting'));
  END IF;
END $$;

-- 5. Subscriptions table for tracking
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('SIMPLE_SUBSCRIPTION', 'CONSULTING_ADDON')),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  min_end_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS: only service_role can manage subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_role_subscriptions' AND tablename = 'subscriptions'
  ) THEN
    CREATE POLICY "service_role_subscriptions" ON subscriptions FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- 6. Drop old Satispay index, add Stripe index
DROP INDEX IF EXISTS idx_payments_satispay_id;
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);

-- 7. Create Supabase Storage bucket for payslips (handled via Supabase dashboard or API)
-- Note: The bucket 'payslips' should be created as PRIVATE in Supabase Dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payslips', 'payslips', false)
-- ON CONFLICT (id) DO NOTHING;
