<template>
  <div :class="['dr-page', pageClass, inError ? 'dr-page--error' : '']">
    <div class="dr-page__content">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ pageClass: string; inError?: boolean }>()
</script>

<style lang="scss" scoped>
.dr-page {
  display: grid;
  min-height: 100vh;
  background-image: url('/DEATHROLL-PAGE-BG.png');
  justify-content: center;

  &__content {
    display: grid;
    grid-template-rows: 200px;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(2, minmax(min-content, 600px));
    row-gap: 1rem;
    column-gap: 2rem;
    justify-content: center;
    align-items: flex-start;
    margin: 0 2rem;

    @media screen and (max-width: 840px) {
      grid-template-columns: minmax(min-content, 600px);
    }
  }

  &--error {
    grid-template-rows: 200px min-content 1fr;
  }

  @media screen and (max-width: 840px) {
    grid-template-columns: minmax(min-content, 600px);
    grid-template-rows: repeat(6, min-content);
  }
}
</style>
