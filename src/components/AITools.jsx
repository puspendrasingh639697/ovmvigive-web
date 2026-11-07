import React, { useState, useEffect, useRef } from "react";
import Header from "../page/Dashboard";
import { Send, Bot, User as UserIcon } from "lucide-react";

export default function AITools() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey! I am your AI Wingman 🤖. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      // Yahan hum AI Ice-Breaker API use kar rahe hain
      const res = await fetch("http://localhost:5000/api/ai/icebreaker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userBio: userMessage.text,
          partnerBio: "Tell me about your match", // Simplified for chat
          partnerName: "Your Match",
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.messages) {
        // AI suggestions ko ek-ek karke add karein
        const aiReplies = data.messages.map((msg) => ({ sender: "ai", text: msg }));
        setMessages((prev) => [...prev, ...aiReplies]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Oops! Kuch technical issue aa gaya. Please try again." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Server se connect nahi ho paya. Please check your network." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Chat Area */}
      <div className="flex-grow flex justify-center py-6 px-2">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[80vh]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Omni AI Wingman</h2>
              <p className="text-xs text-white/80">Online | Always ready to help</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message... (e.g. I love coding)"
              className="flex-1 p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-3 rounded-full text-white transition ${
                input.trim() ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-300"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}