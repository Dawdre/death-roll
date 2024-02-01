<script setup lang="ts">
import { ref } from 'vue'
import { createLobby, getUserInfo, type Lobby } from '@/api/api'
import { useAsyncState } from '@vueuse/core'
import { NInput, NButton } from 'naive-ui'

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
const { state: lobbyInfo, execute } = useAsyncState(() => createLobby(lobbyForm.value), null, {
  throwError: true,
  immediate: false
})

const lobbyForm = ref({
  name: '',
  hostID: authenticatedUserId
})

async function startGame() {
  await execute()
}
</script>
<template>
  <div class="dr-create">
    <h1>This is a create page</h1>
    {{ userInfo }}
    <n-input v-model:value="lobbyForm.name" />
    <n-button type="primary" @click="startGame">Create Lobby</n-button>
    <h2>{{ lobbyInfo?.id }}</h2>
  </div>
</template>

<style scoped lang="scss"></style>
