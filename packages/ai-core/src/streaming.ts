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
