
import React, { useState } from 'react';
import HeroSection from './HeroSection';
import FeaturesForEveryone from './FeaturesForEveryone';
import LanguagesAndMission from './LanguagesAndMission';
import CreatorsLoveUs from './CreatorsLoveUs';
import Footer from './Footer';
import Lottie from "lottie-react";
import sunderAnimation from "../../assets/images/sunder.json";
import backgroundImage from '../../assets/images/map.png';
import SecondFeatures from './SecondFeatures';
import GlobalConnections from './GlobalConnections';
import FeaturesGrid from './FeaturesGrid';
import PerksSection from './PerksSection';
import JoinCommunity from './JoinCommunity';
import UsersSay from './UsersSay';
import GotQuestions from './GotQuestions';
import ReadytoStartChatting from './ReadytoStartChatting';
import SeoDiscoverReal from './SeoDiscoverReal';

const MainSrceen = () => {
  

  


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      
      <HeroSection />
      
      <SecondFeatures/>
       
      
     
      <LanguagesAndMission />

       {/* <CreatorsLoveUs /> */}
     
      <GlobalConnections/>

      {/* Features Section */}
       <FeaturesForEveryone />
  
      {/* FeaturesGrid */}
      <FeaturesGrid/>
     

      {/* PerksSection */}
      <PerksSection/>
     

      {/* ✅ IMPROVED Join Community Section - CENTERED IMAGE WITH JOIN US BUTTON BELOW */}
     <JoinCommunity/>

      {/* Lottie Animation + Stats Section */}
     

      {/* User Say File  */}

      <UsersSay/>
      
      {/* GotQuestions File*/}
      <SeoDiscoverReal/>
      <GotQuestions/>

      {/* ReadytoStartChatting File  */}
      {/* <ReadytoStartChatting/> */}

      {/* SeoDiscoverReal File  */}
      

      

      <Footer />
    </div>
  );
};

export default MainSrceen;