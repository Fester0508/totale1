-- ============================================
-- LavoroChiaro - Combined Migration Script
-- Runs all migrations 001-007 in order
-- ============================================

-- ======= 001_initial.sql =======
CREATE TABLE IF NOT EXISTS analisi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  stato TEXT DEFAULT 'processing' CHECK (stato IN ('processing', 'completed', 'error')),
  dati_estratti JSONB,
  risultato JSONB,
  semaforo TEXT CHECK (semaforo IN ('verde', 'giallo', 'rosso')),
  numero_anomalie INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_analisi_session_id ON analisi(session_id);
CREATE INDEX IF NOT EXISTS idx_analisi_expires_at ON analisi(expires_at);

ALTER TABLE analisi ENABLE ROW LEVEL SECURITY;

-- ======= 002_ai_usage.sql =======
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analisi_id UUID REFERENCES analisi(id) ON DELETE SET NULL,
  modello TEXT NOT NULL,
  fase TEXT NOT NULL CHECK (fase IN ('ocr', 'analisi')),
  tokens_input INT NOT NULL DEFAULT 0,
  tokens_output INT NOT NULL DEFAULT 0,
  costo_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
  durata_ms INT,
  errore TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_analisi_id ON ai_usage(analisi_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_modello ON ai_usage(modello);

ALTER TABLE analisi ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ;

ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- ======= 003_admin_functions.sql =======
CREATE OR REPLACE FUNCTION top_ccnl(limit_n INT DEFAULT 10)
RETURNS TABLE(ccnl TEXT, totale BIGINT) AS $$
  SELECT
    risultato -> 'dati_anagrafici' ->> 'ccnl' AS ccnl,
    COUNT(*) AS totale
  FROM analisi
  WHERE risultato IS NOT NULL
    AND risultato -> 'dati_anagrafici' ->> 'ccnl' IS NOT NULL
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT limit_n;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION top_anomalie(limit_n INT DEFAULT 10)
RETURNS TABLE(titolo TEXT, totale BIGINT) AS $$
  SELECT
    anomalia ->> 'titolo' AS titolo,
    COUNT(*) AS totale
  FROM analisi,
       jsonb_array_elements(risultato -> 'anomalie') AS anomalia
  WHERE risultato IS NOT NULL
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT limit_n;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ======= 004_user_auth.sql =======
ALTER TABLE analisi ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_analisi_user_id ON analisi(user_id);

-- RLS policies that support BOTH anonymous (user_id IS NULL) and authenticated users
DROP POLICY IF EXISTS "allow_select" ON analisi;
DROP POLICY IF EXISTS "user_select_own" ON analisi;
CREATE POLICY "analisi_select" ON analisi FOR SELECT
  USING (
    user_id IS NULL
    OR user_id = auth.uid()
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "allow_insert" ON analisi;
DROP POLICY IF EXISTS "user_insert_own" ON analisi;
CREATE POLICY "analisi_insert" ON analisi FOR INSERT
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "allow_update" ON analisi;
DROP POLICY IF EXISTS "service_role_update" ON analisi;
CREATE POLICY "analisi_update" ON analisi FOR UPDATE
  USING (auth.role() = 'service_role');

-- ======= 005_user_profiles.sql =======
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  privacy_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_select_own_profile" ON user_profiles;
CREATE POLICY "user_select_own_profile" ON user_profiles FOR SELECT
  USING (id = auth.uid() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "user_update_own_profile" ON user_profiles;
CREATE POLICY "user_update_own_profile" ON user_profiles FOR UPDATE
  USING (id = auth.uid() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_role_insert_profile" ON user_profiles;
CREATE POLICY "service_role_insert_profile" ON user_profiles FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR id = auth.uid());

DROP POLICY IF EXISTS "service_role_delete_profile" ON user_profiles;
CREATE POLICY "service_role_delete_profile" ON user_profiles FOR DELETE
  USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_privacy timestamptz := NOW();
  v_terms timestamptz := NOW();
  v_marketing boolean := false;
BEGIN
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    IF NEW.raw_user_meta_data->>'privacy_accepted_at' IS NOT NULL
       AND length(NEW.raw_user_meta_data->>'privacy_accepted_at') > 0 THEN
      v_privacy := (NEW.raw_user_meta_data->>'privacy_accepted_at')::timestamptz;
    END IF;
    IF NEW.raw_user_meta_data->>'terms_accepted_at' IS NOT NULL
       AND length(NEW.raw_user_meta_data->>'terms_accepted_at') > 0 THEN
      v_terms := (NEW.raw_user_meta_data->>'terms_accepted_at')::timestamptz;
    END IF;
    IF NEW.raw_user_meta_data->>'marketing_consent' IS NOT NULL THEN
      v_marketing := COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false);
    END IF;
  END IF;

  INSERT INTO public.user_profiles (id, privacy_accepted_at, terms_accepted_at, marketing_consent, marketing_consent_at)
  VALUES (NEW.id, v_privacy, v_terms, v_marketing, CASE WHEN v_marketing THEN NOW() ELSE NULL END);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ======= 006_gdpr_deletion_log.sql =======
CREATE TABLE IF NOT EXISTS gdpr_deletion_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email_hash TEXT NOT NULL,
  deletion_type TEXT NOT NULL CHECK (deletion_type IN ('user_request', 'admin_request', 'auto_expiry')),
  items_deleted JSONB NOT NULL DEFAULT '{}',
  requested_by TEXT NOT NULL CHECK (requested_by IN ('user', 'admin', 'system')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_gdpr_deletion_log_requested_at ON gdpr_deletion_log(requested_at);

ALTER TABLE gdpr_deletion_log ENABLE ROW LEVEL SECURITY;

-- ======= 007_payments.sql =======
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free'
  CHECK (tier IN ('free', 'pay_per', 'sub_099', 'pro_999'));
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS satispay_payment_id TEXT;

ALTER TABLE analisi ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'preview'
  CHECK (access_level IN ('preview', 'full'));

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
DROP POLICY IF EXISTS "service_role_payments" ON payments;
CREATE POLICY "service_role_payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_satispay_id ON payments(satispay_payment_id);

-- Storage bucket creation handled separately via Supabase API (see create-storage-bucket.mjs)
