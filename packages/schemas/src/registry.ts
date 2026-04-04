import { z, type ZodType } from "zod";

export const ComponentRegistryEntrySchema = z.object({
	name: z.string(),
	description: z.string(),
	category: z.enum(["layout", "input", "display", "feedback", "navigation", "overlay"]),
	schema: z.custom<ZodType>(),
});

export type ComponentRegistryEntry = z.infer<typeof ComponentRegistryEntrySchema>;

export type ComponentRegistry = Map<string, ComponentRegistryEntry>;

export function createComponentRegistry(entries: ComponentRegistryEntry[]): ComponentRegistry {
	const registry = new Map<string, ComponentRegistryEntry>();
	for (const entry of entries) {
		registry.set(entry.name, entry);
	}
	return registry;
}
