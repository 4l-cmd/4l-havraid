const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const MEMBRES = [
  {
    nom: "Gabin Ranson",
    role: "Pilote & Trésorier",
    photo: `${BASE}/gabin.jpg`,
    bio: "Passionné de mécanique et d'aventure, Gabin tient le volant de notre 4L du Havre jusqu'au désert marocain.",
  },
  {
    nom: "Jules Marchand",
    role: "Co-pilote & Président",
    photo: `${BASE}/jules.jpg`,
    bio: "Co-pilote et Président de l'association, Jules assure la partie mécanique et la bonne humeur de l'équipe. Son expertise technique est un atout précieux pour mener la 4L jusqu'à Marrakech.",
  },
];

export default function Equipe() {
  return (
    <section id="equipe" style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-label">L'équipage</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 16 }}>GABIN & JULES</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 48, maxWidth: 500 }}>
          Deux amis, une 4L, et des milliers de kilomètres d'aventure à partager.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {MEMBRES.map(m => (
            <div key={m.nom} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 360, overflow: 'hidden', position: 'relative' }}>
                <img src={m.photo} alt={m.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)' }} />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', letterSpacing: 2, color: 'var(--sand)', marginBottom: 2 }}>{m.nom}</div>
                <div style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{m.role}</div>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
