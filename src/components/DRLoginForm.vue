<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, type FormInst } from 'naive-ui'
import { ref, computed } from 'vue'

const emit = defineEmits(['update:modelValue', 'submitForm'])
const props = defineProps<{
  modelValue: { uname: string; pwd: string }
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: typeof props.modelValue) => emit('update:modelValue', value)
})

const formRef = ref<FormInst | null>(null)
const formRules = {
  uname: { required: true, message: 'Enter your username' },
  pwd: { required: true, message: 'Enter your password' }
}

async function submit() {
  try {
    await formRef.value?.validate((errors) => emit('submitForm', errors))
  } catch (errors) {
    console.log(errors, 'error')
  }
}

async function discord() {
  window.location.replace(import.meta.env.VITE_OUTH2_DISCORD_AUTH_URL)
}
</script>
<template>
  <n-form ref="formRef" :model="inputValue" :rules="formRules" class="dr-login-form">
    <n-form-item label="Username" path="username">
      <n-input v-model:value="inputValue.uname" placeholder="" />
    </n-form-item>
    <n-form-item label="Password" path="password">
      <n-input
        v-model:value="inputValue.pwd"
        type="password"
        show-password-on="click"
        placeholder=""
      />
    </n-form-item>

    <div class="dr-login-form__buttons">
      <n-button type="primary" color="#ffc526" @click="submit">Sign In</n-button>
      <n-button
        class="dr-login-form__button dr-login-form__button--discord"
        type="info"
        color="#5865f2"
        @click="discord"
      >
        <template #icon>
          <img class="dr-login-form__button-icon" src="/discord.png" alt="Discord" />
        </template>
        <span style="color: #fff; text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5)"
          >Sign In with Discord</span
        >
      </n-button>
    </div>
  </n-form>
</template>
<style scoped lang="scss">
.dr-login-form {
  margin-top: 1rem;

  &__buttons {
    display: flex;
    gap: 1rem;
  }

  &__button {
    &--discord {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 1rem;
    }
  }

  &__button-icon {
    margin-right: 0.5rem;
    height: auto;
    width: 25px;
  }
}
</style>
