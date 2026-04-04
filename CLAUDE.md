# CLAUDE.md - Back to the Future

> **This is not documentation. This is a war plan.**
> The most aggressive, cutting-edge full-stack platform ever built.
> Purpose-built for AI website builders and AI video builders to make them faster and more capable.
> The greatest backend + frontend service combined. Period.

---

## 1. PROJECT IDENTITY & MISSION

**Project Name:** Back to the Future

**Mission:** Build the most technologically advanced full-stack platform purpose-built for AI website builders and AI video builders. Every architectural decision, every dependency, every line of code exists to make AI builders faster, more capable, and more dangerous than anything on the market.

**Core Thesis:** Nobody has combined the most advanced backend + frontend into one unified platform. We sit in pure whitespace.

**The Standard:** We must be **80%+ ahead of ALL competition at ALL times.**

**Non-Negotiable Principles:**
- Speed is survival. If it's slow, it's dead.
- Type safety is not optional. Runtime errors are engineering failures.
- AI is not a feature -- it is the architecture.
- Edge-first. Cloud is the fallback, not the default.
- Zero HTML. Components only. The browser is a render target, not a document viewer.

---

## 2. TECH STACK

| Technology | Role |
|---|---|
| **Bun** | Runtime + Package Manager |
| **Hono** | Web Framework (API) |
| **SolidJS + SolidStart** | Frontend Framework |
| **tRPC v11** | End-to-end type-safe API |
| **Drizzle ORM** | Database Access |
| **Turso** | Primary Database (edge SQLite) |
| **Neon** | Serverless PostgreSQL (complex queries) |
| **Tailwind v4** | Styling (Rust-based, CSS-first) |
| **Biome** | Linter + Formatter (replaces ESLint + Prettier) |
| **Zod** | Schema validation at every boundary |
| **Vercel AI SDK** | AI orchestration |
| **Turborepo** | Monorepo build system |
| **Cloudflare Workers** | Edge compute |

---

## 3. ARCHITECTURE

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

## 4. DEVELOPMENT RULES

- **ZERO HTML.** Everything is components. SolidJS JSX compiles to DOM.
- **TypeScript strict mode everywhere.** No `any`. No `@ts-ignore`.
- **Every component has a Zod schema.** AI-composable by design.
- **tRPC for all API calls.** End-to-end type safety.
- **Zod at every boundary.** API input/output, env vars, component props.
- **Biome for formatting and linting.** Not Prettier. Not ESLint.
- **Bun for package management.** Not npm. Not yarn.
- **Conventional commits.** `feat:`, `fix:`, `perf:`, `refactor:`, etc.

---

## 5. ENVIRONMENT VARIABLES

```
TURSO_DATABASE_URL   — Turso database URL
TURSO_AUTH_TOKEN     — Turso auth token
DATABASE_URL         — Neon PostgreSQL (optional)
OPENAI_API_KEY       — OpenAI API key
ANTHROPIC_API_KEY    — Anthropic API key
PORT                 — API server port (default: 3001)
```
