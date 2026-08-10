-- roles
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- certificate holders
CREATE TABLE public.holders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  holder_type text NOT NULL DEFAULT 'Client',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX holders_email_key ON public.holders (lower(email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.holders TO authenticated;
GRANT ALL ON public.holders TO service_role;
ALTER TABLE public.holders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage holders" ON public.holders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER holders_touch BEFORE UPDATE ON public.holders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- certificates
CREATE SEQUENCE public.certificate_seq START 1;

CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number text NOT NULL UNIQUE,
  holder_id uuid NOT NULL REFERENCES public.holders(id) ON DELETE CASCADE,
  title text NOT NULL,
  cert_type text NOT NULL DEFAULT 'Completion',
  program text,
  description text,
  organization text NOT NULL DEFAULT 'Nexora Digital Solutions Private Limited',
  issued_at date NOT NULL DEFAULT current_date,
  expires_at date,
  status text NOT NULL DEFAULT 'valid',
  verification_token text NOT NULL UNIQUE,
  token_issued_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX certificates_holder_idx ON public.certificates (holder_id);
CREATE INDEX certificates_status_idx ON public.certificates (status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage certificates" ON public.certificates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER certificates_touch BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- verification logs
CREATE TABLE public.verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id uuid REFERENCES public.certificates(id) ON DELETE SET NULL,
  certificate_number text,
  result text NOT NULL,
  client_hash text,
  verified_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX verification_logs_time_idx ON public.verification_logs (verified_at DESC);
CREATE INDEX verification_logs_client_idx ON public.verification_logs (client_hash, verified_at DESC);
GRANT SELECT ON public.verification_logs TO authenticated;
GRANT ALL ON public.verification_logs TO service_role;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read logs" ON public.verification_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- contact enquiries
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  service text,
  budget text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read enquiries" ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- demo seed
INSERT INTO public.holders (id, name, email, phone, organization, holder_type, status) VALUES
  ('11111111-1111-4111-8111-111111111111','Aarav Mehta','aarav.mehta@example.com','+91 98111 22233','Mehta Business Group','Client','active'),
  ('22222222-2222-4222-8222-222222222222','Ananya Sharma','ananya.sharma@example.com','+91 98222 33344','Sharma Technologies','Client','active'),
  ('33333333-3333-4333-8333-333333333333','Rohan Verma','rohan.verma@example.com','+91 98333 44455','Verma Enterprises','Partner','inactive');

INSERT INTO public.certificates (certificate_number, holder_id, title, cert_type, program, description, issued_at, status, verification_token, revoked_at, revocation_reason) VALUES
  ('NDS-2026-0001','11111111-1111-4111-8111-111111111111','Digital Transformation Excellence','Achievement','Enterprise Digital Transformation Program','Awarded for the successful completion of an enterprise-wide digital transformation engagement.','2026-07-15','valid', encode(gen_random_bytes(30),'hex'), NULL, NULL),
  ('NDS-2026-0002','22222222-2222-4222-8222-222222222222','Business Automation Implementation','Completion','Business Process Automation Track','Awarded for the implementation of automated business workflows across operations.','2026-07-22','valid', encode(gen_random_bytes(30),'hex'), NULL, NULL),
  ('NDS-2026-0003','33333333-3333-4333-8333-333333333333','Digital Solutions Professional','Professional','Digital Solutions Professional Program','Awarded on completion of the digital solutions professional programme.','2026-06-05','revoked', encode(gen_random_bytes(30),'hex'), '2026-07-01T10:00:00Z','Issued in error; superseded by a corrected certificate.');

SELECT setval('public.certificate_seq', 3, true);

INSERT INTO public.verification_logs (certificate_id, certificate_number, result, client_hash, verified_at)
SELECT c.id, c.certificate_number, CASE WHEN c.status='revoked' THEN 'revoked' ELSE 'valid' END, 'seed', now() - (interval '3 hours')
FROM public.certificates c;