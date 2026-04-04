/**
 * RAG (Retrieval-Augmented Generation) pipeline.
 * Auto-index content → vector store → retrieval → augmented generation.
 * Every content source is automatically indexed.
 */

import { z } from "zod";

export const DocumentChunkSchema = z.object({
	id: z.string(),
	content: z.string(),
	metadata: z.record(z.string()).optional(),
	embedding: z.array(z.number()).optional(),
	sourceId: z.string(),
	sourceType: z.enum(["document", "webpage", "database", "api"]),
	chunkIndex: z.number().int().min(0),
	tokenCount: z.number().int().min(0),
});

export type DocumentChunk = z.infer<typeof DocumentChunkSchema>;

export const RetrievalResultSchema = z.object({
	chunks: z.array(DocumentChunkSchema),
	query: z.string(),
	totalResults: z.number().int(),
	searchTimeMs: z.number(),
});

export type RetrievalResult = z.infer<typeof RetrievalResultSchema>;

/**
 * Split text into chunks for embedding.
 * Uses sentence-boundary splitting with overlap.
 */
export function chunkText(
	text: string,
	options: { maxTokens?: number; overlap?: number } = {},
): string[] {
	const maxTokens = options.maxTokens ?? 512;
	const overlap = options.overlap ?? 50;

	// Approximate: 1 token ≈ 4 characters
	const maxChars = maxTokens * 4;
	const overlapChars = overlap * 4;

	const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? [text];
	const chunks: string[] = [];
	let current = "";

	for (const sentence of sentences) {
		if (current.length + sentence.length > maxChars && current.length > 0) {
			chunks.push(current.trim());
			// Keep overlap from end of previous chunk
			current = current.slice(-overlapChars) + sentence;
		} else {
			current += sentence;
		}
	}

	if (current.trim().length > 0) {
		chunks.push(current.trim());
	}

	return chunks;
}

/**
 * Create document chunks from raw text content.
 */
export function createDocumentChunks(
	sourceId: string,
	sourceType: DocumentChunk["sourceType"],
	content: string,
	metadata?: Record<string, string>,
): DocumentChunk[] {
	const textChunks = chunkText(content);

	return textChunks.map((text, index) => ({
		id: `${sourceId}-chunk-${index}`,
		content: text,
		metadata,
		sourceId,
		sourceType,
		chunkIndex: index,
		tokenCount: Math.ceil(text.length / 4),
	}));
}

/**
 * Format retrieved chunks as context for an LLM prompt.
 */
export function formatRetrievalContext(chunks: DocumentChunk[]): string {
	if (chunks.length === 0) return "No relevant context found.";

	return chunks
		.map(
			(chunk, i) =>
				`[Source ${i + 1}: ${chunk.sourceType}/${chunk.sourceId}]\n${chunk.content}`,
		)
		.join("\n\n---\n\n");
}

/**
 * Build a RAG-augmented prompt by combining user query with retrieved context.
 */
export function buildRAGPrompt(
	query: string,
	context: DocumentChunk[],
	systemPrompt?: string,
): string {
	const contextStr = formatRetrievalContext(context);
	const system = systemPrompt ?? "Answer the question based on the provided context. If the context does not contain relevant information, say so.";

	return `${system}\n\n## Context\n${contextStr}\n\n## Question\n${query}`;
}
