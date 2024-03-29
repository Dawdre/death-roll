import type { ActionHistory } from "@/composables/useEventSource"
import { createFetch, type UseFetchOptions } from "@vueuse/core"

export const BASE_URL = "https://ashypls-001-site1.ftempurl.com/apps/DR"
export const BASE_ENDPOINT_URL = "https://ashypls.com/data/apps/DR/Service/Service.asmx"
export const BASE_AZURE_ENDPOINT_URL = "https://ashypls-001-site1.ftempurl.com/apps/DR/Service/Service.asmx"

const AUTH_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/userAuth`
const USER_INFO_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/userInfo`
const CREATE_LOBBY_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/createLobby`
const CREATE_GAME_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/createGame`
const UPDATE_LOBBY_POT_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/updateLobbyPotInfo`
const GAME_TURN_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/gameTurn`

export const LOBBY_STREAM_URL = "https://ashypls-001-site1.ftempurl.com/apps/DR/Lobby"
export const GAME_STREAM_URL = "https://ashypls-001-site1.ftempurl.com/apps/DR/Game"

export interface AuthenticatedUser {
  id: string
  name: string
  pwd: string
  auth: string
  tokenCount: number
  rollsWon: number
  rollsLost: number
  passesCount: number
  avatar: string
  matchHistory: Array<MatchHistory>,
  playerRank: number,
  playerAchievements: Array<PlayerAchievement>,
  discordAccentColor: number,
  discordBanner: null,
}

export interface PlayerAchievement {
  achievementName: string
  ahcievementIcon: string
  count: number 
}

export interface MatchHistory {
  gameID: string
  gameDate: string
  tokenPot: number
  winner: string
  winnerAvatar: string
  players: Array<Player>
}

export interface Lobby {
  id: string
  name: string
  hostID: string
  players: Array<string>
  startGame: boolean
  lobbyPot: number
}

export interface Game {
  id: string
  gameLobby: Lobby
  gameStarted: boolean
  actionsPermitted: boolean
  turnOrder: Array<string>
  gameRound: number
  playerTurn: string
  currentRoll: number
  tokenPot: number
  actionHistory: Array<ActionHistory>
  gameEnded: boolean
  winnerID: string
}

interface GameTurn {
  gameID: string
  playerID: string
  authID: string
  action: string
}

export async function fetchPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export async function authUser<T>(data: T): Promise<AuthenticatedUser> {
  return await fetchPost<AuthenticatedUser>(AUTH_ENDPOINT_URL, data)
}

export async function fetchAuthenticatedUser<T>(data: T): Promise<AuthenticatedUser> {
  return await fetchPost<AuthenticatedUser>(USER_INFO_ENDPOINT_URL, data)
}

export async function fetchLobby<T>(data: T): Promise<Lobby> {
  return await fetchPost<Lobby>(CREATE_LOBBY_ENDPOINT_URL, data)
}

export async function fetchGame<T>(data: T): Promise<Game> {
  return await fetchPost<Game>(CREATE_GAME_ENDPOINT_URL, data)
}

export async function fetchGameTurn<T>(data: T) {
  return await fetchPost(GAME_TURN_ENDPOINT_URL, data)
}

export async function updatedLobbyPot<T>(data: T): Promise<Lobby> {
  return await fetchPost<Lobby>(UPDATE_LOBBY_POT_ENDPOINT_URL, data)
}

const defaultFetchOptions: UseFetchOptions = {
  immediate: true,
}

export function useApi<T = void>(url: string, { immediate }: UseFetchOptions = defaultFetchOptions) {
  const baseFetch = createFetch({
    baseUrl: `${BASE_URL}`,
    options: { immediate },
  });

  return baseFetch<T>(url).json();
}