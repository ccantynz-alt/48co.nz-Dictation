/**
 * Three-tier compute model: Client GPU → Edge → Cloud.
 * Automatically routes AI workloads to the cheapest tier that meets constraints.
 *
 * CLIENT GPU (WebGPU) — $0/token, sub-10ms, models <2B params
 * EDGE (Cloudflare Workers) — sub-50ms, lightweight inference
 * CLOUD (Modal.com GPUs) — Full H100 power, heavy inference
 */

export type ComputeTier = "client" | "edge" | "cloud";

export interface ComputeCapabilities {
	tier: ComputeTier;
	webgpuAvailable: boolean;
	webgpuAdapter: string | null;
	estimatedVramMB: number;
	maxModelParams: number;
	supportsF16: boolean;
	devicePixelRatio: number;
	hardwareConcurrency: number;
}

export interface ComputeRequest {
	modelParams: number;
	requiresGPU: boolean;
	maxLatencyMs: number;
	preferCheapest: boolean;
}

export function detectComputeTier(request: ComputeRequest, capabilities: ComputeCapabilities): ComputeTier {
	// Client GPU: free, fastest for small models
	if (
		capabilities.webgpuAvailable &&
		request.modelParams <= capabilities.maxModelParams &&
		request.maxLatencyMs >= 10
	) {
		return "client";
	}

	// Edge: sub-50ms, handles mid-range tasks
	if (request.modelParams <= 7_000_000_000 && request.maxLatencyMs >= 50) {
		return "edge";
	}

	// Cloud: full power for everything else
	return "cloud";
}

export async function getCapabilities(): Promise<ComputeCapabilities> {
	const isServer = typeof globalThis.navigator === "undefined";

	if (isServer) {
		return {
			tier: "cloud",
			webgpuAvailable: false,
			webgpuAdapter: null,
			estimatedVramMB: 0,
			maxModelParams: 0,
			supportsF16: false,
			devicePixelRatio: 1,
			hardwareConcurrency: 1,
		};
	}

	const hasWebGPU = "gpu" in navigator;
	let adapterName: string | null = null;
	let estimatedVram = 0;
	let supportsF16 = false;

	if (hasWebGPU) {
		try {
			const gpu = navigator.gpu;
			const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
			if (adapter) {
				adapterName = (adapter as unknown as { name?: string }).name ?? "unknown";
				supportsF16 = adapter.features.has("shader-f16");

				// Estimate VRAM from adapter limits
				const maxBuffer = adapter.limits.maxBufferSize;
				estimatedVram = Math.round(maxBuffer / (1024 * 1024));
			}
		} catch {
			// WebGPU detection failed silently
		}
	}

	// Estimate max model params from VRAM
	// Rule of thumb: 1B params ≈ 2GB VRAM (fp16) or 4GB (fp32)
	const maxParams = supportsF16
		? Math.floor((estimatedVram / 2000) * 1_000_000_000)
		: Math.floor((estimatedVram / 4000) * 1_000_000_000);

	return {
		tier: hasWebGPU ? "client" : "edge",
		webgpuAvailable: hasWebGPU,
		webgpuAdapter: adapterName,
		estimatedVramMB: estimatedVram,
		maxModelParams: Math.min(maxParams, 8_000_000_000), // Cap at 8B
		supportsF16,
		devicePixelRatio: globalThis.devicePixelRatio ?? 1,
		hardwareConcurrency: navigator.hardwareConcurrency ?? 1,
	};
}

/**
 * Fallback chain: Client → Edge → Cloud. Never drop a request.
 */
export function getFallbackTier(currentTier: ComputeTier): ComputeTier | null {
	switch (currentTier) {
		case "client":
			return "edge";
		case "edge":
			return "cloud";
		case "cloud":
			return null; // No fallback — queue and notify
	}
}

export interface TierConfig {
	client: { enabled: boolean; maxModelParams: number };
	edge: { url: string; apiKey?: string };
	cloud: { url: string; apiKey?: string; model: string };
}

export const defaultTierConfig: TierConfig = {
	client: { enabled: true, maxModelParams: 2_000_000_000 },
	edge: { url: "https://ai.cloudflare.com/v1" },
	cloud: { url: "https://api.openai.com/v1", model: "gpt-4o-mini" },
};
