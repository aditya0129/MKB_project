require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");

/* const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
}); */

const io = require("socket.io")(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://myvideochat.space"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/", // ✅ must match Nginx
});
const { ExpressPeerServer } = require("peer");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const { isAuthenticated } = require("./Auth/Middi");

const opinions = {
  debug: true,
};

app.set("view engine", "ejs");
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));
app.use(express.json()); // call express
app.use(cookieParser());

/* app.get("/", (req, res) => {
  const token = req.query.token; // Get token from ?token=xxx

  if (!token) {
    return res.status(400).send("Token is required");
  }

  const roomId = uuidv4();
  res.redirect(`/room/${roomId}?token=${token}`);
}); */
// ✅ Generate room only if not provided, else join the same room
/* app.get("/", (req, res) => {
  const { token, roomId } = req.query;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  // If a roomId exists (advisor joining), redirect to that same room
  if (roomId) {
    return res.redirect(`/room/${roomId}?token=${token}`);
  }

  // If no roomId, create a new one (user starting chat)
  const newRoomId = uuidv4();
  res.redirect(`/room/${newRoomId}?token=${token}`);
}); */
app.get("/api/create-room", (req, res) => {
  // ✅ Accept token from cookie, header, or query
  const token =
    req.cookies?.auth_token ||
    req.cookies?.token ||
    req.headers["x-auth-token"] ||
    req.query.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  // ✅ Store token in secure cookie (for next requests)
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // ✅ Generate a new room
  const newRoomId = uuidv4();
  console.log("✅ New room created:", newRoomId);

  // ✅ Send JSON (not redirect)
  return res.json({
    success: true,
    redirectUrl: `/room/${newRoomId}`,
    roomId: newRoomId,
  });
});

// ✅ When advisor or user joins existing room
// --- join existing room (user or advisor) ---
/* app.get("/:room", isAuthenticated, (req, res) => {
  const roomId = req.params.room;
  const token = req.query.token;

  if (!token) return res.status(400).send("Token missing");

  const user = req.user || {};
  let userId = "";
  let advisorId = "";
  let role = "";

  if (user.userId) {
    // Normal user logged in
    userId = user.userId;
    role = "user";
  } else if (user.advisorId) {
    // Advisor logged in
    advisorId = user.advisorId;
    role = "advisor";
  } else {
    console.warn("Invalid token payload:", user);
    return res.status(400).send("Invalid token payload");
  }

  console.log(`✅ ${role} joined room ${roomId}`);

  res.render("room", {
    roomId,
    userId,
    advisorId,
    role,
  });
}); */
// Render the room page with the specific room ID
/* app.get("/:room", isAuthenticated, (req, res) => {
  // res.render("room", { roomId: req.params.room });
  res.render("room", {
    roomId: req.params.room,
    userId: req.user.userId, // <- assuming req.user is populated
  });
}); */

app.get("/:room", isAuthenticated, (req, res) => {
  const roomId = req.params.room;

  const user = req.user || {};
  let userId = "";
  let advisorId = "";
  let role = "";

  if (user.userId) {
    // Normal user logged in
    userId = user.userId;
    role = "user";
  } else if (user.advisorId) {
    // Advisor logged in
    advisorId = user.advisorId;
    role = "advisor";
  } else {
    console.warn("Invalid token payload:", user);
    return res.status(400).send("Invalid token payload");
  }

  console.log(`✅ ${role} joined room ${roomId}`);

  res.render("room", {
    roomId,
    userId,
    advisorId,
    role,
  });
});
// Manage active rooms and their timers
const roomTimers = {}; // To track timers for rooms
const roomUsers = {}; // To track the number of users in each room

// Socket.io connection handling
/* io.on("connection", (socket) => {
  // User joins a room
  socket.on("join-room", (roomId, userId, userName, dbUserId) => {
    console.log(
      `User ${userName} (peerId: ${userId}, dbId: ${dbUserId}) joined room: ${roomId}`
    );
    // Optionally fetch from DB
    if (dbUserId) {
      User.findById(dbUserId)
        .then((userDoc) => {
          if (userDoc) {
            console.log("MongoDB User Found:", userDoc.name || userDoc.email);
          } else {
            console.log("No user found in DB with ID:", dbUserId);
          }
        })
        .catch((err) => {
          console.error("Error fetching user from DB:", err.message);
        });
    }
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = 0;
    }
    roomUsers[roomId]++; // Increment the user count for the room

    socket.join(roomId);
    console.log(`${userName} joined room: ${roomId}`);
    console.log(`Users in room ${roomId}: ${roomUsers[roomId]}`);

    // Start the timer when there are at least 2 users
    if (roomUsers[roomId] === 2) {
      if (!roomTimers[roomId]) {
        roomTimers[roomId] = Date.now(); // Record the timer start time
        io.to(roomId).emit("start-timer", roomTimers[roomId]);
        console.log(
          `Timer started for room: ${roomId} at ${new Date(roomTimers[roomId])}`
        );
      }
    } else if (roomUsers[roomId] > 2) {
      // If the timer is already running, send the start time to the newly joined user
      socket.emit("start-timer", roomTimers[roomId]);
    }

    // Notify other users about the new connection after a delay
    setTimeout(() => {
      socket.to(roomId).emit("user-connected", userId);
    }, 1000);

    // Handle incoming chat messages and broadcast them
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName || "Unknown User");
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      roomUsers[roomId] = Math.max(0, (roomUsers[roomId] || 0) - 1); // Decrement user count safely
      if (roomUsers[roomId] === 0) {
        delete roomTimers[roomId]; // Remove the timer if no users remain
        delete roomUsers[roomId]; // Clean up roomUsers entry
        console.log(`Room ${roomId} is empty, timer cleared.`);
      } else {
        console.log(
          `Users in room ${roomId} after disconnect: ${roomUsers[roomId]}`
        );
      }
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
}); */

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, peerId, displayName, dbId, role) => {
    // peerId = PeerJS id; dbId = user's DB id (userId or advisorId); role = "user"|"advisor"
    console.log(
      `Socket join-room: role=${role}, dbId=${dbId}, peerId=${peerId}, name=${displayName}, room=${roomId}`
    );

    // Optional: Lookup DB user if dbId present
    if (dbId) {
      User.findById(dbId)
        .then((userDoc) => {
          if (userDoc) {
            console.log(
              `MongoDB Found [${role}]:`,
              userDoc.name || userDoc.email
            );
          } else {
            console.log(`No DB record for id ${dbId}`);
          }
        })
        .catch((err) => console.error("DB lookup error:", err.message));
    }

    // manage room user counts
    if (!roomUsers[roomId]) roomUsers[roomId] = 0;
    roomUsers[roomId]++;

    socket.join(roomId);
    console.log(`${displayName} joined room: ${roomId}`);
    console.log(`Users in room ${roomId}: ${roomUsers[roomId]}`);

    // start timer at 2 participants
    if (roomUsers[roomId] === 2 && !roomTimers[roomId]) {
      roomTimers[roomId] = Date.now();
      io.to(roomId).emit("start-timer", roomTimers[roomId]);
      console.log(`Timer started for room: ${roomId}`);
    } else if (roomUsers[roomId] > 2) {
      socket.emit("start-timer", roomTimers[roomId]);
    }

    // notify others
    setTimeout(() => {
      socket.to(roomId).emit("user-connected", peerId);
    }, 1000);

    socket.on("message", (message) => {
      io.to(roomId).emit(
        "createMessage",
        message,
        displayName || "Unknown User"
      );
    });

    socket.on("disconnect", () => {
      roomUsers[roomId] = Math.max(0, (roomUsers[roomId] || 0) - 1);
      if (roomUsers[roomId] === 0) {
        delete roomTimers[roomId];
        delete roomUsers[roomId];
        console.log(`Room ${roomId} empty, timer cleared.`);
      } else {
        console.log(
          `Users in room ${roomId} after disconnect: ${roomUsers[roomId]}`
        );
      }
      socket.to(roomId).emit("user-disconnected", peerId);
    });
  });
});

connectDB();

const PORT = process.env.SOCKET_PORT || 3030; // <-- changed port
server.listen(PORT, () => {
  console.log(`🚀 Socket server is running on port ${PORT}`);
});
