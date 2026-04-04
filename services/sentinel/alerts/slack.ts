/**
 * Slack alerting for Sentinel intelligence.
 * Tiered channels: #sentinel-critical, #sentinel-daily, #sentinel-weekly
 */

import { z } from "zod";
import type { ThreatAssessment } from "../analyzers/threat-analyzer.js";

export const SlackConfigSchema = z.object({
	criticalWebhookUrl: z.string().url().optional(),
	dailyWebhookUrl: z.string().url().optional(),
	weeklyWebhookUrl: z.string().url().optional(),
});

export type SlackConfig = z.infer<typeof SlackConfigSchema>;

export interface SlackMessage {
	channel: "critical" | "daily" | "weekly";
	text: string;
	blocks?: unknown[];
}

const THREAT_EMOJI: Record<string, string> = {
	critical: ":rotating_light:",
	high: ":warning:",
	medium: ":large_yellow_circle:",
	low: ":information_source:",
	info: ":mag:",
};

export function formatThreatAlert(assessment: ThreatAssessment): SlackMessage {
	const emoji = THREAT_EMOJI[assessment.threatLevel] ?? ":mag:";
	const channel = assessment.threatLevel === "critical" ? "critical" : "daily";

	const text = [
		`${emoji} *${assessment.threatLevel.toUpperCase()}* — ${assessment.title}`,
		"",
		assessment.description,
		"",
		`*Impact:* ${assessment.impactAreas.join(", ")}`,
		"",
		"*Recommended Actions:*",
		...assessment.recommendedActions.map((a) => `  - ${a}`),
	].join("\n");

	return { channel, text };
}

export async function sendSlackAlert(
	config: SlackConfig,
	message: SlackMessage,
): Promise<boolean> {
	const webhookUrl =
		message.channel === "critical"
			? config.criticalWebhookUrl
			: message.channel === "daily"
				? config.dailyWebhookUrl
				: config.weeklyWebhookUrl;

	if (!webhookUrl) return false;

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text: message.text, blocks: message.blocks }),
		});
		return response.ok;
	} catch {
		return false;
	}
}

export function formatDailyDigest(assessments: ThreatAssessment[]): SlackMessage {
	const grouped = {
		critical: assessments.filter((a) => a.threatLevel === "critical"),
		high: assessments.filter((a) => a.threatLevel === "high"),
		medium: assessments.filter((a) => a.threatLevel === "medium"),
		low: assessments.filter((a) => a.threatLevel === "low"),
		info: assessments.filter((a) => a.threatLevel === "info"),
	};

	const lines = [
		":newspaper: *Sentinel Daily Digest*",
		`_${new Date().toLocaleDateString()}_`,
		"",
	];

	for (const [level, items] of Object.entries(grouped)) {
		if (items.length > 0) {
			const emoji = THREAT_EMOJI[level] ?? ":mag:";
			lines.push(`${emoji} *${level.toUpperCase()}* (${items.length})`);
			for (const item of items) {
				lines.push(`  - ${item.title}`);
			}
			lines.push("");
		}
	}

	if (assessments.length === 0) {
		lines.push("_No significant activity detected._");
	}

	return { channel: "daily", text: lines.join("\n") };
}
