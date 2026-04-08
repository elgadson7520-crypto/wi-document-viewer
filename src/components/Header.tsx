"use client";

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
  return (
    <header className="sticky top-0 z-40 bg-packers-green relative gold-accent">
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
