/**
 * Cursor presence overlay — shows remote user cursors in real-time.
 */

import { For, Show } from "solid-js";
import type { CollabUser } from "./crdt-store.js";

export function CursorOverlay(props: { users: CollabUser[] }) {
	return (
		<div class="pointer-events-none fixed inset-0 z-30">
			<For each={props.users}>
				{(user) => (
					<Show when={user.cursor}>
						<div
							class="absolute transition-transform duration-75"
							style={{
								transform: `translate(${user.cursor!.x}px, ${user.cursor!.y}px)`,
							}}
						>
							{/* Cursor arrow */}
							<svg
								width="16"
								height="20"
								viewBox="0 0 16 20"
								fill="none"
								style={{ color: user.color }}
							>
								<path
									d="M0 0L16 12H6L4 20L0 0Z"
									fill="currentColor"
								/>
							</svg>
							{/* Name label */}
							<span
								class="ml-4 -mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium text-white"
								style={{ "background-color": user.color }}
							>
								{user.isAI ? `AI: ${user.name}` : user.name}
							</span>
						</div>
					</Show>
				)}
			</For>
		</div>
	);
}
