<template>
  <n-card v-if="userInfo" class="dr-player-container" content-class="dr-player">
    <div class="dr-player__avatar">
      <img class="dr-player__avatar-img" :src="userInfo.avatar" :alt="userInfo.name" />
      <div class="dr-player__avatar-name">{{ userInfo.name }}</div>
    </div>
    <div class="dr-player__tokens">
      <img src="/COIN (1).png" alt="gold" />{{ userInfo.tokenCount }}
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { fetchAuthenticatedUser } from '@/api/api'
import { useAsyncState } from '@vueuse/core'
import { NCard } from 'naive-ui'

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
</script>

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
