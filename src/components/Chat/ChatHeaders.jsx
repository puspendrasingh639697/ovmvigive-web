import React from "react";
import {
  IoIosArrowBack,
  IoIosCall,
  IoIosVideocam,
  IoIosGift,
  IoIosPerson,
  IoIosInformationCircle,
} from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdBlock, MdReport } from "react-icons/md";

export default function ChatHeader({
  activeChat,
  currentEmail,
  isMobile,
  setActiveChat,
  setShowSidebarOnMobile,
  isTyping,
  initiateCall,
  initiateVideoCall,
  setShowStickerPicker,
  isChatDisabled,
  showMenu,
  setShowMenu,
  menuRef,
  handleBlockToggle,
  isBlocked,
  handleClearChat,
  getChatName,
}) {
  const partner = activeChat?.users?.find((u) => u.email !== currentEmail) || {};

  return (
    <div
      className="sticky top-0 z-10 p-3 text-white shadow-xl"
      style={{
        background: `linear-gradient(rgba(8, 5, 5, 0.3))`,
        borderBottom: `1px solid rgba(5, 4, 4, 0.3)`,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={() => {
                setActiveChat(null);
                setShowSidebarOnMobile(true);
              }}
              className="p-1 rounded-full hover:bg-[#FFFAF5]/20 transition-colors mr-2"
            >
              <IoIosArrowBack size={24} />
            </button>
          )}

          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={partner.avatar || "https://i.pravatar.cc/300"}
                className="w-10 h-10 rounded-full object-cover"
                alt={partner.name || "User"}
                onError={(e) => {
                  e.target.src = "https://i.pravatar.cc/300";
                }}
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  partner?.isactivestatus ? "bg-green-400" : "bg-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-col leading-tight">
              <h2 className="text-base font-semibold truncate max-w-[150px]">
                {partner.name || partner.email || getChatName(activeChat)}
              </h2>
              <p className="text-xs">
                {isTyping ? (
                  <span className="flex items-center space-x-1">
                    <span className="w-1 h-1 bg-[#FFFAF5] rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-1 bg-[#FFFAF5] rounded-full animate-bounce delay-150" />
                    <span className="w-1 h-1 bg-[#FFFAF5] rounded-full animate-bounce delay-300" />
                    typing...
                  </span>
                ) : partner?.isactivestatus ? (
                  "Online"
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full transition-all hover:scale-110 hover:bg-[#FFFAF5]/20"
            onClick={() => initiateCall(false)}
            disabled={isChatDisabled}
            title="Voice Call"
          >
            <IoIosCall size={30} className="text-green-800" />
          </button>

          <button
            className="p-2 rounded-full transition-all hover:scale-110 hover:bg-[#FFFAF5]/20"
            onClick={() => initiateVideoCall()}
            disabled={isChatDisabled}
            title="Video Call"
          >
            <IoIosVideocam size={20} />
          </button>

          <button
            className="p-2 rounded-full transition-all hover:scale-110 hover:bg-[#FFFAF5]/20"
            onClick={() => setShowStickerPicker(true)}
            disabled={isChatDisabled || !activeChat}
            title="Send Gift"
          >
            <IoIosGift size={20} />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded-full transition-all hover:scale-110 hover:bg-[#FFFAF5]/20"
              onClick={() => setShowMenu(!showMenu)}
              title="More Options"
            >
              <IoEllipsisVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-[#FFFAF5] text-gray-800 rounded-lg shadow-xl overflow-hidden py-1 z-20">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    alert("View Profile");
                    setShowMenu(false);
                  }}
                >
                  <IoIosPerson className="mr-3 text-lg" />
                  <span>View Profile</span>
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  onClick={handleBlockToggle}
                >
                  <MdBlock className="mr-3 text-lg" />
                  <span>{isBlocked ? "Unblock User" : "Block User"}</span>
                </button>

                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
                  onClick={() => {
                    alert("Report");
                    setShowMenu(false);
                  }}
                >
                  <MdReport className="mr-3 text-lg" />
                  <span>Report User</span>
                </button>

                <hr className="my-1 border-gray-200" />

                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  onClick={handleClearChat}
                >
                  <IoIosInformationCircle className="mr-3 text-lg" />
                  <span>Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}