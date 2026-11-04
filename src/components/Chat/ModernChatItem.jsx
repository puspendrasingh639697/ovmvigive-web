import React from "react";

export default function ModernChatItem({
  chat,
  isSelected,
  currentEmail,
  selectItems,
  setActiveChat,
  selectedItems,
  newMessages,
  getChatName,
  getSubtitle,
  getSubtitle2,
}) {
  const otherUsers = chat.users?.filter((u) => u.email !== currentEmail) || [];
  const otherUser = otherUsers[0];
  const avatarUrl = otherUser?.avatar;
  const unreadCount = newMessages[chat.id] || 0;
  const isGroupChat = !!chat.groupName;

  return (
    <div
      onClick={() => {
        if (selectedItems.length) {
          selectItems(chat);
          return;
        }
        setActiveChat(chat);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        selectItems(chat);
      }}
      className={`flex items-center cursor-pointer gap-4 p-3 rounded-lg transition-all
         ${isSelected ? "ring-2 ring-pink-400 bg-[#FFFAF5]/5" : "hover:bg-[#FFFAF5]/5"}`}
    >
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={getChatName(chat)}
            className="w-14 h-14 rounded-xl object-cover border-2 border-black"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#FF512F] to-[#DD2476] text-white font-bold">
            {getChatName(chat).charAt(0).toUpperCase()}
          </div>
        )}
        {otherUser?.isactivestatus && !isGroupChat && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
        )}
        {isGroupChat && (
          <div className="absolute bottom-0 right-0 rounded-full bg-green-800 text-white text-xs w-5 h-5 flex items-center justify-center border-2 border-black">
            👥
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="truncate">
            <div className="text-sm font-semibold text-white truncate">
              {getChatName(chat)}
            </div>
            <div className="text-xs text-gray-300 truncate">
              {getSubtitle(chat)}
            </div>
          </div>
          <div className="text-xs text-gray-400">{getSubtitle2(chat)}</div>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="ml-2 bg-gradient-to-br from-[#FF512F] to-[#DD2476] text-white rounded-full px-2 py-1 text-xs font-semibold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </div>
  );
}