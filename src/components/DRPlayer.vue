<script setup lang="ts">
import { ref } from 'vue'
import { useCoinSize } from '@/composables/useCoinSize'
import { useUserStore } from '@/stores/userStore'
import { useElementHover } from '@vueuse/core'
import { NCard, NUpload, NH3, type UploadFileInfo, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'

defineProps<{ lobbyTokenCount?: number }>()
const emit = defineEmits(['isSignedOut'])

const userStore = useUserStore()
const uploadElement = ref()
const isHovered = useElementHover(uploadElement)
const message = useMessage()
const router = useRouter()

const { getCoinSize } = useCoinSize()

function handleBeforeUpload(data: { file: UploadFileInfo }) {
  if (data.file.file && data.file.file.size > 10000000) {
    message.error('File size must be less than 10MB', {
      closable: true,
      duration: 5000
    })
    return false
  } else {
    return true
  }
}

function signOut() {
  userStore.setUserStorageCrendentials({
    id: '',
    auth: ''
  })
  router.push({ name: 'home' })
  message.success('You have been signed out', {
    closable: true,
    duration: 5000
  })

  emit('isSignedOut')
}
</script>

<template>
  <n-card
    v-if="userStore.getUser && userStore.isAuthenticated"
    class="dr-player-container"
    content-class="dr-player"
  >
    <div class="dr-player__profile">
      <div class="dr-player__avatar">
        <n-upload
          class="dr-player__upload"
          file-list-class="dr-player__upload-list"
          trigger-class="dr-player__upload-trigger"
          :action="`https://ashypls-001-site1.ftempurl.com/apps/DR/Service/userImageUploader/?playerID=${userStore.getUser.id}&playerAuth=${userStore.getUser.auth}`"
          list-type="image-card"
          :show-preview-button="false"
          :show-remove-button="false"
          :max="1"
          accept=".png, .jpeg, .jpg, .apng, .gif, .avif, .svg, .webp"
          @before-upload="handleBeforeUpload"
        >
          <img
            v-if="userStore.getUser.avatar"
            ref="uploadElement"
            class="dr-player__avatar-img"
            :src="userStore.getUser.avatar"
            :alt="userStore.getUser.name"
          />

          <img
            src="/camera-pixel-icon-ash.png"
            :class="[
              'dr-player__upload-trigger-img',
              isHovered ? 'dr-player__upload-trigger-img--hover' : ''
            ]"
          />
        </n-upload>
        <div class="dr-player__avatar-name">
          {{ userStore.getUser.name }}
          <div v-if="userStore.isAuthenticated" class="dr-player__sign-out" @click="signOut">
            Sign Out
          </div>
        </div>
      </div>
    </div>
    <div class="dr-player__tokens">
      <img :src="`/${getCoinSize(userStore.getUser!).value}.png`" alt="gold" />{{
        lobbyTokenCount ? lobbyTokenCount : userStore.getUser.tokenCount
      }}
    </div>

    <div class="dr-player__info">
      <div class="dr-player__info-stats">
        <n-h3 class="dr-player__info-stats-heading" style="color: #ffc526">STATS</n-h3>
        <dl class="dr-player__data">
          <dt class="dr-player__data-title">ROLLS WON</dt>
          <dd class="dr-player__data-value">{{ userStore.getUser.rollsWon }}</dd>
        </dl>
        <dl class="dr-player__data">
          <dt class="dr-player__data-title">ROLLS LOST</dt>
          <dd class="dr-player__data-value">{{ userStore.getUser.rollsLost }}</dd>
        </dl>
      </div>
    </div>
  </n-card>
</template>

<style lang="scss">
.dr-player {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;

  &-container {
    align-self: flex-end;
    grid-column: 1/-1;
    opacity: 0.9;
    background-color: rgb(14, 14, 17, 0.9);
    position: sticky;
    bottom: 0;

    @media screen and (max-width: 840px) {
      grid-column: 1;
    }
  }

  &__tokens {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    padding: 0 2rem;
    height: 60px;
    border-left: 1px solid #7e7356;
    border-right: 1px solid #7e7356;
    white-space: nowrap;
  }

  &__sign-out {
    color: #ffc526;
    cursor: pointer;
    font-size: 1.2rem;
  }

  &__profile {
    padding-right: 1rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 1rem;

    &-stats-heading {
      margin: 0;
    }
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
    gap: 0.8rem;
    align-items: center;

    &-name {
      font-size: 1.5rem;
      white-space: nowrap;
    }

    &-img {
      height: auto;
      width: 80px;
      border-radius: 50%;
      aspect-ratio: 1;
      object-fit: cover;
      transition: all 0.2s ease-in-out;

      &:hover {
        filter: brightness(50%);
      }
    }
  }

  &__upload.n-upload {
    width: fit-content;
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
