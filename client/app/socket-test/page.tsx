"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function SocketTestPage() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      console.warn("No token found; socket not connected");
      return;
    }

    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current = socket;

    const onConnect = () => {
      console.log("Socket connected! ID:", socket.id);
    };

    socket.on("connect", onConnect);

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", onConnect);
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log("Socket disconnected (cleanup)");
      }
    };
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold">Socket Test Page</h2>
      <p>Open the browser console to see socket connection logs.</p>
    </div>
  );
}
