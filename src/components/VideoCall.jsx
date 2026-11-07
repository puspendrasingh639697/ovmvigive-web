import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash,
  FaUserCircle
} from "react-icons/fa";

const socket = io("https://omnigive-global.onrender.com");

export default function VideoCall() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stateUser = location.state?.user;
  const partnerName = stateUser?.name || "User";
  const partnerAvatar = stateUser?.avatar || null;

  const [stream, setStream] = useState(null);
  const [isCamReady, setIsCamReady] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callInitiated, setCallInitiated] = useState(false);

  const connectionRef = useRef();
  const myVideo = useRef();
  const userVideo = useRef();
  const timerRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // 1. Camera + Mic Access
  useEffect(() => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setIsCamReady(true);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch(() => {
        alert("Camera/Mic access denied! Please allow from browser settings.");
      });

    socket.emit("addUser", currentUser.id);

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerName(callerName || "Unknown");
      setCallerSignal(signal);
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      }
    });

    socket.on("iceCandidate", (candidate) => {
      if (connectionRef.current) {
        connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("callEnded", () => {
      setCallEnded(true);
      if (connectionRef.current) connectionRef.current.close();
      clearInterval(timerRef.current);
      setTimeout(() => navigate(-1), 1500);
    });

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("iceCandidate");
      socket.off("callEnded");
      clearInterval(timerRef.current);
    };
  }, []);

  // 2. Timer
  useEffect(() => {
    if (callAccepted) {
      timerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callAccepted]);

  // 3. Call Initiate
  const callUser = () => {
    if (!isCamReady || !stream) {
      alert("Camera is still loading or blocked. Please allow camera.");
      return;
    }

    setCallInitiated(true);

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { to: userId, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peer.createOffer().then((offer) => {
      peer.setLocalDescription(offer);
      socket.emit("callUser", {
        userToCall: userId,
        signalData: offer,
        from: currentUser.id,
        name: currentUser.name,
      });
    });

    connectionRef.current = peer;
  };

  // 4. Call Accept
  const answerCall = () => {
    if (!isCamReady || !stream) {
      alert("Camera is still loading or blocked. Please allow camera.");
      return;
    }

    setCallAccepted(true);

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { to: caller, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peer.setRemoteDescription(new RTCSessionDescription(callerSignal));

    peer.createAnswer().then((answer) => {
      peer.setLocalDescription(answer);
      socket.emit("answerCall", { signal: answer, to: caller });
    });

    connectionRef.current = peer;
  };

  // 5. End Call
  const leaveCall = () => {
    socket.emit("endCall", { to: userId });
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.close();
    clearInterval(timerRef.current);
    navigate(-1);
  };

  // 6. Mute
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 7. Video On/Off
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  // 8. Time Formatter
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen relative flex flex-col bg-black text-white overflow-hidden">
      
      {/* Main Video Area */}
      <div className="flex-1 relative">
        
        {/* Remote Video (Partner) - Full Screen */}
        {callAccepted && !callEnded ? (
          <video 
            ref={userVideo} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
            <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/20 shadow-2xl mb-4 overflow-hidden">
              {partnerAvatar ? (
                <img src={partnerAvatar} alt={partnerName} className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="text-gray-300 text-8xl" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-1">{partnerName}</h1>
            <p className="text-green-200/80 text-sm">
              {!isCamReady 
                ? "Camera Blocked - Please Allow" 
                : receivingCall 
                  ? "Incoming Video Call..." 
                  : callInitiated 
                    ? "Calling..." 
                    : "Ready to Call"}
            </p>
            {callAccepted && (
              <p className="text-green-300 text-lg font-bold mt-1 tracking-widest">{formatTime(callDuration)}</p>
            )}
          </div>
        )}

        {/* Local Video (Aap) - Small Overlay */}
        {isCamReady && stream && !isVideoOff && (
          <div className="absolute top-4 right-4 w-28 h-40 md:w-40 md:h-56 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl">
            <video 
              ref={myVideo} 
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Timer (Top Center) */}
        {callAccepted && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1 rounded-full text-sm">
            {formatTime(callDuration)}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/60 backdrop-blur-md p-4 flex justify-center items-center gap-4">
        {/* Mute */}
        {callAccepted && (
          <>
            <button 
              onClick={toggleMute} 
              className={`p-4 rounded-full ${isMuted ? "bg-red-600" : "bg-gray-700"} hover:scale-110 transition`}
            >
              {isMuted ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
            </button>

            {/* Video On/Off */}
            <button 
              onClick={toggleVideo} 
              className={`p-4 rounded-full ${isVideoOff ? "bg-red-600" : "bg-gray-700"} hover:scale-110 transition`}
            >
              {isVideoOff ? <FaVideoSlash size={20} /> : <FaVideo size={20} />}
            </button>
          </>
        )}

        {/* Call Button (Initiate / Answer / End) */}
        {!callAccepted && !receivingCall && !callInitiated && (
          <button 
            onClick={callUser}
            disabled={!isCamReady}
            className={`p-5 rounded-full shadow-xl transition ${
              isCamReady 
                ? "bg-green-600 hover:bg-green-500 hover:scale-110" 
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            <FaVideo size={24} />
          </button>
        )}

        {receivingCall && !callAccepted && (
          <button 
            onClick={answerCall}
            disabled={!isCamReady}
            className={`p-5 rounded-full shadow-xl transition ${
              isCamReady 
                ? "bg-green-600 hover:bg-green-500 hover:scale-110 animate-bounce" 
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            <FaVideo size={24} />
          </button>
        )}

        {(callAccepted || receivingCall || callInitiated) && !callEnded && (
          <button 
            onClick={leaveCall} 
            className="bg-red-600 hover:bg-red-500 p-5 rounded-full shadow-xl hover:scale-110 transition"
          >
            <FaPhoneSlash size={24} />
          </button>
        )}
      </div>

      {callEnded && (
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-red-300 font-bold tracking-widest">CALL ENDED</p>
      )}
    </div>
  );
}