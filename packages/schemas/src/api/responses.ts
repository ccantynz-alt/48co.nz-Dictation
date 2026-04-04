import { z } from "zod";

export const ApiErrorSchema = z.object({
	success: z.literal(false),
	error: z.object({
		code: z.string(),
		message: z.string(),
		details: z.record(z.unknown()).optional(),
	}),
});

export const ApiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
	z.object({
		success: z.literal(true),
		data: dataSchema,
	});

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;
export type ApiSuccessResponse<T> = { success: true; data: T };
