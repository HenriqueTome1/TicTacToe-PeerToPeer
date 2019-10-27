<template>
  <div class="row">
    <players-bar
      ref="playersBar"
      v-if="!makeGame"
      :users="users"
      @selectedPlayer="SelectPlayer"
      @startGame="startGame"
    ></players-bar>

    <div v-if="makeGame && adversary" class="col">
      <game-dash-board
        :opponent="adversary"
        :commands="commands"
        :giveUpBool="giveUpBool"
        :userInfo="userInfo"
        @playAgain="playAgain"
        @giveUp="giveUp"
        @addCommand="addCommand"
      ></game-dash-board>
    </div>

    <div v-if="makeGame" class="col window-height window-width row justify-center items-center">
      <q-card
        style="height: 100vh; width: 100vw;"
        class="window-height window-width row justify-center items-center"
      >
        <q-card-section style="col-5">
          <label style="margin-right: 10px;">VOCÊ:</label>
          <q-rating
            disable
            v-model="myPoints"
            size="2em"
            :max="3"
            color="primary"
            style="margin-right: 50px;"
          />
          <!-- <q-space /> -->
          <label style="margin-right: 10px;">OPONENTE:</label>
          <q-rating disable v-model="opponentPoints" size="2em" :max="3" color="primary" />
        </q-card-section>
        <game-board :positions="positions" @changeSimbol="changeSimbol"></game-board>
      </q-card>
    </div>

    <div v-if="!makeGame" class="col window-height window-width row justify-center items-center">
      <label>Trabalho desenvolvido para a matéria de Redes de Computadores</label>
    </div>

    <q-dialog v-model="dialog" position="top">
      <q-card style="width: 500px">
        <q-card-section class="row items-center no-wrap" style="text-align: center;">
          <div>
            <div class="text-weight-bold">Rodada do jogador 2</div>
            <!-- <div class="text-grey">Fitz & The Tantrums</div> -->
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-btn v-if="!makeGame" color="red" class="logOutBtn" @click="disconnect">Desconectar</q-btn>

    <start-game-dialog
      v-if="showStartGameDialog"
      :player="opponetNameDialog"
      :message="'com você!'"
      @accept="acceptMatch"
      @reject="rejectMatch"
    ></start-game-dialog>

    <start-game-dialog
      v-if="showPlayAgainDialog"
      :player="opponetNameDialog ? opponetNameDialog : adversary.user"
      :message="'novemente!'"
      @accept="acceptedPlayAgain"
      @reject="rejectMatch"
    ></start-game-dialog>

    <start-game-dialog
      v-if="awaitPlayResponse"
      :player="this.adversary.user"
      awaitingPlayerResponse
    ></start-game-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import PlayersBar from "components/PlayersBar";
import GameDashBoard from "components/GameDashBoard";
import GameBoard from "components/GameBoard";
import StartGameDialog from "components/StartGameDialog";
import axios from "axios";

export default {
  components: {
    PlayersBar,
    GameDashBoard,
    GameBoard,
    StartGameDialog
  },
  data() {
    return {
      userInfo: {},
      users: [],
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
      ],
      ticTacToeMarkers: ["X", "O"],
      myTurn: true,
      dialog: false,
      play: false,
      adversary: null,
      makeGame: false,
      chatMessage: "",
      giveUpBool: true,
      myPoints: 0,
      opponentPoints: 0,
      commands: [],
      getPlayersVar: null,
      showStartGameDialog: false,
      showPlayAgainDialog: false,
      awaitPlayResponse: false,
      opponetNameDialog: null
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
      if (this.makeGame) {
        let msg = {
          id: this.commands.length,
          text: "<" + lista.list.message + ">"
        };
        this.commands.push(msg);
      } else {
        this.commands = [];
      }
    },
    startMatch(user) {
      if (!this.makeGame) {
        this.showStartGameDialog = true;
        this.adversary = user.opponent;
        this.opponetNameDialog = user.user;
        this.myPoints = 0;
        this.opponentPoints = 0;
      }
    },
    gameAccepted() {
      this.myPoints = 0;
      this.opponentPoints = 0;
      this.awaitPlayResponse = false;
      this.makeGame = !this.makeGame;
    },
    myTurn(position) {
      this.registerPlay(position, this.userInfo);
      this.myTurn = true;
    },
    youWin() {
      this.myPoints++;
      this.giveUpBool = false;

      if (this.myPoints < 3) {
        this.showNotify(
          "green",
          "thumb_up",
          "Parabéns voce ganhou esta rodada"
        );
      }

      if (this.myPoints === 3) {
        this.showNotify(
          "green",
          "thumb_up",
          "Parabéns voce ganhou 3 rodadas, o jogo será encerrado"
        );
        setTimeout(() => {
          this.rejectMatch();
        }, 3000);
      }
    },
    opponentWin(position) {
      this.registerPlay(position, this.adversary);
      this.opponentPoints++;
      this.giveUpBool = false;

      if (this.opponentPoints < 3) {
        this.showNotify(
          "red",
          "thumb_down",
          "Que azar voce perdeu esta rodada"
        );
      }
      if (this.opponentPoints === 3) {
        this.showNotify(
          "red",
          "thumb_down",
          "Que azar voce perdeu 3 rodadas, o jogo será encerrado"
        );
        setTimeout(() => {
          this.endGame();
        }, 3000);
      }
    },
    gameTie(position) {
      if (position) {
        this.registerPlay(position, this.adversary);
      }
      this.giveUpBool = false; // ENABLE PLAY AGAIN BUTTON
      this.showNotify(
        "yellow",
        "error_outline",
        "Um empate aconteceu nesta rodada"
      );
    },
    matchEnd() {
      this.awaitPlayResponse = false;
      if (this.opponentPoints < 3) {
        this.showNotify(
          "red",
          "error_outline",
          "Este usuário não deseja jogar com voce"
        );
      }
      this.opponentPoints = 0;
      this.addCommand("BYE", this.adversary);
      this.endGame();
    },
    playAgain() {
      this.addCommand("PLAYAGAIN", this.adversary);
      this.showPlayAgainDialog = true;
      this.myTurn = false;
    },
    letsPlay() {
      this.cleanMap();
      this.myTurn = true;
    }
  },
  methods: {
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
    registerPlay(position, whoPlay) {
      this.addCommand(`PLAY ${position.position.line} ${position.position.column}`, whoPlay);

      let pos = null;
      if (position.position.line === 0 && position.position.column === 0) {
        pos = 0;
      } else if (
        position.position.line === 0 &&
        position.position.column === 1
      ) {
        pos = 1;
      } else if (
        position.position.line === 0 &&
        position.position.column === 2
      ) {
        pos = 2;
      } else if (
        position.position.line === 1 &&
        position.position.column === 0
      ) {
        pos = 3;
      } else if (
        position.position.line === 1 &&
        position.position.column === 1
      ) {
        pos = 4;
      } else if (
        position.position.line === 1 &&
        position.position.column === 2
      ) {
        pos = 5;
      } else if (
        position.position.line === 2 &&
        position.position.column === 0
      ) {
        pos = 6;
      } else if (
        position.position.line === 2 &&
        position.position.column === 1
      ) {
        pos = 7;
      } else if (
        position.position.line === 2 &&
        position.position.column === 2
      ) {
        pos = 8;
      }

      this.positions.forEach(position => {
        if (position.id === pos) {
          position.text = this.ticTacToeMarkers[1];
          position.color = "red";
        }
      });
    },
    cleanMap() {
      this.positions.forEach(position => {
        position.text = "";
      });
    },
    playAgain() {
      this.cleanMap();

      this.giveUpBool = true;
      this.play = false;
      axios
        .post("http://localhost:1024/api/client/playAgain")
        .then(res => {
          this.myTurn = false;
        })
        .catch(err => {});
      this.addCommand("PLAYAGAIN", this.userInfo);
    },
    giveUp() {
      this.cleanMap();
      this.giveUpBool = true;
      this.play = false;

      this.makeGame = false;
      this.myPoints = 0;
      this.opponentPoints = 0;

      axios
        .post("http://localhost:1024/api/client/bye")
        .then(res => {})
        .catch(err => {});
    },
    startGame() {
      axios
        .post("http://localhost:1024/api/client/startGame", this.adversary)
        .then(response => {
          this.userInfo = {
            ip: response.data.user_ip,
            user: response.data.user_name,
            port: response.data.user_port
            }
          this.addCommand("START", this.userInfo)
        });
      this.users.forEach(cont => {
        cont.selected = false;
      });
      this.$refs.playersBar.setPlayFalse();
      this.awaitPlayResponse = true;
     
    },
    SelectPlayer(contact) {
      if (contact.selected) {
        this.users.forEach(cont => {
          cont.selected = false;
        });
        this.play = false;
        this.adversary = null;
      } else {
        this.users.forEach(cont => {
          cont.selected = false;
        });
        contact.selected = !contact.selected;
        this.play = true;
        this.adversary = contact;
      }
    },

    changeSimbol(position) {
      if (this.myTurn) {
        if (position.text === "") {
          axios
            .post("http://localhost:1024/api/client/play", {
              position: position
            })
            .then(res => {})
            .catch(res => {});
          this.addCommand(`PLAY ${position.line} ${position.column}`, this.userInfo);
          // SEND POSITION
          // ON POSITION CONFIRMED DO:
          position.text = this.ticTacToeMarkers[0];
          position.color = "black";
          this.myTurn = false;
        } else if (
          position.text === this.ticTacToeMarkers[1] ||
          position.text === this.ticTacToeMarkers[0]
        ) {
          this.showNotify("yellow", "error_outline", "Posição já selecionada");
        }
      } else {
        this.showNotify(
          "yellow",
          "error_outline",
          `Rodada do jogador ${this.adversary.user}`
        );
        // this.dialog = true;
        // console.log("Another player turn");
      }
    },
    disconnect() {
      axios
        .delete("http://localhost:1024/api/client")
        .then(res => {
          this.$router.push((name = "/"));
        })
        .catch(err => {
          this.disconnect();
        });
    },
    acceptMatch() {
      this.makeGame = !this.makeGame;
      this.showStartGameDialog = false;

      this.myTurn = false;
      axios
        .post("http://localhost:1024/api/client/gameAccepted", {
          opponent: this.adversary
        })
        .then(response => {
          this.userInfo = {
            ip: response.data.user_ip,
            user: response.data.user_name,
            port: response.data.user_port
            }
        })
        .catch(e => {});
      this.addCommand("START", this.adversary);
      //send to backend start
    },
    rejectMatch() {
      axios
        .post("http://localhost:1024/api/client/bye", {
          opponent: this.adversary
        })
        .then(res => {})
        .catch(err => {});
      this.addCommand("BYE", this.userInfo);
      this.endGame();
    },
    endGame() {
      this.cleanMap();
      this.dialog = false;
      this.play = false;
      this.adversary = null;
      this.makeGame = false;
      this.chatMessage = "";
      this.giveUpBool = true;
      this.myPoints = 0;
      this.opponentPoints = 0;
      this.commands = [];
      this.getPlayersVar = null;
      this.showStartGameDialog = false;
      this.showPlayAgainDialog = false;
    },
    addCommand(cmd, whoSend) {
      if (this.makeGame) {
        let msg = {
          id: this.commands.length,
          text: "<" + whoSend.user + ' ' + whoSend.ip + ' ' + whoSend.port + ' ' + cmd + ">"
        };
        this.commands.push(msg);
      } else {
        this.commands = [];
      }
    },
    acceptedPlayAgain() {
      this.showPlayAgainDialog = false;
      this.giveUpBool = true;
      this.cleanMap();
      axios
        .get("http://localhost:1024/api/client/playAgain")
        .then(res => {})
        .catch(err => {});
      this.addCommand("PLAYAGAINACCEPTED", this.userInfo)
    }
  },
  beforeDestroy() {
    clearInterval(this.getPlayersVar);
    this.getPlayersVar = null;
    if (this.makeGame) {
      this.rejectMatch();
    }
  }
};
</script>

<style>
.logOutBtn {
  position: absolute;
  right: 10px;
  bottom: 15px;
}
</style>
