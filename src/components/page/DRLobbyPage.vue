<template>
  <div :class="['dr-lobby-page', pageClass]">
    <div :class="['dr-lobby-page__content', inError ? 'dr-lobby-page__content--error' : '']">
      <slot />
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ pageClass: string; inError?: boolean }>()
</script>

<style lang="scss" scoped>
.dr-lobby-page {
  display: grid;
  min-height: 100vh;
  background-image: url('/DEATHROLL-PAGE-BG.png');

  @media screen and (max-width: 840px) {
    grid-template-columns: minmax(min-content, 600px);
    justify-content: center;
  }
}
.dr-lobby-page__content {
  display: grid;
  grid-template-rows: 200px min-content;
  grid-auto-rows: auto;
  grid-template-columns: minmax(35%, 40%) minmax(min-content, 600px);
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
