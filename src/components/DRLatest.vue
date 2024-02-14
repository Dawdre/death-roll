<script setup lang="ts">
import { fetchRecentMatches, type RecentMatches } from '@/api/recentMatches.api'
import { useAsyncState } from '@vueuse/core'
import { NCard, NH2, NScrollbar, NSkeleton, type UploadFileInfo } from 'naive-ui'

const { state: recentMatches } = useAsyncState(fetchRecentMatches, null)
const getAvatar = (match: RecentMatches) => {
  return match.players.find((player) => player.name === match.winner)?.avatar
}
</script>

<template>
  <div class="dr-latest">
    <n-h2 class="dr-latest__heading">RECENT DEATHROLLS</n-h2>
    <n-scrollbar style="max-height: 340px">
      <n-card class="dr-latest__card" content-class="dr-latest__card-content">
        <template v-if="!recentMatches">
          <n-skeleton
            v-for="n in 6"
            :key="n"
            style="margin-bottom: 0.5rem"
            :sharp="false"
            :height="30"
          />
        </template>

        <table v-else class="dr-latest__table">
          <tr class="dr-latest__table-head">
            <th>DATE</th>
            <th>POT</th>
            <th>WINNER</th>
          </tr>
          <tr v-for="match in recentMatches" :key="match.gameID">
            <td>
              {{
                new Intl.DateTimeFormat('en-GB', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                }).format(new Date(match.gameDate))
              }}
            </td>
            <td>{{ match.tokenPot }}</td>
            <td>
              <n-skeleton
                style="display: inline-block"
                v-if="!getAvatar(match)"
                circle
                height="40px"
                width="40px"
              />
              <img v-else :src="getAvatar(match)" :alt="match.winner" /> {{ match.winner }}
            </td>
          </tr>
        </table>
      </n-card>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.dr-latest {
  @media screen and (max-width: 840px) {
    grid-column: 1;
    grid-row: auto;
  }

  &__heading {
    color: #ffc526;
    margin: 0;
    font-size: 2rem;
  }

  &__card {
    background-color: rgb(14, 14, 17, 0.9);
    opacity: 0.9;
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
      // font-size: 1.2rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ffc526;
      vertical-align: middle;

      img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
    }
  }
}
</style>
