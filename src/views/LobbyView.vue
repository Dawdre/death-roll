<script setup lang="ts">
import { getUserInfo } from '@/api/api'
import { useAsyncState } from '@vueuse/core'

const authenticatedUserToken = localStorage.getItem('authenticatedUser')
const authenticatedUserId = localStorage.getItem('authenticatedUserId')

const authenticatedUser =
  authenticatedUserToken && authenticatedUserId
    ? {
        ID: authenticatedUserId,
        authID: authenticatedUserToken
      }
    : null

const { state: userInfo } = useAsyncState(() => getUserInfo(authenticatedUser), null, {
  throwError: true
})
</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ userInfo }}
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
