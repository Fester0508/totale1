-- LavoroChiaro - Profili utente e consensi GDPR
-- Tabella per tracciare i consensi GDPR (Art. 7) e metadati utente

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Consensi GDPR (Art. 7 - registrare quando il consenso è stato dato)
  privacy_accepted_at TIMESTAMPTZ NOT NULL,
  terms_accepted_at TIMESTAMPTZ NOT NULL,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent_at TIMESTAMPTZ,

  -- Metadati
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice per query admin
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Utenti possono leggere il proprio profilo
CREATE POLICY "user_select_own_profile" ON user_profiles FOR SELECT
  USING (id = auth.uid() OR current_setting('role') = 'service_role');

-- Utenti possono aggiornare il proprio profilo (es. consenso marketing)
CREATE POLICY "user_update_own_profile" ON user_profiles FOR UPDATE
  USING (id = auth.uid() OR current_setting('role') = 'service_role');

-- Insert via service_role o trigger (postgres non è superuser in Supabase managed)
CREATE POLICY "service_role_insert_profile" ON user_profiles FOR INSERT
  WITH CHECK (current_setting('role') = 'service_role' OR current_user = 'postgres');

-- Delete solo via service_role (eliminazione account)
CREATE POLICY "service_role_delete_profile" ON user_profiles FOR DELETE
  USING (current_setting('role') = 'service_role');

-- Trigger: crea automaticamente il profilo quando un utente si registra
-- Nota: COALESCE con cast diretto fallisce se raw_user_meta_data è NULL/vuoto,
-- quindi usiamo variabili intermedie con controlli espliciti
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Backfill: crea profili per utenti già registrati
INSERT INTO user_profiles (id, privacy_accepted_at, terms_accepted_at, marketing_consent)
SELECT
  id,
  created_at,
  created_at,
  false
FROM auth.users
ON CONFLICT (id) DO NOTHING;
