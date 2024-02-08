import { LOBBY_STREAM_URL, GAME_STREAM_URL } from "@/api/api";
import { ref } from "vue";

interface EventSourceLobby {
  id: string
  name: string
  hostID: string
  players: Array<Player>
  startGame: boolean
  lobbyPot: number
  gameID: string
}

interface Player {
  id: string
  name: string
  tokens: number
  avatar: string
  isOut: boolean
  roundsRolled: Array<number>
}

interface EventSourceGame {
  id: string
  gameLobby: EventSourceLobby
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

export interface ActionHistory {
  playerID: string
  roll: number
  type: string
  actionDetails: string
}

export interface StreamParams extends Record<string, string | undefined> {
  lobby?: string
  game?: string
  user?: string
}

const isGameUrl = (flag: boolean) => {
  if (flag) {
    return GAME_STREAM_URL;
  } else { 
    return LOBBY_STREAM_URL;
  }
}

export function useEventSource(isGameData: boolean) {
  const eventSource = ref<EventSource | null>(null);
  const eventSourceData = ref<EventSourceLobby>();
  const eventSourceGameData = ref<EventSourceGame>();
  const eventSourceError = ref('');

  const close = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
  }
  
  async function startStream(urlParams: StreamParams) {
    const params = new URLSearchParams(urlParams as Record<string, string>);
    eventSource.value = new EventSource(`${isGameUrl(isGameData)}?${params.toString()}`);  
    
    if (eventSource.value) {
      if (isGameData) {
        eventSource.value.addEventListener("gameCheck", (event) => {
          const eventData = JSON.parse(event.data)
      
          eventSourceGameData.value = eventData;
        });
      } else {
        eventSource.value.addEventListener("lobbyCheck", (event) => {
          const eventData = JSON.parse(event.data)
      
          eventSourceData.value = eventData;
        });
      }

      eventSource.value.addEventListener("error", (event: MessageEvent) => {
        if (event.data) {
          eventSourceError.value = event.data;
          close();
        }
      })
    }
  }

  

  return {
    eventSource,
    eventSourceData,
    eventSourceGameData,
    eventSourceError,
  
    startStream,
    closeEventSource: close
  };
}