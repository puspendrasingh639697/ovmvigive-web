import React, { useState } from "react";
import {
  IoClose,
  IoReload,
  IoCheckmark,
  IoEllipsisHorizontal,
} from "react-icons/io5";

export default function FilterModal({ onClose }) {
  const [activeStatus, setActiveStatus] = useState(null);
  const [gender, setGender] = useState(null);
  const [country, setCountry] = useState(null);
  const [age, setAge] = useState(25);
  const [maritalStatus, setMaritalStatus] = useState(null);

  const statusOptions = ["Online", "Offline", "Busy", "Away"];
  const genderOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const countries = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
  ];

  const resetFilters = () => {
    setActiveStatus(null);
    setGender(null);
    setCountry(null);
    setAge(25);
    setMaritalStatus(null);
  };

  const applyFilters = () => {
    console.log({
      activeStatus,
      gender,
      country,
      age,
      maritalStatus,
    });
    onClose();
  };

  return (
    <div
      className="inset-0 z-[9999] buttom-0 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-scaleIn"
        style={{
          background: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✳️ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#FFFAF5]/20 hover:bg-[#FFFAF5]/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10"
        >
          <IoClose className="text-xl" />
        </button>

        {/* ✨ Modal Content */}
        <div className="p-6 md:p-8 text-white overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Discover Filters
          </h2>

          {/* Status */}
          <div className="mb-7">
            <h4 className="font-semibold mb-3 text-white/90">Status</h4>
            <div className="flex flex-wrap gap-3">
              {statusOptions.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setActiveStatus(activeStatus === item ? null : item)
                  }
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
                    activeStatus === item
                      ? "bg-[#FFFAF5] text-green-800"
                      : "bg-[#FFFAF5]/20 text-white hover:bg-[#FFFAF5]/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="mb-7">
            <h4 className="font-semibold mb-3 text-white/90">Gender</h4>
            <div className="flex flex-wrap gap-3">
              {genderOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setGender(gender === item ? null : item)}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
                    gender === item
                      ? "bg-[#FFFAF5] text-green-800"
                      : "bg-[#FFFAF5]/20 text-white hover:bg-[#FFFAF5]/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div className="mb-7">
            <h4 className="font-semibold mb-3 text-white/90">Country</h4>
            <div className="relative">
              <select
                value={country?.code || ""}
                onChange={(e) => {
                  const selected = countries.find(
                    (c) => c.code === e.target.value
                  );
                  setCountry(selected);
                }}
                className="w-full p-3 rounded-2xl bg-[#FFFAF5]/20 text-white font-medium border border-white/30 focus:bg-[#FFFAF5]/30 appearance-none"
              >
                <option value="">All</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="text-gray-800">
                    {c.name}
                  </option>
                ))}
              </select>
              <IoEllipsisHorizontal className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white rotate-90" />
            </div>
          </div>

          {/* Age */}
          <div className="mb-7">
            <h4 className="font-semibold mb-3 text-white/90">
              Age: {age} years
            </h4>
            <input
              type="range"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full h-2 bg-[#FFFAF5]/30 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#FFFAF5]"
            />
          </div>

          {/* Marital Status */}
          <div className="mb-8">
            <h4 className="font-semibold mb-3 text-white/90">
              Marital Status
            </h4>
            <div className="flex flex-wrap gap-3">
              {maritalStatusOptions.map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setMaritalStatus(maritalStatus === item ? null : item)
                  }
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
                    maritalStatus === item
                      ? "bg-[#FFFAF5] text-green-800"
                      : "bg-[#FFFAF5]/20 text-white hover:bg-[#FFFAF5]/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/20">
            <button
              className="flex-1 bg-[#FFFAF5]/20 hover:bg-[#FFFAF5]/30 text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2 transition-all"
              onClick={resetFilters}
            >
              <IoReload />
              Reset
            </button>
            <button
              className="flex-1 bg-[#FFFAF5] text-green-800 hover:bg-gray-100 rounded-2xl py-3 font-bold flex items-center justify-center gap-2 transition-all"
              onClick={applyFilters}
            >
              <IoCheckmark />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}