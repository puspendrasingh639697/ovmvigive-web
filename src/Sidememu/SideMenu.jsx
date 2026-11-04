import React, { useState } from "react";
import {
    FaUserCircle,
    FaCoins,
    FaIdBadge,
    FaLink,
    FaCrown,
    FaUserSlash,
    FaQuestionCircle,
    FaFileAlt,
    FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
    const navigate = useNavigate()
    const [isLivePreview, setIsLivePreview] = useState(false);

    return (
        <div className="bg-gradient-to-b from-[#1b0b0b] to-[#110506] text-white w-[360px] min-h-screen rounded-2xl p-6 flex flex-col justify-between">
            {/* === TOP SECTION === */}
            <div className="space-y-5">
                {/* Profile Card */}
                <div className="flex items-center justify-between bg-[#241014] rounded-3xl border border-[#4c2b2f] py-3 px-5 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#b34d5d] rounded-full flex items-center justify-center">
                            <FaUserCircle className="text-4xl text-[#ff8fa3]" />
                        </div>
                        <span className="text-lg font-semibold">dev</span>
                    </div>
                    <span className="text-gray-400 text-xl">›</span>
                </div>

                {/* Gold  Box */}
                <div className="flex items-center justify-between bg-[#241014] rounded-3xl border border-[#4c2b2f] py-4 px-5 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <FaCoins className="text-[#ffb800] text-xl" />
                        <span  onClick={() => navigate("/goldPurchaseScreen")} className="text-lg font-semibold">163 Gold</span>
                    </div>
                    <span className="text-[#ffb800] font-medium">Get more Gold ›</span>
                </div>

                {/* diamonds box  */}
                <div className="flex items-center justify-between border border-gray-700 rounded-full px-4 py-2 mb-4">
                    <div className="flex items-center space-x-3">
                        <span  onClick={() => navigate("/diamondPurchaseScreen")} className="text-blue-400 text-xl">💎</span>
                        <p className="font-semibold">250_diamonds </p>
                    </div>
                    <p className="text-blue-400 font-semibold">Get more diamonds ›</p>
                </div>

                {/* Shared ID */}
                <div className="flex items-center justify-between bg-[#241014] rounded-3xl border border-[#4c2b2f] py-4 px-5 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <FaIdBadge className="text-[#ffb800] text-xl" />
                        <span className="text-sm text-gray-300">Shared Id: 496173474</span>
                    </div>
                    <span className="text-gray-400 text-lg">›</span>
                </div>

                {/* Linked Account */}
                <div className="flex items-center justify-between bg-[#241014] rounded-3xl border border-[#4c2b2f] py-4 px-5 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <FaLink className="text-[#ffb800] text-xl" />
                        <span onClick={() => navigate("/contactUs")} className="text-sm text-gray-300">Contact Us</span>
                    </div>
                    <span className="text-gray-400 text-lg">›</span>
                </div>

                {/* VIP Privileges */}
                {/* <div className="flex items-center justify-between bg-gradient-to-r from-[#2b1b0b] to-[#000000] border border-[#ffb800] rounded-3xl py-4 px-5 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <FaCrown className="text-[#ffb800] text-xl" />
                        <span className="font-semibold" onClick={() => navigation.navigate("/premiumPage")}>VIP Privileges</span>
                    </div>
                    <span className="text-[#ffb800] font-medium">Upgrade ›</span>
                </div> */}


                <div
                    className="flex items-center justify-between bg-gradient-to-r from-[#2b1b0b] to-[#000000] border border-[#ffb800] rounded-3xl py-4 px-5 cursor-pointer hover:scale-105 transition"
                    onClick={() => navigate("/premiumPage")}
                >
                    <div className="flex items-center gap-3">
                        <FaCrown className="text-[#ffb800] text-xl" />
                        <span className="font-semibold">VIP Privileges</span>
                    </div>
                    <span className="text-[#ffb800] font-medium">Upgrade ›</span>
                </div>

            </div>

            <div className="space-y-3 border-t border-[#3b2b2d] pt-6">
                <MenuItem icon={<FaUserSlash  onClick={() => navigate("/blockedUsers")} />} text="Blocked Users" />
                <MenuItem icon={<FaQuestionCircle  onClick={() => navigate("/privacy")}/>} text="Privacy & Policy" />
                <MenuItem icon={<FaFileAlt  onClick={() => navigate("/terms")}/>} text="Tems & Condition" />
                <MenuItem icon={<FaSignOutAlt />} text="Log Out" />

                <p className="text-gray-500 text-sm text-center pt-6">
                    Copyright ©2025 Who. All rights reserved.
                </p>
            </div>
        </div>
    );
};

const MenuItem = ({ icon, text }) => (
    <div className="flex items-center justify-between bg-[#241014] rounded-3xl border border-[#4c2b2f] py-3 px-5 cursor-pointer hover:bg-[#2b1a1f] transition">
        <div className="flex items-center gap-3">
            <span className="text-[#ffb800] text-xl">{icon}</span>
            <span className="text-gray-200">{text}</span>
        </div>
        <span className="text-gray-400 text-lg">›</span>
    </div>
);

export default SideMenu;