<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { authUser, fetchAuthenticatedUser, type AuthenticatedUser, fetchLobby } from '@/api/api'
import { useRouter } from 'vue-router'
import { type FormValidationError, NH1, NH2, NAlert, NCard, NInput, NButton } from 'naive-ui'

import DRPage from '@/components/DRPage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRLoginForm from '@/components/DRLoginForm.vue'
import DRPlayer from '@/components/DRPlayer.vue'

const router = useRouter()

const isAuthenticated = ref(false)
const lobbyName = ref('')
const lobbyID = ref('')
const formValue = ref({ uname: '', pwd: '' })
const authenticatedUser = ref({
  ID: localStorage.getItem('authenticatedUserId'),
  authID: localStorage.getItem('authenticatedUser')
})

const {
  state: authenticatedUserResponse,
  execute: authenticateUser,
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

await fetchUserInfo()
if (authenticatedUser.value.authID === userInfo.value?.auth) {
  isAuthenticated.value = true
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

  try {
    await authenticateUser()
  } catch (error) {
    authError.value = 'Invalid username or password'
    isAuthenticated.value = false
  } finally {
    if (authenticatedUserResponse.value) {
      localStorage.setItem('authenticatedUser', authenticatedUserResponse.value.auth)
      localStorage.setItem('authenticatedUserId', authenticatedUserResponse.value.id)

      isAuthenticated.value = true

      authenticatedUser.value = {
        ID: localStorage.getItem('authenticatedUserId'),
        authID: localStorage.getItem('authenticatedUser')
      }

      fetchUserInfo()
    }
  }
}

async function startLobby() {
  await executeLobby()

  router.push({ name: 'lobby', params: { id: lobbyInfo.value?.id } })
}
</script>

<template>
  <d-r-page page-class="dr-home">
    <d-r-header />
    <template v-if="!isAuthenticated">
      <n-alert v-if="authError" title="There is a problem" type="error" closable>
        {{ authError }}
      </n-alert>
      <d-r-login-form v-model="formValue" @submit-form="submitForm" />
    </template>
    <template v-else>
      <n-card class="dr-card" hoverable content-class="dr-home__card-content">
        <n-h2 class="dr-card__heading">CREATE A LOBBY</n-h2>
        <n-input v-model:value="lobbyName" />
        <n-button color="#ffc526" type="primary" @click="startLobby">CREATE LOBBY</n-button>
      </n-card>
      <n-card class="dr-card" hoverable content-class="dr-home__card-content">
        <n-h2 class="dr-card__heading">JOIN A LOBBY</n-h2>
        <n-input v-model:value="lobbyID" />
        <n-button
          color="#ffc526"
          type="primary"
          @click="router.push({ name: 'lobby', params: { id: lobbyID } })"
        >
          JOIN LOBBY
        </n-button>
      </n-card>

      <d-r-player />
    </template>
  </d-r-page>
</template>

<style lang="scss">
.dr-card {
  margin-bottom: 1rem;
  opacity: 0.9;

  background-color: rgb(14, 14, 17, 0.9);

  &__heading {
    margin: 0;
    font-size: 1.7rem;
    text-shadow: 2px 2px black;
  }
}

.dr-home {
  &__header {
    align-self: center;
    justify-self: center;
    margin: 0;

    &-img {
      height: auto;
      width: 300px;
    }
  }

  &__card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
