"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Navigation, Clock, Gauge, Radio } from "lucide-react";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), { ssr: false });

interface Pos { id: string; lat: number; lng: number; label?: string; km_parcourus?: number; created_at: string; }

export default function GPS() {
  const [positions, setPositions] = useState<Pos[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const liveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("gps_positions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => { setPositions(data ?? []); setLoading(false); });

    const channel = supabase.channel("gps_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "gps_positions" }, ({ new: row }) => {
        setPositions(prev => [row as Pos, ...prev]);
        // Flash "live" indicator
        setLive(true);
        if (liveTimeout.current) clearTimeout(liveTimeout.current);
        liveTimeout.current = setTimeout(() => setLive(false), 5000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const latest = positions[0];
  const totalKm = latest?.km_parcourus ?? 0;
  const mapPositions = [...positions]
    .filter(p => p.lat && p.lng)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <section id="gps" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--night2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div className="section-label" style={{ margin: 0 }}>Suivi en direct</div>
          {live && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(240,165,0,0.12)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(240,165,0,0.3)' }}>
              <Radio size={12} style={{ color: 'var(--amber)' }} />
              <span style={{ color: 'var(--amber)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 2 }}>LIVE</span>
            </div>
          )}
        </div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>GPS EN TEMPS RÉEL</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 40, maxWidth: 540 }}>
          Notre position se met à jour automatiquement depuis le terrain. La carte affiche l'intégralité de notre trajet parcouru.
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
          {loading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--muted)' }}>Chargement...</p>
            </div>
          ) : mapPositions.length > 0 ? (
            <MapLeaflet positions={mapPositions} height={420} />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Navigation size={40} style={{ color: 'var(--muted)', opacity: 0.3 }} />
              <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
                Le raid n'a pas encore commencé — rendez-vous le 19 février 2026 !
              </p>
            </div>
          )}
        </div>

        {/* Route legend */}
        {mapPositions.length > 1 && (
          <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.8rem' }}>
              <div style={{ width: 24, height: 3, background: '#F0A500', borderRadius: 2 }} />
              Trajet parcouru ({mapPositions.length} points)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.8rem' }}>
              <div style={{ width: 12, height: 12, background: '#4CAF50', borderRadius: '50%', border: '2px solid white' }} />
              Départ
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.8rem' }}>
              <div style={{ width: 12, height: 12, background: '#F0A500', borderRadius: '50%', border: '2px solid white' }} />
              Position actuelle
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
