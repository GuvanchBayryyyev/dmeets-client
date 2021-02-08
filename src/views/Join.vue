<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <input v-model="roomId" placeholder="roomId" />
    <input v-model="username" placeholder="username" />
    <button v-on:click="join()">Join</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  data() {
    return {
      username: "",
      roomId: "",
    };
  },
  components: {
    HelloWorld,
  },
  methods: {
    join() {
      this.$router.push({
        path: `/room/${this.roomId}/${this.username}`,
      });
    },
  },
};
</script>
