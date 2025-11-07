let socket = null;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const timerElement = document.querySelector("#timer span");
let myVideoStream;
let timerInterval;
let callStartTime; // Track call start time
let isCallPaused = false; // ✅ track pause state

myVideo.muted = true;

// Handle back button
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

// Show chat
showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

// Prompt for user name
const user = prompt("Enter Your Name");

var peer = new Peer(undefined, {
  host: "myvideochat.space",
  port: 443,
  path: "/peerjs",
  secure: true, // because HTTPS

  config: {
    iceServers: [
      // ✅ Google STUN
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },

      // ✅ Metered TURN (100% Works)
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

// Handle media streams
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      console.log("Someone is calling...");
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);

        // Start timer when first remote stream arrives
        if (!callStartTime) {
          callStartTime = Date.now();
          startTimer(callStartTime);
        }
      });
    });

    socket.on("user-connected", ({ peerId }) => {
      connectToNewUser(peerId, myVideoStream);
    });
  });

const connectToNewUser = (peerId, stream) => {
  console.log("Calling peer " + peerId);
  const call = peer.call(peerId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);

    // Start timer when first remote stream arrives
    if (!callStartTime) {
      callStartTime = Date.now();
      startTimer(callStartTime);
    }
  });
};

peer.on("open", (peerId) => {
  socket = io("https://myvideochat.space", {
    path: "/socket.io/",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token: localStorage.getItem("token") || null,
      role: ROLE,
      dbId: ROLE === "advisor" ? ADVISOR_ID : USER_ID,
      peerId: peerId,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    socket.emit(
      "join-room",
      ROOM_ID,
      peerId,
      user || ROLE,
      ROLE === "advisor" ? ADVISOR_ID : USER_ID,
      ROLE
    );
  });
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

// Timer logic
function startTimer(startTime) {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isCallPaused) return; // ✅ Skip updates if paused

    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

// Chat message handling
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", () => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

inviteButton.addEventListener("click", () => {
  const url = new URL(window.location.href);
  url.search = ""; // remove token
  prompt(
    "Copy this link and send it to people you want to meet with",
    url.toString()
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML += `<div class="message">
      <b><i class="far fa-user-circle"></i> ${
        userName === user ? "me" : userName
      }</b>
      <span>${message}</span>
    </div>`;
});

// Mute/Unmute and Video on/off
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    muteButton.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    muteButton.innerHTML = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    stopVideo.innerHTML = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    stopVideo.innerHTML = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
  }
});

const endCallButton = document.getElementById("endCallButton");

// ✅ Get userId safely (from EJS or fallback to localStorage)
function getUserId() {
  if (typeof USER_ID !== "undefined" && USER_ID) {
    return USER_ID; // comes from server render
  }
  return localStorage.getItem("userId"); // fallback
}

// ✅ Function to safely get timerText
function getTimerText() {
  const timerSpan = document.querySelector("#timer span");
  return timerSpan ? timerSpan.textContent.trim() : "00:00:00";
}

// ✅ Function to send deduction request
async function deductCallAmount(timerText) {
  const userId = getUserId();
  if (!userId) {
    alert("User ID not found!");
    return;
  }

  try {
    const res = await fetch("/backend/deduct_call_amount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, timerText }),
    });

    const data = await res.json();
    console.log("Deduction Response:", data);
    alert(data.message || "Call Ended, amount deducted");
  } catch (err) {
    console.error("Error deducting wallet:", err);
  }
}

// ✅ End Call button click
endCallButton.addEventListener("click", async () => {
  if (myVideoStream) {
    myVideoStream.getTracks().forEach((track) => track.stop());
  }
  if (peer) peer.destroy();
  if (socket) socket.disconnect();
  clearInterval(timerInterval);

  const timerText = getTimerText();
  await deductCallAmount(timerText);

  window.close();
});

// ✅ Trigger before tab close/refresh
window.addEventListener("beforeunload", (e) => {
  const userId = getUserId();
  const timerText = getTimerText();

  if (!userId) return;

  const payload = JSON.stringify({ userId, timerText });
  navigator.sendBeacon(
    "/backend/deduct_call_amount",
    new Blob([payload], { type: "application/json" })
  );
});

function getUserId() {
  if (typeof USER_ID !== "undefined" && USER_ID) return USER_ID;
  return localStorage.getItem("userId"); // fallback
}

function getTimerText() {
  const timerSpan = document.querySelector("#timer span");
  return timerSpan ? timerSpan.textContent.trim() : "00:00:00";
}

const userId = getUserId();
let deductionInterval = null;
let popupTimer = null; // 30s countdown for popup

function endCall() {
  if (deductionInterval) clearInterval(deductionInterval);
  if (popupTimer) clearTimeout(popupTimer);
  clearInterval(timerInterval);
  isCallPaused = true;

  fetch("/backend/end_call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
    .then((res) => res.json())
    .then((data) => console.log("✅ Reset after endCall:", data.message))
    .catch((err) => console.error("Error ending call:", err));

  console.log("📞 Call ended.");

  alert("⚠ Call disconnected due to low balance.");

  // Try closing tab
  window.close();

  // If blocked, redirect as fallback
  setTimeout(() => {
    if (!window.closed) {
      window.location.href = "/backend/call-ended";
    }
  }, 200);
}

// Popup UI
function showLowBalancePopup(walletBalance) {
  if (document.getElementById("lowBalanceOverlay")) return; // prevent duplicate

  // Stop deduction immediately
  if (deductionInterval) {
    clearInterval(deductionInterval);
    deductionInterval = null;
  }

  isCallPaused = true; // ✅ pause timer & deductions

  // Create dark overlay
  const overlay = document.createElement("div");
  overlay.id = "lowBalanceOverlay";
  overlay.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.6); z-index:999;
    display:flex; justify-content:center; align-items:center;
  `;

  // Create popup
  const popup = document.createElement("div");
  popup.id = "lowBalancePopup";
  popup.style.cssText = `
    background:white; padding:20px; border:2px solid red; border-radius:10px;
    box-shadow:0px 4px 15px rgba(0,0,0,0.5); text-align:center; width:300px;
  `;
  popup.innerHTML = `
    <h3 style="color:red;">⚠ Wallet Balance Low!</h3>
    <p>Your wallet balance is ₹${walletBalance.toFixed(2)}.
    Please recharge to continue…</p>
    <p id="countdown" style="color:blue; font-weight:bold;">
      Disconnecting in 30s…
    </p>
    <button id="rechargeBtn" style="
      background:green; color:white; border:none;
      padding:10px 20px; border-radius:5px; cursor:pointer;">
      Recharge Now
    </button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Start 30s countdown
  let secondsLeft = 30;
  const countdownEl = document.getElementById("countdown");

  popupTimer = setInterval(() => {
    if (!isCallPaused) return; // freeze countdown if somehow resumed
    secondsLeft--;
    countdownEl.textContent = `Disconnecting in ${secondsLeft}s…`;

    if (secondsLeft <= 0) {
      clearInterval(popupTimer);
      endCall();
      document.getElementById("lowBalanceOverlay")?.remove();
    }
  }, 1000);

  // Recharge button
  document.getElementById("rechargeBtn").onclick = async () => {
    clearInterval(popupTimer); // stop auto-disconnect

    try {
      await fetch("/backend/end_call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      console.log("✅ Reset after recharge");
    } catch (err) {
      console.error("Error resetting on recharge:", err);
    }

    document.getElementById("lowBalanceOverlay")?.remove();
    window.location.href = "/backend/wallet"; // recharge page
  };
}

// Reset on tab close
window.addEventListener("beforeunload", () => {
  navigator.sendBeacon("/backend/end_call", JSON.stringify({ userId }));
});
