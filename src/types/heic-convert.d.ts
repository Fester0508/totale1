declare module "heic-convert" {
  interface HeicConvertOptions {
    buffer: Uint8Array;
    format: "JPEG" | "PNG";
    quality?: number;
  }
  export default function heicConvert(
    options: HeicConvertOptions
  ): Promise<ArrayBuffer>;
}
