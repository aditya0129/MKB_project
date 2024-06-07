const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const opinions = {
  debug: true,
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", ExpressPeerServer(server, opinions));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(() => {
      io.to(roomId).emit("user-connected", userId);
    }, 1000);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
