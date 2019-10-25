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
      opponetNameDialog: null
    };
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
    },
    myTurn(position){
      let pos = null;
      if(position.position.line === 0 && position.position.column === 0){
        pos = 0;
      } else if (position.position.line === 0 && position.position.column === 1){
        pos = 1;
      } else if (position.position.line === 0 && position.position.column === 2){
        pos = 2;
      } else if (position.position.line === 1 && position.position.column === 0){
        pos = 3;
      } else if (position.position.line === 1 && position.position.column === 1){
        pos = 4;
      } else if (position.position.line === 1 && position.position.column === 2){
        pos = 5;
      } else if (position.position.line === 2 && position.position.column === 0){
        pos = 6;
      } else if (position.position.line === 2 && position.position.column === 1){
        pos = 7;
      } else if (position.position.line === 2 && position.position.column === 2){
        pos = 8;
      }
      console.log(pos, position)
      this.positions.forEach(position => {
        if(position.id === pos){
          console.log('tests')
          position.text = this.ticTacToeMarkers[1];
          position.color = "red";
        }
      })
      this.myTurn = true
    },
    youWin(){
      // TODO: YOU WIN THE GAME JUST SHOW AN ALERTO TO INDICATE IT 
    },
    opponentWin(){
      // TODO: ALERT THAT OPPONENT WIN AND ENABLE PLAY AGAIN BUTTON
    },
    gameTie(){
      // TODO: ALERT THAT GAME END IN A TIE AND ENABLE PLAY AGAIN BUTTON
    },
    matchEnd(){
      // TODO: A BYE WAS EMMITED BY OPPONENT, RESET THE MAP AND BACK TO PLAYERS SCREEN
    },
    playAgain(){
      // TODO: OPPONENT WANT TO PLAY AGAIN AND HE WILL START
      this.myTurn = false;
    },
    letsPlay(){
      // TODO: OPPONENT ACCEPT ANOTHER MATCH, CLEAN THE MAP AND START AGAIN
      this.myTurn = true;
    }

  },
  methods: {
    playAgain() {
      this.positions.forEach(position => {
        position.text = "";
      });
      this.giveUpBool = true;
      this.play = false;
      axios.post("http://localhost:3000/api/client/playAgain")
      .then(res => {})
      .catch(err => {})
    },
    giveUp() {
      this.positions.forEach(position => {
        position.text = "";
      });
      this.giveUpBool = true;
      this.play = false;

      this.makeGame = false;
      this.myPoints = 0;
      this.opponentPoints = 0;

      axios.post("http://localhost:3000/api/client/bye")
      .then(res => {})
      .catch(err => {})
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
          axios.post("http://localhost:3000/api/client/play", {
              position: position
            })
            .then(res => {})
            .catch(res => {})
          // SEND POSITION
          // ON POSITION CONFIRMED DO:
          position.text = this.ticTacToeMarkers[0];
          position.color = "black";
          this.myTurn = false;
          // this.chooseRandom();
        } else if (
          position.text === this.ticTacToeMarkers[1] ||
          position.text === this.ticTacToeMarkers[0]
        ) {
          // TODO: PUT AN ALERT HERE
          console.log('cant check this position!')
        }
      } else {
        this.dialog = true;
        // TODO: AN ALERT HERE TO INDICATES THAT IS ANOTHER PLAYER TURN
        console.log("Another player turn");
      }
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

      // console.log(this.adversary);
      this.myTurn = false;
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
