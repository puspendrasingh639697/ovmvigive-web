import React, { useState } from "react";
import { FaUserSlash, FaUnlock, FaShieldAlt, FaUsers, FaTrash } from "react-icons/fa";
import Footer from "../components/MainSrceen/Footer";

const BlockedUsers = () => {
  // ✅ Static Dummy Blocked Users Data
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, email: "spammer@example.com" },
    { id: 2, email: "fake_account@gmail.com" },
    { id: 3, email: "unknown_user@yahoo.com" },
  ]);

  // Unblock Single User (Static)
  const handleUnblock = (id) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
    }
  };

  // Unblock All Users (Static)
  const handleUnblockAll = () => {
    if (window.confirm("Are you sure you want to unblock all users?")) {
      setBlockedUsers([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] text-gray-800 flex flex-col">
      
      <div className="container mx-auto px-4 sm:px-6 py-12 flex-grow max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-200 bg-pink-50 mb-6">
            <FaShieldAlt className="text-green-800" />
            <span className="text-green-800 font-semibold text-sm">Privacy Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blocked Users
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            Manage users who can't contact you. You can unblock them anytime to restore communication.
          </p>
        </div>

        {/* Stats & Quick Action Row */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center">
            <FaUserSlash className="text-green-800 text-3xl mb-3" />
            <span className="text-2xl font-bold text-gray-800">{blockedUsers.length}</span>
            <span className="text-sm text-gray-500">Total Blocked</span>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center">
            <FaUnlock className="text-green-500 text-3xl mb-3" />
            <button 
              onClick={handleUnblockAll}
              disabled={blockedUsers.length === 0}
              className="bg-green-800 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              Unblock All
            </button>
            <span className="text-sm text-gray-500 mt-2">Quick Action</span>
          </div>
        </div>

        {/* Blocked Users List */}
        <div className="space-y-4">
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex flex-col sm:flex-row items-center justify-between bg-[#FFFAF5] border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  {/* Avatar / Initial */}
                  <div className="w-12 h-12 bg-green-800 text-green-800 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.email}</h3>
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <FaUserSlash size={10} /> Blocked User
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleUnblock(user.id)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-green-800 hover:text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  <FaUnlock size={14} /> Unblock
                </button>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-[#FFFAF5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-green-500 text-2xl">
                ✅
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">All Clear!</h2>
              <p className="text-gray-500">You haven't blocked anyone yet. Everyone can contact you freely.</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
          <div className="text-blue-500 text-xl shrink-0 mt-1">
            <FaShieldAlt />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">About Blocking</h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              Blocked users cannot send you messages or initiate calls. You can unblock them anytime to restore communication. 
              This helps you maintain your privacy and have full control over your interactions.
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default BlockedUsers;