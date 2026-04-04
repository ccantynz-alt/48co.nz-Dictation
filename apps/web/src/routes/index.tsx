import { createSignal, onMount, Show } from "solid-js";
import { Button, Badge } from "@btf/ui";
import { trpc } from "~/lib/trpc.js";

export default function Home() {
	const [status, setStatus] = createSignal<string | null>(null);
	const [checking, setChecking] = createSignal(false);

	async function checkHealth() {
		setChecking(true);
		try {
			const result = await trpc.health.query();
			setStatus(`${result.status} — v${result.version}`);
		} catch (err) {
			setStatus(`offline: ${err instanceof Error ? err.message : "unknown"}`);
		} finally {
			setChecking(false);
		}
	}

	return (
		<main class="flex min-h-screen flex-col items-center justify-center p-8">
			{/* Hero */}
			<div class="text-center">
				<div class="mb-6 flex items-center justify-center gap-2">
					<Badge label="Phase 1" variant="primary" />
					<Badge label="AI-Native" variant="success" />
					<Badge label="Edge-First" variant="outline" />
				</div>
				<h1 class="text-6xl font-bold tracking-tight sm:text-7xl">
					Back to the{" "}
					<span class="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
						Future
					</span>
				</h1>
				<p class="mx-auto mt-6 max-w-2xl text-xl text-zinc-400">
					The most advanced full-stack AI platform ever built.
					Purpose-built for AI website builders and AI video builders.
				</p>
				<p class="mx-auto mt-3 max-w-xl text-sm text-zinc-500">
					SolidJS + Hono + tRPC + Drizzle + Turso + WebGPU + Tailwind v4 + Biome
				</p>
			</div>

			{/* CTA */}
			<div class="mt-10 flex items-center gap-4">
				<a href="/dashboard">
					<Button label="Open Dashboard" variant="primary" size="lg" />
				</a>
				<a href="/ai">
					<Button label="AI Platform" variant="outline" size="lg" />
				</a>
			</div>

			{/* API Status */}
			<div class="mt-6 flex items-center gap-3">
				<Button
					label={checking() ? "Checking..." : "Check API"}
					variant="ghost"
					size="sm"
					loading={checking()}
					onClick={checkHealth}
				/>
				<Show when={status()}>
					<Badge
						label={`API: ${status()}`}
						variant={status()?.startsWith("ok") ? "success" : "danger"}
					/>
				</Show>
			</div>

			{/* Feature Grid */}
			<div class="mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<FeatureCard
					icon="GPU"
					title="Three-Tier Compute"
					description="Client GPU ($0/token) → Edge (sub-50ms) → Cloud (H100). AI runs wherever it's fastest and cheapest. Zero config."
				/>
				<FeatureCard
					icon="AI"
					title="AI-Native Architecture"
					description="AI woven into every layer. Routing, data fetching, error recovery, generative UI — all AI-powered from the ground up."
				/>
				<FeatureCard
					icon="RT"
					title="Real-Time Collaboration"
					description="CRDTs for conflict-free editing. AI agents as first-class collaboration participants. Sub-50ms globally."
				/>
				<FeatureCard
					icon="TS"
					title="End-to-End Type Safety"
					description="SolidStart → tRPC → Hono → Drizzle. Change a type anywhere, see errors everywhere. Zero codegen."
				/>
				<FeatureCard
					icon="UI"
					title="AI-Composable Components"
					description="Every component has a Zod schema. AI can discover, compose, and validate entire UI trees from the catalog."
				/>
				<FeatureCard
					icon="EI"
					title="Sentinel Intelligence"
					description="24/7 competitive monitoring. GitHub releases, npm packages, tech news — analyzed by AI, delivered to Slack."
				/>
			</div>

			{/* Tech Stack */}
			<div class="mt-16 text-center">
				<p class="text-xs uppercase tracking-widest text-zinc-600">Built with</p>
				<div class="mt-4 flex flex-wrap items-center justify-center gap-4">
					{["Bun", "Hono", "SolidJS", "tRPC v11", "Drizzle", "Turso", "Tailwind v4", "Biome", "Zod", "WebGPU", "Cloudflare Workers", "Modal.com"].map(
						(tech) => (
							<span class="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
								{tech}
							</span>
						),
					)}
				</div>
			</div>
		</main>
	);
}

function FeatureCard(props: { icon: string; title: string; description: string }) {
	return (
		<div class="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 transition-all hover:border-blue-600/50 hover:bg-zinc-900/60">
			<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-sm font-bold text-blue-400 transition-colors group-hover:bg-blue-600/20">
				{props.icon}
			</div>
			<h3 class="text-lg font-semibold text-zinc-50">{props.title}</h3>
			<p class="mt-2 text-sm leading-relaxed text-zinc-400">{props.description}</p>
		</div>
	);
}
