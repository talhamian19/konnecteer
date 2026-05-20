"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Zap, Compass, Users, MessageCircle, Ticket, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const mobileNav = [
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/tag-along", icon: Users, label: "Tag" },
  { href: "/create", icon: Plus, label: "Create" },
  { href: "/messages", icon: MessageCircle, label: "Chat" },
  { href: "/notifications", icon: Bell, label: "Alerts" },
];

export default function Topbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Desktop Topbar */}
      <header className="fixed top-0 left-64 right-0 h-14 bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06] z-30 hidden lg:flex items-center px-6 gap-4">
        <Link href="/search" className="flex-1 max-w-md">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 text-gray-400 text-sm hover:bg-white/8 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
            <span>Search events, people, tags...</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/notifications" className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
          {session?.user && (
            <Link href={`/profile/${session.user.id}`}>
              {session.user.image ? (
                <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-medium">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Topbar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-gray-950/90 backdrop-blur-xl border-b border-white/[0.06] z-30 lg:hidden flex items-center px-4 justify-between">
        <Link href="/explore" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-sm">
            Konnecteer
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/search" className="p-2 text-gray-400">
            <Search className="w-5 h-5" />
          </Link>
          <Link href="/notifications" className="p-2 text-gray-400">
            <Bell className="w-5 h-5" />
          </Link>
          {session?.user?.image && (
            <Link href={`/profile/${session.user.id}`}>
              <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gray-950/90 backdrop-blur-xl border-t border-white/[0.06] z-30 lg:hidden flex items-center justify-around px-2">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href) && item.href !== "/create";
          const isCreate = item.href === "/create";
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              {isCreate ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <>
                  <Icon className={`w-5 h-5 ${active ? "text-emerald-400" : "text-gray-500"}`} />
                  <span className={`text-[10px] ${active ? "text-emerald-400" : "text-gray-500"}`}>{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
