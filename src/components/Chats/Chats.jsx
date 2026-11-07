import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase/config";
import { supabase } from "../../firebase/supabaseClient";
import NativeAdWeb from "../NativeAdWeb/NativeAdWeb";
import Header from "../../page/Dashboard";



export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const isFocused = location.pathname === "/chats";
  const [refreshing, setRefreshing] = useState(false);

  const translations = {
    en: {
      messages: "Messages",
      noConversations: "No Conversations",
      startChatting: "Start chatting by messaging your friends",
      deleteChat: "Delete Chat",
      deleteSelectedChats: "Delete Selected Chats",
      deleteConfirmation: "Messages will be removed from this device.",
      cancel: "Cancel",
      search: "Search conversations...",
      all: "All",
      unread: "Unread",
      groups: "Groups"
    },
  };

  // Define these functions BEFORE they are used
  const getChatName = useCallback((chat) => {
    const currentUser = auth?.currentUser;
    if (chat.groupName) return chat.groupName;
    const otherUser = chat.users?.find((u) => u.email !== currentUser?.email);
    return otherUser?.name || otherUser?.email || "Unknown";
  }, []);

  const getSubtitle = useCallback((chat) => {
    const lastMessage = chat.last_message;
    if (!lastMessage) return "No messages yet";
    if (lastMessage.text)
      return lastMessage.text.length > 25
        ? `${lastMessage.text.substring(0, 25)}...`
        : lastMessage.text;
    if (lastMessage.image) return "📷 Image";
    if (lastMessage.audio) return "🎵 Audio";
    return "Sent a message";
  }, []);

  const getSubtitle2 = useCallback((chat) => {
    const last_updated = chat.last_updated;
    if (!last_updated) return "";
    const now = new Date();
    const msgDate = new Date(last_updated);
    const diffTime = Math.abs(now - msgDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return msgDate.toLocaleDateString([], { weekday: "short" });
    return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
  }, []);

  // Now define filteredChats AFTER the functions it depends on
  const filteredChats = chats.filter(chat => {
    const matchesSearch = getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSubtitle(chat).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ? true :
        activeFilter === "unread" ? (newMessages[chat.id] > 0) :
          activeFilter === "groups" ? (chat.groupName !== null) : true;

    return matchesSearch && matchesFilter;
  });

  // Load Chats
  const loadChats = useCallback(async () => {
    setLoading(true);
    try {
      const storedMessages = localStorage.getItem("newMessages");
      const unreadBuffer = storedMessages ? JSON.parse(storedMessages) : {};
      setNewMessages(unreadBuffer);

      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("*")
        .contains("participants", [auth?.currentUser?.email])
        .order("last_updated", { ascending: false });

      if (chatsError) {
        console.log("Error fetching chats:", chatsError.message);
        setLoading(false);
        return;
      }

      const chatsWithAvatars = await Promise.all(
        chatsData.map(async (chat) => {
          const usersWithAvatars = await Promise.all(
            chat.users.map(async (user) => {
              try {
                const { data: userData } = await supabase
                  .from("users")
                  .select("avatar, about, isactivestatus")
                  .eq("email", user.email)
                  .single();
                return {
                  ...user,
                  avatar: userData?.avatar ?? null,
                  about: userData?.about ?? null,
                  isactivestatus: userData?.isactivestatus ?? null,
                };
              } catch (error) {
                return { ...user, avatar: null };
              }
            })
          );
          return { ...chat, users: usersWithAvatars };
        })
      );

      setChats(chatsWithAvatars || []);
    } catch (error) {
      console.log("❌ Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChats();
    setTimeout(() => setRefreshing(false), 1000);
  }, [loadChats]);

  useEffect(() => {
    if (isFocused) loadChats();
  }, [isFocused, loadChats]);

  const handleChatPress = (chat) => {
    const chatId = chat.id;
    if (selectedItems.length) {
      selectItems(chat);
      return;
    }

    // Update local unread messages
    const updated = { ...newMessages };
    delete updated[chatId];
    localStorage.setItem("newMessages", JSON.stringify(updated));
    localStorage.setItem(`lastSeen_${chatId}`, Date.now().toString());
    setNewMessages(updated);

    const otherUser = chat.users?.find((u) => u.email !== auth.currentUser?.email);
    navigate("/chat", {
      state: {
        id: chatId,
        chatName: getChatName(chat),
        email: otherUser?.email || "",
        avatar: otherUser?.avatar || "",
        name: otherUser?.name || "",
        about: otherUser?.about || "",
        isactivestatus: otherUser?.isactivestatus || "",
      },
    });
  };

  const handleChatLongPress = (chat) => selectItems(chat);

  const selectItems = (chat) =>
    setSelectedItems((prev) =>
      prev.includes(chat.id) ? prev.filter((id) => id !== chat.id) : [...prev, chat.id]
    );

  const deSelectItems = useCallback(() => setSelectedItems([]), []);

  const handleDeleteChat = useCallback(() => {
    if (!selectedItems.length) return;
    const confirmDelete = window.confirm(
      selectedItems.length > 1
        ? "Delete selected chats? Messages will be removed from this device."
        : "Delete this chat? Messages will be removed from this device."
    );
    if (!confirmDelete) return;
    deleteSelectedChats();
  }, [selectedItems]);

  const deleteSelectedChats = async () => {
    try {
      const email = auth?.currentUser?.email;
      const deletePromises = selectedItems.map(async (chatId) => {
        await supabase
          .from("deletedchats")
          .upsert({ user_email: email, chat_id: chatId }, { onConflict: "user_email,chat_id" });
        const { data: chatData } = await supabase
          .from("chats")
          .select("participants")
          .eq("id", chatId)
          .single();
        const { data: deletedUsers } = await supabase
          .from("deletedchats")
          .select("user_email")
          .eq("chat_id", chatId);
        if (chatData.participants.every((p) => deletedUsers?.some((d) => d.user_email === p))) {
          await supabase.from("chats").delete().eq("id", chatId);
        }
      });
      await Promise.all(deletePromises);
      deSelectItems();
      loadChats();
    } catch (err) {
      console.log("Error deleting chat:", err.message);
    }
  };

  const ModernChatItem = ({ chat, isSelected }) => {
    const otherUser = chat.users?.find((u) => u.email !== auth.currentUser?.email);
    const avatarUrl = otherUser?.avatar;
    const unreadCount = newMessages[chat.id] || 0;
    const isGroupChat = chat.groupName;

    const chatCardClasses = `flex items-center bg-[#FFFAF5] rounded-[24px] p-[18px] cursor-pointer relative transition-all duration-400 ease-in-out border border-transparent overflow-hidden 
                                 before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-[#FF512F] before:to-[#DD2476] before:opacity-0 before:transition-opacity before:duration-300
                                 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-pink-400/30 hover:border-pink-300
                                 hover:before:opacity-100 ${isSelected ? "bg-gradient-to-r from-pink-50/50 to-orange-50/50 border-green-800 ring-2 ring-green-800/50 scale-[0.98]" : "border-green-800/50"}`;

    return (
      <div
        className={chatCardClasses}
        onClick={() => handleChatPress(chat)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleChatLongPress(chat);
        }}
      >
        {/* Avatar Container */}
        <div className="relative mr-[18px] flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={getChatName(chat)} className="w-16 h-16 rounded-[20px] border-4 border-white object-cover shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#FF512F] to-[#DD2476] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-[1.05] hover:rotate-2">
              <span className="text-white text-2xl font-extrabold">
                {getChatName(chat).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {otherUser?.isactivestatus && !isGroupChat && (
            <div className="absolute bottom-[2px] right-[2px] w-4 h-4 rounded-full bg-green-500 border-3 border-white shadow-md" />
          )}
          {isGroupChat && (
            <div className="absolute bottom-[-4px] right-[-4px] bg-[#FF512F] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs border-2 border-white font-bold">
              👥
            </div>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[17px] font-extrabold text-gray-900 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
              {getChatName(chat)}
            </span>
            <span className="text-sm text-gray-500 font-semibold flex-shrink-0 mt-0.5">
              {getSubtitle2(chat)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-600 flex-1 mr-2 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis font-medium">
              {getSubtitle(chat)}
            </span>
            {unreadCount > 0 && (
              <div className="bg-gradient-to-br from-[#FF512F] to-[#DD2476] rounded-full min-w-6 h-6 flex items-center justify-center px-2 shadow-lg shadow-pink-400/50 flex-shrink-0">
                <span className="text-xs font-extrabold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-orange-50/50 rounded-[24px] flex items-start justify-end p-[18px]">
            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#FF512F] to-[#DD2476] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-pink-400/50">
              ✓
            </div>
          </div>
        )}
      </div>
    );
  };

  const injectAdsInChats = (chats) => {
    const newData = [];
    chats.forEach((chat, index) => {
      newData.push({ type: "chat", data: chat });
      if ((index + 1) % 3 === 0) newData.push({ type: "ad", id: `ad-${index}` });
    });
    return newData;
  };

  return (

    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-['Segoe_UI',_system-ui,_-apple-system,_sans-serif]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Main Content (add top padding equal to header height) */}
      <div className="pt-[90px] relative min-h-[80vh] bg-[#FFFAF5] overflow-x-hidden">
        {/* Animated Background - Requires Tailwind config for animations/shapes */}
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-[#FF512F] via-[#DD2476] to-[#FF512F] bg-[length:400%_400%] animate-gradientShift z-0">
          {/* Floating Shapes - Complex to do without custom CSS/Tailwind config extensions. Using simple placeholders here. */}
          <div className="absolute rounded-full bg-[#FFFAF5]/10 backdrop-blur-md w-[300px] h-[300px] -top-24 -right-12 animate-floatSlow" />
          <div className="absolute rounded-full bg-[#FFFAF5]/10 backdrop-blur-md w-[200px] h-[200px] -bottom-8 -left-8 animate-floatMedium" />
        </div>

        {/* Header Section */}
        <div className="p-5 pt-0 relative z-10">
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-2">
              <button
                className={`bg-[#FFFAF5]/15 backdrop-blur-lg border border-white/20 text-white py-2.5 px-4 rounded-md font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 text-sm hover:bg-[#FFFAF5]/25 hover:translate-y-[-2px] ${refreshing ? "animate-spin-slow" : ""
                  }`}
                onClick={onRefresh}
              >
                <span className="text-xl">⟳</span>
                Refresh
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["all", "unread"].map((filter) => (
              <button
                key={filter}
                className={`bg-[#FFFAF5]/10 backdrop-blur-lg border border-white/20 text-white/80 py-2 px-4 rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap relative
                                            ${activeFilter === filter ? "bg-[#FFFAF5]/90 !text-[#FF512F] border-white/90" : ""
                  }`}
                onClick={() => setActiveFilter(filter)}
              >
                {translations.en[filter]}
                {filter === "unread" &&
                  Object.keys(newMessages).length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FF512F] text-white rounded-full py-0.5 px-1.5 text-xs font-extrabold min-w-[18px] text-center">
                      {Object.keys(newMessages).length}
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>
 
{/* 🧩 Content Container */}
<div
  className="bg-green-800 min-h-[calc(100vh_-_200px)] pt-8 px-4 sm:px-6 pb-[120px] rounded-t-[10px] overflow-y-auto relative z-10"
  onClick={deSelectItems}
>
  {loading ? (
    // 🦴 Skeleton Loading - Improved
    <div className="space-y-5 px-0 sm:px-4">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="bg-[#FFFAF5]/10 h-20 rounded-xl shadow-lg flex items-center p-4 animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-600 rounded-lg mr-4"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  ) : filteredChats.length === 0 ? (
    // 💬 Empty State - Styled for dark background
    <div className="flex flex-col items-center justify-center py-20 text-center text-white">
      <div className="text-6xl mb-4 text-pink-400">💬</div>
      <h3 className="text-xl font-bold mb-2">
        {searchQuery ? "No matches found" : translations.en.noConversations}
      </h3>
      <p className="text-base text-gray-300 mb-5">
        {searchQuery
          ? "Try adjusting your search terms"
          : translations.en.startChatting}
      </p>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="px-5 py-2 bg-green-800 text-white text-sm rounded-lg font-semibold hover:bg-pink-700 transition shadow-lg shadow-green-800/50"
        >
          Clear Search
        </button>
      )}
    </div>
  ) : (
    // 💬 Chat + Ad Grid Layout - Modern & Responsive Profile Cards
    <div
      className="
        max-w-[1300px] mx-auto 
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 
        gap-6 sm:gap-8
      "
    >
      {injectAdsInChats(filteredChats).map((item) => {
        // 🔹 Chat Card (Profile Card Style)
        if (item.type === "chat")
          return (
            <div
              key={item.data.id}
              // Wrapper for Gradient Border and Premium Hover Effect
              className={`
                p-[2px] rounded-2xl shadow-xl transition-all duration-500 
                hover:scale-[1.03] 
                ${selectedItems.includes(item.data.id) ? "ring-4 ring-green-800/70" : ""}
                bg-gradient-to-r from-green-800 via-purple-500 to-red-500
                cursor-pointer
              `}
            >
              <div
                className={`
                  // Changed to white/light background to match the image style
                  bg-[#FFFAF5] rounded-2xl p-0 flex flex-col justify-center h-full 
                  transition-all duration-300 
                  // Added a subtle shadow to lift the card
                  shadow-lg shadow-gray-700/10
                `}
              >
                {/* ModernChatItem component should handle the profile image and text overlay */}
                <div
                  className={`
                    w-full text-gray-800 transition-all duration-300
                    ${selectedItems.includes(item.data.id) ? "ring-4 ring-pink-400/50 rounded-2xl" : ""}
                  `}
                >
                  <ModernChatItem
                    chat={item.data}
                    isSelected={selectedItems.includes(item.data.id)}
                  />
                </div>
              </div>
            </div>
          );

        // 🔸 Ad Card (Matching Light Card Style)
        if (item.type === "ad")
          return (
            <div
              key={item.id}
              // Wrapper for Gradient Border and Premium Hover Effect
              className="
                p-[2px] rounded-2xl shadow-xl transition-all duration-500 
                hover:scale-[1.03] 
                bg-gradient-to-r from-green-800 via-purple-500 to-red-500
              "
            >
              <div
                className="
                  // Changed to white/light background
                  bg-[#FFFAF5] rounded-2xl p-5 flex flex-col justify-between h-full 
                  transition-all duration-300 
                  shadow-lg shadow-gray-700/10
                "
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-green-800 flex items-center gap-2 text-lg">
                    📢 Advertisement
                  </p>
                  <span className="text-xs text-gray-500">Sponsored</span>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <NativeAdWeb />
                </div>
              </div>
            </div>
          );

        return null;
      })}
    </div>
  )}
</div>


       

        {/* Floating Action Button */}
        <div className="fixed bottom-32 right-8 cursor-pointer z-[1000] drop-shadow-xl shadow-green-800/50" onClick={() => navigate("/newusers")}>
          <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#FF512F] to-[#DD2476] flex items-center justify-center text-white text-3xl font-light transition-all duration-400 ease-out hover:scale-110 hover:rotate-90 relative">
            <span className="z-10">+</span>
            {/* Pulse effect - requires custom animation in Tailwind config */}
            <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-[#FF512F]/60 to-[#DD2476]/60 animate-ping-slow z-0 opacity-60" />
          </div>
        </div>

        {/* Selection Toolbar */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#FFFAF5]/95 backdrop-blur-xl border-t border-pink-200 p-4 z-[1000]">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <span className="text-[#FF512F] text-base font-bold flex items-center gap-2">
                <span className="bg-[#FF512F] text-white rounded-xl py-1 px-2.5 text-sm font-extrabold">{selectedItems.length}</span>
                {selectedItems.length === 1
                  ? " chat selected"
                  : " chats selected"}
              </span>
              <div className="flex gap-3">
                <button className="bg-transparent text-gray-600 border border-gray-300 py-2.5 px-5 rounded-xl font-semibold cursor-pointer transition-all hover:bg-gray-50" onClick={deSelectItems}>
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-green-800 to-orange-500 text-white py-2.5 px-5 rounded-xl font-bold cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg hover:shadow-xl shadow-green-800/50"
                  onClick={handleDeleteChat}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

