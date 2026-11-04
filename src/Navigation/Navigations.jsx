
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import SignUp from '../components/SignUp/SignUp.jsx';
import Chats from '../components/Chats/Chats.jsx';
import NewUsers from '../components/NewUsers/NewUsers.jsx';
import Chat from '../components/Chat/Chat.jsx';
import CallScreen from '../components/CallScreen/CallScreen.jsx';
import JoinScreen from '../components/JoinScreen/JoinScreen.jsx';
import IncomingCallScreen from '../components/IncomingCall/IncomingCallScreen.jsx';
import Login from '../components/Login/Login.jsx';
import { auth, messaging } from '../firebase/config.js';
import { supabase } from '../firebase/supabaseClient.js';

const IncomingCallProvider = ({ children }) => {
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [isincomingCall, setIsincomingCall] = useState(false);
  
  const [callData, setCallData] = useState({
    email: "",
    name: "",
    image: "",
    remoteAccessToken: "",
    remoteFCMToken: "",
    roomId: "",
    isVideoCall: true
  });
  
  const ringtoneRef = useRef(null);
  const navigate = useNavigate();
  const peerEmail = useRef("");
  
  // ✅ Correct VAPID Key
  const VAPID_KEY = "BLYquZefza_PR9EGgd48RMsOgNEDDluKsj2pBQc-j58xvIaLCJgQljZOSwfLIhrejvRM-hULJ8mkGshB6dFkJGI";

  useEffect(() => {
    setupForegroundMessages();
    const initializeFCM = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (auth.currentUser) {
            console.log('👤 User found, setting up FCM...');
            await setupFCM();
          }

          const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
              console.log('👤 User logged in, setting up FCM...');
              await new Promise(resolve => setTimeout(resolve, 1000));
              await setupFCM();
            }
          });

          return unsubscribe;
        } catch (error) {
          console.log('❌ FCM initialization failed:', error);
        }
      } else {
        console.log('❌ Service Worker not supported in this browser');
      }
    };

    initializeFCM();
  }, []);

  // ✅ Save FCM Token (Without Notification)
  const saveFCMTokenToSupabase = async (userId, token) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          fcmToken: token,
          tokenUpdatedAt: new Date().toISOString(),
        })
        .eq('email', userId);
  
      if (error) {
        console.log('Error saving FCM token to Supabase:', error);
        return false;
      }
      
      console.log('✅ FCM token saved to Supabase for user:', userId);
      
      await sendNotification(userId, token, "", "");
      
      return true;
    } catch (error) {
      console.log('Error saving FCM token:', error);
      return false;
    }
  };

  // ✅ Access Token Generate and Save
  const generateAndSaveAccessToken = async (userId, fcmToken) => {
    try {
      const accessToken = `access_token_${userId}_${Date.now()}`;
      
      const { error } = await supabase
        .from('users')
        .update({
          accessToken: `Bearer ${fcmToken}`,
        })
        .eq('email', userId);
  
      if (error) {
        console.log('Error saving accessToken to Supabase:', error);
        return false;
      }
      
      console.log('✅ Access token saved to Supabase for user:', userId);
      return true;
    } catch (error) {
      console.log('Error saving accessToken:', error);
      return false;
    }
  };

  // ✅ Send Notification with CORS Proxy (Optional)
  const sendNotification = async (userId, tokenParam, titleParam, bodyParam) => {
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = "https://tokenservers.onrender.com/send-notification";
      const url = proxyUrl + encodeURIComponent(targetUrl);
      
      const payload = {
        message: {
          token: tokenParam,
          notification: {
            title: titleParam,
            body: bodyParam,
          },
        },
      };

      console.log('📤 Sending notification via proxy...');
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Notification send result:", data);
        
        if (data.result) {
          const { error } = await supabase
            .from('users')
            .update({
              accessToken: `Bearer ${data.result}`,
            })
            .eq('email', userId);
            
          if (!error) {
            console.log('✅ Access token from server saved to database');
          }
        }
      } else {
        console.log('❌ Notification server responded with error');
        await generateAndSaveAccessToken(userId, data.result);
      }
    } catch (error) {
      console.error("❌ Error sending notification:", error);
      await generateAndSaveAccessToken(userId, data.result);
    }
  };

  // ✅ Service Worker Register Function
  const registerServiceWorker = async () => {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('✅ Service Worker registered:', registration);
      
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              console.log('✅ Service Worker activated');
              resolve();
            }
          });
        });
      }

      return registration;
    } catch (error) {
      console.log('❌ Service Worker registration failed:', error);
      if (error instanceof Error) {
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
      }
      throw error;
    }
  };

  // ✅ Improved FCM Setup Function
  const setupFCM = async () => {
    try {
      console.log('🚀 Starting FCM setup...');

      const isMessagingSupported = await isSupported();
      if (!isMessagingSupported) {
        console.log('❌ Messaging not supported in this browser');
        return;
      }

      const registration = await registerServiceWorker();
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (Notification.permission === 'denied') {
        console.log('🚫 Notification permission previously denied');
        return;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        console.log('🔔 Requesting notification permission...');
        permission = await Notification.requestPermission();
      }

      if (permission === "granted") {
        console.log("✅ Notification permission granted.");
        
        const currentToken = await getToken(messaging, { 
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
          console.log('✅ FCM Token received:', currentToken);
          
          if (auth.currentUser?.email) {
            await saveFCMTokenToSupabase(auth.currentUser.email, currentToken);
          }
        } else {
          console.log('❌ No registration token available.');
          checkTokenIssues();
        }
      } else {
        console.log("🚫 Notification permission:", permission);
      }
    } catch (error) {
      console.log('❌ Error setting up FCM:', error);
    }
  };

  // ✅ Token issues diagnose karne ke liye
  const checkTokenIssues = async () => {
    console.log('🔍 Diagnosing token issues...');
    
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker state:', registration.active?.state);
    
    console.log('Firebase app:', messaging.app.name);
  };

  // ✅ FIXED: Foreground messages setup with complete data handling
  const setupForegroundMessages = () => {
    try {
      console.log('🎯 Setting up foreground messages...');
      
      onMessage(messaging, (payload) => {
        console.log('📨 Foreground message received:', payload);
        
        if (payload.data) {
          console.log('📊 Message data:', payload.data);
          console.log('📊 Message data type:', payload.data.type);

          // ✅ Incoming call - COMPLETE DATA EXTRACTION
          if (payload.data.type === "Incoming_Call") {
            console.log('📞 Processing incoming call data...');
            
            // ✅ Extract all required data from FCM payload
            const incomingCallData = {
              email: payload.data.Peeremail || "",
              name: payload.data.callerName || payload.data.Peeremail || "",
              image: payload.data.callerImage || "https://i.pravatar.cc/300",
              remoteAccessToken: payload.data.accessToken || "",
              remoteFCMToken: payload.data.fcmToken || "",
              roomId: payload.data.roomId || payload.data.Peeremail || "",
              isVideoCall: payload.data.isVideoCall === 'true' || true
            };

            console.log('📋 Extracted call data:', incomingCallData);

            // ✅ Set complete call data
            setCallData(incomingCallData);
            peerEmail.current = incomingCallData.email;
            
            setShowIncomingCall(true);
            
            // ✅ Ringtone play karein
            playRingtone();
          }
          
          // Normal notification
          if (payload.notification) {
            showCustomNotification(payload.notification);
          }
        }
      });
    } catch (error) {
      console.log('❌ Error setting up foreground messages:', error);
    }
  };

  // ✅ Ringtone function
  const playRingtone = async () => {
    try {
      stopRingtone();
      
      const audio = new Audio('/sounds/ringtone.mp3');
      ringtoneRef.current = audio;
      
      audio.loop = true;
      audio.play().then(() => {
        console.log('🔔 Ringtone started playing');
      }).catch(error => {
        console.log('❌ Ringtone playback failed:', error);
      });
    } catch (error) {
      console.log('❌ Error playing ringtone:', error);
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      console.log('🔕 Ringtone stopped');
    }
  };

  // ✅ Custom notification show karein
  const showCustomNotification = (notification) => {
    if (!("Notification" in window)) {
      console.log("❌ This browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        icon: "/icon.png"
      });
    }
  };

  // ✅ FIXED: handleAcceptCall with complete data
  const handleAcceptCall = async () => {
    console.log("✅ Accepting call with data:", callData);
    
    try {
      setShowIncomingCall(false);
      // stopRingtone();

      // ✅ Debug logging
      console.log("📧 Peer Email:", callData.email);
      console.log("🔑 Remote Access Token:", callData.remoteAccessToken);
      console.log("📱 Remote FCM Token:", callData.remoteFCMToken);
      console.log("🖼️ Avatar:", callData.image);
      console.log("🚪 Room ID:", callData.roomId);
      // console("🎥 Is Video Call:", callData.isVideoCall);

      // ✅ Navigate to JoinScreen with COMPLETE data
      navigate('/joinscreen', {
        state: {
          roomId: callData.roomId,
          peerEmail: callData.email,
          remoteAccessToken: callData.remoteAccessToken,
          remoteFCMToken: callData.remoteFCMToken,
          avatar: callData.image,
          isVideoCall: callData.isVideoCall,
          isCaller: false,
          isTypeJoin: true,
        }
      });

      // ✅ Update user status in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          isoncallstatus: true,
          isvideoon: callData.isVideoCall,
        })
        .eq("email", auth.currentUser?.email);

      if (error) {
        console.error("❌ Error updating user status:", error);
      }

    } catch (error) {
      console.log('❌ Error accepting call:', error);
    }
  };

  // ✅ FIXED: handleRejectCall with proper data
  const handleRejectCall = async () => {
    try {
      setShowIncomingCall(false);
      stopRingtone();
      setIsincomingCall(false);

      console.log("❌ Rejecting call from:", callData.email);

      // ✅ Update current user (self)
      const { error: selfError } = await supabase
        .from("users")
        .update({
          iscallingfrom: "",
          isoncallstatus: false,
        })
        .eq("email", auth.currentUser?.email);

      if (selfError) {
        console.error("❌ Error updating self:", selfError);
      }

      // ✅ Update peer user (caller)
      if (callData.email) {
        const { error: peerError } = await supabase
          .from("users")
          .update({
            iscallingfrom: "",
            isoncallstatus: false,
            iscallerhangup: true,
          })
          .eq("email", callData.email);

        if (peerError) {
          console.error("❌ Error updating peer:", peerError);
        }
      }

      // ✅ Send FCM rejection notification
      if (callData.remoteFCMToken && callData.remoteAccessToken) {
        await sendFcmNotification(
          callData.remoteFCMToken,
          "Call Rejected",
          `${auth?.currentUser?.email} rejected your call`,
          callData.remoteAccessToken,
          { 
            type: "Reject_Call",
            Peeremail: auth?.currentUser?.email 
          }
        );
      }

      console.log("✅ Call rejected successfully");

    } catch (error) {
      console.log("❌ handleRejectCall error:", error);
    }
  };

  // ✅ FCM Notification function
  const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
    if (!targetToken || !authToken) {
      console.log('❌ FCM: Missing token or authToken');
      return;
    }

    const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";
    const payload = {
      message: {
        token: targetToken,
        notification: { 
          title: title,
          body: body 
        },
        data: {
          ...extraData,
        },
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📤 FCM Response:", data);
    } catch (error) {
      console.error("❌ FCM Error:", error);
    }
  };

  return (
    <>
      {children}
      
      {showIncomingCall && callData && (
        <IncomingCallScreen
          callerName={callData.name || callData.email}
          callerImage={callData.image}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          isVideoCall={callData.isVideoCall}
        />
      )}
    </>
  );
};

// Baaki ka code same rakhein
function Navigations() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/*" element={
            <IncomingCallProvider>
              <AppRoutes />
            </IncomingCallProvider>
          } />
        </Routes>
      </div>
    </Router>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/chats" element={<Chats />} />
      <Route path="/users" element={<NewUsers/>} />
      <Route path="/discover" element={<NewUsers />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/callscreen" element={<CallScreen/>} />
      <Route path="/joinscreen" element={<JoinScreen />} />
      
      <Route path="/home" element={<Navigate to="/discover" replace />} />
      <Route path="/messages" element={<Navigate to="/chats" replace />} />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};



export default Navigations