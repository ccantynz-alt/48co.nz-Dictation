/**
 * AI Agent framework — multi-step, tool-calling agents.
 * Agents plan, execute, observe, and adapt.
 */

import { z } from "zod";

export const AgentToolSchema = z.object({
	name: z.string(),
	description: z.string(),
	parameters: z.record(z.unknown()),
});

export type AgentTool = z.infer<typeof AgentToolSchema>;

export const AgentStepSchema = z.object({
	id: z.string(),
	type: z.enum(["thought", "action", "observation", "result"]),
	content: z.string(),
	toolName: z.string().optional(),
	toolInput: z.record(z.unknown()).optional(),
	toolOutput: z.string().optional(),
	timestamp: z.number(),
});

export type AgentStep = z.infer<typeof AgentStepSchema>;

export const AgentSessionSchema = z.object({
	id: z.string(),
	agentType: z.string(),
	status: z.enum(["thinking", "acting", "waiting_approval", "completed", "failed"]),
	steps: z.array(AgentStepSchema),
	createdAt: z.number(),
	completedAt: z.number().optional(),
});

export type AgentSession = z.infer<typeof AgentSessionSchema>;

export interface AgentDefinition {
	name: string;
	description: string;
	systemPrompt: string;
	tools: AgentTool[];
	maxSteps: number;
	requiresApproval: (toolName: string) => boolean;
}

/**
 * Site Builder Agent — generates full pages from descriptions.
 */
export const siteBuilderAgent: AgentDefinition = {
	name: "site-builder",
	description: "Generates website pages from natural language descriptions using the component catalog.",
	systemPrompt: `You are an expert website builder. Given a description, you generate a complete page layout using the available component catalog.

Rules:
- Use ONLY components from the catalog
- Every component must have valid props matching its Zod schema
- Compose components into meaningful layouts
- Optimize for visual hierarchy and user experience
- Always include responsive considerations`,
	tools: [
		{
			name: "compose_page",
			description: "Compose a page from the component catalog",
			parameters: {
				description: { type: "string", description: "Page description" },
				style: { type: "string", enum: ["minimal", "corporate", "creative", "landing"] },
			},
		},
		{
			name: "suggest_components",
			description: "Suggest components for a given use case",
			parameters: {
				useCase: { type: "string", description: "What the user wants to build" },
			},
		},
		{
			name: "modify_layout",
			description: "Modify an existing page layout",
			parameters: {
				pageId: { type: "string" },
				instructions: { type: "string" },
			},
		},
	],
	maxSteps: 10,
	requiresApproval: (toolName) => toolName === "modify_layout",
};

/**
 * Video Builder Agent — orchestrates video processing pipelines.
 */
export const videoBuilderAgent: AgentDefinition = {
	name: "video-builder",
	description: "Orchestrates video processing: editing, effects, transitions, and encoding.",
	systemPrompt: `You are an expert video editor. You orchestrate video processing pipelines including cutting, effects, transitions, audio sync, and encoding.

Rules:
- Prefer client-side WebGPU processing when possible ($0 cost)
- Fall back to edge/cloud for heavy operations
- Always preserve original quality unless explicitly asked to compress
- Provide progress updates during long operations`,
	tools: [
		{
			name: "analyze_video",
			description: "Analyze video metadata, scenes, and content",
			parameters: {
				videoId: { type: "string" },
			},
		},
		{
			name: "apply_effect",
			description: "Apply a visual effect to a video segment",
			parameters: {
				videoId: { type: "string" },
				effect: { type: "string" },
				startTime: { type: "number" },
				endTime: { type: "number" },
			},
		},
		{
			name: "encode_video",
			description: "Encode/transcode video with specified settings",
			parameters: {
				videoId: { type: "string" },
				format: { type: "string" },
				quality: { type: "string" },
			},
		},
	],
	maxSteps: 20,
	requiresApproval: (toolName) => toolName === "encode_video",
};

export function createAgentSession(agentType: string): AgentSession {
	return {
		id: crypto.randomUUID(),
		agentType,
		status: "thinking",
		steps: [],
		createdAt: Date.now(),
	};
}

export function addStep(
	session: AgentSession,
	type: AgentStep["type"],
	content: string,
	tool?: { name: string; input?: Record<string, unknown>; output?: string },
): AgentSession {
	const step: AgentStep = {
		id: crypto.randomUUID(),
		type,
		content,
		toolName: tool?.name,
		toolInput: tool?.input,
		toolOutput: tool?.output,
		timestamp: Date.now(),
	};

	return {
		...session,
		steps: [...session.steps, step],
	};
}
