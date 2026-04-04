/**
 * Cloudflare Worker entry point for the BTF API.
 * Runs at the edge in 330+ cities worldwide.
 * Sub-5ms cold starts.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors({ origin: "*", credentials: true }));

app.get("/", (c) =>
	c.json({
		name: "Back to the Future API (Edge)",
		version: "0.1.0",
		region: c.req.header("cf-ipcountry") ?? "unknown",
		colo: c.req.header("cf-ray")?.split("-")[1] ?? "unknown",
	}),
);

app.get("/health", (c) =>
	c.json({
		status: "ok",
		tier: "edge",
		timestamp: new Date().toISOString(),
	}),
);

export default app;
