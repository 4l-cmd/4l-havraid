"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Navigation, Clock, Gauge } from "lucide-react";

interface Pos { id: string; lat: number; lng: number; label?: string; km_parcourus?: number; created_at: string; }

export default function GPS() {
  const [positions, setPositions] = useState<Pos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("gps_positions").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { setPositions(data ?? []); setLoading(false); });

    const channel = supabase.channel("gps_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "gps_positions" }, ({ new: row }) => {
        setPositions(prev => [row as Pos, ...prev]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const latest = positions[0];
  const totalKm = latest?.km_parcourus ?? 0;
  const mapUrl = latest
    ? `https://maps.google.com/maps?q=${latest.lat},${latest.lng}&z=10&output=embed`
    : null;

  return (
    <section id="gps" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--night2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label">Suivi en direct</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>GPS EN TEMPS RÉEL</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 40, maxWidth: 500 }}>
          Notre position se met à jour automatiquement depuis le terrain.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,165,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Gauge size={20} style={{ color: 'var(--amber)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>Km parcourus</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: 'var(--amber)', lineHeight: 1 }}>
                {loading ? '—' : `${totalKm.toLocaleString('fr-FR')}`}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,165,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Navigation size={20} style={{ color: 'var(--amber)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>Position actuelle</div>
              <div style={{ color: 'var(--sand)', fontWeight: 500, fontSize: '0.95rem' }}>
                {loading ? '—' : latest ? (latest.label || `${latest.lat.toFixed(3)}, ${latest.lng.toFixed(3)}`) : 'Pas encore en route'}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,165,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={20} style={{ color: 'var(--amber)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>Dernière mise à jour</div>
              <div style={{ color: 'var(--sand)', fontWeight: 500, fontSize: '0.95rem' }}>
                {loading ? '—' : latest ? new Date(latest.created_at).toLocaleString('fr-FR') : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="card" style={{ overflow: 'hidden', height: 420 }}>
          {mapUrl ? (
            <iframe src={mapUrl} width="100%" height="100%" style={{ border: 'none', filter: 'invert(0.9) hue-rotate(180deg)' }} loading="lazy" title="Position GPS" />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Navigation size={40} style={{ color: 'var(--muted)', opacity: 0.3 }} />
              <p style={{ color: 'var(--muted)' }}>
                {loading ? 'Chargement...' : 'Le raid n\'a pas encore commencé — rendez-vous le 19 février 2026 !'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
