import React from "react";

export default function ChatBubble({ message, currentUserId }) {
  // Backend se senderId aata hai
  const senderId = message.senderId || message.user?._id;
  
  // Safe comparison
  const isSelf = senderId?.toString() === currentUserId?.toString();
  
  // Time format
  const time = message.createdAt 
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  // Message ka text
  const messageText = message.message || message.text;

  // ✅ GIFT MESSAGE CHECK
  if (messageText?.startsWith("[GIFT]")) {
    // Format: [GIFT] imageUrl - GiftName
    const parts = messageText.replace("[GIFT] ", "").split(" - ");
    const giftImage = parts[0];
    const giftName = parts[1] || "Gift";

    return (
      <div className={`flex mb-3 ${isSelf ? "justify-end" : "justify-start"}`}>
        <div className="flex flex-col items-center bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-2xl p-4 shadow-lg max-w-[60%]">
          <p className="text-xs font-bold text-yellow-800 mb-2 tracking-wider">🎁 GIFT</p>
          <img 
            src={giftImage} 
            alt={giftName} 
            className="w-20 h-20 object-contain drop-shadow-lg" 
          />
          <p className="text-sm font-bold text-yellow-900 mt-2">{giftName}</p>
          <p className="text-xs text-yellow-700 mt-1">
            {isSelf ? "You sent a gift" : "You received a gift"}
          </p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  // Normal Message (agar gift nahi hai)
  if (!messageText) return null;

  return (
    <div className={`flex mb-3 ${isSelf ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col max-w-[75%] rounded-xl p-3 shadow-lg ${isSelf ? "bg-red-500 rounded-br-none text-white" : "bg-[#FFFAF5] rounded-tl-none text-gray-800"}`}>
        <p className="text-sm break-words">{messageText}</p>
        <div className={`mt-1 text-xs text-right ${isSelf ? 'text-white/70' : 'text-gray-500'}`}>
          {time} {isSelf && '✓'}
        </div>
      </div>
    </div>
  );
}