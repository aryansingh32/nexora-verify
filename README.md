# Nexora Verify

Build Brief — Premium Digital Solutions Company Website + Private Certificate Verification System

Build a complete, production-quality website for a Private Limited service-based company providing digital solutions.

The website should feel like a premium modern technology company: light mode, clean, sophisticated, minimal, trustworthy, and highly polished. Use realistic demo content throughout so the website feels complete rather than like a template.

1. Overall Brand & Visual Direction

Create a premium light-themed digital solutions website.

Visual style

- Premium SaaS / technology-company aesthetic
- Light background with subtle off-white/very-light-gray sections
- Strong typography and generous whitespace
- Modern cards with subtle borders and shadows
- Elegant rounded corners
- Subtle gradients used sparingly
- Professional blue/indigo/teal accent palette
- Smooth hover states and micro-interactions
- Subtle scroll animations
- Clean icons
- Avoid excessive glassmorphism
- Avoid a generic startup-template appearance
- The design should look credible for a registered Private Limited company
- Fully responsive on desktop, tablet, and mobile
- Excellent accessibility and contrast
- Fast-loading and SEO-friendly

The overall impression should be:

"A premium, established digital solutions company that businesses can trust."

---

2. Company Demo Data

Use the following demo company identity throughout the website:

Company Name: Nexora Digital Solutions Private Limited

Tagline:
"Digital solutions engineered for the way your business works."

Short description:
"Nexora Digital Solutions Private Limited helps businesses transform operations, customer experiences, and digital workflows through thoughtfully engineered technology solutions."

Use realistic but clearly fictional/demo information.

Demo contact information

- Email: he@nexoradigital.example
- Phone: +91 98765 43210
- Address: Noida, Uttar Pradesh, India
- Business hours: Monday–Saturday, 10:00 AM–6:30 PM

Do not imply that the demo company information is a real registered company.

---

3. Main Public Website

Create the following pages/routes:

"/"

Premium homepage containing:

Hero

Headline:
"Digital solutions built around your business."

Supporting text explaining that the company delivers custom software, web platforms, automation, cloud solutions, and digital transformation services.

Primary CTA:
"Start a Project"

Secondary CTA:
"Explore Services"

Include an elegant abstract digital/technology visual rather than a generic stock photo.

Trust / capability section

Show metrics such as:

- 50+ Projects Delivered
- 30+ Businesses Supported
- 15+ Digital Products
- 98% Client Satisfaction

Clearly treat these as demo statistics.

Services section

Create polished service cards for:

1. Custom Software Development
2. Web & Mobile Applications
3. Business Automation
4. Cloud & Infrastructure
5. UI/UX & Product Design
6. Digital Transformation
7. API & System Integration
8. Maintenance & Technical Support

Each service should have a short professional description.

Why choose us

Highlight:

- Business-first engineering
- Scalable architecture
- Transparent communication
- Security-conscious development
- Modern technology
- Long-term support

Process

Show a 4–5 step process:

1. Discover
2. Plan
3. Design
4. Build
5. Launch & Support

Featured work

Create 3–4 realistic demo case studies.

Example:

- RetailFlow — Business Operations Platform
- MedConnect — Appointment & Patient Management
- EduSphere — Learning Management Platform
- FleetIQ — Fleet Management Dashboard

Clearly label these as demo/representative projects if necessary.

CTA

"Have a digital challenge? Let's build the right solution."

Button:
"Talk to Our Team"

---

4. Services Page

Route:

"/services"

Create a premium services overview with detailed sections for each service.

Include:

- What the service solves
- Typical deliverables
- Technology/capability tags
- Example use cases
- CTA

Use realistic demo content.

---

5. About Page

Route:

"/about"

Include:

- Company story
- Mission
- Vision
- Values
- Leadership/team demo profiles
- Technology philosophy
- Quality/security commitment

Do not use fake claims such as government recognition, ISO certification, awards, or actual client relationships unless explicitly marked as demo content.

---

6. Contact Page

Route:

"/contact"

Create a polished enquiry form containing:

- Name
- Company
- Email
- Phone
- Service required
- Project budget
- Message

Include client-side validation.

Show demo contact information beside the form.

If a backend/email service is not configured, make the form functional enough for the demo by storing submissions in the application's database/backend rather than pretending an email was sent.

---

7. Certificate Verification System — IMPORTANT

Implement a real working certificate verification system.

This is a core requirement.

The verification system should NOT be visible as a normal feature in the public website UI.

Do NOT add:

- "Verify Certificate" to the navbar
- A public certificate verification button
- A certificate search form
- A visible verification page link
- A QR verification section on the homepage

The verification experience should only be reached through the unique URL encoded in the QR code printed on a certificate.

---

8. Certificate QR Architecture

Every certificate must have a unique verification URL.

Example structure:

"https://example.com/verify/{LONG_UNIQUE_TOKEN}"

The token should be a cryptographically secure, unpredictable long random string.

Example format:

"/verify/7f4c91b2e8a94d7c8e1f0a63b9d2f4a81c7e6d5b3a9f2e1c4d8b7a6f5e3"

Do NOT use:

- Sequential IDs
- User IDs
- Certificate numbers alone
- Easily guessable slugs
- Email addresses
- Names in the token

The verification token should be generated securely using the backend/server-side cryptographic random generator.

---

9. QR Code Behavior

When an administrator generates a certificate:

1. Generate a unique verification token.
2. Create the verification URL.
3. Generate a QR code containing that URL.
4. Assign the QR/token to that certificate.
5. Allow the administrator to download the QR code.
6. Allow the administrator to download the certificate containing the QR code.
7. Scanning the QR code with a phone should directly open:

"/verify/{unique-token}"

The verification page should then retrieve the certificate from the backend/database and display its verification result.

---

10. Hidden Verification Page

The route:

"/verify/:token"

must work even though it is not linked anywhere in the visible website navigation.

This is intentional.

The page should be designed specifically for someone who scans a certificate QR code.

Valid certificate state

Display a premium verification screen containing:

✓ Certificate Verified

Then show:

- Certificate holder name
- Certificate title/type
- Certificate ID
- Issued date
- Issuing organization
- Course/program/service name, where applicable
- Status: Valid
- Verification timestamp
- Optional certificate metadata

Example:

«Certificate Verified
This certificate was issued by Nexora Digital Solutions Private Limited and its authenticity has been successfully verified.»

Include a subtle security/trust visual.

Invalid certificate state

If the token does not exist:

Certificate Could Not Be Verified

Explain that the certificate token is invalid or does not exist in the verification database.

Revoked certificate state

If an administrator revokes a certificate:

Certificate Revoked

Clearly display the revoked status and, if appropriate, the revocation date/reason.

Do not expose unnecessary internal database information.

---

11. Important Security Requirement

The verification URL being hidden from navigation is not a security mechanism.

Treat certificate verification tokens as unguessable secrets.

Implement:

- Cryptographically secure token generation
- Server-side verification
- Database-backed certificate records
- No sensitive internal information in the token
- Rate limiting on verification requests where appropriate
- Proper validation of tokens
- No admin functionality exposed through the verification endpoint

Do not rely on frontend-only verification.

The verification result must come from the backend/database.

---

12. Admin Panel

Create a separate admin endpoint:

"/admin"

The admin panel should NOT appear in the public website navigation or footer.

It must have proper authentication.

Do not create an unprotected admin dashboard.

Implement:

- Secure admin login
- Session-based authentication or a secure authentication provider
- Password hashing
- Protected admin routes
- Logout
- Authorization checks on every admin operation

If authentication infrastructure is not available, build the complete authentication architecture using the application's backend/database and clearly mark demo credentials in development only.

Never hardcode production passwords into frontend code.

---

13. Admin Dashboard

Create a premium but practical dashboard.

Dashboard overview should show:

- Total users
- Total certificates
- Active certificates
- Revoked certificates
- Recent certificates
- Recent verification activity

Include charts/cards where useful.

---

14. User Management

Admin should be able to:

- View users
- Search users
- Filter users
- Create a user
- Edit user details
- View user profile
- Deactivate/activate user
- View certificates assigned to a user

Example user fields:

- Full name
- Email
- Phone
- Organization
- User type
- Status
- Created date

---

15. Certificate Management

Admin should be able to:

Create certificate

Fields:

- Certificate holder
- Certificate title
- Certificate type
- Course/program
- Issue date
- Expiry date (optional)
- Organization
- Additional description
- Certificate status

When saving:

- Generate unique certificate ID
- Generate secure long verification token
- Generate QR code
- Store QR/verification information
- Associate certificate with the selected user

Do not allow duplicate verification tokens.

---

16. QR Management

Inside the admin panel, provide a QR management interface.

Admin should be able to:

- Generate QR
- View QR
- Download QR as PNG/SVG
- Copy verification URL
- Regenerate/revoke QR if necessary
- See which certificate the QR belongs to
- See QR creation date
- See QR status

Important:

If a QR is regenerated, carefully define whether the previous token is invalidated. Prefer making this explicit in the UI.

---

17. Certificate Download

Allow administrators to download a professional certificate PDF.

The generated certificate should contain:

- Company logo
- Company name
- Certificate title
- Recipient name
- Certificate description
- Issue date
- Certificate ID
- QR code
- Small text such as:
  "Scan the QR code to verify this certificate."
- Signature area
- Authorized signatory/demo name

The QR must point to the actual generated verification URL.

The certificate must not use a fake static QR code.

---

18. Demo Certificate Data

Seed the database with realistic demo data.

For example:

User 1

Name: Aarav Mehta
Email: aarav.mehta@example.com
Organization: Mehta Business Group

Certificate:

- Title: Digital Transformation Excellence
- Certificate ID: NDS-2026-0001
- Status: Valid
- Issue Date: 15 July 2026

User 2

Name: Ananya Sharma
Email: ananya.sharma@example.com
Organization: Sharma Technologies

Certificate:

- Title: Business Automation Implementation
- Certificate ID: NDS-2026-0002
- Status: Valid
- Issue Date: 22 July 2026

User 3

Name: Rohan Verma
Email: rohan.verma@example.com
Organization: Verma Enterprises

Certificate:

- Title: Digital Solutions Professional
- Certificate ID: NDS-2026-0003
- Status: Revoked
- Issue Date: 05 June 2026

Make the demo certificates fully functional.

The QR codes for the seeded certificates must actually resolve to their corresponding "/verify/{token}" URLs.

---

19. Verification Testing

This is extremely important.

After implementing the feature, test the complete flow:

Flow A — Valid certificate

Admin → Create certificate → Generate QR → Download QR → Scan/open QR → "/verify/{token}" → Backend lookup → Certificate displayed as Valid.

Flow B — Invalid token

Open "/verify/random-invalid-long-token" → Backend lookup → Invalid certificate state.

Flow C — Revoked certificate

Admin → Revoke certificate → Open its existing QR URL → Verification page must show Revoked.

Flow D — User assignment

Admin → Create user → Create certificate → Assign certificate → User profile shows certificate.

Flow E — QR download

Admin → Certificate → Download QR → Confirm QR contains the correct verification URL.

Do not mark the implementation complete until these flows work.

---

20. URL & Routing Requirements

Public:

"/"

"/services"

"/about"

"/contact"

Hidden verification:

"/verify/:token"

Admin:

"/admin"

"/admin/login"

"/admin/dashboard"

"/admin/users"

"/admin/users/:id"

"/admin/certificates"

"/admin/certificates/new"

"/admin/certificates/:id"

"/admin/qr"

The verification route should be accessible directly but not discoverable through normal website navigation.

Admin routes must be protected.

---

21. Database Model

Use a real persistent database rather than local frontend state.

Suggested entities:

User

- id
- name
- email
- phone
- organization
- status
- createdAt
- updatedAt

Certificate

- id
- certificateId
- userId
- title
- type
- program
- description
- issuedAt
- expiresAt
- status
- verificationToken
- qrCodeData
- createdAt
- updatedAt
- revokedAt

Admin

- id
- email
- passwordHash
- role
- createdAt

VerificationLog

- id
- certificateId
- verifiedAt
- result
- metadata where appropriate

Use proper foreign keys and indexes.

Add a unique database constraint to "verificationToken".

---

22. Verification Logging

When a certificate is successfully or unsuccessfully checked, optionally record a lightweight verification event.

Do not collect unnecessary personal information.

Useful information:

- Certificate ID
- Timestamp
- Result
- Non-sensitive technical metadata if appropriate

Do not expose verification logs publicly.

Allow administrators to view recent verification activity.

---

23. UI Details for Verification

The QR verification page should look different from the marketing website while still using the same brand.

Make it extremely clear on mobile because most visitors will arrive by scanning a QR code.

At the top:

Nexora Digital Solutions Private Limited

Then a prominent status card:

✓ VERIFIED

Below it:

Certificate Authenticity Confirmed

Then certificate information.

Add a small footer:

"Verification provided by Nexora Digital Solutions Private Limited."

Do not add a search box.

Do not add a "Verify another certificate" feature.

Do not add the route to the public navbar.

---

24. Admin UI Design

The admin dashboard should use a premium light dashboard design:

- Left sidebar
- Dashboard
- Users
- Certificates
- QR Codes
- Verification Activity
- Settings
- Logout

Use tables with:

- Search
- Filtering
- Pagination
- Status badges
- Actions

Certificate actions:

- View
- Edit
- Download PDF
- Download QR
- Copy verification URL
- Revoke

Use confirmation dialogs for destructive actions.

---

25. Responsive Design

The entire website must be responsive.

Especially optimize:

- QR verification page for mobile
- Admin tables for tablets/mobile
- Certificate preview
- Contact form
- Navigation
- Dashboard cards

On mobile, admin tables can become stacked cards or horizontally scrollable tables.

---

26. SEO

Implement proper SEO for the public marketing pages:

- Page titles
- Meta descriptions
- Open Graph metadata
- Semantic HTML
- Proper heading hierarchy
- Sitemap where appropriate
- Robots configuration

Do not intentionally index individual certificate verification pages if certificates may contain personal information.

Consider adding appropriate "noindex" behavior to "/verify/*".

---

27. Technical Quality

Build this as a real full-stack application, not a static mockup.

Requirements:

- Clean component architecture
- Reusable UI components
- Proper API/backend separation
- Persistent database
- Server-side verification
- Secure authentication
- Form validation
- Error handling
- Loading states
- Empty states
- Success/error notifications
- Responsive design
- Accessible components
- Type-safe code where the chosen stack supports it

Never fake functionality with hardcoded frontend responses.

---

28. Demo Mode

The application should be immediately usable after setup.

Seed it with demo:

- Users
- Certificates
- QR codes
- Verification records

Provide clear development/demo instructions for:

- Database setup
- Environment variables
- Admin login
- Running the application
- Generating certificates
- Testing QR verification

Do not expose secrets in the frontend or repository.

---

29. Final Acceptance Criteria

The project is complete only when all of these work:

- [ ] Premium light-mode company website
- [ ] Fully responsive
- [ ] Homepage with realistic demo content
- [ ] Services page
- [ ] About page
- [ ] Contact page
- [ ] Persistent database
- [ ] Secure admin login
- [ ] Protected "/admin" dashboard
- [ ] User management
- [ ] Certificate management
- [ ] Certificate-to-user assignment
- [ ] Unique secure certificate verification token
- [ ] Actual QR generation
- [ ] QR download
- [ ] Certificate PDF generation/download
- [ ] QR points to the correct certificate
- [ ] Hidden "/verify/:token" route
- [ ] No verification link/search UI on the public site
- [ ] Valid certificate verification works
- [ ] Invalid token handling works
- [ ] Revoked certificate verification works
- [ ] Verification status comes from the backend/database
- [ ] Demo certificates have working QR codes
- [ ] Admin can revoke certificates
- [ ] Admin can regenerate/manage QR codes
- [ ] Verification activity can be viewed by admin
- [ ] No sensitive data is exposed in URLs
- [ ] Verification tokens are cryptographically random
- [ ] Proper error/loading/empty states
- [ ] Mobile QR verification experience works

Most Important Instruction

Do not merely create the visual UI.

Implement the complete working certificate verification workflow end-to-end.

The QR code must contain a real unique URL, that URL must reach the hidden "/verify/:token" route, the route must query the backend/database, and the page must display the actual certificate's current status.

The public website should look like a premium digital-solutions company website, while the certificate verification system and "/admin" area should operate as a separate functional layer behind the scenes.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a311e9d3-7e3b-42f7-a5c0-2f8cefe5866a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
