"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Ticket, Calendar, MapPin, CheckCircle, XCircle, Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import type { TicketWithEvent } from "@/types";

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithEvent | null>(null);

  useEffect(() => {
    fetch("/api/tickets")
      .then((r) => r.json())
      .then(setTickets)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    VALID: "text-emerald-400 bg-emerald-500/10",
    USED: "text-gray-400 bg-white/5",
    CANCELLED: "text-red-400 bg-red-500/10",
    REFUNDED: "text-yellow-400 bg-yellow-500/10",
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-white font-medium">Ticket confirmed! 🎉</p>
            <p className="text-gray-400 text-sm">Your ticket is ready. Show the QR code at the door.</p>
          </div>
        </motion.div>
      )}

      <h1 className="text-2xl font-bold text-white mb-6">My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Ticket className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No tickets yet</p>
          <Link href="/explore" className="mt-3 inline-block text-emerald-400 text-sm hover:underline">Browse events →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div
                className={`bg-white/[0.03] border rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-all ${
                  selectedTicket?.id === ticket.id ? "border-emerald-500/30" : "border-white/[0.07]"
                }`}
                onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
              >
                <div className="p-4 flex items-center gap-4">
                  {ticket.event.coverImage ? (
                    <Image src={ticket.event.coverImage} alt="" width={56} height={56} className="rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Ticket className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{ticket.event.title}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(ticket.event.startTime), "MMM d, yyyy · h:mm a")}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {ticket.event.location}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>

                {/* QR Code expand */}
                {selectedTicket?.id === ticket.id && ticket.status === "VALID" && (
                  <div className="border-t border-white/[0.06] p-6 flex flex-col items-center gap-4">
                    <p className="text-gray-400 text-sm">Show this QR code at the door</p>
                    <div className="bg-white p-4 rounded-2xl">
                      <QRCode value={ticket.qrCode} size={180} />
                    </div>
                    <p className="text-gray-500 text-xs font-mono">{ticket.qrCode}</p>
                    <p className="text-gray-400 text-xs">Hosted by {ticket.event.host.name}</p>
                  </div>
                )}

                {selectedTicket?.id === ticket.id && ticket.status === "USED" && (
                  <div className="border-t border-white/[0.06] p-6 flex flex-col items-center gap-3">
                    <CheckCircle className="w-10 h-10 text-gray-400" />
                    <p className="text-gray-400 text-sm">This ticket has been scanned and used</p>
                    {ticket.scannedAt && <p className="text-gray-500 text-xs">Scanned {format(new Date(ticket.scannedAt), "MMM d, h:mm a")}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
