"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Images } from "lucide-react";

interface Photo { id: string; url: string; caption?: string; created_at: string; }

export default function Galerie() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("galerie").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setPhotos(data ?? []));
  }, []);

  if (photos.length === 0) return (
    <section id="galerie" style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label">Nos aventures</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 32 }}>GALERIE</h2>
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Images size={40} style={{ color: 'var(--muted)', opacity: 0.3, margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--muted)' }}>Les photos de préparation arrivent bientôt !</p>
        </div>
      </div>
    </section>
  );

  return (
    <section id="galerie" style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label">Nos aventures</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 40 }}>GALERIE</h2>

        <div style={{ columns: 'auto 280px', gap: 12 }}>
          {photos.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ breakInside: 'avoid', marginBottom: 12, borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in' }}>
              <img src={p.url} alt={p.caption ?? ''} style={{ width: '100%', display: 'block', transition: 'transform .3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
            </div>
          ))}
        </div>

        {selected && (
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}>
            <img src={selected.url} alt={selected.caption ?? ''} style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
          </div>
        )}
      </div>
    </section>
  );
}
