import React from "react";
import {
  IoIosSend,
  IoIosImages,
  IoIosGift,
} from "react-icons/io";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";

// 👇 YAHAN BACKGROUND IMAGES IMPORT KI HAIN
// Dhyan rakhein: apne folder structure ke hisaab se path adjust karein
import chatBgImage from "../../assets/images/chatbgimage.jpg";
import chatCenterImage from "../../assets/images/chatimahe.png";

export default function MainChat({
  activeChat,
  setActiveChat,
  showSidebarOnMobile,
  isMobile,
  setShowSidebarOnMobile,
  currentEmail,
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
  isLoadingMessages,
  messages,
  messagesEndRef,
  pickMedia,
  uploading,
  inputText,
  handleChangeText,
  handleSendMessage,
}) {
  
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-8 text-gray-200">
      <div className="w-10 h-10 border-4 border-t-4 border-t-white border-gray-500 rounded-full animate-spin mb-3"></div>
      <p>Loading messages...</p>
    </div>
  );

  const EmptyChat = () => (
    <div className="flex flex-col items-center justify-center p-8 text-white/70 h-full">
      <div className="text-6xl mb-4">💬</div>
      <h3 className="text-xl font-semibold mb-2 text-white">No messages yet</h3>
      <p className="text-center">Start a conversation by sending a message!</p>
    </div>
  );

  return (
    <main
      className={`flex-1 flex flex-col bg-[#0a0a0a] ${
        isMobile && showSidebarOnMobile ? "hidden" : "block"
      }`}
    >
      {!activeChat ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold mb-3 text-white">
            Select a chat to start messaging
          </h2>
          <p className="text-gray-400 text-sm">
            Choose a conversation from the list to start chatting
          </p>
        </div>
      ) : (
        <>
          <ChatHeader
            activeChat={activeChat}
            currentEmail={currentEmail}
            isMobile={isMobile}
            setActiveChat={setActiveChat}
            setShowSidebarOnMobile={setShowSidebarOnMobile}
            isTyping={isTyping}
            initiateCall={initiateCall}
            initiateVideoCall={initiateVideoCall}
            setShowStickerPicker={setShowStickerPicker}
            isChatDisabled={isChatDisabled}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            menuRef={menuRef}
            handleBlockToggle={handleBlockToggle}
            isBlocked={isBlocked}
            handleClearChat={handleClearChat}
            getChatName={getChatName}
          />

          {/* ✅ MESSAGES AREA WITH BACKGROUND IMAGES */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 shadow-inner relative"
            style={{
              backgroundImage: `url(${chatBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Center Image (fixed and non-clickable) */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-30">
              <img
                src={chatCenterImage}
                alt="chat-center"
                className="w-64 h-64 md:w-96 md:h-96 object-contain"
              />
            </div>

            {/* Actual Messages */}
            <div className="relative z-10">
              {isLoadingMessages ? (
                <LoadingSpinner />
              ) : messages.length === 0 ? (
                <EmptyChat />
              ) : (
                messages.map((message, index) => (
                  <MessageBubble
                    key={message._id || index}
                    message={message}
                    currentEmail={currentEmail}
                    activeChat={activeChat}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="sticky bottom-0 z-10 p-3 bg-[#FFFAF5] shadow-xl flex items-center space-x-2 border-t border-gray-200">
            {isChatDisabled ? (
              <div className="flex-1 p-3 text-center text-red-500 bg-red-50 rounded-full border border-red-200">
                {isBlocked
                  ? "You have blocked this user."
                  : "You are blocked by this user."}
              </div>
            ) : (
              <>
                <button
                  onClick={pickMedia}
                  disabled={uploading}
                  className={`p-3 rounded-full text-green-800 transition-colors ${
                    uploading ? "opacity-50" : "hover:bg-gray-100"
                  }`}
                  title="Attach Media"
                >
                  <IoIosImages size={24} />
                </button>

                <button
                  className="p-3 rounded-full text-green-800 transition-colors hover:bg-gray-100"
                  onClick={() => setShowStickerPicker(true)}
                  disabled={!activeChat}
                  title="Send Gift"
                >
                  <IoIosGift size={24} />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChangeText(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-800 transition-all"
                  disabled={uploading}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendMessage();
                  }}
                  disabled={uploading || !inputText.trim()}
                  className={`p-3 rounded-full transition-colors ${
                    inputText.trim()
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  title="Send Message"
                >
                  <IoIosSend size={24} />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}