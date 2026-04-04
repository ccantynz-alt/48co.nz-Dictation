/**
 * tRPC Hono adapter — serves tRPC routes via Hono middleware.
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { Context } from "hono";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";

export async function trpcServer(c: Context) {
	return fetchRequestHandler({
		endpoint: "/trpc",
		req: c.req.raw,
		router: appRouter,
		createContext: () => createContext(c),
	});
}
