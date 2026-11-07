


import React, { useState, useEffect } from "react";
import { 
  IoMenu, 
  IoFlameOutline, 
  IoChatbubbleOutline, 
  IoNotificationsOutline, 
  IoClose, 
  IoHome, 
  IoLogOut,
  IoHeartOutline,
  IoLockClosedOutline
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

  // ✅ Fetch user data from localStorage (JWT based)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Keep tab active based on route
  useEffect(() => {
    if (location.pathname === "/chatsAndChat") {
      setActiveTab("messages");
    } else if (location.pathname === "/discover") {
      setActiveTab("discover");
    } else if (location.pathname === "/who-liked-me") {
      setActiveTab("likes");
    }
  }, [location]);

  const tabs = [
    { id: "discover", label: "Discover", icon: IoFlameOutline, path: "/discover" },
    { id: "messages", label: "Messages", icon: IoChatbubbleOutline, path: "/chatsAndChat" },
    { id: "likes", label: "Likes", icon: IoHeartOutline, path: "/who-liked-me" },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-green-800 backdrop-blur-md border-b border-green-700 shadow-lg"
            : "bg-green-800 border-b border-green-700"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          
          {/* Left Section: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDrawer}
              className="text-white hover:text-green-200 text-2xl p-2 rounded-lg transition-all"
            >
              <IoMenu />
            </button>
            <h1 className="text-2xl font-bold text-white">OmniGive</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-green-900/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#FFFAF5] text-green-800 shadow-sm"
                    : "text-white hover:text-green-200 hover:bg-green-800"
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
            <div className="flex items-center gap-2 bg-green-900/50 rounded-full px-3 py-2 border border-green-700">
              <span className="text-yellow-300">🪙</span>
              <span className="text-white text-sm font-bold">
                {userData?.goldCoins || 0}
              </span>
              <button 
                onClick={() => navigate('/premiumPage')}
                className="ml-2 bg-[#FFFAF5] hover:bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded transition-colors"
              >
                Buy
              </button>
            </div>

            {/* Notification */}
            <button className="relative text-white hover:text-green-200 text-xl p-2 rounded-lg transition-colors">
              <IoNotificationsOutline />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Component */}
      <div
        className={`fixed top-0 left-0 z-[60] h-screen w-80 bg-green-800 border-r border-green-700 transition-transform duration-300 shadow-xl ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-700">
          <h2 className="text-xl font-semibold text-white">Menu</h2>
          <button
            onClick={closeDrawer}
            className="text-white hover:text-green-200 p-1 rounded-lg transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
          <nav className="space-y-1">
            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/discover'); closeDrawer(); }}
            >
              <IoHome className="w-5 h-5" />
              <span className="font-medium">Discover</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/who-liked-me'); closeDrawer(); }}
            >
              <IoHeartOutline className="w-5 h-5" />
              <span className="font-medium">Who Liked Me</span>
            </button>

            {/* ✅ Anonymous Messages */}
            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/anonymous'); closeDrawer(); }}
            >
              <IoLockClosedOutline className="w-5 h-5" />
              <span className="font-medium">Anonymous Messages</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/premiumPage'); closeDrawer(); }}
            >
              <MdWorkspacePremium className="w-5 h-5" />
              <span className="font-medium">Premium</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/contactUs'); closeDrawer(); }}
            >
              <IoHome className="w-5 h-5" />
              <span className="font-medium">Contact Us</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/blockedUsers'); closeDrawer(); }}
            >
              <ImBlocked className="w-5 h-5" />
              <span className="font-medium">Blocked Users</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/terms'); closeDrawer(); }}
            >
              <FaTheaterMasks className="w-5 h-5" />
              <span className="font-medium">Terms</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-green-200 hover:bg-green-900/50 rounded-lg transition-colors w-full"
              onClick={() => { navigate('/privacy'); closeDrawer(); }}
            >
              <IoMdLock className="w-5 h-5" />
              <span className="font-medium">Privacy</span>
            </button>

            <button
              className="flex items-center gap-3 p-3 text-white hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors w-full"
              onClick={handleLogout}
            >
              <IoLogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-green-700 bg-green-800">
          <div className="flex items-center gap-3">
            {userData?.profilePic ? (
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://omnigive-global.onrender.com${userData.profilePic}`} 
                  alt={userData?.name || 'User'} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {getUserInitials()}
                </span>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-white">
                {userData?.name || 'User'}
              </p>
              <p className="text-xs text-green-200">
                {userData?.isPremium ? "Premium User" : "Free User"}
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