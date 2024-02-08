<script setup lang="ts">
import { useCoinSize } from '@/composables/useCoinSize'
import { useUserStore } from '@/stores/userStore'
import { useElementHover } from '@vueuse/core'
import { NCard, NUpload } from 'naive-ui'
import { ref } from 'vue'

const userStore = useUserStore()
const uploadElement = ref()
const isHovered = useElementHover(uploadElement)

const { getCoinSize } = useCoinSize(userStore.getUser!)
</script>

<template>
  <n-card v-if="userStore.getUser" class="dr-player-container" content-class="dr-player">
    <div class="dr-player__avatar">
      <n-upload
        class="dr-player__upload"
        file-list-class="dr-player__upload-list"
        trigger-class="dr-player__upload-trigger"
        :action="`https://ashypls.com/data/apps/DR/Service/userImageUploader/?playerID=${userStore.getUser.id}&playerAuth=${userStore.getUser.auth}`"
        list-type="image-card"
        :show-preview-button="false"
        :max="1"
        @finish="console.log('finished')"
      >
        <img
          ref="uploadElement"
          class="dr-player__avatar-img"
          :src="userStore.getUser.avatar"
          :alt="userStore.getUser.name"
        />

        <img
          src="/camera-pixel-icon.png"
          :class="[
            'dr-player__upload-trigger-img',
            isHovered ? 'dr-player__upload-trigger-img--hover' : ''
          ]"
        />

        <!-- <svg
          :class="[
            'dr-player__upload-trigger-img',
            isHovered ? 'dr-player__upload-trigger-img--hover' : ''
          ]"
          fill="#ffc526"
          width="40px"
          height="40px"
          opacity="0.8"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 5h-2.586l-2.707-2.707A.996.996 0 0 0 14 2h-4a.996.996 0 0 0-.707.293L6.586 5H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-8 12c-2.71 0-5-2.29-5-5 0-2.711 2.29-5 5-5s5 2.289 5 5c0 2.71-2.29 5-5 5z"
          />
          <path d="M13 9h-2v2H9v2h2v2h2v-2h2v-2h-2z" />
        </svg> -->
      </n-upload>
      <div class="dr-player__avatar-name">{{ userStore.getUser.name }}</div>
    </div>
    <div class="dr-player__info">
      <div class="dr-player__info-stats">
        <n-h3 style="color: #ffc526">STATS</n-h3>
        <dl class="dr-player__data">
          <dt class="dr-player__data-title">ROLLS WON</dt>
          <dd class="dr-player__data-value">{{ userStore.getUser.rollsWon }}</dd>
        </dl>
        <dl class="dr-player__data">
          <dt class="dr-player__data-title">ROLLS LOST</dt>
          <dd class="dr-player__data-value">{{ userStore.getUser.rollsLost }}</dd>
        </dl>
      </div>
      <div class="dr-player__tokens">
        <img :src="`/${getCoinSize}.png`" alt="gold" />{{ userStore.getUser.tokenCount }}
      </div>
    </div>
  </n-card>
</template>

<style lang="scss">
.dr-player {
  display: flex;
  gap: 1rem;
  font-size: 1.2rem;

  &-container {
    align-self: flex-end;
  }

  &__tokens {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  &__info {
    border: 1px solid #968045;
    padding: 0.8rem;
    border-radius: 3px;
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__data {
    display: flex;
    gap: 0.3rem;

    &-value {
      color: #ffc526;
    }
  }

  &__avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    // border: 1px solid #968045;
    // padding: 0.8rem;
    // border-radius: 3px;

    &-name {
      font-size: 1.2rem;
    }

    &-img {
      height: auto;
      width: 80px;
      border-radius: 50%;
      aspect-ratio: 1;
      transition: all 0.2s ease-in-out;

      &:hover {
        filter: brightness(50%);
      }
    }
  }

  &__upload {
    .n-upload-file-list.n-upload-file-list--grid {
      display: block;
    }

    &-trigger-img {
      position: absolute;
      pointer-events: none;
      display: none;
      opacity: 0.8;

      &--hover {
        display: block;
      }
    }

    .n-upload-file-list .n-upload-file.n-upload-file--image-card-type {
      width: 80px;
      height: 80px;
      border-radius: 50%;

      border-color: transparent;
      border-radius: 50%;

      &:hover {
        border: 1px dashed #ffc526;
      }
    }

    &-trigger.n-upload-trigger--image-card {
      width: 80px;
      height: 80px;

      .n-upload-dragger {
        border-color: transparent;
        border-radius: 50%;
        background-color: transparent;

        &:hover {
          border: 1px dashed #ffc526;
        }
      }
    }
  }
}
</style>
