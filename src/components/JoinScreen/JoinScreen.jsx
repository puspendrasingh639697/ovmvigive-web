// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// // WebRTC imports for React.js
// const {
//   RTCPeerConnection,
//   RTCSessionDescription,
//   RTCIceCandidate,
//   mediaDevices
// } = window;

// // Icons
// import { 
//   IoCall,
//   IoVideocam,
//   IoVideocamOff,
//   IoMic,
//   IoMicOff,
//   IoCameraReverse,
//   IoPerson,
//   IoClose,
//   IoVolumeHigh,
//   IoWifi
// } from 'react-icons/io5';
// import { 
//   MdCallEnd, 
//   MdHighQuality,
//   MdSignalCellularAlt
// } from 'react-icons/md';
// import { 
//   FaUserCircle,
//   FaRegCircle,
//   FaCircle
// } from 'react-icons/fa';

// // Firebase/Supabase imports
// import { auth, db } from '../../firebase/config';
// import { supabase } from '../../firebase/supabaseClient';
// import { doc, setDoc, updateDoc, getDoc, collection, onSnapshot, addDoc, writeBatch, deleteDoc, getDocs } from 'firebase/firestore';
// import { initSocket } from '../../firebase/socket';


// // WebRTC configuration
// const configuration = {
//   iceServers: [
//     { urls: "stun:stun.relay.metered.ca:80" },
//     {
//       urls: "turn:159.223.175.154:3478",
//       username: "user",
//       credential: "password",
//     },
//     {
//       urls: "turn:95.217.13.89:3478",
//       username: "user",
//       credential: "password",
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// export default function JoinScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = location.state || {};
  
//   const { 
//     roomId, 
//     peerEmail, 
//     remoteAccessToken, 
//     remoteFCMToken, 
//     avatar,
//     isVideoCall = true
//   } = params;

//   // State declarations
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isFrontCamera, setIsFrontCamera] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [callInProgress, setCallInProgress] = useState(false);
//   const [hasPermissions, setHasPermissions] = useState(false);
//   const [callStatus, setCallStatus] = useState('Joining...');
//   const [callDuration, setCallDuration] = useState(0);
//   const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [videoCallType, setVideoCallType] = useState(isVideoCall);
//   const [isCallhangup, setIsCallhangup] = useState(false);

//   // Refs
//   const callTimerRef = useRef(null);
//   const unsubRef = useRef([]);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const ringtoneRef = useRef(null);
//   const pcRef = useRef(null);
//   const remoteStreamRef = useRef(new MediaStream());

//   // Debug logging


// useEffect(() => {
//   // 1️⃣ Initialize or get the existing socket
// const socket = initSocket(auth.currentUser.email);
// console.log("roomId printed inside useEffect",roomId,peerEmail)
//   // // 2️⃣ Join the call room
//   // socket.emit("join_call", {
//   //   from: roomId,             // Caller email
//   //   to: auth.currentUser.email,  // Callee email
//   // });

//   // 3️⃣ Handle remote hangup
//   // const handleRemoteHangup = ({ from }) => {
//   //   alert(
//   //     "Call Ended",
//   //     "Call has been hung up by user",
//   //     [
//   //       {
//   //         text: "OK",
//   //         onPress: () => {
//   //           // Only navigate back, DO NOT disconnect socket
//   //           // navigate.goBack();
//   //            navigate(-1);
//   //         },
//   //       },
//   //     ],
//   //     { cancelable: false }
//   //   );
//   // };

//     const handleRemoteHangup = ({ from }) => {
//     const confirmed = window.confirm("Call has been hung up by user.");
//     if (confirmed) {
//       navigate(-1); // Go back one page
//     }
//   };

//   // 4️⃣ Listen for events
//   socket.on("connected_call_hangup", handleRemoteHangup);
//   // socket.on("call_ended", handleRemoteHangup);

//   // 5️⃣ Cleanup: just remove listeners, keep socket alive
//   return () => {
//     socket.off("connected_call_hangup", handleRemoteHangup);
//     // socket.off("call_ended", handleRemoteHangup);
//     // ⚠️ DO NOT disconnect socket here
//   };
// }, []);

// useEffect(() => {
//   // 1️⃣ Initialize or get the existing socket
//   const socket = initSocket(auth.currentUser.email);

 

//   // 3️⃣ Handle remote hangup
//   // const handleRemoteHangup = ({ from }) => {
//   //   alert(
//   //     "Call Ended",
//   //     "Call has been hung up by user",
//   //     [
//   //       {
//   //         text: "OK",
//   //         onPress: () => {
//   //           // Only navigate back, DO NOT disconnect socket
//   //           // navigate.goBack();
//   //            navigate(-1);
//   //         },
//   //       },
//   //     ],
//   //     { cancelable: false }
//   //   );
//   // };

//     const handleRemoteHangup = ({ from }) => {
//     const confirmed = window.confirm("Call has been hung up by user.");
//     if (confirmed) {
//       navigate(-1); // Go back one page
//     }
//   };

//   // 4️⃣ Listen for events
//   socket.on("end_bg_call", handleRemoteHangup);
//   // socket.on("call_ended", handleRemoteHangup);

//   // 5️⃣ Cleanup: just remove listeners, keep socket alive
//   return () => {
//     socket.off("end_bg_call", handleRemoteHangup);
//     // socket.off("call_ended", handleRemoteHangup);
//     // ⚠️ DO NOT disconnect socket here
//   };
// }, []);



//   useEffect(() => {
//     console.log('🔍 JoinScreen Params:', {
//       roomId,
//       peerEmail,
//       remoteAccessToken: remoteAccessToken ? 'Present' : 'Missing',
//       remoteFCMToken: remoteFCMToken ? 'Present' : 'Missing',
//       avatar,
//       isVideoCall
//     });
//   }, []);

//   // FIXED: Effect to handle remote video element updates
//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       console.log('🎥 Setting remote video source:', remoteStream);
//       console.log('📹 Remote video tracks:', remoteStream.getVideoTracks());
//       console.log('🎵 Remote audio tracks:', remoteStream.getAudioTracks());
      
//       remoteVideoRef.current.srcObject = remoteStream;
      
//       // Force play the video
//       const playVideo = async () => {
//         try {
//           await remoteVideoRef.current.play();
//           console.log('▶️ Remote video playing successfully');
//         } catch (error) {
//           console.log('❌ Remote video play failed:', error);
//         }
//       };
      
//       playVideo();
//     }
//   }, [remoteStream]);

//   // FIXED: Enhanced remote stream handler
//   useEffect(() => {
//     if (remoteStream) {
//       console.log('🔄 Remote stream state updated:', {
//         videoTracks: remoteStream.getVideoTracks().length,
//         audioTracks: remoteStream.getAudioTracks().length,
//         active: remoteStream.active
//       });
//     }
//   }, [remoteStream]);

//   // Cleanup function
//   const cleanupConnections = async () => {
//     try {
//       console.log("🧹 Cleaning up connections...");

//       stopRingtone();

//       if (ringtoneRef.current) {
//         ringtoneRef.current.pause();
//         ringtoneRef.current = null;
//       }
      
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
      
//       if (unsubRef.current && unsubRef.current.length > 0) {
//         unsubRef.current.forEach(unsubscribe => {
//           if (typeof unsubscribe === 'function') {
//             unsubscribe();
//           }
//         });
//         unsubRef.current = [];
//       }
      
//       if (localStream) {
//         localStream.getTracks().forEach(track => {
//           track.stop();
//         });
//       }
      
//       if (pcRef.current) {
//         pcRef.current.close();
//         pcRef.current = null;
//       }
      
//       if (remoteStreamRef.current) {
//         remoteStreamRef.current.getTracks().forEach(track => track.stop());
//       }
      
//       setRemoteStream(null);
//       setCallInProgress(false);
//       setCallDuration(0);
//       setCallStatus('Call Ended');

//       console.log('✅ Connections cleaned up successfully');
//     } catch (error) {
//       console.error('❌ Error during cleanup:', error);
//     }
//   };

//   // Initial setup
//   useEffect(() => {
//     handlePermissions();
    
//     return () => {
//       cleanupConnections();
//     };
//   }, []);

//   // Auto-join when localStream is ready
//   useEffect(() => {
//     if (localStream && !callInProgress) {
//       joinCall();
//     }
//   }, [localStream]);

//   // Call timer
//   useEffect(() => {
//     if (callInProgress && remoteStream) {
//       callTimerRef.current = setInterval(() => {
//         setCallDuration(prev => prev + 1);
//       }, 1000);
//     } else {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
//     }
    
//     return () => {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
//     };
//   }, [callInProgress, remoteStream]);

//   const handlePermissions = async () => {
//     try {
//       console.log('🎥 Requesting media permissions...');
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: true, 
//         video: videoCallType 
//       });
//       setHasPermissions(true);
//       setLocalStream(stream);
      
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }
      
//       console.log('✅ Permissions granted and stream set');
//       return true;
//     } catch (error) {
//       console.log('❌ Permission error:', error);
//       setHasPermissions(false);
//       setCallStatus('Permissions Denied');
//       return false;
//     }
//   };

//   // FIXED: Complete rewrite of joinCall with better stream handling
//   const joinCall = async () => {
//     if (!localStream) {
//       console.log("❌ Local stream not ready yet!");
//       return;
//     }

//     if (!roomId) {
//       console.log('❌ Invalid roomId');
//       setCallStatus('Invalid Room ID');
//       return;
//     }

//     setCallInProgress(true);
//     setCallStatus('Connecting...');
    
//     try {
//       console.log('🚀 Creating RTCPeerConnection...');
//       const pc = new RTCPeerConnection(configuration);
//       pcRef.current = pc;

//       // Add local tracks
//       localStream.getTracks().forEach(track => {
//         pc.addTrack(track, localStream);
//         console.log(`✅ Added local ${track.kind} track`);
//       });

//       // FIXED: Better remote track handling
//       pc.ontrack = (event) => {
//         console.log('📹 Remote track received:', event.track.kind);
        
//         // Clear existing tracks
//         remoteStreamRef.current.getTracks().forEach(track => {
//           remoteStreamRef.current.removeTrack(track);
//         });

//         // Add new tracks from all streams
//         event.streams.forEach(stream => {
//           stream.getTracks().forEach(track => {
//             console.log(`🎯 Adding remote ${track.kind} track to stream`);
//             remoteStreamRef.current.addTrack(track);
//           });
//         });

//         // Create a new MediaStream for React state
//         const newRemoteStream = new MediaStream();
//         remoteStreamRef.current.getTracks().forEach(track => {
//           newRemoteStream.addTrack(track);
//         });

//         setRemoteStream(newRemoteStream);
//         setCallStatus('Connected');
//         console.log('✅ Remote stream set with tracks:', 
//           newRemoteStream.getTracks().map(t => t.kind)
//         );
//       };

//       // ICE candidate handling
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           const roomRef = doc(db, "room", roomId);
//           const calleeCandidates = collection(roomRef, "calleeCandidates");
//           addDoc(calleeCandidates, event.candidate.toJSON());
//         }
//       };

//       // Connection state handling
//       // pc.onconnectionstatechange = () => {
//       //   console.log('🔗 Connection state:', pc.connectionState);
//       //   if (pc.connectionState === 'connected') {
//       //     console.log('✅ Peer connection established');
//       //   }
//       // };


//       pc.onconnectionstatechange = () => {
//         console.log('PC state:', pc.connectionState);
//         if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
//           setCallStatus('Disconnected');
//           setIsCallhangup(true)
//           onBackPress()

//           stopRingtone();
//         }
//       };

//       // Get room data
//       const roomRef = doc(db, "room", roomId);
//       const roomSnapshot = await getDoc(roomRef);
      
//       if (!roomSnapshot.exists()) {
//         throw new Error('Room not found');
//       }

//       const roomData = roomSnapshot.data();
//       const offer = roomData.offer;

//       if (!offer) {
//         throw new Error('No offer found');
//       }

//       // Set remote description
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));
//       console.log('✅ Remote description set');

//       // Create and set local answer
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       console.log('✅ Local description set');

//       // Save answer to Firestore
//       await updateDoc(roomRef, {
//         answer: answer.toJSON ? answer.toJSON() : answer
//       });
//       console.log('✅ Answer saved to Firestore');

//       // Listen for ICE candidates from caller
//       const callerCandidates = collection(roomRef, "callerCandidates");
//       const unsubCaller = onSnapshot(callerCandidates, (snapshot) => {
//         snapshot.docChanges().forEach(async (change) => {
//           if (change.type === "added") {
//             const candidate = new RTCIceCandidate(change.doc.data());
//             await pc.addIceCandidate(candidate);
//           }
//         });
//       });

//       unsubRef.current.push(unsubCaller);

//       // Update user status
//       await updateUserStatus();

//     } catch (error) {
//       console.error("❌ joinCall error:", error);
//       setCallStatus('Connection Failed');
//       cleanupConnections();
//     }
//   };

//   const updateUserStatus = async () => {
//     try {
//       // Update current user
//       await supabase
//         .from("users")
//         .update({
//           isvideoon: true,
//           isoncallstatus: true,
//         })
//         .eq("email", auth?.currentUser?.email);

//       console.log("✅ User status updated");
//     } catch (error) {
//       console.error("❌ Error updating user status:", error);
//     }
//   };

//   // const onBackPress = async () => {
//   //   try {
//   //     // Update user status
//   //     await supabase
//   //       .from("users")
//   //       .update({
//   //         isoncallstatus: false,
//   //         isvideoon: false,
//   //       })
//   //       .eq("email", auth.currentUser?.email);

//   //     await cleanupConnections();
//   //     navigate(-1);

//   //   } catch (error) {
//   //     console.error("❌ Error ending call:", error);
//   //   }
//   // };


//   const onBackPress = async () => {
//   console.log("Ending call for:", peerEmail);
//   handleHangup()

// };
// const handleHangup = async () => {
//  const socket = initSocket(auth.currentUser.email);
//   if (!socket) return;
//   await deleteRoomByEmail(peerEmail);
//  await cleanupConnections();
//   console.log("📴 Callee ending the call...",roomId);
//   // socket.emit("callee_hangup_call", {
//   //   from: auth.currentUser?.email, // user B (callee)
//   //   to: roomId,                 // user A (caller)
//   // });
//   socket.emit("connected_call_hangup", {
//     from: auth.currentUser?.email, // user B (callee)
//     to: roomId,                 // user A (caller)
//   });

  
//   // Locally end call UI
//   // navigation.goBack();
//    navigate(-1);
//    navigate(-1);

//   // if (window.history.state && window.history.state.idx > 0) {
//   //     navigate(-1);
//   //   } else {
//   //     navigate(-1);; // or any default page like /dashboard
//   //   }
// };


// const deleteRoomByEmail = async (email) => {
//     try {
//       if (!email) return;
      
//       const roomRef = doc(db, "room", email);
//       const roomSnapshot = await getDoc(roomRef);
      
//       if (roomSnapshot.exists()) {
//         const subcollections = ["calleeCandidates", "callerCandidates"];
        
//         for (const sub of subcollections) {
//           const subColRef = collection(db, "room", email, sub);
//           const subDocs = await getDocs(subColRef);
          
//           const deletePromises = subDocs.docs.map(subDoc => deleteDoc(doc(subColRef, subDoc.id)));
//           await Promise.all(deletePromises);
//         }
        
//         await deleteDoc(roomRef);
//         console.log(`${email} room and its subcollections deleted successfully`);
//       }
//     } catch (error) {
//       console.error("Error deleting room:", error);
//     }
//   };

//   const toggleMute = () => {
//     if (!localStream) return;
    
//     localStream.getAudioTracks().forEach(track => {
//       track.enabled = !track.enabled;
//     });
//     setIsMuted(!isMuted);
//   };

//   const toggleVideo = async () => {
//     if (!videoCallType || !localStream) return;

//     const videoTrack = localStream.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsLocalVideoEnabled(videoTrack.enabled);

//       await supabase
//         .from("users")
//         .update({
//           isvideoon: videoTrack.enabled,
//         })
//         .eq("email", auth?.currentUser?.email);
//     }
//   };

//   const switchCamera = async () => {
//     if (!videoCallType || !localStream) return;

//     try {
//       const videoTrack = localStream.getVideoTracks()[0];
//       const constraints = {
//         video: {
//           facingMode: isFrontCamera ? 'environment' : 'user'
//         }
//       };

//       const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//       const newVideoTrack = newStream.getVideoTracks()[0];

//       // Replace track in peer connection
//       const sender = pcRef.current?.getSenders().find(s => 
//         s.track?.kind === 'video'
//       );
      
//       if (sender) {
//         await sender.replaceTrack(newVideoTrack);
//       }

//       // Update local stream
//       videoTrack.stop();
//       localStream.removeTrack(videoTrack);
//       localStream.addTrack(newVideoTrack);

//       setIsFrontCamera(!isFrontCamera);
//       newStream.getAudioTracks().forEach(track => track.stop());
      
//     } catch (error) {
//       console.error('❌ Error switching camera:', error);
//     }
//   };

//   const stopRingtone = () => {
//     if (ringtoneRef.current) {
//       ringtoneRef.current.pause();
//       ringtoneRef.current.currentTime = 0;
//     }
//   };

//   const formatCallTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col relative overflow-hidden">
//       {/* Header */}
//       <div className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-white/20 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             {/* <button 
//               onClick={onBackPress}
//               className="p-2 hover:bg-[#FFFAF5]/10 rounded-full transition-all duration-300"
//             >
//               <IoClose className="w-6 h-6 text-white" />
//             </button> */}
            
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 z-10 ${
//                   callInProgress ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
//                 }`}></div>
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                   <FaUserCircle className="w-6 h-6 text-white" />
//                 </div>
//               </div>
              
//               <div>
//                 <h2 className="text-white font-semibold text-lg">
//                   {peerEmail || 'Unknown User'}
//                 </h2>
//                 <div className="flex items-center space-x-2 text-white/80 text-sm">
//                   <span className={`w-2 h-2 rounded-full ${
//                     callStatus === 'Connected' ? 'bg-green-500' : 
//                     callStatus === 'Connecting...' ? 'bg-yellow-500' : 'bg-red-500'
//                   }`}></span>
//                   <span>{callStatus}</span>
//                   {callInProgress && remoteStream && (
//                     <>
//                       <span>•</span>
//                       <span className="font-mono">{formatCallTime(callDuration)}</span>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Video/Audio Streams */}
//       <div className="flex-1 relative bg-black">
//         {videoCallType ? (
//           <>
//             {/* Remote Video */}
//             <div className="w-full h-full">
//               {remoteStream ? (
//                 <div className="w-full h-full relative">
//                   <video
//                     ref={remoteVideoRef}
//                     className="w-full h-full object-cover"
//                     autoPlay
//                     playsInline
//                     muted={false}
//                   />
//                   {/* Debug overlay */}
//                   <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
//                     📹 Remote Video: {remoteStream.getVideoTracks().length} track(s)
//                   </div>
//                 </div>
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
//                   <IoVideocamOff className="w-20 h-20 mb-4 opacity-50" />
//                   <p className="text-xl">Waiting for remote video...</p>
//                   <p className="text-sm mt-2">{callStatus}</p>
//                 </div>
//               )}
//             </div>
            
//             {/* Local Video */}
//             {localStream && isLocalVideoEnabled && (
//               <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
//                 <video
//                   ref={localVideoRef}
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   playsInline
//                   muted
//                   style={{ 
//                     transform: isFrontCamera ? 'scaleX(1)' : 'scaleX(-1)'
//                   }}
//                 />
//                 <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-white text-xs">You</span>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           // Audio call UI
//           <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
//             <div className="text-center">
//               <div className="relative mb-8">
//                 <div className="relative w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden">
//                   {avatar ? (
//                     <img src={avatar} alt="Caller" className="w-full h-full object-cover" />
//                   ) : (
//                     <IoPerson className="w-20 h-20 text-white" />
//                   )}
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold text-white mb-2">
//                 {peerEmail || 'Unknown User'}
//               </h2>
//               <p className="text-gray-300 text-lg mb-2">{callStatus}</p>
//               {callInProgress && remoteStream && (
//                 <p className="text-white text-xl font-semibold">
//                   {formatCallTime(callDuration)}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="relative z-20 bg-black/30 backdrop-blur-lg border-t border-white/20 px-6 py-6">
//         {callInProgress ? (
//           <div className="flex justify-center items-center space-x-6">
//             <button 
//               className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
//                 isMuted ? 'bg-red-500 text-white' : 'bg-[#FFFAF5]/20 text-white backdrop-blur-sm'
//               }`}
//               onClick={toggleMute}
//             >
//               {isMuted ? <IoMicOff className="w-7 h-7" /> : <IoMic className="w-7 h-7" />}
//               <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
//             </button>

//             {videoCallType && (
//               <button 
//                 className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
//                   !isLocalVideoEnabled ? 'bg-red-500 text-white' : 'bg-[#FFFAF5]/20 text-white backdrop-blur-sm'
//                 }`}
//                 onClick={toggleVideo}
//               >
//                 {isLocalVideoEnabled ? <IoVideocam className="w-7 h-7" /> : <IoVideocamOff className="w-7 h-7" />}
//                 <span className="text-xs mt-1">Video</span>
//               </button>
//             )}

//             <button 
//               className="flex flex-col items-center justify-center w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300"
//               onClick={onBackPress}
//             >
//               <MdCallEnd className="w-8 h-8" />
//               <span className="text-xs mt-1">End</span>
//             </button>

//             {videoCallType && (
//               <button 
//                 className="flex flex-col items-center justify-center w-16 h-16 bg-[#FFFAF5]/20 text-white rounded-2xl backdrop-blur-sm transition-all duration-300"
//                 onClick={switchCamera}
//               >
//                 <IoCameraReverse className="w-7 h-7" />
//                 <span className="text-xs mt-1">Flip</span>
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="flex justify-center">
//             {!localStream ? (
//               <button 
//                 className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold"
//                 onClick={handlePermissions}
//               >
//                 <IoVideocam className="w-6 h-6" />
//                 <span>Grant Permissions</span>
//               </button>
//             ) : (
//               <button 
//                 className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold animate-pulse"
//                 onClick={joinCall}
//               >
//                 <IoCall className="w-6 h-6" />
//                 <span>Join Call</span>
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  IoCall,
  IoVideocam,
  IoVideocamOff,
  IoMic,
  IoMicOff,
  IoCameraReverse,
  IoPerson,
  IoClose
} from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { Heart } from 'lucide-react';

// ✅ Socket.IO connection (Backend URL)
const socket = io("https://omnigive-global.onrender.com");

export default function JoinScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {};
  
  const { 
    roomId, 
    peerEmail, 
    peerName,
    avatar,
    isVideoCall = true,
    receiverId
  } = params;

  // State declarations
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [videoCallType, setVideoCallType] = useState(isVideoCall);
  const [isCallhangup, setIsCallhangup] = useState(false);

  // ✅ Proposal modal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [ringType, setRingType] = useState("Gold Ring");

  // Refs
  const callTimerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("token");

  // ✅ Socket.IO call handling
  useEffect(() => {
    if (!currentUser?.id) return;

    socket.emit("addUser", currentUser.id);

    socket.on("callAccepted", (signal) => {
      setCallStatus("Connected");
      setCallInProgress(true);
      if (pcRef.current) {
        pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      }
    });

    socket.on("iceCandidate", (candidate) => {
      if (pcRef.current) {
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("callEnded", () => {
      setCallStatus("Call Ended");
      cleanupConnections();
      setTimeout(() => navigate(-1), 1500);
    });

    return () => {
      socket.off("callAccepted");
      socket.off("iceCandidate");
      socket.off("callEnded");
    };
  }, [currentUser?.id]);

  // Call timer
  useEffect(() => {
    if (callInProgress) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callInProgress]);

  // ✅ Cleanup
  const cleanupConnections = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setRemoteStream(null);
    setCallInProgress(false);
    setCallDuration(0);
  };

  // ✅ Handle Permissions
  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: videoCallType 
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      setCallStatus('Permissions Denied');
      return false;
    }
  };

  // ✅ Join Call (Callee - Answer)
  const joinCall = async () => {
    if (!localStream) return;

    setCallStatus('Connecting...');
    setCallInProgress(true);

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // Add local tracks
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Remote track handling
      pc.ontrack = (event) => {
        const newStream = event.streams[0];
        setRemoteStream(newStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = newStream;
        }
        setCallStatus('Connected');
      };

      // ICE candidate handling
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { to: roomId, candidate: event.candidate });
        }
      };

      // Get offer from caller (via socket or from roomId)
      // Yahan hum maan rahe hain ki caller ne offer bheja hai
      // Actual implementation mein caller se offer aana chahiye

    } catch (error) {
      setCallStatus('Connection Failed');
      cleanupConnections();
    }
  };

  // ✅ End Call
  const handleHangup = () => {
    socket.emit("endCall", { to: roomId });
    cleanupConnections();
    navigate(-1);
  };

  // ✅ Toggle Mute
  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  // ✅ Toggle Video
  const toggleVideo = () => {
    if (!videoCallType || !localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsLocalVideoEnabled(videoTrack.enabled);
    }
  };

  // ✅ Switch Camera
  const switchCamera = async () => {
    if (!videoCallType || !localStream) return;
    try {
      const constraints = {
        video: { facingMode: isFrontCamera ? 'environment' : 'user' }
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newVideoTrack = newStream.getVideoTracks()[0];

      const sender = pcRef.current?.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      const oldTrack = localStream.getVideoTracks()[0];
      localStream.removeTrack(oldTrack);
      localStream.addTrack(newVideoTrack);
      oldTrack.stop();

      setIsFrontCamera(!isFrontCamera);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  // ✅ Send Proposal
  const sendProposal = async () => {
    try {
      const res = await fetch("https://omnigive-global.onrender.com/api/proposal/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: receiverId || roomId,
          ringType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Proposal sent to ${peerName}! 💖`);
        setShowProposalModal(false);
      } else {
        alert(data.error || "Failed to send proposal");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 z-10 ${
                  callInProgress ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`}></div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {peerName || peerEmail || 'Unknown User'}
                </h2>
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    callStatus === 'Connected' ? 'bg-green-500' : 
                    callStatus === 'Connecting...' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span>{callStatus}</span>
                  {callInProgress && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{formatCallTime(callDuration)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video/Audio Streams */}
      <div className="flex-1 relative bg-black">
        {videoCallType ? (
          <>
            {remoteStream ? (
              <div className="w-full h-full relative">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <IoVideocamOff className="w-20 h-20 mb-4 opacity-50" />
                <p className="text-xl">Waiting for remote video...</p>
              </div>
            )}
            
            {localStream && isLocalVideoEnabled && (
              <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                  style={{ transform: isFrontCamera ? 'scaleX(1)' : 'scaleX(-1)' }}
                />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs">You</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="relative w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Caller" className="w-full h-full object-cover" />
                  ) : (
                    <IoPerson className="w-20 h-20 text-white" />
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{peerName || peerEmail}</h2>
              <p className="text-gray-300 text-lg mb-2">{callStatus}</p>
              {callInProgress && (
                <p className="text-white text-xl font-semibold">{formatCallTime(callDuration)}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-20 bg-black/30 backdrop-blur-lg border-t border-white/20 px-6 py-6">
        {callInProgress ? (
          <div className="flex justify-center items-center space-x-6">
            <button 
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
              }`}
              onClick={toggleMute}
            >
              {isMuted ? <IoMicOff className="w-7 h-7" /> : <IoMic className="w-7 h-7" />}
              <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {videoCallType && (
              <button 
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                  !isLocalVideoEnabled ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                }`}
                onClick={toggleVideo}
              >
                {isLocalVideoEnabled ? <IoVideocam className="w-7 h-7" /> : <IoVideocamOff className="w-7 h-7" />}
                <span className="text-xs mt-1">Video</span>
              </button>
            )}

            {/* ✅ Proposal Button */}
            <button 
              className="flex flex-col items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-2xl transition-all hover:bg-pink-600"
              onClick={() => setShowProposalModal(true)}
            >
              <Heart className="w-7 h-7" />
              <span className="text-xs mt-1">Propose</span>
            </button>

            <button 
              className="flex flex-col items-center justify-center w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
              onClick={handleHangup}
            >
              <MdCallEnd className="w-8 h-8" />
              <span className="text-xs mt-1">End</span>
            </button>

            {videoCallType && (
              <button 
                className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 text-white rounded-2xl transition-all"
                onClick={switchCamera}
              >
                <IoCameraReverse className="w-7 h-7" />
                <span className="text-xs mt-1">Flip</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            {!localStream ? (
              <button 
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold"
                onClick={handlePermissions}
              >
                <IoVideocam className="w-6 h-6" />
                <span>Grant Permissions</span>
              </button>
            ) : (
              <button 
                className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold animate-pulse"
                onClick={joinCall}
              >
                <IoCall className="w-6 h-6" />
                <span>Join Call</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Propose to {peerName || 'User'}
              </h2>
              <button onClick={() => setShowProposalModal(false)} className="text-gray-400">
                <IoClose size={24} />
              </button>
            </div>
            <p className="text-gray-500 mb-4">Ek ring choose karein</p>
            <div className="space-y-3 mb-6">
              {[
                { name: "Gold Ring", price: 500, icon: "🥇" },
                { name: "Diamond Ring", price: 2000, icon: "💎" },
                { name: "Platinum Ring", price: 5000, icon: "💍" },
              ].map((ring) => (
                <div
                  key={ring.name}
                  onClick={() => setRingType(ring.name)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition ${
                    ringType === ring.name ? "border-pink-600 bg-pink-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ring.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800">{ring.name}</p>
                      <p className="text-sm text-yellow-600">🪙 {ring.price} coins</p>
                    </div>
                  </div>
                  {ringType === ring.name && <Heart className="text-pink-600" fill="currentColor" />}
                </div>
              ))}
            </div>
            <button
              onClick={sendProposal}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-bold"
            >
              <Heart size={20} className="inline mr-2" /> Send Proposal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}