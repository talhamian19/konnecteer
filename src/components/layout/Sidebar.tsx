"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Map, Calendar, Users, Plus, Bell, Settings,
  User, MessageSquare, Globe, X, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/explore", label: "Explore", icon: Globe },
  { href: "/matches", label: "Matches", icon: Calendar },
  { href: "/map", label: "Map", icon: Map },
  { href: "/create-party", label: "Create Party", icon: Plus },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, unreadCount } = useAppStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 z-30">
        <SidebarContent pathname={pathname} unreadCount={unreadCount} />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-gray-950 border-r border-white/10 z-50 lg:hidden"
            >
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent pathname={pathname} unreadCount={unreadCount} onNavigate={toggleSidebar} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  pathname,
  unreadCount,
  onNavigate,
}: {
  pathname: string;
  unreadCount: number;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-500/30">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <span className="text-xl font-black text-white">Konnecteer</span>
          <p className="text-xs text-white/40 -mt-0.5">Find your crowd</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const isNotifications = href === "/notifications";
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 border border-green-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={18} />
              {label}
              {isNotifications && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 pt-4">
        <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20">
          <p className="text-xs text-green-400 font-semibold">🔴 LIVE NOW</p>
          <p className="text-xs text-white/60 mt-0.5">3 matches happening</p>
        </div>
      </div>
    </div>
  );
}
