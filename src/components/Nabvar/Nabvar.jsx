import React from "react";
import { Link } from "react-router-dom";

function Nabvar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#FF512F] to-[#DD2476] shadow-lg py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-white font-bold text-2xl tracking-wide">Hiddo</h1>

      {/* Buttons */}
      <div className="flex gap-3">
        <Link
          to="/login"
          className="px-4 py-2 bg-[#FFFAF5]/10 hover:bg-[#FFFAF5]/20 text-white rounded-xl font-medium transition-all"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-[#FFFAF5] text-[#DD2476] font-semibold rounded-xl hover:bg-green-800 transition-all"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Nabvar;
