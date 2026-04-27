export default function APropos() {
  return (
    <section id="apropos" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: 'var(--night2)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-label">Notre histoire</div>
        <h2 className="title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 32 }}>
          DU HAVRE AU DÉSERT
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20, fontSize: '1.05rem' }}>
              Nous sommes Gabin et Jules, deux étudiants normands qui ont décidé de relever un défi hors du commun : rallier <strong style={{ color: 'var(--sand)' }}>Le Havre à Marrakech</strong> à bord d'une Renault 4L, pour participer au <strong style={{ color: 'var(--amber)' }}>4L Trophy 2026</strong>.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20, fontSize: '1.05rem' }}>
              Le 4L Trophy, c'est le plus grand raid étudiant d'Europe — plus de 3 000 équipages, des milliers de kilomètres à travers l'Espagne et le Maroc, et une finalité solidaire : apporter des fournitures scolaires aux enfants des régions reculées du Maroc.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              Ce projet, c'est autant une aventure humaine qu'un défi mécanique et humain. Et pour y arriver, <strong style={{ color: 'var(--sand)' }}>nous avons besoin de vous.</strong>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { emoji: '📍', label: 'Départ', value: 'Le Havre, Normandie' },
              { emoji: '🏁', label: 'Arrivée', value: 'Marrakech, Maroc' },
              { emoji: '📅', label: 'Date', value: '19 Février 2026' },
              { emoji: '🚗', label: 'Véhicule', value: 'Renault 4L' },
              { emoji: '🤝', label: 'Solidarité', value: 'Fournitures scolaires' },
              { emoji: '📏', label: 'Distance', value: '~6 000 km' },
            ].map(item => (
              <div key={item.label} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)' }}>{item.label}</div>
                  <div style={{ color: 'var(--sand)', fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
