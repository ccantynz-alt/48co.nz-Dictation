import type { Context } from "hono";

export interface TrpcContext {
	userId: string | null;
}

export function createContext(c: Context): TrpcContext {
	return {
		userId: null,
	};
}
