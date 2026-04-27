"use client";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { LogOut, LayoutDashboard, MapPin, Navigation, Map, Users, Newspaper, Ticket, Settings, Camera } from "lucide-react";
import Link from "next/link";
import AdminDashboard from "./AdminDashboard";
import AdminEtapes from "./AdminEtapes";
import AdminGPS from "./AdminGPS";
import AdminKm from "./AdminKm";
import AdminSponsors from "./AdminSponsors";
import AdminNews from "./AdminNews";
import AdminEquipe from "./AdminEquipe";
import AdminTickets from "./AdminTickets";
import AdminConfig from "./AdminConfig";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "etapes", label: "Étapes", icon: <MapPin size={16} /> },
  { id: "gps", label: "GPS", icon: <Navigation size={16} /> },
  { id: "km", label: "Km adoptés", icon: <Map size={16} /> },
  { id: "sponsors", label: "Sponsors", icon: <Users size={16} /> },
  { id: "news", label: "Actualités", icon: <Newspaper size={16} /> },
  { id: "equipe", label: "Équipe", icon: <Camera size={16} /> },
  { id: "tickets", label: "Tickets", icon: <Ticket size={16} /> },
  { id: "config", label: "Config", icon: <Settings size={16} /> },
];

export default function AdminPanel({ user }: { user: User }) {
  const [tab, setTab] = useState("dashboard");

  async function logout() {
    await createClient().auth.signOut();
    window.location.href = "/";
  }

  const renderTab = () => {
    switch (tab) {
      case "dashboard": return <AdminDashboard />;
      case "etapes": return <AdminEtapes />;
      case "gps": return <AdminGPS />;
      case "km": return <AdminKm />;
      case "sponsors": return <AdminSponsors />;
      case "news": return <AdminNews />;
      case "equipe": return <AdminEquipe />;
      case "tickets": return <AdminTickets />;
      case "config": return <AdminConfig />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--night)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'var(--night2)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem', letterSpacing: '3px', color: 'var(--accent)', textDecoration: 'none' }}>
            4L HAVRAID
          </Link>
          <span className="ml-3 text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(240,165,0,.15)', color: 'var(--accent)' }}>ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs hidden sm:block" style={{ color: 'var(--muted)' }}>{user.email}</span>
          <button onClick={logout} className="flex items-center gap-2 text-xs px-3 py-2 rounded cursor-pointer"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.1)', color: 'var(--muted)' }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex overflow-x-auto" style={{ background: 'var(--night2)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer flex-shrink-0 transition-all"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {renderTab()}
      </div>
    </div>
  );
}
