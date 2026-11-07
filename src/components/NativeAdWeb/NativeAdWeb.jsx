// // // // import React, { useEffect } from "react";
// // // // import "./NativeAd.css";

// // // // const NativeAdWeb = () => {
// // // //   useEffect(() => {
// // // //     // Try to render the ad after component mounts
// // // //     try {
// // // //       (window.adsbygoogle = window.adsbygoogle || []).push({});
// // // //     } catch (err) {
// // // //       console.error("AdSense error:", err);
// // // //     }
// // // //   }, []);

// // // //   return (
// // // //     <div className="ad-card">
// // // //       <p className="ad-label">Sponsored</p>

// // // //       <div className="ad-container">
// // // //         {/* ✅ Test Ad */}
// // // //         <ins
// // // //           className="adsbygoogle"
// // // //           style={{ display: "block", textAlign: "center" }}
// // // //           data-ad-client="ca-pub-3940256099942544"
// // // //           data-ad-slot="6300978111"
// // // //           data-ad-format="auto"
// // // //           data-full-width-responsive="true"
// // // //         ></ins>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default NativeAdWeb;

// // // import React, { useEffect, useState } from "react";
// // // import "./NativeAd.css";

// // // const NativeAdWeb = () => {
// // //   const [adLoaded, setAdLoaded] = useState(false);

// // //   useEffect(() => {
// // //     try {
// // //       (window.adsbygoogle = window.adsbygoogle || []).push({});
// // //       setTimeout(() => setAdLoaded(true), 2000); // simulate ad load
// // //     } catch (err) {
// // //       console.error("AdSense error:", err);
// // //     }
// // //   }, []);

// // //   return (
// // //     <div className="ad-card">
// // //       <p className="ad-label">Sponsored</p>

// // //       <div className="ad-container">
// // //         {adLoaded ? (
// // //           <ins
// // //             className="adsbygoogle"
// // //             style={{ display: "block", textAlign: "center" }}
// // //             data-ad-client="ca-pub-3940256099942544"
// // //             data-ad-slot="6300978111"
// // //             data-ad-format="auto"
// // //             data-full-width-responsive="true"
// // //           ></ins>
// // //         ) : (
// // //           <div className="mock-ad">
// // //             <img
// // //               src="https://via.placeholder.com/320x100?text=Google+Test+Ad"
// // //               alt="test ad"
// // //             />
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default NativeAdWeb;

// // import React, { useEffect, useRef } from "react";
// // import "./NativeAd.css";

// // const NativeAdWeb = () => {
// //   const adRef = useRef(null);

// //   useEffect(() => {
// //     const timeout = setTimeout(() => {
// //       try {
// //         if (window.adsbygoogle && adRef.current) {
// //           (window.adsbygoogle = window.adsbygoogle || []).push({});
// //           console.log("✅ Ad request pushed");
// //         } else {
// //           console.warn("⚠️ AdSense not yet ready");
// //         }
// //       } catch (e) {
// //         console.error("AdSense error:", e);
// //       }
// //     }, 1000);

// //     return () => clearTimeout(timeout);
// //   }, []);

// //   return (
// //     <div className="ad-card">
// //       <p className="ad-label">Sponsored</p>
// //       <div className="ad-container">
// //         <ins
// //           ref={adRef}
// //           className="adsbygoogle"
// //           style={{ display: "block", textAlign: "center", minHeight: "100px" }}
// //           data-ad-client="ca-pub-3940256099942544"
// //           data-ad-slot="6300978111"
// //           data-ad-format="auto"
// //           data-full-width-responsive="true"
// //         ></ins>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NativeAdWeb;

// import React, { useEffect, useRef } from "react";
// import "./NativeAd.css";

// const NativeAdWeb = () => {
//   const adRef = useRef(null);

//   useEffect(() => {
//     // Wait until script is available
//     const checkAds = setInterval(() => {
//       if (window.adsbygoogle && adRef.current) {
//         try {
//           (window.adsbygoogle = window.adsbygoogle || []).push({});
//           console.log("✅ AdSense ad request sent");
//           clearInterval(checkAds);
//         } catch (err) {
//           console.error("AdSense error:", err);
//         }
//       }
//     }, 500);

//     return () => clearInterval(checkAds);
//   }, []);

//   return (
//     <div className="ad-card">
//       <p className="ad-label">Sponsored</p>
//       <div className="ad-container">
//         <ins
//           ref={adRef}
//           className="adsbygoogle"
//           style={{ display: "block", textAlign: "center", minHeight: "100px" }}
//           data-ad-client="ca-pub-3940256099942544"
//           data-ad-slot="6300978111"
//           data-ad-format="auto"
//           data-full-width-responsive="true"
//         ></ins>
//       </div>
//     </div>
//   );
// };

// export default NativeAdWeb;



import React, { useEffect, useRef, useState } from "react";

const NativeAdWeb = () => {
  const adRef = useRef(null);
  const [adData, setAdData] = useState(null);

  // Google AdSense Test IDs
  const AD_CLIENT = "ca-pub-3940256099942544"; // Test Publisher ID
  const AD_SLOT = "2247696080"; // Test Native Ad Slot

  // Load AdSense script
  useEffect(() => {
    if (!window.adsbygoogle) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      script.onload = () => {
        console.log("✅ AdSense script loaded");
        pushAd();
      };
    } else {
      pushAd();
    }

    function pushAd() {
      // Wait for the <ins> element to exist
      const interval = setInterval(() => {
        if (adRef.current && window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log("✅ AdSense test ad pushed");
            clearInterval(interval);
          } catch (e) {
            console.error("❌ AdSense push error:", e);
          }
        }
      }, 500);
    }
  }, []);

  // Fallback React Native-style test ad
  useEffect(() => {
    setTimeout(() => {
      setAdData({
        headline: "Test Ad - Amazing App",
        body: "This is a Google Test Ad. In production, real ads will show here.",
        advertiser: "Google Test",
        callToAction: "Install Now",
        starRating: 4.5,
        price: "FREE",
        icon: "https://via.placeholder.com/50x50/DD2476/ffffff?text=G",
        image: "https://via.placeholder.com/300x150/DD2476/ffffff?text=Test+Ad",
      });
    }, 500);
  }, []);

  if (!adData) {
    return (
      <div className="max-w-md mx-auto my-4 px-2">
        <div className="bg-gray-200 rounded-xl h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-4 px-2">
      {/* React-styled Native Test Ad */}
      <div className="bg-[#FFFAF5] rounded-2xl p-4 border-l-4 border-[#DD2476] shadow-lg shadow-orange-500/10 mb-4">
        <div className="flex items-start space-x-3 mb-3">
          <img
            src={adData.icon}
            alt="Icon"
            className="w-12 h-12 rounded-xl border border-gray-200"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{adData.headline}</h3>
            <p className="text-sm text-gray-600">{adData.advertiser}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">{adData.body}</p>
        <img
          src={adData.image}
          alt="Ad"
          className="w-full h-32 object-cover rounded-xl mb-3"
        />
        <div className="flex justify-between items-center">
          <span className="text-yellow-500 font-semibold">
            ⭐ {adData.starRating}/5
          </span>
          <span className="text-gray-900 font-semibold">{adData.price}</span>
          <button className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white px-4 py-2 rounded-full font-bold">
            {adData.callToAction}
          </button>
        </div>
      </div>

      {/* Google AdSense Test Ad */}
      <div className="mt-4 text-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOT}
          data-ad-format="fluid"
          data-ad-layout="in-article"
          data-adtest="on" // ✅ This enables test ads
        ></ins>
      </div>

      {/* Test Mode Indicator */}
      <div className="text-center mt-2 text-xs text-gray-500">
        ✅ Test Ads Mode Active 
      </div>
    </div>
  );
};

export default NativeAdWeb;