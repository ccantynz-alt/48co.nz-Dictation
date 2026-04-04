import { Hono } from "hono";

export const healthRouter = new Hono();

healthRouter.get("/health", (c) => {
	return c.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		runtime: "bun",
		version: "0.0.1",
	});
});

healthRouter.get("/", (c) => {
	return c.json({
		name: "Back to the Future API",
		version: "0.0.1",
		docs: "/trpc",
	});
});
