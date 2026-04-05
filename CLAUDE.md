# CLAUDE.md - Back to the Future

> **This is not documentation. This is a war plan.**
> The most aggressive, cutting-edge full-stack platform ever built.
> Purpose-built for AI website builders and AI video builders to make them faster and more capable.
> The greatest backend + frontend service combined. Period.

---

## 1. PROJECT IDENTITY & MISSION

**Project Name:** Back to the Future

**Mission:** Build the most technologically advanced full-stack platform purpose-built for AI website builders and AI video builders. Every architectural decision, every dependency, every line of code exists to make AI builders faster, more capable, and more dangerous than anything on the market.

**Core Thesis:** Nobody has combined the most advanced backend + frontend into one unified platform. We sit in pure whitespace. The entire industry is fragmented -- backend frameworks over here, frontend frameworks over there, AI bolted on as an afterthought, edge computing treated as a deployment target instead of a compute primitive. We reject all of that. We unify everything into a single, cohesive war machine.

**The Standard:** We must be **80%+ ahead of ALL competition at ALL times.** Not 10%. Not 30%. Eighty percent. If a competitor closes ground, we accelerate. If a new technology emerges that threatens our lead, we absorb it or destroy the need for it.

**What This Is Not:** This is not a framework. This is not a boilerplate. This is not a starter kit. This is a **self-evolving, self-defending technology war machine.** It learns. It adapts. It gets faster while you sleep. Every layer has AI woven into its DNA -- not bolted on, not plugged in, not optional. AI is the bloodstream of this platform.

**Critical Dependency:** Multiple downstream products depend on this platform. They cannot launch until Back to the Future ships. Every day of delay is a day those products are blocked. This is not a side project -- it is the foundation that everything else is built on. Ship fast. Ship now. Ship right.

**First of Its Kind:** No one has ever combined the most advanced backend service with the most advanced frontend service into a single, unified, AI-native platform. This is the first. It must work on every device, integrate with everything, and set the standard that everyone else chases.

**Non-Negotiable Principles:**
- Speed is survival. If it's slow, it's dead.
- Type safety is not optional. Runtime errors are engineering failures.
- AI is not a feature -- it is the architecture.
- Edge-first. Cloud is the fallback, not the default.
- Zero HTML. Components only. The browser is a render target, not a document viewer.
- If we can run it on the client GPU for free, we do. Every token we don't pay for is a weapon.

---

## 2. COMPETITIVE POSITION & MARKET GAPS

We occupy whitespace. Not a sliver of whitespace -- a canyon. Here is what NO ONE else is doing:

### Gap 1: No Platform Combines WebGPU + AI + Real-Time as Unified Full-Stack

Every existing platform treats these as separate concerns. WebGPU is a "graphics thing." AI is a "cloud thing." Real-time is a "WebSocket thing." We treat them as ONE compute fabric. A single request can touch client-side GPU inference, edge-deployed AI agents, real-time collaborative state, and cloud GPU clusters -- seamlessly, in the same type-safe pipeline. Nobody else is even attempting this.

### Gap 2: No Framework Has AI Woven Into EVERY Layer

Everyone else bolts AI on. Add an AI endpoint. Plug in a chatbot. Throw an LLM at your search bar. That is weak. In Back to the Future, AI is the nervous system:

- **AI-driven routing** -- Routes optimize themselves based on usage patterns and user intent
- **AI-optimized data fetching** -- Queries are rewritten, prefetched, and cached by AI agents that understand your data model
- **AI-powered error recovery** -- When something breaks, AI agents diagnose, patch, and recover before the user notices
- **AI-assisted real-time collaboration** -- AI mediates conflicts, suggests edits, and co-authors alongside humans
- **Automatic semantic search** -- Every piece of data is vector-indexed automatically. Search understands meaning, not just keywords.
- **Built-in RAG pipelines** -- Retrieval-Augmented Generation is a first-class primitive, not a research project you wire up yourself

This is not "AI-enhanced." This is **AI-native from the ground up.**

### Gap 3: No Platform Treats Client GPU + Edge + Cloud as One Unified Compute Tier

The industry thinks in silos: client, edge, server. We think in ONE compute mesh. A workload runs wherever it is fastest and cheapest:

- **Client-side AI inference via WebGPU costs $0/token.** Llama 3.1 8B runs at 41 tokens/second in the browser. That is free intelligence.
- **Edge nodes handle latency-sensitive logic** in sub-5ms cold starts across 330+ cities.
- **Cloud GPUs (A100/H100) handle heavy lifting** only when the client and edge cannot.

The platform decides where to run each computation. The developer does not think about deployment targets. The platform is the deployment target.

### Gap 4: No Platform Combines Real-Time Collaboration Primitives (CRDTs) + AI Agents + Edge Computing

CRDTs exist. AI agents exist. Edge computing exists. Nobody has fused them. We have:

- **Yjs CRDTs** for conflict-free real-time state
- **AI agents that participate in collaborative sessions** as first-class peers, not API calls
- **Edge-deployed collaboration infrastructure** so two users on the same continent never route through a US data center

This enables AI-assisted website building and AI-assisted video editing where humans and AI agents co-create in real-time with zero latency.

### Gap 5: The Experiment-to-Production Bridge for AI is Broken

**80% of AI experiments never deploy.** The gap between "cool demo" and "production service" is a graveyard. We eliminate it:

- Same code runs in development and production
- AI agents are tested, versioned, and deployed with the same pipeline as application code
- Model inference scales from browser (free) to edge (cheap) to cloud GPU (powerful) without code changes
- Observability is built in from day one -- you see what your AI agents are doing, why, and how well

### The Competition (And Why They Lose)

| Competitor | Approach | Their Weakness |
|---|---|---|
| **Vercel** | Framework-led (Next.js ecosystem) | Locked to React, AI bolted on, no WebGPU, no CRDT primitives, no client-side inference |
| **Cloudflare** | Infrastructure-led | Raw infrastructure, no opinions, no AI integration, no framework coherence |
| **Supabase** | Open-source BaaS | Database-centric, no edge compute story, no AI layer, no frontend opinion |
| **Convex** | Reactive backend | Backend-only, no frontend, no AI, no edge GPU, no WebGPU |
| **T3 Stack** | Type-safe boilerplate | It's a template, not a platform. No runtime, no AI, no edge, no evolution |

**None of them occupy our whitespace.** Not one. We are building in a category that does not exist yet.

---

## 3. TECHNOLOGY STACK (THE ARSENAL)

Every tool was chosen for a reason. If it is in this stack, it is the best in its class. If something better emerges, we replace without sentiment.

### Runtime & Backend

| Technology | Role | Why It's Here |
|---|---|---|
| **Bun** | Runtime | 52K+ req/s. 10-20x faster installs. Cold starts 8-15ms. Native TypeScript execution. Built-in bundler, test runner, package manager. One tool replaces five. |
| **Hono** | Web Framework | 4x faster than Express. Runs on every edge, serverless, and runtime platform that exists. RegExpRouter is the fastest JavaScript router in existence. |
| **tRPC v11** | API Layer | End-to-end type safety with zero codegen. Change a backend type, see the frontend error instantly. No OpenAPI spec, no code generation step, no drift. |
| **Drizzle ORM** | Database Access | Code-first, SQL-like TypeScript. 7.4KB bundle. Zero generation step. Optimal for serverless and edge where cold start size kills you. |

### Frontend (ZERO HTML - Component-Only Architecture)

| Technology | Role | Why It's Here |
|---|---|---|
| **SolidJS + SolidStart** | Primary Framework | The fastest reactive framework in existence. True signals -- not React's fake reactivity through re-renders. NO virtual DOM. JSX compiles to direct, surgical DOM mutations. |
| **Tailwind v4** | Styling | Rust-based engine (Lightning CSS). 10x faster builds than Tailwind v3. CSS-first configuration. No JavaScript config file. |
| **Biome** | Code Quality | Replaces Prettier AND ESLint in a single tool. 50-100x faster. Written in Rust. One config, one tool, instant feedback. |

### AI Layer

| Technology | Role | Why It's Here |
|---|---|---|
| **Vercel AI SDK** | AI Orchestration | Streaming responses, generative UI, agent support, tool approval workflows, 25+ LLM provider support. |
| **json-render + Zod Schemas** | AI-Composable UI | AI generates UI from component catalogs. Zod schemas define what components exist, what props they accept, and what they do. |
| **WebGPU + WebLLM** | Client-Side AI Inference | Llama 3.1 8B runs at 41 tokens/second in the browser via WebGPU. **Cost per token: $0.** |

### Database Layer

| Technology | Role | Why It's Here |
|---|---|---|
| **Turso** | Primary Database | Edge SQLite with embedded replicas. Zero-latency reads because the replica is embedded in the application. Native vector search built in. |
| **Neon** | Serverless PostgreSQL | When you need full Postgres power. Scale-to-zero means you pay nothing when idle. |

### Infrastructure

| Technology | Role | Why It's Here |
|---|---|---|
| **Cloudflare Workers** | Edge Compute | Sub-5ms cold starts. 330+ cities worldwide. $5/month for 10 million requests. |
| **Modal.com** | Serverless GPU | A100 and H100 GPUs on demand. No provisioning, no idle costs. |
| **Stripe** | Billing | Subscription management, checkout, customer portal, usage-based billing. |

---

## 4. ARCHITECTURE

```
back-to-the-future/
├── apps/
│   ├── web/          # SolidStart web application
│   └── api/          # Hono API server (Bun)
├── packages/
│   ├── ui/           # Shared component library (SolidJS)
│   ├── schemas/      # Shared Zod schemas (AI-composable)
│   ├── ai-core/      # AI utilities (three-tier compute)
│   ├── db/           # Drizzle schemas + Turso
│   └── config/       # Shared configs (TypeScript, Tailwind)
├── services/
│   ├── sentinel/     # Competitive intelligence engine
│   ├── gpu-workers/  # Modal.com GPU workers
│   └── edge-workers/ # Cloudflare Worker scripts
├── infra/            # Cloudflare, Docker, Terraform
├── turbo.json
├── biome.json
└── package.json
```

### Three-Tier Compute Model
```
CLIENT GPU (WebGPU) → EDGE (Cloudflare Workers) → CLOUD (Modal.com GPUs)
      $0/token            sub-50ms                   Full H100 power
```

---

## 5. DEVELOPMENT RULES

- **ZERO HTML.** Everything is components. SolidJS JSX compiles to DOM.
- **TypeScript strict mode everywhere.** No `any`. No `@ts-ignore`.
- **Every component has a Zod schema.** AI-composable by design.
- **tRPC for all API calls.** End-to-end type safety.
- **Zod at every boundary.** API input/output, env vars, component props.
- **Biome for formatting and linting.** Not Prettier. Not ESLint.
- **Bun for package management.** Not npm. Not yarn.
- **Conventional commits.** `feat:`, `fix:`, `perf:`, `refactor:`, etc.
- **Tests before merge. No exceptions.** Untested code does not ship.
- **Every function has a return type. Every prop has a type.** Implicit `any` is a bug.

---

## 6. ENVIRONMENT VARIABLES

```
TURSO_DATABASE_URL    — Turso database URL
TURSO_AUTH_TOKEN      — Turso auth token
DATABASE_URL          — Neon PostgreSQL (optional)
OPENAI_API_KEY        — OpenAI API key
ANTHROPIC_API_KEY     — Anthropic API key
STRIPE_SECRET_KEY     — Stripe secret key
STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret
STRIPE_PUBLISHABLE_KEY — Stripe publishable key (frontend)
PORT                  — API server port (default: 3001)
```

---

## 7. AGGRESSIVE TODO LIST

> **CRITICAL DEPENDENCY: Multiple products are blocked on this platform. Ship fast. Ship now. Ship right.**

### PHASE 0: FOUNDATION [DONE]
- [x] Turborepo monorepo with Bun workspaces
- [x] Biome linter + formatter
- [x] TypeScript strict mode
- [x] SolidStart app scaffold
- [x] Hono API server on Bun
- [x] tRPC router connecting SolidStart <-> Hono
- [x] Drizzle ORM with Turso
- [x] Tailwind v4
- [x] Shared packages (ui, schemas, ai-core, db, config)
- [x] CI/CD pipeline (GitHub Actions)
- [x] Renovate + Dependabot

### PHASE 1: CORE ENGINE [DONE]
- [x] Auth scaffolding (passkey types, session management, middleware)
- [x] Signal-based state management (auth, projects, UI stores)
- [x] Core UI components with Zod schemas (Button, Input, Card, Modal, Badge, Alert, Select, Textarea)
- [x] tRPC CRUD procedures wired to Drizzle (projects, users)
- [x] Real-time WebSocket layer
- [x] SSE streaming for AI responses
- [x] Dashboard route

### PHASE 2: AI CORE [DONE]
- [x] Three-tier compute model with WebGPU detection
- [x] Generative UI system (catalog → compose → validate)
- [x] RAG pipeline (chunk, embed, retrieve, augment)
- [x] Agent framework (site builder + video builder)
- [x] AI streaming hooks for SolidJS
- [x] AI dashboard page

### PHASE 3: COLLABORATION [DONE]
- [x] CRDT-based collaboration store
- [x] Cursor presence overlay
- [x] Real-time editing page
- [x] AI agents as collaboration participants

### PHASE 4: SENTINEL [DONE]
- [x] GitHub release monitor (15 repos)
- [x] npm package watcher (19 packages)
- [x] HN scanner with relevance scoring
- [x] Threat analyzer
- [x] Slack alerting

### PHASE 5: HARDENING [DONE]
- [x] Rate limiting
- [x] OWASP security headers
- [x] Request ID tracing
- [x] Immutable audit trail (SHA-256 hash chaining)

### PHASE 6: PRODUCTION [IN PROGRESS]
- [x] Landing page
- [x] Cloudflare deploy config
- [x] Modal.com GPU workers
- [ ] Stripe billing integration
- [ ] Working auth pages (register/login)
- [ ] Settings page (account, billing)
- [ ] Database initialization endpoint
- [ ] End-to-end functional flow
