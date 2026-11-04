import React from "react";
import { useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";

// ✅ Header aur Footer imports
import Header from "../page/Dashboard"; 
import Footer from "../components/MainSrceen/Footer";

// ✅ Images Import
import goldBanner from "../assets/images/goldbnaer.png";
import diamondImg from "../assets/images/diamond.png";
import premiumImg from "../assets/images/premium.png";
import treasureImg from "../assets/images/treasure.png";
import group1Img from "../assets/images/group1.png";

// Stores Data
const FEATURES = [
  {
    image: group1Img,
    title: "Gold Store",
    description: "Buy gold packages to unlock premium chat and gifts."
  },
  {
    image: diamondImg,
    title: "Diamond Store",
    description: "Purchase diamonds for exclusive virtual items."
  },
  {
    image: premiumImg,
    title: "Premium",
    description: "Get exclusive access and ad-free experience."
  },
  {
    image: treasureImg,
    title: "Treasure",
    description: "Discover special treasures and rewards."
  }
];

export default function PremiumPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-800 flex flex-col justify-between">
      
      {/* ✅ 1. Top Header */}
      <div className="w-full bg-[#FFFAF5] sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="w-full mx-auto px-1 sm:px-2 lg:px-8 py-1 flex-grow">
        
        {/* ✅ 2. TOP BANNER (Sirf Gold Banner) */}
       

        {/* ✅ 3. Title Section */}
        <div className="text-center mb-10 px-4">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Premium Experience
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Unlock elite features and stand out from the crowd.
          </p>
        </div>

        {/* ✅ 4. Stores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {FEATURES.map((item, index) => (
            <div 
              key={index} 
              className="bg-green-800 p-4 flex flex-col items-center border border-gray-200  relative cursor-pointer"
              onClick={() => {
                if(item.title === 'Gold Store') navigate('/store/gold');
                if(item.title === 'Diamond Store') navigate('/store/diamond');
              }}
            >
              
              {/* Add to Cart Button */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  alert(`${item.title} added to cart!`); 
                }}
                className="absolute top-2 right-2 bg-green-800 text-white p-1.5 rounded-full hover:bg-green-800 transition-colors z-10 shadow-sm"
                title="Add to Cart"
              >
                
              </button>

              {/* Icon */}
              <div className="w-24 h-24 mb-3 bg-green-800 flex items-center justify-center rounded-full p-2">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain" 
                />
              </div>

              <h3 className="text-sm md:text-base font-bold text-black mb-1 text-center">{item.title}</h3>
              <p className="text-[10px] md:text-xs text-black text-center leading-tight">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ✅ 5. Unlock Button */}
        <div className="text-center mb-10">
          <button 
            onClick={() => alert("Redirecting to payment...")}
            className="bg-green-800 text-white font-bold text-base md:text-lg py-3 px-8 rounded-md shadow-sm transition-colors hover:bg-green-800"
          >
            Unlock Premium Now
          </button>
        </div>

         <div className="w-full mb-10 overflow-hidden rounded-xl">
          <img 
            src={goldBanner} 
            alt="Premium Banner" 
            className="w-full h-auto object-cover object-center" 
          />
        </div>

      </div>

      {/* ✅ 6. Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>

    </div>
  );
}