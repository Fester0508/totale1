-- LavoroChiaro - Log eliminazione GDPR (Art. 30)
-- Registra le eliminazioni senza conservare dati personali

CREATE TABLE gdpr_deletion_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email_hash TEXT NOT NULL,
  deletion_type TEXT NOT NULL CHECK (deletion_type IN ('user_request', 'admin_request', 'auto_expiry')),
  items_deleted JSONB NOT NULL DEFAULT '{}',
  requested_by TEXT NOT NULL CHECK (requested_by IN ('user', 'admin', 'system')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_gdpr_deletion_log_requested_at ON gdpr_deletion_log(requested_at);

-- Solo service_role può accedere
ALTER TABLE gdpr_deletion_log ENABLE ROW LEVEL SECURITY;
