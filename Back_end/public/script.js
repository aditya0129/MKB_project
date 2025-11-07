// ======================================================================
// ✅ BASIC SETUP
// ======================================================================
let socket = null;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const showChat = document.getElementById("showChat");
const backBtn = document.querySelector(".header__back");
const timerElement = document.querySelector("#timer span");

let myVideoStream;
let timerInterval;
let callStartTime = null;
let isCallPaused = false;

// ======================================================================
// ✅ UI Controls
// ======================================================================
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__right").style.display = "none";
  backBtn.style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__left").style.display = "none";
  backBtn.style.display = "block";
});

// ======================================================================
// ✅ Prompt Name
// ======================================================================
const user = prompt("Enter Your Name");

// ======================================================================
// ✅ PeerJS Setup
// ======================================================================
var peer = new Peer(undefined, {
  host: "myvideochat.space",
  port: 443,
  path: "/peerjs",
  secure: true,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "openai",
        credential: "openai",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "openai",
        credential: "openai",
      },
      {
        urls: "turn:global.relay.metered.ca:443?transport=tcp",
        username: "openai",
        credential: "openai",
      },
    ],
  },
  debug: 3,
});

// ======================================================================
// ✅ Get User Media
// ======================================================================
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);

      const video = document.createElement("video");
      call.on("stream", (remoteStream) => {
        addVideoStream(video, remoteStream);

        if (!callStartTime) {
          callStartTime = Date.now();
          startTimer(callStartTime);
        }
      });
    });
  });

// ======================================================================
// ✅ Connect New User
// ======================================================================
function connectToNewUser(peerId, stream) {
  const call = peer.call(peerId, stream);
  const video = document.createElement("video");

  call.on("stream", (remoteStream) => {
    addVideoStream(video, remoteStream);

    if (!callStartTime) {
      callStartTime = Date.now();
      startTimer(callStartTime);
    }
  });
}

// ======================================================================
// ✅ Peer Open → Setup Socket.io
// ======================================================================
peer.on("open", (peerId) => {
  socket = io("https://myvideochat.space", {
    path: "/socket.io/",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token: localStorage.getItem("token"),
      role: ROLE,
      dbId: ROLE === "advisor" ? ADVISOR_ID : USER_ID,
      peerId,
    },
  });

  socket.on("connect", () => {
    socket.emit("join-room", ROOM_ID, peerId, user, USER_ID, ROLE);
  });

  socket.on("user-connected", ({ peerId }) => {
    connectToNewUser(peerId, myVideoStream);
  });
});

// ======================================================================
// ✅ Add Video Stream
// ======================================================================
function addVideoStream(video, stream) {
  video.srcObject = stream;

  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
}

// ======================================================================
// ✅ Timer
// ======================================================================
function startTimer(startTime) {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (isCallPaused) return;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");

    timerElement.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ======================================================================
// ✅ CHAT SEND
// ======================================================================
const sendBtn = document.getElementById("send");
const chatInput = document.getElementById("chat_message");
const messages = document.querySelector(".messages");

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  if (chatInput.value.trim().length === 0) return;

  socket.emit("message", chatInput.value);
  chatInput.value = "";
}

socket?.on("createMessage", (message, userName) => {
  messages.innerHTML += `
    <div class="message">
      <b><i class="far fa-user-circle"></i> ${
        userName === user ? "me" : userName
      }</b>
      <span>${message}</span>
    </div>`;
});

// ======================================================================
// ✅ AUDIO TOGGLE
// ======================================================================
document.getElementById("muteButton").addEventListener("click", () => {
  const audioTrack = myVideoStream.getAudioTracks()[0];

  audioTrack.enabled = !audioTrack.enabled;

  document.getElementById("muteButton").innerHTML = audioTrack.enabled
    ? `<i class="fa fa-microphone"></i>`
    : `<i class="fa fa-microphone-slash" style="color:red"></i>`;
});

// ======================================================================
// ✅ VIDEO TOGGLE
// ======================================================================
document.getElementById("stopVideo").addEventListener("click", () => {
  const videoTrack = myVideoStream.getVideoTracks()[0];

  videoTrack.enabled = !videoTrack.enabled;

  document.getElementById("stopVideo").innerHTML = videoTrack.enabled
    ? `<i class="fa fa-video-camera"></i>`
    : `<i class="fa fa-video-slash" style="color:red"></i>`;
});

// ======================================================================
// ✅ INVITE BUTTON
// ======================================================================
document.getElementById("inviteButton").addEventListener("click", () => {
  const cleanUrl = window.location.origin + "/" + ROOM_ID;
  navigator.clipboard.writeText(cleanUrl);
  alert("✅ Room link copied!");
});

// ======================================================================
// ✅ END CALL
// ======================================================================
document
  .getElementById("endCallButton")
  .addEventListener("click", () => endCall());

function endCall() {
  clearInterval(timerInterval);
  isCallPaused = true;

  myVideoStream?.getTracks().forEach((t) => t.stop());
  socket?.disconnect();
  peer?.destroy();

  window.location.href = "/backend/call-ended";
}
