// Footer.jsx
import React, { useState, useEffect } from "react";
import { Mail, Phone, Linkedin, Instagram } from "lucide-react";
import Lottie from "lottie-react";

import GooglePlayAnimation from "../../assets/images/google.json";
import AppStoreAnimation from "../../assets/images/AppStore.json";

import HiddoLogo from "../../assets/images/logo.png"; 

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer className="bg-green-800 text-white py-16 px-6 md:px-16 relative overflow-hidden">
   
      <div
        className={`max-w-7xl mx-auto w-[100%] grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* 1. Logo and Address */}
        <div>
          {/* 👇 Logo White kar diya hai */}
          <img
            src={HiddoLogo} 
            alt="Hiddo Logo"
            className="h-20 w-auto object-contain mb-4 drop-shadow-md"
            style={{ 
              filter: "brightness(0) invert(1)" 
            }}
          />
          <p className="text-sm leading-6 mb-4 text-pink-50">
            123 Hiddo HQ, Tech Park, <br />
            Silicon Valley, CA 94025, USA
          </p>
        </div>

        {/* 2. Quick Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-bold text-white mb-2">Quick Links</h3>
          {[
            { name: "About Us", link: "/about" },
            { name: "Creator Hub", link: "/creators" },
            { name: "Safety Center", link: "/safety" },
            { name: "Terms & Conditions", link: "/terms" },
            { name: "Privacy Policy", link: "/privacy" },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="text-green-800 hover:text-white transition-colors duration-300"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* 3. Follow Us & App Store */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white mb-2">Follow Us</h3>
          <div className="space-x-4 flex items-center">
            <a
              href="https://linkedin.com/company/hiddo" 
              target="_blank"
              rel="noreferrer"
              className="hover:scale-110 transition-transform duration-300"
            >
              <Linkedin className="w-6 h-6 text-white hover:text-pink-200" />
            </a>
            <a
              href="https://instagram.com/hiddo" 
              target="_blank"
              rel="noreferrer"
              className="hover:scale-110 transition-transform duration-300"
            >
              <Instagram className="w-6 h-6 text-white hover:text-pink-200" />
            </a>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <div className="cursor-pointer transform hover:scale-105 transition-all duration-300">
              <Lottie
                animationData={GooglePlayAnimation}
                loop={true}
                className="h-16 w-40"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact Info & App Store */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Reach Us</h3>
          <div className="flex items-center space-x-3 mb-2">
            <Mail className="w-5 h-5 text-pink-200" />
            <a
              href="mailto:support@hiddo.live" 
              className="text-green-800 hover:text-white transition-colors duration-300"
            >
              support@hiddo.live
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-pink-200" />
            <p className="text-green-800">+1 (800) 123-4567</p>
          </div>
          <p className="text-sm mt-2 font-semibold text-white">Hiddo Customer Support</p>

          <div className="cursor-pointer transform hover:scale-105 transition-all duration-300 mt-4">
            <Lottie
              animationData={AppStoreAnimation}
              loop={true}
              className="h-16 w-40"
            />
          </div>
        </div>
      </div>

      

    </footer>
  );
};

export default Footer;