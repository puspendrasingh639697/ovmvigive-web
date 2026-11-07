import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import aiButtonImage from "../assets/images/Untitled Design.png"; // ✅ Image import ki

export default function FloatingAIButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Sirf in pages par button dikhega (Home, Splash)
  const showOnPages = ["/", "/mainsrceen"];
  const shouldShow = showOnPages.includes(location.pathname);

  // Agar allowed page nahi hai, toh button na dikhayein
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => navigate("/ai-tools")}
        className="relative bg-green-800 p-0.5 rounded-full hover:scale-110 transition-transform duration-300 flex items-center justify-center w-16 h-16 overflow-hidden"
        title="Try AI Tools"
      >
        {/* ✅ Custom Image (Emoji ki jagah) */}
        <img 
          src={aiButtonImage} 
          alt="AI Tools" 
          className="w-full h-full object-cover rounded-full" 
        />

        {/* Pulse Animation (Halka sa effect) */}
        <span className="absolute inset-0 rounded-full bg-green-800 opacity-30 animate-ping pointer-events-none"></span>
      </button>
    </div>
  );
}