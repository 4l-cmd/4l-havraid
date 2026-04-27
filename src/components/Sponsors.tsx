"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ExternalLink, FileDown } from "lucide-react";

interface Sponsor { id: string; company: string; description?: string; logo_url?: string; tier: string; website?: string; }

const TIER_ORDER = ['Or', 'Argent', 'Bronze'];
const TIER_COLORS: Record<string, string> = { Or: '#F0A500', Argent: '#C0C0C0', Bronze: '#CD7F32' };

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("sponsors").select("id, company, description, logo_url, tier, website").eq("approved", true).eq("paid", true)
      .then(({ data }) => setSponsors(data ?? []));
  }, []);

  return (
    <section id="sponsors" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--night2)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-label">Nos partenaires</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>NOS SPONSORS</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 48, maxWidth: 500 }}>
          Merci à toutes les entreprises qui croient en notre projet et nous accompagnent dans cette aventure.
        </p>

        {sponsors.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)' }}>Soyez le premier à nous soutenir !</p>
          </div>
        ) : (
          TIER_ORDER.map(tier => {
            const list = sponsors.filter(s => s.tier === tier);
            if (list.length === 0) return null;
            return (
              <div key={tier} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', letterSpacing: 2, color: TIER_COLORS[tier] }}>PACK {tier.toUpperCase()}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {list.map(s => (
                    <div key={s.id} className="card" style={{ padding: '24px', borderTop: `2px solid ${TIER_COLORS[tier]}` }}>
                      {s.logo_url && <img src={s.logo_url} alt={s.company} style={{ height: 48, maxWidth: '100%', objectFit: 'contain', marginBottom: 16, filter: 'brightness(0) invert(1)' }} />}
                      <div style={{ fontWeight: 700, color: 'var(--sand)', marginBottom: 6 }}>{s.company}</div>
                      {s.description && <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 12 }}>{s.description}</p>}
                      {s.website && (
                        <a href={s.website} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: TIER_COLORS[tier], fontSize: '0.8rem', textDecoration: 'none' }}>
                          <ExternalLink size={12} /> Voir le site
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* CTA dossier */}
        <div className="card" style={{ padding: '32px', marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', background: 'rgba(240,165,0,0.03)', borderColor: 'rgba(240,165,0,0.15)' }}>
          <p style={{ color: 'var(--sand)', fontWeight: 600, fontSize: '1.1rem' }}>Vous souhaitez devenir sponsor ?</p>
          <p style={{ color: 'var(--muted)', maxWidth: 400, fontSize: '0.9rem' }}>Téléchargez notre dossier de sponsoring pour découvrir nos offres de partenariat.</p>
          <a href="#contact" className="btn btn-outline">
            <FileDown size={16} /> Nous contacter pour le dossier
          </a>
        </div>
      </div>
    </section>
  );
}
