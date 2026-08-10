-- Add optional photo_url to holders (used on verification page avatar)
ALTER TABLE public.holders ADD COLUMN IF NOT EXISTS photo_url text;

-- Allow unauthenticated visitors to insert contact enquiries (public contact form)
GRANT INSERT ON public.contact_submissions TO anon;

CREATE POLICY "anyone can submit enquiry"
  ON public.contact_submissions FOR INSERT TO anon
  WITH CHECK (true);

-- Expose verification_logs insert to service_role only (already granted via service_role ALL)
-- Allow anon to read nothing from verification_logs (no new policy needed, already locked down)

-- Public read of certificates via token is handled via supabaseAdmin (service role) in the server function.
-- No additional RLS policy is needed for the public verify endpoint.
