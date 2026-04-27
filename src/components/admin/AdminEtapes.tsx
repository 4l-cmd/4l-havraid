"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Etape } from "@/lib/types";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const DEFAULTS: Omit<Etape, "id">[] = [
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

export default function AdminEtapes() {
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("etapes").select("*").order("order").then(({ data }) => {
      if (data && data.length > 0) setEtapes(data);
      else initDefaults();
    });
  }, []);

  async function initDefaults() {
    const { data } = await supabase.from("etapes").insert(DEFAULTS).select();
    if (data) setEtapes(data);
  }

  async function toggle(etape: Etape) {
    setSaving(etape.id);
    const newDone = !etape.done;
    const { data } = await supabase.from("etapes").update({
      done: newDone,
      done_at: newDone ? new Date().toISOString() : null,
    }).eq("id", etape.id).select().single();
    if (data) setEtapes(prev => prev.map(e => e.id === etape.id ? data : e));
    setSaving(null);
  }

  async function updateDesc(etape: Etape, description: string) {
    await supabase.from("etapes").update({ description }).eq("id", etape.id);
    setEtapes(prev => prev.map(e => e.id === etape.id ? { ...e, description } : e));
  }

  const done = etapes.filter(e => e.done).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          ÉTAPES DU RAID
        </h2>
        <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(82,183,136,.15)', color: 'var(--green-light)' }}>
          {done}/{etapes.length} complétées
        </span>
      </div>

      <div className="card rounded-xl p-2">
        <p className="text-xs px-4 py-3 mb-2" style={{ color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
          Cochez les étapes au fur et à mesure — elles s&apos;affichent instantanément sur le site public.
        </p>
        <div className="space-y-1">
          {etapes.map((etape, i) => (
            <div key={etape.id} className="flex items-start gap-4 p-4 rounded-lg transition-all" style={{ background: etape.done ? 'rgba(82,183,136,.06)' : 'transparent' }}>
              <button onClick={() => toggle(etape)} disabled={saving === etape.id}
                className="mt-0.5 flex-shrink-0 cursor-pointer bg-transparent border-none p-0"
                style={{ color: etape.done ? 'var(--green-light)' : 'var(--muted)', transition: 'color .2s' }}>
                {saving === etape.id ? <Loader2 size={24} className="animate-spin" /> :
                  etape.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{etape.icon}</span>
                  <span className="font-medium" style={{ color: etape.done ? 'var(--green-light)' : 'var(--text)' }}>
                    {etape.label}
                  </span>
                  {etape.done && etape.done_at && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      · {new Date(etape.done_at).toLocaleString("fr-FR")}
                    </span>
                  )}
                </div>
                <input
                  className="mt-2 text-sm"
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,.06)', borderRadius: 0, padding: '4px 0', color: 'var(--muted)', width: '100%' }}
                  value={etape.description || ""}
                  onChange={e => setEtapes(prev => prev.map(ep => ep.id === etape.id ? { ...ep, description: e.target.value } : ep))}
                  onBlur={e => updateDesc(etape, e.target.value)}
                  placeholder="Description (optionnelle)..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
