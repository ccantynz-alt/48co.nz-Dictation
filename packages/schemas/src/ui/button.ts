import { z } from "zod";

export const buttonVariants = ["default", "primary", "secondary", "destructive", "ghost", "outline", "link"] as const;

export const ButtonSchema = z.object({
	variant: z.enum(buttonVariants).default("default"),
	size: z.enum(["sm", "md", "lg", "icon"]).default("md"),
	disabled: z.boolean().default(false),
	loading: z.boolean().default(false),
	fullWidth: z.boolean().default(false),
	label: z.string(),
	icon: z.string().optional(),
	iconPosition: z.enum(["left", "right"]).default("left"),
});

export type ButtonProps = z.infer<typeof ButtonSchema>;
export type ButtonVariant = (typeof buttonVariants)[number];
