<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div v-if="awaitingPlayerResponse">
            <div>
              <div class="text-weight-bold">Aguardando a resposta do jogador {{ player }}!</div>
            </div>
          </div>
            <div v-if="!awaitingPlayerResponse">
              <div class="text-weight-bold">O jogador {{ player }} quer jogar {{ message }}</div>
              <div class="text-grey">Deseja aceitar?</div>
            </div>

            <q-space v-if="!awaitingPlayerResponse" />

            <q-btn v-if="!awaitingPlayerResponse" flat round icon="done" @click="acceptMatch">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Aceitar partida</q-tooltip>
            </q-btn>
            <q-btn v-if="!awaitingPlayerResponse" flat round icon="close" v-close-popup @click="rejectMatch">
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >Rejeitar partida</q-tooltip>
            </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    player: {
      type: String,
      required: true
    },
    message: {
      type: String
    },
    awaitingPlayerResponse:{
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      seamless: true
    };
  },
  methods: {
    acceptMatch() {
      this.$emit("accept");
    },
    rejectMatch() {
      this.$emit("reject");
    }
  }
};
</script>

<style>
</style>