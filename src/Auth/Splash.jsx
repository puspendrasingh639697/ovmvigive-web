import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const letterVariants = {
  hidden: (direction) => {
    switch (direction) {
      case "left":
        return { x: -200, opacity: 0 };
      case "right":
        return { x: 200, opacity: 0 };
      case "top":
        return { y: -200, opacity: 0 };
      case "bottom":
        return { y: 200, opacity: 0 };
      case "scale":
        return { scale: 0, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  },
  visible: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const PuspendraLogo = () => {
  const letters = [
    { char: "P", direction: "left" },
    { char: "u", direction: "top" },
    { char: "s", direction: "right" },
    { char: "p", direction: "bottom" },
    { char: "e", direction: "scale" },
    { char: "n", direction: "left" },
    { char: "d", direction: "top" },
    { char: "r", direction: "right" },
    { char: "a", direction: "bottom" },
  ];

  return (
    <motion.div
      className="relative flex flex-wrap justify-center items-center gap-1 sm:gap-2"
      initial="hidden"
      animate="visible"
    >
      {letters.map((l, i) => (
        <motion.span
          key={i}
          custom={l.direction}
          variants={letterVariants}
          transition={{ delay: i * 0.15 }}
          className="text-[50px] sm:text-[90px] lg:text-[120px] font-extrabold tracking-tight 
            bg-white 
            text-transparent bg-clip-text 
            drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
        >
          {l.char}
        </motion.span>
      ))}

      {/* Subtext */}
      <motion.div
        className="absolute w-full text-center text-white/80 text-lg sm:text-2xl font-medium mt-[180px] sm:mt-[260px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        {/* Optional tagline */}
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute top-0 left-[-150%] w-[300%] h-full 
          bg-gradient-to-r from-transparent via-white/50 to-transparent blur-2xl pointer-events-none"
        animate={{ left: ["-150%", "150%"] }}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.2,
        }}
      />
    </motion.div>
  );
};

// --- Main Splash Component with Auth Logic ---

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const timer = setTimeout(() => {
        if (user) {
          console.log("User authenticated, redirecting to /discover");
          navigate("/discover", { replace: true });
        } else {
          console.log("User not authenticated, redirecting to /mainsrceen");
          navigate("/mainsrceen", { replace: true });
        }
      }, 3000);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div
      className="fixed bg-green-800 inset-0 flex flex-col items-center justify-center text-white z-50 overflow-hidden"
      
    >
      <div className="text-center px-4">
        <PuspendraLogo />
      </div>
    </div>
  );
}