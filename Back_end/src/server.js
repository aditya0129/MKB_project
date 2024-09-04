// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// const { ExpressPeerServer } = require("peer");
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });
// const opinions = {
//   debug: true,
// };

// app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.use("/peerjs", ExpressPeerServer(server, opinions));

// app.get("/", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });

// app.get("/:room", (req, res) => {
//   res.render("room", { roomId: req.params.room });
// });

// io.on("connection", (socket) => {
//   socket.on("join-room", (roomId, userId, userName) => {
//     socket.join(roomId);
//     setTimeout(() => {
//       io.to(roomId).emit("user-connected", userId);
//     }, 1000);
//     socket.on("message", (message) => {
//       io.to(roomId).emit("createMessage", message, userName);
//     });
//   });
// });

// const PORT = process.env.PORT || 3030;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("view engine", "ejs");
app.use(express.static("public"));

// Redirect to a unique room ID
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

const rooms = {}; // To keep track of users in each room

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }

    rooms[roomId].add(userId);
    socket.join(roomId);

    // Notify other users in the room
    socket.to(roomId).emit("user-connected", userId);

    // Check and start the timer if exactly two users are in the room
    if (rooms[roomId].size === 2) {
      io.to(roomId).emit("start-timer");
    }

    socket.on("disconnect", () => {
      rooms[roomId].delete(userId);
      socket.to(roomId).emit("user-disconnected", userId);

      // Stop the timer if less than two users are in the room
      if (rooms[roomId].size < 2) {
        io.to(roomId).emit("stop-timer");
      }

      // Clean up room if empty
      if (rooms[roomId].size === 0) {
        delete rooms[roomId];
      }
    });
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
