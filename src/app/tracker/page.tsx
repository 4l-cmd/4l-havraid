"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Navigation, Wifi, WifiOff, Play, Square, MapPin, AlertCircle, CheckCircle, Send } from "lucide-react";

export default function TrackerPage() {
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<"idle" | "gps_wait" | "sending" | "ok" | "error">("idle");
  const [lastSent, setLastSent] = useState<string>("");
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number; acc?: number } | null>(null);
  const [kmParcourus, setKmParcourus] = useState("");
  const [label, setLabel] = useState("");
  const [sendCount, setSendCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [nextSendIn, setNextSendIn] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const kmRef = useRef("");
  const labelRef = useRef("");

  const INTERVAL_SECONDS = 60;

  // Keep refs in sync so interval callback always has latest values
  useEffect(() => { kmRef.current = kmParcourus; }, [kmParcourus]);
  useEffect(() => { labelRef.current = label; }, [label]);

  async function sendPosition(lat: number, lng: number) {
    setStatus("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("gps_positions").insert({
        lat,
        lng,
        label: labelRef.current || null,
        km_parcourus: kmRef.current ? parseFloat(kmRef.current) : null,
      });
      if (error) throw error;
      const now = new Date().toLocaleTimeString("fr-FR");
      setLastSent(now);
      setSendCount(c => c + 1);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Erreur réseau");
      setStatus("error");
      setTimeout(() => { setStatus("idle"); setErrorMsg(""); }, 6000);
    }
  }

  function startTracking() {
    if (!("geolocation" in navigator)) {
      setErrorMsg("GPS non disponible sur cet appareil");
      setStatus("error");
      return;
    }

    setTracking(true);
    setStatus("gps_wait");
    setNextSendIn(INTERVAL_SECONDS);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        setCurrentPos({ lat, lng, acc });
        pendingPosRef.current = { lat, lng };
      },
      (err) => {
        setErrorMsg("GPS : " + err.message);
        setStatus("error");
      },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 }
    );

    // Send first time after 8s, then every INTERVAL_SECONDS
    const firstTimer = setTimeout(() => {
      if (pendingPosRef.current) {
        sendPosition(pendingPosRef.current.lat, pendingPosRef.current.lng);
        setNextSendIn(INTERVAL_SECONDS);
      }
    }, 8000);

    intervalRef.current = setInterval(() => {
      if (pendingPosRef.current) {
        sendPosition(pendingPosRef.current.lat, pendingPosRef.current.lng);
        setNextSendIn(INTERVAL_SECONDS);
      }
    }, INTERVAL_SECONDS * 1000);

    countdownRef.current = setInterval(() => {
      setNextSendIn(n => (n <= 1 ? INTERVAL_SECONDS : n - 1));
    }, 1000);

    return () => clearTimeout(firstTimer);
  }

  function stopTracking() {
    setTracking(false);
    setStatus("idle");
    setNextSendIn(0);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    pendingPosRef.current = null;
  }

  function sendNow() {
    const pos = pendingPosRef.current ?? currentPos;
    if (!pos) { setErrorMsg("GPS pas encore disponible"); setStatus("error"); return; }
    setNextSendIn(INTERVAL_SECONDS);
    sendPosition(pos.lat, pos.lng);
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const amber = "#F0A500";
  const sand = "#E8DCC8";
  const muted = "#888880";
  const night = "#0A0A0A";
  const card = "#141414";
  const border = "#1E1E1E";

  return (
    <div style={{ minHeight: "100vh", background: night, color: sand, fontFamily: "Outfit, system-ui, sans-serif", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ background: card, borderBottom: `1px solid ${border}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Navigation size={22} style={{ color: amber }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: 3, color: sand }}>
            4L HAVRAID · TRACKER
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {tracking
            ? <><Wifi size={18} style={{ color: "#4CAF50" }} /><span style={{ fontSize: "0.75rem", color: "#4CAF50", fontWeight: 700 }}>EN LIGNE</span></>
            : <><WifiOff size={18} style={{ color: muted }} /><span style={{ fontSize: "0.75rem", color: muted }}>HORS LIGNE</span></>
          }
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* GPS card */}
        <div style={{ background: card, border: `1px solid ${currentPos ? "rgba(240,165,0,0.25)" : border}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MapPin size={15} style={{ color: amber }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: 2, textTransform: "uppercase", color: muted }}>Signal GPS</span>
            {currentPos?.acc && (
              <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: currentPos.acc < 20 ? "#4CAF50" : currentPos.acc < 50 ? amber : "#ff8080" }}>
                ±{Math.round(currentPos.acc)}m
              </span>
            )}
          </div>
          {currentPos ? (
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: muted, marginBottom: 2 }}>Latitude</div>
                <div style={{ color: sand, fontWeight: 600, fontFamily: "monospace", fontSize: "0.95rem" }}>{currentPos.lat.toFixed(5)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: muted, marginBottom: 2 }}>Longitude</div>
                <div style={{ color: sand, fontWeight: 600, fontFamily: "monospace", fontSize: "0.95rem" }}>{currentPos.lng.toFixed(5)}</div>
              </div>
            </div>
          ) : (
            <p style={{ color: muted, fontSize: "0.9rem" }}>
              {tracking ? "⌛ Acquisition du signal GPS..." : "Appuyez sur Démarrer pour activer le GPS"}
            </p>
          )}
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: 2, textTransform: "uppercase", color: muted, marginBottom: 6 }}>
              Km parcourus
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={kmParcourus}
              onChange={e => setKmParcourus(e.target.value)}
              placeholder="ex: 342"
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: sand, padding: "12px 14px", width: "100%", fontSize: "1.1rem", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: 2, textTransform: "uppercase", color: muted, marginBottom: 6 }}>
              Lieu (optionnel)
            </label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Fès, bivouac désert..."
              autoCorrect="off"
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: sand, padding: "12px 14px", width: "100%", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Status banner */}
        {status !== "idle" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10,
            background: status === "ok" ? "rgba(76,175,80,0.1)" : status === "error" ? "rgba(255,80,80,0.1)" : "rgba(240,165,0,0.1)",
            border: `1px solid ${status === "ok" ? "rgba(76,175,80,0.3)" : status === "error" ? "rgba(255,80,80,0.3)" : "rgba(240,165,0,0.3)"}`,
            color: status === "ok" ? "#4CAF50" : status === "error" ? "#ff6060" : amber,
          }}>
            {status === "ok" && <CheckCircle size={18} />}
            {status === "error" && <AlertCircle size={18} />}
            {(status === "gps_wait" || status === "sending") && (
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
            )}
            <span style={{ fontSize: "0.9rem" }}>
              {status === "ok" && `✓ Position envoyée à ${lastSent}`}
              {status === "error" && (errorMsg || "Erreur")}
              {status === "gps_wait" && "Acquisition du GPS en cours..."}
              {status === "sending" && "Envoi en cours..."}
            </span>
          </div>
        )}

        {/* Main control */}
        {!tracking ? (
          <button
            onClick={startTracking}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "18px", borderRadius: 12, border: "none",
              background: amber, color: "#1a1a1a", fontWeight: 700, fontSize: "1rem",
              letterSpacing: 2, cursor: "pointer", fontFamily: "inherit",
              WebkitTapHighlightColor: "rgba(0,0,0,0)", touchAction: "manipulation",
            }}
          >
            <Play size={20} /> DÉMARRER LE SUIVI AUTO
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Stats */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "0.6rem", color: muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Prochain envoi</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: amber, lineHeight: 1 }}>{nextSendIn}s</div>
              </div>
              <div style={{ flex: 1, background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "0.6rem", color: muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Envois ok</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#4CAF50", lineHeight: 1 }}>{sendCount}</div>
              </div>
            </div>

            {/* Send now */}
            <button
              onClick={sendNow}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px", borderRadius: 10, border: `1px solid ${border}`,
                background: card, color: sand, fontWeight: 600, fontSize: "0.95rem",
                cursor: "pointer", fontFamily: "inherit",
                WebkitTapHighlightColor: "rgba(0,0,0,0)", touchAction: "manipulation",
              }}
            >
              <Send size={16} /> Envoyer maintenant
            </button>

            {/* Stop */}
            <button
              onClick={stopTracking}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px", borderRadius: 10, border: "1px solid rgba(255,80,80,0.3)",
                background: "rgba(255,80,80,0.08)", color: "#ff8080", fontWeight: 600, fontSize: "0.95rem",
                cursor: "pointer", fontFamily: "inherit",
                WebkitTapHighlightColor: "rgba(0,0,0,0)", touchAction: "manipulation",
              }}
            >
              <Square size={16} /> Arrêter le suivi
            </button>
          </div>
        )}

        {/* Last sent */}
        {lastSent && (
          <p style={{ color: muted, fontSize: "0.8rem", textAlign: "center" }}>
            Dernier envoi réussi : {lastSent}
          </p>
        )}

        {/* Info */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${border}`, padding: "14px 16px" }}>
          <p style={{ color: muted, fontSize: "0.8rem", lineHeight: 1.8, margin: 0 }}>
            ℹ️ Gardez cet onglet ouvert et l'écran allumé.<br />
            Position envoyée automatiquement toutes les <strong style={{ color: sand }}>60 secondes</strong>.<br />
            Vos proches voient la mise à jour en temps réel sur le site.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
