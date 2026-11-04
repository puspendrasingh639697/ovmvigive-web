// import React from "react";
// import {
//   IoHeartOutline,
//   IoPeopleOutline,
//   IoGlobeOutline,
//   IoChatbubbleEllipsesOutline,
//   IoSparklesOutline,
//   IoCallOutline,
//   IoVideocamOutline,
// } from "react-icons/io5";

// function FeaturesGrid() {
//   const featuresList = [
//     { text: "Flirt & Date", icon: <IoHeartOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Make New Friends", icon: <IoPeopleOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Practice Languages", icon: <IoGlobeOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Find True Love", icon: <IoHeartOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Just Vibe & Chat", icon: <IoChatbubbleEllipsesOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Video Sparks", icon: <IoSparklesOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Casual Conversations", icon: <IoCallOutline className="text-green-800 w-6 h-6" /> },
//     { text: "Live HD Video Moments", icon: <IoVideocamOutline className="text-green-800 w-6 h-6" /> },
//   ];

//   return (
//     <section className="py-16 px-4 bg-[#FFFAF5]">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Heading */}
//         <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-black">
//           What’s Your Mood Today? 💞
//         </h2>
//         <p className="text-gray-500 text-center mb-12 text-sm md:text-base">
//           Pick a vibe and start connecting with amazing people.
//         </p>

//         {/* Grid */}
//         <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {featuresList.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-[#FFFAF5] rounded-xl p-4 border border-gray-200 shadow-sm hover:border-pink-400 hover:bg-pink-50 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-4"
//             >
//               {/* Icon Box */}
//               <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center shrink-0">
//                 {feature.icon}
//               </div>
              
//               {/* Text */}
//               <span className="text-sm md:text-base font-semibold text-gray-800">
//                 {feature.text}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default FeaturesGrid;


import React from "react";

// 👇 Aapki saari 10 images import ki hain
import chatImg from "../../assets/images/chat.png";
import checkImg from "../../assets/images/check.png";
import flirtyImg from "../../assets/images/flirty.png";
import drinkingImg from "../../assets/images/drinking.png";
import famousImg from "../../assets/images/famous.png";
import happyImg from "../../assets/images/happy.png";
import peopleImg from "../../assets/images/people.png";
import jobsImg from "../../assets/images/professions-and-jobs.png";
import proposeImg from "../../assets/images/propose.png";
import talkImg from "../../assets/images/talk.png";

function FeaturesGrid() {
  const featuresList = [
    { text: "Flirt & Date", img: flirtyImg },
    { text: "Make Friends", img: peopleImg },
    { text: "Vibe & Chat", img: chatImg },
    { text: "True Love", img: proposeImg },
    { text: "Happy Vibes", img: happyImg },
    { text: "Deep Talks", img: talkImg },
    { text: "Party & Drinks", img: drinkingImg },
    { text: "Famous Faces", img: famousImg },
    { text: "Career & Jobs", img: jobsImg },
    { text: "Verified", img: checkImg },
  ];

  return (
    <section className="py-16 bg-[#FFFAF5] overflow-hidden">
      <div className="max-w-8xl mx-auto px-4">
        
        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-green-800">
          What’s Your Mood Today? 💞
        </h2>
        <p className="text-black text-center mb-10 text-sm md:text-base">
          Pick a vibe and start connecting with amazing people.
        </p>

        {/* 👇 Sabhi 10 Icons Ek Row Me (Chhota Size + Pink BG) */}
        <div className="flex items-center justify-start md:justify-center gap-5 md:gap-8 overflow-x-auto pb-6 scrollbar-hide">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer group min-w-[100px]"
            >
              {/* Circle Image Box (Size aur kam, bg pink) */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-800 flex items-center justify-center shadow-sm group-hover:bg-pink-200 group-hover:shadow-md transition-all duration-300 p-3">
                <img 
                  src={feature.img} 
                  alt={feature.text} 
                  className="w-full h-full object-contain" 
                />
              </div>
              
              {/* Text Niche */}
              <span className="text-xs md:text-sm font-semibold text-green-800 group-hover:text-green-800 transition-colors text-center whitespace-nowrap">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesGrid;