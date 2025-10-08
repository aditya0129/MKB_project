require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
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
app.get("/", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  // Generate new room for user start
  const newRoomId = uuidv4();
  console.log("✅ New room created:", newRoomId);

  // Redirect user to new room
  res.redirect(`/room/${newRoomId}?token=${token}`);
});

// ✅ When advisor or user joins existing room
app.get("/room/:room", isAuthenticated, (req, res) => {
  const roomId = req.params.room;
  const token = req.query.token;

  if (!token) {
    return res.status(400).send("Token missing");
  }

  // Render EJS page with room and user info
  res.render("room", {
    roomId,
    userId: req.user.userId,
  });
});

// Render the room page with the specific room ID
/* app.get("/:room", isAuthenticated, (req, res) => {
  // res.render("room", { roomId: req.params.room });
  res.render("room", {
    roomId: req.params.room,
    userId: req.user.userId, // <- assuming req.user is populated
  });
}); */

// Manage active rooms and their timers
const roomTimers = {}; // To track timers for rooms
const roomUsers = {}; // To track the number of users in each room

// Socket.io connection handling
io.on("connection", (socket) => {
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
});

connectDB();

const PORT = process.env.SOCKET_PORT || 3030; // <-- changed port
server.listen(PORT, () => {
  console.log(`🚀 Socket server is running on port ${PORT}`);
});
