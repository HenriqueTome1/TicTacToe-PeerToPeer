<template>
  <div class="row">
    <players-bar-mobile
      ref="playersBar"
      v-if="!makeGame"
      :users="users"
      @selectedPlayer="playerSelected"
      @startGame="startGame"
      @disconnect="disconnect"
    ></players-bar-mobile>

    <start-game-dialog v-if="awaitPlayResponse" :player="opponent.user" awaitingPlayerResponse></start-game-dialog>

    <start-game-dialog
      v-if="showStartGameDialog"
      :player="opponetNameDialog"
      :message="'com você!'"
      @accept="acceptMatch"
      @reject="rejectMatch"
    ></start-game-dialog>

    <div v-if="makeGame" class="col window-height window-width row justify-center items-center">
        <q-btn color="red" class="giveUpBtn" @click="rejectMatch">Desistir</q-btn>
      <game-board :positions="positions" @changeSimbol="changeSimbol"></game-board>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import PlayersBarMobile from "components/PlayersBarMobile";
import StartGameDialog from "components/StartGameDialog";
import GameBoard from "components/GameBoard";
import axios from "axios";

export default {
  components: {
    PlayersBarMobile,
    StartGameDialog,
    GameBoard
  },
  data() {
    return {
      users: [],
      makeGame: false,
      opponent: {},
      awaitPlayResponse: false,
      showStartGameDialog: false,
      myTurn: true,
      positions: [
        {
          id: 0,
          text: "",
          color: "black",
          line: 0,
          column: 0
        },
        {
          id: 1,
          text: "",
          color: "black",
          line: 0,
          column: 1
        },
        {
          id: 2,
          text: "",
          color: "black",
          line: 0,
          column: 2
        },
        {
          id: 3,
          text: "",
          color: "black",
          line: 1,
          column: 0
        },
        {
          id: 4,
          text: "",
          color: "black",
          line: 1,
          column: 1
        },
        {
          id: 5,
          text: "",
          color: "black",
          line: 1,
          column: 2
        },
        {
          id: 6,
          text: "",
          color: "black",
          line: 2,
          column: 0
        },
        {
          id: 7,
          text: "",
          color: "black",
          line: 2,
          column: 1
        },
        {
          id: 8,
          text: "",
          color: "black",
          line: 2,
          column: 2
        }
      ]
    };
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
    },
    startMatch(user) {
      if (!this.makeGame) {
        this.showStartGameDialog = true;
        this.opponetNameDialog = user.user;
      }
    },
    gameAccepted() {
      this.awaitPlayResponse = false;
      this.makeGame = !this.makeGame;
    },
    playNok() {
      this.showNotify(
        "red",
        "error_outline",
        `Jogada inválida, jogue novamente!`
      );
    },
    byePlayNok() {
      this.showNotify(
        "red",
        "error_outline",
        `3 jogadas erradas, jogo encerrado`
      );
      this.makeGame = false;
    },
    youWin() {
      this.showNotify("green", "thumb_up", "Parabéns voce venceu o jogo");
      this.makeGame = false;
      this.cleanMap();
    },
    opponentWin() {
      this.showNotify("red", "thumb_down", "Que azar voce perdeu o jogo");
      this.makeGame = false;
    },
    gameTie() {
      this.showNotify("yellow", "error_outline", `Jogo empatou`);
      this.makeGame = false;
    },
    playOk(position) {
      this.registerPlay(position, true);
      this.myTurn = false;
    },
    myTurn(position) {
      this.registerPlay(position, false);
      this.myTurn = true;
    },
    matchEnd() {
      this.showNotify("red", "error_outline", "Jogo encerrado");
      this.cleanMap();
    }
  },
  methods: {
    cleanMap() {
      this.positions.forEach(position => {
        position.text = "";
      });
      this.makeGame = false;
      this.opponent = {};
      this.awaitPlayResponse = false;
      this.showStartGameDialog = false;
      this.myTurn = true;
    },
    showNotify(color, icon, message) {
      let textColor = "black";
      let position = "top";

      this.$q.notify({
        color,
        textColor,
        icon: icon,
        message,
        position,
        timeout: 3000
      });
    },
    playerSelected(user) {
      this.opponent = user;
    },
    startGame() {
      axios
        .post("http://localhost:1024/api/cliente/startGame", this.opponent)
        .then(response => {})
        .catch(err => {});
      this.users.forEach(cont => {
        cont.selected = false;
      });
      this.$refs.playersBar.setPlayFalse();
      this.awaitPlayResponse = true;
    },
    acceptMatch() {
      this.makeGame = !this.makeGame;
      this.showStartGameDialog = false;

      this.myTurn = false;
      axios
        .post("http://localhost:1024/api/cliente/gameAccepted")
        .then(response => {})
        .catch(e => {});
    },
    rejectMatch() {
      axios
        .post("http://localhost:1024/api/cliente/bye", {
          opponent: this.adversary
        })
        .then(res => {})
        .catch(err => {});
      this.cleanMap();
    },
    changeSimbol(position) {
      if (this.myTurn) {
        axios
          .post("http://localhost:1024/api/cliente/play", {
            position: position
          })
          .then(res => {})
          .catch(res => {});
      } else {
        this.showNotify("yellow", "error_outline", `Rodada do outro jogador`);
      }
    },
    registerPlay(position, myPlay) {
      let pos = null;
      if (position.line === 0 && position.column === 0) {
        pos = 0;
      } else if (position.line === 0 && position.column === 1) {
        pos = 1;
      } else if (position.line === 0 && position.column === 2) {
        pos = 2;
      } else if (position.line === 1 && position.column === 0) {
        pos = 3;
      } else if (position.line === 1 && position.column === 1) {
        pos = 4;
      } else if (position.line === 1 && position.column === 2) {
        pos = 5;
      } else if (position.line === 2 && position.column === 0) {
        pos = 6;
      } else if (position.line === 2 && position.column === 1) {
        pos = 7;
      } else if (position.line === 2 && position.column === 2) {
        pos = 8;
      }

      let symbol = "";
      let color = ''
      if (myPlay) {
        symbol = "X";
        color = "black"
      } else {
        symbol = "O";
        color = "red"
      }
      this.positions.forEach(position => {
        if (position.id === pos) {
          position.text = symbol;
          position.color = color;
        }
      });
    },
    disconnect() {
      axios
        .delete("http://localhost:1024/api/cliente")
        .then(res => {
          this.$router.push((name = "/"));
        })
        .catch(err => {
          this.disconnect();
        });
    }
  }
};
</script>

<style>
.giveUpBtn {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 30px;
}
</style>