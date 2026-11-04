// import React, { useState, useEffect } from "react";
// import { IoCheckmarkCircle, IoVideocam } from "react-icons/io5";
// import Header from "../../page/Dashboard";
// import { useNavigate } from "react-router-dom";
// import Flag from "react-world-flags";
// import Marquee from "react-fast-marquee";

// const allCountries = [
//   { code: "US", name: "USA" }, { code: "IN", name: "India" }, { code: "GB", name: "UK" },
//   { code: "RU", name: "Russia" }, { code: "BR", name: "Brazil" }, { code: "ES", name: "Spain" },
//   { code: "TR", name: "Turkey" }, { code: "PH", name: "Philippines" }, { code: "SA", name: "Saudi Arabia" },
//   { code: "AE", name: "UAE" }, { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" },
//   { code: "DE", name: "Germany" }, { code: "FR", name: "France" }, { code: "IT", name: "Italy" },
//   // ... (baaki desh waise hi rahenge, jagah kam karne ke liye maine kuch hata diye hain, aap apni puri list rakh sakte hain)
// ];

// const languageContent = {
//   Hindi: { tabs: ["सभी", "ऑनलाइन", "ऑफलाइन"], verified: "सत्यापित", available: "उपलब्ध", offline: "ऑफलाइन", noUsers: { all: "कोई उपयोगकर्ता नहीं मिला" } },
//   English: { tabs: ["All", "Online", "Offline"], verified: "Verified", available: "Available", offline: "Offline", noUsers: { all: "No Users Found" } },
//   // ... (baaki languages waise hi rahengi)
// };

// const getLanguageContent = (language) => {
//   return languageContent[language] || languageContent.English;
// };

// export default function NewUsers() {
//   const [activeTab, setActiveTab] = useState("All");
//   const [activeFilter, setActiveFilter] = useState("English"); 
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const content = getLanguageContent(activeFilter);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token"); // Login token

//         // ✅ Backend API se users fetch karein
//         const response = await fetch("http://localhost:5000/api/looking/discover", {
//           method: "GET", // Ya POST, jo aapke backend mein set hai
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//           }
//         });

//         const data = await response.json();

//         if (response.ok && data.users) {
//           // Backend se aane wale users ko format karein
//           const formattedUsers = data.users.map(u => ({
//             id: u._id,
//             name: u.name,
//             age: u.age,
//             avatar: u.profilePic || "https://i.pravatar.cc/300",
//             isverifiedprofile: true, // Abhi ke liye true
//             isactivestatus: true, // Abhi ke liye true
//             country: u.city || "India",
//             email: u.email
//           }));
//           setUsers(formattedUsers);
//           setFilteredUsers(formattedUsers);
//         } else {
//           setUsers([]);
//           setFilteredUsers([]);
//         }
//       } catch (err) {
//         console.error("Users fetch error:", err);
//         setUsers([]);
//         setFilteredUsers([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     let filtered = users;
//     if (activeTab === "Online") filtered = filtered.filter(user => user.isactivestatus === true);
//     else if (activeTab === "Offline") filtered = filtered.filter(user => user.isactivestatus === false);
//     setFilteredUsers(filtered);
//   }, [activeTab, users]);

//   const handleUserClick = (user) => {
//   console.log("Clicking user:", user); // Check karein kya print hota hai
//   if (!user || !user.id) return;
//   navigate(`/chat/${user.id}`, { state: { user } }); 
// };

//   // ✅ Video icon click par call screen par bhejein
//   const handleVideoCall = (e, user) => {
//     e.stopPropagation(); // Card click rokne ke liye
//     navigate("/callscreen", { state: { user } });
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-[#FFFAF5]">
//       <Header />
      
//       <div className="pt-[20px] sm:pt-[20px]"> 
        
//         {/* Country Marquee */}
//         <div className="border-b border-gray-300 py-4 mt-2 bg-[#FFFAF5]/40 backdrop-blur-sm">
//           <Marquee gradient={false} speed={40} pauseOnHover={true}>
//             {allCountries.map((country, index) => (
//               <div key={index} className="mx-4 flex flex-col items-center cursor-pointer transition-transform hover:scale-105">
//                 <div className="w-16 h-11 border border-gray-400 rounded-md overflow-hidden bg-[#FFFAF5] shadow-md">
//                   <Flag code={country.code} className="w-full h-full object-cover" />
//                 </div>
//                 <span className="text-[11px] mt-2 font-bold text-gray-800 text-center truncate w-full">
//                   {country.name}
//                 </span>
//               </div>
//             ))}
//           </Marquee>
//         </div>

//         {/* Users Grid */}
//         <div className="px-4 sm:px-8 mt-8 pb-20">
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="text-center py-20 text-gray-800 font-bold text-xl">
//                {content.noUsers.all}
//             </div>
//           ) : (
//             <div className="w-[100%] grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
//               {filteredUsers.map((user) => (
//                 <div
//                   key={user.id}
//                   className="bg-[#FFFAF5] rounded-xl overflow-hidden relative cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
//                   onClick={() => handleUserClick(user)}
//                 >
//                   <div className="relative w-full h-80">
//                     <img
//                       src={user.avatar}
//                       alt={user.name}
//                       className="w-full h-full object-cover"
//                     />

//                     {user.isverifiedprofile && (
//                       <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full flex items-center text-xs text-white">
//                         <IoCheckmarkCircle className="text-blue-400 mr-1" />
//                         {content.verified}
//                       </div>
//                     )}

//                     {/* ✅ Video Call Icon */}
//                     <div 
//                       onClick={(e) => handleVideoCall(e, user)}
//                       className="absolute top-3 right-3 bg-green-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
//                     >
//                       <IoVideocam className="text-white text-lg" />
//                     </div>

//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//                       <div className="flex justify-between items-center mb-1">
//                         <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
//                         <span className="text-sm text-gray-200">{user.age}</span>
//                       </div>
//                       <div className="flex items-center text-xs">
//                         <span className={`w-2 h-2 rounded-full mr-2 ${user.isactivestatus ? "bg-green-500" : "bg-gray-400"}`}></span>
//                         <span className="text-gray-200">{user.isactivestatus ? content.available : content.offline}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { IoCheckmarkCircle, IoVideocam } from "react-icons/io5";
import Header from "../../page/Dashboard";
import { useNavigate } from "react-router-dom";
import Flag from "react-world-flags";
import Marquee from "react-fast-marquee";

const allCountries = [
  { code: "US", name: "USA" }, { code: "IN", name: "India" }, { code: "GB", name: "UK" },
  { code: "RU", name: "Russia" }, { code: "BR", name: "Brazil" }, { code: "ES", name: "Spain" },
  { code: "TR", name: "Turkey" }, { code: "PH", name: "Philippines" }, { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "UAE" }, { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" }, { code: "FR", name: "France" }, { code: "IT", name: "Italy" },
];

const languageContent = {
  English: { tabs: ["All", "Online", "Offline"], verified: "Verified", available: "Available", offline: "Offline", noUsers: { all: "No Users Found" } },
};

const getLanguageContent = (language) => {
  return languageContent[language] || languageContent.English;
};

export default function NewUsers() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("English"); 
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const content = getLanguageContent(activeFilter);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/looking/discover", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.users) {
          const formattedUsers = data.users.map(u => ({
            id: u._id,       // Dono id aur _id set kar rahe hain taaki kahin bhi error na aaye
            _id: u._id,
            name: u.name,
            age: u.age,
            avatar: u.profilePic ? `http://localhost:5000${u.profilePic}` : "https://i.pravatar.cc/300",
            isverifiedprofile: true, 
            isactivestatus: true, 
            country: u.city || "India",
            email: u.email
          }));
          setUsers(formattedUsers);
          setFilteredUsers(formattedUsers);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (err) {
        console.error("Users fetch error:", err);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (activeTab === "Online") filtered = filtered.filter(user => user.isactivestatus === true);
    else if (activeTab === "Offline") filtered = filtered.filter(user => user.isactivestatus === false);
    setFilteredUsers(filtered);
  }, [activeTab, users]);

  const handleUserClick = (user) => {
    // Ab user object mein id aur _id dono hain
    navigate(`/chat/${user.id}`, { state: { user } }); 
  };

  const handleVideoCall = (e, user) => {
    e.stopPropagation(); 
    navigate("/callscreen", { state: { user } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF5]">
      <Header />
      
      <div className="pt-[20px] sm:pt-[20px]"> 
        <div className="border-b border-gray-300 py-4 mt-2 bg-[#FFFAF5]/40 backdrop-blur-sm">
          <Marquee gradient={false} speed={40} pauseOnHover={true}>
            {allCountries.map((country, index) => (
              <div key={index} className="mx-4 flex flex-col items-center cursor-pointer transition-transform hover:scale-105">
                <div className="w-16 h-11 border border-gray-400 rounded-md overflow-hidden bg-[#FFFAF5] shadow-md">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] mt-2 font-bold text-gray-800 text-center truncate w-full">
                  {country.name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>

        <div className="px-4 sm:px-8 mt-8 pb-20">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-800 font-bold text-xl">
               {content.noUsers.all}
            </div>
          ) : (
            <div className="w-[100%] grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#FFFAF5] rounded-xl overflow-hidden relative cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="relative w-full h-80">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />

                    {user.isverifiedprofile && (
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full flex items-center text-xs text-white">
                        <IoCheckmarkCircle className="text-blue-400 mr-1" />
                        {content.verified}
                      </div>
                    )}

                    <div 
                      onClick={(e) => handleVideoCall(e, user)}
                      className="absolute top-3 right-3 bg-green-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                    >
                      <IoVideocam className="text-white text-lg" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
                        <span className="text-sm text-gray-200">{user.age}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className={`w-2 h-2 rounded-full mr-2 ${user.isactivestatus ? "bg-green-500" : "bg-gray-400"}`}></span>
                        <span className="text-gray-200">{user.isactivestatus ? content.available : content.offline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}