<script setup lang="ts">
import { fetchAuthenticatedUser, fetchGameTurn } from '@/api/api'
import { useEventSource } from '@/composables/useEventSource'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { NCard, NButton, NInput, NFormItem, NNumberAnimation } from 'naive-ui'

const route = useRoute()

const myRoll = ref('')

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

const gameUrlParams = {
  user: authenticatedUserId ?? '',
  game: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
}
const {
  eventSourceGameData: gameStream,
  startStream,
  closeEventSource,
  eventSourceError
} = useEventSource(true)

startStream(gameUrlParams)

const { state: gameTurn, execute: takeTurn } = useAsyncState(fetchGameTurn, null, {
  throwError: true,
  immediate: false
})

async function roll() {
  if (myRoll.value.startsWith(`/roll ${gameStream.value?.currentRoll}`)) {
    console.log('Rolling...', gameStream.value?.id)

    await takeTurn(0, {
      gameID: gameStream.value?.id,
      playerID: gameStream.value?.playerTurn,
      authID: userInfo.value?.auth,
      action: 'roll'
    })
  } else {
    console.log('Invalid roll command')
  }
}
</script>

<template>
  <n-card v-if="gameStream" title="Game">
    <h2>
      <n-number-animation :from="0" :to="gameStream.currentRoll" :show-separator="true" />
      {{ gameStream.winnerID ? 'Winner!' : '' }}
    </h2>
    <n-form-item>
      <n-input
        v-model:value="myRoll"
        :disabled="gameStream.playerTurn !== userInfo?.id"
        @keydown.enter="roll"
      />
    </n-form-item>
    <n-button v-if="gameStream.playerTurn === userInfo?.id" @click="roll">Roll!</n-button>
  </n-card>
  <div v-if="gameStream">{{ gameStream }}</div>
  <div>{{ userInfo?.auth }}</div>
</template>

<style scoped lang="scss">
/* Your style code here */
</style>
