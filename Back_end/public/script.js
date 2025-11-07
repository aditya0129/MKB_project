/******************************************************
 ✅ BASIC INITIAL SETUP
******************************************************/
let socket = null;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

let myVideoStream;
let callStartTime = null;
let timerInterval = null;
let isCallPaused = false;

const timerElement = document.querySelector("#timer span");

/******************************************************
 ✅ UI BUTTONS
******************************************************/
const showChat = document.getElementById("showChat");
const backBtn = document.querySelector(".header__back");
const muteButton = document.getElementById("muteButton");
const stopVideoButton = document.getElementById("stopVideo");
const endCallButton = document.getElementById("endCallButton");
const inviteButton = document.getElementById("inviteButton");

/******** Show Chat ********/
showChat.onclick = () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__left").style.display = "none";
  backBtn.style.display = "block";
};

/******** Back Button ********/
backBtn.onclick = () => {
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".main__left").style.display = "flex";
  backBtn.style.display = "none";
};

/******************************************************
 ✅ USER NAME PROMPT
******************************************************/
const displayName = prompt("Enter Your Name") || ROLE;

/******************************************************
 ✅ PEERJS CONNECTION (to your server)
******************************************************/
const peer = new Peer(undefined, {
  host: "myvideochat.space",
  port: 443,
  secure: true,
  path: "/peerjs",
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "openai",
        credential: "openai",
      },
    ],
  },
  debug: 2,
});

/******************************************************
 ✅ GET USER MEDIA
******************************************************/
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

/******************************************************
 ✅ WHEN PEER OPENS → CONNECT SOCKET.IO
******************************************************/
peer.on("open", (peerId) => {
  console.log("Peer Connected:", peerId);

  socket = io("https://myvideochat.space", {
    path: "/socket.io/",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token: localStorage.getItem("token") || null,
      peerId,
      role: ROLE,
      dbId: ROLE === "advisor" ? ADVISOR_ID : USER_ID,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    socket.emit(
      "join-room",
      ROOM_ID,
      peerId,
      displayName,
      ROLE === "advisor" ? ADVISOR_ID : USER_ID,
      ROLE
    );
  });

  socket.on("user-connected", ({ peerId }) => {
    console.log("User connected:", peerId);
    connectToNewUser(peerId, myVideoStream);
  });

  socket.on("user-disconnected", (peerId) => {
    console.log("User disconnected:", peerId);
  });

  socket.on("start-timer", (startTime) => {
    callStartTime = startTime;
    startTimer(startTime);
  });
});

/******************************************************
 ✅ CONNECT TO NEW USER
******************************************************/
function connectToNewUser(peerId, stream) {
  const call = peer.call(peerId, stream);
  const video = document.createElement("video");

  call.on("stream", (remote) => {
    addVideoStream(video, remote);

    if (!callStartTime) {
      callStartTime = Date.now();
      startTimer(callStartTime);
    }
  });
}

/******************************************************
 ✅ ADD VIDEO STREAM
******************************************************/
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
}

/******************************************************
 ✅ TIMER FUNCTION
******************************************************/
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

/******************************************************
 ✅ CHAT FEATURE
******************************************************/
const textMessage = document.getElementById("chat_message");
const sendButton = document.getElementById("send");
const messages = document.querySelector(".messages");

sendButton.onclick = sendMessage;
textMessage.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  if (textMessage.value.trim().length === 0) return;

  socket.emit("message", textMessage.value);
  textMessage.value = "";
}

socket?.on("createMessage", (message, userName) => {
  messages.innerHTML += `
    <div class="message">
      <b><i class="far fa-user-circle"></i> ${userName}</b>
      <span>${message}</span>
    </div>
  `;
});

/******************************************************
 ✅ INVITE BUTTON
******************************************************/
inviteButton.onclick = () => {
  const url = new URL(window.location.href);
  url.search = "";
  prompt("Copy this link and send:", url.toString());
};

/******************************************************
 ✅ MUTE BUTTON
******************************************************/
muteButton.onclick = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  myVideoStream.getAudioTracks()[0].enabled = !enabled;

  muteButton.innerHTML = enabled
    ? `<i class="fa fa-microphone-slash"></i>`
    : `<i class="fa fa-microphone"></i>`;

  muteButton.classList.toggle("background__red");
};

/******************************************************
 ✅ VIDEO BUTTON
******************************************************/
stopVideoButton.onclick = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  myVideoStream.getVideoTracks()[0].enabled = !enabled;

  stopVideoButton.innerHTML = enabled
    ? `<i class="fa fa-video-slash"></i>`
    : `<i class="fa fa-video"></i>`;

  stopVideoButton.classList.toggle("background__red");
};

/******************************************************
 ✅ END CALL BUTTON
******************************************************/
endCallButton.onclick = () => {
  peer.destroy();
  socket.disconnect();
  myVideoStream.getTracks().forEach((track) => track.stop());

  window.location.href = "/backend/call-ended";
};

/******************************************************
 ✅ BEFORE TAB CLOSE
******************************************************/
window.addEventListener("beforeunload", () => {
  fetch("/backend/end_call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: USER_ID }),
  });
});
