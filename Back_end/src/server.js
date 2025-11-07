require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { ExpressPeerServer } = require("peer");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const { isAuthenticated } = require("./Auth/Middi");

// ------------------- basic app
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
connectDB();

// ------------------- PeerJS
const peerServer = ExpressPeerServer(server, { debug: true, path: "/peerjs" });
app.use("/peerjs", peerServer);

// ------------------- Socket.IO with CORS and auth
const allowedOrigins = [
  "https://myvideochat.space",
  "https://www.myvideochat.space",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const io = require("socket.io")(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Origin not allowed"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/",
});

// helper to parse cookie header (simple)
function parseCookiesFromHeader(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((acc, kv) => {
    const [k, v] = kv.split("=").map(s => s && s.trim());
    if (k) acc[k] = v;
    return acc;
  }, {});
}

// Validate socket token at handshake and attach user to socket
io.use((socket, next) => {
  try {
    const tokenFromAuth = socket.handshake.auth && socket.handshake.auth.token;
    const cookies = parseCookiesFromHeader(socket.handshake.headers.cookie);
    const token =
      tokenFromAuth ||
      cookies?.auth_token ||
      cookies?.token ||
      socket.handshake.headers["x-auth-token"];

    if (!token) {
      const e = new Error("Authentication error: token missing");
      e.data = { content: "Auth token required" };
      return next(e);
    }

    const secret = process.env.JWT_SECRET || "man-ki-baat";
    const decoded = jwt.verify(token, secret);

    // attach decoded payload
    socket.user = decoded;
    socket.token = token;
    return next();
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    const e = new Error("Authentication error");
    e.data = { content: err.message };
    return next(e);
  }
});

// room state:
const roomTimers = {};
const roomUsers = {}; // { roomId: [ { socketId, peerId, role, dbId, displayName } ] }

// connection
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id, "user:", socket.user);

  socket.on("join-room", async (roomId, peerId, displayName, dbId, role) => {
    try {
      if (!roomId) {
        socket.emit("error", "roomId missing");
        return;
      }

      // Use token identity when dbId not provided
      if (!dbId && socket.user) {
        dbId = socket.user.userId || socket.user.advisorId || null;
      }

      socket.userMeta = { roomId, peerId, displayName, dbId, role };

      // create list if missing
      if (!roomUsers[roomId]) roomUsers[roomId] = [];

      // Reject if room full (optional)
      if (roomUsers[roomId].length >= 2) {
        socket.emit("room-full", { message: "Room is full" });
        console.log(`Room ${roomId} full - reject ${displayName}`);
        return;
      }

      // push participant
      roomUsers[roomId].push({
        socketId: socket.id,
        peerId,
        displayName,
        role,
        dbId,
      });

      socket.join(roomId);
      console.log(`${displayName} (${role}) joined ${roomId} — total ${roomUsers[roomId].length}`);

      // notify existing users about new peer
      socket.to(roomId).emit("user-connected", { peerId, displayName, role });

      // start timer if both present
      if (roomUsers[roomId].length === 2 && !roomTimers[roomId]) {
        roomTimers[roomId] = Date.now();
        io.to(roomId).emit("start-timer", roomTimers[roomId]);
      } else if (roomUsers[roomId].length > 2) {
        // still emit timer to newly-joined if exists
        socket.emit("start-timer", roomTimers[roomId]);
      }

      // forward chat messages
      socket.on("message", (message) => {
        io.to(roomId).emit("createMessage", message, displayName || "Unknown");
      });

      // handle disconnection for this socket
      socket.on("disconnect", () => {
        console.log(`🔴 ${displayName} disconnected from ${roomId}`);
        if (roomUsers[roomId]) {
          roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
          if (roomUsers[roomId].length === 0) {
            delete roomUsers[roomId];
            delete roomTimers[roomId];
            console.log(`Room ${roomId} cleared`);
          } else {
            io.to(roomId).emit("user-disconnected", peerId);
          }
        }
      });
    } catch (err) {
      console.error("join-room error:", err);
      socket.emit("error", "join-room error");
    }
  });
});

// ------------------- create-room endpoint (unchanged)
app.get("/api-b/create-room", (req, res) => {
  const token =
    req.cookies?.auth_token ||
    req.cookies?.token ||
    req.headers["x-auth-token"] ||
    req.query.token;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  // store cookie (httpOnly) for subsequent requests (domain sameSite considerations)
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    domain: process.env.NODE_ENV === "production" ? ".myvideochat.space" : "localhost",
    maxAge: 15 * 60 * 1000,
  });

  const newRoomId = uuidv4();
  console.log("✅ New room created:", newRoomId);

  return res.json({
    success: true,
    redirectUrl: `/room/${newRoomId}`,
    roomId: newRoomId,
  });
});

// ------------------- room route (render ejs)
app.get("/:room", isAuthenticated, (req, res) => {
  const roomId = req.params.room;
  const user = req.user || {};
  let userId="", advisorId="", role="";

  if (user.userId) { userId = user.userId; role="user"}
  else if (user.advisorId) { advisorId = user.advisorId; role="advisor" }
  else { return res.status(400).send("Invalid token payload"); }

  res.render("room", { roomId, userId, advisorId, role });
});

// start server
const PORT = process.env.SOCKET_PORT || 3030;
server.listen(PORT, () => console.log(`Socket server running on ${PORT}`));