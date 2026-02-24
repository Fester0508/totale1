import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn("[LavoroChiaro] RESEND_API_KEY non configurata. Le email non verranno inviate.");
}

export const resend = apiKey ? new Resend(apiKey) : null;
