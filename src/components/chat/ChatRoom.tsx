"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Globe, Pin, Flag, Smile } from "lucide-react";
import { ChatMessage, UserProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

interface ChatRoomProps {
  channelId: string;
  initialMessages?: ChatMessage[];
  currentUser: Pick<UserProfile, "id" | "name" | "image" | "username" | "nationality">;
  title: string;
}

const EMOJI_REACTIONS = ["⚽", "🔥", "🎉", "😱", "👏", "❤️", "🇧🇷", "🇦🇷", "😎"];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "msg1",
    content: "Who's going to score first? I'm betting on Messi! 🐐",
    user: { id: "u1", name: "Carlos Rivera", image: null, username: "carlosriva", nationality: "Argentina" },
    matchId: null,
    watchPartyId: null,
    translatedContent: null,
    isPinned: false,
    isMeetup: false,
    emoji: null,
    createdAt: new Date(Date.now() - 300000),
  },
  {
    id: "msg2",
    content: "VAMOS ARGENTINA! 🇦🇷🇦🇷🇦🇷",
    user: { id: "u2", name: "Sofia M.", image: null, username: "sofiam", nationality: "Argentina" },
    matchId: null,
    watchPartyId: null,
    translatedContent: null,
    isPinned: false,
    isMeetup: false,
    emoji: null,
    createdAt: new Date(Date.now() - 240000),
  },
  {
    id: "msg3",
    content: "France has the best midfield in the tournament, don't sleep on them 🇫🇷",
    user: { id: "u3", name: "Pierre D.", image: null, username: "pierred", nationality: "France" },
    matchId: null,
    watchPartyId: null,
    translatedContent: null,
    isPinned: false,
    isMeetup: false,
    emoji: null,
    createdAt: new Date(Date.now() - 180000),
  },
  {
    id: "msg4",
    content: "📍 MEETUP: I'll be at the main entrance at 5pm, anyone want to come watch together? Solo traveler here!",
    user: { id: "u4", name: "Yuki T.", image: null, username: "yukitanaka", nationality: "Japan" },
    matchId: null,
    watchPartyId: null,
    translatedContent: null,
    isPinned: true,
    isMeetup: true,
    emoji: null,
    createdAt: new Date(Date.now() - 120000),
  },
];

export function ChatRoom({ channelId, currentUser, title }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [showTranslate, setShowTranslate] = useState<Record<string, boolean>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: input.trim(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.image,
        username: currentUser.username,
        nationality: currentUser.nationality,
      },
      matchId: null,
      watchPartyId: null,
      translatedContent: null,
      isPinned: false,
      isMeetup: false,
      emoji: null,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleTranslate = async (msgId: string, content: string) => {
    setIsTranslating(true);
    setShowTranslate((prev) => ({ ...prev, [msgId]: true }));
    // In real app: call /api/ai/translate
    setTimeout(() => setIsTranslating(false), 800);
  };

  const pinnedMessages = messages.filter((m) => m.isPinned);

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-sm">{title}</h2>
            <p className="text-xs text-white/40">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
              {messages.length} messages · Live
            </p>
          </div>
          <Badge variant="live" className="text-xs">🔴 Live</Badge>
        </div>

        {/* Pinned meetup */}
        {pinnedMessages.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-1.5 mb-1">
              <Pin size={10} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-semibold">Pinned Meetup</span>
            </div>
            <p className="text-xs text-white/60">{pinnedMessages[0].content}</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isOwn = msg.user.id === currentUser.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={msg.user.image ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {msg.user.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs font-semibold text-white/70">
                      {msg.user.name ?? msg.user.username}
                    </span>
                    {msg.user.nationality && (
                      <span className="text-xs text-white/30">{msg.user.nationality}</span>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm ${
                      isOwn
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tr-sm"
                        : msg.isMeetup
                        ? "bg-amber-500/15 border border-amber-500/25 text-white rounded-tl-sm"
                        : "bg-white/10 text-white/90 rounded-tl-sm"
                    }`}
                  >
                    {msg.isMeetup && (
                      <span className="text-amber-400 text-xs font-semibold block mb-1">
                        📍 Meetup Request
                      </span>
                    )}
                    {msg.content}
                  </div>

                  <div className={`flex items-center gap-2 mt-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-white/25">
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                    {!isOwn && (
                      <button
                        onClick={() => handleTranslate(msg.id, msg.content)}
                        className="text-xs text-white/25 hover:text-white/50 flex items-center gap-0.5 transition-colors"
                      >
                        <Globe size={10} />
                        Translate
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Emoji bar */}
      <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
        {EMOJI_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => setInput((prev) => prev + emoji)}
            className="text-xl hover:scale-125 transition-transform flex-shrink-0"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Say something to the crowd..."
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
