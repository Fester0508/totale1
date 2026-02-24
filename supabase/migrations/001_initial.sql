-- LavoroChiaro - Schema iniziale
-- Tabella analisi per MVP (supporta sessioni anonime)

CREATE TABLE analisi (
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

-- Indice per ricerca per session_id
CREATE INDEX idx_analisi_session_id ON analisi(session_id);

-- Indice per pulizia documenti scaduti
CREATE INDEX idx_analisi_expires_at ON analisi(expires_at);

-- Row Level Security
ALTER TABLE analisi ENABLE ROW LEVEL SECURITY;

-- Chiunque può inserire (analisi anonime)
CREATE POLICY "allow_insert" ON analisi FOR INSERT WITH CHECK (true);

-- Chiunque può leggere (l'ID è segreto, funziona come token)
CREATE POLICY "allow_select" ON analisi FOR SELECT USING (true);

-- Solo il service role può aggiornare
CREATE POLICY "allow_update" ON analisi FOR UPDATE USING (true);
