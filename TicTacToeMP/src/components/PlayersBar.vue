<template>
  <div class="q-pa-md playersList">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title style="text-align: center;">Players</q-toolbar-title>
    </q-toolbar>

    <q-scroll-area style="height: 90vh; width: 300px;">
      <q-list bordered style="height: 90vh">
        <q-item-label header>Jogadores disponíveis</q-item-label>
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

          <!-- <q-item-section side>
          <q-icon name="chat_bubble" color="green" />
          </q-item-section>-->
        </q-item>

        <q-separator />
        <q-item-label header>Em jogo</q-item-label>

        <q-item v-for="contact in usersInGame" :key="contact.id" class="q-mb-sm" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="green" text-color="white">{{ getLetter(contact.name) }}</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ contact.name }}</q-item-label>
            <!-- <q-item-label caption lines="1">{{ contact.email }}</q-item-label> -->
          </q-item-section>

          <!-- <q-item-section side>
          <q-icon name="chat_bubble" color="grey" />
          </q-item-section>-->
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
    usersInGame: {
      type: Array,
      default: () => {return []},
      required: true
    }
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

<style>
.playersList {
  padding: 0px !important;
  max-height: 100vh;
}
.playBtn {
  position: absolute;
  left: 5px;
  bottom: 5px;
  width: 290px;
}
</style>