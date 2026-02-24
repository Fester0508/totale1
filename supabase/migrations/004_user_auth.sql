-- LavoroChiaro - Autenticazione Utenti
-- Aggiunta colonna user_id alla tabella analisi per associare le analisi agli utenti

-- Aggiungi user_id (nullable per le analisi storiche pre-auth)
ALTER TABLE analisi ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Indice per dashboard utente (le mie analisi)
CREATE INDEX IF NOT EXISTS idx_analisi_user_id ON analisi(user_id);

-- Aggiorna RLS: solo l'utente proprietario puo' leggere le proprie analisi
DROP POLICY IF EXISTS "allow_select" ON analisi;
CREATE POLICY "user_select_own" ON analisi FOR SELECT
  USING (
    user_id = auth.uid()
    OR auth.role() = 'service_role'
  );

-- Inserimento: solo utenti autenticati (o service role)
DROP POLICY IF EXISTS "allow_insert" ON analisi;
CREATE POLICY "user_insert_own" ON analisi FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR auth.role() = 'service_role'
  );

-- Aggiornamento: solo service role (le API routes usano service role key)
DROP POLICY IF EXISTS "allow_update" ON analisi;
CREATE POLICY "service_role_update" ON analisi FOR UPDATE
  USING (auth.role() = 'service_role');
