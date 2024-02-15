<script setup lang="ts">
import { fetchLeaderboard } from '@/api/leaderboard.api'
import { useAsyncState } from '@vueuse/core'
import { UseImage } from '@vueuse/components'
import { NCard, NH2, NScrollbar, NSkeleton } from 'naive-ui'

const { state: leaderboard } = useAsyncState(() => fetchLeaderboard(), null)
</script>

<template>
  <div class="dr-leaderboard">
    <n-h2 class="dr-leaderboard__heading">LEADERBOARD</n-h2>
    <n-scrollbar style="max-height: 340px">
      <n-card class="dr-leaderboard__card" content-class="dr-leaderboard__card-content">
        <template v-if="!leaderboard">
          <n-skeleton
            v-for="n in 6"
            :key="n"
            style="margin-bottom: 0.5rem"
            :sharp="false"
            :height="30"
          />
        </template>
        <table v-else class="dr-leaderboard__table">
          <tr class="dr-leaderboard__table-head">
            <th>PLAYER</th>
            <th>TOKENS</th>
          </tr>
          <tr v-for="leader in leaderboard" :key="leader.player">
            <td>
              <img
                v-if="leader.showCrown"
                class="dr-leaderboard__crown"
                src="/crown.png"
                alt="crown"
              />
              <UseImage
                class="dr-leaderboard__avatar"
                :src="leader.playerAvatar"
                :alt="leader.player"
              >
                <template #loading>
                  <n-skeleton :sharp="false" circle :height="32" :width="32" />
                </template>
              </UseImage>
              {{ leader.player }}
            </td>
            <td>{{ leader.tokens }}</td>
          </tr>
        </table>
      </n-card>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.dr-leaderboard {
  &__heading {
    margin: 0;
    color: #ffc526;
    font-size: 2rem;
  }

  &__card {
    opacity: 0.9;
    background-color: rgb(14, 14, 17, 0.9);
  }

  &__crown {
    position: absolute;
    left: 39px;
    transform: rotate(17deg);
    top: 45px;
    height: auto;
    width: 1.5rem;
  }

  &__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    &-head {
      background-color: rbg(14, 14, 17, 0.9);
    }

    th {
      color: #ffc526;
      font-size: 1.2rem;
      text-align: left;
      font-weight: normal;
    }

    td {
      color: #fff;
      font-size: 1.2rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ffc526;
      vertical-align: middle;
    }
  }

  &__table-head {
    color: #ffc526;
  }

  &__avatar {
    margin-right: 0.5rem;
  }
}
</style>
