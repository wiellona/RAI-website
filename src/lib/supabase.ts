import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Place them in .env.local and restart the dev server."
  );
} else {
  // Helpful one-time debug to confirm env is wired at runtime
  if (process.env.NODE_ENV !== "production") {
    // Avoid printing the full key; just its first 6 chars for sanity check
    const keyPreview = (supabaseAnonKey ?? "").slice(0, 6);
    console.info(
      `[supabase] Env OK → url:${
        supabaseUrl?.includes("supabase.co") ? "valid" : "check"
      }, key:${keyPreview}…`
    );
  }
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: { persistSession: true },
});
