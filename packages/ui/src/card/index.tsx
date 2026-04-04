import { type JSX, splitProps, Show } from "solid-js";
import { type CardProps, CardSchema } from "@btf/schemas";

export function Card(rawProps: CardProps & { children?: JSX.Element }): JSX.Element {
	const validated = CardSchema.parse(rawProps);
	const [local] = splitProps(validated, ["title", "description", "variant", "padding", "interactive"]);

	const variantClasses: Record<string, string> = {
		default: "border border-zinc-800 bg-zinc-950",
		outlined: "border-2 border-zinc-700 bg-transparent",
		elevated: "border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/20",
	};

	const paddingClasses: Record<string, string> = {
		none: "p-0",
		sm: "p-3",
		md: "p-5",
		lg: "p-8",
	};

	return (
		<div
			class={`rounded-lg ${variantClasses[local.variant]} ${paddingClasses[local.padding]} ${
				local.interactive ? "cursor-pointer transition-colors hover:border-zinc-600" : ""
			}`}
		>
			<Show when={local.title}>
				<h3 class="text-lg font-semibold text-zinc-50">{local.title}</h3>
			</Show>
			<Show when={local.description}>
				<p class="mt-1 text-sm text-zinc-400">{local.description}</p>
			</Show>
			<Show when={rawProps.children}>
				<div class={local.title || local.description ? "mt-4" : ""}>{rawProps.children}</div>
			</Show>
		</div>
	);
}
