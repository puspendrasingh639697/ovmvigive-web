// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { IoCartOutline } from "react-icons/io5";

// // // ✅ Header aur Footer imports
// // import Header from "../page/Dashboard"; 
// // import Footer from "../components/MainSrceen/Footer";

// // // ✅ Images Import
// // import goldBanner from "../assets/images/goldbnaer.png";
// // import diamondImg from "../assets/images/diamond.png";
// // import premiumImg from "../assets/images/premium.png";
// // import treasureImg from "../assets/images/treasure.png";
// // import group1Img from "../assets/images/group1.png";

// // // Stores Data
// // const FEATURES = [
// //   {
// //     image: group1Img,
// //     title: "Gold Store",
// //     description: "Buy gold packages to unlock premium chat and gifts."
// //   },
// //   {
// //     image: diamondImg,
// //     title: "Diamond Store",
// //     description: "Purchase diamonds for exclusive virtual items."
// //   },
// //   {
// //     image: premiumImg,
// //     title: "Premium",
// //     description: "Get exclusive access and ad-free experience."
// //   },
// //   {
// //     image: treasureImg,
// //     title: "Treasure",
// //     description: "Discover special treasures and rewards."
// //   }
// // ];

// // export default function PremiumPage() {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-screen bg-[#f9f9f9] text-gray-800 flex flex-col justify-between">
      
// //       {/* ✅ 1. Top Header */}
// //       <div className="w-full bg-[#FFFAF5] sticky top-0 z-50 border-b border-gray-200 shadow-sm">
// //         <Header />
// //       </div>

// //       {/* Main Content Area */}
// //       <div className="w-full mx-auto px-1 sm:px-2 lg:px-8 py-1 flex-grow">
        
// //         {/* ✅ 2. TOP BANNER (Sirf Gold Banner) */}
       

// //         {/* ✅ 3. Title Section */}
// //         <div className="text-center mb-10 px-4">
// //           <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
// //             Premium Experience
// //           </h1>
// //           <p className="text-base text-gray-500 max-w-2xl mx-auto">
// //             Unlock elite features and stand out from the crowd.
// //           </p>
// //         </div>

// //         {/* ✅ 4. Stores Grid */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
// //           {FEATURES.map((item, index) => (
// //             <div 
// //               key={index} 
// //               className="bg-green-800 p-4 flex flex-col items-center border border-gray-200  relative cursor-pointer"
// //               onClick={() => {
// //                 if(item.title === 'Gold Store') navigate('/store/gold');
// //                 if(item.title === 'Diamond Store') navigate('/store/diamond');
// //               }}
// //             >
              
// //               {/* Add to Cart Button */}
// //               <button 
// //                 onClick={(e) => { 
// //                   e.stopPropagation();
// //                   alert(`${item.title} added to cart!`); 
// //                 }}
// //                 className="absolute top-2 right-2 bg-green-800 text-white p-1.5 rounded-full hover:bg-green-800 transition-colors z-10 shadow-sm"
// //                 title="Add to Cart"
// //               >
                
// //               </button>

// //               {/* Icon */}
// //               <div className="w-24 h-24 mb-3 bg-green-800 flex items-center justify-center rounded-full p-2">
// //                 <img 
// //                   src={item.image} 
// //                   alt={item.title} 
// //                   className="w-full h-full object-contain" 
// //                 />
// //               </div>

// //               <h3 className="text-sm md:text-base font-bold text-black mb-1 text-center">{item.title}</h3>
// //               <p className="text-[10px] md:text-xs text-black text-center leading-tight">{item.description}</p>
// //             </div>
// //           ))}
// //         </div>

// //         {/* ✅ 5. Unlock Button */}
// //         <div className="text-center mb-10">
// //           <button 
// //             onClick={() => alert("Redirecting to payment...")}
// //             className="bg-green-800 text-white font-bold text-base md:text-lg py-3 px-8 rounded-md shadow-sm transition-colors hover:bg-green-800"
// //           >
// //             Unlock Premium Now
// //           </button>
// //         </div>

// //          <div className="w-full mb-10 overflow-hidden rounded-xl">
// //           <img 
// //             src={goldBanner} 
// //             alt="Premium Banner" 
// //             className="w-full h-auto object-cover object-center" 
// //           />
// //         </div>

// //       </div>

// //       {/* ✅ 6. Footer */}
// //       <div className="w-full mt-auto">
// //         <Footer />
// //       </div>

// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../page/Dashboard";
// import Footer from "../components/MainSrceen/Footer";

// export default function PremiumPage() {
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Backend se plans fetch karein
//   useEffect(() => {
//     fetch("http://localhost:5000/api/plan/all")
//       .then((res) => res.json())
//       .then((data) => {
//         setPlans(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Plan fetch error:", err);
//         setLoading(false);
//       });
//   }, []);

//   // ✅ Store type ke hisaab se filter karein
//   const storeTypes = ["Gold", "Diamond", "Premium", "Treasure"];

//   const handlePlanClick = (plan) => {
//     // Payment gateway (Razorpay) integrate karne ke liye
//     // Abhi ke liye alert
//     alert(`Aapne ${plan.name} (₹${plan.price}) select kiya hai. Payment gateway jald aa raha hai!`);
//     // navigate(`/checkout/${plan._id}`);
//   };

//   return (
//     <div className="min-h-screen bg-[#f9f9f9] text-gray-800 flex flex-col justify-between">
      
//       {/* Header */}
//       <div className="w-full bg-[#FFFAF5] sticky top-0 z-50 border-b border-gray-200 shadow-sm">
//         <Header />
//       </div>

//       {/* Main Content */}
//       <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        
//         {/* Title */}
//         <div className="text-center mb-10">
//           <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
//             Premium Experience
//           </h1>
//           <p className="text-base text-gray-500 max-w-2xl mx-auto">
//             Unlock elite features and stand out from the crowd.
//           </p>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <>
//             {/* Store Types Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
//               {storeTypes.map((type) => (
//                 <div 
//                   key={type}
//                   className="bg-green-800 p-6 flex flex-col items-center rounded-xl cursor-pointer hover:bg-green-700 transition shadow-lg"
//                   onClick={() => {
//                     // Type ke hisaab se plans filter karein
//                     const filtered = plans.filter(p => p.type === type);
//                     if (filtered.length > 0) {
//                       document.getElementById(`section-${type}`)?.scrollIntoView({ behavior: 'smooth' });
//                     }
//                   }}
//                 >
//                   <h3 className="text-white font-bold text-lg">{type} Store</h3>
//                   <p className="text-green-200 text-xs text-center mt-1">
//                     {plans.filter(p => p.type === type).length} items available
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* Har Type ke Plans */}
//             {storeTypes.map((type) => {
//               const typePlans = plans.filter(p => p.type === type);
//               if (typePlans.length === 0) return null;

//               return (
//                 <div key={type} id={`section-${type}`} className="mb-12">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-4">{type} Plans</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {typePlans.map((plan) => (
//                       <div 
//                         key={plan._id}
//                         className={`relative bg-white p-6 rounded-2xl shadow-lg border-2 transition hover:scale-105 cursor-pointer ${
//                           plan.popular ? "border-green-600" : "border-gray-200"
//                         }`}
//                         onClick={() => handlePlanClick(plan)}
//                       >
//                         {plan.popular && (
//                           <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
//                             🔥 Popular
//                           </span>
//                         )}

//                         <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
//                         <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-2xl font-black text-green-700">₹{plan.price}</p>
//                             {plan.coins > 0 && (
//                               <p className="text-xs text-gray-500 mt-1">🪙 {plan.coins} coins</p>
//                             )}
//                           </div>
//                           <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm">
//                             Buy Now
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}

//       </div>

//       {/* Footer */}
//       <div className="w-full mt-auto">
//         <Footer />
//       </div>

//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../page/Dashboard";
import Footer from "../components/MainSrceen/Footer";

// ✅ Images Import (5 images)
import group1Img from "../assets/images/group1.png";
import diamondImg from "../assets/images/diamond.png";
import premiumImg from "../assets/images/premium.png";
import treasureImg from "../assets/images/treasure.png";
import goldBanner from "../assets/images/goldbnaer.png"; // ✅ Gold Banner

export default function PremiumPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Backend se plans fetch karein
  useEffect(() => {
    fetch("http://localhost:5000/api/plan/all")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Plan fetch error:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Store types aur unki images
  const STORE_TYPES = [
    { type: "Gold", image: group1Img, description: "Buy gold packages for gifts" },
    { type: "Diamond", image: diamondImg, description: "Purchase diamonds for items" },
    { type: "Premium", image: premiumImg, description: "Get ad-free experience" },
    { type: "Treasure", image: treasureImg, description: "Discover special rewards" },
  ];

  // ✅ Har plan type ke liye image
  const getPlanImage = (type) => {
    switch (type) {
      case "Gold": return group1Img;
      case "Diamond": return diamondImg;
      case "Premium": return premiumImg;
      case "Treasure": return treasureImg;
      default: return group1Img;
    }
  };

  const handlePlanClick = (plan) => {
    alert(`Aapne ${plan.name} (₹${plan.price}) select kiya hai. Payment gateway jald aa raha hai!`);
    // navigate(`/checkout/${plan._id}`);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-800 flex flex-col justify-between">
      
      {/* Header */}
      <div className="w-full bg-[#FFFAF5] sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Premium Experience
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Unlock elite features and stand out from the crowd.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* ✅ Store Types Grid with IMAGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {STORE_TYPES.map((store) => (
                <div 
                  key={store.type}
                  className="bg-green-800 p-4 rounded-xl cursor-pointer hover:bg-green-700 transition shadow-lg flex flex-col items-center"
                  onClick={() => {
                    document.getElementById(`section-${store.type}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="w-20 h-20 mb-3 bg-green-700 flex items-center justify-center rounded-full p-2">
                    <img src={store.image} alt={store.type} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{store.type} Store</h3>
                  <p className="text-green-200 text-xs text-center mt-1">
                    {plans.filter(p => p.type === store.type).length} items
                  </p>
                </div>
              ))}
            </div>

            {/* Har Type ke Plans */}
            {STORE_TYPES.map((store) => {
              const typePlans = plans.filter(p => p.type === store.type);
              if (typePlans.length === 0) return null;

              return (
                <div key={store.type} id={`section-${store.type}`} className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{store.type} Plans</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typePlans.map((plan) => (
                      <div 
                        key={plan._id}
                        className={`relative bg-white p-6 rounded-2xl shadow-lg border-2 transition hover:scale-105 cursor-pointer ${
                          plan.popular ? "border-green-600" : "border-gray-200"
                        }`}
                        onClick={() => handlePlanClick(plan)}
                      >
                        {plan.popular && (
                          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            🔥 Popular
                          </span>
                        )}

                        {/* ✅ Plan Image */}
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center p-2">
                            <img 
                              src={getPlanImage(plan.type)} 
                              alt={plan.name} 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{plan.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 text-center">{plan.description}</p>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-black text-green-700">₹{plan.price}</p>
                            {plan.coins > 0 && (
                              <p className="text-xs text-gray-500 mt-1">🪙 {plan.coins} coins</p>
                            )}
                          </div>
                          <button className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ✅ 5. Gold Banner (Page ke neeche) */}
        <div className="w-full mb-10 overflow-hidden rounded-xl shadow-lg">
          <img 
            src={goldBanner} 
            alt="Premium Banner" 
            className="w-full h-auto object-cover object-center" 
          />
        </div>

      </div>

      {/* Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>

    </div>
  );
}