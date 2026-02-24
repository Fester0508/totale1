import crypto from "crypto";

// Satispay Business API endpoints
const SATISPAY_BASE_URL =
  process.env.SATISPAY_SANDBOX === "true"
    ? "https://staging.authservices.satispay.com"
    : "https://authservices.satispay.com";

const SATISPAY_API_PATH = "/g_business/v1";

/**
 * Sign a request for the Satispay API using RSA-SHA256.
 * Follows the HTTP Signatures specification used by Satispay.
 */
function signRequest(
  method: string,
  path: string,
  body: string,
  host: string
): {
  authorization: string;
  date: string;
  digest: string;
} {
  const privateKeyPem = process.env.SATISPAY_PRIVATE_KEY;
  const keyId = process.env.SATISPAY_KEY_ID;

  if (!privateKeyPem || !keyId) {
    throw new Error("SATISPAY_PRIVATE_KEY and SATISPAY_KEY_ID are required");
  }

  // 1. Create Digest of the body
  const bodyHash = crypto.createHash("sha256").update(body).digest("base64");
  const digest = `SHA-256=${bodyHash}`;

  // 2. Create the Date header
  const date = new Date().toUTCString();

  // 3. Create the signing string (message)
  const signingString = [
    `(request-target): ${method.toLowerCase()} ${path}`,
    `host: ${host}`,
    `date: ${date}`,
    `digest: ${digest}`,
  ].join("\n");

  // 4. Sign the message with RSA-SHA256
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingString);
  const signature = signer.sign(
    privateKeyPem.replace(/\\n/g, "\n"),
    "base64"
  );

  // 5. Compose the Authorization header
  const authorization = `Signature keyId="${keyId}", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="${signature}"`;

  return { authorization, date, digest };
}

export interface SatispayPaymentRequest {
  flow: "MATCH_CODE" | "REFUND";
  amount_unit: number; // amount in cents
  currency: "EUR";
  external_code?: string;
  callback_url?: string;
  redirect_url?: string;
  metadata?: Record<string, string>;
  expiration_date?: string;
  parent_payment_uid?: string;
}

export interface SatispayPaymentResponse {
  id: string;
  code_identifier?: string;
  type: string;
  amount_unit: number;
  currency: string;
  status: "PENDING" | "ACCEPTED" | "CANCELED";
  expired: boolean;
  metadata?: Record<string, string>;
  redirect_url?: string;
  insert_date: string;
  expire_date: string;
}

/**
 * Create a Satispay payment.
 * Uses MATCH_CODE flow for online payments.
 * Returns the payment object including the redirect URL.
 */
export async function createPayment(
  request: SatispayPaymentRequest
): Promise<SatispayPaymentResponse> {
  const path = `${SATISPAY_API_PATH}/payments`;
  const host = SATISPAY_BASE_URL.replace("https://", "");
  const body = JSON.stringify(request);

  const { authorization, date, digest } = signRequest(
    "POST",
    path,
    body,
    host
  );

  const response = await fetch(`${SATISPAY_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Host: host,
      Date: date,
      Digest: digest,
      Authorization: authorization,
      "x-satispay-devicetype": "ECOMMERCE_PLUGIN",
      "x-satispay-appn": "LavoroInChiaro",
      "x-satispay-appv": "1.0.0",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Satispay API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Get a Satispay payment by ID.
 */
export async function getPayment(
  paymentId: string
): Promise<SatispayPaymentResponse> {
  const path = `${SATISPAY_API_PATH}/payments/${paymentId}`;
  const host = SATISPAY_BASE_URL.replace("https://", "");
  const body = "";

  const { authorization, date, digest } = signRequest(
    "GET",
    path,
    body,
    host
  );

  const response = await fetch(`${SATISPAY_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Host: host,
      Date: date,
      Digest: digest,
      Authorization: authorization,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Satispay API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Get the Satispay Online Payment redirect URL.
 * This URL opens the Satispay app or web page for the user to complete the payment.
 */
export function getPaymentUrl(paymentId: string, redirectUrl: string): string {
  const baseOnlineUrl =
    process.env.SATISPAY_SANDBOX === "true"
      ? "https://staging.online.satispay.com"
      : "https://online.satispay.com";

  return `${baseOnlineUrl}/pay/${paymentId}?redirect_url=${encodeURIComponent(redirectUrl)}`;
}
