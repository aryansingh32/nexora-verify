import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  certificateSchema,
  holderSchema,
  idSchema,
  listSchema,
  revokeSchema,
  statusSchema,

} from "./admin.schemas";

export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    return m.fetchStats(context.supabase);
  });

export const getHolders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    return m.listHolders(context.supabase, data);
  });

export const getHolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const { data: holder, error } = await context.supabase
      .from("holders")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const { data: certificates } = await context.supabase
      .from("certificates")
      .select("*")
      .eq("holder_id", data.id)
      .order("issued_at", { ascending: false });
    return { holder, certificates: certificates ?? [] };
  });

export const upsertHolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => holderSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    return m.saveHolder(context.supabase, data);
  });

export const setHolderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => statusSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("holders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, status: data.status };
  });


export const getCertificates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    return m.listCertificates(context.supabase, data);
  });

export const getCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const { data: certificate, error } = await context.supabase
      .from("certificates")
      .select("*, holders(id, name, email, organization)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const { data: logs } = await context.supabase
      .from("verification_logs")
      .select("id, result, verified_at")
      .eq("certificate_id", data.id)
      .order("verified_at", { ascending: false })
      .limit(10);
    return { certificate, logs: logs ?? [] };
  });

export const upsertCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => certificateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    return m.saveCertificate(context.supabase, data);
  });

export const revokeCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => revokeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("certificates")
      .update({
        status: "revoked",
        revoked_at: new Date().toISOString(),
        revocation_reason: data.reason || "Revoked by administrator.",
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const reinstateCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("certificates")
      .update({ status: "valid", revoked_at: null, revocation_reason: null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const regenerateToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const token = m.generateToken();
    const { error } = await context.supabase
      .from("certificates")
      .update({ verification_token: token, token_issued_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { token };
  });

export const getVerificationLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data))
  .handler(async ({ data, context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    let query = context.supabase.from("verification_logs").select("*", { count: "exact" });
    if (data.status && data.status !== "all") query = query.eq("result", data.status);
    if (data.search) query = query.ilike("certificate_number", `%${data.search}%`);
    const from = (data.page - 1) * data.pageSize;
    const { data: rows, count, error } = await query
      .order("verified_at", { ascending: false })
      .range(from, from + data.pageSize - 1);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], total: count ?? 0 };
  });

export const getEnquiries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const m = await import("./admin.server");
    await m.assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const whoAmI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { userId: context.userId, isAdmin: Boolean(data) };
  });
