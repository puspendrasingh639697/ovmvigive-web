import React from "react";

export default function AdPlaceholder({ size = "banner" }) {
  const sizes = {
    banner: "w-full h-24",
    square: "w-64 h-64",
    vertical: "w-40 h-96",
    mobile: "w-full h-16",
  };

  return (
    <div className={`${sizes[size]} bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center my-3`}>
      <div className="text-center">
        <p className="text-gray-500 text-sm font-semibold">📢 Ad Space</p>
        <p className="text-gray-400 text-xs">({size})</p>
      </div>
    </div>
  );
}