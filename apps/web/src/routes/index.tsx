import { createSignal } from "solid-js";
import { Button } from "@btf/ui";
import { trpc } from "~/lib/trpc.js";

export default function Home() {
	const [status, setStatus] = createSignal<string>("...");

	async function checkHealth() {
		try {
			const result = await trpc.health.query();
			setStatus(`API: ${result.status} at ${result.timestamp}`);
		} catch (err) {
			setStatus(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
		}
	}

	return (
		<main class="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<div class="text-center">
				<h1 class="text-5xl font-bold tracking-tight">
					Back to the <span class="text-blue-500">Future</span>
				</h1>
				<p class="mt-4 text-lg text-zinc-400">
					The most advanced full-stack AI platform ever built.
				</p>
				<p class="mt-2 text-sm text-zinc-500">
					SolidJS + Hono + tRPC + Drizzle + Turso + WebGPU + AI
				</p>
			</div>

			<div class="flex flex-col items-center gap-4">
				<Button
					label="Check API Health"
					variant="primary"
					size="lg"
					onClick={checkHealth}
				/>
				<p class="text-sm text-zinc-400">{status()}</p>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<FeatureCard
					title="Three-Tier Compute"
					description="Client GPU → Edge → Cloud. AI runs wherever it's fastest and cheapest."
				/>
				<FeatureCard
					title="AI-Native Architecture"
					description="AI woven into every layer. Routing, data fetching, error recovery — all AI-powered."
				/>
				<FeatureCard
					title="Real-Time Collaboration"
					description="CRDTs + AI agents as first-class collaboration participants."
				/>
			</div>
		</main>
	);
}

function FeatureCard(props: { title: string; description: string }) {
	return (
		<div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-600">
			<h3 class="text-lg font-semibold text-zinc-50">{props.title}</h3>
			<p class="mt-2 text-sm text-zinc-400">{props.description}</p>
		</div>
	);
}
