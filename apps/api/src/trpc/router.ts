/**
 * Root tRPC router — end-to-end type safety from API to client.
 * Change a type here, see the error in SolidStart instantly.
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import type { TrpcContext } from "./context.js";

const t = initTRPC.context<TrpcContext>().create({
	transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
	health: publicProcedure.query(() => {
		return {
			status: "ok" as const,
			timestamp: new Date().toISOString(),
		};
	}),

	echo: publicProcedure
		.input(z.object({ message: z.string() }))
		.query(({ input }) => {
			return { echo: input.message, timestamp: new Date().toISOString() };
		}),

	project: router({
		list: publicProcedure
			.input(
				z
					.object({
						limit: z.number().min(1).max(100).default(20),
						cursor: z.string().optional(),
					})
					.optional(),
			)
			.query(({ input }) => {
				return {
					items: [],
					nextCursor: null as string | null,
				};
			}),

		create: publicProcedure
			.input(
				z.object({
					name: z.string().min(1).max(255),
					description: z.string().optional(),
					type: z.enum(["website", "video", "document"]),
				}),
			)
			.mutation(({ input }) => {
				return {
					id: crypto.randomUUID(),
					...input,
					status: "draft" as const,
					createdAt: new Date().toISOString(),
				};
			}),
	}),

	ai: router({
		computeTier: publicProcedure.query(() => {
			return { tier: "edge" as const, available: true };
		}),
	}),
});

export type AppRouter = typeof appRouter;
