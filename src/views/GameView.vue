<script setup lang="ts">
import { fetchGameTurn } from '@/api/api'
import { useEventSource } from '@/composables/useEventSource'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import {
  NCard,
  NButton,
  NInput,
  NH2,
  NH3,
  NNumberAnimation,
  NTimeline,
  NTimelineItem,
  NScrollbar
} from 'naive-ui'
import { useUserStore } from '@/stores/userStore'

import DRPage from '@/components/DRPage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRPlayer from '@/components/DRPlayer.vue'

const route = useRoute()
const userStore = useUserStore()

const myRoll = ref('')
const timeline = ref<Array<HTMLElement | null>>([])

const gameUrlParams = {
  user: userStore.getUserStorageCredentials.ID ?? '',
  game: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
}
console.log(gameUrlParams)
const { eventSourceGameData: gameStream, startStream } = useEventSource(true)

startStream(gameUrlParams)

const { execute: takeTurn } = useAsyncState(fetchGameTurn, null, {
  throwError: true,
  immediate: false
})

const getPlayerName = (id: string) =>
  computed(() => gameStream.value?.gameLobby.players.find((player) => player.id === id)?.name)

watchEffect(() => {
  if (timeline.value) {
    const lastRef = [...timeline.value].pop()
    lastRef
      ?.closest('.n-timeline-item-content')
      ?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
})

async function roll() {
  if (myRoll.value.startsWith(`/roll ${gameStream.value?.currentRoll}`)) {
    console.log('Rolling...', gameStream.value?.id)

    await takeTurn(0, {
      gameID: gameStream.value?.id,
      playerID: gameStream.value?.playerTurn,
      authID: userStore.getUser?.auth,
      action: 'roll'
    })

    myRoll.value = ''
  } else {
    console.log('Invalid roll command')
  }
}
</script>

<template>
  <d-r-page page-class="dr-game">
    <d-r-header />
    <template v-if="gameStream">
      <n-h2 class="dr-game__title">
        {{ gameStream.gameLobby.name }}
      </n-h2>

      <n-card>
        <div class="dr-game__content">
          <n-h2 class="dr-game__heading">
            <template v-if="gameStream.winnerID">
              {{ getPlayerName(gameStream.winnerID).value }} WINS!
            </template>
            <template v-else-if="gameStream.playerTurn === userStore.getUser?.id">
              IT'S YOUR TURN!
            </template>
            <template v-else>
              {{ getPlayerName(gameStream.playerTurn).value?.toUpperCase() }}'S TURN!
            </template>
          </n-h2>

          <div class="dr-game__view">
            <div class="dr-game__board">
              <n-h3 v-if="!gameStream.winnerID" class="dr-game__sub-heading">
                The current roll is
                <n-number-animation :from="0" :to="gameStream.currentRoll" :show-separator="true" />
              </n-h3>
            </div>
            <div class="dr-game__action-history-container">
              <n-scrollbar style="max-height: 250px">
                <n-timeline class="dr-game__action-history">
                  <n-timeline-item
                    v-for="action in gameStream.actionHistory"
                    :key="action.playerID"
                  >
                    <span ref="timeline" style="text-shadow: 2px 2px black">{{
                      action.actionDetails
                    }}</span>
                  </n-timeline-item>
                </n-timeline>
              </n-scrollbar>
            </div>
          </div>

          <n-input
            v-if="gameStream.playerTurn === userStore.getUser?.id"
            v-model:value="myRoll"
            :placeholder="`/roll ${gameStream.currentRoll}`"
            @keydown.enter="roll"
          />
          <n-button
            v-if="gameStream.playerTurn === userStore.getUser?.id"
            color="#ffc526"
            @click="roll"
          >
            Roll!
          </n-button>
        </div>
      </n-card>
    </template>
    <d-r-player />
  </d-r-page>
</template>

<style scoped lang="scss">
.n-timeline .n-timeline-item:first-child {
  margin-top: 0.5rem;
}
.n-timeline.n-timeline--left-placement .n-timeline-item .n-timeline-item-content {
  display: flex;
}
.dr-game {
  &__title {
    margin: 0;
    color: #ffc526;
    font-size: 2rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__heading {
    color: #ffc526;
    margin: 0;
  }

  &__sub-heading {
    margin: 0;
  }

  &__view {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  &__board {
    flex: 1;
  }

  &__action-history-container {
    border: 1px solid rgb(71, 71, 71);
    padding: 0.5rem;
    border-radius: 3px;
    flex: 1;
  }
}
</style>
