<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, type FormInst, c } from 'naive-ui'
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
</script>
<template>
  <main>
    <n-form ref="formRef" :model="inputValue" :rules="formRules">
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

      <n-button type="primary" color="#ffc526" @click="submit">Submit</n-button>
    </n-form>
  </main>
</template>
<style scoped lang="scss"></style>
