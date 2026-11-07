// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { auth } from "../../firebase/config";
// import { supabase } from "../../firebase/supabaseClient";
// import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router-dom";

// import { setTypingStatus } from "../Chat/setTypingStatus";
// import usePaidStickers from "../Chat/usePaidStickers";
// import Header from "../../page/Dashboard";
// import MainChat from "../Chat/MainChat";
// import ModernChatItem from "../Chat/ModernChatItem";
// import StickerPickerModal from "../Chat/StickerPickerModals";
// // import MainChat from "./MainChat";
// // import StickerPickerModal from "./StickerPickerModals";
// // import ModernChatItem from "./ModernChatItem";

// export default function ChatsAndChat() {
//   const navigate = useNavigate();
  
//   // ---------- Global states ----------
//   const [chats, setChats] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [newMessages, setNewMessages] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [refreshing, setRefreshing] = useState(false);

//   // Chat area states
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [isLoadingMessages, setIsLoadingMessages] = useState(true);
//   const [inputText, setInputText] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [showStickerPicker, setShowStickerPicker] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isChatDisabled, setIsChatDisabled] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);

//   // User balances
//   const [userGold, setUserGold] = useState(0);
//   const [userDiamond, setUserDiamond] = useState(0);

//   // Sticker states
//   const [selectedSticker, setSelectedSticker] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("gold");
//   const [timeLeft, setTimeLeft] = useState(60 * 60);

//   // responsive
//   const [isMobile, setIsMobile] = useState(false);
//   const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);

//   const messagesChannelRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const menuRef = useRef(null);
//   const pendingMessagesRef = useRef(new Set());
//   const chatsSubscriptionRef = useRef(null);

//   const currentEmail = auth?.currentUser?.email;
//   const { giftImages, loading: stickersLoading } = usePaidStickers();

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev <= 1 ? 60 * 60 : prev - 1));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // ✅ CALL FUNCTIONALITY
//   const initiateCall = async (isVideo = false) => {
//     try {
//       if (!activeChat) return alert("Please select a chat first");
//       if (isChatDisabled) return alert("You cannot call this user.");

//       const partner = activeChat.users?.find((u) => u.email !== currentEmail);
//       if (!partner) return alert("User information missing");

//       const callData = {
//         roomId: uuidv4(),
//         peerEmail: partner.email,
//         isVideoCall: isVideo,
//         isCaller: true,
//         isTypeJoin: false,
//         partnerName: partner.name || partner.email,
//         partnerAvatar: partner.avatar
//       };

//       console.log("Initiating call with data:", callData);
//       navigate('/callscreen', { state: callData });
//     } catch (error) {
//       console.error("Call initiation error:", error);
//       alert('Failed to start call. Please try again.');
//     }
//   };

//   const initiateVideoCall = async () => {
//     await initiateCall(true);
//   };

//   // Fetch user balances
//   useEffect(() => {
//     const fetchBalances = async () => {
//       if (!currentEmail) return;
//       try {
//         const { data } = await supabase.from("users").select("totalgold,totaldiamond").eq("email", currentEmail).single();
//         if (data) {
//           setUserGold(data.totalgold || 0);
//           setUserDiamond(data.totaldiamond || 0);
//         }
//       } catch (err) {
//         console.warn("fetchBalances err", err);
//       }
//     };
//     fetchBalances();
//   }, [currentEmail]);

//   // ---------------- Utilities ----------------
//   const getChatName = useCallback((chat) => {
//     if (!chat) return "Unknown";
//     if (chat.groupName) return chat.groupName;
//     const otherUser = chat.users?.find((u) => u.email !== currentEmail);
//     return otherUser?.name || otherUser?.email || "Unknown";
//   }, [currentEmail]);

//   const getSubtitle = useCallback((chat) => {
//     const lastMessage = chat.last_message;
//     if (!lastMessage) return "No messages yet";
//     if (lastMessage.text)
//       return lastMessage.text.length > 30
//         ? `${lastMessage.text.substring(0, 30)}...`
//         : lastMessage.text;
//     if (lastMessage.image) return "📷 Image";
//     if (lastMessage.audio) return "🎵 Audio";
//     return "Sent a message";
//   }, []);

//   const getSubtitle2 = useCallback((chat) => {
//     const last_updated = chat.last_updated;
//     if (!last_updated) return "";
//     const now = new Date();
//     const msgDate = new Date(last_updated);
//     const diffTime = Math.abs(now - msgDate);
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     if (diffDays === 0)
//       return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return msgDate.toLocaleDateString([], { weekday: "short" });
//     return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
//   }, []);

//   // ---------------- Responsive behavior detection ----------------
//   useEffect(() => {
//     const check = () => {
//       const small = window.innerWidth < 768;
//       setIsMobile(small);
//       setShowSidebarOnMobile(!small);
//     };
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // ---------------- Load chats ----------------
//   const loadChats = useCallback(async () => {
//     setLoadingChats(true);
//     try {
//       const storedMessages = localStorage.getItem("newMessages");
//       const unreadBuffer = storedMessages ? JSON.parse(storedMessages) : {};
//       setNewMessages(unreadBuffer);

//       const { data: chatsData, error: chatsError } = await supabase
//         .from("chats")
//         .select("*")
//         .contains("participants", [currentEmail])
//         .order("last_updated", { ascending: false });

//       if (chatsError) {
//         console.log("Error fetching chats:", chatsError.message || chatsError);
//         setChats([]);
//         setLoadingChats(false);
//         return;
//       }

//       const uniqueChatsData = chatsData?.filter((chat, index, self) => {
//         const firstIndex = self.findIndex(c => 
//           c.id === chat.id || 
//           JSON.stringify(c.participants?.sort()) === JSON.stringify(chat.participants?.sort())
//         );
//         return index === firstIndex;
//       }) || [];

//       const chatsWithAvatars = await Promise.all(
//         uniqueChatsData.map(async (chat) => {
//           const usersWithAvatars = await Promise.all(
//             (chat.users || []).map(async (user) => {
//               try {
//                 const { data: userData } = await supabase
//                   .from("users")
//                   .select("avatar, about, isactivestatus")
//                   .eq("email", user.email)
//                   .single();
//                 return {
//                   ...user,
//                   avatar: userData?.avatar ?? null,
//                   about: userData?.about ?? null,
//                   isactivestatus: userData?.isactivestatus ?? null,
//                 };
//               } catch {
//                 return { ...user, avatar: null };
//               }
//             })
//           );
          
//           const uniqueUsers = usersWithAvatars.filter((user, index, self) =>
//             index === self.findIndex((u) => u.email === user.email)
//           );
          
//           return { ...chat, users: uniqueUsers };
//         })
//       );

//       setChats(chatsWithAvatars);
//     } catch (err) {
//       console.error("❌ Error loading chats:", err);
//       setChats([]);
//     } finally {
//       setLoadingChats(false);
//     }
//   }, [currentEmail]);

//   // Setup real-time subscription for chats
//   useEffect(() => {
//     if (!currentEmail) return;

//     if (chatsSubscriptionRef.current) {
//       supabase.removeChannel(chatsSubscriptionRef.current);
//     }

//     const channel = supabase
//       .channel('chats_changes')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'chats', filter: `participants=cs.{"${currentEmail}"}` },
//         (payload) => {
//           console.log('🔄 Chats real-time update:', payload);
//           loadChats();
//         }
//       )
//       .subscribe();

//     chatsSubscriptionRef.current = channel;

//     return () => {
//       if (chatsSubscriptionRef.current) {
//         supabase.removeChannel(chatsSubscriptionRef.current);
//       }
//     };
//   }, [currentEmail, loadChats]);

//   useEffect(() => {
//     loadChats();
//   }, [loadChats]);

//   // ---------------- Chat selection & messages load ----------------
//   const cleanupMessagesChannel = () => {
//     if (messagesChannelRef.current) {
//       try { supabase.removeChannel(messagesChannelRef.current); } catch (e) {}
//       messagesChannelRef.current = null;
//     }
//   };

//   const loadMessagesForChat = useCallback(async (chat) => {
//     if (!chat) return;
//     const chatId = chat.id;
//     setIsLoadingMessages(true);
//     cleanupMessagesChannel();

//     try {
//       const { data, error } = await supabase
//         .from("chat_messages")
//         .select("id, chat_id, user_email, message, created_at")
//         .eq("chat_id", chatId)
//         .order("created_at", { ascending: true });

//       if (error) {
//         setMessages([]);
//         setIsLoadingMessages(false);
//         return;
//       }

//       const normalized = (data || []).map((d) => ({
//         _id: d.id || uuidv4(),
//         createdAt: d.message?.createdAt || d.created_at || new Date().toISOString(),
//         text: d.message?.text ?? null,
//         image: d.message?.image ?? null,
//         video: d.message?.video ?? null,
//         status: "sent",
//         user: { _id: d.user_email, name: d.user_email },
//       }));

//       setMessages(normalized);
//     } catch (err) {
//       setMessages([]);
//     } finally {
//       setIsLoadingMessages(false);
//     }

//     // Real-time messages
//     try {
//       const channel = supabase
//         .channel(`chat_messages_${chatId}`)
//         .on('postgres_changes', 
//           { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatId}` },
//           (payload) => {
//             try {
//               const d = payload.new;
//               const msgObj = d.message || {};
//               const messageId = d.id || msgObj._id || uuidv4();

//               if (pendingMessagesRef.current.has(messageId)) return;
//               if (d.user_email === currentEmail) return;

//               const normalized = {
//                 _id: messageId,
//                 createdAt: msgObj.createdAt || new Date().toISOString(),
//                 text: msgObj.text ?? null,
//                 image: msgObj.image ?? null,
//                 video: msgObj.video ?? null,
//                 status: "sent",
//                 user: { _id: d.user_email, name: d.user_email },
//               };

//               setMessages((prev) => {
//                 const exists = prev.some(m => m._id === normalized._id);
//                 if (exists) return prev;
//                 return [...prev, normalized];
//               });
//             } catch (err) {
//               console.error('Real-time message error:', err);
//             }
//           }
//         )
//         .subscribe();

//       messagesChannelRef.current = channel;
//     } catch (err) {
//       console.warn("Realtime subscription error:", err);
//     }
//   }, [currentEmail]);

//   useEffect(() => {
//     if (activeChat) {
//       loadMessagesForChat(activeChat);
//       const updated = { ...newMessages };
//       delete updated[activeChat.id];
//       localStorage.setItem("newMessages", JSON.stringify(updated));
//       setNewMessages(updated);
//       if (isMobile) setShowSidebarOnMobile(false);
//     } else {
//       cleanupMessagesChannel();
//       setMessages([]);
//     }
//   }, [activeChat, isMobile]);

//   useEffect(() => {
//     return () => {
//       cleanupMessagesChannel();
//       if (chatsSubscriptionRef.current) supabase.removeChannel(chatsSubscriptionRef.current);
//     };
//   }, []);

//   // ---------------- send message & media ----------------
//   const sendMessage = async (chatIdParam, text) => {
//     if (!chatIdParam || !currentEmail || !text.trim()) return;
//     const nowISO = new Date().toISOString();
//     const messageId = uuidv4();
//     pendingMessagesRef.current.add(messageId);

//     const optimistic = {
//       _id: messageId,
//       createdAt: nowISO,
//       text: text.trim(),
//       status: "sending",
//       user: { _id: currentEmail, name: auth.currentUser?.displayName || currentEmail, avatar: auth.currentUser?.photoURL || null },
//     };
    
//     setMessages((prev) => [...prev, optimistic]);
//     setInputText("");
//     setIsTyping(false);

//     try {
//       const { error } = await supabase.from("chat_messages").insert([
//         { chat_id: chatIdParam, user_email: currentEmail, message: optimistic },
//       ]);
//       if (error) throw error;

//       await supabase.from("chats").update({ last_message: text.trim(), last_updated: new Date().toISOString() }).eq("id", chatIdParam);
//       setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status: "sent" } : m)));
//       loadChats();
//     } catch (err) {
//       setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status: "failed" } : m)));
//       alert("Failed to send message");
//     } finally {
//       pendingMessagesRef.current.delete(messageId);
//     }
//   };

//   const handleSendMessage = () => {
//     if (!inputText.trim() || !activeChat) return;
//     sendMessage(activeChat.id, inputText.trim());
//   };

//   const pickMedia = useCallback(async () => {
//     if (!activeChat) return alert("Select chat first");
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*,video/*,image/gif";
//     input.onchange = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;
//       let type = "image";
//       if (file.type.startsWith("video")) type = "video";
//       await handleMediaUpload(activeChat.id, file, type);
//     };
//     input.click();
//   }, [activeChat]);

//   const handleMediaUpload = async (chatIdParam, file, type) => {
//     try {
//       setUploading(true);
//       const isGif = file.type === "image/gif";
//       const ext = isGif ? "gif" : (file.name.split(".").pop() || (type === "video" ? "mp4" : "jpg"));
//       const folder = type === "video" ? "videos" : "images";
//       const filePath = `${currentEmail}/${folder}/${Date.now()}.${ext}`;

//       const { error: uploadError } = await supabase.storage.from("chat_messages").upload(filePath, file, { contentType: file.type });
//       if (uploadError) throw uploadError;

//       const { data: publicUrlData } = supabase.storage.from("chat_messages").getPublicUrl(filePath);
//       const publicUrl = publicUrlData?.publicUrl;
//       if (!publicUrl) throw new Error("No public URL");

//       await sendMessageWithMedia(chatIdParam, publicUrl, isGif ? "image" : type);
//     } catch (err) {
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const sendMessageWithMedia = async (chatIdParam, mediaUrl, type) => {
//     if (!chatIdParam || !currentEmail) return;
//     const messageId = uuidv4();
//     const nowISO = new Date().toISOString();
//     pendingMessagesRef.current.add(messageId);

//     const msg = {
//       _id: messageId,
//       createdAt: nowISO,
//       text: null,
//       [type]: mediaUrl,
//       type,
//       status: "sending",
//       user: { _id: currentEmail, name: auth.currentUser?.displayName || currentEmail, avatar: auth.currentUser?.photoURL || null },
//     };

//     setMessages((prev) => [...prev, msg]);

//     try {
//       const { error } = await supabase.from("chat_messages").insert([{ chat_id: chatIdParam, user_email: currentEmail, message: msg }]);
//       if (error) throw error;

//       setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status: "sent" } : m)));
//     } catch (err) {
//       setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status: "failed" } : m)));
//       alert("Failed to send media");
//     } finally {
//       pendingMessagesRef.current.delete(messageId);
//     }
//   };

//   // ---------------- sticker/gift handling ----------------
//   const handleSendSticker = async () => {
//     if (!selectedSticker || !activeChat) return;
//     try {
//       const { data: userData } = await supabase.from("users").select("totalgold,totaldiamond").eq("email", currentEmail).single();
//       const cost = (selectedSticker.coins || 0) * quantity;
//       const isGold = activeTab === "gold";
//       const currentBalance = isGold ? userData?.totalgold || 0 : userData?.totaldiamond || 0;
//       if (cost > currentBalance) return alert(`Insufficient ${isGold ? "Gold" : "Diamond"} Coins`);
      
//       const updateField = isGold ? { totalgold: currentBalance - cost } : { totaldiamond: currentBalance - cost };
//       await supabase.from("users").update(updateField).eq("email", currentEmail);
      
//       if (isGold) setUserGold(currentBalance - cost);
//       else setUserDiamond(currentBalance - cost);
      
//       await sendMessageWithMedia(activeChat.id, selectedSticker.imageUrl, "image");
//       closeStickerModal();
//     } catch (err) {
//       alert("Failed to send gift");
//     }
//   };

//   const closeStickerModal = () => {
//     setShowStickerPicker(false);
//     setSelectedSticker(null);
//     setQuantity(1);
//   };

//   // ---------------- typing indicator ----------------
//   const handleChangeText = (value) => {
//     setInputText(value);
//     if (!activeChat || !currentEmail) return;
//     setIsTyping(true);
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
//   };

//   // ---------------- BLOCK/UNBLOCK ----------------
//   const handleBlockToggle = async () => {
//     if (!currentEmail || !activeChat) return alert("Missing data");
//     const partner = activeChat.users?.find((u) => u.email !== currentEmail);
//     if (!partner) return;

//     try {
//       const { data: blockData } = await supabase.from("blockusers").select("TotalBlockUser").eq("email", currentEmail).single();
//       let currentBlockList = Array.isArray(blockData?.TotalBlockUser) ? blockData.TotalBlockUser : [];
//       const isCurrentlyBlocked = currentBlockList.some(user => user.email === partner.email);

//       let updatedList;
//       if (isCurrentlyBlocked) {
//         updatedList = currentBlockList.filter((u) => u.email !== partner.email);
//       } else {
//         updatedList = [...currentBlockList, { isblock: true, email: partner.email, name: partner.name, blocked_at: new Date().toISOString() }];
//       }

//       const { error } = await supabase.from("blockusers").upsert({ email: currentEmail, TotalBlockUser: updatedList });
//       if (error) throw error;

//       setIsBlocked(!isCurrentlyBlocked);
//       setIsChatDisabled(!isCurrentlyBlocked);
//       setShowMenu(false);
//       alert(`User ${!isCurrentlyBlocked ? 'blocked' : 'unblocked'} successfully`);
//     } catch (err) {
//       alert("Error updating block status");
//     }
//   };

//   // ---------------- CLEAR CHAT ----------------
//   const handleClearChat = async () => {
//     if (!activeChat || !currentEmail) return;
//     if (!window.confirm("Are you sure you want to clear this chat? This will delete all messages permanently.")) return;
    
//     try {
//       const { error } = await supabase.from("chat_messages").delete().eq("chat_id", activeChat.id);
//       if (error) throw error;

//       setMessages([]);
//       await supabase.from("chats").update({ last_message: "", last_updated: new Date().toISOString() }).eq("id", activeChat.id);
//       setShowMenu(false);
//       alert("Chat cleared successfully");
//     } catch (err) {
//       alert("Failed to clear chat");
//     }
//   };

//   // Check block status when active chat changes
//   useEffect(() => {
//     const checkBlockStatus = async () => {
//       if (!activeChat || !currentEmail) return;
//       const partner = activeChat.users?.find((u) => u.email !== currentEmail);
//       if (!partner) return;

//       try {
//         const { data: myBlockData } = await supabase.from("blockusers").select("TotalBlockUser").eq("email", currentEmail).single();
//         const iBlockedThem = Array.isArray(myBlockData?.TotalBlockUser) ? myBlockData.TotalBlockUser.some((u) => u.email === partner.email) : false;

//         const { data: partnerBlockData } = await supabase.from("blockusers").select("TotalBlockUser").eq("email", partner.email).single();
//         const theyBlockedMe = Array.isArray(partnerBlockData?.TotalBlockUser) ? partnerBlockData.TotalBlockUser.some((u) => u.email === currentEmail) : false;

//         setIsBlocked(iBlockedThem);
//         setIsChatDisabled(iBlockedThem || theyBlockedMe);
//       } catch (err) {
//         console.error("Block status check error:", err);
//       }
//     };
//     checkBlockStatus();
//   }, [activeChat, currentEmail]);

//   // monitor outside clicks for menu
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ---------------- search & filtered list ----------------
//   const filteredChats = chats
//     .filter((chat, index, self) => {
//       const firstIndex = self.findIndex(c => 
//         c.id === chat.id || JSON.stringify(c.participants?.sort()) === JSON.stringify(chat.participants?.sort())
//       );
//       return index === firstIndex;
//     })
//     .filter((chat) => {
//       const name = (getChatName(chat) || "").toLowerCase();
//       const subtitle = (getSubtitle(chat) || "").toLowerCase();
//       const q = searchQuery.toLowerCase();
//       const matchesSearch = !q || name.includes(q) || subtitle.includes(q);
//       const matchesFilter = activeFilter === "all" ? true : activeFilter === "unread" ? (newMessages[chat.id] || 0) > 0 : true;
//       return matchesSearch && matchesFilter;
//     });

//   // ---------------- selection for delete ----------------
//   const selectItems = (chat) =>
//     setSelectedItems((prev) => (prev.includes(chat.id) ? prev.filter((id) => id !== chat.id) : [...prev, chat.id]));
//   const deSelectItems = () => setSelectedItems([]);

//   const deleteSelectedChats = async () => {
//     if (!selectedItems.length) return;
//     try {
//       const email = currentEmail;
//       const deletePromises = selectedItems.map(async (chatId) => {
//         await supabase.from("deletedchats").upsert({ user_email: email, chat_id: chatId }, { onConflict: "user_email,chat_id" });
//         const { data: chatData } = await supabase.from("chats").select("participants").eq("id", chatId).single();
//         const { data: deletedUsers } = await supabase.from("deletedchats").select("user_email").eq("chat_id", chatId);
//         if (chatData.participants.every((p) => deletedUsers?.some((d) => d.user_email === p))) {
//           await supabase.from("chats").delete().eq("id", chatId);
//         }
//       });
//       await Promise.all(deletePromises);
//       deSelectItems();
//       loadChats();
//     } catch (err) {
//       console.error("Error deleting chat:", err);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadChats();
//     setTimeout(() => setRefreshing(false), 900);
//   }, [loadChats]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ---------------- final UI ----------------
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900"> {/* Background white/gray */}
//       <Header />
      
//       <div className="max-w-[1400px] mx-auto h-[calc(100vh-80px)] flex">
//         {/* LEFT: Sidebar */}
//         <aside
//           className={`w-80 bg-[#FFFAF5] border-r border-gray-200 transition-all z-30 shadow-sm
//             ${isMobile ? (showSidebarOnMobile ? "block absolute left-0 top-0 bottom-0" : "hidden") : "block"}
//           `}
//           style={{ minWidth: 320 }}
//         >
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200 bg-[#FFFAF5]">
//             <div className="flex items-center justify-between">
//               <h1 className="text-xl font-bold text-gray-800">Messages</h1>
//               <button onClick={onRefresh} className="p-2 bg-pink-50 text-green-800 hover:bg-green-800 rounded-lg transition-all duration-300 text-sm font-semibold border border-green-800">
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="p-4 border-b border-gray-200 bg-[#FFFAF5]">
//             <div className="relative">
//               <input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search conversations..."
//                 className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 text-sm border border-gray-200 focus:border-green-800 focus:outline-none focus:ring-1 focus:ring-green-800 transition-all"
//               />
//             </div>
//           </div>

//           {/* Filter Tabs */}
//           <div className="p-4 border-b border-gray-200 bg-[#FFFAF5]">
//             <div className="flex gap-2">
//               {["all", "unread"].map((f) => (
//                 <button
//                   key={f}
//                   onClick={() => setActiveFilter(f)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                     activeFilter === f ? "bg-green-800 text-white shadow-md shadow-pink-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {f === "all" ? "All" : "Unread"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Chat List */}
//           <div className="overflow-y-auto bg-[#FFFAF5]" style={{ height: "calc(100% - 200px)" }} onClick={() => deSelectItems()}>
//             {loadingChats ? (
//               <div className="space-y-3 p-4">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
//                     <div className="w-12 h-12 rounded-lg bg-gray-200" />
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-gray-200 rounded w-3/4" />
//                       <div className="h-3 bg-gray-200 rounded w-1/2" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : filteredChats.length === 0 ? (
//               <div className="flex flex-col items-center justify-center text-center py-12 px-6">
//                 <div className="text-4xl mb-3">💬</div>
//                 <div className="text-gray-400 text-sm">No conversations yet</div>
//               </div>
//             ) : (
//               <div className="space-y-1 p-2">
//                 {filteredChats.map((chat) => (
//                   <ModernChatItem 
//                     key={chat.id} 
//                     chat={chat} 
//                     isSelected={selectedItems.includes(chat.id)}
//                     currentEmail={currentEmail}
//                     selectItems={selectItems}
//                     setActiveChat={setActiveChat}
//                     selectedItems={selectedItems}
//                     newMessages={newMessages}
//                     getChatName={getChatName}
//                     getSubtitle={getSubtitle}
//                     getSubtitle2={getSubtitle2}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </aside>

//         {/* RIGHT: Chat area */}
//         <MainChat
//           activeChat={activeChat}
//           setActiveChat={setActiveChat}
//           showSidebarOnMobile={showSidebarOnMobile}
//           isMobile={isMobile}
//           setShowSidebarOnMobile={setShowSidebarOnMobile}
//           currentEmail={currentEmail}
//           isTyping={isTyping}
//           initiateCall={initiateCall}
//           initiateVideoCall={initiateVideoCall}
//           setShowStickerPicker={setShowStickerPicker}
//           isChatDisabled={isChatDisabled}
//           showMenu={showMenu}
//           setShowMenu={setShowMenu}
//           menuRef={menuRef}
//           handleBlockToggle={handleBlockToggle}
//           isBlocked={isBlocked}
//           handleClearChat={handleClearChat}
//           getChatName={getChatName}
//           isLoadingMessages={isLoadingMessages}
//           messages={messages}
//           messagesEndRef={messagesEndRef}
//           pickMedia={pickMedia}
//           uploading={uploading}
//           inputText={inputText}
//           handleChangeText={handleChangeText}
//           handleSendMessage={handleSendMessage}
//         />
//       </div>

//       {/* Modals */}
//       {showStickerPicker && (
//         <StickerPickerModal
//           closeStickerModal={closeStickerModal}
//           timeLeft={timeLeft}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           userDiamond={userDiamond}
//           userGold={userGold}
//           stickersLoading={stickersLoading}
//           giftImages={giftImages}
//           selectedSticker={selectedSticker}
//           setSelectedSticker={setSelectedSticker}
//           quantity={quantity}
//           setQuantity={setQuantity}
//           handleSendSticker={handleSendSticker}
//           isChatDisabled={isChatDisabled}
//           activeChat={activeChat}
//           getChatName={getChatName}
//         />
//       )}

//       {/* Selection toolbar */}
//       {selectedItems.length > 0 && (
//         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#FFFAF5] text-gray-800 rounded-lg p-4 z-50 shadow-2xl border border-gray-200">
//           <div className="flex items-center justify-between gap-4">
//             <div className="text-sm font-semibold">{selectedItems.length} selected</div>
//             <div className="flex gap-2">
//               <button onClick={() => setSelectedItems([])} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium">
//                 Cancel
//               </button>
//               <button onClick={deleteSelectedChats} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-semibold">
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import Header from "../../page/Dashboard";
import MainChat from "../Chat/MainChat";
import ModernChatItem from "../Chat/ModernChatItem";
import StickerPickerModal from "../Chat/StickerPickerModals";

// ✅ Socket.IO connection (Backend URL)
const socket = io("https://omnigive-global.onrender.com");

export default function ChatsAndChat() {
  const navigate = useNavigate();
  
  // ---------- Global states ----------
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Chat area states
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // User balances
  const [userGold, setUserGold] = useState(0);
  const [userDiamond, setUserDiamond] = useState(0);

  // ✅ Proposal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalReceiver, setProposalReceiver] = useState(null);
  const [ringType, setRingType] = useState("Gold Ring");

  // Sticker states
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("gold");
  const [timeLeft, setTimeLeft] = useState(60 * 60);

  // responsive
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  // ✅ Fetch chats from backend
  const loadChats = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingChats(true);
    try {
      // Fetch users from discover API (jo chat list banayenge)
      const res = await fetch("https://omnigive-global.onrender.com/api/looking/discover", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.users) {
        const formattedChats = data.users.map((user) => ({
          _id: user._id,
          otherUser: user,
          lastMessage: "Say hi! 👋",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
        }));
        setChats(formattedChats);
      }
    } catch (err) {
      console.error("Error loading chats:", err);
    } finally {
      setLoadingChats(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // ✅ Fetch user balances
  useEffect(() => {
    if (!token) return;
    fetch("https://omnigive-global.onrender.com/api/gift/my-balance", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserGold(data.goldCoins || 0);
        setUserDiamond(data.diamondCoins || 0);
      })
      .catch((err) => console.error("Balance fetch error:", err));
  }, [token]);

  // ✅ Socket.IO listeners
  useEffect(() => {
    if (!currentUser?.id) return;

    socket.emit("addUser", currentUser.id);

    socket.on("getMessage", (newMessage) => {
      const msgSenderId = newMessage.senderId.toString();
      const msgReceiverId = newMessage.receiverId.toString();
      const myId = currentUser.id.toString();
      const partnerId = activeChat?.otherUser?._id?.toString();

      if (!partnerId) return;

      if (
        (msgSenderId === partnerId && msgReceiverId === myId) ||
        (msgSenderId === myId && msgReceiverId === partnerId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("messageSent", (newMessage) => {
      setMessages((prev) => {
        const filtered = prev.filter(m => m._id !== newMessage._id);
        return [...filtered, newMessage];
      });
    });

    return () => {
      socket.off("getMessage");
      socket.off("messageSent");
    };
  }, [currentUser?.id, activeChat]);

  // ✅ Load messages when chat is selected
  const loadMessagesForChat = useCallback(async (chat) => {
    if (!chat?.otherUser?._id) return;
    setIsLoadingMessages(true);

    try {
      const res = await fetch(`https://omnigive-global.onrender.com/api/chat/${chat.otherUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeChat) {
      loadMessagesForChat(activeChat);
      if (isMobile) setShowSidebarOnMobile(false);
    } else {
      setMessages([]);
    }
  }, [activeChat, isMobile, loadMessagesForChat]);

  // ✅ Send message via Socket.IO
  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat?.otherUser?._id) return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: activeChat.otherUser._id,
      message: inputText.trim(),
    };

    socket.emit("sendMessage", messageData);
    
    const tempMessage = {
      _id: uuidv4(),
      senderId: currentUser.id,
      receiverId: activeChat.otherUser._id,
      message: inputText.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInputText("");
    setIsTyping(false);
  };

  const handleChangeText = (value) => {
    setInputText(value);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
  };

  // ✅ Send Gift
  const handleSendSticker = async () => {
    if (!selectedSticker || !activeChat) return;

    if (userGold < selectedSticker.price) {
      alert("Insufficient coins!");
      return;
    }

    try {
      const res = await fetch("https://omnigive-global.onrender.com/api/gift/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: activeChat.otherUser._id,
          giftId: selectedSticker._id,
          message: "Enjoy your gift!",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserGold(data.newBalance);
        const giftMessage = `[GIFT] ${selectedSticker.imageUrl} - ${selectedSticker.name}`;
        socket.emit("sendMessage", {
          senderId: currentUser.id,
          receiverId: activeChat.otherUser._id,
          message: giftMessage,
        });
        const tempMsg = {
          _id: uuidv4(),
          senderId: currentUser.id,
          receiverId: activeChat.otherUser._id,
          message: giftMessage,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMsg]);
        closeStickerModal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const closeStickerModal = () => {
    setShowStickerPicker(false);
    setSelectedSticker(null);
    setQuantity(1);
  };

  // ✅ Send Proposal
  const sendProposal = async () => {
    if (!proposalReceiver) return;
    try {
      const res = await fetch("https://omnigive-global.onrender.com/api/proposal/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: proposalReceiver._id,
          ringType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Proposal sent to ${proposalReceiver.name}! 💖`);
        setShowProposalModal(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  // ✅ Call Functions
  const initiateCall = (isVideo = false) => {
    if (!activeChat) return alert("Please select a chat first");
    navigate("/voicecall/" + activeChat.otherUser._id, { state: { user: activeChat.otherUser } });
  };

  const initiateVideoCall = () => {
    if (!activeChat) return alert("Please select a chat first");
    navigate("/videocall/" + activeChat.otherUser._id, { state: { user: activeChat.otherUser } });
  };

  // Responsive check
  useEffect(() => {
    const check = () => {
      const small = window.innerWidth < 768;
      setIsMobile(small);
      setShowSidebarOnMobile(!small);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 60 * 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter chats
  const filteredChats = chats.filter((chat) => {
    const name = chat.otherUser?.name?.toLowerCase() || "";
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-80px)] flex">
        
        {/* LEFT: Sidebar */}
        <aside
          className={`w-80 bg-[#FFFAF5] border-r border-gray-200 transition-all z-30 shadow-sm
            ${isMobile ? (showSidebarOnMobile ? "block absolute left-0 top-0 bottom-0" : "hidden") : "block"}
          `}
          style={{ minWidth: 320 }}
        >
          <div className="p-4 border-b border-gray-200 bg-[#FFFAF5]">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
              <button 
                onClick={loadChats} 
                className="p-2 bg-pink-50 text-green-800 hover:bg-green-800 rounded-lg transition-all"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 bg-[#FFFAF5]">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 text-sm border border-gray-200 focus:border-green-800 focus:outline-none"
            />
          </div>

          <div className="p-4 border-b border-gray-200 bg-[#FFFAF5]">
            <div className="flex gap-2">
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === f ? "bg-green-800 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f === "all" ? "All" : "Unread"}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto bg-[#FFFAF5]" style={{ height: "calc(100% - 200px)" }}>
            {loadingChats ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-12 h-12 rounded-lg bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                <div className="text-4xl mb-3">💬</div>
                <div className="text-gray-400 text-sm">No conversations yet</div>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => setActiveChat(chat)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                      activeChat?._id === chat._id ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-green-800 flex items-center justify-center text-white font-bold">
                      {chat.otherUser?.profilePic ? (
                        <img 
                          src={`https://omnigive-global.onrender.com${chat.otherUser.profilePic}`} 
                          alt={chat.otherUser.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        chat.otherUser?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{chat.otherUser?.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-[#FFFAF5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobile && (
                    <button onClick={() => setShowSidebarOnMobile(true)} className="p-2">
                      ←
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-green-800 flex items-center justify-center text-white font-bold">
                    {activeChat.otherUser?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{activeChat.otherUser?.name}</h2>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => initiateCall(false)} className="p-2 text-green-800 hover:bg-green-50 rounded-full">
                    📞
                  </button>
                  <button onClick={() => initiateVideoCall()} className="p-2 text-green-800 hover:bg-green-50 rounded-full">
                    📹
                  </button>
                  <button 
                    onClick={() => { setProposalReceiver(activeChat.otherUser); setShowProposalModal(true); }} 
                    className="p-2 text-pink-600 hover:bg-pink-50 rounded-full"
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">
                    No messages yet. Say hi! 👋
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isSelf = msg.senderId?.toString() === currentUser?.id?.toString();
                    const isGift = msg.message?.startsWith("[GIFT]");
                    
                    return (
                      <div key={msg._id || idx} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] p-3 rounded-xl ${
                          isSelf ? "bg-green-800 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none shadow"
                        }`}>
                          {isGift ? (
                            <div className="text-center">
                              <p className="text-xs font-bold mb-1">🎁 GIFT</p>
                              <img 
                                src={msg.message.split(" - ")[0].replace("[GIFT] ", "")} 
                                alt="Gift" 
                                className="w-16 h-16 object-contain mx-auto" 
                              />
                              <p className="text-xs mt-1">{msg.message.split(" - ")[1]}</p>
                            </div>
                          ) : (
                            <p className="text-sm">{msg.message}</p>
                          )}
                          <p className={`text-xs mt-1 ${isSelf ? "text-white/60" : "text-gray-400"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-[#FFFAF5] flex items-center gap-2">
                <button onClick={() => setShowStickerPicker(true)} className="p-2 text-green-800 hover:bg-green-50 rounded-full">
                  🎁
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => handleChangeText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-800"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 bg-green-800 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>

      {/* Sticker Modal */}
      {showStickerPicker && (
        <StickerPickerModal
          onClose={closeStickerModal}
          onSend={handleSendSticker}
          userGold={userGold}
          userDiamond={userDiamond}
        />
      )}

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Propose to {proposalReceiver?.name}</h2>
            <div className="space-y-3 mb-6">
              {[
                { name: "Gold Ring", price: 500, icon: "🥇" },
                { name: "Diamond Ring", price: 2000, icon: "💎" },
                { name: "Platinum Ring", price: 5000, icon: "💍" },
              ].map((ring) => (
                <div
                  key={ring.name}
                  onClick={() => setRingType(ring.name)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center ${
                    ringType === ring.name ? "border-pink-600 bg-pink-50" : "border-gray-200"
                  }`}
                >
                  <span className="text-3xl">{ring.icon}</span>
                  <div>
                    <p className="font-bold">{ring.name}</p>
                    <p className="text-sm text-yellow-600">🪙 {ring.price}</p>
                  </div>
                  {ringType === ring.name && <Heart className="text-pink-600" />}
                </div>
              ))}
            </div>
            <button
              onClick={sendProposal}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold"
            >
              Send Proposal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}