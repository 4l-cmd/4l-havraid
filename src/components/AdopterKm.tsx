"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Heart, Send, CheckCircle } from "lucide-react";

export default function AdopterKm() {
  const [form, setForm] = useState({ nom: '', email: '', message: '', public: true });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("supporters").insert({
      nom: form.nom,
      email: form.email,
      message: form.message,
      message_public: form.public,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <section id="adopter" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--night2)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-label">Nous soutenir</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>ADOPTER UN KM</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>
              Pour <strong style={{ color: 'var(--amber)' }}>5€</strong>, adoptez un kilomètre de notre parcours et devenez une partie de l'aventure. Votre prénom s'affichera sur notre mur de supporters !
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {['Votre nom apparaît sur le mur de supporters', 'Vous suivez notre aventure en temps réel', 'Vous contribuez à une belle cause solidaire'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} /> {t}
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '20px 24px', background: 'rgba(240,165,0,0.05)', borderColor: 'rgba(240,165,0,0.2)' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 12 }}>
                Le paiement se fait via HelloAsso, plateforme sécurisée pour les associations françaises.
              </p>
              <a href="#" className="btn btn-amber" style={{ justifyContent: 'center', width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                <Heart size={16} /> Adopter un km · 5€ — Bientôt disponible
              </a>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
                Lien disponible dès l'ouverture de notre HelloAsso
              </p>
            </div>
          </div>

          {/* Message form */}
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', letterSpacing: 2, color: 'var(--sand)', marginBottom: 4 }}>
              LAISSER UN MESSAGE
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>
              Même sans adopter un km, laissez-nous un message de soutien !
            </p>

            {sent ? (
              <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                <CheckCircle size={40} style={{ color: 'var(--green)', margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--sand)', fontWeight: 600 }}>Merci pour votre soutien !</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>Votre message apparaîtra bientôt sur le mur.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Votre prénom / nom" required />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email (non affiché publiquement)" required />
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Votre message de soutien..." rows={3} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={form.public} onChange={e => setForm(f => ({ ...f, public: e.target.checked }))} style={{ width: 'auto', accentColor: 'var(--amber)' }} />
                  Afficher mon message sur le mur de supporters
                </label>
                <button type="submit" disabled={loading} className="btn btn-amber" style={{ justifyContent: 'center' }}>
                  <Send size={16} /> {loading ? 'Envoi...' : 'Envoyer mon soutien'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
