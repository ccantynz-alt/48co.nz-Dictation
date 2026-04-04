import { z } from "zod";

export const ModalSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	size: z.enum(["sm", "md", "lg", "xl", "full"]).default("md"),
	closable: z.boolean().default(true),
	overlay: z.boolean().default(true),
});

export type ModalProps = z.infer<typeof ModalSchema>;
