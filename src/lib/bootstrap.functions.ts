import { createServerFn } from "@tanstack/react-start";

export const DEMO_ADMIN_EMAIL = "admin@nexoradigital.example";
export const DEMO_ADMIN_PASSWORD = "NexoraDemo#2026";

/**
 * Idempotent demo bootstrap: creates the first administrator account only when
 * no administrator exists yet. Once an admin exists this becomes a no-op, so it
 * cannot be used to escalate privileges.
 */
export const ensureDemoAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { count } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if ((count ?? 0) > 0) return { created: false as const };

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
    email_confirm: true,
  });

  let userId = created?.user?.id;
  if (error || !userId) {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    userId = list?.users.find((u) => u.email === DEMO_ADMIN_EMAIL)?.id;
    if (!userId) throw new Error("Could not provision the demo administrator account.");
  }

  await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
  return { created: true as const };
});
