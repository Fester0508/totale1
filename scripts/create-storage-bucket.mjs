import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase.storage.createBucket("documenti", {
  public: false,
  fileSizeLimit: 10485760, // 10MB
  allowedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
  ],
});

if (error && error.message?.includes("already exists")) {
  console.log("Bucket 'documenti' already exists - OK");
} else if (error) {
  console.error("Error creating bucket:", error.message);
  process.exit(1);
} else {
  console.log("Bucket 'documenti' created successfully:", data);
}
