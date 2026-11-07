import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Lock } from "lucide-react";

export default function SendAnonymous() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      setError("Message likhein!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/anonymous/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverUsername: userId,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Message nahi bheja gaya");
      }
    } catch (err) {
      setError("Server se connect nahi ho paya");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Bhej Diya!</h2>
          <p className="text-gray-500 mb-6">Aapka anonymous message successfully bhej diya gaya.</p>
          <button
            onClick={() => { setSuccess(false); setMessage(""); }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700"
          >
            Aur Bhejein
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Lock size={48} className="mx-auto text-purple-600 mb-3" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Anonymous Message</h2>
          <p className="text-gray-500 text-sm">
            Aapka naam kisi ko nahi dikhega. Bas apna message likhein!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Apna message likhein... (max 500 characters)"
          rows={5}
          maxLength={500}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none mb-4"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Sending..." : <><Send size={20} /> Send Anonymously</>}
        </button>
      </div>
    </div>
  );
}