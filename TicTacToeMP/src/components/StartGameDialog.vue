<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">O jogador {{ player }} que jogar com você!</div>
            <div class="text-grey">Deseja aceitar?</div>
          </div>

          <q-space />

          <q-btn flat round icon="done" @click="acceptMatch">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Aceitar partida
            </q-tooltip>
          </q-btn>
          <q-btn flat round icon="close" v-close-popup @click="rejectMatch">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Rejeitar partida
            </q-tooltip>
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
    }
  },
  data() {
    return {
      seamless: true
    };
  },
  methods: {
    acceptMatch(){
      this.$emit("accept")
    },
    rejectMatch(){
      this.$emit("reject")
    }
  }
};
</script>

<style>
</style>