import { BASE_ENDPOINT_URL, fetchPost } from "./api";

const LATEST_ENDPOINT_URL = `${BASE_ENDPOINT_URL}/recentMatches`;

interface RecentMatches {
  gameID: string
  gameDate: string
  tokenPot: string
  winner: string
}

export async function fetchRecentMatches() {
  return await fetchPost<Array<RecentMatches>>(LATEST_ENDPOINT_URL);
}