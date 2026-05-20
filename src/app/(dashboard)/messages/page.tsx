"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MessageCircle, Users, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatWithDetails } from "@/types";

const chatTypeIcon = {
  PRIVATE: MessageCircle,
  EVENT: Calendar,
  TAG_ALONG: Users,
  TALK_ALONG: MessageSquare,
};

const chatTypeColor = {
  PRIVATE: "text-blue-400",
  EVENT: "text-emerald-400",
  TAG_ALONG: "text-blue-400",
  TALK_ALONG: "text-purple-400",
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then(setChats)
      .finally(() => setLoading(false));
  }, []);

  function getChatName(chat: ChatWithDetails) {
    if (chat.type === "PRIVATE") {
      const other = chat.members?.find((m) => m.userId !== session?.user?.id);
      return other?.user.name || "Direct Message";
    }
    if (chat.event) return chat.event.title;
    if (chat.tagAlong) return chat.tagAlong.title;
    if (chat.talkAlong) return chat.talkAlong.title;
    return "Chat";
  }

  function getChatAvatar(chat: ChatWithDetails) {
    if (chat.type === "PRIVATE") {
      const other = chat.members?.find((m) => m.userId !== session?.user?.id);
      return other?.user.image || null;
    }
    return (chat.event as { coverImage?: string | null } | null | undefined)?.coverImage || null;
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      {chats.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No conversations yet</p>
          <p className="text-sm mt-1">Join an event or tag along to start chatting</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => {
            const Icon = chatTypeIcon[chat.type];
            const colorClass = chatTypeColor[chat.type];
            const name = getChatName(chat);
            const avatar = getChatAvatar(chat);
            const lastMsg = chat.messages?.[0];

            return (
              <Link key={chat.id} href={`/messages/${chat.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
                  {avatar ? (
                    <Image src={avatar} alt="" width={44} height={44} className="rounded-full flex-shrink-0" />
                  ) : (
                    <div className={`w-11 h-11 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-white text-sm font-medium truncate">{name}</p>
                      {lastMsg && (
                        <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                    {lastMsg ? (
                      <p className="text-gray-400 text-xs truncate">
                        <span className="text-gray-500">{lastMsg.sender?.name?.split(" ")[0]}: </span>
                        {lastMsg.content}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs">No messages yet</p>
                    )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${colorClass} flex-shrink-0`}>
                    {chat.type === "PRIVATE" ? "DM" : chat.type === "EVENT" ? "Event" : chat.type === "TAG_ALONG" ? "Tag" : "Talk"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
