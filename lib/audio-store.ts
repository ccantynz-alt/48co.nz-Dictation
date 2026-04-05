interface AudioReference {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

/**
 * In-memory audio store. Will be replaced with cloud storage
 * (Vercel Blob, S3) in a future phase.
 */
const store: Map<string, { reference: AudioReference; blob: Blob }> = (() => {
  if (!(globalThis as any).__audioStore) {
    (globalThis as any).__audioStore = new Map();
  }
  return (globalThis as any).__audioStore;
})();

export type { AudioReference };
export const audioStore = store;
