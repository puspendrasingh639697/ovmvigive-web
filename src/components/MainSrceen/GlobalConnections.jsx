import React from 'react';
import { IoVideocam } from "react-icons/io5";

import chatBotImg from "../../assets/images/chat-bot.png";
import blessingsImg from "../../assets/images/blessings.png";
import chatImg from "../../assets/images/chat.png";
import giftBoxImg from "../../assets/images/gift-box.png";
import hdImg from "../../assets/images/hd.png";
import promotionImg from "../../assets/images/promotion.png";

function GlobalConnections() {
  const features = [
    { icon: chatImg, title: "Instant Video Chat", description: "Turn on your camera and connect face-to-face instantly" },
    { icon: chatBotImg, title: "Smart Matching", description: "AI-powered matching for better connections" },
    { icon: promotionImg, title: "Global Community", description: "Meet people from around the world" },
    { icon: blessingsImg, title: "Real Connections", description: "Genuine conversations that matter" },
    { icon: hdImg, title: "HD Video Quality", description: "Crystal clear video and audio for smooth chats" },
    { icon: giftBoxImg, title: "Fun Rewards", description: "Earn exciting rewards as you connect with people" }
  ];

  const userAvatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#FFFAF5] overflow-hidden">
      
      <div className="max-w-[1500px] mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-black">
            Global <span className="text-green-800">Connections</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
            Where <span className="text-green-800 font-semibold">real vibes</span> meet{' '}
            <span className="text-green-800 font-semibold">real people</span>.
            Turn on your camera and instantly connect face-to-face with someone new, fun, and exciting.
          </p>
          
        </div>

        {/* 🔥 Features Section: 6 Cards in Single Row 🔥 */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              // 🔥 FIX: Hover par sirf background pink hoga, baki koi effect nahi
              className="bg-green-800 rounded-md p-6 border border-gray-100 shadow-sm hover:bg-green-800 transition-colors duration-300 flex flex-col items-center text-center cursor-pointer"
            >
             <div className="mb-4 w-16 h-16 flex items-center justify-center">
  <img 
    src={feature.icon} 
    alt={feature.title} 
    className="w-8 h-8 object-contain" 
    style={{ filter: "brightness(0) invert(1)" }} 
  />
</div>
              
              <h3 className="text-base font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-white leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}

export default GlobalConnections;