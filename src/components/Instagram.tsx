import { AtSign } from "lucide-react";

export default function InstagramSection() {
  return (
    <section id="instagram" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--night2)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>Suivez l'aventure</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>INSTAGRAM</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Toute notre préparation, les coulisses et les moments forts du raid en direct sur Instagram.
        </p>

        <a href="https://www.instagram.com/4lhavraid/" target="_blank" rel="noopener" className="btn btn-amber" style={{ fontSize: '1.1rem', padding: '16px 36px', margin: '0 auto 48px', display: 'inline-flex' }}>
          <AtSign size={20} /> @4lhavraid
        </a>

        {/* Placeholder grid - à remplacer par un widget Instagram si souhaité */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, borderRadius: 16, overflow: 'hidden', maxWidth: 600, margin: '0 auto' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <a key={i} href="https://www.instagram.com/4lhavraid/" target="_blank" rel="noopener"
              style={{ aspectRatio: '1', background: `rgba(240,165,0,${0.03 + i * 0.01})`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              <AtSign size={24} style={{ color: 'var(--border)' }} />
            </a>
          ))}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 16 }}>
          Cliquez sur un carré pour voir nos posts
        </p>
      </div>
    </section>
  );
}
