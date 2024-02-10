import type { AuthenticatedUser } from "@/api/api";
import { computed, ref } from "vue";
import type { Player } from "./useEventSource";

enum CoinSize {
  RICH = "COIN_RICH",
  MIDDLE_CLASS = "COIN_MEDIUM",
  POOR = "COIN_SMOL",
}

function isPlayer(user: AuthenticatedUser | Player): user is Player {
  return (user as Player).tokens !== undefined;
}

export function useCoinSize() {
  const getCoinSize = (player: AuthenticatedUser | Player) => computed(() => {
    const coin = isPlayer(player) ? player.tokens : player.tokenCount;
    
    if (coin > 0 && coin <= 1000) {
      return CoinSize.POOR;
    } else if (coin > 1000 && coin <= 10000) {
      return CoinSize.MIDDLE_CLASS;
    } else if (coin > 10000) {
      return CoinSize.RICH;
    } else {
      return CoinSize.POOR;
    }
  });

  return { getCoinSize };
}