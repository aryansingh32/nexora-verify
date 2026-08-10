import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const tokenSchema = z.object({
  token: z
    .string()
    .trim()
    .min(16)
    .max(200)
    .regex(/^[a-f0-9]+$/i, "invalid token format"),
});

export type VerificationResult =
  | {
      status: "valid" | "expired";
      certificate: {
        holderName: string;
        holderOrganization: string | null;
        title: string;
        type: string;
        program: string | null;
        description: string | null;
        certificateNumber: string;
        issuedAt: string;
        expiresAt: string | null;
        organization: string;
      };
      verifiedAt: string;
    }
  | {
      status: "revoked";
      certificate: {
        holderName: string;
        title: string;
        certificateNumber: string;
        issuedAt: string;
        organization: string;
      };
      revokedAt: string | null;
      revocationReason: string | null;
      verifiedAt: string;
    }
  | { status: "invalid"; verifiedAt: string }
  | { status: "rate_limited"; verifiedAt: string };

async function hashClient(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const verifyCertificate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }): Promise<VerificationResult> => {
    const now = new Date().toISOString();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let clientHash = "unknown";
    try {
      const request = getRequest();
      const ip =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";
      clientHash = await hashClient(ip);
    } catch {
      /* no request context */
    }

    // Lightweight rate limiting: max 30 verification attempts per client per minute.
    const since = new Date(Date.now() - 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("verification_logs")
      .select("id", { count: "exact", head: true })
      .eq("client_hash", clientHash)
      .gte("verified_at", since);

    if ((count ?? 0) > 30) {
      return { status: "rate_limited", verifiedAt: now };
    }

    const { data: cert } = await supabaseAdmin
      .from("certificates")
      .select(
        "id, certificate_number, title, cert_type, program, description, organization, issued_at, expires_at, status, revoked_at, revocation_reason, holders(name, organization)",
      )
      .eq("verification_token", data.token)
      .maybeSingle();

    if (!cert) {
      await supabaseAdmin
        .from("verification_logs")
        .insert({ result: "invalid", client_hash: clientHash });
      return { status: "invalid", verifiedAt: now };
    }

    const holder = (cert as unknown as { holders: { name: string; organization: string | null } | null })
      .holders;

    if (cert.status === "revoked") {
      await supabaseAdmin.from("verification_logs").insert({
        certificate_id: cert.id,
        certificate_number: cert.certificate_number,
        result: "revoked",
        client_hash: clientHash,
      });
      return {
        status: "revoked",
        certificate: {
          holderName: holder?.name ?? "—",
          title: cert.title,
          certificateNumber: cert.certificate_number,
          issuedAt: cert.issued_at,
          organization: cert.organization,
        },
        revokedAt: cert.revoked_at,
        revocationReason: cert.revocation_reason,
        verifiedAt: now,
      };
    }

    const expired = Boolean(cert.expires_at && new Date(cert.expires_at) < new Date());
    await supabaseAdmin.from("verification_logs").insert({
      certificate_id: cert.id,
      certificate_number: cert.certificate_number,
      result: expired ? "expired" : "valid",
      client_hash: clientHash,
    });

    return {
      status: expired ? "expired" : "valid",
      certificate: {
        holderName: holder?.name ?? "—",
        holderOrganization: holder?.organization ?? null,
        title: cert.title,
        type: cert.cert_type,
        program: cert.program,
        description: cert.description,
        certificateNumber: cert.certificate_number,
        issuedAt: cert.issued_at,
        expiresAt: cert.expires_at,
        organization: cert.organization,
      },
      verifiedAt: now,
    };
  });
