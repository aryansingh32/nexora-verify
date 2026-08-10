import { z } from "zod";

export const holderSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  holderType: z.string().trim().min(1).max(60),
  status: z.enum(["active", "inactive"]),
});
export type HolderInput = z.infer<typeof holderSchema>;

export const certificateSchema = z.object({
  id: z.string().uuid().optional(),
  holderId: z.string().uuid(),
  title: z.string().trim().min(3).max(160),
  certType: z.string().trim().min(2).max(60),
  program: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(1200).optional().or(z.literal("")),
  organization: z.string().trim().min(2).max(160),
  issuedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  status: z.enum(["valid", "revoked"]),
});
export type CertificateInput = z.infer<typeof certificateSchema>;

export const idSchema = z.object({ id: z.string().uuid() });

export const revokeSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().trim().max(300).optional().or(z.literal("")),
});

export const listSchema = z.object({
  search: z.string().trim().max(120).optional(),
  status: z.string().trim().max(40).optional(),
  page: z.number().int().min(1).max(500).default(1),
  pageSize: z.number().int().min(5).max(100).default(10),
});
export type ListInput = z.infer<typeof listSchema>;

export const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["active", "inactive"]),
});
