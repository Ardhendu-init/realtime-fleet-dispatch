"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Home() {
  useEffect(() => {
    // 1. Create the socket
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    // 2. Socket event handlers
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("ping", { msg: "Hello from client" });
    });

    socket.on("pong", (data) => {
      console.log("Received:", data);
    });

    // 3. Cleanup function (MUST return void)
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return <div className="p-8">Open console to see logs 🔍</div>;
}
