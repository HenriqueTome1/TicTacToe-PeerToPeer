/* eslint-disable */
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

export default async ({ app, router, Vue }) => {
  const socket = io("http://localhost:1025/");
  Vue.prototype.$socket = socket;
  Vue.use(VueSocketIOExt, socket);
};
