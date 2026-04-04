/**
 * GitHub Release Monitor — watches competitor repos for releases.
 * Tracks: Next.js, Remix, SvelteKit, Qwik, Astro, Hono, Solid, tRPC, AI SDK, LangChain
 */

import { z } from "zod";

export const GitHubReleaseSchema = z.object({
	repo: z.string(),
	tag: z.string(),
	name: z.string(),
	body: z.string(),
	publishedAt: z.string(),
	url: z.string(),
	isPrerelease: z.boolean(),
});

export type GitHubRelease = z.infer<typeof GitHubReleaseSchema>;

export const MONITORED_REPOS = [
	"vercel/next.js",
	"remix-run/remix",
	"sveltejs/kit",
	"QwikDev/qwik",
	"withastro/astro",
	"honojs/hono",
	"solidjs/solid",
	"trpc/trpc",
	"vercel/ai",
	"langchain-ai/langchainjs",
	"cloudflare/workers-sdk",
	"oven-sh/bun",
	"drizzle-team/drizzle-orm",
	"biomejs/biome",
	"tailwindlabs/tailwindcss",
] as const;

export interface CollectorConfig {
	githubToken?: string;
	pollIntervalMs: number;
	onRelease: (release: GitHubRelease) => void;
	onError: (error: Error) => void;
}

export async function checkLatestRelease(
	repo: string,
	token?: string,
): Promise<GitHubRelease | null> {
	try {
		const headers: Record<string, string> = {
			Accept: "application/vnd.github+json",
		};
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		const response = await fetch(
			`https://api.github.com/repos/${repo}/releases/latest`,
			{ headers },
		);

		if (!response.ok) {
			if (response.status === 404) return null;
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const data = (await response.json()) as {
			tag_name: string;
			name: string;
			body: string;
			published_at: string;
			html_url: string;
			prerelease: boolean;
		};

		return {
			repo,
			tag: data.tag_name,
			name: data.name ?? data.tag_name,
			body: data.body ?? "",
			publishedAt: data.published_at,
			url: data.html_url,
			isPrerelease: data.prerelease,
		};
	} catch {
		return null;
	}
}

export async function checkAllRepos(token?: string): Promise<GitHubRelease[]> {
	const results = await Promise.allSettled(
		MONITORED_REPOS.map((repo) => checkLatestRelease(repo, token)),
	);

	return results
		.filter(
			(r): r is PromiseFulfilledResult<GitHubRelease | null> =>
				r.status === "fulfilled" && r.value !== null,
		)
		.map((r) => r.value!);
}
