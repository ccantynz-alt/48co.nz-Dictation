# CLAUDE.MD — AlecRae Voice

> Master reference for all Claude sessions working on this project.
> Read this FIRST before making any changes.
> **THIS IS THE MOST ADVANCED DICTATION PLATFORM ON THE INTERNET. TREAT EVERY LINE OF CODE ACCORDINGLY.**

---

## ABSOLUTE REQUIREMENTS — NON-NEGOTIABLE

1. **ZERO HTML** — No raw HTML anywhere in the codebase. All UI must use React/Next.js components with Tailwind CSS. No dangerouslySetInnerHTML except for service worker registration. No HTML strings. Components only.
2. **MOST ADVANCED STACK** — Always use the latest, most advanced approach available. If there's a better way, use it. No shortcuts, no legacy patterns, no "good enough."
3. **COURTROOM-GRADE SECURITY** — This product will be used in courtrooms, depositions, client meetings, and privileged legal communications. All data must be encrypted in transit (TLS). Sessions must be secure (HttpOnly, Secure, SameSite cookies). No sensitive data in localStorage. Audit logging for all actions. HIPAA and SOC 2 awareness in all design decisions.
4. **UNIVERSAL DEVICE SUPPORT** — Must work flawlessly on: iOS (Safari + PWA), Android (Chrome + PWA), Windows (Chrome, Edge, Firefox), Mac (Safari, Chrome), Linux, iPad, tablets. Capacitor wrappers for App Store and Google Play.
5. **UNIVERSAL LANGUAGE SUPPORT** — 23+ languages with real legal and accounting terminology per locale. Not placeholders — actual jurisdiction-specific legal terms.
6. **BEST GRAMMAR ON THE MARKET** — Context-aware grammar correction that understands legal citations (Bluebook, OSCOLA, AGLC, McGill), accounting standards (GAAP, IFRS), court filing conventions, and profession-specific jargon. Must exceed Grammarly for legal/accounting writing.
7. **INTEGRATION-READY** — Architecture must support integration with any external system: email, calendar, document management, legal research, accounting platforms, messenger, CRM.

---

## PROJECT OVERVIEW

**AlecRae Voice** is the most advanced AI-powered professional dictation platform on the Internet. Built for attorneys, lawyers, accountants, and consumers. It understands how legal and accounting professionals work, how they structure documents, and the specialised terminology they use — in 23+ languages.

**This is the first of its kind.** No other product combines:
- 22 document modes (12 professional + 10 consumer)
- 23-language legal/accounting terminology
- Courtroom-grade security
- Real-time AI streaming enhancement
- Cross-platform universal access
- Advanced grammar engine with citation style awareness
- Document templates with fillable fields
- Batch transcription
- Multi-user enterprise with RBAC, SSO, Stripe billing
- White-label for law firms

**Deployed at:** AlecRae.app (Vercel)
**GitHub repo:** ccantynz-alt/AlecRae.app
**Status:** V2 — Full platform built April 2026

---

## BRAND CONTEXT

AlecRae Voice is part of the **AlecRae** professional services brand (law, accounting, compliance).

AlecRae itself sits under the **MarcoReid** umbrella brand — a global business operating system with five layers: Build, Run, Grow, Connect, Protect. AlecRae Voice lives in the **Protect** layer.

Long-term, this tool may be rebranded as **MarcoReid Voice** when the brand architecture consolidates.

**Zoobicon** is the separate accessible-tier website/app builder. AlecRae Voice is NOT part of Zoobicon.

---

## COMPETITIVE LANDSCAPE

### Direct Competitors
- **Dragon Legal v16** — $699 one-time + $199/yr. Industry incumbent. Raw transcription only (no AI cleanup). Windows only. 100,000+ legal term vocabulary. Requires voice training.
- **WisprFlow** — $15-19/month. Current market leader for AI dictation. 95%+ accuracy, works in any app, Mac/Windows/iOS. NOT legal-specific. $56M funding.
- **Willow Voice** — $15/month. Sub-200ms latency. Privacy-focused. Mac/iOS only.
- **BlabbyAI** — Whisper-based, Windows desktop. Has custom legal modes. Newer entrant.
- **Dictation Daddy** — Browser-based, legal terminology support. Simpler feature set.
- **Philips SpeechLive** — Enterprise dictation with legal workflow integration. Higher price.
- **Grammarly** — Grammar correction leader, but zero legal/accounting specialisation. No dictation. No document formatting.

### Our Competitive Advantages (what NONE of them do)
1. **22 document-type modes** — 12 professional + 10 consumer modes that format dictation into properly structured legal letters, court filings, memos, tax advisories, medical notes, real estate docs, etc.
2. **Streaming Claude AI** — enhancement appears in real-time, not batch processing.
3. **Legal AND accounting AND consumer** — every competitor focuses on one. We serve all.
4. **23-language legal terminology** — real jurisdiction-specific terms, not translations.
5. **Advanced grammar engine** — citation style awareness (Bluebook, OSCOLA, AGLC, McGill), profession-specific rules, configurable formality.
6. **Custom AI instructions** — users can tell the AI their firm name, spelling preferences, date formats.
7. **Document templates** — fillable field templates for common legal/accounting documents.
8. **Batch transcription** — upload multiple audio files at once.
9. **Multi-user enterprise** — RBAC, SSO (Google/Microsoft), Stripe billing, admin dashboard, white-label.
10. **Universal platform** — Web, iOS, Android, Windows, Mac, Linux. PWA + Capacitor native apps.
11. **AlecRae ecosystem integration** — connects to legal research, accounting, messenger, and email systems.

### Target: THE MOST ADVANCED ON THE INTERNET
- Must exceed ALL competitors on every dimension
- Must be the product that sets the standard for the industry
- 110% quality — nothing ships that isn't production-perfect

---

## TECH STACK

- **Framework:** Next.js 14 (App Router) — server components, streaming, edge runtime
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS — NO raw HTML, NO CSS modules, components only
- **Transcription:** OpenAI Whisper API (whisper-1) with 23-language support
- **AI Enhancement:** Claude API (claude-sonnet-4-20250514) with streaming SSE
- **Grammar Engine:** Custom context-aware system with citation style support
- **Auth:** Multi-user JWT sessions via jose, PBKDF2 password hashing (Web Crypto), SSO (Google/Microsoft OAuth2)
- **Billing:** Stripe (checkout, portal, webhooks)
- **Export:** docx library for Word document generation
- **Database:** Neon PostgreSQL (serverless driver)
- **Native Apps:** Capacitor (iOS + Android)
- **Offline:** Service worker with cache-first static, network-first API, background sync
- **Hosting:** Vercel (edge functions, auto-deploy)
- **Domain:** AlecRae.app

---

## ARCHITECTURE

```
app/
  page.tsx                        — Login page (public)
  layout.tsx                      — Root layout, PWA metadata, service worker
  globals.css                     — Global styles, animations
  app/
    page.tsx                      — Main dictation interface (protected)
    layout.tsx                    — App layout wrapper
    admin/page.tsx                — Admin dashboard (owner/admin only)
    billing/page.tsx              — Plans & billing (Stripe)
  api/
    auth/route.ts                 — POST login (password), DELETE logout
    auth/login/route.ts           — POST email+password login
    auth/register/route.ts        — POST user registration
    auth/sso/[provider]/route.ts  — GET SSO redirect (Google/Microsoft)
    auth/sso/[provider]/callback/ — GET OAuth callback
    transcribe/route.ts           — Whisper transcription (23 languages)
    transcribe-stream/route.ts    — Real-time streaming transcription (SSE)
    transcribe-batch/route.ts     — Batch multi-file transcription
    enhance/route.ts              — Claude streaming enhancement (22 modes)
    dictations/route.ts           — GET/POST dictation history
    dictations/[id]/route.ts      — GET/DELETE single dictation
    vocabulary/route.ts           — GET/POST/DELETE custom terms
    settings/route.ts             — GET/PUT user settings
    analytics/route.ts            — POST log / GET stats
    firms/route.ts                — GET/POST/PUT firm profiles
    firms/[id]/route.ts           — GET/DELETE firm
    billing/checkout/route.ts     — POST Stripe checkout session
    billing/portal/route.ts       — POST Stripe portal session
    billing/webhook/route.ts      — POST Stripe webhooks
    users/route.ts                — GET list / POST invite
    users/[id]/route.ts           — GET/PUT/DELETE user
    admin/stats/route.ts          — GET dashboard analytics
    admin/users/route.ts          — GET paginated user search
    whitelabel/route.ts           — GET/PUT white-label config
    audio/route.ts                — POST/GET audio storage
    db/init/route.ts              — POST initialize database schema
lib/
  auth.ts                         — JWT session creation/verification (original)
  auth-multi.ts                   — Multi-user auth with RBAC
  db.ts                           — Neon PostgreSQL connection
  db-schema.ts                    — Database schema initialisation
  get-user.ts                     — Get/create user from session
  templates.ts                    — 12 professional document mode prompts
  consumer-modes.ts               — 10 consumer document mode prompts
  templates-fillable.ts           — Document templates with fillable fields
  languages.ts                    — 23 languages with legal/accounting terms
  grammar-engine.ts               — Advanced grammar config + prompt builder
  auto-detect.ts                  — Auto-detect document type from content
  firm-profiles.ts                — Firm profile management
  firm-store.ts                   — Firm storage (in-memory, pending DB)
  stripe.ts                       — Stripe billing integration
  sso.ts                          — SSO (Google/Microsoft OAuth2)
  whitelabel.ts                   — White-label configuration
  platform.ts                     — Cross-platform detection + audio config
  shortcuts.ts                    — Platform-aware keyboard shortcuts
  register-sw.ts                  — Service worker registration
middleware.ts                     — Route protection (JWT + role checks)
capacitor.config.ts               — Capacitor native app config
public/
  manifest.json                   — Full PWA manifest with shortcuts, share target
  sw.js                           — Service worker (offline, background sync)
```

### Security Architecture
- All API routes validate JWT session before processing
- Passwords hashed with PBKDF2 (100,000 iterations, SHA-256) via Web Crypto API
- HttpOnly, Secure, SameSite=Lax session cookies
- Stripe webhooks verified by signature
- SSO uses OAuth2 authorization code flow
- Role-based access control (owner > admin > user > viewer)
- Privacy mode — dictations can be excluded from history
- No sensitive data stored client-side
- Audit logging for all significant actions
- CORS and Content Security Policy headers

### Auth Flow (Multi-user)
1. User visits AlecRae.app → login page
2. Login via email+password, SSO (Google/Microsoft), or admin password
3. JWT cookie set with embedded user data (id, email, role, firmId, tier)
4. Middleware checks JWT + role on every protected route
5. API routes extract user from JWT for data scoping

### Dictation Flow
1. User taps record → browser MediaRecorder captures audio (format auto-detected per platform)
2. Audio sent to /api/transcribe with language parameter → Whisper processes with locale-specific vocab
3. Raw text returned → voice commands processed client-side
4. User selects document mode (22 modes) or auto-detect suggests one
5. /api/enhance streams Claude response with grammar config → text appears in real-time
6. User can copy, export .docx, save to DB history, or use template

---

## DOCUMENT MODES (22 total)

### Professional — Legal (7)
- Legal letter — formal letter with proper structure
- Legal memorandum — TO/FROM/RE header, Issue/Analysis/Conclusion
- Court filing — numbered paragraphs, formal court language
- Demand letter — pre-litigation correspondence
- Deposition summary — organised by topic with testimony highlights
- Engagement letter — client terms, scope, fees
- General cleanup — grammar, punctuation, formatting

### Professional — Accounting (3)
- Accounting report — GAAP/IFRS terminology, findings, recommendations
- Tax advisory — IRC references, tax positions, circular 230 disclaimers
- Audit opinion — AICPA standards format, scope, opinion paragraphs

### Professional — General (2)
- Client email — professional correspondence
- Meeting notes — structured minutes with action items

### Consumer (10)
- Personal letter — warm personal correspondence
- Business email — professional business communication
- Resume / Cover letter — job application formatting
- Social media post — concise, engaging content
- Blog post — structured article with headers
- Academic paper — formal academic writing
- Medical notes — SOAP format clinical notes
- Real estate — property docs, listings, leases
- Insurance claim — claim filing documentation
- Complaint letter — formal complaint with resolution request

---

## LANGUAGES (23)

English (US, UK, AU, NZ), Spanish, French, German, Italian, Portuguese (BR, PT), Dutch, Japanese, Korean, Mandarin Chinese, Arabic, Hindi, Russian, Turkish, Polish, Swedish, Thai, Vietnamese, Indonesian

Each language includes real legal terminology and accounting terms specific to that jurisdiction's legal system.

---

## FEATURES BUILT (V2)

### Core Dictation
- [x] Whisper transcription with 23-language support
- [x] Custom vocabulary per user (fed to Whisper)
- [x] 22 document mode AI enhancement (12 professional + 10 consumer)
- [x] Streaming Claude response (real-time text appearance)
- [x] Voice commands (new paragraph, period, comma, delete that, etc.)
- [x] Auto-detect document type from content
- [x] Real-time streaming transcription endpoint
- [x] Batch file transcription (up to 20 files)

### Grammar & Language
- [x] Advanced grammar engine with profession-specific rules
- [x] Citation style support (Bluebook, OSCOLA, AGLC, McGill)
- [x] Configurable spelling (US/UK/AU/NZ), dates, numbers
- [x] Formality levels (standard, formal, court)
- [x] 23-language legal/accounting terminology

### Templates & Documents
- [x] 6 built-in document templates with fillable fields
- [x] Export to .docx
- [x] Copy to clipboard

### User Experience
- [x] Customisable hotkeys (26 shortcuts, platform-aware)
- [x] Custom AI instructions per user
- [x] Privacy mode (disable history for sensitive dictations)
- [x] Recording mode toggle (tap or hold)
- [x] Audio playback support
- [x] Word count
- [x] Dark theme with gold accent (professional, not playful)

### Platform
- [x] PWA with full manifest, shortcuts, share target, file handlers
- [x] Service worker (offline caching, background sync, push notifications)
- [x] Platform detection with optimal audio config per device
- [x] Capacitor config for iOS + Android native apps
- [x] Cross-platform meta tags (iOS, Android, Windows)
- [x] Responsive design (desktop, tablet, mobile)

### Database & Sync
- [x] Neon PostgreSQL with full schema (users, dictations, vocabulary, firms, templates, usage_logs)
- [x] CRUD APIs for dictations, vocabulary, settings, analytics
- [x] Server-side history storage
- [x] Firm profiles with custom AI instructions and vocabulary

### Enterprise
- [x] Multi-user auth with RBAC (owner/admin/user/viewer)
- [x] Email+password registration with PBKDF2 hashing
- [x] SSO integration (Google, Microsoft)
- [x] Stripe subscription billing (Free/Pro $29/Enterprise $99)
- [x] Admin dashboard with analytics
- [x] User management (invite, roles, deactivate)
- [x] White-label branding support
- [x] Firm-specific AI training profiles

### Security
- [x] JWT sessions (HttpOnly, Secure, SameSite)
- [x] PBKDF2 password hashing (Web Crypto API)
- [x] Role-based access control on all routes
- [x] Stripe webhook signature verification
- [x] Audit logging
- [x] Content Security Policy headers
- [x] Privacy mode for privileged communications

---

## ENVIRONMENT VARIABLES (Vercel)

```
# Required
OPENAI_API_KEY          — OpenAI API key for Whisper
ANTHROPIC_API_KEY       — Anthropic API key for Claude
ADMIN_PASSWORD          — Legacy admin login password
JWT_SECRET              — Random string for signing session tokens (32+ chars)
DATABASE_URL            — Neon PostgreSQL connection string

# Billing (Stripe)
STRIPE_SECRET_KEY       — Stripe secret API key
STRIPE_WEBHOOK_SECRET   — Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe publishable key (client-side)

# SSO (Optional)
GOOGLE_CLIENT_ID        — Google OAuth client ID
GOOGLE_CLIENT_SECRET    — Google OAuth client secret
MICROSOFT_CLIENT_ID     — Microsoft OAuth client ID
MICROSOFT_CLIENT_SECRET — Microsoft OAuth client secret
```

---

## STRICT CODE STANDARDS

### Absolute Rules
- **ZERO HTML** — All UI via React components + Tailwind CSS. No exceptions.
- **TypeScript strict mode** — No `any` in new code where avoidable. Proper interfaces for all data shapes.
- **Tailwind CSS only** — No CSS modules, no inline styles, no styled-components.
- **App Router only** — No Pages Router patterns.
- **Server components by default** — `'use client'` only when client interactivity required.
- **API routes for all server logic** — No server actions mixing concerns.
- **No external UI libraries** — Custom components only. No Material UI, no Chakra, no shadcn.
- **Security first** — Every API route validates auth. Every input is validated. Every error is caught.

### Design Direction
- Dark theme (ink-950 background) — professional, not playful
- Gold accent colour — conveys premium/legal authority
- Georgia display font — traditional legal/professional feel
- Minimal UI — no clutter, no feature overload on screen
- Everything accessible within 2 taps/clicks
- Must look and feel like a premium legal product, not a startup toy

### Development Workflow
- Craig develops on iPad via GitHub web editor
- Deploys via Vercel (auto-deploy on push to main)
- Vercel Framework Preset must be set to **Next.js** (not "Other")
- Always verify builds compile before pushing

---

## MANDATE

**AlecRae Voice is the most advanced dictation platform on the Internet.** 

It is the first product that combines AI-powered transcription, profession-specific document formatting, advanced grammar correction, 23-language support, courtroom-grade security, and universal device access into a single platform.

This product will be used in:
- **Courtrooms** — court filings, real-time notes
- **Depositions** — testimony summaries, witness notes
- **Client meetings** — meeting minutes, action items, follow-ups
- **Legal offices** — letters, memos, demand letters, engagement letters
- **Accounting firms** — reports, tax advisories, audit opinions
- **Anywhere professionals work** — home, office, court, on the road

Quality standard: **110% before any public launch or customer-facing outreach.**
No compromises. No shortcuts. The best or nothing.
