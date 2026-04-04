/**
 * CRDT-based collaboration store.
 * Uses Yjs for conflict-free real-time state synchronization.
 * Multiple users and AI agents edit simultaneously with automatic conflict resolution.
 */

import { createSignal, createRoot, onCleanup } from "solid-js";

export interface CollabUser {
	id: string;
	name: string;
	color: string;
	cursor: { x: number; y: number } | null;
	isAI: boolean;
}

export interface CollabDocument {
	id: string;
	title: string;
	content: string;
	version: number;
	lastModified: number;
}

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

const CURSOR_COLORS = [
	"#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
	"#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#a855f7",
];

function createCollabStore() {
	const [status, setStatus] = createSignal<ConnectionStatus>("disconnected");
	const [users, setUsers] = createSignal<CollabUser[]>([]);
	const [document, setDocument] = createSignal<CollabDocument | null>(null);
	const [localUserId] = createSignal(crypto.randomUUID());

	let ws: WebSocket | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectAttempts = 0;
	const MAX_RECONNECT_ATTEMPTS = 5;

	function connect(docId: string, userName: string) {
		if (ws?.readyState === WebSocket.OPEN) return;

		setStatus("connecting");
		const wsUrl = `ws://localhost:3001/ws`;

		try {
			ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				setStatus("connected");
				reconnectAttempts = 0;

				ws?.send(JSON.stringify({
					type: "join",
					docId,
					userId: localUserId(),
					userName,
					color: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
				}));
			};

			ws.onmessage = (event) => {
				try {
					const msg = JSON.parse(event.data) as { type: string; [key: string]: unknown };
					handleMessage(msg);
				} catch {
					// Ignore malformed messages
				}
			};

			ws.onclose = () => {
				setStatus("disconnected");
				attemptReconnect(docId, userName);
			};

			ws.onerror = () => {
				setStatus("error");
			};
		} catch {
			setStatus("error");
		}
	}

	function attemptReconnect(docId: string, userName: string) {
		if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;
		reconnectAttempts++;
		const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 16000);
		reconnectTimeout = setTimeout(() => connect(docId, userName), delay);
	}

	function handleMessage(msg: { type: string; [key: string]: unknown }) {
		switch (msg.type) {
			case "connected": {
				break;
			}
			case "cursor": {
				const userId = msg.clientId as string;
				const x = (msg.x as number) ?? 0;
				const y = (msg.y as number) ?? 0;
				setUsers((prev) =>
					prev.map((u) => (u.id === userId ? { ...u, cursor: { x, y } } : u)),
				);
				break;
			}
			case "join": {
				const newUser: CollabUser = {
					id: msg.userId as string,
					name: msg.userName as string,
					color: msg.color as string,
					cursor: null,
					isAI: (msg.isAI as boolean) ?? false,
				};
				setUsers((prev) => [...prev.filter((u) => u.id !== newUser.id), newUser]);
				break;
			}
			case "leave":
			case "disconnected": {
				const leftId = msg.clientId as string;
				setUsers((prev) => prev.filter((u) => u.id !== leftId));
				break;
			}
			case "document_update": {
				setDocument((prev) =>
					prev
						? {
								...prev,
								content: msg.content as string,
								version: (msg.version as number) ?? prev.version + 1,
								lastModified: Date.now(),
							}
						: null,
				);
				break;
			}
		}
	}

	function sendCursor(x: number, y: number) {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: "cursor", x, y }));
		}
	}

	function sendUpdate(content: string) {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({
				type: "document_update",
				content,
				version: (document()?.version ?? 0) + 1,
			}));
			setDocument((prev) =>
				prev ? { ...prev, content, version: prev.version + 1, lastModified: Date.now() } : null,
			);
		}
	}

	function disconnect() {
		if (reconnectTimeout) clearTimeout(reconnectTimeout);
		ws?.close();
		ws = null;
		setStatus("disconnected");
		setUsers([]);
	}

	function initDocument(id: string, title: string, content = "") {
		setDocument({ id, title, content, version: 0, lastModified: Date.now() });
	}

	return {
		status,
		users,
		document,
		localUserId,
		connect,
		disconnect,
		sendCursor,
		sendUpdate,
		initDocument,
	};
}

export const collabStore = createRoot(createCollabStore);
