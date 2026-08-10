import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { CertificateInput, HolderInput, ListInput } from "./admin.schemas";

export type Db = SupabaseClient<Database>;

export async function assertAdmin(supabase: Db, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden: administrator access required.");
}

export function generateToken() {
  const bytes = new Uint8Array(30);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function nextCertificateNumber(supabase: Db) {
  const bytes = new Uint8Array(4); // 4 bytes = 8 hex chars
  crypto.getRandomValues(bytes);
  const hash = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `NDS-${hash}`;
}

export async function fetchStats(supabase: Db) {
  const [holders, certs, valid, revoked, recentCerts, recentLogs, enquiries] = await Promise.all([
    supabase.from("holders").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }).eq("status", "valid"),
    supabase.from("certificates").select("id", { count: "exact", head: true }).eq("status", "revoked"),
    supabase
      .from("certificates")
      .select("id, certificate_number, title, status, issued_at, created_at, holders(name)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("verification_logs")
      .select("id, certificate_number, result, verified_at")
      .order("verified_at", { ascending: false })
      .limit(8),
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
  ]);

  const { data: trendRows } = await supabase
    .from("verification_logs")
    .select("result, verified_at")
    .gte("verified_at", new Date(Date.now() - 13 * 86_400_000).toISOString())
    .order("verified_at", { ascending: true });

  const buckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    buckets.set(d, 0);
  }
  for (const row of trendRows ?? []) {
    const key = String(row.verified_at).slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return {
    totalHolders: holders.count ?? 0,
    totalCertificates: certs.count ?? 0,
    activeCertificates: valid.count ?? 0,
    revokedCertificates: revoked.count ?? 0,
    totalEnquiries: enquiries.count ?? 0,
    recentCertificates: recentCerts.data ?? [],
    recentVerifications: recentLogs.data ?? [],
    trend: Array.from(buckets, ([date, checks]) => ({ date: date.slice(5), checks })),
  };
}

export async function listHolders(supabase: Db, input: ListInput) {
  let query = supabase.from("holders").select("*", { count: "exact" });
  if (input.search) {
    const s = `%${input.search}%`;
    query = query.or(`name.ilike.${s},email.ilike.${s},organization.ilike.${s}`);
  }
  if (input.status && input.status !== "all") query = query.eq("status", input.status);
  const from = (input.page - 1) * input.pageSize;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + input.pageSize - 1);
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

export async function listCertificates(supabase: Db, input: ListInput) {
  let query = supabase
    .from("certificates")
    .select("*, holders(id, name, email, organization)", { count: "exact" });
  if (input.search) {
    const s = `%${input.search}%`;
    query = query.or(`certificate_number.ilike.${s},title.ilike.${s},program.ilike.${s}`);
  }
  if (input.status && input.status !== "all") query = query.eq("status", input.status);
  const from = (input.page - 1) * input.pageSize;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + input.pageSize - 1);
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0 };
}

export async function saveHolder(supabase: Db, input: HolderInput) {
  const payload = {
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    organization: input.organization || null,
    photo_url: input.photoUrl || null,
    holder_type: input.holderType,
    status: input.status,
  };
  if (input.id) {
    const { error } = await supabase.from("holders").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  const { data, error } = await supabase.from("holders").insert(payload).select("id").single();
  if (error) throw new Error(error.message.includes("holders_email_key") ? "A holder with that email already exists." : error.message);
  return { id: data.id };
}

export async function saveCertificate(supabase: Db, input: CertificateInput) {
  const payload = {
    holder_id: input.holderId,
    title: input.title,
    cert_type: input.certType,
    program: input.program || null,
    internship_period: input.internshipPeriod || null,
    description: input.description || null,
    organization: input.organization || "",
    issued_at: input.issuedAt,
    expires_at: input.expiresAt || null,
    status: input.status,
  };
  if (input.id) {
    const { error } = await supabase.from("certificates").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const certificate_number = await nextCertificateNumber(supabase);
    const { data, error } = await supabase
      .from("certificates")
      .insert({ ...payload, certificate_number, verification_token: generateToken() })
      .select("id")
      .single();
    if (!error) return { id: data.id };
    if (!error.message.includes("duplicate key")) throw new Error(error.message);
  }
  throw new Error("Could not allocate a unique certificate number. Please retry.");
}
