"use client";
import { ExternalLink, Map, Gift, Camera } from "lucide-react";

export default function AdopterKm() {
  const helloassoUrl = process.env.NEXT_PUBLIC_HELLOASSO_KM_URL || "#";

  return (
    <section id="adopter" className="py-24 px-8 max-w-6xl mx-auto">
      <div className="section-tag">Soutenez-nous</div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 8 }}>
        Adopter un kilomètre
      </h2>
      <p className="mb-12 text-sm max-w-xl" style={{ color: 'var(--muted)' }}>
        Choisissez un kilomètre sur les 6 000 du parcours. Vous recevrez une photo exclusive prise exactement à ce point. Chaque euro finance notre aventure et aide les enfants du Maroc.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <Map size={28} />, title: "Choisissez votre km", desc: "De 1 à 6 000 km, chaque kilomètre est unique entre Le Havre et Marrakech." },
          { icon: <Gift size={28} />, title: "Payez via HelloAsso", desc: "Paiement sécurisé. Vous recevez un reçu fiscal automatiquement." },
          { icon: <Camera size={28} />, title: "Recevez votre photo", desc: "On prend une photo exactement à votre kilomètre et vous la partageons." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="card rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(196,98,45,.15)', color: 'var(--terra)' }}>
              {icon}
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--sand)' }}>{title}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div className="card rounded-xl p-8 text-center max-w-lg mx-auto">
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', color: 'var(--accent)', lineHeight: 1 }}>5 €</div>
        <div className="text-sm mb-6 mt-1" style={{ color: 'var(--muted)' }}>par kilomètre adopté</div>
        <a href={helloassoUrl} target="_blank" rel="noreferrer"
          className="btn-primary inline-flex" style={{ textDecoration: 'none', justifyContent: 'center' }}>
          <ExternalLink size={16} /> Adopter un kilomètre sur HelloAsso
        </a>
        <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
          Paiement sécurisé · Reçu automatique · 100% reversé à l&apos;aventure
        </p>
      </div>
    </section>
  );
}
