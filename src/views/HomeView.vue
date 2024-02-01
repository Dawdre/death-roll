<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { authUser, type AuthenticatedUser } from '@/api/api'
import { useRouter } from 'vue-router'
import { type FormValidationError, NAlert } from 'naive-ui'

import DRLoginForm from '@/components/DRLoginForm.vue'

const router = useRouter()

const formValue = ref({
  uname: '',
  pwd: ''
})

const {
  state: authenticatedUser,
  execute,
  error: authError
} = useAsyncState<AuthenticatedUser | null>(() => authUser(formValue.value), null, {
  immediate: false,
  throwError: true
})

async function submitForm(validationErrors: FormValidationError) {
  if (validationErrors) {
    console.log(validationErrors, 'errors')
    return
  }

  if (localStorage.getItem('authenticatedUser') && localStorage.getItem('authenticatedUserId')) {
    router.push({ name: 'create' })
    return
  }

  await execute().then((res) => {
    if (res) {
      localStorage.setItem('authenticatedUser', res.auth)
      localStorage.setItem('authenticatedUserId', res.id)

      router.push({ name: 'create' })
    }
  })
}
</script>

<template>
  <main>
    <n-alert v-if="authError" title="There is a problem" type="error" closable>
      {{ authError }}
    </n-alert>
    <d-r-login-form v-model="formValue" @submit-form="submitForm" />
    {{ authenticatedUser }}
  </main>
</template>
