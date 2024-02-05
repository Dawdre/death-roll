<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { fetchAuthenticatedUser, fetchGame, updatedLobbyPot } from '@/api/api'
import { useAsyncState, useDebounceFn } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useEventSource } from '@/composables/useEventSource'
import { NCard, NButton, NInputNumber, NFormItem, NNumberAnimation } from 'naive-ui'

const router = useRouter()
const route = useRoute()

const tokenPot = ref(0)

const authenticatedUserToken = localStorage.getItem('authenticatedUser')
const authenticatedUserId = localStorage.getItem('authenticatedUserId')

const authenticatedUser =
  authenticatedUserToken && authenticatedUserId
    ? {
        ID: authenticatedUserId,
        authID: authenticatedUserToken
      }
    : null

const { state: userInfo } = useAsyncState(() => fetchAuthenticatedUser(authenticatedUser), null, {
  throwError: true
})

const lobbyURLParams = {
  lobby: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id,
  user: authenticatedUserId ?? ''
}
const {
  eventSourceData: lobbyStream,
  startStream,
  closeEventSource,
  eventSourceError
} = useEventSource(false)

startStream(lobbyURLParams)

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

const { state: lobbyPot, execute: updatePot } = useAsyncState(
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

const debounceUpdatePot = useDebounceFn(updatePot, 5000)
async function handleUpdatePot(value: number) {
  tokenPot.value = value
  await debounceUpdatePot(tokenPot.value)
}

watchEffect(() => {
  if (lobbyStream.value?.lobbyPot) {
    // tokenPot.value = lobbyStream.value.lobbyPot
  }

  if (lobbyStream.value?.startGame) {
    console.log(lobbyStream.value, 'lobbyStream')

    closeEventSource()

    router.push({
      name: 'game',
      params: {
        id: game.value?.id
      }
    })
  }
})

async function start() {
  await startGame()
}
</script>
<template>
  <div class="dr-lobby">
    <h1>{{ lobbyStream?.name }} - {{ route.params.id }}</h1>
    {{ eventSourceError }}
    <template v-if="lobbyStream">
      <n-card title="Players">
        <div class="dr-lobby__players">
          <div class="dr-lobby__player" v-for="player in lobbyStream.players" :key="player.id">
            <img class="dr-lobby__player-img" :src="player.avatar" :alt="player.name" />
            <div>{{ player.name }}</div>
            <div>Tokens: {{ player.tokens }}</div>
          </div>
        </div>
      </n-card>
      <n-button v-if="lobbyStream.hostID === authenticatedUserId" type="primary" @click="start">
        Start Game
      </n-button>
      <n-form-item v-if="lobbyStream.hostID === authenticatedUserId" label="Pot">
        <n-input-number
          v-model:value="tokenPot"
          clearable
          :step="100"
          :min="0"
          @update:value="handleUpdatePot"
        />
      </n-form-item>
      {{ lobbyPot }}
      <h2>
        <n-number-animation :from="0" :to="tokenPot" :show-separator="true" />
      </h2>
    </template>
    <div>{{ userInfo?.name }} is logged in</div>
  </div>
</template>

<style scoped lang="scss">
.dr-lobby {
  display: grid;
  gap: 1rem;

  &__players {
    display: flex;
    gap: 1rem;
  }

  &__player {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &-img {
      height: auto;
      width: 80px;
      border-radius: 50%;
    }
  }
}
</style>
