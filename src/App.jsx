// import React from 'react';
// import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// // Pages Import
// import Splash from "../src/Auth/Splash.jsx";
// import MainSrceen from './components/MainSrceen/MainSrceen.jsx';
// // import Login from "./components/Login/Login.jsx";
// // import SignUps from "./components/SignUp/SignUps.jsx";
// import NewUsers from './components/NewUsers/NewUsers.jsx'; // Aapka next page (Discover)
// import ChatsAndChat from './components/CombineScreen/ChatsAndChat';
// import Chats from './components/Chats/Chats';
// import Chat from './components/Chat/Chat';

// // SideMenu & Other Pages
// import SideMenu from './Sidememu/SideMenu.jsx';
// import PremiumPage from './Sidememu/PremiumPage.jsx';
// // import GoldPurchaseScreen from './Sidememu/GoldPurchaseScreen.jsx';
// // import DiamondPurchaseScreen from './Sidememu/diamondPurchaseScreen.jsx';
// import ContactUs from './Sidememu/ContactUs.jsx';
// import BlockedUsers from './Sidememu/BlockedUsers.jsx';
// import Privacy from './components/MainSrceen/Privacy.jsx';
// import Terms from './components/MainSrceen/Terms.jsx';

// // Call Screens
// import CallScreen from './components/CallScreen/CallScreen.jsx';
// import JoinScreen from './components/JoinScreen/JoinScreen.jsx';
// import Fullheaderchat from "./components/Fullheaderchat";
// import Login from './Auth/Login.jsx';
// import Signup from './components/SignUp/SignUp.jsx';

// // 404 Page
// const NotFoundPage = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
//       <div className="text-center max-w-md bg-[#FFFAF5] p-8 rounded-xl shadow-lg">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
//         <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
//         <div className="flex flex-col sm:flex-row gap-3 justify-center">
//           <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
//             Go Back
//           </button>
//           <button onClick={() => navigate('/ChatsAndChat')} className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-800">
//             Go to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Splash />} />
//           <Route path="/mainsrceen" element={<MainSrceen />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
          
//           {/* Main App Routes (Bina kisi Auth check ke, direct accessible) */}
//           <Route path="/ChatsAndChat" element={<ChatsAndChat />} />
//           <Route path="/chats" element={<Chats />} />
//           <Route path="/discover" element={<NewUsers />} />
//           <Route path="/newusers" element={<NewUsers />} />
//           <Route path="/chat/:userId" element={<Chat />} />
          
//           {/* Call Routes */}
//           <Route path="/callscreen" element={<CallScreen />} />
//           <Route path="/joinscreen" element={<JoinScreen />} />
//           <Route path="/fullheaderchat" element={<Fullheaderchat />} />

//           {/* Menu & Static Pages */}
//           <Route path="/sideMen" element={<SideMenu />} />
//           <Route path="/premiumPage" element={<PremiumPage />} />
//           {/* <Route path="/goldPurchaseScreen" element={<GoldPurchaseScreen />} /> */}
//           {/* <Route path="/diamondPurchaseScreen" element={<DiamondPurchaseScreen />} /> */}
//           <Route path="/contactUs" element={<ContactUs />} />
//           <Route path="/privacy" element={<Privacy />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/blockedUsers" element={<BlockedUsers />} />

//           {/* Redirects */}
//           <Route path="/home" element={<Navigate to="/ChatsAndChat" replace />} />
          
//           {/* 404 Catch-All */}
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
// HashRouter ki jagah BrowserRouter use karein
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Pages Import
import Splash from "./Auth/Splash.jsx";
import MainSrceen from './components/MainSrceen/MainSrceen.jsx';
import NewUsers from './components/NewUsers/NewUsers.jsx';
import ChatsAndChat from './components/CombineScreen/ChatsAndChat';
import Chats from './components/Chats/Chats';
import Chat from './components/Chat/Chat';

// SideMenu & Other Pages
import SideMenu from './Sidememu/SideMenu.jsx';
import PremiumPage from './Sidememu/PremiumPage.jsx';
import ContactUs from './Sidememu/ContactUs.jsx';
import BlockedUsers from './Sidememu/BlockedUsers.jsx';
import Privacy from './components/MainSrceen/Privacy.jsx';
import Terms from './components/MainSrceen/Terms.jsx';

// Call Screens
import CallScreen from './components/CallScreen/VoiceCall.jsx';
import JoinScreen from './components/JoinScreen/JoinScreen.jsx';
import Fullheaderchat from "./components/Fullheaderchat";

// Auth Pages
import Login from './Auth/Login.jsx';
import Signup from './components/SignUp/SignUp.jsx';
import VoiceCall from './components/CallScreen/VoiceCall.jsx';
import VideoCall from './components/VideoCall.jsx';

// 404 Page
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-md bg-[#FFFAF5] p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Go Back
          </button>
          <button onClick={() => navigate('/ChatsAndChat')} className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-800">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/mainsrceen" element={<MainSrceen />} />
          
          {/* LOGIN ROUTE */}
          <Route path="/login" element={<Login />} />
          
          {/* SIGNUP ROUTE (Yahan 's' add kiya hai taaki link se match kare) */}
          <Route path="/signups" element={<Signup />} /> 
          
          {/* Main App Routes */}
          <Route path="/ChatsAndChat" element={<ChatsAndChat />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/discover" element={<NewUsers />} />
          {/* <Route path="/newusers" element={<NewUsers />} /> */}
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/voicecall/:userId" element={<VoiceCall />} />
<Route path="/videocall/:userId" element={<VideoCall />} />
          
          {/* Call Routes */}
          <Route path="/callscreen" element={<CallScreen />} />
          <Route path="/joinscreen" element={<JoinScreen />} />
          <Route path="/fullheaderchat" element={<Fullheaderchat />} />

          {/* Menu & Static Pages */}
          <Route path="/sideMen" element={<SideMenu />} />
          <Route path="/premiumPage" element={<PremiumPage />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blockedUsers" element={<BlockedUsers />} />

          {/* Redirects */}
          <Route path="/home" element={<Navigate to="/ChatsAndChat" replace />} />
          
          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;