import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VuePeerJS from "vue-peerjs";
import Peer from "peerjs";

Vue.use(
  VuePeerJS,
  new Peer({
    // host: "dmeets-api.herokuapp.com",
    host: 'localhost',
    path: '/',
    port: 9000,
    // key: 'peerjs'
  })
);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
