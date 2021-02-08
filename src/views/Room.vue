<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 my-3">
        <h2>Room</h2>
        <input v-model="roomId" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="">
          <vue-webrtc
            ref="webrtc"
            width="100%"
            :roomId="roomId"
            v-on:joined-room="logEvent"
            v-on:left-room="logEvent"
            v-on:opened-room="logEvent"
            v-on:share-started="logEvent"
            v-on:share-stopped="logEvent"
            @error="onError"
          />
        </div>
        <div class="row">
          <div class="col-md-12 my-3">
            <button type="button" class="btn btn-primary" @click="onJoin">
              Join
            </button>
            <button type="button" class="btn btn-primary" @click="onLeave">
              Leave
            </button>
            <button type="button" class="btn btn-primary" @click="onCapture">
              Capture Photo
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="onShareScreen"
            >
              Share Screen
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>Captured Image</h2>
        <figure class="figure">
          <img :src="img" class="img-responsive" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";

import HelloWorld from "@/components/HelloWorld.vue";
import Peer from "peerjs";
import io from "socket.io-client";

export default {
  name: "Room",
  data() {
    return {
      stream: null,
      videos: [0, 1, 2, 3],
      socket: {},
      context: {},
      test: "",
      peer: null,
      length: 0,
      img: null,
      roomId: "public-room",
    };
  },
  components: {
    HelloWorld,
  },
  computed: {
    username() {
      return this.$route.params.username;
    },
    roomId() {
      return this.$route.params.roomId;
    },
  },
  mounted() {
    // this.goLive();
    // this.peer = new Peer(undefined, {
    //   path: "/peerjs",
    //   host: "localhost",
    //   port: "3030",
    // });
    // this.peer.on("open", (id) => {
    //   this.socket.emit("join-room", this.roomId, id);
    // });
  },
  created() {
    this.socket = io("http://localhost:3030");
  },
  methods: {
    goLive() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: false,
          })
          .then((stream) => {
            this.stream = stream;
            this.addVideoStream(this.$refs.myVideo, stream);

            this.peer.on("call", (call) => {
              call.answer(stream);
              const video = document.createElement("video");
              call.on("stream", (userVideoStream) => {
                this.addVideoStream(video, userVideoStream);
              });
            });

            this.socket.on("user-connected", (userId) => {
              console.log(`New username: ${this.username} userId: ${userId}`);
              this.connectToNewUser(userId, stream);
            });
          });
      }
    },
    addVideoStream(video, stream) {
      // this.$refs.myVideo.srcObject = stream;
      // this.$refs.myVideo.muted = true;
      // this.videos.push(video);
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    },
    connectToNewUser(userId, stream) {
      const call = this.peer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        this.addVideoStream(video, userVideoStream);
      });
    },
    onCapture() {
      this.img = this.$refs.webrtc.capture();
    },
    onJoin() {
      this.$refs.webrtc.join();
    },
    onLeave() {
      this.$refs.webrtc.leave();
    },
    onShareScreen() {
      this.img = this.$refs.webrtc.shareScreen();
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    logEvent(event) {
      console.log("Event : ", event);
    },
  },
};
</script>
