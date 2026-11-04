import React, { useState } from "react";
import { 
  IoHeart, 
  IoStar, 
  IoPeople, 
  IoCheckmarkCircle, 
  IoVideocam,
  IoFlash
} from "react-icons/io5";

const CreatorsLoveUs = () => {
  const [activeCreator, setActiveCreator] = useState(null); // null = none active at start

  const creators = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Beauty Influencer",
      followers: "50K+",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      badge: <IoStar className="text-yellow-500" />,
      quote: "Hiddo helped me connect with my audience in real-time! The live interactions are amazing!",
      joinDate: "Joined 6 months ago",
      growth: "+425%",
      engagement: "87%",
      videos: "240+"
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "Gaming Streamer",
      followers: "80K+",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      badge: <IoHeart className="text-red-500" />,
      quote: "From 0 to 80K followers! Hiddo's community is incredibly supportive and engaging!",
      joinDate: "Joined 8 months ago",
      growth: "+320%",
      engagement: "92%",
      videos: "180+"
    },
    {
      id: 3,
      name: "Neha Patel",
      role: "Dance Creator",
      followers: "120K+",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      badge: <IoPeople className="text-blue-500" />,
      quote: "The video quality on Hiddo is outstanding! My dance tutorials look so professional!",
      joinDate: "Joined 1 year ago",
      growth: "+280%",
      engagement: "78%",
      videos: "350+"
    },
    {
      id: 4,
      name: "Amit Singh",
      role: "Comedy Artist",
      followers: "65K+",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      badge: <IoCheckmarkCircle className="text-green-500" />,
      quote: "My comedy sketches went viral on Hiddo! The engagement here is unreal!",
      joinDate: "Joined 7 months ago",
      growth: "+510%",
      engagement: "95%",
      videos: "150+"
    }
  ];

  return (
    <section className="bg-[#FFFAF5] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Our Creators Say
            <span className="text-[#5A1F1F] block mt-2">
              One App, Infinite Vibes.
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {creators.map((creator, index) => (
            <div
              key={creator.id}
              onClick={() => setActiveCreator(activeCreator === index ? null : index)}
              className={`group cursor-pointer transition-all duration-500 ${
                activeCreator === index
                  ? "transform scale-[1.02]"
                  : "hover:scale-[1.02]"
              }`}
            >
              <div
                className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-500 bg-[#FFFAF5] ${
                  activeCreator === index
                    ? "border-[#5A1F1F] shadow-xl"
                    : "border-gray-200 hover:border-[#B58A3A] hover:shadow-lg"
                }`}
              >
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0.5 sm:p-1 transition-all duration-300 bg-gradient-to-r ${
                          activeCreator === index
                            ? "from-[#5A1F1F] to-[#B58A3A]"
                            : "from-gray-200 to-gray-300 group-hover:from-[#5A1F1F] group-hover:to-[#B58A3A]"
                        }`}
                      >
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-full h-full rounded-full object-cover border-2 border-white"
                        />
                      </div>
                      {/* Badge */}
                      <div
                        className={`absolute -bottom-1 -right-1 rounded-full p-1 sm:p-1.5 border bg-[#FFFAF5] transition-all duration-300 ${
                          activeCreator === index
                            ? "border-[#5A1F1F]"
                            : "border-gray-200 group-hover:border-[#B58A3A]"
                        }`}
                      >
                        <div className="text-sm sm:text-lg">
                          {creator.badge}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 truncate">
                          {creator.name}
                        </h3>
                        <IoFlash className="text-yellow-500 text-xs sm:text-sm" />
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2 truncate">
                        {creator.role}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <IoPeople className="text-[#5A1F1F] text-xs sm:text-sm" />
                          <span className="text-gray-800 font-semibold text-xs sm:text-sm">
                            {creator.followers}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IoVideocam className="text-[#B58A3A] text-xs sm:text-sm" />
                          <span className="text-gray-600 text-xs sm:text-sm">
                            {creator.videos}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Growth</p>
                      <p className="text-xs sm:text-sm font-bold text-green-600">
                        {creator.growth}
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Engagement</p>
                      <p className="text-xs sm:text-sm font-bold text-[#5A1F1F]">
                        {creator.engagement}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mt-3 sm:mt-4">
                    <p className="text-gray-600 text-xs sm:text-sm italic line-clamp-2">
                      "{creator.quote}"
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className={`absolute top-2 sm:top-4 right-2 sm:right-4 transition-all duration-300 ${
                    activeCreator === index
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#5A1F1F] rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreatorsLoveUs;