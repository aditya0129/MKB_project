const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { ExpressPeerServer } = require("peer");

const opinions = {
  debug: true,
};

app.set("view engine", "ejs");
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

// Generate a new room ID and redirect
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// Render the room page with the specific room ID
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Manage active rooms and their timers
const roomTimers = {}; // To track timers for rooms
const roomUsers = {}; // To track the number of users in each room

// Socket.io connection handling
io.on("connection", (socket) => {
  // User joins a room
  socket.on("join-room", (roomId, userId, userName) => {
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

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
