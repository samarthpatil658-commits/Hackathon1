import React from "react";
import { Shield, AlertTriangle } from "lucide-react";

const Navbar = ({ onReportClick }) => {
  return (
    <div className="w-full bg-[#13131a] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md z-50">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

        <h1 className="text-white text-lg font-bold tracking-tight">
          <span className="text-pink-500">Safe</span>Route
        </h1>
      </div>

      {/* Right Section */}
      <button
        onClick={onReportClick}
        className="w-10 h-10 rounded-full bg-[#1c1c26] border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/40 transition-all duration-200"
      >
        <AlertTriangle
          size={18}
          className="text-pink-500"
        />
      </button>
    </div>
  );
};

export default Navbar;