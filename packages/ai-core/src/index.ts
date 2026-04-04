/**
 * @btf/ai-core — Shared AI utilities for the three-tier compute model.
 * Client GPU (WebGPU) → Edge (Cloudflare Workers) → Cloud (Modal.com)
 */

export { type ComputeTier, type ComputeCapabilities, detectComputeTier, getCapabilities } from "./compute-tier.js";
export { type StreamOptions, createStreamHandler } from "./streaming.js";
