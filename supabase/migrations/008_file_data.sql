-- Aggiunge colonne per storage inline del file (base64)
-- Necessarie per il flusso di upload che salva il file direttamente nel DB

ALTER TABLE analisi ADD COLUMN IF NOT EXISTS file_data TEXT;
ALTER TABLE analisi ADD COLUMN IF NOT EXISTS file_mime TEXT;
