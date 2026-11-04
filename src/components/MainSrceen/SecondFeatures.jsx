// SecondFeatures.jsx

import React, { useState } from "react";
// Icons ki jagah aapki images import ki hain
import chatBotImg from "../../assets/images/chat-bot.png";
import blessingsImg from "../../assets/images/blessings.png";
import certifiedImg from "../../assets/images/certified.png";
import chatImg from "../../assets/images/chat.png";
import giftBoxImg from "../../assets/images/gift-box.png";
import hdImg from "../../assets/images/hd.png";
import promotionImg from "../../assets/images/promotion.png";
import trackingImg from "../../assets/images/tracking.png";

const SecondFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    { id: 1, title: "Chat Bot", image: chatBotImg },
    { id: 2, title: "Blessings", image: blessingsImg },
    { id: 3, title: "Certified", image: certifiedImg },
    { id: 4, title: "Chat", image: chatImg },
    { id: 5, title: "Gift Box", image: giftBoxImg },
    { id: 6, title: "HD Calls", image: hdImg },
    { id: 7, title: "Promotion", image: promotionImg },
    { id: 8, title: "Tracking", image: trackingImg },
  ];

  return (
    <div className="py-12 px-4 bg-[#FFFAF5] w-full overflow-hidden">
      
      {/* Ek hi row me sab dikhane ke liye flex use kiya hai */}
      <div className="flex items-center justify-start md:justify-center gap-6 sm:gap-10 md:gap-14 overflow-x-auto pb-6 scrollbar-hide w-full">
        
        {features.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveFeature(item.id)}
            className="group flex flex-col items-center cursor-pointer min-w-[80px] sm:min-w-[100px] transition-all duration-300"
          >
            {/* Image Wrapper */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 transition-all duration-300
                ${
                  activeFeature === item.id
                    ? "bg-green-100 shadow-md scale-110 border-2 border-green-800"
                    : "bg-transparent hover:bg-green-50"
                }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                style={{
                  // 👇 GREEN-800 FILTER (Yahan change kiya hai)
                  filter: "invert(19%) sepia(24%) saturate(1784%) hue-rotate(112deg) brightness(94%) contrast(97%)",
                }}
              />
            </div>

            {/* Title */}
            <h1
              className={`text-xs sm:text-sm font-semibold text-center transition-colors duration-300
                ${activeFeature === item.id ? "text-green-800" : "text-gray-700 group-hover:text-green-800"}`}
            >
              {item.title}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondFeatures;