import type { Player } from "@/composables/useEventSource"
import { useFetch } from "@vueuse/core"

const AUTH_ENDPOINT_URL = "https://ashypls-001-site1.ftempurl.com/apps/DR/Auth"

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