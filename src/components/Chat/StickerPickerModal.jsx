import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MdDiamond } from "react-icons/md";
import { FaCoins } from "react-icons/fa";

export default function StickerPickerModal({ onClose, onSend, userGold, userDiamond }) {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // ✅ Backend se saare gifts fetch karein
  useEffect(() => {
    fetch("http://localhost:5000/api/gift/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Gifts:", data.length); // Debug
        setGifts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gift fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Categories
  const categories = ["All", "Basic", "Premium", "Luxury",];

  // Filter gifts by category
  const filteredGifts = activeCategory === "All"
    ? gifts
    : gifts.filter((g) => g.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end">
      <div className="bg-[#FFFAF5] rounded-t-2xl w-full max-w-md h-[85%] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Send a Gift 🎁</h3>
          <button onClick={onClose} className="text-gray-500">
            <IoIosClose size={24} />
          </button>
        </div>

        {/* Balances */}
        <div className="flex justify-center gap-6 py-2 border-b bg-gray-50">
          <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
            <FaCoins /> {userGold}
          </div>
          <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
            <MdDiamond /> {userDiamond}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 p-3 border-b bg-white">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat
                  ? "bg-green-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gifts Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-10 border-4   animate-spin"></div>
            </div>
          ) : filteredGifts.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No gifts in this category
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredGifts.map((gift) => (
                <div
                  key={gift._id}
                  onClick={() => setSelectedGift(gift)}
                  className={`p-1  cursor-pointer bg-green-500 flex flex-col items-center transition ${
                    selectedGift?._id === gift._id
                      ? "border-green-800 bg-green-500 shadow-md"
                      : "border-gray-200 bg-green-800 hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={gift.imageUrl}
                    alt={gift.name}
                    className="w-16 h-16 object-contain"
                  />
                  <div className="text-center text-[10px] mt-1 text-white font-semibold truncate w-full">
                    {gift.name}
                  </div>
                  <div className="text-center text-xs mt-1 text-yellow-600 font-bold flex items-center gap-1">
                    <FaCoins size={10} /> {gift.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => selectedGift && onSend(selectedGift)}
            disabled={!selectedGift || loading}
            className={`w-full py-3 rounded-full font-bold text-white transition ${
              selectedGift
                ? "bg-green-800 hover:bg-green-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedGift ? `Send ${selectedGift.name} (🪙 ${selectedGift.price})` : "Select a Gift"}
          </button>
        </div>
      </div>
    </div>
  );
}