/**
 * Security middleware — rate limiting, OWASP protections, and request validation.
 */

import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

/**
 * In-memory rate limiter (production should use Cloudflare KV or Durable Objects).
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(options: {
	windowMs: number;
	maxRequests: number;
	keyGenerator?: (ip: string, path: string) => string;
}) {
	return createMiddleware(async (c, next) => {
		const ip = c.req.header("x-forwarded-for") ?? c.req.header("cf-connecting-ip") ?? "unknown";
		const key = options.keyGenerator
			? options.keyGenerator(ip, c.req.path)
			: `${ip}:${c.req.path}`;

		const now = Date.now();
		const entry = rateLimitStore.get(key);

		if (!entry || now > entry.resetAt) {
			rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
		} else {
			entry.count++;
			if (entry.count > options.maxRequests) {
				c.header("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
				return c.json(
					{ error: "Too many requests", retryAfter: entry.resetAt - now },
					429,
				);
			}
		}

		// Clean up expired entries periodically
		if (rateLimitStore.size > 10000) {
			for (const [k, v] of rateLimitStore) {
				if (now > v.resetAt) rateLimitStore.delete(k);
			}
		}

		await next();
	});
}

/**
 * Security headers middleware — OWASP best practices.
 */
export const securityHeaders = createMiddleware(async (c, next) => {
	await next();

	c.header("X-Content-Type-Options", "nosniff");
	c.header("X-Frame-Options", "DENY");
	c.header("X-XSS-Protection", "0"); // Modern browsers use CSP instead
	c.header("Referrer-Policy", "strict-origin-when-cross-origin");
	c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	c.header(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' ws://localhost:* http://localhost:*",
	);
	c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
});

/**
 * Request ID middleware — adds unique ID to every request for tracing.
 */
export const requestId = createMiddleware(async (c, next) => {
	const id = c.req.header("x-request-id") ?? crypto.randomUUID();
	c.header("X-Request-ID", id);
	await next();
});

/**
 * Input sanitization — basic XSS prevention for string inputs.
 */
export function sanitizeInput(input: string): string {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;");
}
