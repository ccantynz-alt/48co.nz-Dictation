import { type JSX, splitProps, Show } from "solid-js";
import { type InputProps, InputSchema } from "@btf/schemas";

export function Input(
	rawProps: InputProps & { value?: string; onInput?: (value: string) => void },
): JSX.Element {
	const validated = InputSchema.parse(rawProps);
	const [local] = splitProps(validated, [
		"type",
		"placeholder",
		"label",
		"error",
		"disabled",
		"required",
		"fullWidth",
	]);

	return (
		<div class={`flex flex-col gap-1.5 ${local.fullWidth ? "w-full" : ""}`}>
			<Show when={local.label}>
				<label class="text-sm font-medium text-zinc-200">
					{local.label}
					<Show when={local.required}>
						<span class="ml-1 text-red-500">*</span>
					</Show>
				</label>
			</Show>
			<input
				type={local.type}
				placeholder={local.placeholder}
				disabled={local.disabled}
				required={local.required}
				value={rawProps.value ?? ""}
				onInput={(e) => rawProps.onInput?.(e.currentTarget.value)}
				class={`h-10 rounded-md border bg-zinc-950 px-3 text-sm text-zinc-50 transition-colors placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
					local.error ? "border-red-500" : "border-zinc-800"
				}`}
			/>
			<Show when={local.error}>
				<p class="text-xs text-red-500">{local.error}</p>
			</Show>
		</div>
	);
}
