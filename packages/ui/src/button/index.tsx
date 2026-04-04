import { type JSX, splitProps, Show } from "solid-js";
import { type ButtonProps, ButtonSchema } from "@btf/schemas";

export function Button(rawProps: ButtonProps & { onClick?: () => void; children?: JSX.Element }): JSX.Element {
	const validated = ButtonSchema.parse(rawProps);
	const [local, rest] = splitProps(validated, ["variant", "size", "disabled", "loading", "fullWidth", "label", "icon", "iconPosition"]);

	const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

	const variantClasses: Record<string, string> = {
		default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
		primary: "bg-blue-600 text-white hover:bg-blue-700",
		secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
		destructive: "bg-red-600 text-white hover:bg-red-700",
		ghost: "hover:bg-zinc-100 hover:text-zinc-900",
		outline: "border border-zinc-200 bg-transparent hover:bg-zinc-100",
		link: "text-blue-600 underline-offset-4 hover:underline",
	};

	const sizeClasses: Record<string, string> = {
		sm: "h-8 px-3 text-xs",
		md: "h-10 px-4 text-sm",
		lg: "h-12 px-6 text-base",
		icon: "h-10 w-10",
	};

	return (
		<button
			class={`${baseClasses} ${variantClasses[local.variant]} ${sizeClasses[local.size]} ${local.fullWidth ? "w-full" : ""}`}
			disabled={local.disabled || local.loading}
			onClick={rawProps.onClick}
		>
			<Show when={local.loading}>
				<span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
			</Show>
			{rawProps.children ?? local.label}
		</button>
	);
}
