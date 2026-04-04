/**
 * WebGPU capability detection for client-side AI inference.
 * Determines if the browser can run models locally ($0/token).
 */

import { getCapabilities, type ComputeCapabilities } from "@btf/ai-core";
import { createSignal, createRoot } from "solid-js";

export interface WebGPUStatus {
	available: boolean;
	adapter: string | null;
	vramMB: number;
	maxModelParams: number;
	supportsF16: boolean;
	checked: boolean;
}

function createWebGPUStore() {
	const [status, setStatus] = createSignal<WebGPUStatus>({
		available: false,
		adapter: null,
		vramMB: 0,
		maxModelParams: 0,
		supportsF16: false,
		checked: false,
	});

	const [capabilities, setCapabilities] = createSignal<ComputeCapabilities | null>(null);

	async function detect() {
		try {
			const caps = await getCapabilities();
			setCapabilities(caps);
			setStatus({
				available: caps.webgpuAvailable,
				adapter: caps.webgpuAdapter,
				vramMB: caps.estimatedVramMB,
				maxModelParams: caps.maxModelParams,
				supportsF16: caps.supportsF16,
				checked: true,
			});
			return caps;
		} catch {
			setStatus((prev) => ({ ...prev, checked: true }));
			return null;
		}
	}

	return { status, capabilities, detect };
}

export const webGPUStore = createRoot(createWebGPUStore);
