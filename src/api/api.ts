const AUTH_ENDPOINT_URL = "https://ashypls.com/data/apps/DR/Service/Service.asmx/userAuth"

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