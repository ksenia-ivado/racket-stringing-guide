/**
 * Thin API client. In development, Vite proxies /api to the Python backend
 * (see vite.config.ts). Set VITE_API_URL to point somewhere else.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

/**
 * Whether a backend is available. True in dev (via the proxy) or when VITE_API_URL
 * is set. False for the static GitHub Pages build, which has no backend.
 */
export const apiEnabled = import.meta.env.DEV || Boolean(import.meta.env.VITE_API_URL)

export interface Health {
  status: string
  version: string
}

export async function getHealth(signal?: AbortSignal): Promise<Health> {
  const res = await fetch(`${BASE_URL}/api/health`, { signal })
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
  return res.json()
}
