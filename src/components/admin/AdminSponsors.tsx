"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Sponsor } from "@/lib/types";
import { CheckCircle, XCircle, Building2, Mail, Phone, ChevronDown, ChevronUp, Euro } from "lucide-react";

const TIER_COLORS = {
  Bronze: { color: '#cd7f32', bg: 'rgba(205,127,50,.12)' },
  Argent: { color: '#c0c0c0', bg: 'rgba(192,192,192,.12)' },
  Or: { color: 'var(--accent)', bg: 'rgba(240,165,0,.12)' },
};

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const supabase = createClient();

  useEffect(() => {
    supabase.from("sponsors").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setSponsors(data ?? []); setLoading(false); });
  }, []);

  async function approve(s: Sponsor) {
    const { data } = await supabase.from("sponsors").update({ approved: true }).eq("id", s.id).select().single();
    if (data) setSponsors(prev => prev.map(x => x.id === s.id ? data : x));
  }

  async function reject(s: Sponsor) {
    if (!confirm(`Rejeter la demande de ${s.company} ?`)) return;
    const { data } = await supabase.from("sponsors").update({ approved: false }).eq("id", s.id).select().single();
    if (data) setSponsors(prev => prev.map(x => x.id === s.id ? data : x));
  }

  async function togglePaid(s: Sponsor) {
    const { data } = await supabase.from("sponsors").update({ paid: !s.paid }).eq("id", s.id).select().single();
    if (data) setSponsors(prev => prev.map(x => x.id === s.id ? data : x));
  }

  const filtered = sponsors.filter(s => {
    if (filter === 'pending') return !s.approved;
    if (filter === 'approved') return s.approved;
    return true;
  });

  const pending = sponsors.filter(s => !s.approved).length;
  const totalRevenu = sponsors.filter(s => s.paid).reduce((a, s) => a + s.amount, 0);

  if (loading) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          SPONSORS
        </h2>
        <div className="flex gap-3">
          {pending > 0 && (
            <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(248,81,73,.15)', color: '#f85149' }}>
              {pending} en attente
            </span>
          )}
          <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(240,165,0,.15)', color: 'var(--accent)' }}>
            {totalRevenu}€
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {(['all', 'pending', 'approved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded cursor-pointer"
            style={{
              background: filter === f ? 'var(--accent)' : 'rgba(255,255,255,.06)',
              color: filter === f ? 'var(--night)' : 'var(--muted)',
              border: 'none', fontWeight: filter === f ? 700 : 400,
            }}>
            {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Approuvés'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-xl p-8 text-center" style={{ color: 'var(--muted)' }}>
          Aucun sponsor pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const tc = TIER_COLORS[s.tier];
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="card rounded-xl overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : s.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Building2 size={16} style={{ color: tc.color, flexShrink: 0 }} />
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{s.company}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: tc.bg, color: tc.color }}>
                        {s.tier}
                      </span>
                      {!s.approved && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,81,73,.12)', color: '#f85149' }}>
                          En attente
                        </span>
                      )}
                      {s.paid && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(82,183,136,.12)', color: 'var(--green-light)' }}>
                          Payé
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      {s.contact} · {s.email} · {s.amount}€ · {new Date(s.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <InfoRow icon={<Building2 size={14} />} label="Entreprise" value={s.company} />
                        <InfoRow icon={<Mail size={14} />} label="Email" value={s.email} />
                        {s.phone && <InfoRow icon={<Phone size={14} />} label="Téléphone" value={s.phone} />}
                        <InfoRow icon={<Euro size={14} />} label="Montant" value={`${s.amount}€ — Pack ${s.tier}`} />
                        {s.siret && <InfoRow icon={<Building2 size={14} />} label="SIRET" value={s.siret} />}
                        {s.address && <InfoRow icon={<Building2 size={14} />} label="Adresse" value={s.address} />}
                        {s.position && <InfoRow icon={<Building2 size={14} />} label="Position" value={s.position} />}
                        {s.description && (
                          <div className="text-sm pt-2" style={{ color: 'var(--muted)' }}>&ldquo;{s.description}&rdquo;</div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {!s.approved ? (
                          <button onClick={() => approve(s)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium"
                            style={{ background: 'rgba(82,183,136,.2)', color: 'var(--green-light)', border: 'none' }}>
                            <CheckCircle size={16} /> Approuver ce sponsor
                          </button>
                        ) : (
                          <button onClick={() => reject(s)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer text-sm"
                            style={{ background: 'rgba(248,81,73,.1)', color: '#f85149', border: 'none' }}>
                            <XCircle size={16} /> Retirer l&apos;approbation
                          </button>
                        )}
                        <button onClick={() => togglePaid(s)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer text-sm"
                          style={{
                            background: s.paid ? 'rgba(82,183,136,.15)' : 'rgba(255,255,255,.06)',
                            color: s.paid ? 'var(--green-light)' : 'var(--muted)',
                            border: 'none',
                          }}>
                          {s.paid ? <CheckCircle size={16} /> : <Euro size={16} />}
                          {s.paid ? 'Paiement confirmé' : 'Marquer comme payé'}
                        </button>
                        <a href={`mailto:${s.email}`}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm"
                          style={{ background: 'rgba(255,255,255,.06)', color: 'var(--muted)', textDecoration: 'none' }}>
                          <Mail size={16} /> Écrire à {s.contact}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      <span style={{ color: 'var(--muted)' }}>{label} :</span>
      <span style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  );
}
