"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Ticket } from "@/lib/types";
import { Mail, Clock, CheckCircle2, XCircle, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";

const STATUS = {
  ouvert: { label: 'Ouvert', color: '#58a6ff', bg: 'rgba(88,166,255,.12)' },
  en_cours: { label: 'En cours', color: 'var(--accent)', bg: 'rgba(240,165,0,.12)' },
  resolu: { label: 'Résolu', color: 'var(--green-light)', bg: 'rgba(82,183,136,.12)' },
  ferme: { label: 'Fermé', color: 'var(--muted)', bg: 'rgba(255,255,255,.06)' },
} as const;

const TYPE_LABELS = {
  remboursement: 'Remboursement',
  changement_km: 'Changement km',
  changement_sponsor: 'Changement sponsor',
  question: 'Question',
  autre: 'Autre',
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'ouvert' | 'en_cours' | 'resolu'>('all');
  const supabase = createClient();

  useEffect(() => {
    supabase.from("tickets").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setTickets(data ?? []); setLoading(false); });
  }, []);

  async function updateStatus(t: Ticket, status: Ticket['status']) {
    const { data } = await supabase.from("tickets").update({ status }).eq("id", t.id).select().single();
    if (data) setTickets(prev => prev.map(x => x.id === t.id ? data : x));
  }

  async function sendResponse(t: Ticket) {
    const resp = responses[t.id]?.trim();
    if (!resp) return;
    setSending(t.id);
    const { data } = await supabase.from("tickets").update({
      admin_response: resp,
      responded_at: new Date().toISOString(),
      status: 'resolu',
    }).eq("id", t.id).select().single();
    if (data) {
      setTickets(prev => prev.map(x => x.id === t.id ? data : x));
      setResponses(prev => ({ ...prev, [t.id]: '' }));
    }
    setSending(null);
  }

  const filtered = tickets.filter(t => filter === 'all' || t.status === filter);
  const openCount = tickets.filter(t => t.status === 'ouvert').length;

  if (loading) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          TICKETS
        </h2>
        {openCount > 0 && (
          <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(88,166,255,.15)', color: '#58a6ff' }}>
            {openCount} ouvert{openCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'ouvert', 'en_cours', 'resolu'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded cursor-pointer"
            style={{
              background: filter === f ? '#58a6ff' : 'rgba(255,255,255,.06)',
              color: filter === f ? 'var(--night)' : 'var(--muted)',
              border: 'none', fontWeight: filter === f ? 700 : 400,
            }}>
            {f === 'all' ? 'Tous' : STATUS[f].label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-xl p-8 text-center" style={{ color: 'var(--muted)' }}>
          Aucun ticket {filter !== 'all' ? `"${STATUS[filter as keyof typeof STATUS]?.label}"` : ''}.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => {
            const s = STATUS[t.status];
            const isOpen = expanded === t.id;
            return (
              <div key={t.id} className="card rounded-xl overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : t.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--muted)' }}>
                        {TYPE_LABELS[t.type]}
                      </span>
                      {t.admin_response && (
                        <span className="text-xs" style={{ color: 'var(--green-light)' }}>✓ Réponse envoyée</span>
                      )}
                    </div>
                    <div className="font-medium" style={{ color: 'var(--text)' }}>{t.subject}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {t.user_name} &lt;{t.user_email}&gt; · {new Date(t.created_at).toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
                    {/* Message */}
                    <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,.03)' }}>
                      <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'var(--muted)' }}>
                        <MessageCircle size={12} /> Message de {t.user_name}
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text)' }}>{t.message}</p>
                    </div>

                    {/* Existing response */}
                    {t.admin_response && (
                      <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(82,183,136,.06)', borderLeft: '2px solid var(--green-light)' }}>
                        <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'var(--green-light)' }}>
                          <CheckCircle2 size={12} /> Votre réponse · {t.responded_at && new Date(t.responded_at).toLocaleString("fr-FR")}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text)' }}>{t.admin_response}</p>
                      </div>
                    )}

                    {/* Status change */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>Statut :</span>
                      {(['ouvert', 'en_cours', 'resolu', 'ferme'] as const).map(st => (
                        <button key={st} onClick={() => updateStatus(t, st)}
                          className="text-xs px-2.5 py-1 rounded cursor-pointer"
                          style={{
                            background: t.status === st ? STATUS[st].bg : 'rgba(255,255,255,.04)',
                            color: t.status === st ? STATUS[st].color : 'var(--muted)',
                            border: 'none',
                          }}>
                          {STATUS[st].label}
                        </button>
                      ))}
                    </div>

                    {/* Reply form */}
                    <div className="mt-4">
                      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
                        {t.admin_response ? 'Modifier la réponse' : 'Répondre au ticket'}
                      </label>
                      <textarea
                        value={responses[t.id] || t.admin_response || ''}
                        onChange={e => setResponses(prev => ({ ...prev, [t.id]: e.target.value }))}
                        rows={3}
                        placeholder="Votre réponse..."
                        style={{ width: '100%', background: 'var(--night)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical' }}
                      />
                      <div className="flex gap-3 mt-2">
                        <a href={`mailto:${t.user_email}?subject=Re: ${t.subject}`}
                          className="flex items-center gap-2 text-xs px-3 py-2 rounded"
                          style={{ background: 'rgba(255,255,255,.06)', color: 'var(--muted)', textDecoration: 'none' }}>
                          <Mail size={12} /> Ouvrir dans le mail
                        </a>
                        <button onClick={() => sendResponse(t)} disabled={sending === t.id || !responses[t.id]?.trim()}
                          className="btn-primary text-xs px-4 py-2 flex items-center gap-2">
                          <Send size={12} /> {sending === t.id ? 'Envoi...' : 'Sauvegarder & résoudre'}
                        </button>
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
