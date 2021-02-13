import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Join from "../views/Join.vue";
import Room from "../views/Room.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/join",
    name: "join",
    component: Join,
  },
  {
    path: "/:roomId",
    name: "room",
    component: Room,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
