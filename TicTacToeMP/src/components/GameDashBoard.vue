<template>
  <q-card>
    <q-card-section>
      <label class="textOponente">Oponente:</label>
      <q-input disable outlined v-model="opponent.user" :dense="true" />
    </q-card-section>

    <q-card-section>
      <label>Comandos</label>
      <q-scroll-area style="height: 185px; width: 45vw;">
        <div v-for="command in commands" :key="command.id" class="q-py-xs">{{command.text}}</div>
      </q-scroll-area>
    </q-card-section>

    <q-card-section>
      <label>Chat</label>
      <q-scroll-area style="height: 185px; width: 45vw;">
        <div class="q-pa-md row justify-center">
          <div style="width: 100vw">
            <q-chat-message
              v-for="message in messages"
              :key="message.id"
              :name="message.name"
              :text="[message.text]"
              :sent="message.sent"
            />
          </div>
        </div>
      </q-scroll-area>

      <q-input
        style="margin-top: 5px;"
        outlined
        v-model="chatMessage"
        dense
        label="Sua mensagem..."
        @keyup.enter="sendMessage"
      >
        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="sendMessage" />
        </template>
      </q-input>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-if="!giveUpBool" color="green" @click="playAgain">Jogar novamente</q-btn>
      <q-btn
        color="red"
        @click="giveUp"
      >{{giveUpBool ? 'Desistir do jogo' : 'Voltar a tela inicial'}}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
/* eslint-disable */
import axios from "axios";
export default {
  props: {
    opponent: {
      type: Object,
      required: true
    },
    commands: {
      type: Array,
      default: () => {
        return [];
      },
      required: true
    },
    giveUpBool: {
      type: Boolean
    },
    userInfo:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
      chatMessage: "",
      messages: []
    };
  },
  sockets: {
    receiveMessage(msg) {
      console.log(this.opponent);
      setTimeout(() => {
        let message = msg.msg.slice(4);
        let messageObject = {
          id: this.messages.length + 1,
          name: this.opponent.user,
          text: message,
          sent: false
        };
        this.messages.push(messageObject);
        this.$emit('addCommand', `MSG ${message}`, this.opponent)
      }, 1000);
    }
  },
  methods: {
    sendMessage() {
      if (this.chatMessage.length > 0) {
        let messageObject = {
          id: this.messages.length + 1,
          name: "Eu",
          text: this.chatMessage,
          sent: true
        };

        axios
          .post("http://localhost:1024/api/client/sendMessage", {
            message: this.chatMessage
          })
          .then(res => {
            this.messages.push(messageObject);
            this.$emit('addCommand', `MSG ${this.chatMessage}`, this.userInfo)
            this.chatMessage = "";
          })
          .catch(err => {});
      }
    },
    playAgain() {
      this.$emit("playAgain");
    },
    giveUp() {
      this.$emit("giveUp");
    }
  }
};
</script>

<style>
.textOponente {
  /* vertical-align: middle; */
  margin: 5px;
}
</style>
