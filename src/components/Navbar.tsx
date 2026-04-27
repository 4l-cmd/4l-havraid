"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#apropos", label: "Notre histoire" },
  { href: "#equipe", label: "Équipe" },
  { href: "#gps", label: "GPS Live" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#galerie", label: "Galerie" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(10,10,10,0.96)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', letterSpacing: '4px', color: 'var(--amber)', textDecoration: 'none' }}>
          4L HAVRAID
        </a>
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--sand)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              {l.label}
            </a>
          ))}
          <a href="#adopter" className="btn btn-amber" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
            Nous soutenir
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden" style={{ background: 'none', border: 'none', color: 'var(--sand)', cursor: 'pointer' }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden" style={{ background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ color: 'var(--sand)', textDecoration: 'none', fontSize: '1rem' }}>{l.label}</a>
          ))}
          <a href="#adopter" onClick={() => setOpen(false)} className="btn btn-amber" style={{ justifyContent: 'center' }}>Adopter un km</a>
        </div>
      )}
    </nav>
  );
}
