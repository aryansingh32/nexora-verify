import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Please give us at least a couple of sentences").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      service: data.service || null,
      budget: data.budget || null,
      message: data.message,
    });
    if (error) throw new Error("We could not record your enquiry. Please try again.");
    return { ok: true as const };
  });
