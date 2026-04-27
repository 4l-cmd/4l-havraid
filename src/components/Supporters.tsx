"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Heart } from "lucide-react";

interface Supporter { id: string; nom: string; message?: string; created_at: string; }

export default function Supporters() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("supporters").select("id, nom, message, created_at").eq("message_public", true).order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => setSupporters(data ?? []));
  }, []);

  if (supporters.length === 0) return null;

  return (
    <section id="supporters" style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label">Ils nous soutiennent</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 40 }}>MUR DE SUPPORTERS</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {supporters.map(s => (
            <div key={s.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(240,165,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Heart size={16} style={{ color: 'var(--amber)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--sand)', fontSize: '0.95rem' }}>{s.nom}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{new Date(s.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              {s.message && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>&ldquo;{s.message}&rdquo;</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
