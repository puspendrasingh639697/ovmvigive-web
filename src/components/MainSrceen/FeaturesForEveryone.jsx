// import React, { useState } from "react";
// import mapImage from '../../assets/images/MenGirls.png';
// import rightImage from '../../assets/images/rightimage.png'; 

// import {
//   IoVideocamOutline,
//   IoCallOutline,
//   IoChatbubbleEllipsesOutline,
//   IoGiftOutline,
// } from "react-icons/io5";

// const FeaturesForEveryone = () => {
//   const [activeFeature, setActiveFeature] = useState("");

//   const featuresList = [
//     { text: "Flirt & Date", icon: "💋" },
//     { text: "Make New Friends", icon: "👯‍♀️" },
//     { text: "Practice Languages", icon: "🗣️" },
//     { text: "Find True Love", icon: "💖" },
//     { text: "Just Vibe & Chat", icon: "💬" },
//     { text: "Video Sparks", icon: "📸" },
//     { text: "Casual Conversations", icon: "💬" },
//     { text: "Live HD Video Moments", icon: "🎥" },
//   ];

//   return (
//     <section id="features" className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#FFFAF5] text-gray-900">
      
//       {/* HEADING SECTION (Top Center) */}
//       <div className="w-full max-w-4xl text-center mb-12 mx-auto">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
//           Features
//         </h2>
//         <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-green-800 leading-tight">
//           Smart • Fast • Real<br />
//           Welcome to the New Way of Connection.
//         </h3>
//       </div>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center w-full">

//         <div className="flex flex-col justify-center">
//           <div className="relative">
//             {/* Timeline Line */}
//             <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-800 to-purple-600"></div>

//             {[
//               {
//                 title: "Connect Instantly, Anywhere in the World",
//                 description: "Hiddo uses smart AI matching to help you meet genuine people in seconds — from any country, in any of 32 languages."
//               },
//               {
//                 title: "Verified Users Only — No Fake Profiles, No Spam",
//                 description: "Every Hiddo profile is verified, ensuring you meet real people only. Our moderation team and AI filters keep your experience safe, respectful, and drama-free."
//               },
//               {
//                 title: "HD Video & Voice Calls That Feel Real",
//                 description: "Enjoy smooth, crystal-clear calls where the chemistry feels natural. Hiddo's high-quality streaming makes every interaction personal and exciting."
//               },
//               {
//                 title: "Your Privacy, Our Priority",
//                 description: "We never sell or share your data. Hiddo is built with top-level encryption and privacy protection, so your moments stay truly yours."
//               }
//             ].map((feature, index) => (
//               // 🔥 HOVER EFFECTS REMOVED 🔥
//               <div key={index} className="relative mb-8 sm:mb-12 pl-8 sm:pl-12">
                
//                 {/* Dot/Bullet */}
//                 <div className="absolute left-[-10px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-green-800 bg-[#FFFAF5] flex items-center justify-center">
//                   <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-800 rounded-full"></div>
//                 </div>

//                 <div>
//                   {/* Title */}
//                   <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">
//                     {feature.title}
//                   </h4>
//                   {/* Description */}
//                   <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
//                     {feature.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 🔥 RIGHT IMAGE SECTION (Hover Removed) 🔥 */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="w-full relative">
//              <img
//                 src={rightImage}
//                 alt="Right Side Feature"
//                 className="w-full h-auto object-cover"
//              />
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default FeaturesForEveryone;

import React from "react";
import rightImage from '../../assets/images/rightimage.png'; 
import { IoCheckmarkCircle } from "react-icons/io5"; // Simple Check Icon

const FeaturesForEveryone = () => {
  
  const features = [
    {
      title: "Connect Instantly, Anywhere",
      description: "Hiddo uses smart AI matching to help you meet genuine people in seconds — from any country, in any of 32 languages."
    },
    {
      title: "Verified Users Only",
      description: "Every profile is verified, ensuring you meet real people only. Our moderation team and AI filters keep your experience safe and drama-free."
    },
    {
      title: "HD Video & Voice Calls",
      description: "Enjoy smooth, crystal-clear calls where the chemistry feels natural. High-quality streaming makes every interaction personal and exciting."
    },
    {
      title: "Your Privacy, Our Priority",
      description: "We never sell or share your data. Built with top-level encryption and privacy protection, so your moments stay truly yours."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 bg-[#FFFAF5] text-gray-900 overflow-hidden">
      
      {/* HEADING SECTION */}
      <div className="w-full max-w-4xl text-center mb-16 mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-green-800 tracking-tight">
          Features
        </h2>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 leading-snug">
          Smart • Fast • Real<br />
          <span className="text-green-800 font-bold">Welcome to the New Way of Connection.</span>
        </h3>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* 👇 LEFT SIDE: Simple & Clean List */}
        <div className="flex flex-col gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              
              {/* Simple Icon */}
              <div className="mt-1 flex-shrink-0">
                <IoCheckmarkCircle className="w-7 h-7 text-green-800" />
              </div>

              {/* Text Content */}
              <div>
                <h4 className="text-lg md:text-xl font-bold text-green-800 mb-1">
                  {feature.title}
                </h4>
                <p className="text-black text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* 👇 RIGHT SIDE: Image */}
        <div className="flex justify-center">
          <img
            src={rightImage}
            alt="Right Side Feature"
            className="w-full max-w-md h-auto object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default FeaturesForEveryone;
