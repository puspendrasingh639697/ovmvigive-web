


import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
// ✅ import your existing rtdb
import { rtdb } from "../../firebase/config"; // ✅ import your existing rtdb

const Privacy = () => {
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Reference to your Firebase Realtime Database path
    const privacyRef = ref(rtdb, "Terms/privacy");

    // 👂 Listen for changes in realtime
    const unsubscribe = onValue(privacyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPrivacyUrl(data);
        // 🔥 Automatically open the privacy URL in a new tab
        window.location.href = data;
      }
      setLoading(false);
    });

    // 🧹 Clean up listener
    return () => unsubscribe();
  }, []);

  // Optional: You can keep a fallback message while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {loading ? (
        <p className="text-gray-600 animate-pulse">Loading...</p>
      ) : (
        <p className="text-gray-700">Redirecting to Privacy Policy...</p>
      )}
    </div>
  );
};

export default Privacy;