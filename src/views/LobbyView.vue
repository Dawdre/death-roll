<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { fetchGame, updatedLobbyPot } from '@/api/api'
import { useAsyncState, useDebounceFn, useClipboard } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useEventSource } from '@/composables/useEventSource'
import {
  NCard,
  NButton,
  NInputNumber,
  NNumberAnimation,
  NH2,
  useMessage,
  NResult,
  NAlert,
  NSkeleton
} from 'naive-ui'
import { useUserStore } from '@/stores/userStore'

// ⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣦⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⢿⣿⠟⠋⠉⠀⠀⠀⠀⠉⠑⠢⣄⡀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⢠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣦⡀
// ⠀⣀⠀⠀⢀⡏⠀⢀⣴⣶⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⠇
// ⣾⣿⣿⣦⣼⡀⠀⢺⣿⣿⡿⠃⠀⠀⠀⠀⣠⣤⣄⠀⠀⠈⡿⠋⠀
// ⢿⣿⣿⣿⣿⣇⠀⠤⠌⠁⠀⡀⢲⡶⠄⢸⣿⣿⣿⠀⠀⠀⡇⠀⠀
// ⠈⢿⣿⣿⣿⣿⣷⣄⡀⠀⠀⠈⠉⠓⠂⠀⠙⠛⠛⠠⠀⡸⠁⠀⠀
// ⠀⠀⠻⣿⣿⣿⣿⣿⣿⣷⣦⣄⣀⠀⠀⠀⠀⠑⠀⣠⠞⠁⠀⠀⠀
// ⠀⠀⠀⢸⡏⠉⠛⠛⠛⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀
// ⠀⠀⠀⠸⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⢿⣿⣿⣿⣿⡄⠀⠀⠀⠀
// ⠀⠀⠀⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⡀⠀⠀⠀
// ⠀⠀⠀⢸⣆⠀⠀⠀⠀UwU⠀⠀⠀⠀⠀⣿⣿⣿⣿⡇⠀⠀⠀
// ⠀⠀⠀⢸⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡟⠻⠿⠟⠀⠀⠀⠀
// ⠀⠀⠀⠀⣿⣿⣿⣿⣶⠶⠤⠤⢤⣶⣾⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠹⣿⣿⣿⠏⠀⠀⠀⠈⢿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠈⠉⠉⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀

import DRLobbyPage from '@/components/page/DRLobbyPage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRPlayer from '@/components/DRPlayer.vue'
import DRAllPlayers from '@/components/DRAllPlayers.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()
const tokenPot = ref(0)
const canStartGame = ref(true)
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
const isItYourTurn = computed(
  () => lobbyStream.value?.hostID === userStore.getUserStorageCredentials.ID
)

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
  if (lobbyStream.value?.players && lobbyStream.value.players.length < 2) {
    canStartGame.value = false
    return
  }

  await startGame()
}
</script>
<template>
  <d-r-lobby-page page-class="dr-lobby" :in-error="!!eventSourceError">
    <d-r-header />
    <template v-if="!lobbyStream && !eventSourceError">
      <n-skeleton
        style="grid-row: 2; grid-column: 1 / -1"
        :height="50"
        :sharp="false"
        size="medium"
      />
      <n-skeleton :sharp="false" :height="200" size="large" />
      <n-skeleton style="grid-column: 2" :sharp="false" :height="200" size="large" />
    </template>
    <template v-else-if="lobbyStream">
      <n-h2 class="dr-lobby__title">
        <img class="dr-lobby__title-img" src="/dice.png" alt="header-img" />
        <span @click="copyLobbyID(route.params.id as string)">
          {{ lobbyStream.name }}
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              fill="currentColor"
            ></path>
          </svg>
        </span>

        <div class="dr-lobby__title-caption">{{ route.params.id }}</div>
        <n-alert
          v-if="!canStartGame"
          title="You've just tried to play with yourself. Copy the code above and send to friends!"
          type="error"
          closable
        />
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
          <template v-if="isItYourTurn">
            <n-h2 class="dr-lobby__heading">POT</n-h2>
            <n-input-number
              v-model:value="tokenPot"
              clearable
              :step="500"
              :min="0"
              @update:value="handleUpdatePot(tokenPot)"
              @clear="tokenPot = 0"
            />
          </template>
        </n-card>
        <n-button
          v-if="isItYourTurn"
          class="dr-lobby__start"
          color="#ffc526"
          type="primary"
          @click="start"
        >
          Start Game
        </n-button>
      </div>
      <n-card class="dr-lobby__card dr-lobby__card--players" content-class="dr-lobby__card-content">
        <d-r-all-players :players="lobbyStream.players" :host-id="lobbyStream.hostID" />
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

    &-img {
      margin-right: 0.5rem;
    }

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
}
</style>
