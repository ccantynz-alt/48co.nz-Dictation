/**
 * AI Dashboard — shows compute tier status, agent interaction, and streaming demo.
 */

import { createSignal, onMount, Show } from "solid-js";
import { Button, Card, Badge } from "@btf/ui";
import { webGPUStore } from "~/ai/webgpu-detect.js";
import { useAIStream } from "~/ai/use-ai-stream.js";

export default function AIDashboard() {
	const [prompt, setPrompt] = createSignal("");
	const aiStream = useAIStream();

	onMount(() => {
		webGPUStore.detect();
	});

	function handleGenerate() {
		const p = prompt().trim();
		if (!p) return;
		aiStream.stream("http://localhost:3001/stream/ai", { prompt: p });
	}

	return (
		<main class="min-h-screen p-8">
			<div class="mx-auto max-w-4xl">
				<h1 class="text-3xl font-bold text-zinc-50">AI Platform</h1>
				<p class="mt-2 text-sm text-zinc-400">Three-tier compute: Client GPU → Edge → Cloud</p>

				{/* Compute Tier Status */}
				<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
					<ComputeTierCard
						title="Client GPU"
						subtitle="$0/token"
						description="WebGPU inference in the browser"
						status={webGPUStore.status()}
					/>
					<Card title="Edge" description="Cloudflare Workers AI — sub-50ms globally">
						<div class="mt-2 flex gap-2">
							<Badge label="Ready" variant="success" />
							<Badge label="330+ cities" variant="primary" />
						</div>
					</Card>
					<Card title="Cloud" description="Modal.com H100 GPUs — full power">
						<div class="mt-2 flex gap-2">
							<Badge label="Ready" variant="success" />
							<Badge label="H100" variant="primary" />
						</div>
					</Card>
				</div>

				{/* AI Interaction */}
				<div class="mt-8">
					<Card title="AI Generation" variant="outlined">
						<div class="flex flex-col gap-4">
							<textarea
								placeholder="Describe what you want to build..."
								value={prompt()}
								onInput={(e) => setPrompt(e.currentTarget.value)}
								rows={4}
								class="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
							/>
							<div class="flex items-center gap-3">
								<Button
									label={aiStream.isStreaming() ? "Streaming..." : "Generate"}
									variant="primary"
									disabled={aiStream.isStreaming()}
									loading={aiStream.isStreaming()}
									onClick={handleGenerate}
								/>
								<Show when={aiStream.isStreaming()}>
									<Button label="Stop" variant="destructive" onClick={() => aiStream.abort()} />
								</Show>
								<Show when={aiStream.tokensReceived() > 0}>
									<span class="text-xs text-zinc-500">
										{aiStream.tokensReceived()} tokens
									</span>
								</Show>
							</div>

							<Show when={aiStream.text()}>
								<div class="rounded-md border border-zinc-800 bg-zinc-900 p-4">
									<pre class="whitespace-pre-wrap text-sm text-zinc-300">
										{aiStream.text()}
									</pre>
								</div>
							</Show>

							<Show when={aiStream.error()}>
								<div class="rounded-md border border-red-800 bg-red-950/50 p-3 text-sm text-red-400">
									{aiStream.error()}
								</div>
							</Show>
						</div>
					</Card>
				</div>

				{/* Agent Section */}
				<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
					<Card title="Site Builder Agent" description="Generate full website pages from descriptions" interactive>
						<div class="mt-3 flex gap-2">
							<Badge label="Multi-step" variant="primary" />
							<Badge label="Tool-calling" variant="primary" />
							<Badge label="Composable UI" variant="success" />
						</div>
					</Card>
					<Card title="Video Builder Agent" description="AI-powered video editing and processing" interactive>
						<div class="mt-3 flex gap-2">
							<Badge label="WebGPU" variant="primary" />
							<Badge label="Real-time" variant="primary" />
							<Badge label="Multi-format" variant="success" />
						</div>
					</Card>
				</div>
			</div>
		</main>
	);
}

function ComputeTierCard(props: {
	title: string;
	subtitle: string;
	description: string;
	status: { available: boolean; adapter: string | null; vramMB: number; checked: boolean };
}) {
	return (
		<Card title={props.title} description={props.description}>
			<div class="mt-2">
				<p class="text-xs text-blue-400">{props.subtitle}</p>
				<Show when={props.status.checked} fallback={<Badge label="Checking..." variant="warning" />}>
					<div class="mt-2 flex flex-wrap gap-2">
						<Badge
							label={props.status.available ? "Available" : "Not available"}
							variant={props.status.available ? "success" : "danger"}
						/>
						<Show when={props.status.adapter}>
							<Badge label={props.status.adapter!} variant="outline" />
						</Show>
						<Show when={props.status.vramMB > 0}>
							<Badge label={`${props.status.vramMB}MB VRAM`} variant="outline" />
						</Show>
					</div>
				</Show>
			</div>
		</Card>
	);
}
