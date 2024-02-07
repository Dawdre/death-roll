<script setup lang="ts">
import { useCoinSize } from '@/composables/useCoinSize'
import { useUserStore } from '@/stores/userStore'
import { NCard } from 'naive-ui'

const userStore = useUserStore()

const { getCoinSize } = useCoinSize(userStore.getUser!)
</script>

<template>
  <n-card v-if="userStore.getUser" class="dr-player-container" content-class="dr-player">
    <div class="dr-player__avatar">
      <img
        class="dr-player__avatar-img"
        :src="userStore.getUser.avatar"
        :alt="userStore.getUser.name"
      />
      <div class="dr-player__avatar-name">{{ userStore.getUser.name }}</div>
    </div>
    <div class="dr-player__tokens">
      <img :src="`/${getCoinSize}.png`" alt="gold" />{{ userStore.getUser.tokenCount }}
    </div>
  </n-card>
</template>

<style lang="scss">
.dr-player {
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  &-container {
    align-self: flex-end;
  }

  &__tokens {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  &__tokens,
  &__avatar-name {
    font-size: 1.5rem;
  }

  &__avatar {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-img {
      height: auto;
      width: 80px;
      border-radius: 50%;
      aspect-ratio: 1 / 1;
    }
  }
}
</style>
