/**
 * Immutable audit trail — every action permanently recorded.
 * Hash-chained entries for tamper detection (FRE 901/902 compliance).
 */

import { z } from "zod";

export const AuditEntrySchema = z.object({
	eventId: z.string().uuid(),
	timestamp: z.string(),
	actor: z.object({
		userId: z.string(),
		displayName: z.string().optional(),
		role: z.string().optional(),
	}),
	actorIp: z.string().optional(),
	action: z.enum(["CREATE", "READ", "UPDATE", "DELETE", "EXPORT", "SIGN", "LOGIN", "LOGOUT"]),
	resource: z.object({
		type: z.string(),
		id: z.string(),
	}),
	detail: z.record(z.unknown()).optional(),
	result: z.enum(["success", "failure"]),
	sessionId: z.string().optional(),
	previousHash: z.string(),
	entryHash: z.string(),
});

export type AuditEntry = z.infer<typeof AuditEntrySchema>;

// In-memory audit log (production uses WORM storage)
const auditLog: AuditEntry[] = [];
let lastHash = "genesis";

async function computeHash(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function recordAuditEvent(
	event: Omit<AuditEntry, "eventId" | "timestamp" | "previousHash" | "entryHash">,
): Promise<AuditEntry> {
	const entry: Omit<AuditEntry, "entryHash"> = {
		...event,
		eventId: crypto.randomUUID(),
		timestamp: new Date().toISOString(),
		previousHash: lastHash,
	};

	const entryHash = await computeHash(JSON.stringify(entry));
	const fullEntry: AuditEntry = { ...entry, entryHash };

	lastHash = entryHash;
	auditLog.push(fullEntry);

	return fullEntry;
}

export function getAuditLog(limit = 100, offset = 0): AuditEntry[] {
	return auditLog.slice(offset, offset + limit);
}

export async function verifyAuditChain(): Promise<{
	valid: boolean;
	brokenAt?: number;
}> {
	let expectedPrevHash = "genesis";

	for (let i = 0; i < auditLog.length; i++) {
		const entry = auditLog[i]!;
		if (entry.previousHash !== expectedPrevHash) {
			return { valid: false, brokenAt: i };
		}

		const { entryHash: _, ...rest } = entry;
		const computed = await computeHash(JSON.stringify(rest));
		if (computed !== entry.entryHash) {
			return { valid: false, brokenAt: i };
		}

		expectedPrevHash = entry.entryHash;
	}

	return { valid: true };
}
