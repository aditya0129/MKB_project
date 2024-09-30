const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
};

app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));

// Generate a new room id and redirect
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// Render room with the specific roomId
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  // User joins a room
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    console.log(`${userName} joined room: ${roomId}`);

    // Broadcast to others that a new user has connected after a short delay
    setTimeout(() => {
      socket.to(roomId).emit("user-connected", userId);
    }, 1000);

    // Handle incoming messages and broadcast to the room
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName || "Unknown User");
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
