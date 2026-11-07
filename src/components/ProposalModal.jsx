import React, { useState } from "react";
import { Heart, X, Gem } from "lucide-react";

export default function ProposalModal({ onClose, onSend, receiverName }) {
  const [ringType, setRingType] = useState("Gold Ring");
  const [loading, setLoading] = useState(false);

  const rings = [
    { name: "Gold Ring", price: 500, icon: "🥇" },
    { name: "Diamond Ring", price: 2000, icon: "💎" },
    { name: "Platinum Ring", price: 5000, icon: "💍" },
  ];

  const handleSend = async () => {
    setLoading(true);
    await onSend(ringType);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Propose to {receiverName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-500 mb-4">Choose a ring to propose</p>

        <div className="space-y-3 mb-6">
          {rings.map((ring) => (
            <div
              key={ring.name}
              onClick={() => setRingType(ring.name)}
              className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition ${
                ringType === ring.name
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ring.icon}</span>
                <div>
                  <p className="font-bold text-gray-800">{ring.name}</p>
                  <p className="text-sm text-yellow-600">🪙 {ring.price} coins</p>
                </div>
              </div>
              {ringType === ring.name && <Heart className="text-pink-600" fill="currentColor" />}
            </div>
          ))}
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "Sending..." : <><Heart size={20} /> Send Proposal</>}
        </button>
      </div>
    </div>
  );
}c