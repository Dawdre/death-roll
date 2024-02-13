<script setup lang="ts">
import { useCoinSize } from '@/composables/useCoinSize'
import type { Player } from '@/composables/useEventSource'
import { useUserStore } from '@/stores/userStore'
import { NH2 } from 'naive-ui'

defineProps<{ players: Array<Player>; hostId?: string; playerTurn?: string }>()

const userStore = useUserStore()
const { getCoinSize } = useCoinSize()
</script>
<template>
  <n-h2 class="dr-all-players__heading">PLAYERS</n-h2>
  <div class="dr-all-players__players">
    <div
      :class="[
        'dr-all-players__player',
        player.id === (hostId || playerTurn) ? 'dr-all-players__player--host' : ''
      ]"
      v-for="player in players"
      :key="player.id"
    >
      <div class="dr-all-players__player-img">
        <img :src="player.avatar" :alt="player.name" />
      </div>
      <div class="dr-all-players__player-avatar">
        {{ player.name }}
        <div class="dr-all-players__player-tokens">
          <img :src="`/${getCoinSize(player ?? userStore.getUser!).value}.png`" alt="gold" />{{
            player.tokens
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dr-all-players {
  &__heading {
    color: #ffc526;
    margin: 0;
    font-size: 2rem;
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
