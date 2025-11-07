// ======================================================================
// ✅ BASIC SETUP
// ======================================================================
let socket = null;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const showChat = document.querySelector("#showChat");
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
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
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

      // ✅ TURN (Guaranteed working)
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "openai",
        credential: "openai"
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "openai",
        credential: "openai"
      },
      {
        urls: "turn:global.relay.metered.ca:443?transport=tcp",
        username: "openai",
        credential: "openai"
      }
    ]
  },
  debug: 3
});

// ======================================================================
// ✅ Get Media Stream
// ======================================================================
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on("call", (call) => {
    call.answer(stream);
    const video = document.createElement("video");

    call.on("stream", (remote) => {
      addVideoStream(video, remote);

      if (!callStartTime) {
        callStartTime = Date.now();
        startTimer(callStartTime);
      }
    });
  });
});

// ======================================================================
// ✅ Connect to Peer
// ======================================================================
function connectToNewUser(peerId, stream) {
  const call = peer.call(peerId, stream);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);

    if (!callStartTime) {
      callStartTime = Date.now();
      startTimer(callStartTime);
    }
  });
}

// ======================================================================
// ✅ Peer Open → Connect Socket
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
      peerId
    }
  });

  socket.on("connect", () => {
    socket.emit("join-room", ROOM_ID, peerId, user, USER_ID, ROLE);
  });

  socket.on("user-connected", ({ peerId }) => {
    connectToNewUser(peerId, myVideoStream);
  });
});

// ======================================================================
// ✅ ADD VIDEO STREAM
// ======================================================================
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
}

// ======================================================================
// ✅ TIMER
// ======================================================================
function startTimer(startTime) {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isCallPaused) return;

    const timePassed = Math.floor((Date.now() - startTime) / 1000);

    const h = String(Math.floor(timePassed / 3600)).padStart(2, "0");
    const m = String(Math.floor((timePassed % 3600) / 60)).padStart(2, "0");
    const s = String(timePassed % 60).padStart(2, "0");

    timerElement.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ======================================================================
// ✅ CHAT
// ======================================================================
const text = document.querySelector("#chat_message");
const send = document.getElementById("send");
const messages = document.querySelector(".messages");

send.addEventListener("click", sendMessage);
text.addEventListener("keydown", (e) => e.key === "Enter" && sendMessage());

function sendMessage() {
  if (text.value.trim()) {
    socket.emit("message", text.value);
    text.value = "";
  }
}

socket?.on("createMessage", (message, userName) => {
  messages.innerHTML += `
    <div class="message">
      <b><i class="far fa-user-circle"></i> ${userName === user ? "me" : userName}</b>
      <span>${message}</span>
    </div>`;
});

// ======================================================================
// ✅ LOW BALANCE POPUP
// ======================================================================
socket?.on("low-balance-popup", ({ walletBalance }) => {
  showLowBalancePopup(walletBalance);
});

// ======================================================================
// ✅ FORCE DISCONNECT (Balance finished)
// ======================================================================
socket?.on("force-disconnect", () => {
  endCall(true);
});

// ======================================================================
// ✅ LOW BALANCE POPUP UI
// ======================================================================
let popupTimer = null;

function showLowBalancePopup(walletBalance) {
  if (document.getElementById("lowBalanceOverlay")) return;

  isCallPaused = true;

  const overlay = document.createElement("div");
  overlay.id = "lowBalanceOverlay";
  overlay.style = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.6); display:flex;
    justify-content:center; align-items:center; z-index:9999;
  `;

  const popup = document.createElement("div");
  popup.style = `
    background:white; padding:20px; width:300px; border-radius:10px;
    border:2px solid red; text-align:center;
  `;
  popup.innerHTML = `
    <h3 style="color:red;">⚠ Low Wallet Balance!</h3>
    <p>Your balance is ₹${walletBalance}. Please recharge.</p>
    <p id="countdown" style="color:blue; font-weight:bold;">Disconnecting in 30s…</p>
    <button id="rechargeBtn" style="
      margin-top:10px; padding:10px; border:none;
      background:green; color:white; border-radius:5px;">Recharge Now</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // 30s Countdown
  let sec = 30;
  popupTimer = setInterval(() => {
    sec--;
    document.getElementById("countdown").textContent = `Disconnecting in ${sec}s…`;

    if (sec <= 0) {
      clearInterval(popupTimer);
      endCall(true);
    }
  }, 1000);

  document.getElementById("rechargeBtn").onclick = () => {
    clearInterval(popupTimer);
    window.location.href = "/backend/wallet";
  };
}

// ======================================================================
// ✅ END CALL
// ======================================================================
document.getElementById("endCallButton").addEventListener("click", () => endCall());

function endCall(force = false) {
  clearInterval(timerInterval);
  isCallPaused = true;

  if (peer) peer.destroy();
  if (socket) socket.disconnect();

  myVideoStream?.getTracks().forEach((t) => t.stop());

  if (force) {
    alert("Call disconnected due to low balance.");
    window.location.href = "/backend/call-ended";
  } else {
    window.close();
  }
}

// ======================================================================
// ✅ TAB CLOSE CLEANUP
// ======================================================================
window.addEventListener("beforeunload", () => {
  fetch("/backend/end_call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: USER_ID })
  });
});