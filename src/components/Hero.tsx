"use client";
import { useEffect, useState } from "react";
import { ArrowDown, MapPin } from "lucide-react";

const DEPART = new Date("2026-02-19T07:00:00");

function useCountdown() {
  const [t, setT] = useState({ jours: 0, heures: 0, minutes: 0, secondes: 0, parti: false });
  useEffect(() => {
    const tick = () => {
      const diff = DEPART.getTime() - Date.now();
      if (diff <= 0) { setT(x => ({ ...x, parti: true })); return; }
      setT({
        jours: Math.floor(diff / 86400000),
        heures: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        secondes: Math.floor((diff % 60000) / 1000),
        parti: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Hero() {
  const cd = useCountdown();

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '100px 24px 60px' }}>
      {/* Background gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240,165,0,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(196,98,45,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Route tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: 'var(--amber)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' }}>
        <MapPin size={14} />
        Le Havre → Marrakech · 4L Trophy 2026
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '6px', color: 'var(--sand)', lineHeight: 0.9, textAlign: 'center', marginBottom: 8 }}>
        4L HAVRAID
      </h1>
      <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'var(--muted)', textAlign: 'center', marginBottom: 48, maxWidth: 500 }}>
        Deux étudiants du Havre au cœur du désert marocain
      </p>

      {/* Countdown */}
      {!cd.parti ? (
        <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 32px)', marginBottom: 52, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ v: cd.jours, l: 'Jours' }, { v: cd.heures, l: 'Heures' }, { v: cd.minutes, l: 'Minutes' }, { v: cd.secondes, l: 'Secondes' }].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--amber)', lineHeight: 1 }}>
                {String(v).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.65rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: 52, padding: '12px 24px', background: 'rgba(240,165,0,0.12)', borderRadius: 8, color: 'var(--amber)', fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 3, fontSize: '1.4rem' }}>
          🏁 LE RAID EST EN COURS !
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="#adopter" className="btn btn-amber">Adopter un kilomètre · 5€</a>
        <a href="#apropos" className="btn btn-outline">Découvrir notre aventure</a>
      </div>

      {/* Scroll hint */}
      <a href="#apropos" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'var(--muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: '0.7rem', letterSpacing: 2, textDecoration: 'none', animation: 'bounce 2s infinite' }}>
        <ArrowDown size={16} />
        <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }`}</style>
      </a>
    </section>
  );
}
