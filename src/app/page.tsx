"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Zap, Map, MessageSquare, Users, Star, Globe, Shield, Sparkles,
  ArrowRight, Play, ChevronDown, Bot, Calendar, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Map,
    title: "Live Map Discovery",
    description:
      "See real-time watch parties, fan zones, and sports bars on an interactive map. Click any pin to join instantly.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bot,
    title: "AI Match Assistant",
    description:
      "Ask Konnect anything — best places to watch, crowd safety, fan meetups. AI-powered recommendations in seconds.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Going Alone Mode",
    description:
      "Traveling solo? Our AI matches you with similar fans nearby and suggests safe public meetups to reduce social friction.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: MessageSquare,
    title: "Live Match Chatrooms",
    description:
      "Real-time multilingual chat for every match. AI translation, emoji reactions, and pinned meetup messages.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Sparkles,
    title: "AI Crowd Vibe",
    description:
      "Each party gets an AI-generated vibe analysis — crowd energy, nationality mix, safety rating, and excitement level.",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description:
      "Break language barriers. Auto-translate messages to 16+ languages so you can connect with fans worldwide.",
    gradient: "from-teal-500 to-green-500",
  },
];

const STATS = [
  { value: "50K+", label: "Active Fans" },
  { value: "120+", label: "Cities" },
  { value: "32", label: "Countries" },
  { value: "4.9★", label: "App Rating" },
];

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    flag: "🇦🇷",
    nationality: "Argentina",
    text: "Found 300 Argentina fans 2 blocks from me in 30 seconds. Konnecteer is insane. We won the World Cup watching together!",
    vibe: "Hardcore Fan",
  },
  {
    name: "Yuki T.",
    flag: "🇯🇵",
    nationality: "Japan",
    text: "Traveled solo to watch Japan's matches. The Going Alone feature matched me with 5 Japanese fans in the same city. Made friends for life.",
    vibe: "International Traveler",
  },
  {
    name: "Sophie L.",
    flag: "🇫🇷",
    nationality: "France",
    text: "The AI assistant told me exactly which bar was safest with the best atmosphere. It's like having a local friend in every city.",
    vibe: "Casual Fan",
  },
];

const MATCH_PREVIEW = [
  { home: "🇦🇷", away: "🇫🇷", parties: 47, status: "LIVE" },
  { home: "🇧🇷", away: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", parties: 63, status: "2h 30m" },
  { home: "🇩🇪", away: "🇪🇸", parties: 89, status: "Tomorrow" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-black text-white">Konnecteer</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Matches"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="hidden sm:flex">
                Get Started <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-500/8 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[150px]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            FIFA World Cup 2026 — Now Live
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.05]"
          >
            Find your crowd{" "}
            <span className="gradient-text">instantly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered watch party discovery for football fans. Find nearby parties,
            meet fans from your country, and coordinate real-world meetups — all in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/register">
              <Button size="xl" className="w-full sm:w-auto shadow-2xl shadow-green-500/30">
                Find Watch Parties Near Me
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="xl" variant="glass" className="w-full sm:w-auto">
                <Play size={16} />
                See Live Parties
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Live Match Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-white font-semibold">Live Matches</span>
              </div>
              <Link href="/matches">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            {/* Matches */}
            <div className="divide-y divide-white/5">
              {MATCH_PREVIEW.map((match, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{match.home}</span>
                    <span className="text-white/20 text-sm font-bold">VS</span>
                    <span className="text-3xl">{match.away}</span>
                  </div>

                  <div
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      match.status === "LIVE"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {match.status}
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Users size={14} />
                    <span className="font-semibold text-white">{match.parties}</span>
                    <span>parties</span>
                  </div>

                  <Link href="/explore">
                    <Button size="sm" variant="outline" className="hidden sm:flex">
                      Find Parties
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything you need to{" "}
              <span className="gradient-text">connect</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Built for the modern football fan — whether you&apos;re a solo traveler or
              organizing a 500-person viewing event.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready in <span className="gradient-text">60 seconds</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Create Your Fan Profile",
                desc: "Tell us your nationality, favorite team, and vibe. Takes 30 seconds.",
                emoji: "⚡",
              },
              {
                step: "02",
                title: "Find Your Match",
                desc: "Browse upcoming matches or see what's LIVE right now.",
                emoji: "📅",
              },
              {
                step: "03",
                title: "Discover Nearby Parties",
                desc: "AI recommends the best watch parties based on your preferences and location.",
                emoji: "🗺️",
              },
              {
                step: "04",
                title: "Connect & Go",
                desc: "RSVP, join the live chat, coordinate with fans, and show up!",
                emoji: "🎉",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 text-2xl">
                  {step.emoji}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-green-400 tracking-widest">
                      STEP {step.step}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">{step.title}</h3>
                  <p className="text-white/50">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">
              Loved by fans worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/20 flex items-center justify-center text-xl">
                    {t.flag}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.vibe} · {t.nationality}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30">
                <Flame size={40} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold animate-bounce">
                !
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Don&apos;t watch alone.
            </h2>
            <p className="text-xl text-white/50 mb-10">
              Thousands of fans are finding their crowd right now.
              Join the most connected football community on the planet.
            </p>

            <Link href="/register">
              <Button size="xl" className="shadow-2xl shadow-green-500/30 text-lg px-12">
                Find My Crowd Now
                <ArrowRight size={20} />
              </Button>
            </Link>

            <p className="text-sm text-white/30 mt-6">
              Free forever · No credit card required · 60-second setup
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-black">Konnecteer</span>
            </div>
            <p className="text-white/30 text-sm">
              © 2026 Konnecteer. Built for football fans, by football fans.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Contact"].map((link) => (
                <a key={link} href="#" className="text-white/30 hover:text-white text-sm transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
