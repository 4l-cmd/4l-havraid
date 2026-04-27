"use client";
import { AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: 'var(--night2)', borderTop: '1px solid var(--border)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '5px', color: 'var(--amber)' }}>4L HAVRAID</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Le Havre → Marrakech · 4L Trophy 2026</p>
        <a href="https://www.instagram.com/4lhavraid/" target="_blank" rel="noopener"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color .2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
          <AtSign size={14} /> @4lhavraid
        </a>
        <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
          © 2026 4L HAVRAID · Association loi 1901 · SIREN 103 219 689
        </p>
      </div>
    </footer>
  );
}
