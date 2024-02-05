<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { authUser, fetchAuthenticatedUser, type AuthenticatedUser, fetchLobby } from '@/api/api'
import { useRouter } from 'vue-router'
import { type FormValidationError, NAlert, NCard, NInput, NButton } from 'naive-ui'

import DRLoginForm from '@/components/DRLoginForm.vue'

const router = useRouter()

const isAuthenticated = ref(false)
const lobbyName = ref('')
const lobbyID = ref('')
const formValue = ref({
  uname: '',
  pwd: ''
})

const {
  state: userAuth,
  execute,
  error: authError
} = useAsyncState<AuthenticatedUser | null>(() => authUser(formValue.value), null, {
  immediate: false,
  throwError: true
})

const { state: userInfo, execute: fetchUserInfo } = useAsyncState(
  () => fetchAuthenticatedUser(authenticatedUser.value),
  null,
  {
    throwError: true,
    immediate: false
  }
)

const authenticatedUser = ref({
  ID: localStorage.getItem('authenticatedUserId'),
  authID: localStorage.getItem('authenticatedUser')
})

if (authenticatedUser.value.ID && authenticatedUser.value.authID) {
  isAuthenticated.value = true

  fetchUserInfo()
}

const { state: lobbyInfo, execute: executeLobby } = useAsyncState(
  () =>
    fetchLobby({
      name: lobbyName.value,
      hostID: authenticatedUser.value?.ID
    }),
  null,
  {
    throwError: true,
    immediate: false
  }
)

async function submitForm(validationErrors: FormValidationError) {
  if (validationErrors) {
    console.log(validationErrors, 'errors')
    return
  }

  await execute().then((res) => {
    if (res) {
      localStorage.setItem('authenticatedUser', res.auth)
      localStorage.setItem('authenticatedUserId', res.id)

      isAuthenticated.value = true
    }
  })

  authenticatedUser.value = {
    ID: localStorage.getItem('authenticatedUserId'),
    authID: localStorage.getItem('authenticatedUser')
  }

  console.log(authenticatedUser.value, 'authenticatedUser')

  fetchUserInfo()
}

async function startLobby() {
  await executeLobby()

  router.push({ name: 'lobby', params: { id: lobbyInfo.value?.id } })
}
</script>

<template>
  <main>
    <template v-if="!isAuthenticated">
      <n-alert v-if="authError" title="There is a problem" type="error" closable>
        {{ authError }}
      </n-alert>
      <d-r-login-form v-model="formValue" @submit-form="submitForm" />
    </template>
    <template v-else>
      <n-card>
        <h1>Create a Lobby</h1>
        <n-input v-model:value="lobbyName" />
        <n-button type="primary" @click="startLobby">Create Lobby</n-button>
      </n-card>
      <n-card>
        <h1>Join a Lobby</h1>
        <n-input v-model:value="lobbyID" />
        <n-button type="primary" @click="router.push({ name: 'lobby', params: { id: lobbyID } })"
          >Join Lobby</n-button
        >
      </n-card>

      {{ userInfo }}
    </template>
  </main>
</template>
