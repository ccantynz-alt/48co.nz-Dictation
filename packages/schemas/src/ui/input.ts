import { z } from "zod";

export const InputSchema = z.object({
	type: z.enum(["text", "email", "password", "number", "search", "tel", "url"]).default("text"),
	placeholder: z.string().optional(),
	label: z.string().optional(),
	error: z.string().optional(),
	disabled: z.boolean().default(false),
	required: z.boolean().default(false),
	fullWidth: z.boolean().default(false),
});

export type InputProps = z.infer<typeof InputSchema>;
