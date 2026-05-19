"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Shield, Globe, Moon, LogOut, Trash2, ChevronRight, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Setting {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

const NOTIFICATION_SETTINGS: Setting[] = [
  { id: "match_reminders", label: "Match Reminders", description: "30 min before kickoff", defaultValue: true },
  { id: "party_alerts", label: "Nearby Party Alerts", description: "New parties within 5km", defaultValue: true },
  { id: "ai_recommendations", label: "AI Recommendations", description: "Personalized suggestions", defaultValue: true },
  { id: "chat_updates", label: "Chat Updates", description: "Messages in your parties", defaultValue: false },
  { id: "rsvp_reminders", label: "RSVP Reminders", description: "Parties you've joined", defaultValue: true },
];

const PRIVACY_SETTINGS: Setting[] = [
  { id: "show_location", label: "Show My Location", description: "Let fans see you on the map", defaultValue: true },
  { id: "public_profile", label: "Public Profile", description: "Anyone can view your profile", defaultValue: true },
  { id: "show_nationality", label: "Show Nationality", description: "Display your flag on parties", defaultValue: true },
];

function ToggleSetting({
  setting,
  value,
  onChange,
}: {
  setting: Setting;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white font-medium">{setting.label}</p>
        <p className="text-xs text-white/40 mt-0.5">{setting.description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn("w-11 h-6 rounded-full transition-all relative flex-shrink-0", value ? "bg-green-500" : "bg-white/10")}
      >
        <div
          className={cn(
            "w-4.5 h-4.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm",
            value ? "left-5.5" : "left-0.75"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((s) => [s.id, s.defaultValue]))
  );
  const [privacy, setPrivacy] = useState<Record<string, boolean>>(
    Object.fromEntries(PRIVACY_SETTINGS.map((s) => [s.id, s.defaultValue]))
  );
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");

  const handleLogout = () => toast.info("Logging out...");
  const handleDeleteAccount = () => toast.error("Account deletion requires email confirmation");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-white/50 mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-green-400" />
              <h2 className="text-white font-bold">Notifications</h2>
            </div>
            <div className="divide-y divide-white/5">
              {NOTIFICATION_SETTINGS.map((setting) => (
                <ToggleSetting
                  key={setting.id}
                  setting={setting}
                  value={notifications[setting.id]}
                  onChange={(v) => setNotifications((prev) => ({ ...prev, [setting.id]: v }))}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-blue-400" />
              <h2 className="text-white font-bold">Privacy</h2>
            </div>
            <div className="divide-y divide-white/5">
              {PRIVACY_SETTINGS.map((setting) => (
                <ToggleSetting
                  key={setting.id}
                  setting={setting}
                  value={privacy[setting.id]}
                  onChange={(v) => setPrivacy((prev) => ({ ...prev, [setting.id]: v }))}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Moon size={18} className="text-purple-400" />
              <h2 className="text-white font-bold">Appearance</h2>
            </div>
            <ToggleSetting
              setting={{ id: "dark_mode", label: "Dark Mode", description: "Easier on your eyes at night", defaultValue: true }}
              value={darkMode}
              onChange={setDarkMode}
            />
            <div className="pt-3">
              <p className="text-sm text-white font-medium mb-2">App Language</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                {["English", "Spanish", "Portuguese", "French", "German", "Arabic", "Japanese"].map((l) => (
                  <option key={l} value={l} className="bg-gray-900">{l}</option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="p-5">
            <h2 className="text-white font-bold mb-4">Account</h2>

            <div className="space-y-2">
              {[
                { label: "Change Password", icon: Shield },
                { label: "Connected Accounts", icon: Globe },
                { label: "Blocked Users", icon: Smartphone },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-white/40" />
                    <span className="text-white/70">{label}</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full gap-2 text-white/70 hover:text-white"
              >
                <LogOut size={16} />
                Sign Out
              </Button>

              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="w-full gap-2"
              >
                <Trash2 size={16} />
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Version */}
        <p className="text-center text-xs text-white/20 pb-4">
          Konnecteer v0.1.0 · Made with ⚽ for football fans
        </p>
      </div>
    </div>
  );
}
