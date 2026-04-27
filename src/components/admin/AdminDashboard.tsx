"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Users, Map, DollarSign, Ticket, TrendingUp } from "lucide-react";

interface Stats { sponsors: number; km: number; tickets: number; revenus: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ sponsors: 0, km: 0, tickets: 0, revenus: 0 });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("sponsors").select("id, amount, paid").eq("approved", true),
      supabase.from("km_adoptions").select("id, amount, paid"),
      supabase.from("tickets").select("id, status"),
    ]).then(([s, k, t]) => {
      const sponsors = s.data?.filter(x => x.paid).length ?? 0;
      const km = k.data?.filter(x => x.paid).length ?? 0;
      const tickets = t.data?.filter(x => x.status === "ouvert").length ?? 0;
      const revenus =
        (s.data?.filter(x => x.paid).reduce((a, x) => a + (x.amount || 0), 0) ?? 0) +
        (k.data?.filter(x => x.paid).reduce((a, x) => a + (x.amount || 0), 0) ?? 0);
      setStats({ sponsors, km, tickets, revenus });
    });
  }, []);

  const cards = [
    { icon: <Users size={24} />, label: "Sponsors confirmés", value: stats.sponsors, color: "var(--accent)" },
    { icon: <Map size={24} />, label: "Km adoptés", value: stats.km, color: "var(--green-light)" },
    { icon: <DollarSign size={24} />, label: "Revenus totaux", value: `${stats.revenus}€`, color: "var(--terra)" },
    { icon: <Ticket size={24} />, label: "Tickets ouverts", value: stats.tickets, color: "#58a6ff" },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 24 }}>
        DASHBOARD
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(c => (
          <div key={c.label} className="card rounded-xl p-6 text-center">
            <div className="flex justify-center mb-3" style={{ color: c.color }}>{c.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem', color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div className="text-xs mt-2 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--text-dim)' }}>
          <TrendingUp size={18} style={{ color: 'var(--terra)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Objectif financier</h3>
        </div>
        <div className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
          {stats.revenus}€ récoltés sur 5 000€ estimés nécessaires
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (stats.revenus / 5000) * 100)}%`, background: 'linear-gradient(90deg, var(--terra), var(--accent))' }} />
        </div>
        <div className="text-xs mt-2 text-right" style={{ color: 'var(--muted)' }}>
          {Math.round((stats.revenus / 5000) * 100)}% de l&apos;objectif
        </div>
      </div>
    </div>
  );
}
