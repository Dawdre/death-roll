<template>
  <div :class="['dr-game-page', pageClass]">
    <div :class="['dr-game-page__content', inError ? 'dr-game-page__content--error' : '']">
      <slot />
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import 'animate.css'
defineProps<{ pageClass: string; inError?: boolean }>()
</script>

<style lang="scss" scoped>
.dr-game-page {
  display: grid;
  min-height: 100vh;
  background-image: url('/DEATHROLL-PAGE-BG.png');

  @media screen and (max-width: 840px) {
    grid-template-columns: minmax(min-content, 600px);
    justify-content: center;
  }
}
.dr-game-page__content {
  display: grid;
  grid-template-rows: 200px;
  grid-auto-rows: min-content;
  grid-template-columns: minmax(auto, 1200px);
  row-gap: 1rem;
  column-gap: 2rem;
  justify-content: center;
  align-items: start;
  padding: 2rem;

  &--error {
    grid-template-rows: 200px auto;
    grid-template-columns: minmax(min-content, 600px);
  }
}
</style>
