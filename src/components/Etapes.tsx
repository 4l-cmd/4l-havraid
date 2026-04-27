"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { CheckCircle2, Circle } from "lucide-react";

const DEFAULT_ETAPES = [
  { id: '1', order: 1, label: "Le Havre", icon: "🏁", done: false, done_at: undefined as string | undefined, description: "Départ de la Normandie" },
  { id: '2', order: 2, label: "Paris", icon: "🗼", done: false, done_at: undefined as string | undefined, description: "" },
  { id: '3', order: 3, label: "Lyon", icon: "🦁", done: false, done_at: undefined as string | undefined, description: "" },
  { id: '4', order: 4, label: "Barcelone", icon: "🇪🇸", done: false, done_at: undefined as string | undefined, description: "" },
  { id: '5', order: 5, label: "Madrid", icon: "👑", done: false, done_at: undefined as string | undefined, description: "" },
  { id: '6', order: 6, label: "Algésiras", icon: "⚓", done: false, done_at: undefined as string | undefined, description: "" },
  { id: '7', order: 7, label: "Tanger", icon: "🇲🇦", done: false, done_at: undefined as string | undefined, description: "Entrée au Maroc" },
  { id: '8', order: 8, label: "Maroc intérieur", icon: "🏜", done: false, done_at: undefined as string | undefined, description: "" },
  { id: '9', order: 9, label: "Marrakech", icon: "🎉", done: false, done_at: undefined as string | undefined, description: "Arrivée !" },
];

export default function Etapes() {
  const [etapes, setEtapes] = useState(DEFAULT_ETAPES);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("etapes").select("*").order("order")
      .then(({ data }) => { if (data && data.length > 0) setEtapes(data); });
  }, []);

  const done = etapes.filter(e => e.done).length;
  const pct = Math.round((done / etapes.length) * 100);

  return (
    <section id="etapes" style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-label">Le parcours</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>LES ÉTAPES</h2>

        {done > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--muted)' }}>
              <span>{done} étape{done > 1 ? 's' : ''} franchie{done > 1 ? 's' : ''}</span>
              <span style={{ color: 'var(--amber)' }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--terra), var(--amber))', borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 20, top: 24, bottom: 24, width: 2, background: 'var(--border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {etapes.map((e, i) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '16px 0' }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: e.done ? 'rgba(82,183,136,0.15)' : i === done ? 'rgba(240,165,0,0.12)' : 'var(--night3)', border: `2px solid ${e.done ? 'var(--green)' : i === done ? 'var(--amber)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  {e.done ? <CheckCircle2 size={18} style={{ color: 'var(--green)' }} /> : <span style={{ fontSize: '1rem' }}>{e.icon}</span>}
                </div>
                <div style={{ paddingTop: 8, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: e.done ? 'var(--green)' : i === done ? 'var(--amber)' : 'var(--text)' }}>
                      {e.label}
                    </span>
                    {e.done && e.done_at && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        ✓ {new Date(e.done_at).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    {i === done && !e.done && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: 2, padding: '2px 8px', borderRadius: 4, background: 'rgba(240,165,0,0.12)', color: 'var(--amber)' }}>EN COURS</span>
                    )}
                  </div>
                  {e.description && <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 2 }}>{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
