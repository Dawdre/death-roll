<script setup lang="ts">
import { NH1 } from 'naive-ui'
import { useRouter } from 'vue-router'

const emit = defineEmits(['go-home'])
const router = useRouter()

function goHome() {
  emit('go-home')
  router.push({ name: 'home' })
}
</script>
<template>
  <n-h1 class="dr-header" @click="goHome">
    <img class="dr-header-img" src="/DEATHROLL.png" alt="header-img" />
  </n-h1>
</template>

<style scoped lang="scss">
.dr-header {
  align-self: center;
  justify-self: center;
  margin: 0;
  grid-column: 1 / -1;
  cursor: pointer;

  &-img {
    height: auto;
    width: 300px;
  }
}
</style>
