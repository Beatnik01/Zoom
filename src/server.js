import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected to Browser ❌"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    if (message.type === "new_message") {
      sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
    } else if (message.type === "nickname") {
      socket["nickname"] = message.payload;
    }
  });
  socket.send("Hello~");
});

server.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});
