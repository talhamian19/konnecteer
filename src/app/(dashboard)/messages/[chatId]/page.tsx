"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, Reply, X } from "lucide-react";
import { format } from "date-fns";
import type { MessageWithSender, ChatWithDetails } from "@/types";

export default function ChatRoomPage() {
  const { chatId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [chat, setChat] = useState<ChatWithDetails | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<MessageWithSender | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout>();

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/messages/${chatId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
    }
  }, [chatId]);

  useEffect(() => {
    // Load chat info
    fetch("/api/messages")
      .then((r) => r.json())
      .then((chats: ChatWithDetails[]) => {
        const found = chats.find((c) => c.id === chatId);
        setChat(found || null);
      });

    fetchMessages().finally(() => setLoading(false));

    // Poll every 3s for new messages
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [chatId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim(), replyToId: replyTo?.id }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setInput("");
        setReplyTo(null);
      }
    } finally {
      setSending(false);
    }
  }

  function getChatTitle() {
    if (!chat) return "Chat";
    if (chat.type === "PRIVATE") {
      return chat.members?.find((m) => m.userId !== session?.user?.id)?.user.name || "Direct Message";
    }
    return chat.event?.title || chat.tagAlong?.title || chat.talkAlong?.title || "Group Chat";
  }

  const grouped = messages.reduce((acc, msg) => {
    const day = format(new Date(msg.createdAt), "MMMM d, yyyy");
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {} as Record<string, MessageWithSender[]>);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl flex-shrink-0">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-white font-semibold text-sm">{getChatTitle()}</h2>
          <p className="text-gray-500 text-xs">{chat?.members?.length || 0} members</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">No messages yet. Say hi! 👋</div>
        ) : (
          Object.entries(grouped).map(([day, dayMessages]) => (
            <div key={day}>
              <div className="text-center mb-4">
                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{day}</span>
              </div>
              {dayMessages.map((msg) => {
                const isMe = msg.senderId === session?.user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 mb-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {!isMe && (
                      <div className="flex-shrink-0 w-8 h-8">
                        {msg.sender.image ? (
                          <Image src={msg.sender.image} alt="" width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold">
                            {msg.sender.name?.[0]}
                          </div>
                        )}
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {!isMe && <p className="text-gray-400 text-xs mb-1 ml-1">{msg.sender.name}</p>}
                      {msg.replyTo && (
                        <div className={`text-xs text-gray-500 border-l-2 border-gray-600 pl-2 mb-1 ${isMe ? "text-right" : ""}`}>
                          <span className="text-gray-400">{msg.replyTo.sender?.name}: </span>
                          {msg.replyTo.content?.slice(0, 60)}...
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-tr-sm"
                            : "bg-white/[0.08] text-white rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 ${isMe ? "flex-row-reverse" : ""}`}>
                        <span className="text-gray-600 text-[10px]">{format(new Date(msg.createdAt), "h:mm a")}</span>
                        <button
                          onClick={() => setReplyTo(msg)}
                          className="text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          <Reply className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        {replyTo && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 mb-2 text-xs">
            <Reply className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400 flex-1 truncate">
              Replying to {replyTo.sender.name}: {replyTo.content.slice(0, 40)}
            </span>
            <button onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type a message..."
            className="flex-1 bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/30 text-sm resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
