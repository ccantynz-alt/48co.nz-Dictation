/**
 * Three-tier compute model: Client GPU → Edge → Cloud.
 * Automatically routes AI workloads to the cheapest tier that meets constraints.
 */

export type ComputeTier = "client" | "edge" | "cloud";

export interface ComputeCapabilities {
	tier: ComputeTier;
	webgpuAvailable: boolean;
	estimatedVram: number;
	maxModelParams: number;
}

export function detectComputeTier(modelParams: number, capabilities: ComputeCapabilities): ComputeTier {
	if (capabilities.webgpuAvailable && modelParams <= capabilities.maxModelParams) {
		return "client";
	}
	if (modelParams <= 7_000_000_000) {
		return "edge";
	}
	return "cloud";
}

export function getCapabilities(): ComputeCapabilities {
	const hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;

	return {
		tier: hasWebGPU ? "client" : "edge",
		webgpuAvailable: hasWebGPU,
		estimatedVram: 0,
		maxModelParams: hasWebGPU ? 2_000_000_000 : 0,
	};
}
