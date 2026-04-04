/**
 * npm Registry Watcher — monitors package releases and version bumps.
 * Checks hourly for updates to tracked packages.
 */

import { z } from "zod";

export const NpmPackageInfoSchema = z.object({
	name: z.string(),
	version: z.string(),
	description: z.string().optional(),
	publishedAt: z.string(),
	isNew: z.boolean(),
});

export type NpmPackageInfo = z.infer<typeof NpmPackageInfoSchema>;

export const TRACKED_PACKAGES = [
	"next",
	"@remix-run/node",
	"@sveltejs/kit",
	"@builder.io/qwik",
	"astro",
	"hono",
	"solid-js",
	"@solidjs/start",
	"@trpc/server",
	"ai",
	"langchain",
	"drizzle-orm",
	"@biomejs/biome",
	"tailwindcss",
	"bun-types",
	"@cloudflare/workers-types",
	"@libsql/client",
	"zod",
	"vinxi",
] as const;

export async function checkPackageVersion(
	packageName: string,
): Promise<NpmPackageInfo | null> {
	try {
		const response = await fetch(
			`https://registry.npmjs.org/${packageName}/latest`,
		);

		if (!response.ok) return null;

		const data = (await response.json()) as {
			name: string;
			version: string;
			description?: string;
		};

		// Get publish time from the full package metadata
		const metaResponse = await fetch(
			`https://registry.npmjs.org/${packageName}`,
		);
		const meta = (await metaResponse.json()) as {
			time?: Record<string, string>;
		};

		const publishedAt = meta.time?.[data.version] ?? new Date().toISOString();

		return {
			name: data.name,
			version: data.version,
			description: data.description,
			publishedAt,
			isNew: false,
		};
	} catch {
		return null;
	}
}

export async function checkAllPackages(): Promise<NpmPackageInfo[]> {
	const results = await Promise.allSettled(
		TRACKED_PACKAGES.map((pkg) => checkPackageVersion(pkg)),
	);

	return results
		.filter(
			(r): r is PromiseFulfilledResult<NpmPackageInfo | null> =>
				r.status === "fulfilled" && r.value !== null,
		)
		.map((r) => r.value!);
}
