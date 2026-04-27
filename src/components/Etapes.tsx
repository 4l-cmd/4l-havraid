"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Etape } from "@/lib/types";
import { CheckCircle2, Circle, MapPin } from "lucide-react";

const DEFAULT_ETAPES: Omit<Etape, 'id'>[] = [
  { order: 1, label: "Le Havre", icon: "🏁", done: false },
  { order: 2, label: "Paris", icon: "🗼", done: false },
  { order: 3, label: "Lyon", icon: "🦁", done: false },
  { order: 4, label: "Barcelone", icon: "🇪🇸", done: false },
  { order: 5, label: "Madrid", icon: "👑", done: false },
  { order: 6, label: "Algésiras", icon: "⚓", done: false },
  { order: 7, label: "Tanger", icon: "🇲🇦", done: false },
  { order: 8, label: "Maroc intérieur", icon: "🏜", done: false },
  { order: 9, label: "Marrakech", icon: "🎉", done: false },
];

export default function Etapes() {
  const [etapes, setEtapes] = useState<Etape[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("etapes").select("*").order("order")
      .then(({ data }) => {
        if (data && data.length > 0) setEtapes(data);
        else setEtapes(DEFAULT_ETAPES.map((e, i) => ({ ...e, id: String(i) })));
      });
  }, []);

  const done = etapes.filter(e => e.done).length;
  const pct = etapes.length > 0 ? Math.round((done / etapes.length) * 100) : 0;

  return (
    <section id="etapes" className="py-24 px-8" style={{ background: 'var(--night2)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="section-tag">Le parcours</div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 8 }}>
          Étapes du raid
        </h2>
        <p className="mb-10 text-sm" style={{ color: 'var(--muted)' }}>
          {done} / {etapes.length} étapes complétées
        </p>

        {/* Progress bar */}
        <div className="w-full rounded-full mb-12 overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,.08)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--terra), var(--accent))' }} />
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,.08)' }} />
          <div className="space-y-4">
            {etapes.map((etape, i) => (
              <div key={etape.id} className="flex items-start gap-6 relative">
                <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: etape.done ? 'var(--green)' : 'var(--night3)',
                    border: `2px solid ${etape.done ? 'var(--green-light)' : 'rgba(255,255,255,.1)'}`,
                  }}>
                  {etape.done ? <CheckCircle2 size={20} style={{ color: 'var(--green-light)' }} /> : <span>{etape.icon}</span>}
                </div>
                <div className="flex-1 py-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" style={{ color: etape.done ? 'var(--green-light)' : 'var(--text)' }}>
                      {etape.label}
                    </span>
                    {etape.done && etape.done_at && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(82,183,136,.15)', color: 'var(--green-light)' }}>
                        {new Date(etape.done_at).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {!etape.done && i === done && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: 'rgba(240,165,0,.15)', color: 'var(--accent)' }}>
                        <MapPin size={10} /> En route
                      </span>
                    )}
                  </div>
                  {etape.description && (
                    <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{etape.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
