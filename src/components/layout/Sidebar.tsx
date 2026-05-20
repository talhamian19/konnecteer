"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  Compass,
  Users,
  MessageCircle,
  Bell,
  Plus,
  Ticket,
  Settings,
  LogOut,
  Zap,
  Search,
  User2,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const navItems = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/tag-along", label: "Tag Along", icon: Users },
  { href: "/talk-along", label: "Talk Along", icon: MessageSquare },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-950 border-r border-white/[0.06] flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <Link href="/explore" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Konnecteer
          </span>
        </Link>
      </div>

      {/* Create button */}
      <div className="p-4">
        <Link
          href="/create"
          className="flex items-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </Link>

        {session?.user && (
          <>
            <Link href={`/profile/${session.user.id}`}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                {session.user.image ? (
                  <Image src={session.user.image} alt="" width={20} height={20} className="rounded-full" />
                ) : (
                  <User2 className="w-4 h-4" />
                )}
                <span className="truncate">{session.user.name || "Profile"}</span>
              </div>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
