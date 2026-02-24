-- LavoroChiaro - Funzioni SQL per aggregazioni admin

-- Top CCNL per frequenza
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

-- Top anomalie per frequenza
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
