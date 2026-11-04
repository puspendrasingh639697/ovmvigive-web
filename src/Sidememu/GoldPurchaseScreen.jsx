


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "../firebase/supabaseClient"; 
import { auth } from "../firebase/config";
import { getDatabase, ref, onValue } from "firebase/database";
import { getApp } from "firebase/app";

// Web compatible icons (React Icons library)
import { FaCoins, FaStar, FaTrophy, FaGift, FaShieldAlt, FaCreditCard, FaMobileAlt, FaBuilding, FaFire, FaCrown, FaGem } from 'react-icons/fa';
import { IoIosArrowForward, IoIosFlash, IoIosRocket } from 'react-icons/io';
import { GiDiamondTrophy } from 'react-icons/gi';
import Footer from '../components/MainSrceen/Footer';

const GoldPurchaseScreen = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goldPackages, setGoldPackages] = useState({ INR: [], USD: [] });
  const [goldProducts, setGoldProducts] = useState([]);
  const [goldSave, setGoldSave] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeUser, setActiveUser] = useState(true);
  const processedPurchases = useRef(new Set());

  // Web के लिए platform detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Dynamic product SKUs based on platform and currency (Web compatible)
  const getProductSkus = useCallback(() => {
    const baseSkus = {
      INR: isAndroid ? 
        ["gold_35", "gold_50", "gold_150", "gold_5000", "gold_900", "gold_1500"] :
        ["gold_35", "gold_50", "gold_150", "gold_5000", "gold_900", "gold_1500"],
      USD: isAndroid ? 
        ["gold_10_usd", "gold_50_usd", "gold_150_usd", "gold_500_usd", "gold_900_usd", "gold_1500_usd"] :
        ["gold_10_usd", "gold_50_usd", "gold_150_usd", "gold_500_usd", "gold_900_usd", "gold_1500_usd"]
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
        setGoldProducts(selectedSkus.map(sku => ({
          productId: sku,
          title: `${sku} Gold Package`,
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

  // Fetch user gold balance dynamically (Same as before)
  useEffect(() => {
    const email = auth.currentUser?.email;
    if (!email) return;

    const fetchGold = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("totalgold")
        .eq("email", email)
        .single();
      if (!error && data) {
        setGoldSave(data.totalgold || 0);
      }
    };

    fetchGold();

    const channel = supabase
      .channel('gold-updates')
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
            setGoldSave(payload.new.totalgold || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth.currentUser?.email]);

  // Fetch gold packages dynamically from Firebase (Same as before)
  useEffect(() => {
    const app = getApp();
    const realtimeDB = getDatabase(app);
    const goldRef = ref(realtimeDB, "goldPackages");

    const unsubscribe = onValue(
      goldRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const INR = Object.values(data.INR || {}).map(item => ({
            ...item,
            id: item.id || `gold_${item.gold}_inr`,
            currency: 'INR'
          }));
          const USD = Object.values(data.USD || {}).map(item => ({
            ...item,
            id: item.id || `gold_${item.gold}_usd`,
            currency: 'USD'
          }));
          setGoldPackages({ INR, USD });
        } else {
          // Fallback data
          const fallbackData = {
            INR: [
              { id: "gold_35", gold: "35", price: "₹35", saving: "10%", popular: true },
              { id: "gold_50", gold: "50", price: "₹50", saving: "15%" },
              { id: "gold_150", gold: "150", price: "₹150", saving: "20%", bestDeal: true },
              { id: "gold_5000", gold: "500", price: "₹500", saving: "25%" },
              { id: "gold_900", gold: "900", price: "₹900", saving: "30%" },
              { id: "gold_1500", gold: "1500", price: "₹1500", saving: "35%", extra: "Bonus 100 Gold" }
            ],
            USD: [
              { id: "gold_10_usd", gold: "10", price: "$0.99", saving: "10%", popular: true },
              { id: "gold_50_usd", gold: "50", price: "$4.99", saving: "15%" },
              { id: "gold_150_usd", gold: "150", price: "$9.99", saving: "20%", bestDeal: true },
              { id: "gold_500_usd", gold: "500", price: "$29.99", saving: "25%" },
              { id: "gold_900_usd", gold: "900", price: "$49.99", saving: "30%" },
              { id: "gold_1500_usd", gold: "1500", price: "$79.99", saving: "35%", extra: "Bonus 200 Gold" }
            ]
          };
          setGoldPackages(fallbackData);
        }
      },
      (error) => {
        console.error("Error fetching gold packages:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const packages = goldPackages[selectedCurrency] || [];

  const handlePurchase = async (packageItem) => {
    if (window.confirm(`Do you want to purchase ${packageItem.gold} Gold for ${packageItem.price} ${selectedCurrency}?`)) {
      await completePurchase(packageItem);
    }
  };

  const completePurchase = async (packageItem) => {
    try {
      setPurchasing(true);
      
      // Web payment integration (Stripe, Razorpay, etc.)
      console.log("Initiating web payment for:", packageItem);
      
      // Simulate web payment process
      await processGoldPurchase(packageItem);
      
    } catch (error) {
      console.error("Purchase initiation error:", error);
      setPurchasing(false);
      alert("Error: Failed to initiate purchase: " + error.message);
    }
  };

  const processGoldPurchase = async (packageItem) => {
    try {
      const email = auth.currentUser?.email;
      if (!email) throw new Error("User not found");

      const { data: userData, error: fetchErr } = await supabase
        .from("users")
        .select("totalgold, goldpurchasehistory")
        .eq("email", email)
        .single();

      if (fetchErr) throw fetchErr;

      const currentGold = userData?.totalgold || 0;
      const currentHistory = Array.isArray(userData?.goldpurchasehistory) 
        ? userData.goldpurchasehistory 
        : [];

      const newEntry = {
        packageid: packageItem.id,
        goldamount: Number(packageItem.goldAmount || packageItem.gold || 0),
        price: packageItem.price,
        currency: packageItem.currency || selectedCurrency,
        date: new Date().toISOString(),
        txnId: `web_${Date.now()}`,
      };

      // Optimistic update
      setGoldSave(currentGold + newEntry.goldamount);

      const { error: updateErr } = await supabase
        .from("users")
        .update({
          totalgold: currentGold + newEntry.goldamount,
          lastpurchase: new Date().toISOString(),
          goldpurchasehistory: [...currentHistory, newEntry],
        })
        .eq("email", email);

      if (updateErr) throw updateErr;

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      alert(`Success 🎉\nYou've purchased ${newEntry.goldamount} Gold!`);
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
      className={`group flex-1 py-4 md:py-6 px-3 md:px-5 rounded-2xl items-center justify-center border-2 relative overflow-hidden transition-all duration-500 transform perspective-1000 ${
        isSelected 
          ? 'bg-green-800/30 scale-105 shadow-2xl shadow-pink-400/50 border-pink-300/70' 
          : 'bg-gray-800 scale-100 hover:scale-105 hover:bg-green-800/20 hover:shadow-xl hover:shadow-green-800/20'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-green-800/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
        isSelected ? 'translate-x-full group-hover:translate-x-0' : '-translate-x-full group-hover:translate-x-full'
      }`} />
      
      {/* Shine effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-green-800/20 to-transparent transform -skew-x-12 transition-all duration-1500 ${
        isSelected ? 'translate-x-full' : '-translate-x-full'
      }`} />
      
      <span className={`text-sm md:text-lg font-bold text-center relative z-10 flex items-center justify-center gap-2 ${
        isSelected ? 'text-white font-extrabold drop-shadow-lg' : 'text-white/90 group-hover:text-white'
      }`}>
        {label}
      </span>
      
      {isSelected && (
        <>
          <div className="absolute bottom-0 left-1/4 right-1/4 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg shadow-pink-400/50" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping" />
        </>
      )}
    </button>
  );

  // Gold Package Card Component with black background and pink hover
  const GoldPackageCard = ({ item, index }) => (
    <div 
      onMouseEnter={() => setHoveredCard(item.id)}
      onMouseLeave={() => setHoveredCard(null)}
      className={`group relative bg-black rounded-3xl p-4 md:p-6 border-2 transition-all duration-700 transform perspective-1000 ${
        item.popular 
          ? 'border-yellow-400/70 bg-gradient-to-br from-black to-gray-900 shadow-2xl shadow-yellow-400/30' 
          : item.bestDeal 
          ? 'border-blue-400/70 bg-gradient-to-br from-black to-gray-900 shadow-2xl shadow-blue-400/30'
          : 'border-gray-600 bg-gradient-to-br from-black to-gray-900 shadow-xl shadow-gray-800/50'
      } ${
        hoveredCard === item.id 
          ? 'scale-105 lg:scale-110 rotate-y-5 shadow-3xl z-10 bg-gradient-to-br from-green-800/20 to-purple-500/20 border-pink-400/70' 
          : 'scale-100 hover:scale-105'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Depth Effect */}
      <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
        hoveredCard === item.id 
          ? 'bg-gradient-to-br from-green-800/10 to-purple-500/10 shadow-inner' 
          : ''
      }`} />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`absolute w-1 h-1 md:w-2 md:h-2 rounded-full transition-all duration-1000 ${
              item.popular ? 'bg-yellow-400/50' : item.bestDeal ? 'bg-blue-400/50' : 'bg-pink-400/40'
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
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 opacity-0 blur transition-all duration-700 ${
        hoveredCard === item.id ? 'opacity-70 animate-pulse' : ''
      }`} />

      {/* Badges with enhanced 3D effect */}
      {item.popular && (
        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center px-2 py-1 md:px-4 md:py-3 rounded-lg md:rounded-xl gap-1 md:gap-2 shadow-2xl shadow-yellow-400/50 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 z-20">
          <FaFire size={14} md:size={18} color="#000" className="animate-pulse" />
          <span className="text-black text-xs md:text-sm font-black">HOT DEAL</span>
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-black/30 rounded-full" />
        </div>
      )}
      
      {item.bestDeal && (
        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center px-2 py-1 md:px-4 md:py-3 rounded-lg md:rounded-xl gap-1 md:gap-2 shadow-2xl shadow-blue-400/50 transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 z-20">
          <GiDiamondTrophy size={14} md:size={18} color="#000" className="animate-bounce" />
          <span className="text-black text-xs md:text-sm font-black">BEST VALUE</span>
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-black/30 rounded-full" />
        </div>
      )}

      <div className="items-center gap-3 md:gap-4 flex flex-col relative z-10">
        {/* Gold Icon with enhanced 3D rotation */}
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-4 transition-all duration-700 shadow-2xl ${
          item.popular 
            ? 'border-yellow-400/70 shadow-yellow-400/40' 
            : item.bestDeal 
            ? 'border-blue-400/70 shadow-blue-400/40'
            : 'border-yellow-400/50 shadow-yellow-400/30'
        } ${hoveredCard === item.id ? 'animate-bounce-gold rotate-y-360 scale-110 border-pink-400/70' : 'animate-float-slow'}`}>
          <div className="relative">
            <FaCoins size={32} md:size={42} color="#FFD700" className="drop-shadow-2xl" />
            <div className={`absolute inset-0 bg-yellow-400 rounded-full blur-sm transition-all duration-1000 ${
              hoveredCard === item.id ? 'opacity-50 scale-125' : 'opacity-0'
            }`} />
          </div>
        </div>

        {/* Gold Amount with enhanced glow effect */}
        <div className={`text-2xl md:text-4xl font-black text-center transition-all duration-300 relative ${
          hoveredCard === item.id 
            ? 'text-pink-300 scale-110 drop-shadow-2xl' 
            : 'text-yellow-400'
        }`}>
          {item.gold}
          {/* Text shadow effect */}
          <div className={`absolute inset-0 text-pink-200 blur-sm opacity-0 transition-all duration-500 ${
            hoveredCard === item.id ? 'opacity-50' : ''
          }`}>
            {item.gold}<span className="ml-1">GOLD</span>
          </div>
        </div>
        
        {/* Price with enhanced 3D effect */}
        <div className={`text-lg md:text-2xl font-bold text-center transition-all duration-300 ${
          hoveredCard === item.id 
            ? 'text-pink-200 scale-105 drop-shadow-lg' 
            : 'text-white/90'
        }`}>
          {item.price}
        </div>

        {/* Savings with enhanced pop effect */}
        {item.saving && (
          <div className={`bg-gradient-to-r from-green-500/40 to-emerald-500/40 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border-2 transition-all duration-300 transform ${
            hoveredCard === item.id 
              ? 'border-green-400/70 scale-110 shadow-lg shadow-green-400/30 rotate-2' 
              : 'border-green-500/40'
          }`}>
            <div className="text-green-300 text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2">
              <IoIosFlash className="text-green-200 animate-pulse" />
              Save {item.saving}
              <IoIosRocket className="text-green-200 ml-1" />
            </div>
          </div>
        )}

        {/* Extra Bonus with enhanced shine effect */}
        {item.extra && (
          <div className={`flex items-center bg-gradient-to-r from-yellow-400/30 to-amber-400/30 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl gap-1 md:gap-2 border-2 transition-all duration-300 transform ${
            hoveredCard === item.id 
              ? 'border-yellow-400/70 scale-105 shadow-lg shadow-yellow-400/30 -rotate-1' 
              : 'border-yellow-400/40'
          }`}>
            <FaGift size={16} md:size={20} color="#FFD700" className="drop-shadow-lg animate-bounce" />
            <div className="text-yellow-300 text-xs md:text-sm font-semibold drop-shadow-lg">{item.extra}</div>
          </div>
        )}

        {/* Buy Button with enhanced 3D press effect */}
        <button 
          onClick={() => handlePurchase(item)} 
          disabled={purchasing}
          className="w-full mt-2 md:mt-4 group/btn relative"
        >
          <div 
            className={`flex items-center justify-center rounded-2xl gap-2 md:gap-3 h-12 md:h-16 bg-gradient-to-r from-[#EC4899] to-[#DB2777] transition-all duration-500 transform shadow-2xl relative overflow-hidden ${
              hoveredCard === item.id 
                ? 'shadow-green-800/50 scale-110 group-hover/btn:scale-105' 
                : 'shadow-green-800/30'
            } ${
              purchasing 
                ? 'opacity-75 scale-95' 
                : 'group-hover/btn:scale-105 group-hover/btn:shadow-green-800/60'
            }`}
          >
            {/* Button shine effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-all duration-1000 ${
              hoveredCard === item.id ? 'translate-x-full' : '-translate-x-full'
            }`} />
            
            {purchasing ? (
              <div className="text-white text-sm md:text-lg flex items-center gap-2 relative z-10">
                <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <div className="text-white text-xs md:text-sm font-bold text-center tracking-wide drop-shadow-lg relative z-10">
                  BUY NOW
                </div>
                <IoIosArrowForward size={18} md:size={22} color="#FFFFFF" className="relative z-10"/>
              </>
            )}
          </div>
          
          {/* Button depth effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-[#DB2777] to-[#EC4899] rounded-2xl blur transition-all duration-300 -z-10 ${
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
              className="absolute w-2 h-2 bg-green-800/30 rounded-full animate-pulse"
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
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-2xl shadow-yellow-400/50">
            <FaCoins size={30} md:size={50} color="#FFFFFF" className="drop-shadow-2xl" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
        <div className="text-white text-lg md:text-2xl font-bold mt-4 md:mt-8 animate-pulse bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent text-center px-4">
          Loading Gold Store...
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
            className="absolute w-1 h-1 bg-green-800/40 rounded-full animate-float"
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
            className="absolute w-4 h-4 bg-green-800/10 rounded-full animate-float-slow"
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
        <div className="w-full p-3 md:p-4">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-gray-900 to-black rounded-3xl border-2 border-gray-700 shadow-2xl shadow-gray-800 backdrop-blur-sm relative overflow-hidden">
            <div className="relative z-10 text-center sm:text-left">
              <div className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl bg-gradient-to-r from-white to-yellow-200 bg-clip-text">
                Gold Store
              </div>
              <div className="text-base md:text-xl text-white/90 font-semibold flex items-center gap-2 md:gap-3 mt-1 md:mt-2 justify-center sm:justify-start">
                <IoIosRocket className="animate-bounce text-yellow-400" />
                Premium Gold
                <FaCoins className="text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 px-4 md:px-6 py-2 md:py-4 rounded-2xl border-2 border-yellow-400/60 shadow-2xl shadow-yellow-400/30">
              <FaCoins size={24} md:size={36} color="#FFD700" className="drop-shadow-2xl animate-bounce" />
              <div className="text-yellow-300 text-xl md:text-3xl font-black ml-2 md:ml-4 drop-shadow-2xl">
                {goldSave.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

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
        <div className="w-full flex flex-wrap justify-center gap-4 md:gap-[100px] mb-4 px-4">
          {selectedCurrency === 'INR'
            ? [
                { icon: FaMobileAlt, color: "#4CD964", label: "UPI Payments" },
                { icon: FaCreditCard, color: "#007AFF", label: "Credit/Debit Cards" },
                { icon: FaBuilding, color: "white", label: "Net Banking" }
              ].map((method, i) => (
                <div key={i} className="flex flex-col items-center gap-1 md:gap-2">
                  <method.icon size={24} md:size={36} color={method.color} />
                  <span className="text-white/90 text-xs md:text-sm font-semibold text-center">{method.label}</span>
                </div>
              ))
            : [
                { icon: FaCreditCard, color: "#007AFF", label: "Visa Cards" },
                { icon: FaCreditCard, color: "#FF9500", label: "Mastercard" },
                { icon: FaMobileAlt, color: "#4CD964", label: "Digital Wallets" }
              ].map((method, i) => (
                <div key={i} className="flex flex-col items-center gap-1 md:gap-2">
                  <method.icon size={24} md:size={36} color={method.color} />
                  <span className="text-white/90 text-xs md:text-sm font-semibold text-center">{method.label}</span>
                </div>
              ))}
        </div>

        {/* Gold Packages Grid - RESPONSIVE GRID LAYOUT */}
        <div className="w-[100%] grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-4 px-3 md:px-4 flex-grow">
          {packages.map((item, index) => (
            <GoldPackageCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Security Note */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-2 p-3 md:p-4 bg-gradient-to-r from-gray-900 to-black rounded-2xl border-2 border-gray-700 shadow-lg shadow-gray-800 backdrop-blur-sm mb-4 mx-3 md:mx-4">
          <FaShieldAlt size={20} md:size={24} color="#90EE90" />
          <div className="text-white/90 text-xs md:text-sm font-semibold text-center">
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
        @keyframes bounce-gold {
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
        .animate-bounce-gold {
          animation: bounce-gold 2s infinite ease-in-out;
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

export default GoldPurchaseScreen;