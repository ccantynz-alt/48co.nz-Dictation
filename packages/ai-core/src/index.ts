/**
 * @btf/ai-core — Shared AI utilities for the three-tier compute model.
 * Client GPU (WebGPU) → Edge (Cloudflare Workers) → Cloud (Modal.com)
 */

export {
	type ComputeTier,
	type ComputeCapabilities,
	type ComputeRequest,
	type TierConfig,
	detectComputeTier,
	getCapabilities,
	getFallbackTier,
	defaultTierConfig,
} from "./compute-tier.js";

export {
	type StreamOptions,
	createStreamHandler,
	parseSSEStream,
	createSSETransformStream,
} from "./streaming.js";

export {
	type ComponentSpec,
	type ComponentNode,
	type ComponentCatalog,
	ComponentNodeSchema,
	createComponentCatalog,
	validateComponentTree,
	generateCatalogPrompt,
} from "./generative-ui.js";

export {
	type DocumentChunk,
	type RetrievalResult,
	DocumentChunkSchema,
	RetrievalResultSchema,
	chunkText,
	createDocumentChunks,
	formatRetrievalContext,
	buildRAGPrompt,
} from "./rag.js";

export {
	type AgentTool,
	type AgentStep,
	type AgentSession,
	type AgentDefinition,
	AgentToolSchema,
	AgentStepSchema,
	AgentSessionSchema,
	siteBuilderAgent,
	videoBuilderAgent,
	createAgentSession,
	addStep,
} from "./agents.js";
