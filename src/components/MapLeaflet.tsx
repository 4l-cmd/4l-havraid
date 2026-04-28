"use client";
import { useEffect, useRef } from "react";

interface Pos { lat: number; lng: number; created_at: string; }

interface Props {
  positions: Pos[];
  height?: number;
}

export default function MapLeaflet({ positions, height = 420 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!containerRef.current || positions.length === 0) return;

    let L: any;
    import("leaflet").then((mod) => {
      L = mod.default;

      // Fix default marker icons (Leaflet + webpack issue)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current!, {
          zoomControl: true,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(mapRef.current);
      }

      // Clear previous layers
      layersRef.current.forEach(l => l.remove());
      layersRef.current = [];

      if (positions.length === 0) return;

      const sorted = [...positions].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const coords: [number, number][] = sorted.map(p => [p.lat, p.lng]);

      // Draw the route polyline
      if (coords.length > 1) {
        const line = L.polyline(coords, {
          color: "#F0A500",
          weight: 3,
          opacity: 0.8,
        }).addTo(mapRef.current);
        layersRef.current.push(line);
      }

      // Start marker (Le Havre by default if only one point)
      const startIcon = L.divIcon({
        html: `<div style="background:#4CAF50;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>`,
        iconSize: [12, 12],
        className: "",
      });
      const startMarker = L.marker(coords[0], { icon: startIcon })
        .bindPopup("🚦 Départ")
        .addTo(mapRef.current);
      layersRef.current.push(startMarker);

      // Current position marker (pulsing amber)
      const latest = coords[coords.length - 1];
      const currentIcon = L.divIcon({
        html: `<div style="position:relative;width:20px;height:20px;">
          <div style="position:absolute;inset:0;background:rgba(240,165,0,0.3);border-radius:50%;animation:gps-pulse 1.5s ease-out infinite;"></div>
          <div style="position:absolute;inset:4px;background:#F0A500;border-radius:50%;border:2px solid white;"></div>
        </div>
        <style>@keyframes gps-pulse{0%{transform:scale(1);opacity:0.7}100%{transform:scale(2.5);opacity:0}}</style>`,
        iconSize: [20, 20],
        className: "",
      });
      const currentMarker = L.marker(latest, { icon: currentIcon })
        .bindPopup("📍 Position actuelle")
        .addTo(mapRef.current);
      layersRef.current.push(currentMarker);

      // Fit map to route
      const bounds = L.latLngBounds(coords);
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    });
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={containerRef} style={{ width: "100%", height, borderRadius: 0 }} />
    </>
  );
}
