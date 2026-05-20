"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Users, Ticket, DollarSign, BarChart2,
  QrCode, Eye, TrendingUp, CheckCircle, Clock, Loader2, ScanLine,
} from "lucide-react";
import { format } from "date-fns";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "sonner";

interface DashboardData {
  event: { id: string; title: string; coverImage: string | null; startTime: string; viewCount: number; isBoosted: boolean; _count: { attendances: number } };
  attendances: Array<{ id: string; createdAt: string; user: { id: string; name: string | null; image: string | null } }>;
  revenue: number;
  revenueCount: number;
  scanStats: { total: number; used: number; valid: number };
  timeline: Array<{ date: string; count: number }>;
}

export default function HostDashboardPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [tab, setTab] = useState<"overview" | "attendees" | "scan">("overview");

  useEffect(() => {
    fetch(`/api/host/${eventId}`)
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); else router.push("/explore"); })
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (tab === "scan" && !scanning) {
      setScanning(true);
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
        scanner.render(
          async (decodedText) => {
            scanner.clear();
            setScanning(false);
            // Verify ticket
            const res = await fetch(`/api/tickets/scan`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ qrCode: decodedText, eventId }),
            });
            const result = await res.json();
            if (res.ok) toast.success(`✓ Valid ticket — ${result.user}`);
            else toast.error(result.error || "Invalid ticket");
          },
          (error) => {}
        );
      }, 500);
    }
  }, [tab]);

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div>;
  if (!data) return null;

  const { event, attendances, revenue, scanStats, timeline } = data;
  const maxTimeline = Math.max(...timeline.map((t) => t.count), 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-4 mb-6">
        {event.coverImage && (
          <Image src={event.coverImage} alt="" width={48} height={48} className="rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-xl font-bold text-white">{event.title}</h1>
          <p className="text-gray-400 text-sm">{format(new Date(event.startTime), "EEE, MMM d · h:mm a")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["overview", "attendees", "scan"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>
            {t === "overview" ? "Overview" : t === "attendees" ? "Attendees" : "Scan Tickets"}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Attendees", value: event._count.attendances, icon: Users, color: "text-emerald-400" },
              { label: "Revenue", value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: "text-yellow-400" },
              { label: "Views", value: event.viewCount, icon: Eye, color: "text-blue-400" },
              { label: "Tickets Used", value: `${scanStats.used}/${scanStats.total}`, icon: Ticket, color: "text-purple-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
                <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                  <span className="text-xs text-gray-400">{s.label}</span>
                </div>
                <p className="text-white text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Attendance (Last 7 Days)</h2>
            <div className="flex items-end gap-2 h-24">
              {timeline.map((t) => (
                <div key={t.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors"
                    style={{ height: `${(t.count / maxTimeline) * 80}px`, minHeight: t.count > 0 ? "4px" : "0" }}
                  />
                  <span className="text-gray-500 text-[9px]">{t.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scan stats */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Ticket Status</h2>
            <div className="flex gap-4">
              <div className="flex-1 bg-emerald-500/10 rounded-xl p-3 text-center">
                <p className="text-emerald-400 text-2xl font-bold">{scanStats.valid}</p>
                <p className="text-gray-400 text-xs mt-1">Valid</p>
              </div>
              <div className="flex-1 bg-gray-500/10 rounded-xl p-3 text-center">
                <p className="text-gray-400 text-2xl font-bold">{scanStats.used}</p>
                <p className="text-gray-400 text-xs mt-1">Used</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendees */}
      {tab === "attendees" && (
        <div className="space-y-3">
          {attendances.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No attendees yet</div>
          ) : attendances.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                {a.user.image ? (
                  <Image src={a.user.image} alt="" width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                    {a.user.name?.[0] || "?"}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{a.user.name}</p>
                  <p className="text-gray-500 text-xs">{format(new Date(a.createdAt), "MMM d, h:mm a")}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Scan */}
      {tab === "scan" && (
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-6">Scan attendee QR codes to mark entry</p>
          <div id="qr-reader" className="max-w-sm mx-auto rounded-2xl overflow-hidden" />
          <p className="text-gray-500 text-xs mt-4">Point camera at the ticket QR code</p>
        </div>
      )}
    </div>
  );
}
