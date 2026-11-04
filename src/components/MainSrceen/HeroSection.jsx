


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../../assets/images/baner.jpg";
import logoImg from "../../assets/images/logo.png"; 

const HeroSection = ({ children }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll Track karne ke liye
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full text-white">

      {/* ================= FIXED HEADER ================= */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 transition-all duration-300 ${
          isScrolled 
            ? "bg-green-800 shadow-lg py-2" // Scroll hone par Pink aur patla
            : "bg-transparent py-4"       // Normal state
        }`}
      >
        {/* Logo */}
        <div className="cursor-pointer flex items-center" onClick={() => navigate("/")}>
          <img 
            src={logoImg} 
            alt="Omniglve Logo" 
            className={`w-auto object-contain transition-all duration-300 ${
              isScrolled ? "h-10 sm:h-12 md:h-14" : "h-16 sm:h-20 md:h-24"
            }`} 
            style={{
              // Scroll par logo white ho jayega
              filter: isScrolled 
                ? "brightness(0) invert(1)" 
                : "drop-shadow(0px 4px 6px rgba(0,0,0,0.5))" 
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <button 
            onClick={() => navigate("/contact")} 
            className={`text-sm md:text-base font-semibold transition-colors hidden sm:block ${
              isScrolled ? "text-white hover:text-gray-200" : "text-white hover:text-pink-400"
            }`}
          >
            Contact Us
          </button>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => navigate("/login")}
              className={`border rounded-md transition duration-300 whitespace-nowrap font-medium
                ${isScrolled ? "px-3 py-1 text-xs md:text-sm" : "px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base"}
                ${isScrolled 
                  ? "border-white text-white hover:bg-[#FFFAF5] hover:text-green-800 bg-transparent" 
                  : "border-white/60 text-white hover:bg-[#FFFAF5] hover:text-black bg-black/30 backdrop-blur-sm"
                }`}
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signups")}
              className={`rounded-md transition duration-300 whitespace-nowrap font-medium shadow-lg 
                ${isScrolled ? "px-3 py-1 text-xs md:text-sm" : "px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base"}
                ${isScrolled 
                  ? "bg-[#FFFAF5] text-green-800 hover:bg-gray-100 shadow-black/20" 
                  : "bg-green-800 text-white hover:bg-green-800 shadow-green-800/30"
                }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION BACKGROUND & TEXT ================= */}
      {/* pt-32 lagaya hai taaki header ke neeche se content start ho */}
      <div className="relative w-full h-[85vh] min-h-[600px] flex items-center pt-32 px-4 sm:px-6 md:px-16 overflow-hidden">
        
        {/* Background Image (Sirf Hero Section ke andar rahegi) */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={heroBg}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-2xl text-left">
          <p className="text-pink-400 font-semibold tracking-widest uppercase mb-4 text-sm md:text-base drop-shadow-md">
            Find Your Perfect Match
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl">
            Connect. <br className="hidden sm:block"/> 
            <span className="text-green-800">Share.</span> Grow.
          </h1>
          
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 max-w-xl drop-shadow-md">
            Begin your journey to forever. Join a community where real connections happen, and discover the love story you've been waiting for.
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/signups")}
              className="px-8 py-4 bg-green-800 hover:bg-green-800 rounded-md 
                text-white font-semibold text-lg shadow-lg shadow-green-800/30 
                transition duration-300 hover:scale-105"
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>

      {/* 👇 Aapka baaki ka content (Icons, flags, etc.) yahan render hoga 
          jo aapne is HeroSection ke baad apne page me likha hai */}
      {children}
      
    </section>
  );
};

export default HeroSection;