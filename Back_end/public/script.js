const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const timerElement = document.querySelector("#timer span");
let myVideoStream;
let timerInterval;
let callStartTime; // Track call start time

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

// Initialize PeerJS
var peer = new Peer({
  host: "127.0.0.1",
  port: 3030,
  path: "/peerjs",
  config: {
    iceServers: [
      { url: "stun:stun01.sipphone.com" },
      { url: "stun:stun.ekiga.net" },
      { url: "stun:stunserver.org" },
      { url: "stun:stun.softjoys.com" },
      { url: "stun:stun.voiparound.com" },
      { url: "stun:stun.voipbuster.com" },
      { url: "stun:stun.voipstunt.com" },
      { url: "stun:stun.voxgratia.org" },
      { url: "stun:stun.xten.com" },
      {
        url: "turn:192.158.29.39:3478?transport=udp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
      {
        url: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
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

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  console.log("Calling user " + userId);
  const call = peer.call(userId, stream);
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

peer.on("open", (id) => {
  console.log("Emitting to backend. USER_ID = ", USER_ID);
  socket.emit("join-room", ROOM_ID, id, user, USER_ID);
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
    const res = await fetch("http://localhost:3001/deduct_call_amount", {
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
    "http://localhost:3001/deduct_call_amount",
    new Blob([payload], { type: "application/json" })
  );
});
