"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, Users, Bot, MessageSquare, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notification, NotificationType } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "MATCH_REMINDER",
    title: "Match starts in 1 hour!",
    message: "🇦🇷 Argentina vs 🇫🇷 France — Don't forget to find your watch party!",
    data: { matchId: "m1" },
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "n2",
    type: "AI_RECOMMENDATION",
    title: "AI Found Your Perfect Party",
    message: "International Fan Zone has 143 fans nearby and matches 95% of your preferences!",
    data: { partyId: "wp5" },
    isRead: false,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "n3",
    type: "WATCH_PARTY_ALERT",
    title: "New party near you!",
    message: "Brazil Fans — Samba Night just opened 0.5mi from you. 52 attending!",
    data: { partyId: "wp2" },
    isRead: false,
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: "n4",
    type: "CHAT_UPDATE",
    title: "New messages in Argentina Watch Party",
    message: "Carlos and 12 others are chatting live. Join the conversation!",
    data: { partyId: "wp1" },
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "n5",
    type: "RSVP_CONFIRMATION",
    title: "RSVP Confirmed ✅",
    message: "You're going to International Fan Zone tonight. Get ready!",
    data: { partyId: "wp5" },
    isRead: true,
    createdAt: new Date(Date.now() - 172800000),
  },
];

const ICONS: Record<NotificationType, typeof Bell> = {
  MATCH_REMINDER: Calendar,
  WATCH_PARTY_ALERT: Users,
  AI_RECOMMENDATION: Bot,
  CHAT_UPDATE: MessageSquare,
  RSVP_CONFIRMATION: CheckCheck,
  FRIEND_REQUEST: Users,
  PARTY_CANCELLED: Bell,
};

const COLORS: Record<NotificationType, string> = {
  MATCH_REMINDER: "from-blue-500 to-cyan-500",
  WATCH_PARTY_ALERT: "from-green-500 to-emerald-500",
  AI_RECOMMENDATION: "from-purple-500 to-pink-500",
  CHAT_UPDATE: "from-orange-500 to-amber-500",
  RSVP_CONFIRMATION: "from-green-500 to-teal-500",
  FRIEND_REQUEST: "from-blue-500 to-purple-500",
  PARTY_CANCELLED: "from-red-500 to-orange-500",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  const deleteNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Notifications</h1>
          <p className="text-white/50 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-1.5">
            <CheckCheck size={14} />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-24">
          <Bell size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white font-semibold text-xl mb-2">No notifications</p>
          <p className="text-white/40">We&apos;ll notify you about matches, parties, and AI recommendations</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, i) => {
            const Icon = ICONS[notification.type] ?? Bell;
            const gradient = COLORS[notification.type] ?? "from-gray-500 to-gray-600";

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(notification.id)}
                className={cn(
                  "group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all",
                  notification.isRead
                    ? "bg-white/3 border-white/5 opacity-60 hover:opacity-100"
                    : "bg-white/8 border-white/15 hover:border-white/20"
                )}
              >
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={18} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn("text-sm font-semibold", notification.isRead ? "text-white/70" : "text-white")}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-white/50 mt-0.5 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-white/50 transition-all p-1 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-white/30 mt-2">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>

                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 mt-1" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
