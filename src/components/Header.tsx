"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, FileText, ClipboardCheck, Shield, Wrench, BookOpen } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const quickLinks = [
  { label: "SOPs", search: "SOP", icon: "FileText" },
  { label: "Checklists", search: "CHK", icon: "ClipboardCheck" },
  { label: "Safety", search: "SAF", icon: "Shield" },
  { label: "Maintenance", search: "MNT", icon: "Wrench" },
  { label: "Training", search: "TRN", icon: "BookOpen" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  FileText,
  ClipboardCheck,
  Shield,
  Wrench,
  BookOpen,
};

export default function Header({
  searchQuery,
  onSearchChange,
  sidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeLink, setActiveLink] = useState<string | null>(null);

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

  const handleQuickLink = (search: string) => {
    if (activeLink === search) {
      setActiveLink(null);
      onSearchChange("");
    } else {
      setActiveLink(search);
      onSearchChange(search);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-packers-green relative gold-accent">
      {/* Top bar: Region + Date/Time */}
      <div className="w-full bg-packers-green-dark text-gray-300 text-xs py-1 px-4 lg:px-6 flex justify-between items-center border-b border-white/10">
        <span className="font-medium tracking-wide uppercase">Southwest Region — Wisconsin Ward</span>
        <span>{dateString} • {timeString}</span>
      </div>

      {/* Main header row */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-white hover:text-packers-gold transition-colors p-1"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-packers-gold flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl leading-none">W</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">SupplyOne Wisconsin</h1>
              <p className="text-packers-gold text-xs uppercase tracking-wider font-semibold">Document Library</p>
            </div>
          </div>
        </div>

        {/* Center - Quick Links */}
        <div className="hidden md:flex items-center gap-1">
          {quickLinks.map((link) => {
            const Icon = iconMap[link.icon];
            const isActive = activeLink === link.search;
            return (
              <button
                key={link.search}
                onClick={() => handleQuickLink(link.search)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-packers-gold text-white shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={14} />
                {link.label}
              </button>
            );
          })}
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
            onChange={(e) => {
              onSearchChange(e.target.value);
              setActiveLink(null);
            }}
            className="pl-10 pr-4 py-2 bg-packers-green-dark text-white placeholder-gray-400 rounded-lg border border-packers-green-light focus:outline-none focus:ring-2 focus:ring-packers-gold w-64 text-sm"
          />
        </div>
      </div>
    </header>
  );
}
