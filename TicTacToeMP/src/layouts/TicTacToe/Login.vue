<template>
  <div class="q-pa-md window-height window-width row justify-center items-center">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" style="width: 400px">
      <div style="text-align: center; margin: 0px;">
        <label class="cadText">Registro no Servidor</label>
      </div>
      <q-input
        filled
        v-model="user_name"
        label="Seu nome *"
        hint="Nome de usuário"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor insira seu nome']"
      />

      <q-input
        filled
        type="number"
        v-model="user_port"
        label="Porta *"
        hint="Porta para comunicação TCP durante o jogo"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Por favor insira a porta para comunicação TCP',
          val => val > 1025 && val < 65536 || 'Insira uma valor entre 1026 e 65535'
        ]"
      />

      <q-input
        filled
        v-model="server_ip"
        label="Endereço IPv4 do servidor *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor insira seu nome']"
      />

      <q-input
        filled
        v-model="server_port"
        label="Porta do servidor *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Por favor insira a porta de comunicação do seu coputador',
          val => val > 1023 && val < 65536 || 'Insira uma valor entre 1024 e 65535'
        ]"
      />

      <div>
        <q-btn label="Cadastrar" type="submit" color="primary" />
        <q-btn label="Limpar" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
// import { signUp } from '../Services/ClientServer/client';

export default {
  data() {
    return {
      user_name: "",
      user_port: "",
      server_ip: "localhost",
      server_port: 8000
    };
  },
  mounted() {
    // this.stopCliet()
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    registrationSuccessful() {
      let ctx = this
      console.log("event fired by a successful user registration");
      ctx.$router.push((name = "/game"));
      // this.getUserList();
    },
    registrationFailed() {
      console.log("event fired by a failed user registration");
      // this.username = prompt(
      //   "Nome de usuário inválido. Entre com o seu nome de usuário."
      // );
    },
    userList(msg) {
      console.log("userlist received!");
      console.log(msg);
      this.setPlayerList(msg.msg);
    }
  },
  methods: {
    stopCliet() {
      console.log("stopping");
      axios
        .delete("http://localhost:1024/api/client")
        .then(r => {})
        .catch(err => {});
    },
    onSubmit() {
      axios
        .post("http://localhost:1024/api/client", {
          user_name: this.user_name,
          user_port: this.user_port,
          server_address: this.server_ip,
          server_port: this.server_port
        })
        .then(response => {
          // console.log(response);
          // this.$router.push((name = "/game"));
        })
        .catch(err => {
          console.error(err);
        });
      // console.log(this.signUp(user_name, user_port, server_ip, server_port));
    },
    onReset() {}
  }
};
</script>
<style scoped>
.cadText {
  font-size: 45px;
  font-family: 'Times New Roman';
}
</style>
