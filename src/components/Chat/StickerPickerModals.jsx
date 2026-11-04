import React from "react";
import { MdDiamond, MdLocalOffer } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { IoIosClose, IoIosGift } from "react-icons/io";

export default function StickerPickerModal({
  closeStickerModal,
  timeLeft,
  activeTab,
  setActiveTab,
  userDiamond,
  userGold,
  stickersLoading,
  giftImages,
  selectedSticker,
  setSelectedSticker,
  quantity,
  setQuantity,
  handleSendSticker,
  isChatDisabled,
  activeChat,
  getChatName,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end">
      <div className="bg-[#FFFAF5] rounded-t-2xl w-full max-w-md h-3/4 flex flex-col shadow-2xl">
        <div className="bg-gradient-to-r from-purple-500 to-green-800 text-white p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MdLocalOffer size={18} />
            <span className="text-sm">Get newbie bonus, recharge for free lottery</span>
          </div>
          <div className="bg-black/30 px-2 py-1 rounded">
            <span className="text-xs font-mono">
              {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Send a Special Gift
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-blue-600">
                <MdDiamond size={16} />
                <span className="text-sm font-medium">{userDiamond}</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-600">
                <FaCoins size={16} />
                <span className="text-sm font-medium">{userGold}</span>
              </div>
            </div>
            <button
              onClick={closeStickerModal}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <IoIosClose size={24} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 p-3 flex justify-center items-center space-x-2 transition-colors ${
              activeTab === "gold"
                ? "text-yellow-600 border-b-2 border-yellow-500 font-semibold bg-yellow-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("gold")}
          >
            <FaCoins className="text-yellow-500" />
            <span>Gold Gifts</span>
          </button>
          <button
            className={`flex-1 p-3 flex justify-center items-center space-x-2 transition-colors ${
              activeTab === "diamond"
                ? "text-blue-600 border-b-2 border-blue-500 font-semibold bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("diamond")}
          >
            <MdDiamond className="text-blue-500" />
            <span>Premium Gifts</span>
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-3 gap-4">
          {stickersLoading ? (
            <div className="col-span-3 text-center py-10 text-gray-500">
              <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Loading amazing gifts...</p>
            </div>
          ) : (
            (giftImages || [])
              .filter((g) =>
                activeTab === "diamond" ? g.isTypeDiamond : !g.isTypeDiamond
              )
              .map((sticker, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedSticker?.imageUrl === sticker.imageUrl
                      ? "border-green-800 bg-pink-50 shadow-lg scale-105"
                      : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedSticker(sticker)}
                >
                  <img
                    src={sticker.imageUrl}
                    alt="Sticker"
                    className="w-20 h-20 object-contain mb-2"
                    loading="lazy"
                  />
                  <div className="flex items-center space-x-1 bg-black/80 text-white px-2 py-1 rounded-full">
                    <span className="text-xs">
                      {sticker.isTypeDiamond ? (
                        <MdDiamond className="inline" />
                      ) : (
                        <FaCoins className="inline" />
                      )}
                    </span>
                    <span className="text-xs font-bold">{sticker.coins}</span>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {getChatName(activeChat)?.charAt(0) || "U"}
              </div>
              <span className="text-gray-700 font-medium">
                To: {getChatName(activeChat) || "User"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSendSticker}
            disabled={!selectedSticker || isChatDisabled}
            className={`w-full py-3 rounded-full text-white font-bold transition-all flex items-center justify-center space-x-2 ${
              !selectedSticker || isChatDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-800 to-red-500 hover:from-green-800 hover:to-red-600 shadow-lg"
            }`}
          >
            <IoIosGift size={20} />
            <span>Send Gift</span>
            {selectedSticker && (
              <span className="text-sm">
                ({selectedSticker.coins * quantity}{" "}
                {selectedSticker.isTypeDiamond ? "💎" : "🥇"})
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}