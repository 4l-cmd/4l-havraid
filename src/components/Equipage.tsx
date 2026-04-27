"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { MembreEquipe } from "@/lib/types";
import { AtSign } from "lucide-react";

export default function Equipage() {
  const [equipe, setEquipe] = useState<MembreEquipe[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("equipe").select("*").order("order")
      .then(({ data }) => { if (data && data.length > 0) setEquipe(data); });
  }, []);

  return (
    <section id="equipe" className="py-24 px-8 max-w-6xl mx-auto">
      <div className="section-tag">L&apos;aventure humaine</div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 8 }}>
        L&apos;équipage
      </h2>
      <p className="mb-12 text-sm" style={{ color: 'var(--muted)' }}>
        Deux pilotes, une 4L, un rêve. Découvrez ceux qui vont traverser les déserts marocains pour les enfants.
      </p>

      {equipe.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>L&apos;équipe sera présentée bientôt !</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {equipe.map(m => (
            <div key={m.id} className="card rounded-xl overflow-hidden text-center">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="w-full h-64 object-cover object-top" />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-6xl" style={{ background: 'var(--night3)' }}>👤</div>
              )}
              <div className="p-6">
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', letterSpacing: '2px', color: 'var(--sand)' }}>{m.name}</h3>
                <p className="text-xs uppercase tracking-widest mt-1 mb-3" style={{ color: 'var(--terra)' }}>{m.role}</p>
                {m.details && <p className="text-xs italic mb-3" style={{ color: 'var(--muted)' }}>{m.details}</p>}
                {m.bio && <p className="text-sm" style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{m.bio}</p>}
                {m.instagram && (
                  <a href={`https://instagram.com/${m.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
                    <AtSign size={14} /> {m.instagram}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
