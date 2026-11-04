// import React, { useEffect, useState } from "react";
// import { ref, onValue } from "firebase/database";
// import { rtdb } from "../../firebase/config"; // ✅ import your existing rtdb
//  // ✅ import your existing rtdb

// const Terms = () => {
//   const [privacyUrl, setPrivacyUrl] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const privacyRef = ref(rtdb, "Terms/terms");

//     // 👂 Listen for changes in realtime
//     const unsubscribe = onValue(privacyRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setPrivacyUrl(data);
//       }
//       setLoading(false);
//     });

//     // 🧹 Clean up listener
//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
//       <h1 className="text-3xl font-semibold text-gray-900 mb-6">
//         Privacy Policy
//       </h1>

//       {loading ? (
//         <p className="text-gray-600 animate-pulse">Loading...</p>
//       ) : privacyUrl ? (
//         <div className="bg-[#FFFAF5] shadow-lg rounded-2xl p-6 w-full max-w-2xl text-center">
//           <p className="text-gray-700 mb-4">
//             You can view our privacy policy here:
//           </p>
//           <a
//             href={privacyUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:text-blue-800 font-medium underline"
//           >
//             {privacyUrl}
//           </a>
//         </div>
//       ) : (
//         <p className="text-red-500">Privacy policy not found.</p>
//       )}
//     </div>
//   );
// };

// export default Terms;








import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
// ✅ import your existing rtdb
import { rtdb } from "../../firebase/config"; // ✅ import your existing rtdb

const Terms = () => {
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Reference to your Firebase Realtime Database path
   const privacyRef = ref(rtdb, "Terms/terms");

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

export default Terms;