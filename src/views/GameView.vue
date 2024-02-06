<script setup lang="ts">
import { fetchAuthenticatedUser, fetchGameTurn } from '@/api/api'
import { useEventSource } from '@/composables/useEventSource'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NCard, NButton, NInput, NH2, NNumberAnimation, NTimeline, NTimelineItem } from 'naive-ui'

import DRPage from '@/components/DRPage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRPlayer from '@/components/DRPlayer.vue'

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
const { eventSourceGameData: gameStream, startStream } = useEventSource(true)

startStream(gameUrlParams)

const { state: gameTurn, execute: takeTurn } = useAsyncState(fetchGameTurn, null, {
  throwError: true,
  immediate: false
})

const getPlayerName = (id: string) =>
  computed(() => gameStream.value?.gameLobby.players.find((player) => player.id === id)?.name)

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
  <d-r-page page-class="dr-game">
    <d-r-header />
    <template v-if="gameStream">
      <n-h2 class="dr-game__heading" style="font-size: 2rem">
        {{ gameStream.gameLobby.name }}
      </n-h2>

      <n-card>
        <n-h2 class="dr-game__heading">
          <template v-if="gameStream.winnerID">
            {{ getPlayerName(gameStream.winnerID).value }} WINS!
          </template>
          <template v-else-if="gameStream.playerTurn === userInfo?.id"> IT'S YOUR TURN! </template>
          <template v-else>
            {{ getPlayerName(gameStream.playerTurn).value?.toUpperCase() }}'S TURN!
          </template>
        </n-h2>
        <n-h2 v-if="!gameStream.winnerID" style="text-shadow: 2px 2px black; margin-top: 0">
          The current roll is
          <n-number-animation :from="0" :to="gameStream.currentRoll" :show-separator="true" />
        </n-h2>
        <n-timeline>
          <n-timeline-item v-for="action in gameStream.actionHistory" :key="action.playerID">
            <span style="text-shadow: 2px 2px black">{{ action.actionDetails }}</span>
          </n-timeline-item>
        </n-timeline>
        <n-input
          v-if="gameStream.playerTurn === userInfo?.id"
          v-model:value="myRoll"
          @keydown.enter="roll"
        />
        <n-button v-if="gameStream.playerTurn === userInfo?.id" color="#ffc526" @click="roll">
          Roll!
        </n-button>
      </n-card>
    </template>
    <d-r-player />
  </d-r-page>
</template>

<style scoped lang="scss">
.dr-game {
  &__heading {
    color: #ffc526;
    margin: 0;
    text-shadow: 2px 2px black;
  }
}
</style>
