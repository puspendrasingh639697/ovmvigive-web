import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Header from "../page/Dashboard";
// import Footer from "../components/MainSrceen/Footer";
import { Lock, MessageCircle, Trash2, Send, Copy, Check } from "lucide-react";
import Header from "../../page/Dashboard";
import Footer from "../MainSrceen/Footer";

export default function AnonymousMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/anonymous/my-messages", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/anonymous/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== messageId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/send-anonymous/${user?.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-purple-50 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-10 max-w-3xl">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
            Anonymous Messages <Lock className="text-purple-600" size={32} />
          </h1>
          <p className="text-gray-500">
            {unreadCount > 0 ? `Aapke paas ${unreadCount} naye messages hain` : "Koi bhi aapko anonymous message bhej sakta hai"}
          </p>
        </div>

        {/* Share Link Box */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-8">
          <h3 className="font-bold text-lg mb-2">Apna Anonymous Link Share Karein</h3>
          <p className="text-white/80 text-sm mb-4">
            Apne doston ko yeh link bhejein, woh aapko anonymous message bhej sakte hain!
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/send-anonymous/${user?.id || ""}`}
              className="flex-1 p-3 rounded-lg text-gray-800 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="bg-white text-purple-600 px-4 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100"
            >
              {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy</>}
            </button>
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="font-bold">Abhi tak koi message nahi aaya</p>
            <p className="text-sm">Apna link share karein!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex justify-between items-start gap-3 hover:shadow-lg transition"
              >
                <div className="flex-grow">
                  <p className="text-gray-800">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}