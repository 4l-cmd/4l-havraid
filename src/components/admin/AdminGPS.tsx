"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { GpsPosition } from "@/lib/types";
import { Navigation, MapPin, Smartphone, Loader2, CheckCircle } from "lucide-react";

export default function AdminGPS() {
  const [positions, setPositions] = useState<GpsPosition[]>([]);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [manual, setManual] = useState({ lat: "", lng: "", label: "", km: "" });
  const supabase = createClient();

  useEffect(() => {
    supabase.from("gps_positions").select("*").order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => setPositions(data ?? []));
  }, []);

  async function savePosition(lat: number, lng: number, label?: string, km?: number) {
    const { data } = await supabase.from("gps_positions").insert({
      lat, lng, label, km_parcourus: km
    }).select().single();
    if (data) {
      setPositions(prev => [data, ...prev.slice(0, 9)]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  async function usePhoneGPS() {
    if (!navigator.geolocation) return alert("Géolocalisation non disponible");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        await savePosition(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      err => { alert("Erreur GPS : " + err.message); setLocating(false); }
    );
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manual.lat || !manual.lng) return;
    await savePosition(parseFloat(manual.lat), parseFloat(manual.lng), manual.label, manual.km ? parseInt(manual.km) : undefined);
    setManual({ lat: "", lng: "", label: "", km: "" });
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 24 }}>
        SUIVI GPS
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Phone GPS */}
        <div className="card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone size={20} style={{ color: 'var(--terra)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Depuis votre téléphone</h3>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
            Cliquez pour envoyer votre position GPS actuelle. Le site se met à jour en temps réel.
          </p>
          <button onClick={usePhoneGPS} disabled={locating} className="btn-primary w-full justify-center">
            {locating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            {locating ? "Localisation en cours..." : "📍 Envoyer ma position GPS"}
          </button>
          {success && (
            <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--green-light)' }}>
              <CheckCircle size={16} /> Position envoyée !
            </div>
          )}
        </div>

        {/* Manual */}
        <div className="card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={20} style={{ color: 'var(--terra)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Position manuelle</h3>
          </div>
          <form onSubmit={submitManual} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Latitude</label>
                <input value={manual.lat} onChange={e => setManual(m => ({ ...m, lat: e.target.value }))} placeholder="33.589886" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Longitude</label>
                <input value={manual.lng} onChange={e => setManual(m => ({ ...m, lng: e.target.value }))} placeholder="-7.603869" required />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Label (optionnel)</label>
              <input value={manual.label} onChange={e => setManual(m => ({ ...m, label: e.target.value }))} placeholder="Ex: Tanger, Maroc" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Km parcourus</label>
              <input type="number" value={manual.km} onChange={e => setManual(m => ({ ...m, km: e.target.value }))} placeholder="1240" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              <MapPin size={14} /> Enregistrer
            </button>
          </form>
        </div>
      </div>

      {/* History */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--sand)' }}>Historique des positions</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.04)' }}>
          {positions.length === 0 ? (
            <p className="p-6 text-sm" style={{ color: 'var(--muted)' }}>Aucune position enregistrée.</p>
          ) : positions.map(p => (
            <div key={p.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {p.label || `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`}
                </div>
                {p.km_parcourus && <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.km_parcourus} km parcourus</div>}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {new Date(p.created_at).toLocaleString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
