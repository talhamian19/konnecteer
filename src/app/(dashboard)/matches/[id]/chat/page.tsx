"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { ChatRoom } from "@/components/chat/ChatRoom";

const MOCK_CURRENT_USER = {
  id: "current-user",
  name: "You",
  image: null,
  username: "yourusername",
  nationality: "USA",
};

export default function MatchChatPage() {
  const { id } = useParams<{ id: string }>();
  const match = MOCK_MATCHES.find((m) => m.id === id) ?? MOCK_MATCHES[0];

  const title = `${match.homeTeam.flag} ${match.homeTeam.name} vs ${match.awayTeam.flag} ${match.awayTeam.name}`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-white/10">
        <Link
          href={`/matches/${id}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          Back to Match
        </Link>
      </div>

      <div className="flex-1 p-4 min-h-0">
        <ChatRoom
          channelId={`match-${id}`}
          currentUser={MOCK_CURRENT_USER}
          title={title}
        />
      </div>
    </div>
  );
}
