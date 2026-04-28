"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Navigation, Wifi, WifiOff, Play, Square, MapPin, AlertCircle, CheckCircle } from "lucide-react";

const SECRET = "havraid2026"; // code d'accès simple

export default function TrackerPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<"idle" | "gps_wait" | "sending" | "ok" | "error">("idle");
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [kmParcourus, setKmParcourus] = useState("");
  const [label, setLabel] = useState("");
  const [sendCount, setSendCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [nextSendIn, setNextSendIn] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingPosRef = useRef<{ lat: number; lng: number } | null>(null);

  const INTERVAL_SECONDS = 60;

  function unlock() {
    if (code.toLowerCase().trim() === SECRET) {
      setUnlocked(true);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
    }
  }

  async function sendPosition(lat: number, lng: number) {
    setStatus("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("gps_positions").insert({
        lat,
        lng,
        label: label || null,
        km_parcourus: kmParcourus ? parseFloat(kmParcourus) : null,
      });
      if (error) throw error;
      setLastSent(new Date());
      setSendCount(c => c + 1);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setErrorMsg(err.message ?? "Erreur d'envoi");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  function startTracking() {
    if (!navigator.geolocation) {
      setErrorMsg("GPS non disponible sur cet appareil");
      setStatus("error");
      return;
    }

    setTracking(true);
    setStatus("gps_wait");
    setNextSendIn(INTERVAL_SECONDS);

    // Watch GPS position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCurrentPos({ lat, lng });
        pendingPosRef.current = { lat, lng };
      },
      (err) => {
        setErrorMsg("Impossible d'obtenir le GPS : " + err.message);
        setStatus("error");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 }
    );

    // Send immediately, then every INTERVAL_SECONDS
    const doSend = () => {
      const pos = pendingPosRef.current;
      if (pos) {
        sendPosition(pos.lat, pos.lng);
        setNextSendIn(INTERVAL_SECONDS);
      }
    };

    // First send after 5s (let GPS stabilize)
    setTimeout(() => {
      if (pendingPosRef.current) doSend();
    }, 5000);

    intervalRef.current = setInterval(doSend, INTERVAL_SECONDS * 1000);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setNextSendIn(n => {
        if (n <= 1) return INTERVAL_SECONDS;
        return n - 1;
      });
    }, 1000);
  }

  function stopTracking() {
    setTracking(false);
    setStatus("idle");
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    pendingPosRef.current = null;
    setNextSendIn(0);
  }

  async function sendNow() {
    const pos = pendingPosRef.current ?? currentPos;
    if (!pos) { setErrorMsg("GPS pas encore disponible"); setStatus("error"); return; }
    setNextSendIn(INTERVAL_SECONDS);
    await sendPosition(pos.lat, pos.lng);
  }

  useEffect(() => () => stopTracking(), []);

  // ---- LOGIN SCREEN ----
  if (!unlocked) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <Navigation size={48} style={{ color: 'var(--amber)', margin: '0 auto 24px' }} />
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem', letterSpacing: 4, color: 'var(--sand)', marginBottom: 8 }}>
            4L HAVRAID
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Mode suivi GPS — Pilotes uniquement</p>

          <form onSubmit={e => { e.preventDefault(); unlock(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              inputMode="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Code d'accès"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              style={{ textAlign: 'center', background: codeError ? 'rgba(255,80,80,0.08)' : undefined, borderColor: codeError ? 'rgba(255,80,80,0.4)' : undefined, letterSpacing: 3 }}
            />
            {codeError && <p style={{ color: '#ff5050', fontSize: '0.85rem' }}>Code incorrect — vérifiez la saisie</p>}
            <button type="submit" className="btn btn-amber" style={{ justifyContent: 'center' }}>
              Accéder au tracker
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- TRACKER SCREEN ----
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '32px 20px', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Navigation size={28} style={{ color: 'var(--amber)' }} />
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', letterSpacing: 3, color: 'var(--sand)', lineHeight: 1 }}>
              TRACKER GPS
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>4L Havraid · Le Havre → Marrakech</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {tracking ? (
              <Wifi size={20} style={{ color: '#4CAF50' }} />
            ) : (
              <WifiOff size={20} style={{ color: 'var(--muted)' }} />
            )}
            <span style={{ fontSize: '0.75rem', color: tracking ? '#4CAF50' : 'var(--muted)', fontWeight: 600 }}>
              {tracking ? "EN LIGNE" : "HORS LIGNE"}
            </span>
          </div>
        </div>

        {/* Current position */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 16, background: currentPos ? 'rgba(240,165,0,0.04)' : undefined, borderColor: currentPos ? 'rgba(240,165,0,0.2)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MapPin size={16} style={{ color: 'var(--amber)' }} />
            <span style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)' }}>Position GPS</span>
          </div>
          {currentPos ? (
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>Latitude</div>
                <div style={{ color: 'var(--sand)', fontWeight: 600, fontFamily: 'monospace' }}>{currentPos.lat.toFixed(5)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>Longitude</div>
                <div style={{ color: 'var(--sand)', fontWeight: 600, fontFamily: 'monospace' }}>{currentPos.lng.toFixed(5)}</div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              {tracking ? "⌛ Acquisition du signal GPS..." : "Démarrez le suivi pour obtenir la position"}
            </p>
          )}
        </div>

        {/* Manual info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
              Km parcourus (à mettre à jour)
            </label>
            <input
              type="number"
              value={kmParcourus}
              onChange={e => setKmParcourus(e.target.value)}
              placeholder="ex: 342"
              style={{ fontSize: '1.2rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
              Lieu / Description (optionnel)
            </label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="ex: Bivouac dans le désert, Fès..."
            />
          </div>
        </div>

        {/* Status */}
        {status !== "idle" && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 8, marginBottom: 16,
            background: status === "ok" ? 'rgba(76,175,80,0.1)' : status === "error" ? 'rgba(255,80,80,0.1)' : 'rgba(240,165,0,0.1)',
            border: `1px solid ${status === "ok" ? 'rgba(76,175,80,0.3)' : status === "error" ? 'rgba(255,80,80,0.3)' : 'rgba(240,165,0,0.3)'}`,
            color: status === "ok" ? '#4CAF50' : status === "error" ? '#ff5050' : 'var(--amber)',
          }}>
            {status === "ok" && <CheckCircle size={16} />}
            {status === "error" && <AlertCircle size={16} />}
            {status === "gps_wait" && <Navigation size={16} />}
            {status === "sending" && <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />}
            <span style={{ fontSize: '0.9rem' }}>
              {status === "ok" && "Position envoyée !"}
              {status === "error" && (errorMsg || "Erreur")}
              {status === "gps_wait" && "Attente du signal GPS..."}
              {status === "sending" && "Envoi en cours..."}
            </span>
          </div>
        )}

        {/* Control buttons */}
        {!tracking ? (
          <button
            onClick={startTracking}
            className="btn btn-amber"
            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', letterSpacing: 2 }}
          >
            <Play size={18} /> DÉMARRER LE SUIVI AUTO
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Countdown + send now */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="card" style={{ flex: 1, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Prochain envoi</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', color: 'var(--amber)', lineHeight: 1 }}>
                  {nextSendIn}s
                </div>
              </div>
              <div className="card" style={{ flex: 1, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Envois effectués</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', color: 'var(--amber)', lineHeight: 1 }}>
                  {sendCount}
                </div>
              </div>
            </div>

            <button onClick={sendNow} className="btn btn-outline" style={{ justifyContent: 'center', padding: '12px' }}>
              <Navigation size={16} /> Envoyer maintenant
            </button>
            <button
              onClick={stopTracking}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 8, color: '#ff8080', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
            >
              <Square size={16} /> Arrêter le suivi
            </button>
          </div>
        )}

        {/* Last sent */}
        {lastSent && (
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: 16 }}>
            Dernier envoi : {lastSent.toLocaleTimeString('fr-FR')}
          </p>
        )}

        {/* Info */}
        <div style={{ marginTop: 32, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.7 }}>
            ℹ️ Gardez cet onglet ouvert et l'écran allumé pour un suivi continu.<br />
            La position est envoyée automatiquement toutes les <strong style={{ color: 'var(--sand)' }}>60 secondes</strong>.<br />
            Vos proches voient la mise à jour en temps réel sur le site.
          </p>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
