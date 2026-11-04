


import React from "react";
import { IoArrowBack } from "react-icons/io5";

// ✅ Images Import (Apne path ke hisaab se check kar lena)
import phoneImg from "../../assets/images/phone.png";
import hdImg from "../../assets/images/hd.png";
import giftBoxImg from "../../assets/images/gift-box.png";

export default function ChatHeader({ 
  user, 
  isOnline, 
  navigate, 
  isTyping, 
  onOpenGifts, 
  onBlockToggle, 
  isBlocked, 
  onClearChat 
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-green-800 border-b border-green-900">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white">
          <IoArrowBack size={24} />
        </button>
        <div className="relative">
          <img 
            src={user?.avatar || "https://i.pravatar.cc/300"} 
            alt={user?.name} 
            className="w-10 h-10 rounded-full border-2 border-white object-cover" 
          />
          <span 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-green-800 ${
              isOnline ? 'bg-green-400' : 'bg-gray-400'
            }`}
          ></span>
        </div>
        <div>
          <h1 className="text-white font-bold text-sm">{user?.name}</h1>
          <p className="text-xs text-gray-300">
            {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-white">
        {/* ✅ Voice Call Button (Phone Image) */}
        <button 
          onClick={() => navigate(`/voicecall/${user._id}`, { state: { user } })} 
          className="p-1 hover:bg-green-700 rounded-full transition"
        >
          <img src={phoneImg} alt="Call" className="w-6 h-6 object-contain" />
        </button>

        {/* ✅ Video Call Button (HD Image) */}
        <button 
          onClick={() => navigate(`/videocall/${user._id}`, { state: { user } })} 
          className="p-1 hover:bg-green-700 rounded-full transition"
        >
          <img src={hdImg} alt="Video Call" className="w-6 h-6 object-contain" />
        </button>

        {/* ✅ Gift Button */}
        <button 
          onClick={onOpenGifts} 
          className="p-1 hover:bg-green-700 rounded-full transition"
        >
          <img src={giftBoxImg} alt="Gift" className="w-6 h-6 object-contain" />
        </button>

        {/* Menu Button */}
        <button 
          onClick={() => alert("Menu")} 
          className="text-xl hover:bg-green-700 p-1 rounded-full"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}