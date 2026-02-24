import sharp from "sharp";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
    return {
      valid: false,
      error: "Formato non supportato. Accettiamo PDF, JPG, PNG e HEIC.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Il file supera i 10MB. Prova con un file pi\u00f9 piccolo.",
    };
  }

  return { valid: true };
}

export async function convertHeicToJpeg(buffer: Buffer): Promise<Buffer> {
  // heic-convert is ESM only, dynamic import required
  const heicConvert = (await import("heic-convert")).default;
  const result = await heicConvert({
    buffer: new Uint8Array(buffer),
    format: "JPEG",
    quality: 0.9,
  });
  return Buffer.from(result);
}

export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
}

export function getFileExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ext;
}

export function isHeic(filename: string, mimeType: string): boolean {
  return (
    mimeType === "image/heic" ||
    mimeType === "image/heif" ||
    filename.toLowerCase().endsWith(".heic") ||
    filename.toLowerCase().endsWith(".heif")
  );
}

export function isPdf(mimeType: string): boolean {
  return mimeType === "application/pdf";
}
