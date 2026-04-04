/**
 * Streaming utilities for AI responses.
 * All AI responses are streamed — never block on a full response.
 */

export interface StreamOptions {
	onToken?: (token: string) => void;
	onComplete?: (fullText: string) => void;
	onError?: (error: Error) => void;
	signal?: AbortSignal;
}

export function createStreamHandler(options: StreamOptions) {
	let buffer = "";

	return {
		handleChunk(chunk: string): void {
			buffer += chunk;
			options.onToken?.(chunk);
		},
		complete(): void {
			options.onComplete?.(buffer);
		},
		error(err: Error): void {
			options.onError?.(err);
		},
		getBuffer(): string {
			return buffer;
		},
	};
}

/**
 * Parse Server-Sent Events from a ReadableStream.
 */
export async function* parseSSEStream(
	stream: ReadableStream<Uint8Array>,
	signal?: AbortSignal,
): AsyncGenerator<{ event: string; data: string }> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		while (true) {
			if (signal?.aborted) break;

			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";

			let currentEvent = "message";
			let currentData = "";

			for (const line of lines) {
				if (line.startsWith("event: ")) {
					currentEvent = line.slice(7).trim();
				} else if (line.startsWith("data: ")) {
					currentData = line.slice(6);
				} else if (line === "") {
					if (currentData) {
						yield { event: currentEvent, data: currentData };
						currentEvent = "message";
						currentData = "";
					}
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

/**
 * Create a TransformStream that converts AI chunks to SSE format.
 */
export function createSSETransformStream(): TransformStream<string, string> {
	let eventId = 0;
	return new TransformStream({
		transform(chunk, controller) {
			eventId++;
			controller.enqueue(`id: ${eventId}\nevent: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`);
		},
		flush(controller) {
			controller.enqueue(`event: done\ndata: ${JSON.stringify({ done: true })}\n\n`);
		},
	});
}
