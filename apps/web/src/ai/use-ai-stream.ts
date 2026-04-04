/**
 * SolidJS hook for streaming AI responses via SSE.
 * Reactive signals update as tokens arrive.
 */

import { createSignal } from "solid-js";
import { parseSSEStream } from "@btf/ai-core";

export interface AIStreamState {
	text: string;
	isStreaming: boolean;
	error: string | null;
	tokensReceived: number;
}

export function useAIStream() {
	const [text, setText] = createSignal("");
	const [isStreaming, setIsStreaming] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [tokensReceived, setTokensReceived] = createSignal(0);

	let abortController: AbortController | null = null;

	async function stream(url: string, body?: Record<string, unknown>) {
		abort();
		setText("");
		setError(null);
		setTokensReceived(0);
		setIsStreaming(true);

		abortController = new AbortController();

		try {
			const response = await fetch(url, {
				method: body ? "POST" : "GET",
				headers: body ? { "Content-Type": "application/json" } : undefined,
				body: body ? JSON.stringify(body) : undefined,
				signal: abortController.signal,
			});

			if (!response.ok) {
				throw new Error(`Stream failed: ${response.status}`);
			}

			if (!response.body) {
				throw new Error("No response body");
			}

			for await (const event of parseSSEStream(response.body, abortController.signal)) {
				if (event.event === "token") {
					try {
						const parsed = JSON.parse(event.data) as { token: string };
						setText((prev) => prev + parsed.token);
						setTokensReceived((prev) => prev + 1);
					} catch {
						setText((prev) => prev + event.data);
						setTokensReceived((prev) => prev + 1);
					}
				} else if (event.event === "done") {
					break;
				} else if (event.event === "error") {
					setError(event.data);
					break;
				}
			}
		} catch (err) {
			if (err instanceof Error && err.name !== "AbortError") {
				setError(err.message);
			}
		} finally {
			setIsStreaming(false);
			abortController = null;
		}
	}

	function abort() {
		if (abortController) {
			abortController.abort();
			abortController = null;
		}
		setIsStreaming(false);
	}

	return { text, isStreaming, error, tokensReceived, stream, abort };
}
