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

/* ---------- Tennis (mirrors backend/app/tennis.py) ---------- */

export type Draw = 'mens-singles' | 'womens-singles'
export type MatchStatus = 'live' | 'completed' | 'scheduled'

export interface SetScore {
  games: number
  tiebreak?: number
  won: boolean
}

export interface Player {
  name: string
  short_name: string
  country?: string
  seed?: number
  winner: boolean
  sets: SetScore[]
}

export interface Match {
  id: string
  tournament_id: string
  draw: Draw
  round: string
  round_order: number
  status: MatchStatus
  status_detail: string
  start?: string
  players: Player[]
  summary?: string
}

export interface DrawStats {
  draw: Draw
  matches: number
  completed: number
  live: number
  scheduled: number
  retirements: number
  current_round?: string
  champion?: string
}

export interface Tournament {
  id: string
  name: string
  tour: 'ATP' | 'WTA'
  location?: string
  start_date: string
  end_date: string
  major: boolean
  draws: DrawStats[]
}

export interface TennisSnapshot {
  updated_at: string
  source: string
  stale: boolean
  tournaments: Tournament[]
  matches: Match[]
}

/**
 * The whole singles snapshot; the page filters it locally. With a backend this
 * calls /api/tennis. On GitHub Pages it reads data/tennis.json, which the deploy
 * workflow regenerates from the same backend code on a schedule.
 */
export async function getTennis(signal?: AbortSignal): Promise<TennisSnapshot> {
  const url = apiEnabled ? `${BASE_URL}/api/tennis` : `${import.meta.env.BASE_URL}data/tennis.json`
  const res = await fetch(url, { signal, cache: 'no-cache' })
  if (!res.ok) throw new Error(`Tennis data unavailable (${res.status})`)
  return res.json()
}
