"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { GpsPosition } from "@/lib/types";
import { MapPin, Navigation } from "lucide-react";

export default function SuiviGPS() {
  const [position, setPosition] = useState<GpsPosition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("gps_positions").select("*").order("created_at", { ascending: false }).limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setPosition(data[0]);
        setLoading(false);
      });

    // Realtime subscription
    const channel = supabase.channel("gps").on("postgres_changes", {
      event: "INSERT", schema: "public", table: "gps_positions"
    }, payload => setPosition(payload.new as GpsPosition)).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section id="suivi" className="py-24 px-8" style={{ background: 'var(--night2)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="section-tag">Position en direct</div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '2px', color: 'var(--sand)', marginBottom: 8 }}>
          Suivi GPS
        </h2>
        <p className="mb-10 text-sm" style={{ color: 'var(--muted)' }}>
          Notre position se met à jour en temps réel depuis notre téléphone.
        </p>

        {/* Map embed or position info */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,.08)' }}>
          {position ? (
            <iframe
              src={`https://maps.google.com/maps?q=${position.lat},${position.lng}&z=10&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              title="Position GPS"
            />
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-4" style={{ background: 'var(--night3)' }}>
              <Navigation size={48} style={{ color: 'var(--muted)', opacity: 0.3 }} />
              <p style={{ color: 'var(--muted)' }}>
                {loading ? "Chargement..." : "Le suivi GPS démarrera au début du raid (19 février 2026)"}
              </p>
            </div>
          )}
        </div>

        {position && (
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dim)' }}>
              <MapPin size={16} style={{ color: 'var(--terra)' }} />
              {position.label || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`}
            </div>
            {position.km_parcourus && (
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                {position.km_parcourus} km parcourus
              </div>
            )}
            <div className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
              Mis à jour : {new Date(position.created_at).toLocaleString("fr-FR")}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
