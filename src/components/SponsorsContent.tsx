"use client";
import { useState } from "react";
import { ExternalLink, Check, MapPin } from "lucide-react";

const CAR_POSITIONS = [
  { id: "A", label: "Porte avant", desc: "Grand format visible de loin · Côté conducteur", tier: "Argent", price: 650 },
  { id: "B", label: "Capot avant", desc: "Très visible de face · Position premium", tier: "Or", price: 950 },
  { id: "C", label: "Toit", desc: "Visible du ciel et des drones", tier: "Argent", price: 650 },
  { id: "D", label: "Hayon arrière", desc: "Zone premium · Vue caravane", tier: "Or", price: 950 },
  { id: "E", label: "Pare-chocs avant", desc: "Visible en caravane · Petit format", tier: "Bronze", price: 350 },
  { id: "F", label: "Pare-chocs arrière", desc: "Visible en caravane · Petit format", tier: "Bronze", price: 350 },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: "#cd7f32",
  Argent: "#c0c0c0",
  Or: "#F0A500",
};

const PACKAGES = [
  {
    tier: "Bronze", price: 350, positions: ["E", "F"],
    features: ["Logo petit format (10×10 cm)", "Mention sur le site", "Couverture partielle du raid"],
    helloasso: process.env.NEXT_PUBLIC_HELLOASSO_SPONSOR_BRONZE_URL || "#",
  },
  {
    tier: "Argent", price: 650, positions: ["A", "C"],
    features: ["Logo moyen format (15×15 cm)", "Mention sur le site", "Couverture complète", "Post Instagram dédié"],
    helloasso: process.env.NEXT_PUBLIC_HELLOASSO_SPONSOR_ARGENT_URL || "#",
    featured: true,
  },
  {
    tier: "Or", price: 950, positions: ["B", "D"],
    features: ["Logo grand format (20×20 cm)", "Mention sur le site", "Couverture maximale", "Posts Instagram + TikTok", "Logo sur page d'accueil"],
    helloasso: process.env.NEXT_PUBLIC_HELLOASSO_SPONSOR_OR_URL || "#",
  },
];

const CAR_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/R4_3_v_sst.jpg/800px-R4_3_v_sst.jpg";

export default function SponsorsContent() {
  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [view, setView] = useState<"left" | "right" | "front" | "rear">("left");

  const sel = CAR_POSITIONS.find(p => p.id === selectedPos);

  const viewImages: Record<string, string> = {
    left: CAR_IMG,
    right: CAR_IMG,
    front: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Renault_R4_BW_2016-07-17_13-45-32.jpg/800px-Renault_R4_BW_2016-07-17_13-45-32.jpg",
    rear: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Renault_R4_BW_2016-07-17_13-45-17.jpg/800px-Renault_R4_BW_2016-07-17_13-45-17.jpg",
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      {/* Header */}
      <div className="mb-16">
        <div className="section-tag">Partenariats</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.9, letterSpacing: '2px', color: 'var(--sand)' }}>
          DEVENEZ<br /><span style={{ color: 'var(--terra)' }}>SPONSOR</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Votre logo sur notre Renault 4L, du Havre à Marrakech. 6 000 km de visibilité garantie.
          Choisissez votre emplacement et rejoignez l&apos;aventure !
        </p>
      </div>

      {/* Car viewer */}
      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-sm uppercase tracking-widest mb-6" style={{ color: 'var(--muted)' }}>Choisissez votre emplacement</h2>

          {/* View tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {(["left", "right", "front", "rear"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-4 py-2 rounded text-xs uppercase tracking-wider transition-all cursor-pointer"
                style={{
                  background: view === v ? 'var(--terra)' : 'var(--night3)',
                  color: view === v ? 'white' : 'var(--muted)',
                  border: '1px solid rgba(255,255,255,.08)',
                }}>
                {v === "left" ? "◄ Conducteur" : v === "right" ? "Passager ►" : v === "front" ? "Avant" : "Arrière"}
              </button>
            ))}
          </div>

          {/* Car image */}
          <div className="relative rounded-xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,.08)', background: 'var(--night3)' }}>
            <img src={viewImages[view]} alt="Renault 4L"
              className="w-full object-contain"
              style={{ maxHeight: 300, transform: view === "right" ? "scaleX(-1)" : "none" }} />
            {/* Position markers overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 520 300" className="absolute inset-0 w-full h-full">
                {(view === "left" || view === "right") && [
                  { id: "A", cx: 185, cy: 170 }, { id: "B", cx: 80, cy: 115 },
                  { id: "C", cx: 245, cy: 55 }, { id: "D", cx: 415, cy: 160 },
                  { id: "E", cx: 55, cy: 245 }, { id: "F", cx: 465, cy: 245 },
                ].map(p => {
                  const pos = CAR_POSITIONS.find(cp => cp.id === p.id)!;
                  const color = TIER_COLORS[pos.tier];
                  const active = selectedPos === p.id;
                  return (
                    <g key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelectedPos(p.id === selectedPos ? null : p.id)}>
                      <circle cx={p.cx} cy={p.cy} r={active ? 22 : 18}
                        fill={active ? color : "rgba(0,0,0,0.4)"}
                        stroke={color} strokeWidth={active ? 3 : 2}
                        style={{ transition: "all .2s", filter: active ? `drop-shadow(0 0 8px ${color})` : "none" }} />
                      <text x={p.cx} y={p.cy + 7} textAnchor="middle"
                        style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, fill: active ? "#000" : color }}>
                        {p.id}
                      </text>
                    </g>
                  );
                })}
                {view === "front" && [
                  { id: "B", cx: 260, cy: 60 }, { id: "E", cx: 260, cy: 250 },
                ].map(p => {
                  const pos = CAR_POSITIONS.find(cp => cp.id === p.id)!;
                  const color = TIER_COLORS[pos.tier];
                  const active = selectedPos === p.id;
                  return (
                    <g key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelectedPos(p.id === selectedPos ? null : p.id)}>
                      <circle cx={p.cx} cy={p.cy} r={active ? 22 : 18} fill={active ? color : "rgba(0,0,0,0.4)"} stroke={color} strokeWidth={active ? 3 : 2} style={{ transition: "all .2s" }} />
                      <text x={p.cx} y={p.cy + 7} textAnchor="middle" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, fill: active ? "#000" : color }}>{p.id}</text>
                    </g>
                  );
                })}
                {view === "rear" && [
                  { id: "D", cx: 260, cy: 80 }, { id: "F", cx: 260, cy: 250 },
                ].map(p => {
                  const pos = CAR_POSITIONS.find(cp => cp.id === p.id)!;
                  const color = TIER_COLORS[pos.tier];
                  const active = selectedPos === p.id;
                  return (
                    <g key={p.id} style={{ cursor: "pointer" }} onClick={() => setSelectedPos(p.id === selectedPos ? null : p.id)}>
                      <circle cx={p.cx} cy={p.cy} r={active ? 22 : 18} fill={active ? color : "rgba(0,0,0,0.4)"} stroke={color} strokeWidth={active ? 3 : 2} style={{ transition: "all .2s" }} />
                      <text x={p.cx} y={p.cy + 7} textAnchor="middle" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, fill: active ? "#000" : color }}>{p.id}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected position info */}
          {sel ? (
            <div className="card rounded-xl p-5" style={{ border: `1px solid ${TIER_COLORS[sel.tier]}44` }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: TIER_COLORS[sel.tier] }}>Position {sel.id} · {sel.tier}</div>
                  <div className="font-semibold" style={{ color: 'var(--sand)' }}>{sel.label}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{sel.desc}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: TIER_COLORS[sel.tier] }}>{sel.price}€</div>
              </div>
              <a href={PACKAGES.find(p => p.tier === sel.tier)?.helloasso || "#"} target="_blank" rel="noreferrer"
                className="btn-primary mt-4 inline-flex" style={{ textDecoration: "none", background: TIER_COLORS[sel.tier], color: sel.tier === "Or" ? "#000" : "white" }}>
                <ExternalLink size={14} /> Réserver cette position
              </a>
            </div>
          ) : (
            <div className="card rounded-xl p-5 text-center" style={{ color: 'var(--muted)' }}>
              <MapPin size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Cliquez sur une lettre pour choisir une position</p>
            </div>
          )}
        </div>

        {/* Packages */}
        <div>
          <h2 className="text-sm uppercase tracking-widest mb-6" style={{ color: 'var(--muted)' }}>Forfaits disponibles</h2>
          <div className="space-y-4">
            {PACKAGES.map(pkg => (
              <div key={pkg.tier} className="card rounded-xl p-6 transition-all duration-200"
                style={{ border: pkg.featured ? `2px solid ${TIER_COLORS[pkg.tier]}` : undefined }}>
                {pkg.featured && (
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: TIER_COLORS[pkg.tier] }}>⭐ Le plus populaire</div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', letterSpacing: '2px', color: TIER_COLORS[pkg.tier] }}>
                      {pkg.tier}
                    </h3>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      Positions : {pkg.positions.join(", ")}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: 'var(--sand)' }}>{pkg.price}€</div>
                </div>
                <ul className="space-y-2 mb-5">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dim)' }}>
                      <Check size={14} style={{ color: TIER_COLORS[pkg.tier], flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <a href={pkg.helloasso} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium uppercase tracking-wider transition-all"
                  style={{ textDecoration: "none", background: TIER_COLORS[pkg.tier], color: pkg.tier === "Or" || pkg.tier === "Argent" ? "#000" : "white" }}>
                  <ExternalLink size={14} /> Choisir {pkg.tier}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 card rounded-xl p-5 text-center">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--sand)' }}>📄 Notre dossier sponsor</p>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Téléchargez notre dossier complet : stats de visibilité, photos, planning.</p>
            <a href="https://canva.link/n0qciu7sne4od97" target="_blank" rel="noreferrer"
              className="btn-ghost text-sm" style={{ textDecoration: "none" }}>
              <ExternalLink size={14} /> Voir le dossier sponsor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
