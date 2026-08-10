import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { BUDGET_OPTIONS, COMPANY, SERVICE_NAMES } from "@/lib/company";
import { contactSchema, submitEnquiry } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Nexora Digital Solutions Private Limited" },
      {
        name: "description",
        content:
          "Tell us about your project. Nexora Digital Solutions responds to enquiries within one business day — Noida, Uttar Pradesh, India.",
      },
      { property: "og:title", content: "Contact | Nexora Digital Solutions" },
      { property: "og:description", content: "Start a project or ask a question. We reply within one business day." },
    ],
  }),
  component: ContactPage,
});

const FIELDS = ["name", "company", "email", "phone", "service", "budget", "message"] as const;
type FieldErrors = Partial<Record<(typeof FIELDS)[number], string>>;

function ContactPage() {
  const send = useServerFn(submitEnquiry);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(FIELDS.map((f) => [f, String(fd.get(f) ?? "")]));

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as (typeof FIELDS)[number];
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await send({ data: parsed.data });
      setSent(true);
      form.reset();
      toast.success("Thank you — your enquiry has been received.");
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you're trying to solve"
        lead="Share a little context about your business and the challenge. We usually reply within one business day with next steps."
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-card p-7 md:p-9">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">Enquiry received</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Thanks for reaching out. A member of our team will get back to you within one business
                day at the email address you provided.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Project enquiry</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full name" error={errors.name}>
                  <Input id="name" name="name" required maxLength={100} placeholder="Priya Nair" />
                </Field>
                <Field id="company" label="Company" optional error={errors.company}>
                  <Input id="company" name="company" maxLength={120} placeholder="Acme Distribution" />
                </Field>
                <Field id="email" label="Work email" error={errors.email}>
                  <Input id="email" name="email" type="email" required maxLength={255} placeholder="priya@acme.com" />
                </Field>
                <Field id="phone" label="Phone" optional error={errors.phone}>
                  <Input id="phone" name="phone" maxLength={40} placeholder="+91 98765 43210" />
                </Field>
                <Field id="service" label="Service of interest" optional error={errors.service}>
                  <select
                    id="service"
                    name="service"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    defaultValue=""
                  >
                    <option value="">Select a service</option>
                    {SERVICE_NAMES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="budget" label="Indicative budget" optional error={errors.budget}>
                  <select
                    id="budget"
                    name="budget"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    defaultValue=""
                  >
                    <option value="">Select a range</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field id="message" label="How can we help?" error={errors.message}>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={2000}
                  placeholder="Describe the process, product or system you'd like to improve."
                />
              </Field>

              <Button type="submit" size="lg" disabled={pending}>
                {pending ? "Sending…" : (
                  <>
                    Send enquiry <Send className="size-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                We use your details only to respond to this enquiry.
              </p>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="surface-card p-7">
            <h2 className="text-base font-semibold text-foreground">Direct contact</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a className="hover:text-foreground" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <a className="hover:text-foreground" href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {COMPANY.address}
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {COMPANY.hours}
              </li>
            </ul>
          </div>
          <div className="surface-card p-7">
            <h2 className="text-base font-semibold text-foreground">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>1. We review your enquiry and check fit.</li>
              <li>2. A 30-minute discovery call at your convenience.</li>
              <li>3. A written outline of scope, sequence and indicative cost.</li>
            </ol>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
