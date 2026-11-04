import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FaPhone, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVolumeUp,
  FaUserCircle
} from "react-icons/fa";

const socket = io("http://localhost:5000");

export default function VoiceCall() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stateUser = location.state?.user;
  const partnerName = stateUser?.name || "User";
  const partnerAvatar = stateUser?.avatar || null;

  const [stream, setStream] = useState(null);
  const [isMicReady, setIsMicReady] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callInitiated, setCallInitiated] = useState(false); // Call lagayi

  const connectionRef = useRef();
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Mic & Socket
  useEffect(() => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((currentStream) => {
        setStream(currentStream);
        setIsMicReady(true);
      })
      .catch(() => {
        alert("Microphone access denied! Please allow mic and refresh.");
      });

    socket.emit("addUser", currentUser.id);

    socket.on("callUser", ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
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

  // Timer
  useEffect(() => {
    if (callAccepted) {
      timerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callAccepted]);

  // Call Initiate
  const callUser = () => {
    if (!isMicReady || !stream) {
      alert("Mic still loading. Please wait.");
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
      if (audioRef.current) audioRef.current.srcObject = event.streams[0];
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

  // Answer Call
  const answerCall = () => {
    if (!isMicReady || !stream) {
      alert("Mic still loading. Please wait.");
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
      if (audioRef.current) audioRef.current.srcObject = event.streams[0];
    };

    peer.setRemoteDescription(new RTCSessionDescription(callerSignal));

    peer.createAnswer().then((answer) => {
      peer.setLocalDescription(answer);
      socket.emit("answerCall", { signal: answer, to: caller });
    });

    connectionRef.current = peer;
  };

  // End Call
  const leaveCall = () => {
    socket.emit("endCall", { to: userId });
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.close();
    clearInterval(timerRef.current);
    navigate(-1);
  };

  // Mute
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Time Formatter
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen relative flex flex-col items-center justify-between text-white overflow-hidden py-10 px-4 bg-[#111]">
      
      {/* Background - Dark check pattern jaisa phone mein hota hai */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(#222 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      ></div>

      <audio ref={audioRef} autoPlay className="hidden" />

      {/* Partner Info */}
      <div className="text-center z-10">
        <h1 className="text-3xl font-bold mb-2">{partnerName}</h1>
        <p className="text-gray-400 text-sm">
          {!isMicReady 
            ? "Connecting..." 
            : callAccepted 
              ? "Connected" 
              : receivingCall 
                ? "Incoming Call" 
                : callInitiated 
                  ? "Calling..." 
                  : "Ready to Call"}
        </p>
        {callAccepted && (
          <p className="text-green-400 text-lg font-bold mt-2">{formatTime(callDuration)}</p>
        )}
      </div>

      {/* Avatar */}
      <div className="relative flex items-center justify-center z-10">
        <div className="w-36 h-36 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-600 relative">
          {partnerAvatar ? (
            <img src={partnerAvatar} alt={partnerName} className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="text-gray-500 text-8xl" />
          )}
        </div>
      </div>

      {/* Controls - Phone jaisa layout */}
      <div className="w-full flex justify-center items-center gap-10 z-10">
        
        {/* State 1: Start Call (Call lagane ke liye) */}
        {!callInitiated && !receivingCall && !callAccepted && (
          <button 
            onClick={callUser} 
            disabled={!isMicReady}
            className={`w-16 h-16 flex items-center justify-center rounded-full ${
              isMicReady ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <FaPhone size={24} className="text-white" />
          </button>
        )}

        {/* State 2: Calling... (Call lag gayi, cut karne ke liye) */}
        {callInitiated && !callAccepted && (
          <button 
            onClick={leaveCall} 
            className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500"
          >
            <FaPhoneSlash size={24} className="text-white" />
          </button>
        )}

        {/* State 3: Incoming Call (Dono buttons - Green Accept, Red Reject) */}
        {receivingCall && !callAccepted && (
          <>
            {/* Green Accept */}
            <button 
              onClick={answerCall} 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 animate-bounce"
            >
              <FaPhone size={24} className="text-white" />
            </button>
            {/* Red Reject */}
            <button 
              onClick={leaveCall} 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500"
            >
              <FaPhoneSlash size={24} className="text-white" />
            </button>
          </>
        )}

        {/* State 4: Connected (Mute, Speaker, End Call) */}
        {callAccepted && (
          <>
            <button 
              onClick={toggleMute} 
              className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-700"
            >
              {isMuted ? <FaMicrophoneSlash size={20} className="text-white" /> : <FaMicrophone size={20} className="text-white" />}
            </button>

            <button 
              className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-700"
            >
              <FaVolumeUp size={20} className="text-white" />
            </button>

            <button 
              onClick={leaveCall} 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500"
            >
              <FaPhoneSlash size={24} className="text-white" />
            </button>
          </>
        )}
      </div>

      {callEnded && (
        <p className="absolute bottom-24 text-red-400 font-bold tracking-widest z-10">CALL ENDED</p>
      )}
    </div>
  );
}