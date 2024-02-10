<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { authUser, fetchAuthenticatedUser, type AuthenticatedUser, fetchLobby } from '@/api/api'
import { useRouter } from 'vue-router'
import { type FormValidationError, NH1, NH2, NAlert, NCard, NInput, NButton } from 'naive-ui'
import { useUserStore } from '@/stores/userStore'

import DRPage from '@/components/page/DRPage.vue'
import DRHeader from '@/components/DRHeader.vue'
import DRLoginForm from '@/components/DRLoginForm.vue'
import DRPlayer from '@/components/DRPlayer.vue'
import DRLatest from '@/components/DRLatest.vue'

const router = useRouter()
const userStore = useUserStore()

const isAuthenticated = ref(false)
const lobbyName = ref('')
const lobbyID = ref('')
const formValue = ref({ uname: '', pwd: '' })

const {
  state: authenticatedUserResponse,
  execute: authenticateUser,
  error: authError
} = useAsyncState<AuthenticatedUser | null>(() => authUser(formValue.value), null, {
  immediate: false,
  throwError: true
})

watchEffect(() => {
  if (userStore.isAuthenticated) {
    isAuthenticated.value = true
  }
})

const { state: lobbyInfo, execute: executeLobby } = useAsyncState(
  () =>
    fetchLobby({
      name: lobbyName.value,
      hostID: userStore.getUserStorageCredentials.ID
    }),
  null,
  {
    throwError: true,
    immediate: false
  }
)

async function submitForm(validationErrors: FormValidationError) {
  if (validationErrors) {
    return
  }

  try {
    await authenticateUser()
  } catch (error) {
    authError.value = 'Invalid username or password'
    isAuthenticated.value = false
  } finally {
    if (authenticatedUserResponse.value) {
      userStore.setUserStorageCrendentials(authenticatedUserResponse.value)

      isAuthenticated.value = true
    }
  }
}

async function startLobby() {
  await executeLobby()

  router.push({ name: 'lobby', params: { id: lobbyInfo.value?.id } })
}

function joinLobby() {
  router.push({ name: 'lobby', params: { id: lobbyID.value } })
}

// function logout() {
//   localStorage.removeItem('authenticatedUser')
//   localStorage.removeItem('authenticatedUserId')

//   isAuthenticated.value = false
//   authenticatedUser.value = {
//     ID: null,
//     authID: null
//   }
// }
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
      <n-card class="dr-card dr-home__create" hoverable content-class="dr-home__card-content">
        <n-h2 class="dr-card__heading">CREATE A LOBBY</n-h2>
        <n-input v-model:value="lobbyName" placeholder="LOBBY NAME" @keyup.enter="startLobby" />
        <n-button color="#ffc526" type="primary" @click="startLobby">CREATE LOBBY</n-button>
      </n-card>
      <n-card class="dr-card dr-home__join" hoverable content-class="dr-home__card-content">
        <n-h2 class="dr-card__heading">JOIN A LOBBY</n-h2>
        <n-input v-model:value="lobbyID" placeholder="LOBBY ID" @keyup.enter="joinLobby" />
        <n-button color="#ffc526" type="primary" @click="joinLobby"> JOIN LOBBY </n-button>
      </n-card>
      <div class="dr-home__content">
        <n-h2 class="dr-home__heading">GAME RULES</n-h2>
        <p class="dr-home__body">
          Welcome to Deathrollers, the ultimate test of luck and nerves! Players take turns rolling
          a die, aiming to roll high without hitting the dreaded 1. Wager your credits and outsmart
          your opponents, in this high-stakes gamble where fortunes are won and lost with each roll!
        </p>
      </div>

      <d-r-latest />
    </template>
    <template #footer>
      <d-r-player />
    </template>
  </d-r-page>
</template>

<style lang="scss">
.n-card.n-card--bordered.dr-card {
  border-color: #ffc526;
}
.dr-card {
  opacity: 0.9;
  background-color: rgb(14, 14, 17, 0.9);

  &__heading {
    margin: 0;
    font-size: 2rem;
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

  &__heading {
    margin: 0;
    color: #ffc526;
    font-size: 2rem;
  }

  &__content {
    padding: 0 1.5rem;
    grid-column: 2;
    grid-row: 2;

    @media screen and (max-width: 840px) {
      grid-column: 1;
    }
  }

  &__body {
    color: #fff;
    font-size: 1.1rem;
  }

  &__create {
    grid-column: 1;
    align-self: flex-start;
  }

  &__join {
    grid-column: 1;
  }

  &__card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
