<script setup lang="ts">
import type { Achievement } from '@/composables/useEventSource'
import { NH2, NCard } from 'naive-ui'

defineProps<{ achievements: Array<Achievement> }>()
</script>
<template>
  <div class="dr-achievements">
    <n-h2 class="dr-achievements__heading">ACHIEVEMENTS</n-h2>
    <div class="dr-achievements__content">
      <div v-for="chieve in achievements" :key="chieve.title" class="dr-achievements__item">
        <n-card hoverable size="small" class="dr-achievements__card">
          <div class="dr-achievements__card-content">
            <img class="dr-achievements__icon" :src="chieve.icon" :alt="chieve.title" />
            <div class="dr-achievements__title">
              {{ chieve.title }}
            </div>
            <p class="dr-achievements__text">{{ chieve.description }}</p>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.n-card > .n-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}
.dr-achievements {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__heading {
    color: #ffc526;
    margin: 0 0 2.5rem 0;
    font-size: 2rem;
  }

  &__card {
    background-color: rgba(7, 7, 8, 0.9);
    border-radius: 8px;
    border: 4px solid #ffc526;

    &-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      position: relative;
      height: 12rem;
      justify-content: center;
    }
  }

  &__text {
    text-align: center;
  }

  &__title {
    color: #ffc526;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 3.8rem;
    line-height: 1;
  }

  &__content {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__item {
    flex: 1 0 20%;
  }

  &__icon {
    height: auto;
    width: 5.5rem;
    border-radius: 50%;
    border: 4px solid #e8b425;
    position: absolute;
    top: -45px;
  }
}
</style>
