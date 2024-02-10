<script setup lang="ts">
import { NH1 } from 'naive-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <n-h1 class="dr-header" @click="router.push({ name: 'home' })">
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
