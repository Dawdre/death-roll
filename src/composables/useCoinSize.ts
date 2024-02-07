import type { AuthenticatedUser } from "@/api/api";
import { computed, ref } from "vue";

enum CoinSize {
  RICH = "COIN_RICH",
  MIDDLE_CLASS = "COIN_MEDIUM",
  POOR = "COIN_SMOL",
}

export function useCoinSize(userInfo: AuthenticatedUser) {
  const coinSize = ref(0);

  if (!userInfo) {
    return { coinSize, getCoinSize: CoinSize.POOR };
  }
  
  const getCoinSize = computed(() => {
    coinSize.value = userInfo.tokenCount;

    if (coinSize.value > 0 && coinSize.value <= 1000) {
      return CoinSize.POOR;
    } else if (coinSize.value > 1000 && coinSize.value <= 10000) {
      return CoinSize.MIDDLE_CLASS;
    } else if (coinSize.value > 10000) {
      return CoinSize.RICH;
    }

    return CoinSize.POOR;
  });

  return { coinSize, getCoinSize };
}