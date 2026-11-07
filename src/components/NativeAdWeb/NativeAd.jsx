// import React, { useEffect, useState } from 'react';

// const NativeAdExample = () => {
//   const [adLoaded, setAdLoaded] = useState(false);
//   const [adData, setAdData] = useState(null);

//   // Simulate ad loading
//   useEffect(() => {
//     const loadAd = () => {
//       setTimeout(() => {
//         setAdData({
//           headline: "Amazing Game App",
//           body: "Discover this incredible gaming experience with amazing features and graphics that will blow your mind!",
//           advertiser: "Game Studio Inc.",
//           callToAction: "Install Now",
//           starRating: 4.7,
//           price: "FREE",
//           icon: "https://via.placeholder.com/50x50/DD2476/ffffff?text=G",
//           image: "https://via.placeholder.com/300x150/DD2476/ffffff?text=Game+Ad"
//         });
//         setAdLoaded(true);
//       }, 1000);
//     };

//     loadAd();

//     // Load Google AdSense
//     const loadAdSense = () => {
//       const script = document.createElement('script');
//       script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3940256099942544';
//       script.async = true;
//       script.crossOrigin = 'anonymous';
//       document.head.appendChild(script);
//     };

//     loadAdSense();
//   }, []);

//   if (!adLoaded) {
//     return (
//       <div className="max-w-md mx-auto my-4 px-2">
//         <div className="text-xs text-gray-500 mb-2 ml-2 font-medium">Sponsored</div>
        
//         {/* Loading Skeleton */}
//         <div className="bg-[#FFFAF5] rounded-2xl p-4 border-l-4 border-[#DD2476] shadow-lg shadow-orange-500/10 min-h-[120px]">
//           <div className="flex flex-col space-y-3">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
//                 <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-1/2"></div>
//               </div>
//             </div>
//             <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
//             <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
//             <div className="flex justify-between items-center">
//               <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-20"></div>
//               <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse w-24"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto my-4 px-2">
//       {/* Ad Label */}
//       <div className="text-xs text-gray-500 mb-2 ml-2 font-medium">Sponsored</div>
      
//       {/* Main Ad Container */}
//       <div className="bg-[#FFFAF5] rounded-2xl p-4 border-l-4 border-[#DD2476] shadow-lg shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300">
        
//         {/* Header - Icon and Title */}
//         <div className="flex items-start space-x-3 mb-3">
//           {/* App Icon */}
//           <div className="flex-shrink-0">
//             <img 
//               src={adData.icon} 
//               alt="App Icon"
//               className="w-12 h-12 rounded-xl object-cover border border-gray-200"
//             />
//           </div>
          
//           {/* Title and Advertiser */}
//           <div className="flex-1 min-w-0">
//             <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
//               {adData.headline}
//             </h3>
//             <p className="text-sm text-gray-600 font-medium mt-1">
//               {adData.advertiser}
//             </p>
//           </div>
//         </div>

//         {/* Ad Body Text */}
//         <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-2">
//           {adData.body}
//         </p>

//         {/* Media Image */}
//         <div className="relative mb-3">
//           <div className="w-full h-32 rounded-xl bg-gray-100 overflow-hidden">
//             <img 
//               src={adData.image} 
//               alt="Ad Media"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>

//         {/* Footer - Rating and CTA */}
//         <div className="flex items-center justify-between">
//           {/* Rating and Price */}
//           <div className="flex-1">
//             <div className="flex items-center space-x-2">
//               <div className="flex items-center space-x-1">
//                 <span className="text-yellow-500">⭐</span>
//                 <span className="text-sm font-semibold text-amber-600">
//                   {adData.starRating}/5
//                 </span>
//               </div>
//               {adData.price && (
//                 <span className="text-sm font-semibold text-gray-900">
//                   • {adData.price}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* CTA Button */}
//           <button className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] hover:from-[#DD2476] hover:to-[#FF512F] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-green-800/30 hover:shadow-xl hover:shadow-green-800/40 transition-all duration-300 transform hover:scale-105 min-w-24 text-center">
//             {adData.callToAction}
//           </button>
//         </div>
//       </div>

//       {/* Google AdSense Native Ad */}
//       <div className="mt-4">
//         <ins 
//           className="adsbygoogle"
//           style={{ display: 'block' }}
//           data-ad-format="fluid"
//           data-ad-layout-key="-gw-3+1f-3d+2z"
//           data-ad-client="ca-pub-3940256099942544"
//           data-ad-slot="1234567890"
//         />
//       </div>
//     </div>
//   );
// };

// export default NativeAdExample;


import React, { useEffect, useRef, useState } from "react";

const NativeAdExample = () => {
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
      setTimeout(() => {
        try {
          if (adRef.current) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log("✅ AdSense test ad pushed");
          }
        } catch (e) {
          console.error("❌ AdSense push error:", e);
        }
      }, 500); // small delay to ensure <ins> is in DOM
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
          data-adtest="on"
        ></ins>
      </div>

      {/* Test Mode Indicator */}
      <div className="text-center mt-2 text-xs text-gray-500">
        ✅ Test Ads Mode Active 
      </div>
    </div>
  );
};

export default NativeAdExample;