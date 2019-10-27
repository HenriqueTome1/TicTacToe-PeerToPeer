<template>
  <div class="row">
    <players-bar-mobile
      ref="playersBar"
      v-if="!makeGame"
      :users="users"
    ></players-bar-mobile>
  </div>
</template>

<script>
/* eslint-disable */
import PlayersBarMobile from "components/PlayersBarMobile";
export default {
  data() {
    return {
      makeGame: false,
      users: []
    };
  },
  components: {
    PlayersBarMobile
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    registrationSuccessful() {
      console.log("Usuario ta suave");
    },
    registrationFailed() {
      console.log("event fired by a failed user registration");
      setInterval(() => {
        this.disconnect();
      }, 3000);
    },
    playersList(lista) {
      this.users = [];
      lista.list.users.forEach(user => {
        this.users.push(user);
      });
      if (this.makeGame) {
        let msg = {
          id: this.commands.length,
          text: "<" + lista.list.message + ">"
        };
        this.commands.push(msg);
      } else {
        this.commands = [];
      }
    }
  }
};
</script>

<style>
</style>