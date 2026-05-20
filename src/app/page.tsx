"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Compass, Users, MessageCircle, Ticket, ArrowRight, Star, Globe, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Konnecteer
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-28 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3 h-3" />
            The social platform for real-world connections
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Find your{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              crowd
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover events near you, tag along with strangers on spontaneous plans, join topic discussions,
            and connect with real people in the real world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Start Connecting
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              <Compass className="w-5 h-5" />
              Explore Feed
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to connect</h2>
          <p className="text-gray-400 max-w-xl mx-auto">From live events to spontaneous plans — one platform for it all.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Compass,
              title: "Explore Feed",
              description: "Discover ranked events, tag alongs, and talk alongs personalized to you. Boosted posts rise to the top.",
              color: "from-emerald-500/20 to-emerald-500/5",
              iconColor: "text-emerald-400",
            },
            {
              icon: Users,
              title: "Tag Along",
              description: "Post a plan — hiking, coffee, concerts. Let people request to join. Build real friendships.",
              color: "from-blue-500/20 to-blue-500/5",
              iconColor: "text-blue-400",
            },
            {
              icon: MessageCircle,
              title: "Talk Along",
              description: "Create topic-based group chats. Discuss anything with people who share your interests.",
              color: "from-purple-500/20 to-purple-500/5",
              iconColor: "text-purple-400",
            },
            {
              icon: Ticket,
              title: "Event Tickets",
              description: "Buy and sell tickets with Stripe. Generate QR codes, scan at the door. Full event management.",
              color: "from-pink-500/20 to-pink-500/5",
              iconColor: "text-pink-400",
            },
            {
              icon: Globe,
              title: "Group Chats",
              description: "Every event, tag along, and talk along gets its own group chat. Stay in sync with your crew.",
              color: "from-cyan-500/20 to-cyan-500/5",
              iconColor: "text-cyan-400",
            },
            {
              icon: Shield,
              title: "Host Dashboard",
              description: "Detailed analytics, attendance tracking, revenue reports, and ticket scanning for event hosts.",
              color: "from-orange-500/20 to-orange-500/5",
              iconColor: "text-orange-400",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl bg-gradient-to-b ${feature.color} border border-white/[0.06] hover:border-white/[0.12] transition-colors`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.iconColor}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-3xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to connect?</h2>
          <p className="text-gray-400 mb-8">Join thousands already making real connections through Konnecteer.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition-opacity"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-6 text-center text-gray-500 text-sm">
        © 2025 Konnecteer · Find your crowd
      </footer>
    </div>
  );
}
