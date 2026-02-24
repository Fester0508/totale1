import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  // Check if bucket already exists
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error("Error listing buckets:", listErr.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.id === "documenti");
  if (exists) {
    console.log("Bucket 'documenti' already exists. Skipping creation.");
    return;
  }

  const { data, error } = await supabase.storage.createBucket("documenti", {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
    ],
  });

  if (error) {
    console.error("Error creating bucket:", error.message);
    process.exit(1);
  }

  console.log("Bucket 'documenti' created successfully:", data);
}

main();
