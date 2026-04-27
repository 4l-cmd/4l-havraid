"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2026-02-19T08:00:00");
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%,rgba(196,98,45,.2) 0%,transparent 70%), radial-gradient(ellipse 60% 40% at 20% 20%,rgba(240,165,0,.08) 0%,transparent 60%)'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-block text-xs font-medium tracking-[4px] uppercase mb-8 px-5 py-2 rounded-full"
          style={{ color: 'var(--accent)', border: '1px solid rgba(240,165,0,.3)' }}>
          4L Trophy 2026
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(60px,11vw,130px)', lineHeight: '0.9', letterSpacing: '4px', color: 'var(--sand)' }}>
          LE HAVRE<br /><span style={{ color: 'var(--terra)' }}>→ MARRAKECH</span>
        </h1>

        <p className="mt-8 mb-12 text-lg font-light max-w-lg mx-auto" style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
          6 000 km d&apos;aventure solidaire. Deux pilotes, une 4L, un désert.<br />
          Aidez-nous à atteindre Marrakech pour les enfants du Maroc.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-16">
          <Link href="/sponsors" className="btn-primary" style={{ textDecoration: 'none' }}>🤝 Devenir sponsor</Link>
          <a href="#adopter" className="btn-ghost">🗺 Adopter un km</a>
          <a href="#suivi" className="btn-ghost" style={{ borderColor: 'rgba(240,165,0,.4)', color: 'var(--accent)' }}>📍 Suivi GPS</a>
        </div>

        {/* Countdown */}
        <div className="flex gap-4 justify-center flex-wrap">
          {[
            { n: countdown.days, l: "Jours" },
            { n: countdown.hours, l: "Heures" },
            { n: countdown.minutes, l: "Minutes" },
            { n: countdown.seconds, l: "Secondes" },
          ].map(({ n, l }) => (
            <div key={l} className="text-center px-6 py-4 rounded-xl" style={{ background: 'rgba(22,27,34,0.8)', border: '1px solid rgba(255,255,255,.08)', minWidth: 80 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem', color: 'var(--accent)', lineHeight: 1 }}>
                {String(n).padStart(2, "0")}
              </div>
              <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex gap-3 flex-wrap justify-center mt-10">
          {["6 000 km", "2 pays", "1 désert", "1 cause"].map(b => (
            <span key={b} className="px-4 py-1.5 rounded-full text-sm" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,.08)' }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
