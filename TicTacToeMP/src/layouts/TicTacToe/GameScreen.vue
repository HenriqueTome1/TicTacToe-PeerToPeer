<template>
  <div>
    <game v-if="$q.screen.gt.sm"></game>
    <mobile v-if="$q.screen.lt.md"></mobile>
  </div>
</template>

<script>
/* eslint-disable */
import Game from "layouts/TicTacToe/Game";
import Mobile from "layouts/TicTacToe/Mobile";
export default {
  components: {
    Game,
    Mobile
  }
};
</script>

<style>
</style>