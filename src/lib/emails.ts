import { resend } from "./resend";

const FROM_EMAIL = "LavoroChiaro <info@lavoroinchiaro.it>";

function welcomeHtml(displayName: string): string {
  const year = new Date().getFullYear();
  return [
    '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>',
    '<body style="margin:0;padding:0;background-color:#e8e4df;font-family:Courier New,Courier,monospace;">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e4df;padding:40px 20px;"><tr><td align="center">',
    '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f2efeb;border-radius:6px;overflow:hidden;">',
    '<tr><td style="background-color:#3d4f6f;padding:32px 40px;text-align:center;">',
    '<span style="font-size:20px;font-weight:bold;letter-spacing:3px;color:#e8e4df;">LAVORO</span>',
    '<span style="font-size:16px;color:#9a9a9a;margin:0 6px;">IN</span>',
    '<span style="font-size:20px;font-weight:bold;letter-spacing:3px;color:#b87333;">CHIARO</span>',
    '</td></tr>',
    '<tr><td style="padding:40px;">',
    '<h1 style="margin:0 0 16px;font-size:24px;font-weight:bold;color:#3d4f6f;">Benvenuto, ' + displayName + '.</h1>',
    '<div style="width:48px;height:2px;background-color:#b87333;margin:0 0 24px;"></div>',
    '<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3d4f6f;">Il tuo account su LavoroChiaro e stato creato con successo. Ora puoi caricare la tua busta paga e scoprire in 30 secondi se contiene errori o anomalie.</p>',
    '<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3d4f6f;">Il 67% dei cedolini italiani contiene almeno un errore. Controlla prima di fidarti.</p>',
    '<table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;"><tr><td style="background-color:#3d4f6f;border-radius:3px;">',
    '<a href="https://lavoroinchiaro.it/#analizza" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:bold;color:#e8e4df;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Analizza la tua busta paga</a>',
    '</td></tr></table>',
    '<p style="margin:0 0 8px;font-size:13px;color:#7a7a7a;line-height:1.5;">Ecco cosa puoi fare:</p>',
    '<ul style="margin:0 0 24px;padding-left:20px;font-size:13px;color:#3d4f6f;line-height:1.8;">',
    '<li>Carica un cedolino (PDF, foto o scansione)</li>',
    '<li>Ricevi un referto dettagliato con errori e anomalie</li>',
    '<li>Scopri quanto potresti recuperare</li></ul>',
    '</td></tr>',
    '<tr><td style="padding:24px 40px;border-top:1px solid #cdc7c0;">',
    '<p style="margin:0 0 8px;font-size:11px;color:#9a9a9a;text-align:center;line-height:1.5;">LavoroChiaro non sostituisce un consulente del lavoro. Le analisi hanno valore informativo.</p>',
    '<p style="margin:0;font-size:11px;color:#9a9a9a;text-align:center;">&copy; ' + year + ' LavoroChiaro &mdash; info@lavoroinchiaro.it</p>',
    '</td></tr></table></td></tr></table></body></html>',
  ].join("");
}

function paymentHtml(planName: string, amount: string): string {
  const year = new Date().getFullYear();
  return [
    '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>',
    '<body style="margin:0;padding:0;background-color:#e8e4df;font-family:Courier New,Courier,monospace;">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8e4df;padding:40px 20px;"><tr><td align="center">',
    '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#f2efeb;border-radius:6px;overflow:hidden;">',
    '<tr><td style="background-color:#3d4f6f;padding:32px 40px;text-align:center;">',
    '<span style="font-size:20px;font-weight:bold;letter-spacing:3px;color:#e8e4df;">LAVORO</span>',
    '<span style="font-size:16px;color:#9a9a9a;margin:0 6px;">IN</span>',
    '<span style="font-size:20px;font-weight:bold;letter-spacing:3px;color:#b87333;">CHIARO</span>',
    '</td></tr>',
    '<tr><td style="padding:40px;">',
    '<h1 style="margin:0 0 16px;font-size:24px;font-weight:bold;color:#3d4f6f;">Pagamento confermato</h1>',
    '<div style="width:48px;height:2px;background-color:#b87333;margin:0 0 24px;"></div>',
    '<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3d4f6f;">Il tuo pagamento di <strong>' + amount + '</strong> per il piano <strong>' + planName + '</strong> e stato ricevuto con successo.</p>',
    '<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3d4f6f;">Il tuo piano e ora attivo. Puoi iniziare subito ad usare tutte le funzionalita incluse.</p>',
    '<table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;"><tr><td style="background-color:#3d4f6f;border-radius:3px;">',
    '<a href="https://lavoroinchiaro.it/#analizza" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:bold;color:#e8e4df;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Vai a LavoroChiaro</a>',
    '</td></tr></table>',
    '</td></tr>',
    '<tr><td style="padding:24px 40px;border-top:1px solid #cdc7c0;">',
    '<p style="margin:0;font-size:11px;color:#9a9a9a;text-align:center;">&copy; ' + year + ' LavoroChiaro &mdash; info@lavoroinchiaro.it</p>',
    '</td></tr></table></td></tr></table></body></html>',
  ].join("");
}

export async function sendWelcomeEmail(to: string, nome?: string) {
  if (!resend) {
    console.warn("[LavoroChiaro] Resend non configurato, email di benvenuto non inviata a:", to);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Benvenuto su LavoroChiaro",
    html: welcomeHtml(nome || "utente"),
  });

  if (error) {
    console.error("[LavoroChiaro] Errore invio email benvenuto:", error);
    return null;
  }
  return data;
}

export async function sendPaymentConfirmationEmail(
  to: string,
  planName: string,
  amount: string
) {
  if (!resend) {
    console.warn("[LavoroChiaro] Resend non configurato, email conferma pagamento non inviata a:", to);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Pagamento confermato - Piano " + planName,
    html: paymentHtml(planName, amount),
  });

  if (error) {
    console.error("[LavoroChiaro] Errore invio email conferma pagamento:", error);
    return null;
  }
  return data;
}
