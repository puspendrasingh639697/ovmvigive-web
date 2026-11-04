// SeoDiscoverReal.jsx

import React from 'react'
import bgImg from "../../assets/images/bgimahe.png";
import bgImg1 from "../../assets/images/bgimahe1.png";
import bgImg2 from "../../assets/images/bgimahe2.png";
import bgImg3 from "../../assets/images/bgimahe3.png"; 

function SeoDiscoverReal() {
  const images = [bgImg, bgImg1, bgImg2, bgImg3];

  return (
    // 👇 Section ka background cream color
    <section id="seo-content" className="bg-[#FFFAF5] py-12">
      
      {/* Heading */}
      <div className="w-full text-center mb-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-green-800">
          Join 10M+ Happy Users 🌎
        </h1>
      </div>

      {/* Grid */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div 
              key={index} 
              className="w-full flex justify-center items-center bg-[#FFFAF5]"
            >
              <img 
                src={img} 
                alt={`Background ${index + 1}`} 
                // 👇 YAHAN MIX-BLEND LAGAYA HAI (White ko gayab karne ke liye)
                className="w-full h-auto max-h-[400px] object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default SeoDiscoverReal