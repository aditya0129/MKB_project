//--------------------------------------
// GLOBALS
//--------------------------------------
let socket = null;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const timerElement = document.querySelector("#timer span");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const inviteButton = document.getElementById("inviteButton");

let myVideoStream;
let timerInterval;
let callStartTime = null;
let isCallPaused = false;

const ROLE = window.ROLE || localStorage.getItem("role");
const USER_ID = window.USER_ID || localStorage.getItem("userId");
const ADVISOR_ID = window.ADVISOR_ID || null;
const ROOM_ID = window.ROOM_ID || null;

//--------------------------------------
// UI BUTTONS
//--------------------------------------
showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__left").style.display = "none";
  backBtn.style.display = "block";
});

backBtn.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".main__left").style.display = "flex";
  backBtn.style.display = "none";
});

//--------------------------------------
// GET USER NAME
//--------------------------------------
const user = prompt("Enter Your Name") || ROLE || "Guest";

//--------------------------------------
// PEERJS INIT
//--------------------------------------
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

  debug: 2,
});

//--------------------------------------
// GET MEDIA
//--------------------------------------
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // incoming call
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

//--------------------------------------
// PEER OPEN → SOCKET CONNECT
//--------------------------------------
peer.on("open", (peerId) => {
  console.log("✅ PeerJS connected:", peerId);

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
    socket.emit(
      "join-room",
      ROOM_ID,
      peerId,
      user,
      ROLE === "advisor" ? ADVISOR_ID : USER_ID,
      ROLE
    );
  });

  socket.on("user-connected", ({ peerId }) => {
    connectToNewUser(peerId, myVideoStream);
  });

  socket.on("createMessage", (message, userName) => {
    document.querySelector(".messages").innerHTML += `
      <div class="message">
        <b>${userName === user ? "Me" : userName}</b>
        <span>${message}</span>
      </div>`;
  });

  socket.on("low-balance-popup", ({ wallet }) => {
    showLowBalancePopup(wallet);
  });

  socket.on("force-disconnect", () => {
    endCall();
  });
});

//--------------------------------------
// CALL NEW USER
//--------------------------------------
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

//--------------------------------------
// ADD VIDEO STREAM
//--------------------------------------
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
}

//--------------------------------------
// TIMER
//--------------------------------------
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

//--------------------------------------
// CHAT
//--------------------------------------
const text = document.getElementById("chat_message");
const send = document.getElementById("send");

send.addEventListener("click", () => {
  if (text.value.trim()) socket.emit("message", text.value);
  text.value = "";
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.trim()) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

//--------------------------------------
// INVITE LINK
//--------------------------------------
inviteButton.addEventListener("click", () => {
  const url = new URL(window.location.href);
  url.search = "";
  prompt("Copy this link:", url.toString());
});

//--------------------------------------
// MUTE / STOP VIDEO
//--------------------------------------
document.getElementById("muteButton").addEventListener("click", () => {
  const track = myVideoStream.getAudioTracks()[0];
  track.enabled = !track.enabled;
});

document.getElementById("stopVideo").addEventListener("click", () => {
  const track = myVideoStream.getVideoTracks()[0];
  track.enabled = !track.enabled;
});

//--------------------------------------
// WALLET DEDUCTION HELPERS
//--------------------------------------
function getTimerText() {
  return timerElement.textContent.trim();
}

//--------------------------------------
// POPUP UI (LOW BALANCE)
//--------------------------------------
let popupTimer = null;

function showLowBalancePopup(walletBalance) {
  if (document.getElementById("lowBalanceOverlay")) return;

  isCallPaused = true;

  const overlay = document.createElement("div");
  overlay.id = "lowBalanceOverlay";
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.6);
    display:flex; align-items:center; justify-content:center; z-index:999;
  `;

  const popup = document.createElement("div");
  popup.id = "lowBalancePopup";
  popup.style.cssText = `
    background:white; padding:20px; border-radius:10px;
    border:2px solid red; width:320px; text-align:center;
  `;

  popup.innerHTML = `
    <h3 style="color:red;">⚠ Wallet Balance Low</h3>
    <p>Your balance: ₹${walletBalance.toFixed(2)}</p>
    <p id="countdown" style="font-weight:bold; color:blue;">
      Disconnecting in 30s…
    </p>
    <button id="rechargeBtn" style="
      padding:10px 20px; background:green; color:white;
      border:none; border-radius:5px; cursor:pointer;">
      Recharge Now
    </button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Countdown
  let seconds = 30;
  popupTimer = setInterval(() => {
    if (!isCallPaused) return;

    seconds--;
    document.getElementById("countdown").textContent =
      `Disconnecting in ${seconds}s…`;

    if (seconds <= 0) {
      clearInterval(popupTimer);
      endCall();
    }
  }, 1000);

  document.getElementById("rechargeBtn").onclick = () => {
    clearInterval(popupTimer);
    document.getElementById("lowBalanceOverlay")?.remove();
    window.location.href = "/backend/wallet";
  };
}

//--------------------------------------
// END CALL
//--------------------------------------
async function endCall() {
  isCallPaused = true;

  if (myVideoStream)
    myVideoStream.getTracks().forEach((t) => t.stop());

  if (peer) peer.destroy();
  if (socket) socket.disconnect();
  clearInterval(timerInterval);

  const timerText = getTimerText();

  navigator.sendBeacon(
    "/backend/deduct_call_amount",
    new Blob(
      [JSON.stringify({ userId: USER_ID, timerText })],
      { type: "application/json" }
    )
  );

  alert("Call ended due to low balance.");
  window.close();
}

//--------------------------------------
// END CALL BUTTON CLICK
//--------------------------------------
document.getElementById("endCallButton").addEventListener("click", endCall);

//--------------------------------------
// BEFORE TAB CLOSE
//--------------------------------------
window.addEventListener("beforeunload", () => {
  const timerText = getTimerText();

  navigator.sendBeacon(
    "/backend/deduct_call_amount",
    new Blob(
      [JSON.stringify({ userId: USER_ID, timerText })],
      { type: "application/json" }
    )
  );
});