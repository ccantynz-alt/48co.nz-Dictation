/**
 * Collaboration page — real-time multi-user editing with AI participants.
 */

import { createSignal, onMount, onCleanup, Show, For } from "solid-js";
import { Button, Card, Badge } from "@btf/ui";
import { collabStore, type ConnectionStatus } from "~/collab/crdt-store.js";
import { CursorOverlay } from "~/collab/CursorOverlay.js";

export default function CollabPage() {
	const [userName, setUserName] = createSignal("");
	const [joined, setJoined] = createSignal(false);
	const docId = "demo-doc-001";

	function handleJoin() {
		const name = userName().trim();
		if (!name) return;

		collabStore.initDocument(docId, "Collaborative Document");
		collabStore.connect(docId, name);
		setJoined(true);
	}

	onCleanup(() => {
		collabStore.disconnect();
	});

	function handleMouseMove(e: MouseEvent) {
		if (joined()) {
			collabStore.sendCursor(e.clientX, e.clientY);
		}
	}

	onMount(() => {
		document.addEventListener("mousemove", handleMouseMove);
		onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
	});

	return (
		<main class="min-h-screen p-8">
			<div class="mx-auto max-w-4xl">
				<h1 class="text-3xl font-bold text-zinc-50">Real-Time Collaboration</h1>
				<p class="mt-2 text-sm text-zinc-400">
					CRDT-based editing with human and AI participants
				</p>

				<Show when={!joined()}>
					<div class="mt-8">
						<Card title="Join Session" variant="outlined">
							<div class="flex gap-3 mt-2">
								<input
									type="text"
									placeholder="Your name..."
									value={userName()}
									onInput={(e) => setUserName(e.currentTarget.value)}
									onKeyPress={(e) => e.key === "Enter" && handleJoin()}
									class="h-10 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<Button label="Join" variant="primary" onClick={handleJoin} />
							</div>
						</Card>
					</div>
				</Show>

				<Show when={joined()}>
					{/* Status Bar */}
					<div class="mt-6 flex items-center gap-4">
						<StatusBadge status={collabStore.status()} />
						<span class="text-xs text-zinc-500">
							{collabStore.users().length} participant{collabStore.users().length !== 1 ? "s" : ""}
						</span>
						<div class="flex -space-x-2">
							<For each={collabStore.users()}>
								{(user) => (
									<div
										class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-950 text-xs font-bold text-white"
										style={{ "background-color": user.color }}
										title={user.isAI ? `AI: ${user.name}` : user.name}
									>
										{user.isAI ? "AI" : user.name.charAt(0).toUpperCase()}
									</div>
								)}
							</For>
						</div>
						<div class="ml-auto">
							<Button label="Leave" variant="ghost" size="sm" onClick={() => {
								collabStore.disconnect();
								setJoined(false);
							}} />
						</div>
					</div>

					{/* Editor */}
					<div class="mt-4">
						<Card variant="default" padding="none">
							<div class="border-b border-zinc-800 px-4 py-2">
								<span class="text-sm font-medium text-zinc-300">
									{collabStore.document()?.title ?? "Untitled"}
								</span>
								<Show when={collabStore.document()}>
									<span class="ml-2 text-xs text-zinc-600">
										v{collabStore.document()!.version}
									</span>
								</Show>
							</div>
							<textarea
								value={collabStore.document()?.content ?? ""}
								onInput={(e) => collabStore.sendUpdate(e.currentTarget.value)}
								class="min-h-[400px] w-full resize-y bg-zinc-950 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
								placeholder="Start typing... other participants will see your changes in real-time."
							/>
						</Card>
					</div>

					{/* AI Agent Panel */}
					<div class="mt-4">
						<Card title="AI Collaborators" description="AI agents participate as first-class editing peers">
							<div class="mt-3 grid grid-cols-2 gap-3">
								<button class="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-left transition-colors hover:border-blue-600">
									<p class="text-sm font-medium text-zinc-200">Writing Assistant</p>
									<p class="mt-1 text-xs text-zinc-500">Suggests edits and improvements</p>
								</button>
								<button class="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-left transition-colors hover:border-blue-600">
									<p class="text-sm font-medium text-zinc-200">Code Generator</p>
									<p class="mt-1 text-xs text-zinc-500">Generates code from descriptions</p>
								</button>
							</div>
						</Card>
					</div>

					<CursorOverlay users={collabStore.users()} />
				</Show>
			</div>
		</main>
	);
}

function StatusBadge(props: { status: ConnectionStatus }) {
	const config: Record<ConnectionStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
		connected: { label: "Connected", variant: "success" },
		connecting: { label: "Connecting...", variant: "warning" },
		disconnected: { label: "Disconnected", variant: "danger" },
		error: { label: "Error", variant: "danger" },
	};

	const c = () => config[props.status];
	return <Badge label={c().label} variant={c().variant} />;
}
