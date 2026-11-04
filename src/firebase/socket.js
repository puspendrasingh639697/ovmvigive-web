import { io } from "socket.io-client";

let socket = null;
let userEmailGlobal = null;

export const initSocket = (userEmail) => {
  userEmailGlobal = userEmail;

  if (!socket) {
    socket = io("https://sd-1-8uxc.onrender.com/", {
      transports: ["websocket"],
      reconnection: true,             // auto-reconnect
      reconnectionAttempts: Infinity, // try forever
      reconnectionDelay: 3000,        // 3s delay before next try
      reconnectionDelayMax: 10000,    // max 10s between attempts
      timeout: 20000,                 // 20s timeout for connect
    });

    // ✅ When connected (first time or after reconnect)
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      if (userEmailGlobal) {
        socket.emit("register", userEmailGlobal);
        console.log(`📩 Registered again as ${userEmailGlobal}`);
      }
    });

    // 🚨 If disconnected (e.g. network loss)
    socket.on("disconnect", (reason) => {
      console.log("⚡ Socket disconnected:", reason);
      if (["ping timeout", "transport close", "transport error"].includes(reason)) {
        console.log("📡 Lost internet connection — will auto reconnect...");
      }
    });

    // 🔁 When successfully reconnected
    socket.on("reconnect", (attempt) => {
      console.log(`🔁 Reconnected after ${attempt} attempts`);
      if (userEmailGlobal) {
        socket.emit("register", userEmailGlobal);
        console.log(`📩 Re-registered as ${userEmailGlobal}`);
      }
    });

    // Optional logging for debugging
    socket.on("reconnect_error", (err) => {
      console.log("❌ Reconnect error:", err.message);
    });

    socket.on("reconnect_failed", () => {
      console.log("🚨 Reconnect failed permanently");
    });

    // Your global events (unchanged)
    socket.on("incoming_call", (data) => console.log("Incoming call:", data));
    socket.on("user_busy", (data) => console.log("User busy:", data));
    socket.on("call_started", (data) => console.log("Call started:", data));
    socket.on("call_ended", (data) => console.log("Call ended:", data));
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized!");
  return socket;
};