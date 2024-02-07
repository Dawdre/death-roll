<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  type GlobalTheme,
  type GlobalThemeOverrides,
  darkTheme,
  NConfigProvider,
  NThemeEditor
} from 'naive-ui'
import { ref } from 'vue'

const theme = ref<GlobalTheme | null>(darkTheme)
const themeOverrides: GlobalThemeOverrides = {
  Input: {
    caretColor: '#ffc526FF',
    borderFocus: '1px solid #ffc526',
    borderHover: '1px solid #ffc526',
    colorFocus: 'rgba(255, 206, 73, 0.09)'
  }
}
</script>

<template>
  <Suspense>
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
      <RouterView />
    </n-config-provider>
  </Suspense>
</template>

<style scoped></style>
