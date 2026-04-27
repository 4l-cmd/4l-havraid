import Link from "next/link";
import { AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-8" style={{ background: 'var(--night)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', letterSpacing: '3px', color: 'var(--accent)', marginBottom: 4 }}>
              4L HAVRAID
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Le Havre → Marrakech · 4L Trophy 2026</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>SIREN : 103 219 689 · SIRET : 103 219 689 00017</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com/4lhavraid" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              <AtSign size={16} /> @4lhavraid
            </a>
            <a href="mailto:4lhavraid@gmail.com" className="text-sm" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              4lhavraid@gmail.com
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,.04)', color: 'var(--muted)' }}>
          <span>© 2026 4L HAVRAID. Association loi 1901.</span>
          <div className="flex gap-4">
            <Link href="/mentions-legales" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Mentions légales</Link>
            <Link href="/confidentialite" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Confidentialité</Link>
            <Link href="/cgv" style={{ color: 'var(--muted)', textDecoration: 'none' }}>CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
