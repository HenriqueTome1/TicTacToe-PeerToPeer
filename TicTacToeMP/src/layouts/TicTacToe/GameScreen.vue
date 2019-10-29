<template>
  <div>
    <!-- <game v-if="$q.screen.gt.sm"></game> -->
    <!-- <mobile v-if="$q.screen.lt.md"></mobile> -->
    <game-full></game-full>
  </div>
</template>

<script>
/* eslint-disable */
import Game from "layouts/TicTacToe/Game";
import Mobile from "layouts/TicTacToe/Mobile";
import GameFull from "layouts/TicTacToe/GameFull";
export default {
  components: {
    Game,
    Mobile,
    GameFull
  }
};
</script>

<style>
</style>