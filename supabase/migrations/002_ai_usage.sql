-- LavoroChiaro - Tracking utilizzo AI
-- Tabella per logging chiamate AI (token, costi, durata)

CREATE TABLE ai_usage (
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

CREATE INDEX idx_ai_usage_analisi_id ON ai_usage(analisi_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at);
CREATE INDEX idx_ai_usage_modello ON ai_usage(modello);

-- Aggiunta colonna per tracciare inizio elaborazione
ALTER TABLE analisi ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ;

-- RLS: solo service role può accedere
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
