// import React from "react";
// import mapImage from "../../assets/images/mapinig.png"; // ✅ path to mapinig.png

// function JoinCommunity() {
//   return (
//     <>
//       {/* Join Community Section */}
//       <section
//         id="join-community"
//         className="py-20 px-6 bg-[#FFFAF5] text-gray-900"
//       >
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col md:flex-row items-center gap-10">
//             {/* LEFT — 40% */}
//             <div className="w-full md:w-[40%] text-center md:text-left">
//               {/* Title */}
//               <h2 className="text-1xl md:text-2xl font-bold mb-6 leading-snug text-green-800">
//                 Join the  Hiddo Global Family 
//               </h2>

//               {/* Description */}
//               <p className="text-black text-lg md:text-xl mb-10 leading-relaxed">
//                 Step into a world where voices connect and faces feel closer
//                 than ever. With thousands of users already vibing on Hiddo,
//                 you can experience real, secure, and spontaneous video chats
//                 with amazing people across the globe. Making new friends has
//                 never felt this natural.
//               </p>

//               {/* CTA Button */}
//               <button className="bg-green-800 text-white font-semibold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:bg-green-800 hover:scale-105 shadow-lg">
//                 JOIN US FOR FREE
//               </button>
//             </div>

//             {/* RIGHT — 60% */}
//             <div className="w-full md:w-[90%]">
//               <img
//                 src={mapImage}
//                 alt="Hiddo Global Community Map"
//                 className="w-full h-auto  object-contain"
//                 onError={(e) => {
//                   console.error("⚠️ Image failed to load:", e.target.src);
//                   e.target.style.display = "none";
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 px-4 w-full bg-[#FFFAF5]">
//         <div className="max-w-5xl mx-auto">
//           <div className="grid grid-cols-3 gap-8 text-center">
//             <div className="space-y-4">
//               <div className="text-4xl font-bold text-green-800">100+</div>
//               <div className="text-gray-600 text-lg">
//                 Real Conversations Every Month 💞
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="text-4xl font-bold text-green-800">150+</div>
//               <div className="text-gray-600 text-lg">
//                 Countries Flirting Live 😉
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="text-4xl font-bold text-green-800">9M+</div>
//               <div className="text-gray-600 text-lg">
//                 Smiles Shared Worldwide 🌎
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default JoinCommunity;



import React from "react";
import mapImage from "../../assets/images/mapinig.png"; 

// 👇 Yahan apne 5 icons import karein
import talkImg from "../../assets/images/talk.png";
import countryImg from "../../assets/images/country.png";
import group1Img from "../../assets/images/group1.png";
import certifiedImg from "../../assets/images/certified.png";
import trendImg from "../../assets/images/trend.png";

function JoinCommunity() {
  return (
    <>
      {/* ================= TOP SECTION (BILKUL WAISA HI HAI, KUSH NAHI CHHEDA) ================= */}
      <section
        id="join-community"
        className="py-20 px-6 bg-[#FFFAF5] text-gray-900"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* LEFT — 40% */}
            <div className="w-full md:w-[40%] text-center md:text-left">
              <h2 className="text-1xl md:text-2xl font-bold mb-6 leading-snug text-green-800">
                Join the Hiddo Global Family 
              </h2>

              <p className="text-black text-lg md:text-xl mb-10 leading-relaxed">
                Step into a world where voices connect and faces feel closer
                than ever. With thousands of users already vibing on Hiddo,
                you can experience real, secure, and spontaneous video chats
                with amazing people across the globe. Making new friends has
                never felt this natural.
              </p>

              <button className="bg-green-800 text-white font-semibold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:bg-green-800 hover:scale-105 shadow-lg">
                JOIN US FOR FREE
              </button>
            </div>

            {/* RIGHT — 60% */}
            <div className="w-full md:w-[90%]">
              <img
                src={mapImage}
                alt="Hiddo Global Community Map"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  console.error("⚠️ Image failed to load:", e.target.src);
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM SECTION (ICONS + STATS) ================= */}
      <section className="py-16 px-4 w-full bg-[#FFFAF5] ">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          
          {/* 👇 5 Icons Ek Line Me (Full Width) */}
          <div className="flex flex-wrap md:flex-nowrap justify-between items-start w-full gap-6 md:gap-4 mb-16">
            
            <div className="flex flex-col items-center gap-3 w-[30%] md:w-auto">
              <img src={talkImg} alt="Real Conversations" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
              <span className="text-sm md:text-base font-semibold text-green-800 text-center">Real Conversations 120+</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-[30%] md:w-auto">
              <img src={countryImg} alt="Countries" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
              <span className="text-sm md:text-base font-semibold text-green-800 text-center">Countries 198</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-[30%] md:w-auto">
              <img src={group1Img} alt="Groups" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
              <span className="text-sm md:text-base font-semibold text-green-800 text-center">Groups 70+</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-[30%] md:w-auto">
              <img src={certifiedImg} alt="Certified" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
              <span className="text-sm md:text-base font-semibold text-green-800 text-center">Certified</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-[30%] md:w-auto">
              <img src={trendImg} alt="Trending" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
              <span className="text-sm md:text-base font-semibold text-green-800text-center">Trending</span>
            </div>

          </div>

         

        </div>
      </section>
    </>
  );
}

export default JoinCommunity;