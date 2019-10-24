<template>
  <div class="row">
    <players-bar
      v-if="!makeGame"
      :users="users"
      :usersInGame="usersInGame"
      @selectedPlayer="SelectPlayer"
      @startGame="startGame"
    ></players-bar>

    <div v-if="makeGame && adversary" class="col">
      <game-dash-board
        :opponent="adversary"
        :commands="commands"
        :giveUpBool="giveUpBool"
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
      @accept="acceptMatch"
      @reject="rejectMatch"
    ></start-game-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import PlayersBar from "../../components/PlayersBar";
import GameDashBoard from "../../components/GameDashBoard";
import GameBoard from "../../components/GameBoard";
import StartGameDialog from "../../components/StartGameDialog";
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
      users: [],
      usersInGame: [],
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
          line: 0,
          column: 2
        },
        {
          id: 4,
          text: "",
          color: "black",
          line: 0,
          column: 2
        },
        {
          id: 5,
          text: "",
          color: "black",
          line: 0,
          column: 2
        },
        {
          id: 6,
          text: "",
          color: "black",
          line: 0,
          column: 2
        },
        {
          id: 7,
          text: "",
          color: "black",
          line: 0,
          column: 2
        },
        {
          id: 8,
          text: "",
          color: "black",
          line: 0,
          column: 2
        }
      ],
      ticTacToeMarkers: ["X", "O"],
      myTurn: true,
      dialog: false,
      play: false,
      adversary: null,
      makeGame: true,
      chatMessage: "",
      giveUpBool: true,
      myPoints: 0,
      opponentPoints: 0,
      commands: [],
      getPlayersVar: null,
      showStartGameDialog: false,
      opponetNameDialog: null
    };
  },
  mounted() {
    this.getPlayers();
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    registrationSuccessful() {
      console.log("Usuario ta suave");
      // this.getUserList();
    },
    registrationFailed() {
      console.log("event fired by a failed user registration");
      setInterval(() => {
        this.disconnect();
      }, 3000);
      // this.username = prompt(
      //   "Nome de usuário inválido. Entre com o seu nome de usuário."
      // );
    },
    playersList(lista) {
      this.users = [];
      this.usersInGame = [];
      lista.list.users.forEach(user => {
        if (user.inGame) {
          this.usersInGame.push(user);
        } else {
          this.users.push(user);
        }
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
      // console.log("userlist received!");
      // console.log(msg);
      // this.setPlayerList(msg.msg);
    },
    startMatch(user) {
      if (!this.makeGame) {
        this.showStartGameDialog = true;
        console.log(user);
        this.adversary = user.opponent;
        this.opponetNameDialog = user.user;
      }
      // console.log(`Usuario ${user.user} deseja jogar com voce. Voce aceita?`);
    },
    gameAccepted() {
      // console.log('sdjdfkjdshfksjhfksdjfh')
      this.makeGame = !this.makeGame;
    }
  },
  methods: {
    playAgain() {
      this.positions.forEach(position => {
        position.text = "";
      });
      this.giveUpBool = true;
      this.play = false;
    },
    giveUp() {
      this.playAgain();
      this.makeGame = false;
      this.myPoints = 0;
      this.opponentPoints = 0;
    },
    startGame() {
      axios
        .post("http://localhost:3000/api/client/startGame", this.adversary)
        .then(response => {});
      this.users.forEach(cont => {
        cont.selected = false;
      });
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
    // getText() {
    //   return this.ticTacToeMarkers[0];
    // },
    changeSimbol(position) {
      if (this.myTurn) {
        if (position.text === "") {
          axios.post("http://localhost:3000/api/client/gameAccepted", {
              position: position
            })
            .then(res => {})
            .catch(res => {})
          // SEND POSITION
          // ON POSITION CONFIRMED DO:
          position.text = this.ticTacToeMarkers[0];
          position.color = "black";
          this.myTurn = false;
          this.chooseRandom();
        } else if (
          position.text === this.ticTacToeMarkers[1] ||
          position.text === this.ticTacToeMarkers[0]
        ) {
          console.log('cant check this position!')
          // SEND TO BACK END THIS POSITION
        }
      } else {
        this.dialog = true;
        console.log("Another player turn");
      }
    },
    chooseRandom() {
      let mark = false;
      this.positions.forEach(position => {
        if (position.text === "") {
          mark = true;
        }
      });
      if (!mark) {
        let rnd = Math.floor(Math.random() * 2);
        if (rnd == 0) {
          this.myPoints++;
        } else {
          this.opponentPoints++;
        }
        this.myTurn = true;
        this.giveUpBool = false;
        if (this.myPoints == 3) {
          console.log("ganhei");
          this.playAgain();
          this.makeGame = false;
          this.myPoints = 0;
          this.opponentPoints = 0;
        } else if (this.opponentPoints == 3) {
          console.log("perdi");
          this.playAgain();
          this.makeGame = false;
          this.myPoints = 0;
          this.opponentPoints = 0;
        }
      }

      setTimeout(() => {
        while (mark) {
          let rnd = Math.floor(Math.random() * this.positions.length);

          if (this.positions[rnd].text === "") {
            this.positions[rnd].text = this.ticTacToeMarkers[1];
            this.positions[rnd].color = "red";
            mark = false;
            this.myTurn = true;
          }
        }
      }, 0);
    },
    getPlayers() {
      // this.getPlayersVar = setInterval(() => {
      //   axios.get("http://localhost:3000/api/client").then(response => {
      //     console.log(response);
      //     this.users = response.data.users;
      //   });
      // }, 5000);
    },
    disconnect() {
      axios
        .delete("http://localhost:3000/api/client")
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

      console.log(this.adversary);
      axios
        .post("http://localhost:3000/api/client/gameAccepted", {
          opponent: this.adversary
        })
        .then(res => {})
        .catch(e => {});
      //send to backend start
    },
    rejectMatch() {
      //send to backend the rejection
    },
    addCommand(cmd) {
      // console.log(cmd)
      if (this.makeGame) {
        let msg = {
          id: this.commands.length,
          text: "<" + cmd + ">"
        };
        this.commands.push(msg);
      } else {
        this.commands = [];
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.getPlayersVar);
    this.getPlayersVar = null;
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
