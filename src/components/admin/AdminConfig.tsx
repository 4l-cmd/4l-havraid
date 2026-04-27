"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Save, ExternalLink, AtSign, Link2, Euro, Globe, Check } from "lucide-react";

interface Config {
  id?: string;
  helloasso_km_url: string;
  helloasso_bronze_url: string;
  helloasso_argent_url: string;
  helloasso_or_url: string;
  instagram_url: string;
  dossier_sponsor_url: string;
  km_price: number;
  objectif_financier: number;
  site_actif: boolean;
  message_accueil: string;
}

const DEFAULT_CONFIG: Config = {
  helloasso_km_url: '',
  helloasso_bronze_url: '',
  helloasso_argent_url: '',
  helloasso_or_url: '',
  instagram_url: 'https://www.instagram.com/4l_havraid/',
  dossier_sponsor_url: '',
  km_price: 5,
  objectif_financier: 5000,
  site_actif: true,
  message_accueil: '',
};

export default function AdminConfig() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("config").select("*").limit(1).single()
      .then(({ data }) => {
        if (data) setConfig(data);
        setLoading(false);
      });
  }, []);

  async function save() {
    setSaving(true);
    if (config.id) {
      await supabase.from("config").update(config).eq("id", config.id);
    } else {
      const { data } = await supabase.from("config").insert(config).select().single();
      if (data) setConfig(data);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="text-sm" style={{ color: 'var(--muted)' }}>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)' }}>
          CONFIGURATION
        </h2>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      </div>

      <div className="space-y-6">
        {/* HelloAsso */}
        <section className="card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Euro size={18} style={{ color: 'var(--terra)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Liens HelloAsso</h3>
          </div>
          <div className="space-y-4">
            <ConfigField label="Adoption de km (5€/km)" value={config.helloasso_km_url}
              onChange={v => setConfig(c => ({ ...c, helloasso_km_url: v }))}
              placeholder="https://www.helloasso.com/associations/..." hint="Formulaire HelloAsso pour adopter un km" />
            <ConfigField label="Pack Bronze (350€)" value={config.helloasso_bronze_url}
              onChange={v => setConfig(c => ({ ...c, helloasso_bronze_url: v }))}
              placeholder="https://www.helloasso.com/associations/..." />
            <ConfigField label="Pack Argent (650€)" value={config.helloasso_argent_url}
              onChange={v => setConfig(c => ({ ...c, helloasso_argent_url: v }))}
              placeholder="https://www.helloasso.com/associations/..." />
            <ConfigField label="Pack Or (950€)" value={config.helloasso_or_url}
              onChange={v => setConfig(c => ({ ...c, helloasso_or_url: v }))}
              placeholder="https://www.helloasso.com/associations/..." />
          </div>
        </section>

        {/* Social & links */}
        <section className="card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Link2 size={18} style={{ color: 'var(--terra)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Liens externes</h3>
          </div>
          <div className="space-y-4">
            <ConfigField label="Instagram" value={config.instagram_url}
              onChange={v => setConfig(c => ({ ...c, instagram_url: v }))}
              placeholder="https://www.instagram.com/..."
              icon={<AtSign size={14} />} />
            <ConfigField label="Dossier sponsor (PDF)" value={config.dossier_sponsor_url}
              onChange={v => setConfig(c => ({ ...c, dossier_sponsor_url: v }))}
              placeholder="https://drive.google.com/..." hint="Lien vers votre dossier de sponsoring"
              icon={<ExternalLink size={14} />} />
          </div>
        </section>

        {/* Paramètres financiers */}
        <section className="card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} style={{ color: 'var(--terra)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Paramètres financiers</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Prix du km (€)</label>
              <input type="number" value={config.km_price} onChange={e => setConfig(c => ({ ...c, km_price: parseInt(e.target.value) || 5 }))} style={{ width: 120 }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Objectif financier (€)</label>
              <input type="number" value={config.objectif_financier} onChange={e => setConfig(c => ({ ...c, objectif_financier: parseInt(e.target.value) || 5000 }))} style={{ width: 120 }} />
            </div>
          </div>
        </section>

        {/* Site options */}
        <section className="card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} style={{ color: 'var(--terra)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Options du site</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={config.site_actif} onChange={e => setConfig(c => ({ ...c, site_actif: e.target.checked }))}
                style={{ accentColor: 'var(--accent)', width: 18, height: 18 }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Site actif</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Décocher pour afficher une page de maintenance</div>
              </div>
            </label>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
                Message d&apos;accueil (affiché sous le titre)
              </label>
              <textarea value={config.message_accueil} onChange={e => setConfig(c => ({ ...c, message_accueil: e.target.value }))}
                rows={2} placeholder="Message personnalisé affiché sur la page d'accueil..."
                style={{ width: '100%', background: 'var(--night)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '0.9rem', resize: 'vertical' }} />
            </div>
          </div>
        </section>

        {/* Admin info */}
        <section className="card rounded-xl p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--sand)' }}>Informations légales</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: 'var(--muted)' }}>
            <div><span style={{ color: 'var(--text)' }}>Association :</span> 4L Havraid</div>
            <div><span style={{ color: 'var(--text)' }}>SIREN :</span> 103 219 689</div>
            <div><span style={{ color: 'var(--text)' }}>SIRET :</span> 103 219 689 00017</div>
            <div><span style={{ color: 'var(--text)' }}>Admins :</span> gabin.ranson76@gmail.com, jules.marchand76@gmail.com</div>
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
            Pour modifier les emails admin, éditer <code style={{ background: 'rgba(255,255,255,.06)', padding: '2px 6px', borderRadius: 4 }}>src/lib/supabase.ts</code> → tableau ADMIN_EMAILS.
          </p>
        </section>
      </div>
    </div>
  );
}

function ConfigField({ label, value, onChange, placeholder, hint, icon }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>{icon}</span>
        )}
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ paddingLeft: icon ? 36 : undefined }} />
      </div>
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--muted)', opacity: 0.7 }}>{hint}</p>}
    </div>
  );
}
