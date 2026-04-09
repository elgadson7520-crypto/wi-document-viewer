"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  sidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="sticky top-0 z-40 bg-packers-green relative gold-accent">
      {/* Live Date/Time Bar */}
      <div className="w-full bg-packers-green-dark text-gray-300 text-xs py-1 px-4 lg:px-6 flex justify-end items-center border-b border-white/10">
        <span>{dateString} \u2022 {timeString}</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-white hover:text-packers-gold transition-colors p-1"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-packers-gold flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl leading-none">
                W
              </span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">
                SupplyOne Wisconsin
              </h1>
              <p className="text-packers-gold text-xs uppercase tracking-wider font-semibold">
                Document Library
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Search */}
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-packers-green-dark text-white placeholder-gray-400 rounded-lg border border-packers-green-light focus:outline-none focus:ring-2 focus:ring-packers-gold w-64 text-sm"
          />
        </div>
      </div>
    </header>
  );
}
