<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 my-3" style="borderWidth:1px;padding: 10px; backgroundColor: red">
        <h2>Room: {{roomId}}</h2>
        <h3>I am {{role}}</h3>
        <div>
          <h4>Videos: {{videos.length}}</h4>
          <h4>Peer Connected: {{peerConnected}}</h4>
          <h4>Socket Connected: {{socketConnected}}</h4>
          <h4>My Video</h4>
          <h4>Count: {{count}}</h4>
          <button @click="print">Print</button>
          <div class="video-list">
          <button @click="toggleMute">{{myVoice ? 'Mute Voice' : 'Unmute Voice'}}</button>
          <button @click="toggleVideo">{{myScreen ? 'Mute Video' : 'Unmute Video'}}</button>
          <button @click="shareScreen">{{sharing ? 'Stop Sharing' : 'Share Screen'}}</button>
            <video ref="myVideo" height="200px" userId="userid" />
          </div>
        </div>
      </div>
    </div>

    <div class="video-list" v-for="(video, index) in videos" :key="video.src.id">

      <Video :ref="video.ref" :src="video.src" :muted="video.muted" :userId="index" />
    </div>
    <div class="row"></div>
    <div class="row">
      <div class="col-md-12">
        <h2>Captured Image {{ videos.length }}</h2>
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
import Video from "@/components/Video.vue";
import * as io from "socket.io-client";
window.io = io;

export default {
  name: "Room",
  data() {
    return {
      socket: {},
      context: {},
      length: 0,
      img: null,
      stream: null,
      videos: [],
      peers: {},
      count: 0,
      myVideo: null,
      myVoice: true,
      myScreen: true,
      sharing: false,
      username: "",
      users: [],
    }
  },
  components: {
    HelloWorld,
    Video
  },
  computed: {
    roomId() {
      return this.$route.params.roomId;
    },
    socketConnected() {
      return this.socket.connected
    },

    role() {
      return this.$route.params.role
    },

  },
  mounted() {
  this.goLive();

  },
  created() {
    // this.socket = io('http://localhost:3030'); // correct on localhost
    this.socket = io('https://dmeets-api.herokuapp.com');
  },

  methods: {
    toggleMute(){
      this.$refs.myVideo.srcObject.getAudioTracks()[0].enabled = !this.$refs.myVideo.srcObject.getAudioTracks()[0].enabled
      this.myVoice = this.$refs.myVideo.srcObject.getAudioTracks()[0].enabled

    },
    toggleVideo(){
     this.$refs.myVideo.srcObject.getVideoTracks()[0].enabled = !this.$refs.myVideo.srcObject.getVideoTracks()[0].enabled
     this.myScreen = this.$refs.myVideo.srcObject.getVideoTracks()[0].enabled
    },
    shareScreen(){
      if(!this.sharing){
        if(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia){
        navigator.mediaDevices.getDisplayMedia().then(stream => {
          this.addMyVideoStream('user id', stream);
          this.sharing = true
          stream.oninactive = () => {
            this.addMyVideoStream('user id', this.stream);
            this.sharing = false
          }
           this.connectToNewUser('user', stream);
        })
      }
      }else {
        this.addMyVideoStream('user id', this.stream);
        this.sharing = false
      }
    },
    print() {
      console.log(this.videos);
      console.log(this.stream)
    },
    goLive() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true
          })
          .then(stream => {
            this.stream = stream
            this.addMyVideoStream("username", stream);
            this.$peer.on("call", call => {
              call.answer(stream);
              let count = 0
              call.on("stream", userVideoStream => {
                count = count + 1
                if(count == 2) {
                  return
                } else {
                this.addVideoStream(this.username, userVideoStream);
                }
              });
            });
            this.socket.on('connect', () => {
            })
            this.socket.on("user-connected", userId => {
              console.log("user connected: " + userId);
              this.connectToNewUser(userId, stream);
            });
          });
        this.$peer.on("open", id => {
          this.peerConnected = this.$peer.open
          this.socket.emit("join-room", this.roomId, id);
        });
        this.socket.on("user-disconnected", userId => {
          console.log("user Disconnected: " + userId);
          if (this.peers[userId]) this.peers[userId].close();
        });
      }
    },
    connectToNewUser(userId, stream ) {
      const call = this.$peer.call(userId, stream);
      let count = 0
      call.on("stream", userVideoStream => {
        count = count + 1
        if(count == 2) {
          return
        } else {
        this.addVideoStream(this.username, userVideoStream);
      }
      });
      call.on("close", () => {
        this.removeVideoStream(stream.id);
      });
      this.peers[userId] = call;
    },
    async addVideoStream(userId, stream) {
      let video = {};
      video.src = stream;
      video.ref = "";
      video.muted = false;
      video.userId = userId;
      this.videos.push(video);
    },
    addMyVideoStream(username, stream) {
      this.$refs.myVideo.srcObject = stream;
      this.$refs.myVideo.src = stream;
      this.$refs.myVideo.muted = true;
      this.$refs.myVideo.addEventListener("loadedmetadata", () => {
      this.$refs.myVideo.play();
    });
    },
    removeVideoStream(id) {
      // console.log(this.videos);
      // for (let i = 0; i < this.videos.length; i++) {
      //   console.log(this.videos[i].src.id);
      //   if (this.videos[i].userId == id) {
      //     console.log("Equal");
      //   }
      // }
    }
  }
};
</script>
<style lang="scss">
.video-list {
  margin-bottom: 10px;
  background: transparent !important;
}
.video-item {
  width: 50%;
  display: inline-block;
  background: transparent !important;
}
.video-item video {
  width: 100%;
  height: 200px;
}
</style>
