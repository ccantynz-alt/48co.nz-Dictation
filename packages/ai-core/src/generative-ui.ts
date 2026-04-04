/**
 * Generative UI system — AI generates UI from component catalogs.
 * Zod schemas define what components exist. AI composes validated component trees.
 * No templates. No boilerplate. Pure generation.
 */

import { z, type ZodType } from "zod";

export interface ComponentSpec {
	name: string;
	description: string;
	category: "layout" | "input" | "display" | "feedback" | "navigation" | "overlay";
	schema: ZodType;
}

export interface ComponentNode {
	component: string;
	props: Record<string, unknown>;
	children?: ComponentNode[];
}

export const ComponentNodeSchema: z.ZodType<ComponentNode> = z.lazy(() =>
	z.object({
		component: z.string(),
		props: z.record(z.unknown()),
		children: z.array(ComponentNodeSchema).optional(),
	}),
);

export interface ComponentCatalog {
	components: Map<string, ComponentSpec>;
}

export function createComponentCatalog(specs: ComponentSpec[]): ComponentCatalog {
	const components = new Map<string, ComponentSpec>();
	for (const spec of specs) {
		components.set(spec.name, spec);
	}
	return { components };
}

/**
 * Validate a component tree against the catalog.
 * Every node must reference a known component with valid props.
 */
export function validateComponentTree(
	tree: ComponentNode,
	catalog: ComponentCatalog,
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	function validate(node: ComponentNode, path: string) {
		const spec = catalog.components.get(node.component);
		if (!spec) {
			errors.push(`${path}: Unknown component "${node.component}"`);
			return;
		}

		const result = spec.schema.safeParse(node.props);
		if (!result.success) {
			for (const issue of result.error.issues) {
				errors.push(`${path}.${issue.path.join(".")}: ${issue.message}`);
			}
		}

		if (node.children) {
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child) {
					validate(child, `${path}.children[${i}]`);
				}
			}
		}
	}

	validate(tree, "root");
	return { valid: errors.length === 0, errors };
}

/**
 * Generate a prompt for AI to compose UI from the catalog.
 */
export function generateCatalogPrompt(catalog: ComponentCatalog): string {
	const lines: string[] = [
		"You are a UI composition agent. Generate component trees using ONLY the components listed below.",
		"Each component must be valid according to its schema.",
		"Output valid JSON matching the ComponentNode format: { component, props, children? }",
		"",
		"## Available Components",
		"",
	];

	for (const [name, spec] of catalog.components) {
		lines.push(`### ${name}`);
		lines.push(`Category: ${spec.category}`);
		lines.push(`Description: ${spec.description}`);
		lines.push(`Schema: ${JSON.stringify(spec.schema._def, null, 2)}`);
		lines.push("");
	}

	return lines.join("\n");
}
