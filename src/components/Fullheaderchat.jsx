import React, { useState, useRef } from "react";
import {
  IoIosArrowBack,
  IoIosMore,
  IoIosPerson,
  IoIosInformationCircle,
} from "react-icons/io";
import {
  MdBlock,
  MdReport,
} from "react-icons/md";
import {
  IoSearch,
  IoPeople,
  IoFlashOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";

 function Fullheaderchat({
  params = {},
  isOnline = false,
  isTyping = false,
  isBlocked = false,
  navigate = () => {},
  handleViewProfile = () => {},
  handleBlockToggle = () => {},
  handleReportUser = () => {},
  handleClearChat = () => {},
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  return (
    <div
      className="sticky top-0 z-50 bg-gradient-to-r from-green-800/80 to-orange-500/80 backdrop-blur-2xl shadow-lg border-b border-white/20 px-4 sm:px-6 py-3 flex items-center justify-between rounded-b-2xl"
    >
      {/* 🔙 Left Section — Back + Logo + Navigation Icons */}
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-[#FFFAF5]/20 hover:bg-[#FFFAF5]/30 p-2 rounded-xl transition-all"
        >
          <IoIosArrowBack size={22} className="text-white" />
        </button>

        {/* Logo */}
        <span
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #ffffff, #ffd2eb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hiddo
        </span>

        {/* Nav Buttons (Discover, People, Chat) */}
        <div className="hidden sm:flex items-center space-x-3 ml-3">
          {[IoFlashOutline, IoPeople, IoChatbubbleEllipsesOutline].map(
            (Icon, idx) => (
              <button
                key={idx}
                className="p-2 rounded-full transition-all hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
                  boxShadow: "0 0 8px rgba(255, 81, 47, 0.5)",
                }}
              >
                <Icon className="text-white text-lg" />
              </button>
            )
          )}
        </div>
      </div>

      {/* 👤 Right Section — User Info + Menu */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={params.avatar || params.image || "https://i.pravatar.cc/300"}
              alt={params.name || params.email || "User"}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/30 object-cover"
              onError={(e) => {
                e.target.src = "https://i.pravatar.cc/300";
              }}
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${
                isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            ></span>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-white font-semibold text-sm">
              {params.name || params.email || "Unknown User"}
            </h2>
            <p className="text-xs text-white/70">
              {isTyping ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#FFFAF5]/70 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#FFFAF5]/70 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-[#FFFAF5]/70 rounded-full animate-bounce delay-200"></span>
                  typing...
                </span>
              ) : isOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            className="bg-[#FFFAF5]/20 hover:bg-[#FFFAF5]/30 p-2 rounded-xl transition-all"
            onClick={() => setShowMenu(!showMenu)}
            title="More Options"
          >
            <IoIosMore size={22} className="text-white" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 bg-[#FFFAF5]/90 backdrop-blur-md text-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200/50 w-48 animate-fadeIn">
              <button
                className="modern-menu-item hover:bg-gray-100 px-4 py-2 flex items-center gap-2 w-full text-left"
                onClick={handleViewProfile}
              >
                <IoIosPerson className="text-green-800" /> View Profile
              </button>

              <button
                className="modern-menu-item hover:bg-gray-100 px-4 py-2 flex items-center gap-2 w-full text-left"
                onClick={handleBlockToggle}
              >
                <MdBlock className="text-red-500" />
                {isBlocked ? "Unblock User" : "Block User"}
              </button>

              <button
                className="modern-menu-item hover:bg-gray-100 px-4 py-2 flex items-center gap-2 w-full text-left"
                onClick={handleReportUser}
              >
                <MdReport className="text-orange-500" /> Report User
              </button>

              <button
                className="modern-menu-item hover:bg-gray-100 px-4 py-2 flex items-center gap-2 w-full text-left"
                onClick={handleClearChat}
              >
                <IoIosInformationCircle className="text-blue-500" /> Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Fullheaderchat