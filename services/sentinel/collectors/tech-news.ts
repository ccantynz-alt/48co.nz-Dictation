/**
 * Tech News Scanner — monitors Hacker News and ArXiv for relevant posts.
 * Filtered for high-signal content (HN 100+ points, ArXiv cs.AI/cs.LG/cs.CL).
 */

import { z } from "zod";

export const NewsItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().optional(),
	source: z.enum(["hackernews", "arxiv"]),
	score: z.number().optional(),
	publishedAt: z.string(),
	relevanceScore: z.number().min(0).max(1),
	tags: z.array(z.string()),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

const RELEVANT_KEYWORDS = [
	"webgpu",
	"solidjs",
	"solid-start",
	"hono",
	"bun",
	"drizzle",
	"trpc",
	"edge computing",
	"cloudflare workers",
	"crdt",
	"yjs",
	"ai agent",
	"llm",
	"webllm",
	"transformers.js",
	"ai sdk",
	"langchain",
	"langraph",
	"rag",
	"vector database",
	"qdrant",
	"turso",
	"libsql",
	"passkey",
	"webauthn",
	"fido2",
	"tailwind",
	"biome",
	"turborepo",
];

export function calculateRelevance(title: string, url?: string): number {
	const text = `${title} ${url ?? ""}`.toLowerCase();
	let score = 0;
	let matches = 0;

	for (const keyword of RELEVANT_KEYWORDS) {
		if (text.includes(keyword)) {
			matches++;
			score += 1 / RELEVANT_KEYWORDS.length;
		}
	}

	return Math.min(score * 3, 1);
}

export async function fetchHackerNewsTop(minScore = 100): Promise<NewsItem[]> {
	try {
		const response = await fetch(
			"https://hacker-news.firebaseio.com/v0/topstories.json",
		);
		const ids = (await response.json()) as number[];

		const topIds = ids.slice(0, 50);

		const items = await Promise.all(
			topIds.map(async (id) => {
				const itemRes = await fetch(
					`https://hacker-news.firebaseio.com/v0/item/${id}.json`,
				);
				return itemRes.json() as Promise<{
					id: number;
					title: string;
					url?: string;
					score: number;
					time: number;
				}>;
			}),
		);

		return items
			.filter((item) => item.score >= minScore)
			.map((item) => ({
				id: `hn-${item.id}`,
				title: item.title,
				url: item.url,
				source: "hackernews" as const,
				score: item.score,
				publishedAt: new Date(item.time * 1000).toISOString(),
				relevanceScore: calculateRelevance(item.title, item.url),
				tags: [],
			}))
			.filter((item) => item.relevanceScore > 0);
	} catch {
		return [];
	}
}
