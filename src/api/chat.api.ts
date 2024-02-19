import { BASE_AZURE_ENDPOINT_URL, fetchPost } from "./api";

const CHAT_ENDPOINT_URL = `${BASE_AZURE_ENDPOINT_URL}/sendChat`;

export interface ChatMessage {
  gameID: string
  playerID: string
  message: string
}

export async function sendChatMessage(chatMessage: ChatMessage) {
  return await fetchPost(CHAT_ENDPOINT_URL, chatMessage);
}