<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>
      <button @click="join">Join</button>
    </div>
    <div>
      <button @click="create">Create</button>
    </div>
    <h4>Welcome to Home page</h4>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      roomId: "",
    };
  },
  components: {
    HelloWorld,
  },
  mounted() {
    axios.get("https://dmeets-api.herokuapp.com/").then((response) => {
      this.roomId = response.data.roomId;
    });
  },
  methods: {
    join() {
      this.$router.push({ path: "/join", params: { role: 'joiner'} });
    },
    create() {
      this.$router.push({ name: "room", params: { roomId: this.roomId, role: 'host' } });
    },
  },
};
</script>
