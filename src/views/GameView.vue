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
  NResult,
  NSkeleton
} from 'naive-ui'
import { useUserStore } from '@/stores/userStore'
import particlesConfig from '@/particles.json'

import DRGamePage from '@/components/page/DRGamePage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRPlayer from '@/components/DRPlayer.vue'
import DRAllPlayers from '@/components/DRAllPlayers.vue'
import DRAchievements from '@/components/DRAchievements.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const myRoll = ref('')
const timeline = ref<Array<HTMLElement | null>>([])

const gameUrlParams = {
  user: userStore.getUserStorageCredentials.ID ?? '',
  game: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
}
const {
  eventSourceGameData: gameStream,
  startStream,
  eventSourceError,
  closeEventSource
} = useEventSource(true)

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
    <d-r-header @go-home="closeEventSource" />
    <template v-if="gameStream">
      <n-h2 class="dr-game__title">
        {{ gameStream.gameLobby.name }}
      </n-h2>

      <n-card class="dr-game__card">
        <div class="dr-game__content">
          <n-h2
            v-if="gameStream.winnerID && !isLoading"
            class="dr-game__heading dr-game__heading--avatar dr-game__heading--winner"
          >
            <img src="/crown.png" alt="crown" class="dr-game__heading-crown" />
            <n-skeleton
              v-if="!getPlayer(gameStream.playerTurn).value?.avatar"
              :sharp="false"
              circle
              height="80px"
              width="80px"
            />
            <img
              :class="[
                'dr-game__heading-avatar-img',
                gameStream.winnerID ? 'dr-game__heading-avatar-img--winner' : ''
              ]"
              :src="getPlayer(gameStream.playerTurn).value?.avatar"
              alt="avatar"
            />
            {{ getPlayer(gameStream.winnerID).value?.name }} WINS!
          </n-h2>
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
          <n-h2 v-else class="dr-game__heading dr-game__heading--avatar">
            <n-skeleton
              v-if="!getPlayer(gameStream.playerTurn).value?.avatar"
              :sharp="false"
              circle
              height="80px"
              width="80px"
            />
            <img
              :class="[
                'dr-game__heading-avatar-img',
                gameStream.winnerID ? 'dr-game__heading-avatar-img--winner' : ''
              ]"
              :src="getPlayer(gameStream.playerTurn).value?.avatar"
              alt="avatar"
            />
            <template
              v-if="
                gameStream.playerTurn === userStore.getUser?.id &&
                !getPlayer(gameStream.playerTurn).value?.isOut
              "
            >
              YOU HAVE {{ gameStream.turnTimer }}s TO ROLL {{ gameStream.currentRoll }} OR YOU'RE
              OUT!
            </template>
            <template v-else>
              {{ getPlayer(gameStream.playerTurn).value?.name.toUpperCase() }}'S TURN!
            </template>
          </n-h2>

          <div v-if="!gameStream.winnerID" class="dr-game__board">
            <n-h3 v-if="!gameStream.winnerID" class="dr-game__sub-heading">
              <div style="color: #ffc526">Round {{ gameStream.gameRound }}</div>
              Current Roll
              <div class="dr-game__board-current-roll">
                <n-number-animation :from="0" :to="gameStream.currentRoll" :show-separator="true" />
              </div>
            </n-h3>
          </div>
          <div class="dr-game__board-players">
            <d-r-all-players
              :players="gameStream.gameLobby.players"
              :player-turn="!gameStream.gameEnded ? gameStream.playerTurn : ''"
            />
          </div>

          <d-r-achievements
            v-if="gameStream.gameAchievements"
            class="dr-game__achievements"
            :achievements="gameStream.gameAchievements"
          />

          <div class="dr-game__action-history-container">
            <n-h2 class="dr-game__heading">ACTION HISTORY</n-h2>
            <n-scrollbar style="max-height: 200px">
              <n-timeline class="dr-game__action-history">
                <n-timeline-item v-for="action in gameStream.actionHistory" :key="action.playerID">
                  <span ref="timeline" class="dr-game__action-history-text">{{
                    action.actionDetails
                  }}</span>
                </n-timeline-item>
              </n-timeline>
            </n-scrollbar>
          </div>

          <template v-if="gameStream.playerTurn === userStore.getUser?.id && !gameStream.gameEnded">
            <n-input
              v-model:value="myRoll"
              class="dr-game__input"
              :placeholder="`/roll ${gameStream.currentRoll}`"
              @keydown.enter="roll"
            />
            <n-button class="dr-game__roll-button" color="#ffc526" @click="roll">Roll!</n-button>
          </template>
          <n-button
            v-else-if="gameStream.gameEnded"
            class="dr-game__roll-button"
            color="#ffc526"
            @click="router.push({ name: 'home' })"
            >Start Over</n-button
          >
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
    <!-- <n-result
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
    </n-result> -->
    <template #footer>
      <d-r-player />
    </template>
  </d-r-game-page>
  <vue-particles
    v-if="gameStream?.winnerID && gameStream.gameEnded"
    id="tsparticles"
    :options="particlesConfig"
  />
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

  &__heading {
    color: #ffc526;
    font-size: 2rem;
    margin: 0;

    &-crown {
      position: absolute;
      left: 39px;
      transform: rotate(17deg);
      top: -19px;
      height: auto;
      width: 2.5rem;
    }

    &--avatar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &--winner {
      font-size: 3rem;
      position: relative;
    }

    &-avatar-img {
      height: auto;
      width: 3rem;
      border-radius: 50%;
      margin-right: 0.5rem;
      aspect-ratio: 1;
      object-fit: cover;

      &--winner {
        width: 5rem;
        border: 4px solid #ffc526;
      }
    }
  }

  &__sub-heading {
    margin: 0;
  }

  &__avatar-img {
    &--winner {
      width: 5rem;
    }
  }

  &__input,
  &__roll-button {
    grid-column: 1 / -1;
  }

  &__winner-heading {
    font-size: 3rem;
  }

  &__card {
    background-color: rgb(14, 14, 17, 0.9);
    opacity: 0.9;
  }

  &__achievements {
    grid-row: 3;
    grid-column: 1 / -1;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  &__board {
    min-width: 40%;

    &-current-roll {
      font-size: 2rem;
      color: #ffc526;
    }

    &-players {
      grid-row: 2;
      grid-column: 2;
    }
  }

  &__action-history {
    margin-left: 0.3rem;

    &-container {
      padding: 0.5rem;
      border-radius: 3px;
      justify-self: stretch;
      grid-row: 2;
    }

    &-text {
      text-shadow: 2px 2px black;
      font-size: 1.1rem;
    }
  }

  &__loading {
    margin: 1rem 0 0 1rem;
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
