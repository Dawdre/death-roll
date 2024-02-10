import type { Player } from "@/composables/useEventSource";
import { BASE_AZURE_ENDPOINT_URL, fetchPost } from "./api";

const LATEST_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/recentMatches`;

export interface RecentMatches {
  gameID: string
  gameDate: string
  tokenPot: string
  winner: string
  players: Array<Player>
}

export async function fetchRecentMatches() {
  return await fetchPost<Array<RecentMatches>>(LATEST_ENDPOINT_URL);
}