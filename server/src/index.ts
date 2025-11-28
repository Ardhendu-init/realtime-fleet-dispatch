import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("ping", (data) => {
    console.log("PING from client:", data);
    socket.emit("pong", { ok: true, message: "PONG from server" });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
