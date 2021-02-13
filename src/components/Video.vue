<template>
  <div>
    <video :autoplay="autoplay" height="200px" ref="myVideo" :muted="muted" />
  </div>
</template>

<script>
// :ref="props.ref"
// :srcObject="props.src"
//       :muted="props.muted"
import axios from "axios";
export default {
  name: "Video",
  props: {
    src: Object,
    muted: Boolean,
    ref: String,
    userId: String
  },
  data() {
    return {
      autoplay: true,
    };
  },
  methods:{

  },
  mounted() {
    this.$refs.myVideo.srcObject = this.src;
    this.$refs.myVideo.addEventListener("loadedmetadata", () => {
      this.$refs.myVideo.play();
    });
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
