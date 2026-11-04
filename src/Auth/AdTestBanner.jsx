// AdTestBanner.jsx
import React from "react";

export default function AdTestBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 my-3 cursor-pointer hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-lg">🎁 Premium Membership</p>
          <p className="text-white/80 text-sm">Get unlimited gifts & matches!</p>
        </div>
        <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold text-sm">
          Upgrade
        </button>
      </div>
    </div>
  );
}