<script setup lang="ts">
import { fetchGameTurn } from '@/api/api'
import { useEventSource } from '@/composables/useEventSource'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NButton,
  NInput,
  NH2,
  NH3,
  NNumberAnimation,
  NTimeline,
  NTimelineItem,
  NScrollbar,
  NResult
} from 'naive-ui'
import { useUserStore } from '@/stores/userStore'

import DRGamePage from '@/components/page/DRGamePage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRPlayer from '@/components/DRPlayer.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const myRoll = ref('')
const timeline = ref<Array<HTMLElement | null>>([])

const gameUrlParams = {
  user: userStore.getUserStorageCredentials.ID ?? '',
  game: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
}
const { eventSourceGameData: gameStream, startStream, eventSourceError } = useEventSource(true)

startStream(gameUrlParams)

const { execute: takeTurn, isLoading } = useAsyncState(fetchGameTurn, null, {
  throwError: true,
  immediate: false
})

const getPlayer = (id: string) =>
  computed(() => gameStream.value?.gameLobby.players.find((player) => player.id === id))

watchEffect(() => {
  if (timeline.value) {
    const lastRef = [...timeline.value].pop()
    lastRef
      ?.closest('.n-timeline-item-content')
      ?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
})

async function roll() {
  if (myRoll.value.trim()) {
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
  <d-r-game-page page-class="dr-game">
    <d-r-header />
    <template v-if="gameStream && !gameStream?.gameEnded">
      <n-h2 class="dr-game__title">
        {{ gameStream.gameLobby.name }}
      </n-h2>

      <n-card class="dr-game__card">
        <div class="dr-game__content">
          <n-h2 class="dr-game__heading dr-game__heading--avatar">
            <img
              class="dr-game__avatar-img"
              :src="getPlayer(gameStream.playerTurn).value?.avatar"
              alt="avatar"
            />
            <template v-if="gameStream.winnerID">
              {{ getPlayer(gameStream.winnerID).value?.name }} WINS!
            </template>
            <template
              v-else-if="
                gameStream.playerTurn === userStore.getUser?.id &&
                !getPlayer(gameStream.playerTurn).value?.isOut
              "
            >
              IT'S YOUR TURN!
            </template>
            <template v-else-if="getPlayer(gameStream.playerTurn).value?.isOut">
              YOU ROLLED A 1 AND ARE OUT!
            </template>
            <template v-else>
              {{ getPlayer(gameStream.playerTurn).value?.name.toUpperCase() }}'S TURN!
            </template>
          </n-h2>

          <div class="dr-game__view">
            <div class="dr-game__board">
              <n-h3 v-if="!gameStream.winnerID && !isLoading" class="dr-game__sub-heading">
                <div style="color: #ffc526">Round {{ gameStream.gameRound }}</div>
                Current Roll
                <div class="dr-game__board-current-roll">
                  <n-number-animation
                    :from="0"
                    :to="gameStream.currentRoll"
                    :show-separator="true"
                  />
                </div>
              </n-h3>
              <div v-else-if="isLoading" class="dr-game__loading">
                <div class="dr-game__loading-dice">
                  <img
                    src="/dice.png"
                    alt="dice"
                    class="dr-game__loading-img animate__animated animate__wobble animate__infinite"
                  />
                  <img
                    src="/dice.png"
                    alt="dice"
                    class="dr-game__loading-img animate__animated animate__headShake animate__infinite"
                  />
                </div>
              </div>
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
          <span style="color: #ffc526; font-size: large">{{ userStore.getUser?.id }}</span>
          <span style="color: #ffc526; font-size: large">{{ gameStream.playerTurn }}</span>

          <template v-if="gameStream.playerTurn === userStore.getUser?.id">
            <n-input
              v-model:value="myRoll"
              :placeholder="`/roll ${gameStream.currentRoll}`"
              @keydown.enter="roll"
            />
            <n-button color="#ffc526" @click="roll"> Roll! </n-button>
          </template>
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
    <n-result
      v-else-if="!eventSourceError && gameStream?.gameEnded"
      status="success"
      :title="
        gameStream.winnerID
          ? `The game is over and ${getPlayer(gameStream.winnerID).value?.name} WINS!`
          : 'GAME OVER'
      "
    >
      <template #icon>
        {{ gameStream.winnerID ? '🏆' : '🎲' }}
      </template>
      <template #footer>
        <n-button color="#ffc526" type="primary" @click="router.push({ name: 'home' })">
          BACK TO HOME
        </n-button>
      </template>
    </n-result>
    <template #footer>
      <d-r-player />
    </template>
  </d-r-game-page>
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

  &__avatar-img {
    height: auto;
    width: 3rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  &__card {
    background-color: rgb(14, 14, 17, 0.9);
    opacity: 0.9;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__heading {
    color: #ffc526;
    margin: 0;

    &--avatar {
      display: flex;
      align-items: center;
    }
  }

  &__sub-heading {
    margin: 0;
  }

  &__view {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  &__board {
    flex: 1;

    &-current-roll {
      font-size: 2rem;
      color: #ffc526;
    }
  }

  &__action-history-container {
    border: 1px solid rgb(71, 71, 71);
    padding: 0.5rem;
    border-radius: 3px;
    flex: 1;
  }

  &__loading {
    &-dice {
      position: relative;
    }

    &-img {
      &:last-child {
        position: absolute;
        z-index: -1;
        left: 40px;
      }

      height: auto;
      width: 50px;
    }
  }
}
</style>
