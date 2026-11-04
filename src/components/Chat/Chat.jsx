import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import { IoIosSend, IoIosImages, IoIosGift } from "react-icons/io";
import ChatHeader from "./ChatHeader";
import ChatBubble from "./ChatBubble";
import StickerPickerModal from "./StickerPickerModal";

import chatBgImage from "../../assets/images/chatbgimage.jpg";
import chatCenterImage from "../../assets/images/chatimahe.png";

const socket = io("http://localhost:5000");

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams(); 

  const stateUser = location.state?.user;
  const partnerUser = stateUser 
    ? { ...stateUser, _id: stateUser._id || stateUser.id } 
    : { _id: userId || "dummy123", id: userId || "dummy123", name: "User", avatar: "https://i.pravatar.cc/300" };

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  
  // ✅ Backend se balance fetch hoga
  const [userGold, setUserGold] = useState(0);
  const [userDiamond, setUserDiamond] = useState(0);

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Balance fetch karein
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/gift/my-balance", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserGold(data.goldCoins || 0);
        setUserDiamond(data.diamondCoins || 0);
      })
      .catch((err) => console.error("Balance fetch error:", err));
  }, [token]);

  // Socket + Messages
  useEffect(() => {
    if (!currentUser?.id || !partnerUser?._id) return;

    socket.emit("addUser", currentUser.id);

    // Online/Offline
    socket.on("userOnline", (userId) => {
      if (userId.toString() === partnerUser._id.toString()) setIsPartnerOnline(true);
    });
    socket.on("userOffline", (userId) => {
      if (userId.toString() === partnerUser._id.toString()) setIsPartnerOnline(false);
    });

    // Fetch Messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${partnerUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setMessages(data);
      } catch (err) {
        console.log("Error:", err);
      }
    };
    if (token) fetchMessages();

    // New Message
    socket.on("getMessage", (newMessage) => {
      const msgSenderId = newMessage.senderId.toString();
      const msgReceiverId = newMessage.receiverId.toString();
      const myId = currentUser.id.toString();
      const partnerId = partnerUser._id.toString();

      if (
        (msgSenderId === partnerId && msgReceiverId === myId) ||
        (msgSenderId === myId && msgReceiverId === partnerId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Message Sent
    socket.on("messageSent", (newMessage) => {
      setMessages((prev) => {
        const filtered = prev.filter(m => m._id !== newMessage._id);
        return [...filtered, newMessage];
      });
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("getMessage");
      socket.off("messageSent");
    };
  }, [currentUser?.id, partnerUser?._id, token]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    if (!currentUser?.id || !partnerUser?._id) return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: partnerUser._id,
      message: inputText.trim(),
    };

    socket.emit("sendMessage", messageData);
    
    const tempMessage = {
      _id: uuidv4(),
      senderId: currentUser.id,
      receiverId: partnerUser._id,
      message: inputText.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInputText("");
    setIsTyping(false);
  };

  const handleChangeText = (value) => {
    setInputText(value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

  // ✅ Gift Send karne ka function (Backend API call)
  const handleSendGift = async (gift) => {
    if (!gift) return;

    if (userGold < gift.price) {
      alert(`Insufficient coins! You need ${gift.price} coins, you have ${userGold}.`);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/gift/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: partnerUser._id,
          giftId: gift._id,
          message: "Enjoy your gift!",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Balance update
        setUserGold(data.newBalance);
        setShowStickerPicker(false);

        // Chat mein gift message bhejein
        const giftMessage = `[GIFT] ${gift.imageUrl} - ${gift.name}`;
        socket.emit("sendMessage", {
          senderId: currentUser.id,
          receiverId: partnerUser._id,
          message: giftMessage,
        });

        // UI mein turant dikhayein
        const tempMsg = {
          _id: uuidv4(),
          senderId: currentUser.id,
          receiverId: partnerUser._id,
          message: giftMessage,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMsg]);
      } else {
        alert(data.error || "Gift send failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col text-white relative">
      <div className="z-20 relative">
        <ChatHeader 
          user={partnerUser} 
          isOnline={isPartnerOnline}
          navigate={navigate} 
          isTyping={isTyping} 
          onOpenGifts={() => setShowStickerPicker(true)}
          onBlockToggle={() => { setIsBlocked(!isBlocked); setIsChatDisabled(!isBlocked); }}
          isBlocked={isBlocked}
          onClearChat={() => setMessages([])}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative"
        style={{ backgroundImage: `url(${chatBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f3f4f6' }}
      >
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40">
          <img src={chatCenterImage} alt="chat-center" className="w-64 h-64 md:w-96 md:h-96 object-contain" />
        </div>

        <div className="relative z-10 space-y-3">
          {messages.map((message, index) => (
            <ChatBubble key={message._id || index} message={message} currentUserId={currentUser?.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 p-3 bg-pink-700 flex items-center space-x-2 border-t border-gray-200">
        {isChatDisabled ? (
          <div className="flex-1 p-3 text-center text-red-500 bg-red-50 rounded-full border border-red-200">
            {isBlocked ? "You have blocked this user." : "You are blocked by this user."}
          </div>
        ) : (
          <>
            <button className="p-3 text-pink-white hover:bg-gray-100 rounded-full" onClick={() => alert("Media disabled")}>
              <IoIosImages size={24} />
            </button>
            <button className="p-3 text-pink-white hover:bg-gray-100 rounded-full" onClick={() => setShowStickerPicker(true)}>
              <IoIosGift size={24} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => handleChangeText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 text-white"
            />
            <button onClick={handleSendMessage} disabled={!inputText.trim()}
              className={`p-3 transition-colors ${inputText.trim() ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-800 text-white"}`}>
              <IoIosSend size={24} />
            </button>
          </>
        )}
      </div>

      {showStickerPicker && (
        <StickerPickerModal 
          onClose={() => setShowStickerPicker(false)} 
          onSend={handleSendGift}  // ✅ handleSendGift pass karein
          userGold={userGold}
          userDiamond={userDiamond}
        />
      )}
    </div>
  );
}