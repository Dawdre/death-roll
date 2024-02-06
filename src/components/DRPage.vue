<template>
  <div :class="['dr-page', pageClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ pageClass: string }>()
</script>

<style lang="scss" scoped>
.dr-page {
  display: grid;
  grid-template-rows: 200px min-content min-content 1fr;
  height: 100vh;
  background-image: url('/DEATHROLL-PAGE-BG.png');

  padding: 2rem;
}
</style>
