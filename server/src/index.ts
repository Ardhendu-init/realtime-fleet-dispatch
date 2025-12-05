import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/auth", authRoutes);

const io = new IOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("\n🔌 Socket attempting connection...");

  // 1) Token is sent in handshake auth
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.log("❌ No token provided");
    socket.disconnect();
    return;
  }

  try {
    // 2) Decode token
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    (socket as any).user = user;

    console.log("✅ WebSocket Authenticated:", user);

    // 3) Add socket to rooms based on role
    if (user.role === "DRIVER") {
      socket.join(`driver:${user.id}`);
      console.log(`🚚 Driver joined driver:${user.id}`);
    }

    if (user.role === "DISPATCHER") {
      socket.join("dispatchers");
      console.log("🧭 Dispatcher joined room: dispatchers");
    }

    socket.emit("auth:success", {
      message: "WebSocket authenticated successfully",
      user,
    });
  } catch (err) {
    console.log("❌ Invalid WebSocket token");
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
