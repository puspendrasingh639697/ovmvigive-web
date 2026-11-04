


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "../firebase/supabaseClient"; 
import { auth } from "../firebase/config";
import { getDatabase, ref, onValue } from "firebase/database";
import { getApp } from "firebase/app";

// Web compatible icons (React Icons library)
import { FaGem, FaStar, FaTrophy, FaGift, FaShieldAlt, FaCreditCard, FaMobileAlt, FaBuilding, FaFire, FaBolt } from 'react-icons/fa';
import { IoIosArrowForward, IoIosFlash, IoIosRocket } from 'react-icons/io';
import { GiDiamondTrophy } from 'react-icons/gi';
import Footer from '../components/MainSrceen/Footer';

const DiamondPurchaseScreen = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [diamondPackages, setDiamondPackages] = useState({ INR: [], USD: [] });
  const [diamondProducts, setDiamondProducts] = useState([]);
  const [diamondSave, setDiamondSave] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const processedPurchases = useRef(new Set());

  // Web के लिए platform detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Dynamic product SKUs based on platform and currency (Web compatible)
  const getProductSkus = useCallback(() => {
    const baseSkus = {
      INR: isAndroid ? 
        ["diamond_35", "diamond_50", "diamond_150", "diamond_500", "diamond_900", "diamond_1500"] :
        ["diamond_35", "diamond_50", "diamond_150", "diamond_500", "diamond_900", "diamond_1500"],
      USD: isAndroid ? 
        ["diamond_10_usd", "diamond_50_usd", "diamond_150_usd", "diamond_500_usd", "diamond_900_usd", "diamond_1500_usd"] :
        ["diamond_10_usd", "diamond_50_usd", "diamond_150_usd", "diamond_500_usd", "diamond_900_usd", "diamond_1500_usd"]
    };
    return baseSkus[selectedCurrency] || [];
  }, [selectedCurrency, isAndroid]);

  // Web payment initialization (Stripe, Razorpay, etc.)
  useEffect(() => {
    const initPayments = async () => {
      try {
        console.log("Payment system initialized for web");
        const selectedSkus = getProductSkus();
        console.log("Loading products for currency:", selectedCurrency, selectedSkus);
        
        // Web payment products simulation
        setDiamondProducts(selectedSkus.map(sku => ({
          productId: sku,
          title: `${sku} Diamond Package`,
          price: '0.99'
        })));

        setLoading(false);
      } catch (error) {
        console.error("Payment initialization error:", error);
        alert("Payment Error: Failed to initialize payment system.");
      }
    };

    initPayments();
  }, [selectedCurrency, getProductSkus]);

  // Fetch user diamond balance dynamically
  useEffect(() => {
    const email = auth.currentUser?.email;
    if (!email) return;

    const fetchDiamond = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("totaldiamond")
        .eq("email", email)
        .single();
      if (!error && data) {
        setDiamondSave(data.totaldiamond || 0);
      }
    };

    fetchDiamond();

    const channel = supabase
      .channel('diamond-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'users', 
          filter: `email=eq.${email}` 
        },
        (payload) => {
          if (payload.new) {
            setDiamondSave(payload.new.totaldiamond || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth.currentUser?.email]);

  // Fetch diamond packages dynamically from Firebase
  useEffect(() => {
    const app = getApp();
    const realtimeDB = getDatabase(app);
    const diamondRef = ref(realtimeDB, "diamondPackages");

    const unsubscribe = onValue(
      diamondRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const INR = Object.values(data.INR || {});
          const USD = Object.values(data.USD || {});
          setDiamondPackages({ INR, USD });
        } else {
          // Fallback data with diamond field
          const fallbackData = {
            INR: [
              { id: "diamond_5", diamond: "5", price: "₹5", saving: "10%", popular: true },
              { id: "diamond_50", diamond: "50", price: "₹50", saving: "15%" },
              { id: "diamond_150", diamond: "150", price: "₹150", saving: "20%", bestDeal: true },
              { id: "diamond_500", diamond: "500", price: "₹500", saving: "25%" },
              { id: "diamond_900", diamond: "900", price: "₹900", saving: "30%" },
              { id: "diamond_1500", diamond: "1500", price: "₹1500", saving: "35%", extra: "Bonus 100 Diamonds" }
            ],
            USD: [
              { id: "diamond_5_usd", diamond: "5", price: "$0.99", saving: "10%", popular: true },
              { id: "diamond_50_usd", diamond: "50", price: "$4.99", saving: "15%" },
              { id: "diamond_150_usd", diamond: "150", price: "$9.99", saving: "20%", bestDeal: true },
              { id: "diamond_500_usd", diamond: "500", price: "$29.99", saving: "25%" },
              { id: "diamond_900_usd", diamond: "900", price: "$49.99", saving: "30%" },
              { id: "diamond_1500_usd", diamond: "1500", price: "$79.99", saving: "35%", extra: "Bonus 200 Diamonds" }
            ]
          };
          setDiamondPackages(fallbackData);
        }
      },
      (error) => {
        console.error("Error fetching diamond packages:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const packages = diamondPackages[selectedCurrency] || [];

  const handlePurchase = async (packageItem) => {
    if (window.confirm(`Do you want to purchase ${packageItem.diamond} Diamonds for ${packageItem.price} ${selectedCurrency}?`)) {
      await completePurchase(packageItem);
    }
  };

  const completePurchase = async (packageItem) => {
    try {
      setPurchasing(true);
      
      // Web payment integration (Stripe, Razorpay, etc.)
      console.log("Initiating web payment for:", packageItem);
      
      // Simulate web payment process
      await processDiamondPurchase(packageItem);
      
    } catch (error) {
      console.error("Purchase initiation error:", error);
      setPurchasing(false);
      alert("Error: Failed to initiate purchase: " + error.message);
    }
  };

  const processDiamondPurchase = async (packageItem) => {
    try {
      const email = auth.currentUser?.email;
      if (!email) throw new Error("User not found");

      const { data: userData, error: fetchErr } = await supabase
        .from("users")
        .select("totaldiamond, diamondpurchasehistory")
        .eq("email", email)
        .single();

      if (fetchErr) throw fetchErr;

      const currentDiamond = userData?.totaldiamond || 0;
      const currentHistory = Array.isArray(userData?.diamondpurchasehistory) 
        ? userData.diamondpurchasehistory 
        : [];

      const diamondAmount = Number(packageItem.diamondAmount || packageItem.diamond || 0);

      const newEntry = {
        packageid: packageItem.id,
        diamondamount: diamondAmount,
        price: packageItem.price,
        currency: packageItem.currency || selectedCurrency,
        date: new Date().toISOString(),
        txnId: `web_${Date.now()}`,
      };

      console.log("Adding diamonds:", diamondAmount);

      // Optimistic update
      setDiamondSave(currentDiamond + diamondAmount);

      const { error: updateErr } = await supabase
        .from("users")
        .update({
          totaldiamond: currentDiamond + diamondAmount,
          lastpurchase: new Date().toISOString(),
          diamondpurchasehistory: [...currentHistory, newEntry],
        })
        .eq("email", email);

      if (updateErr) throw updateErr;

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      alert(`Success 🎉\nYou've purchased ${diamondAmount} Diamonds!`);
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("Error: " + (error.message || "Something went wrong!"));
    } finally {
      setPurchasing(false);
    }
  };

  // Currency Button Component with enhanced 4D effects
  const CurrencyButton = ({ currency, label, isSelected, onPress }) => (
    <button 
      onClick={onPress}
      className={`group flex-1 py-6 px-5 rounded-2xl items-center justify-center border-2 relative overflow-hidden transition-all duration-500 transform perspective-1000 ${
        isSelected 
          ? 'bg-blue-500/30 scale-105 shadow-2xl shadow-blue-400/50 border-blue-300/70' 
          : 'bg-gray-800 scale-100 hover:scale-105 hover:bg-blue-500/20 hover:shadow-xl hover:shadow-blue-500/20'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
        isSelected ? 'translate-x-full group-hover:translate-x-0' : '-translate-x-full group-hover:translate-x-full'
      }`} />
      
      {/* Shine effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transform -skew-x-12 transition-all duration-1500 ${
        isSelected ? 'translate-x-full' : '-translate-x-full'
      }`} />
      
      <span className={`text-lg font-bold text-center relative z-10 flex items-center justify-center gap-2 ${
        isSelected ? 'text-white font-extrabold drop-shadow-lg' : 'text-white/90 group-hover:text-white'
      }`}>
        {label}
      </span>
      
      {isSelected && (
        <>
          <div className="absolute bottom-0 left-1/4 right-1/4 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
        </>
      )}
    </button>
  );

  // Diamond Package Card Component with black background and blue hover
  const DiamondPackageCard = ({ item, index }) => (
    <div 
      onMouseEnter={() => setHoveredCard(item.id)}
      onMouseLeave={() => setHoveredCard(null)}
      className={`group relative bg-black rounded-3xl p-6 border-2 transition-all duration-700 transform perspective-1000 ${
        item.popular 
          ? 'border-blue-400/70 bg-gradient-to-br from-black to-gray-900 shadow-2xl shadow-blue-400/30' 
          : item.bestDeal 
          ? 'border-teal-400/70 bg-gradient-to-br from-black to-gray-900 shadow-2xl shadow-teal-400/30'
          : 'border-gray-600 bg-gradient-to-br from-black to-gray-900 shadow-xl shadow-gray-800/50'
      } ${
        hoveredCard === item.id 
          ? 'scale-110 rotate-y-5 shadow-3xl z-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/70' 
          : 'scale-100 hover:scale-105'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Depth Effect */}
      <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
        hoveredCard === item.id 
          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-inner' 
          : ''
      }`} />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`absolute w-2 h-2 rounded-full transition-all duration-1000 ${
              item.popular ? 'bg-blue-400/50' : item.bestDeal ? 'bg-teal-400/50' : 'bg-blue-400/40'
            } ${hoveredCard === item.id ? 'opacity-100' : 'opacity-0'}`}
            style={{
              top: `${15 + dot * 15}%`,
              left: `${5 + dot * 18}%`,
              animation: `float${dot} 3s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Animated border glow */}
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 blur transition-all duration-700 ${
        hoveredCard === item.id ? 'opacity-70 animate-pulse' : ''
      }`} />

      {/* Badges with enhanced 3D effect */}
      {item.popular && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center px-4 py-3 rounded-xl gap-2 shadow-2xl shadow-blue-400/50 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 z-20">
          <FaFire size={18} color="#000" className="animate-pulse" />
          <span className="text-white text-sm font-black">HOT DEAL</span>
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-black/30 rounded-full" />
        </div>
      )}
      
      {item.bestDeal && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center px-4 py-3 rounded-xl gap-2 shadow-2xl shadow-teal-400/50 transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 z-20">
          <GiDiamondTrophy size={18} color="#000" className="animate-bounce" />
          <span className="text-black text-sm font-black">BEST VALUE</span>
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-black/30 rounded-full" />
        </div>
      )}

      <div className="items-center gap-4 flex flex-col relative z-10">
        {/* Diamond Icon with enhanced 3D rotation */}
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-4 transition-all duration-700 shadow-2xl ${
          item.popular 
            ? 'border-blue-400/70 shadow-blue-400/40' 
            : item.bestDeal 
            ? 'border-teal-400/70 shadow-teal-400/40'
            : 'border-blue-400/50 shadow-blue-400/30'
        } ${hoveredCard === item.id ? 'animate-bounce-diamond rotate-y-360 scale-110 border-blue-400/70' : 'animate-float-slow'}`}>
          <div className="relative">
            <FaGem size={42} color="#B9F2FF" className="drop-shadow-2xl" />
            <div className={`absolute inset-0 bg-blue-400 rounded-full blur-sm transition-all duration-1000 ${
              hoveredCard === item.id ? 'opacity-50 scale-125' : 'opacity-0'
            }`} />
          </div>
        </div>

        {/* Diamond Amount with enhanced glow effect */}
        <div className={`text-4xl font-black text-center transition-all duration-300 relative ${
          hoveredCard === item.id 
            ? 'text-blue-300 scale-110 drop-shadow-2xl' 
            : 'text-cyan-400'
        }`}>
          {item.diamond}
          {/* Text shadow effect */}
          <div className={`absolute inset-0 text-blue-200 blur-sm opacity-0 transition-all duration-500 ${
            hoveredCard === item.id ? 'opacity-50' : ''
          }`}>
            {item.diamond}<span className="ml-1">DIAMONDS</span>

          </div>
           <div className="text-2xl font-black text-yellow-400 text-center text-shadow-lg shadow-yellow-400/30">
              {item.gold}
            </div>
        </div>
        
        {/* Price with enhanced 3D effect */}
        <div className={`text-2xl font-bold text-center transition-all duration-300 ${
          hoveredCard === item.id 
            ? 'text-blue-200 scale-105 drop-shadow-lg' 
            : 'text-white/90'
        }`}>
          {item.price}
        </div>

        {/* Savings with enhanced pop effect */}
        {item.saving && (
          <div className={`bg-gradient-to-r from-green-500/40 to-emerald-500/40 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform ${
            hoveredCard === item.id 
              ? 'border-green-400/70 scale-110 shadow-lg shadow-green-400/30 rotate-2' 
              : 'border-green-500/40'
          }`}>
            <div className="text-green-300 text-sm font-bold flex items-center gap-2">
              <IoIosFlash className="text-green-200 animate-pulse" />
              Save {item.saving}
              <IoIosRocket className="text-green-200 ml-1" />
            </div>
          </div>
        )}

        {/* Extra Bonus with enhanced shine effect */}
        {item.extra && (
          <div className={`flex items-center bg-gradient-to-r from-blue-400/30 to-purple-400/30 px-4 py-3 rounded-xl gap-2 border-2 transition-all duration-300 transform ${
            hoveredCard === item.id 
              ? 'border-blue-400/70 scale-105 shadow-lg shadow-blue-400/30 -rotate-1' 
              : 'border-blue-400/40'
          }`}>
            <FaGift size={20} color="#B9F2FF" className="drop-shadow-lg animate-bounce" />
            <div className="text-cyan-300 text-sm font-semibold drop-shadow-lg">{item.extra}</div>
          </div>
        )}

        {/* Buy Button with enhanced 3D press effect */}
        <button 
          onClick={() => handlePurchase(item)} 
          disabled={purchasing}
          style={{
            margin: "10px", 
            padding: 10,  
          }}
          className="w-full mt-4 group/btn relative"
        >
          <div 
            className={`flex items-center justify-center rounded-2xl gap-3 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-500 transform shadow-2xl relative overflow-hidden ${
              hoveredCard === item.id 
                ? 'shadow-blue-500/50 scale-110 group-hover/btn:scale-105' 
                : 'shadow-blue-500/30'
            } ${
              purchasing 
                ? 'opacity-75 scale-95' 
                : 'group-hover/btn:scale-105 group-hover/btn:shadow-blue-500/60'
            }`}
          >
            {/* Button shine effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-all duration-1000 ${
              hoveredCard === item.id ? 'translate-x-full' : '-translate-x-full'
            }`} />
            
            {purchasing ? (
              <div className="text-white text-lg flex items-center gap-2 relative z-10">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <div className="text-white text-sm font-bold text-center tracking-wide drop-shadow-lg relative z-10">
                  BUY NOW
                </div>
                <IoIosArrowForward size={22} color="#FFFFFF" className="relative z-10"/>
              </>
            )}
          </div>
          
          {/* Button depth effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-2xl blur transition-all duration-300 -z-10 ${
            hoveredCard === item.id ? 'opacity-50 scale-105' : 'opacity-0 scale-100'
          }`} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex-1 justify-center items-center min-h-screen flex flex-col relative overflow-hidden bg-black">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="animate-spin relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center shadow-2xl shadow-blue-400/50">
            <FaGem size={50} color="#FFFFFF" className="drop-shadow-2xl" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
        <div className="text-white text-2xl font-bold mt-8 animate-pulse bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          Loading Diamond Store...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/40 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Large floating elements */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-blue-500/10 rounded-full animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${8 + Math.random() * 7}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full min-h-screen flex flex-col">
        {/* Header Section - Fixed at top */}
      <div className="w-full p-4">
  <div
    className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 
    px-6 sm:px-8 py-6 
    bg-gradient-to-r from-gray-950 via-gray-900 to-black 
    rounded-3xl border-2 border-cyan-400/30 
    shadow-[0_0_25px_5px_rgba(0,255,255,0.15)] 
    backdrop-blur-sm relative overflow-hidden 
    transform-gpu transition-all duration-500 hover:scale-[1.02]"
    style={{
      perspective: "1000px",
      transformStyle: "preserve-3d",
    }}
  >
    {/* ✨ Glow background layers */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-600/10 blur-3xl"></div>
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-400/20 blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-400/20 blur-3xl animate-pulse"></div>

    {/* 🏷️ Left Section */}
    <div
      className="relative z-10 text-center sm:text-left"
      style={{ transform: "rotateY(-4deg) translateZ(40px)" }}
    >
      <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-2xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
        Diamond Store
      </div>
      <div className="text-lg sm:text-xl text-white/90 font-semibold flex items-center justify-center sm:justify-start gap-3 mt-2">
        <IoIosRocket className="animate-bounce text-cyan-400" />
        Premium Diamonds
        <FaGem className="text-cyan-400 animate-pulse" />
      </div>
    </div>

    {/* 💎 Right Section */}
    <div
      className="relative z-10 flex items-center justify-center 
      bg-gradient-to-r from-gray-800 to-gray-900 
      px-6 sm:px-8 py-4 sm:py-5 
      rounded-2xl border-2 border-cyan-400/60 
      shadow-[0_0_25px_3px_rgba(0,255,255,0.25)] 
      transform-gpu hover:translate-z-[40px] transition-transform duration-500 ease-out"
      style={{ transform: "rotateY(4deg) translateZ(40px)" }}
    >
      <FaGem size={36} color="#B9F2FF" className="drop-shadow-[0_0_20px_#0ff] animate-bounce" />
      <div className="text-cyan-300 text-2xl sm:text-3xl font-black ml-4 drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">
        {diamondSave.toLocaleString()}
      </div>
    </div>
  </div>
</div>


        {/* Currency Buttons */}
        {/* <div className="w-[700px] mx-auto flex gap-10 mt-4 mb-6 px-7">
          <CurrencyButton
            currency="INR"
            label={`₹ INR`}
            isSelected={selectedCurrency === 'INR'}
            onPress={() => setSelectedCurrency('INR')}
          />
          <CurrencyButton
            currency="USD"
            label={`$ USD`}
            isSelected={selectedCurrency === 'USD'}
            onPress={() => setSelectedCurrency('USD')}
          />
        </div> */}

         {/* Currency Buttons */}
        <div className="w-full max-w-2xl mx-auto flex gap-4 md:gap-10 mt-4 mb-6 px-4 md:px-7">
          <CurrencyButton
            currency="INR"
            label={`₹ INR`}
            isSelected={selectedCurrency === 'INR'}
            onPress={() => setSelectedCurrency('INR')}
          />
          <CurrencyButton
            currency="USD"
            label={`$ USD`}
            isSelected={selectedCurrency === 'USD'}
            onPress={() => setSelectedCurrency('USD')}
          />
        </div>

        {/* Payment Methods */}
        <div className="w-full flex justify-around items-center mb-4">
          {selectedCurrency === 'INR'
            ? [
                { icon: FaMobileAlt, color: "#4CD964", label: "UPI Payments" },
                { icon: FaCreditCard, color: "#007AFF", label: "Credit/Debit Cards" },
                { icon: FaBuilding, color: "white", label: "Net Banking" }
              ].map((method, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <method.icon size={36} color={method.color} />
                  <span className="text-white/90 text-sm font-semibold">{method.label}</span>
                </div>
              ))
            : [
                { icon: FaCreditCard, color: "#007AFF", label: "Visa Cards" },
                { icon: FaCreditCard, color: "#FF9500", label: "Mastercard" },
                { icon: FaMobileAlt, color: "#4CD964", label: "Digital Wallets" }
              ].map((method, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <method.icon size={36} color={method.color} />
                  <span className="text-white/90 text-sm font-semibold">{method.label}</span>
                </div>
              ))}
        </div>

        {/* Diamond Packages Grid - CONSISTENT LAYOUT */}
        <div className="w-[100%] grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-4 px-4 flex-grow">
          {packages.map((item, index) => (
            <DiamondPackageCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Security Note */}
        <div className="w-[500px] mx-auto flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-gray-900 to-black rounded-2xl border-2 border-gray-700 shadow-lg shadow-gray-800 backdrop-blur-sm mx-4 mb-4">
          <FaShieldAlt size={24} color="#90EE90" />
          <div className="text-white/90 text-sm font-semibold">
            100% Secure Payments • Bank-Level Encryption • SSL Protected
          </div>
        </div>

        {/* Footer - Always visible at bottom */}
        <div className="w-full mt-auto">
          <Footer />
        </div>
      </div>

      {/* Enhanced Confetti Celebration */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '💫', '🔥', '💎', '👑'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(10px) translateX(-10px) rotate(240deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(-15px) translateX(5px) scale(1.1); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(8px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(-8px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(12px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(-12px); }
        }
        @keyframes float5 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(15px); }
        }
        @keyframes bounce-diamond {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-8px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(-12px) rotate(180deg) scale(1.15); }
          75% { transform: translateY(-8px) rotate(270deg) scale(1.1); }
        }
        @keyframes rotate-y-360 {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        .animate-float-slow {
          animation: float-slow 4s infinite ease-in-out;
        }
        .animate-bounce-diamond {
          animation: bounce-diamond 2s infinite ease-in-out;
        }
        .rotate-y-360 {
          animation: rotate-y-360 2s ease-in-out;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-12 {
          transform: rotateY(12deg);
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DiamondPurchaseScreen;