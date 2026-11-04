import React, { useState, useEffect } from "react";
import { FaCoins, FaGem } from 'react-icons/fa';
import { supabase } from '../firebase/supabaseClient';
import { auth } from '../firebase/config'; // Firebase auth import karen
import {
  IoMenu,
  IoFlameOutline,
  IoChatbubbleOutline,
  IoNotificationsOutline,
  IoClose,
  IoHome,
  IoLogOut,
} from "react-icons/io5";
import { MdWorkspacePremium } from "react-icons/md";
import { FaTheaterMasks } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { IoMdLock } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user data - Aapke existing code ke according
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const email = auth?.currentUser?.email;
      if (!email) {
        console.log("No user email found");
        return;
      }

      console.log("Fetching user data for email:", email);

      // 🔹 Initial fetch
      const { data, error } = await supabase
        .from("users")
        .select("name, email, about, avatar, issubscription, subscriptiondate, duration")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Supabase fetch error:", error.message);
        return;
      }

      console.log("User data fetched:", data);

      // 🔹 Convert avatar
      let avatarUrl = null;
      if (data.avatar) {
        avatarUrl = data.avatar.startsWith("http")
          ? data.avatar
          : supabase.storage.from("avatars").getPublicUrl(data.avatar).data.publicUrl;
      }

      // 🔹 Set user data
      setUserData({
        ...data,
        avatar: avatarUrl,
      });

      // 🔹 Realtime subscription
      const subscription = supabase
        .channel("users-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
            filter: `email=eq.${email}`,
          },
          (payload) => {
            if (payload.new) {
              let updatedAvatar = null;
              if (payload.new.avatar) {
                updatedAvatar = payload.new.avatar.startsWith("http")
                  ? payload.new.avatar
                  : supabase.storage.from("avatars").getPublicUrl(payload.new.avatar).data.publicUrl;
              }

              setUserData({
                ...payload.new,
                avatar: updatedAvatar,
              });
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };

    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Keep tab active based on route
  useEffect(() => {
    if (location.pathname === "/chatsAndChat") {
      setActiveTab("messages");
    } else if (location.pathname === "/discover") {
      setActiveTab("discover");
    }
  }, [location]);

  const tabs = [
    { id: "discover", label: "Discover", icon: IoFlameOutline },
    { id: "messages", label: "Messages", icon: IoChatbubbleOutline },
  ];

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "discover") navigate("/discover");
    if (tabId === "messages") navigate("/chatsAndChat");
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Close drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userData?.email) {
      return userData.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get subscription status text
  const getSubscriptionStatus = () => {
    return userData?.isSubscription ? "Premium User" : "Free User";
  };

  return (
    <>
      {/* Main Header - Pink Background */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-green-800 backdrop-blur-md border-b border-green-800 shadow-lg"
            : "bg-green-800 border-b border-green-800"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDrawer}
              className="text-white hover:text-green-800 text-2xl p-2 rounded-lg hover:bg-green-800 transition-all duration-200"
            >
              <IoMenu />
            </button>
            <h1 className="text-2xl font-bold text-white">Hiddo</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-green-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#FFFAF5] text-green-800 shadow-sm"
                    : "text-white hover:text-green-800 hover:bg-pink-400"
                }`}
              >
                <tab.icon className="text-lg" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Coins */}
            <div className="flex items-center gap-2 bg-green-800 rounded-full px-3 py-2 border border-pink-400">
              <span className="text-yellow-300">🪙</span>
              
              <button className="ml-2 bg-[#FFFAF5] hover:bg-green-800 text-green-800 text-xs font-medium px-2 py-1 rounded transition-colors">
                Buy
              </button>
            </div>

            {/* Notification */}
            <button className="relative text-white hover:text-green-800 text-xl p-2 rounded-lg hover:bg-green-800 transition-colors">
              <IoNotificationsOutline />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Component - Pink Theme */}
      <div
        className={`fixed top-0 left-0 z-[60] h-screen w-80 bg-green-800 border-r border-green-800 transition-transform duration-300 shadow-xl ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-800">
          <h2 className="text-xl font-semibold text-white">Menu</h2>
          <button
            onClick={closeDrawer}
            className="text-white hover:text-green-800 p-1 rounded-lg hover:bg-green-800 transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4">
          <nav className="space-y-1">
           

           

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-800 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => navigate('/premiumPage')}
            >
              <MdWorkspacePremium className="w-5 h-5" />
              <span className="font-medium">Premium</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-800 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => navigate('/contactUs')}
            >
              <IoHome className="w-5 h-5" />
              <span className="font-medium">Contact Us</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-800 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => navigate('/blockedUsers')}
            >
              <ImBlocked className="w-5 h-5" />
              <span className="font-medium">Blocked Users</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-800 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => navigate('/terms')}
            >
              <FaTheaterMasks className="w-5 h-5" />
              <span className="font-medium">Terms</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-800 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => navigate('/privacy')}
            >
              <IoMdLock className="w-5 h-5" />
              <span className="font-medium">Privacy</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-800 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => navigate('/')}
            >
              <IoLogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-green-800">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            {userData?.avatar ? (
              <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={userData.avatar} 
                  alt={userData?.name || 'User'} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {getUserInitials()}
                </span>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-white">
                {userData?.name || userData?.email || 'User'}
              </p>
              <p className={`text-xs ${userData?.isSubscription ? 'text-yellow-300' : 'text-pink-200'}`}>
                {getSubscriptionStatus()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[55] backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Spacer for header */}
      <div className="h-16" />
    </>
  );
}