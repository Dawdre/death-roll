const AUTH_ENDPOINT_URL = "https://ashypls.com/data/apps/DR/Service/Service.asmx/userAuth"
const USER_INFO_ENDPOINT_URL = "https://ashypls.com/data/apps/DR/Service/Service.asmx/userInfo"
const CREATE_LOBBY_ENDPOINT_URL = "https://ashypls.com/data/apps/DR/Service/Service.asmx/createLobby"

export interface AuthenticatedUser {
  id: string
  name: string
  pwd: string
  auth: string
  tokenCount: number
  rollsWon: number
  rollsLost: number
  passesCount: number
}

export interface Lobby {
  id: string
  name: string
  hostID: string
  players: Array<string>
  startGame: boolean
}


async function fetchPost<T>(url: string, data: unknown): Promise<T> {
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

export async function getUserInfo<T>(data: T): Promise<AuthenticatedUser> {
  return await fetchPost<AuthenticatedUser>(USER_INFO_ENDPOINT_URL, data)
}

export async function createLobby<T>(data: T) {
  return await fetchPost<Lobby>(CREATE_LOBBY_ENDPOINT_URL, data)
}