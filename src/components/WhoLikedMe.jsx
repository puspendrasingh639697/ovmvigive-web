import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../page/Dashboard";
import Footer from "../components/MainSrceen/Footer";
import { Heart, Lock, Eye, Crown } from "lucide-react";

export default function WhoLikedMe() {
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://omnigive-global.onrender.com/api/like/who-liked-me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setLikes(data.likes || []);
          setIsPremium(data.isPremium || false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Server se connect nahi ho paya");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-pink-50 flex flex-col">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-10 max-w-4xl">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
            Who Liked Me <Heart className="text-pink-500" fill="currentColor" size={32} />
          </h1>
          <p className="text-gray-500">
            {likes.length} logon ne aapko like kiya hai
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : likes.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Heart size={64} className="mx-auto mb-4 text-gray-300" />
            <p>Abhi tak kisi ne aapko like nahi kiya</p>
          </div>
        ) : (
          <>
            {/* Premium Banner */}
            {!isPremium && (
              <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown size={32} />
                  <div>
                    <p className="font-bold">Premium mein upgrade karein</p>
                    <p className="text-sm text-white/80">Sabhi likes bina blur ke dekhein</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/premiumPage")}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100"
                >
                  Upgrade
                </button>
              </div>
            )}

            {/* Likes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {likes.map((like) => (
                <div 
                  key={like._id}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative w-full h-64">
                    <img
                      src={like.sender.profilePic || "https://i.pravatar.cc/300"}
                      alt={like.sender.name}
                      className={`w-full h-full object-cover ${like.isBlurred ? "blur-md" : ""}`}
                    />
                    
                    {/* Blur Overlay for Free Users */}
                    {like.isBlurred && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock size={48} className="text-white" />
                      </div>
                    )}

                    {/* Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                      <p className="text-white font-bold text-sm">
                        {like.sender.name}
                      </p>
                      {like.isBlurred && (
                        <p className="text-white/70 text-xs">Premium mein dekhein</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!like.isBlurred && (
                    <div className="p-3 flex gap-2">
                      <button 
                        onClick={() => navigate(`/chat/${like.sender._id}`, { state: { user: like.sender } })}
                        className="flex-1 bg-pink-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-pink-700"
                      >
                        Chat
                      </button>
                      <button 
                        onClick={() => navigate(`/discover`)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}