import { BASE_AZURE_ENDPOINT_URL, fetchPost } from "./api";

const LATEST_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/leaderboard`;

export interface Leaderboard {
  player: string
  playerAvatar: string
  tokens: number
  showCrown: boolean
}

export async function fetchLeaderboard() {
  return await fetchPost<Array<Leaderboard>>(LATEST_ENDPOINT_URL);
}