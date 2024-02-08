<script setup lang="ts">
import { fetchRecentMatches } from '@/api/recentMatches.api'
import { useAsyncState } from '@vueuse/core'
import { NCard, NH2 } from 'naive-ui'

const { state: recentMatches } = useAsyncState(fetchRecentMatches, null)
</script>

<template>
  <div class="dr-latest">
    <n-h2 class="dr-latest__heading">RECENT DEATHROLLS</n-h2>
    <n-card class="dr-latest__card" content-class="dr-latest__card-content">
      <table class="dr-latest__table">
        <tr>
          <th>DATE</th>
          <th>POT</th>
          <th>WINNER</th>
        </tr>
        <tr v-for="match in recentMatches" :key="match.gameID">
          <td>{{ match.gameDate }}</td>
          <td>{{ match.tokenPot }}</td>
          <td>{{ match.winner }}</td>
        </tr>
      </table>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.dr-latest {
  grid-row: 3/5;
  grid-column: 2;

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

    th {
      color: #ffc526;
      font-size: 1.5rem;
      text-align: left;
      font-weight: normal;
    }

    td {
      color: #fff;
      font-size: 1.5rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ffc526;
    }
  }
}
</style>
