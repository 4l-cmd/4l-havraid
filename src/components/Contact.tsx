"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Send, CheckCircle, Mail } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("tickets").insert({
      user_name: form.nom,
      user_email: form.email,
      subject: form.sujet,
      message: form.message,
      type: 'question',
      status: 'ouvert',
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <section id="contact" style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-label">Nous écrire</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>CONTACT</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 48 }}>
          Une question, une proposition de partenariat, ou juste envie de nous encourager ? On vous répond rapidement.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a href="mailto:4lhavraid@gmail.com" className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,165,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} style={{ color: 'var(--amber)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>Email</div>
                <div style={{ color: 'var(--sand)', fontSize: '0.9rem' }}>4lhavraid@gmail.com</div>
              </div>
            </a>

            <a href="https://www.instagram.com/4lhavraid/" target="_blank" rel="noopener" className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,165,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'serif', fontWeight: 700, color: 'var(--amber)', fontSize: '1.1rem' }}>
                in
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>Instagram</div>
                <div style={{ color: 'var(--sand)', fontSize: '0.9rem' }}>@4lhavraid</div>
              </div>
            </a>
          </div>

          {sent ? (
            <div className="card" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <CheckCircle size={44} style={{ color: 'var(--green)' }} />
              <p style={{ color: 'var(--sand)', fontWeight: 600, fontSize: '1.1rem' }}>Message envoyé !</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>On vous répond sous 48h.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Votre nom" required />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" required />
              </div>
              <input value={form.sujet} onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))} placeholder="Sujet" required />
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Votre message..." rows={5} required />
              <button type="submit" disabled={loading} className="btn btn-amber" style={{ justifyContent: 'center' }}>
                <Send size={16} /> {loading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
