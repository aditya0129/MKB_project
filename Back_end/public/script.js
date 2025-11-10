/* ---- script.js (final merged + fixed) ----
   - Uses PeerJS on /peerjs
   - Connects Socket.IO at /socket.io/
   - Buttons (mute, video, invite, send, end) fixed
   - Low-balance popup + periodic deduction (60s)
   - Uses server endpoints:
       POST /backend/deduct_wallet   (periodic deduction)
       POST /backend/deduct_call_amount  (final deduction on end / unload)
       POST /backend/end_call  (reset on forced end / recharge)
   - Assumes ROOM_ID, USER_ID, ADVISOR_ID, ROLE are injected by EJS
*/

let socket = null;

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

let myVideoStream = null;
let callStartTime = null;
let timerInterval = null;
let isCallPaused = false;

// UI refs
const timerElement = document.querySelector("#timer span");
const showChat = document.getElementById("showChat");
const backBtn = document.querySelector(".header__back");
const muteButton = document.getElementById("muteButton");
const stopVideoButton = document.getElementById("stopVideo");
const endCallButton = document.getElementById("endCallButton");
const inviteButton = document.getElementById("inviteButton");
const sendButton = document.getElementById("send");
const chatInput = document.getElementById("chat_message");
const messages = document.querySelector(".messages");

// Deduction & popup
let deductionInterval = null;
let popupTimer = null;
const DEDUCT_INTERVAL_MS = 60_000; // default: 60s per deduction tick
const DEDUCT_PAYLOAD = { userId: null }; // will set later

/* ----------------- UI: chat / panels ----------------- */
showChat?.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__left").style.display = "none";
  backBtn.style.display = "block";
});

backBtn?.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".main__left").style.display = "flex";
  backBtn.style.display = "none";
});

/* ----------------- Prompt user name (fallback to ROLE) ----------------- */
const displayName = (() => {
  try {
    const p = prompt("Enter Your Name");
    return p && p.trim()
      ? p.trim()
      : typeof ROLE !== "undefined"
      ? ROLE
      : "Guest";
  } catch (e) {
    return typeof ROLE !== "undefined" ? ROLE : "Guest";
  }
})();

/* ----------------- PeerJS ----------------- */
const peer = new Peer(undefined, {
  host: "myvideochat.space",
  port: 443,
  path: "/peerjs",
  secure: true,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      // keep the reliable TURN entry you had (metered)
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

/* ----------------- Get user media ----------------- */
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // Handle incoming PeerJS calls
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
  })
  .catch((err) => {
    console.error("getUserMedia error:", err);
    alert("Unable to access camera/microphone. Check permissions.");
  });

/* ----------------- When Peer ready -> connect Socket.IO ----------------- */
peer.on("open", (peerId) => {
  console.log("Peer connected:", peerId);

  socket = io("https://myvideochat.space", {
    path: "/socket.io/",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token: localStorage.getItem("token") || null,
      peerId,
      role: typeof ROLE !== "undefined" ? ROLE : null,
      dbId:
        typeof ROLE !== "undefined" && ROLE === "advisor"
          ? ADVISOR_ID
          : USER_ID,
    },
  });

  // register socket handlers here (after socket created)
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    // join room: ROOM_ID comes from EJS
    socket.emit(
      "join-room",
      ROOM_ID,
      peerId,
      displayName,
      typeof ROLE !== "undefined" && ROLE === "advisor" ? ADVISOR_ID : USER_ID,
      typeof ROLE !== "undefined" ? ROLE : "user"
    );

    // start periodic deductions when joined (if user)
    if (typeof USER_ID !== "undefined" && USER_ID) {
      DEDUCT_PAYLOAD.userId = USER_ID;
      startPeriodicDeduction(); // starts deduction loop
    }
  });

  socket.on("user-connected", ({ peerId }) => {
    console.log("user-connected:", peerId);
    // only connect if we have our media ready
    if (myVideoStream) connectToNewUser(peerId, myVideoStream);
  });

  socket.on("user-disconnected", (peerId) => {
    console.log("user-disconnected:", peerId);
  });

  socket.on("start-timer", (startTime) => {
    // server may send start time (ms)
    callStartTime = startTime;
    startTimer(startTime);
  });

  socket.on("createMessage", (message, userName) => {
    appendMessage(message, userName);
  });

  // Optional server-driven low-balance event
  socket.on("low-balance-popup", ({ walletBalance }) => {
    showLowBalancePopup(walletBalance);
  });

  socket.on("force-disconnect", () => {
    showForceDisconnectAndEnd();
  });
});

/* ----------------- Connect to remote peer ----------------- */
function connectToNewUser(peerId, stream) {
  try {
    const call = peer.call(peerId, stream);
    const video = document.createElement("video");
    call.on("stream", (remoteStream) => {
      addVideoStream(video, remoteStream);
      if (!callStartTime) {
        callStartTime = Date.now();
        startTimer(callStartTime);
      }
    });
  } catch (err) {
    console.error("connectToNewUser error:", err);
  }
}

/* ----------------- Add video element ----------------- */
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play().catch(() => {}); // ignore play() promise warnings
    videoGrid.append(video);
  });
}

/* ----------------- Timer ----------------- */
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

/* ----------------- Chat helpers ----------------- */
function appendMessage(message, userName) {
  messages.innerHTML += `
    <div class="message">
      <b><i class="far fa-user-circle"></i> ${
        userName === displayName ? "me" : userName
      }</b>
      <span>${message}</span>
    </div>`;
  // scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

/* send chat */
sendButton?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  if (!socket) return;
  if (!chatInput.value.trim()) return;
  socket.emit("message", chatInput.value.trim());
  chatInput.value = "";
}

/* ----------------- Invite button ----------------- */
inviteButton?.addEventListener("click", () => {
  const url = new URL(window.location.href);
  url.search = ""; // remove query (token)
  navigator.clipboard
    ?.writeText(url.toString())
    .then(() => {
      alert("Room link copied!");
    })
    .catch(() => {
      prompt("Copy this link", url.toString());
    });
});

/* ----------------- Mute / Video toggles ----------------- */
muteButton?.addEventListener("click", () => {
  if (!myVideoStream) return;
  const audioTrack = myVideoStream.getAudioTracks()[0];
  if (!audioTrack) return;
  audioTrack.enabled = !audioTrack.enabled;
  muteButton.innerHTML = audioTrack.enabled
    ? `<i class="fa fa-microphone"></i>`
    : `<i class="fa fa-microphone-slash"></i>`;
  muteButton.classList.toggle("background__red");
});

stopVideoButton?.addEventListener("click", () => {
  if (!myVideoStream) return;
  const videoTrack = myVideoStream.getVideoTracks()[0];
  if (!videoTrack) return;
  videoTrack.enabled = !videoTrack.enabled;
  stopVideoButton.innerHTML = videoTrack.enabled
    ? `<i class="fa fa-video-camera"></i>`
    : `<i class="fa fa-video-slash"></i>`;
  stopVideoButton.classList.toggle("background__red");
});

/* ----------------- End call ----------------- */
endCallButton?.addEventListener("click", async () => {
  await finalEndCall();
});

/* helper to get userId */
function getUserId() {
  if (typeof USER_ID !== "undefined" && USER_ID) return USER_ID;
  return localStorage.getItem("userId");
}

/* final deduction call on end */
async function finalEndCall() {
  // stop timers & media
  clearInterval(timerInterval);
  isCallPaused = true;

  // attempt final deduction
  const timerText = timerElement ? timerElement.textContent.trim() : "00:00:00";
  try {
    const userId = getUserId();
    if (userId) {
      await fetch("/backend/deduct_call_amount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timerText }),
      });
    }
  } catch (err) {
    console.error("final deduct error:", err);
  }

  // close connections & go to call-ended
  try {
    peer?.destroy();
  } catch (e) {}
  try {
    socket?.disconnect();
  } catch (e) {}
  try {
    myVideoStream?.getTracks().forEach((t) => t.stop());
  } catch (e) {}

  window.location.href = "/backend/call-ended";
}

/* ----------------- Periodic deduction loop ----------------- */
function startPeriodicDeduction() {
  // ensure single interval
  if (deductionInterval) clearInterval(deductionInterval);

  deductionInterval = setInterval(async () => {
    try {
      const userId = DEDUCT_PAYLOAD.userId || getUserId();
      if (!userId) return;

      const res = await fetch("/backend/deduct_wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          timerText: timerElement
            ? timerElement.textContent.trim()
            : "00:00:00",
        }),
      });

      const data = await res.json();
      console.log("Periodic deduct response:", data);

      // expected server response fields: { success, wallet, popup, insufficient }
      if (data && data.popup) {
        // show popup with wallet amount
        showLowBalancePopup(Number(data.wallet || 0));
      }

      if (res.status === 400 || (data && data.insufficient)) {
        // force end call
        showForceDisconnectAndEnd();
      }
    } catch (err) {
      console.error("Periodic deduction error:", err);
    }
  }, DEDUCT_INTERVAL_MS);
}

/* ----------------- Low balance popup UI ----------------- */
function showLowBalancePopup(walletBalance) {
  // avoid duplicate
  if (document.getElementById("lowBalanceOverlay")) return;
  // stop periodic deductions until user acts
  if (deductionInterval) {
    clearInterval(deductionInterval);
    deductionInterval = null;
  }

  isCallPaused = true;

  const overlay = document.createElement("div");
  overlay.id = "lowBalanceOverlay";
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.6);
    display:flex; justify-content:center; align-items:center; z-index:9999;
  `;

  const popup = document.createElement("div");
  popup.id = "lowBalancePopup";
  popup.style.cssText = `
    background:white; padding:20px; width:320px; border-radius:10px;
    box-shadow:0 8px 30px rgba(0,0,0,0.35); text-align:center;
    border:2px solid #e74c3c;
  `;

  popup.innerHTML = `
    <h3 style="color:#e74c3c; margin:0 0 10px 0;">⚠ Low Wallet Balance</h3>
    <p style="margin:0 0 12px 0;">Your wallet balance is ₹${Number(
      walletBalance
    ).toFixed(2)}. Please recharge to continue the call.</p>
    <p id="countdown" style="color:#1f77b4; font-weight:600; margin-bottom:12px;">Disconnecting in 30s…</p>
    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="rechargeBtn" style="padding:10px 14px; background:#2ecc71; color:white; border:none; border-radius:6px; cursor:pointer;">Recharge</button>
      <button id="dismissBtn" style="padding:10px 14px; background:#999; color:white; border:none; border-radius:6px; cursor:pointer;">Continue (30s)</button>
    </div>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // 30s countdown
  let sec = 30;
  popupTimer = setInterval(() => {
    sec--;
    const el = document.getElementById("countdown");
    if (el) el.textContent = `Disconnecting in ${sec}s…`;
    if (sec <= 0) {
      clearInterval(popupTimer);
      popupTimer = null;
      // cleanup & force end
      document.getElementById("lowBalanceOverlay")?.remove();
      showForceDisconnectAndEnd();
    }
  }, 1000);

  document.getElementById("rechargeBtn").onclick = () => {
    clearInterval(popupTimer);
    popupTimer = null;
    // call backend to reset/end call state if needed
    fetch("/backend/end_call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: getUserId() }),
    }).catch((e) => console.error("end_call reset:", e));
    document.getElementById("lowBalanceOverlay")?.remove();
    // navigate to wallet page
    window.location.href = "/backend/wallet";
  };

  // Dismiss keeps call running for the remaining 30s — we already paused deductions; resume deductions and timer
  document.getElementById("dismissBtn").onclick = () => {
    clearInterval(popupTimer);
    popupTimer = null;
    document.getElementById("lowBalanceOverlay")?.remove();
    isCallPaused = false;
    // restart periodic deductions
    startPeriodicDeduction();
  };
}

/* ----------------- Force disconnect & cleanup ----------------- */
function showForceDisconnectAndEnd() {
  // clear intervals
  if (deductionInterval) {
    clearInterval(deductionInterval);
    deductionInterval = null;
  }
  if (popupTimer) {
    clearInterval(popupTimer);
    popupTimer = null;
  }

  // notify server to end
  try {
    fetch("/backend/end_call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: getUserId() }),
    });
  } catch (e) {
    console.error(e);
  }

  // stop tracks
  try {
    myVideoStream?.getTracks().forEach((t) => t.stop());
  } catch (e) {}

  // disconnect peers & socket
  try {
    peer?.destroy();
  } catch (e) {}
  try {
    socket?.disconnect();
  } catch (e) {}

  alert("Call disconnected due to insufficient balance.");
  window.location.href = "/backend/call-ended";
}

/* ----------------- Beforeunload final beacon ----------------- */
window.addEventListener("beforeunload", () => {
  try {
    const userId = getUserId();
    const timerText = timerElement
      ? timerElement.textContent.trim()
      : "00:00:00";
    if (userId) {
      // best-effort; use sendBeacon
      const payload = JSON.stringify({ userId, timerText });
      navigator.sendBeacon(
        "/backend/deduct_call_amount",
        new Blob([payload], { type: "application/json" })
      );
    }
  } catch (e) {
    console.error("beforeunload error:", e);
  }
});
