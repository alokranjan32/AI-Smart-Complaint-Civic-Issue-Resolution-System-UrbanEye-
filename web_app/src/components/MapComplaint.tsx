"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getHotspots, type MapHotspot } from "../services/mapService";

const DEFAULT_CENTER = {
  latitude: 25.6041,
  longitude: 85.1376,
};

function getCategoryColor(category: string) {
  switch (category) {
    case "Roads":
      return "#d62828";
    case "Water":
      return "#2563eb";
    case "Sanitation":
      return "#2a9d8f";
    case "Electricity":
      return "#f59e0b";
    default:
      return "#6c7aa1";
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "Critical";
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return priority || "Unknown";
  }
}

function buildMapCenter(hotspots: MapHotspot[]) {
  if (hotspots.length === 0) {
    return DEFAULT_CENTER;
  }

  const totals = hotspots.reduce(
    (accumulator, hotspot) => ({
      latitude: accumulator.latitude + hotspot.latitude,
      longitude: accumulator.longitude + hotspot.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );

  return {
    latitude: totals.latitude / hotspots.length,
    longitude: totals.longitude / hotspots.length,
  };
}

export default function MapComplaint() {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const [hotspots, setHotspots] = useState<MapHotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadHotspots = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getHotspots();

        if (isMounted) {
          setHotspots(response);
        }
      } catch (loadError) {
        if (isMounted) {
          setHotspots([]);
          setError("Live hotspot data is unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHotspots();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      if (!mapElementRef.current || mapInstanceRef.current) {
        return;
      }

      const leaflet = await import("leaflet");

      if (cancelled || !mapElementRef.current) {
        return;
      }

      const center = buildMapCenter(hotspots);

      mapInstanceRef.current = leaflet.map(mapElementRef.current, {
        zoomControl: true,
      }).setView([center.latitude, center.longitude], 13);

      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = leaflet.layerGroup().addTo(mapInstanceRef.current);
    };

    initializeMap();

    return () => {
      cancelled = true;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, [hotspots]);

  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !layerGroupRef.current) {
        return;
      }

      const leaflet = await import("leaflet");
      layerGroupRef.current.clearLayers();

      if (hotspots.length === 0) {
        mapInstanceRef.current.setView([DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude], 12);
        return;
      }

      const bounds = leaflet.latLngBounds(
        hotspots.map((hotspot) => [hotspot.latitude, hotspot.longitude]),
      );

      hotspots.forEach((hotspot) => {
        const markerHtml = `
          <div style="
            width: 18px;
            height: 18px;
            border-radius: 999px;
            background: ${getCategoryColor(hotspot.category)};
            border: 3px solid white;
            box-shadow: 0 6px 20px rgba(20,33,61,0.24);
          "></div>
        `;

        const icon = leaflet.divIcon({
          className: "urbaneye-map-marker",
          html: markerHtml,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        leaflet
          .marker([hotspot.latitude, hotspot.longitude], { icon })
          .bindPopup(`
            <div style="min-width: 220px; font-family: Avenir Next, Segoe UI, sans-serif;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280;">
                ${hotspot.category}
              </div>
              <div style="margin-top: 8px; font-size: 16px; font-weight: 700; color: #14213d;">
                ${hotspot.title}
              </div>
              <div style="margin-top: 6px; color: #4f5d75; line-height: 1.45;">
                ${hotspot.location}
              </div>
              <div style="margin-top: 10px; color: #4f5d75; line-height: 1.45;">
                Priority: ${getPriorityLabel(hotspot.priority)}<br/>
                Status: ${hotspot.status.replace("_", " ")}
              </div>
            </div>
          `)
          .addTo(layerGroupRef.current);
      });

      mapInstanceRef.current.fitBounds(bounds.pad(0.2));
    };

    void updateMarkers();
  }, [hotspots]);

  const summary = useMemo(() => {
    const criticalOrHigh = hotspots.filter((item) => ["CRITICAL", "HIGH"].includes(item.priority)).length;
    const openItems = hotspots.filter((item) => item.status !== "RESOLVED").length;
    const categories = new Set(hotspots.map((item) => item.category)).size;

    return {
      total: hotspots.length,
      criticalOrHigh,
      openItems,
      categories,
    };
  }, [hotspots]);

  return (
    <section className="grid gap-6 py-8 xl:grid-cols-[minmax(0,1.45fr)_360px]">
      <div className="glass-card overflow-hidden rounded-[32px] border border-[var(--border)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Live civic map
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Real complaint hotspots across the city</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
              This map uses OpenStreetMap tiles with live complaint coordinates from the UrbanEye
              backend, so field activity and public reporting stay grounded in one shared view.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold shadow-sm">
              {summary.total} live markers
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[rgba(20,33,61,0.04)] px-4 py-2 text-sm font-medium text-[var(--ink-muted)]">
              {summary.categories} categories
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-5 top-5 z-[500] flex flex-wrap gap-2">
            <span className="rounded-full bg-white/88 px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-sm">
              OpenStreetMap live layer
            </span>
            <span className="rounded-full bg-[rgba(20,33,61,0.82)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
              High risk markers highlighted
            </span>
          </div>
          <div ref={mapElementRef} className="urbaneye-map-canvas h-[560px] w-full" />
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(244,239,230,0.72)]">
              <div className="rounded-full bg-white px-5 py-3 text-sm font-semibold shadow-sm">
                Loading hotspot map...
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5">
        <div className="glass-card rounded-[32px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            Map summary
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[24px] bg-white/82 p-4 shadow-sm">
              <p className="text-sm text-[var(--ink-muted)]">Total complaints mapped</p>
              <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
            </div>
            <div className="rounded-[24px] bg-white/82 p-4 shadow-sm">
              <p className="text-sm text-[var(--ink-muted)]">High risk markers</p>
              <p className="mt-2 text-3xl font-semibold">{summary.criticalOrHigh}</p>
            </div>
            <div className="rounded-[24px] bg-white/82 p-4 shadow-sm">
              <p className="text-sm text-[var(--ink-muted)]">Open complaints</p>
              <p className="mt-2 text-3xl font-semibold">{summary.openItems}</p>
            </div>
          </div>
          {error ? <p className="mt-4 text-sm text-[var(--accent-dark)]">{error}</p> : null}
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            Latest hotspots
          </p>
          <div className="mt-4 grid gap-3">
            {hotspots.length === 0 && !loading ? (
              <div className="rounded-[24px] bg-white/80 p-4 text-sm text-[var(--ink-muted)]">
                No mapped complaints are available yet.
              </div>
            ) : null}
            {hotspots.slice(0, 6).map((hotspot) => (
              <div key={hotspot.id} className="rounded-[24px] bg-white/82 p-4 shadow-sm transition hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                      {hotspot.category}
                    </p>
                    <h3 className="mt-2 font-semibold">{hotspot.title}</h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: getCategoryColor(hotspot.category) }}
                  >
                    {getPriorityLabel(hotspot.priority)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--ink-muted)]">{hotspot.location}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                  {hotspot.status.replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
