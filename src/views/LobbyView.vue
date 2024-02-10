<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { fetchGame, updatedLobbyPot } from '@/api/api'
import { useAsyncState, useDebounceFn, useClipboard } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useEventSource } from '@/composables/useEventSource'
import { NCard, NButton, NInputNumber, NNumberAnimation, NH2, useMessage, NResult } from 'naive-ui'
import { useCoinSize } from '@/composables/useCoinSize'
import { useUserStore } from '@/stores/userStore'

import DRLobbyPage from '@/components/page/DRLobbyPage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRPlayer from '@/components/DRPlayer.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()
const tokenPot = ref(0)
const { copy } = useClipboard({ source: route.params.id[0] })

const lobbyURLParams = {
  lobby: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id,
  user: userStore.getUserStorageCredentials.ID ?? ''
}
const {
  eventSourceData: lobbyStream,
  startStream,
  closeEventSource,
  eventSourceError
} = useEventSource(false)

await startStream(lobbyURLParams)

const { state: game, execute: startGame } = useAsyncState(
  () =>
    fetchGame({
      lobbyID: lobbyURLParams.lobby
    }),
  null,
  {
    throwError: true,
    immediate: false
  }
)

const { execute: updatePot } = useAsyncState(
  () =>
    updatedLobbyPot({
      lobbyID: lobbyURLParams.lobby,
      tokenPot: tokenPot.value
    }),
  null,
  {
    immediate: false
  }
)

const debounceUpdatePot = useDebounceFn(updatePot, 1000, { maxWait: 4000 })
async function handleUpdatePot(value: number) {
  tokenPot.value = value
  await debounceUpdatePot(tokenPot.value)
}

const getUpdatedTokenCount = computed(
  () =>
    lobbyStream.value?.players.find((p) => p.id === userStore.getUserStorageCredentials.ID)?.tokens
)
const isHost = computed(() => lobbyStream.value?.hostID === userStore.getUserStorageCredentials.ID)

const { getCoinSize } = useCoinSize()

watchEffect(() => {
  if (lobbyStream.value?.startGame) {
    closeEventSource()

    router.push({
      name: 'game',
      params: {
        id: lobbyStream.value?.gameID
      }
    })
  }
})

function copyLobbyID(id: string) {
  copy(id)
  message.success('Lobby ID copied')
}

async function start() {
  await startGame()
}
</script>
<template>
  <d-r-lobby-page page-class="dr-lobby" :in-error="!!eventSourceError">
    <d-r-header />
    <template v-if="lobbyStream">
      <n-h2 class="dr-lobby__title" @click="copyLobbyID(route.params.id as string)">
        <img class="dr-lobby__title-img" src="/dice.png" alt="header-img" />
        {{ lobbyStream.name }}
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
            fill="currentColor"
          ></path>
        </svg>
        <div class="dr-lobby__title-caption">{{ route.params.id }}</div>
      </n-h2>
      <div class="dr-lobby__pot-container">
        <n-card class="dr-lobby__card dr-lobby__card--pot" content-class="dr-lobby__card-content">
          <n-h2 class="dr-lobby__heading">
            LOBBY POT
            <div class="dr-lobby__pot">
              <img :src="`/COIN_RICH.png`" alt="gold" />
              <n-number-animation :from="0" :to="lobbyStream.lobbyPot" :show-separator="true" />
            </div>
          </n-h2>
          <n-h2 class="dr-lobby__heading">POT</n-h2>
          <n-input-number
            v-if="isHost"
            v-model:value="tokenPot"
            clearable
            :step="500"
            :min="0"
            @update:value="handleUpdatePot(tokenPot)"
            @clear="tokenPot = 0"
          />
        </n-card>
        <n-button
          v-if="isHost"
          class="dr-lobby__start"
          color="#ffc526"
          type="primary"
          @click="start"
        >
          Start Game
        </n-button>
      </div>
      <n-card class="dr-lobby__card dr-lobby__card--players" content-class="dr-lobby__card-content">
        <n-h2 class="dr-lobby__heading">PLAYERS</n-h2>
        <div class="dr-lobby__players">
          <div
            :class="['dr-lobby__player', isHost ? 'dr-lobby__player--host' : '']"
            v-for="player in lobbyStream.players"
            :key="player.id"
          >
            <div class="dr-lobby__player-img">
              <img :src="player.avatar" :alt="player.name" />
            </div>
            <div class="dr-lobby__player-avatar">
              {{ player.name }}
              <div class="dr-lobby__player-tokens">
                <img
                  :src="`/${getCoinSize(player ?? userStore.getUser!).value}.png`"
                  alt="gold"
                />{{ player.tokens }}
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </template>
    <n-result v-if="eventSourceError" status="error" :title="eventSourceError">
      <template #footer>
        <n-button color="#ffc526" type="primary" @click="router.push({ name: 'home' })">
          BACK TO HOME
        </n-button>
      </template>
    </n-result>
    <template #footer>
      <d-r-player :lobby-token-count="getUpdatedTokenCount" />
    </template>
  </d-r-lobby-page>
</template>

<style lang="scss" scoped>
%heading {
  color: #ffc526;
  margin: 0;
}

.dr-lobby {
  &__title {
    @extend %heading;
    font-size: 2.3rem;

    cursor: pointer;
    justify-self: center;
    grid-row: 2;
    grid-column: 1 / -1;

    &-caption {
      font-size: 1.5rem;
      color: #fff;
      cursor: text;
      margin: -0.5rem 0 1rem 0;
    }
  }

  &__start {
    width: 100%;
  }

  &__card {
    background-color: rgb(14, 14, 17, 0.9);
    margin-bottom: 1rem;

    &-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &--pot {
      grid-column: 1;
    }

    &--players {
      grid-column: 2;
    }
  }

  &__pot {
    font-size: 2rem;
    color: #fff;

    img {
      margin-right: 0.5rem;
    }
  }

  &__heading {
    @extend %heading;
  }

  &__players {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__player {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: rgba(7, 7, 8, 0.9);
    border-radius: 8px;
    position: relative;

    @media screen and (max-width: 840px) {
      padding: 0.2rem 0.5rem;
      gap: 0.1rem;
    }

    &-img {
      display: flex;
      justify-content: center;
    }

    &--host {
      border: 1px solid #ffc526;

      &:before {
        content: ' ';
        width: 30px;
        background-image: url('/crown.png');
        height: 30px;
        background-repeat: no-repeat;
        position: absolute;
        z-index: 9999;
        top: -13px;
        right: -12px;
        transform: rotate(23deg);
      }
    }

    &-tokens {
      display: flex;
      align-items: center;
    }

    &-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      font-size: 1.2rem;
    }

    &-img {
      img {
        height: auto;
        width: 40px;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
      }
    }
  }
}
</style>
