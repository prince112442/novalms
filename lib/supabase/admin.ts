// lib/supabase/admin.ts
// Service-role client — bypasses Row Level Security. NEVER import this
// into anything that ships to the browser. Only used server-side, for
// admin scripts like creating the first user.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
