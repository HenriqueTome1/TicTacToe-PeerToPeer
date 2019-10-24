/* eslint-disable */
import Vue from "vue";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

// const socketIO = require("socket.io");
export default async ({ app, router, Vue }) => {
  // Vue.prototype.$socket = io("http://localhost:3005/");
  const socket = io("http://localhost:3005/");
  Vue.prototype.$socket = socket;
  // Vue.use(VueSocketIOExt, socket, { store });
  Vue.use(VueSocketIOExt, socket);
};