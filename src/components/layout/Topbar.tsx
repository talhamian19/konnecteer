"use client";

import { Menu, Bell, Search, Zap } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { toggleSidebar, unreadCount, currentUser } = useAppStore();

  return (
    <header className="sticky top-0 z-20 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center px-4 gap-4 lg:px-6">
      {/* Mobile menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-white/70 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile logo */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-white">Konnecteer</span>
      </Link>

      {/* Page title */}
      {title && (
        <h1 className="hidden lg:block text-lg font-bold text-white">{title}</h1>
      )}

      <div className="flex-1" />

      {/* Search */}
      <button className="text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
        <Search size={18} />
      </button>

      {/* Notifications */}
      <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
        <Bell size={18} className="text-white/50 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        )}
      </Link>

      {/* Avatar */}
      <Link href="/profile">
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-green-500/50 transition-all">
          <AvatarImage src={currentUser?.image ?? undefined} />
          <AvatarFallback className="text-xs">
            {currentUser?.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
