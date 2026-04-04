/**
 * Threat Analyzer — evaluates competitor moves and assesses impact.
 * Part of the LangGraph multi-agent intelligence system.
 */

import { z } from "zod";

export const ThreatLevelSchema = z.enum(["critical", "high", "medium", "low", "info"]);
export type ThreatLevel = z.infer<typeof ThreatLevelSchema>;

export const ThreatAssessmentSchema = z.object({
	id: z.string(),
	source: z.string(),
	title: z.string(),
	description: z.string(),
	threatLevel: ThreatLevelSchema,
	impactAreas: z.array(z.string()),
	recommendedActions: z.array(z.string()),
	competitorName: z.string().optional(),
	analysisDate: z.string(),
});

export type ThreatAssessment = z.infer<typeof ThreatAssessmentSchema>;

export function assessReleaseThreat(
	repo: string,
	releaseName: string,
	releaseBody: string,
): ThreatAssessment {
	const impactAreas: string[] = [];
	const recommendedActions: string[] = [];
	let threatLevel: ThreatLevel = "info";

	const body = releaseBody.toLowerCase();
	const name = releaseName.toLowerCase();

	// Check for major version bumps
	if (name.match(/\bv?\d+\.0\.0\b/) || name.includes("major")) {
		threatLevel = "high";
		impactAreas.push("architecture");
		recommendedActions.push("Review breaking changes for competitive impact");
	}

	// Check for AI-related features
	if (body.includes("ai") || body.includes("llm") || body.includes("agent")) {
		if (threatLevel === "info") threatLevel = "medium";
		impactAreas.push("ai-integration");
		recommendedActions.push("Analyze AI feature parity");
	}

	// Check for edge/performance improvements
	if (body.includes("edge") || body.includes("performance") || body.includes("faster")) {
		if (threatLevel === "info") threatLevel = "low";
		impactAreas.push("performance");
		recommendedActions.push("Run competitive benchmark");
	}

	// Check for WebGPU/GPU features
	if (body.includes("webgpu") || body.includes("gpu")) {
		threatLevel = "high";
		impactAreas.push("gpu-compute");
		recommendedActions.push("Assess our WebGPU advantage — are they catching up?");
	}

	// Check for real-time/collaboration
	if (body.includes("real-time") || body.includes("collaboration") || body.includes("crdt")) {
		threatLevel = "high";
		impactAreas.push("collaboration");
		recommendedActions.push("Verify our collaboration engine is ahead");
	}

	if (impactAreas.length === 0) {
		impactAreas.push("general");
		recommendedActions.push("Monitor for follow-up releases");
	}

	const competitor = repo.split("/")[0] ?? "unknown";

	return {
		id: crypto.randomUUID(),
		source: `github:${repo}`,
		title: `${competitor}: ${releaseName}`,
		description: `New release from ${repo}: ${releaseName}`,
		threatLevel,
		impactAreas,
		recommendedActions,
		competitorName: competitor,
		analysisDate: new Date().toISOString(),
	};
}
