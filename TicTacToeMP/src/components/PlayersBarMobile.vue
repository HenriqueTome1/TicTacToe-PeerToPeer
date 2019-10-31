<template>
  <div class="q-pa-md playersList">
     <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title style="text-align: center;">Players</q-toolbar-title>
      <q-btn dense color="red" @click="$emit('disconnect')">Desconectar</q-btn>
    </q-toolbar>

    <q-scroll-area style="height: 85vh; width: 100vw;">
      <q-list bordered style="height: 85vh">
        <q-item-label header style="text-align: center;">Jogadores disponíveis</q-item-label>
        <q-item
          :active="user.selected"
          v-for="user in users"
          :key="user.id"
          class="q-my-sm"
          clickable
          v-ripple
          @click="SelectPlayer(user)"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">{{ getLetter(user.user) }}</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ user.user }}</q-item-label>
            <!-- <q-item-label caption lines="1">{{ contact.email }}</q-item-label> -->
          </q-item-section>
        </q-item>

      </q-list>
    </q-scroll-area>
    <q-btn v-if="play" class="playBtn" color="green" @click="startGame">Jogar com {{opponent.user}}</q-btn>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    users: {
      type: Array,
      default: () => {return []},
      required: true
    },
  },
  data() {
    return {
      play: false,
      opponent: {}
    };
  },
  methods: {
    getLetter(name) {
      return name[0].charAt(0).toUpperCase();
    },
    SelectPlayer(user) {
        this.play = !this.play
        this.opponent = user
      this.$emit("selectedPlayer", user);
    },
    startGame() {
      this.$emit("startGame");
    },
    setPlayFalse(){
      this.play = false;
    }
  }
};
</script>

<style scoped>
.playersList {
  padding: 0px !important;
  max-height: 100vh;
}
.playBtn {
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: 40px;
  width: 100vw;
}
</style>