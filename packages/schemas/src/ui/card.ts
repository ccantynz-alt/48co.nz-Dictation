import { z } from "zod";

export const CardSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	variant: z.enum(["default", "outlined", "elevated"]).default("default"),
	padding: z.enum(["none", "sm", "md", "lg"]).default("md"),
	interactive: z.boolean().default(false),
});

export type CardProps = z.infer<typeof CardSchema>;
