"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Ticket, Users, MessageCircle, Calendar, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { NotificationWithData } from "@/types";

const typeIcon = {
  EVENT_REMINDER: Calendar,
  JOIN_REQUEST: Users,
  REQUEST_ACCEPTED: Users,
  REQUEST_DECLINED: Users,
  NEW_MESSAGE: MessageCircle,
  EVENT_CANCELLED: Calendar,
  TICKET_PURCHASED: Ticket,
  GENERAL: Bell,
};

const typeColor = {
  EVENT_REMINDER: "text-blue-400",
  JOIN_REQUEST: "text-yellow-400",
  REQUEST_ACCEPTED: "text-emerald-400",
  REQUEST_DECLINED: "text-red-400",
  NEW_MESSAGE: "text-purple-400",
  EVENT_CANCELLED: "text-red-400",
  TICKET_PURCHASED: "text-emerald-400",
  GENERAL: "text-gray-400",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationWithData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .finally(() => setLoading(false));
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
          {unread > 0 && <p className="text-emerald-400 text-sm">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => {
            const Icon = typeIcon[n.type] || Bell;
            const colorClass = typeColor[n.type] || "text-gray-400";
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.isRead && markRead(n.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  !n.isRead
                    ? "bg-white/[0.05] border-white/[0.12] hover:bg-white/[0.08]"
                    : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!n.isRead ? "text-white" : "text-gray-300"}`}>{n.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
