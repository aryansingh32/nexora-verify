export const COMPANY = {
  name: "Nexora Digital Solutions Private Limited",
  shortName: "Nexora Digital",
  tagline: "Digital solutions engineered for the way your business works.",
  description:
    "Nexora Digital Solutions Private Limited helps businesses transform operations, customer experiences, and digital workflows through thoughtfully engineered technology solutions.",
  email: "hello@nexoradigitalsolutions.in",
  phone: "+91 00000 00000",
  address: "Noida, Uttar Pradesh, India",
  hours: "Monday–Saturday, 10:00 AM–6:30 PM",
  signatory: "R. Kulkarni, Director — Delivery",
} as const;

export const SERVICES = [
  {
    slug: "custom-software",
    title: "Custom Software Development",
    summary:
      "Purpose-built systems that fit your operating model instead of forcing your teams into generic tooling.",
    solves:
      "Spreadsheet sprawl, disconnected internal tools and manual handoffs that quietly cap how fast the business can grow.",
    deliverables: [
      "Discovery workshop and solution blueprint",
      "Production application with role-based access",
      "Automated test suite and deployment pipeline",
      "Technical documentation and handover",
    ],
    tags: ["TypeScript", "Node.js", "PostgreSQL", "Domain modelling"],
    useCases: [
      "Order-to-cash platform for a distribution business",
      "Internal underwriting workbench for a lending team",
    ],
  },
  {
    slug: "web-mobile",
    title: "Web & Mobile Applications",
    summary:
      "Fast, accessible customer-facing products across web and mobile, engineered for real-world network conditions.",
    solves:
      "Slow, dated digital touchpoints that lose customers before they reach the thing they came for.",
    deliverables: [
      "Design system and component library",
      "Responsive web application",
      "Cross-platform mobile build",
      "Analytics and performance budget",
    ],
    tags: ["React", "React Native", "PWA", "Core Web Vitals"],
    useCases: ["Customer self-service portal", "Field-agent mobile companion app"],
  },
  {
    slug: "automation",
    title: "Business Automation",
    summary:
      "Workflow automation that removes repetitive work without removing human judgement where it matters.",
    solves: "High-volume manual processes: approvals, reconciliation, document handling and reporting.",
    deliverables: [
      "Process mapping and automation candidates",
      "Workflow engine configuration",
      "Exception handling and audit trail",
      "Adoption playbook for your team",
    ],
    tags: ["Workflow engines", "Document AI", "Integrations", "RPA"],
    useCases: ["Automated invoice matching", "Multi-stage approval routing"],
  },
  {
    slug: "cloud",
    title: "Cloud & Infrastructure",
    summary: "Reliable, cost-aware cloud foundations with observability built in from day one.",
    solves: "Unpredictable hosting costs, fragile deployments and infrastructure nobody wants to touch.",
    deliverables: [
      "Infrastructure as code",
      "CI/CD pipelines with rollback",
      "Monitoring, alerting and runbooks",
      "Cost optimisation review",
    ],
    tags: ["AWS", "Containers", "Terraform", "Observability"],
    useCases: ["Zero-downtime migration to managed services", "Multi-environment delivery pipeline"],
  },
  {
    slug: "design",
    title: "UI/UX & Product Design",
    summary: "Research-led interface design that makes complex operational software feel obvious.",
    solves: "Low adoption, heavy training overhead and support tickets caused by confusing interfaces.",
    deliverables: [
      "User research and journey maps",
      "Interactive prototypes",
      "Accessible design system",
      "Usability test findings",
    ],
    tags: ["Design systems", "WCAG 2.2", "Prototyping", "Research"],
    useCases: ["Operations console redesign", "Onboarding flow rework"],
  },
  {
    slug: "transformation",
    title: "Digital Transformation",
    summary: "A sequenced roadmap that ties technology change to measurable business outcomes.",
    solves: "Ambitious modernisation goals with no credible path from current state to target state.",
    deliverables: [
      "Current-state assessment",
      "Target architecture and roadmap",
      "Business case and KPI framework",
      "Quarterly delivery governance",
    ],
    tags: ["Architecture", "Change management", "KPIs", "Roadmapping"],
    useCases: ["Legacy ERP surround strategy", "Digital operating model design"],
  },
  {
    slug: "integration",
    title: "API & System Integration",
    summary: "Clean contracts between your systems so data stops being re-keyed between departments.",
    solves: "Point-to-point integrations that break silently and leave teams reconciling by hand.",
    deliverables: [
      "Integration architecture",
      "Versioned API contracts",
      "Retry, idempotency and reconciliation logic",
      "Integration monitoring dashboard",
    ],
    tags: ["REST", "Webhooks", "Event streams", "ETL"],
    useCases: ["ERP to CRM synchronisation", "Payment gateway and ledger integration"],
  },
  {
    slug: "support",
    title: "Maintenance & Technical Support",
    summary: "Ongoing engineering ownership with defined response times and a transparent backlog.",
    solves: "Systems that go unmaintained after launch until something breaks in production.",
    deliverables: [
      "SLA-backed support desk",
      "Security patching and dependency upgrades",
      "Monthly reliability reporting",
      "Continuous improvement backlog",
    ],
    tags: ["SLA", "Patching", "Monitoring", "Incident response"],
    useCases: ["Managed support for a live customer portal", "Post-launch stabilisation programme"],
  },
] as const;

export const SERVICE_NAMES = SERVICES.map((s) => s.title);

export const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Businesses Supported" },
  { value: "15+", label: "Digital Products" },
  { value: "98%", label: "Client Satisfaction" },
] as const;

export const WHY_US = [
  {
    title: "Business-first engineering",
    body: "Every technical decision is traced back to an operational or commercial outcome you can measure.",
  },
  {
    title: "Scalable architecture",
    body: "Systems are designed for the load you expect in three years, not just the load you have today.",
  },
  {
    title: "Transparent communication",
    body: "Shared boards, weekly demos and honest status. No surprises at the end of a sprint.",
  },
  {
    title: "Security-conscious development",
    body: "Threat modelling, least-privilege access and dependency scanning are part of delivery, not an afterthought.",
  },
  {
    title: "Modern technology",
    body: "A deliberately small, well-supported stack chosen for longevity rather than novelty.",
  },
  {
    title: "Long-term support",
    body: "Documented handovers and optional managed support keep the system healthy after launch.",
  },
] as const;

export const PROCESS = [
  { step: "01", title: "Discover", body: "Workshops with your team to map processes, constraints and success measures." },
  { step: "02", title: "Plan", body: "Scope, architecture, delivery sequence and a realistic budget envelope." },
  { step: "03", title: "Design", body: "Prototypes and a design system validated with the people who will use it." },
  { step: "04", title: "Build", body: "Two-week increments with working software, automated tests and demos." },
  { step: "05", title: "Launch & Support", body: "Controlled rollout, training, monitoring and continuous improvement." },
] as const;

export const CASE_STUDIES = [
  {
    name: "RetailFlow",
    subtitle: "Business Operations Platform",
    sector: "Retail distribution",
    body: "Consolidated purchasing, stock and store replenishment into one operations platform with live exception alerts.",
    outcomes: ["41% faster replenishment cycle", "Single source of stock truth", "Manual reporting removed"],
  },
  {
    name: "MedConnect",
    subtitle: "Appointment & Patient Management",
    sector: "Healthcare services",
    body: "Appointment scheduling, reminders and clinician notes unified behind role-based access and audit logging.",
    outcomes: ["No-shows down by a third", "Audit-ready records", "Clinician admin time reduced"],
  },
  {
    name: "EduSphere",
    subtitle: "Learning Management Platform",
    sector: "Education",
    body: "A cohort-based learning platform with assessments, progress analytics and verifiable completion certificates.",
    outcomes: ["12k learners supported", "Automated certification", "Programme analytics for faculty"],
  },
  {
    name: "FleetIQ",
    subtitle: "Fleet Management Dashboard",
    sector: "Logistics",
    body: "Telemetry ingestion, maintenance scheduling and route cost analysis in a single operations dashboard.",
    outcomes: ["Downtime cut by 22%", "Predictive maintenance alerts", "Per-route cost visibility"],
  },
] as const;

export const BUDGET_OPTIONS = [
  "Under ₹5 lakh",
  "₹5–15 lakh",
  "₹15–40 lakh",
  "₹40 lakh+",
  "Not sure yet",
] as const;
