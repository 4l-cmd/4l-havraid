"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Mail, AtSign, Send, AlertCircle, CheckCircle } from "lucide-react";

const TYPES = [
  { value: "question", label: "Question générale" },
  { value: "remboursement", label: "Remboursement" },
  { value: "changement_km", label: "Changement de km" },
  { value: "changement_sponsor", label: "Changement sponsor" },
  { value: "autre", label: "Autre" },
];
const MAX_CHARS = 500;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", type: "question", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("tickets").insert({
      user_name: form.name,
      user_email: form.email,
      type: form.type as "question",
      subject: form.subject || form.type,
      message: form.message,
      status: "ouvert",
    });
    setSending(false);
    if (err) { setError("Erreur lors de l'envoi. Réessayez."); return; }
    setSent(true);
    setForm({ name: "", email: "", type: "question", subject: "", message: "" });
  }

  return (
    <section id="contact" className="py-24 px-8" style={{ background: 'var(--night2)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="section-tag">Nous rejoindre</div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 8 }}>
          Contact
        </h2>
        <p className="mb-12 text-sm" style={{ color: 'var(--muted)' }}>Une question ? Un problème ? Écrivez-nous.</p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <div className="card rounded-xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,98,45,.15)' }}>
                <Mail size={20} style={{ color: 'var(--terra)' }} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Email</div>
                <a href="mailto:4lhavraid@gmail.com" style={{ color: 'var(--text)', textDecoration: 'none' }}>4lhavraid@gmail.com</a>
              </div>
            </div>
            <div className="card rounded-xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,98,45,.15)' }}>
                <AtSign size={20} style={{ color: 'var(--terra)' }} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Instagram</div>
                <a href="https://instagram.com/4lhavraid" target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'none' }}>@4lhavraid</a>
              </div>
            </div>
            <div className="card rounded-xl p-6">
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--sand)' }}>4L HAVRAID</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>SIREN : 103 219 689</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>SIRET : 103 219 689 00017</p>
              <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Réponse sous 48h</p>
            </div>
          </div>

          {/* Form */}
          <div className="card rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--sand)' }}>Envoyer un message</h3>
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--green-light)' }} />
                <p style={{ color: 'var(--green-light)' }}>Message envoyé !</p>
                <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>On vous répond sous 48h.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm underline" style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Prénom Nom *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="votre@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Type de demande</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Message * ({form.message.length}/{MAX_CHARS})</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value.slice(0, MAX_CHARS) }))}
                    rows={5} placeholder="Décrivez votre demande..." required style={{ resize: 'vertical' }} />
                  <div className="text-right text-xs mt-1" style={{ color: form.message.length > MAX_CHARS * 0.9 ? 'var(--accent)' : 'var(--muted)' }}>
                    {MAX_CHARS - form.message.length} caractères restants
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#f85149' }}>
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
                  <Send size={16} /> {sending ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
