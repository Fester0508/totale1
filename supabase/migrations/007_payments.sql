-- 007_payments.sql
-- Tier utente e pagamenti Satispay

-- Tier utente
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free'
  CHECK (tier IN ('free', 'pay_per', 'sub_099', 'pro_999'));
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS satispay_payment_id TEXT;

-- Access level per analisi (preview = free, full = pagato)
ALTER TABLE analisi ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'preview'
  CHECK (access_level IN ('preview', 'full'));

-- Tabella pagamenti per audit trail
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  analisi_id UUID REFERENCES analisi(id) ON DELETE SET NULL,
  satispay_payment_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  amount_cents INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_satispay_id ON payments(satispay_payment_id);
