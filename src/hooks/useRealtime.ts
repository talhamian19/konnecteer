"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChatMessage } from "@/types";

export function useRealtimeChat(channelId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const supabase = createClient();

  const sendMessage = useCallback(
    async (content: string, userId: string) => {
      const channel = supabase.channel(channelId);
      await channel.send({
        type: "broadcast",
        event: "message",
        payload: {
          id: crypto.randomUUID(),
          content,
          userId,
          createdAt: new Date().toISOString(),
        },
      });
    },
    [channelId, supabase]
  );

  useEffect(() => {
    const channel = supabase
      .channel(channelId)
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload as ChatMessage]);
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, supabase]);

  return { messages, isConnected, sendMessage };
}
