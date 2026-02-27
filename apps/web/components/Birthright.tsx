"use client";

import { useState } from "react";
import { useApp }    from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import {
  getBirthrightProjection,
  CLIMATE_ZONES,
  POD_TYPES,
  loadSavedZone,
  saveZone,
  type ClimateKey,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const ZONES3 = [
  { z: "Zone 1", icon: "🏠", dist: "0–5m",  desc: "Daily harvest. Kitchen herbs, greens, salads.",               color: "bg-green-50 border-green-300",    text: "text-green-800"   },
  { z: "Zone 2", icon: "🌿", dist: "5–20m", desc: "Weekly harvest. Fruit shrubs, medicinal herbs, ground cover.", color: "bg-emerald-50 border-emerald-300", text: "text-emerald-800" },
  { z: "Zone 3", icon: "🌳", dist: "20m+",  desc: "Seasonal harvest. Self-managing trees, spreading cover.",     color: "bg-teal-50 border-teal-300",      text: "text-teal-800"    },
];

const ZONES5 = [
  { z: "Zone 1", icon: "🏠", dist: "0–2m",    desc: "Daily visit. Most intensive. Kitchen herbs.",         color: "bg-green-50 border-green-300",    text: "text-green-800"   },
  { z: "Zone 2", icon: "🌱", dist: "2–10m",   desc: "Regular care. Vegetables, fruit bushes, bee plants.", color: "bg-lime-50 border-lime-300",      text: "text-lime-800"    },
  { z: "Zone 3", icon: "🌿", dist: "10–30m",  desc: "Occasional attention. Fruit trees, self-seeding.",    color: "bg-emerald-50 border-emerald-300", text: "text-emerald-800" },
  { z: "Zone 4", icon: "🌾", dist: "30–100m", desc: "Managed wilderness. Nut trees, timber, forage.",      color: "bg-teal-50 border-teal-300",      text: "text-teal-800"    },
  { z: "Zone 5", icon: "🌳", dist: "100m+",   desc: "Wild zone. No management. Natural balance.",           color: "bg-cyan-50 border-cyan-300",      text: "text-cyan-800"    },
];

type TabKey = "kit" | "projection" | "zones";

export default function Birthright() {
  const { throws } = useApp();
  const router     = useRouter();

  const [tab,         setTab]         = useState<TabKey>("kit");
  const [climateKey,  setClimateKey]  = useState<ClimateKey | null>(loadSavedZone);
  const [kitSize,     setKitSize]     = useState<12 | 24>(12);
  const [harvestZones, setHarvestZones] = useState<3 | 5>(3);

  const selectedClimate = CLIMATE_ZONES.find((z) => z.key === climateKey) ?? null;
  const composition     = selectedClimate?.kitSizes.find((k) => k.pods === kitSize)?.composition ?? [];

  const proj      = getBirthrightProjection(kitSize);
  const chartData = proj.map((p) => ({ year: `Yr ${p.year}`, pods: p.pods }));

  const selectZone = (key: ClimateKey) => {
    setClimateKey(key);
    saveZone(key);
  };

  return (
    <div className="px-4 py-6 fade-up space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-eden-100 flex items-center justify-center text-2xl">
          🎁
        </div>
        <div>
          <h1 className="text-2xl font-bold text-eden-900">
            Birthright Forest Kit
          </h1>
          <p className="text-sm text-gray-500">Your self-replicating food forest</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
        {([
          { key: "kit",        label: "My Kit"     },
          { key: "projection", label: "Projection" },
          { key: "zones",      label: "Zones"      },
        ] as { key: TabKey; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all",
              tab === t.key
                ? "bg-white text-eden-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Kit tab ─────────────────────────────────────────────────────── */}
      {tab === "kit" && (
        <div className="space-y-5">

          {/* Climate picker */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Where are you growing?
            </p>
            <div className="flex flex-col gap-2">
              {CLIMATE_ZONES.map((z) => (
                <button
                  key={z.key}
                  onClick={() => selectZone(z.key)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all",
                    climateKey === z.key
                      ? "border-eden-500 bg-eden-50"
                      : "border-gray-200 hover:border-eden-200 bg-white"
                  )}
                >
                  {/* colour swatch */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: z.color }}
                  >
                    {z.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {z.label}
                      </span>
                      <span className="text-xs text-gray-400">{z.usda}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {z.examples}
                    </p>
                  </div>
                  {climateKey === z.key && (
                    <span className="text-eden-500 flex-shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Kit builder — only shown once a climate is selected */}
          {selectedClimate && (
            <>
              {/* Kit size toggle */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Kit size
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {([12, 24] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setKitSize(n)}
                      className={cn(
                        "py-3 rounded-2xl border-2 font-bold text-lg transition-all",
                        kitSize === n
                          ? "border-eden-500 bg-eden-50 text-eden-700"
                          : "border-gray-200 text-gray-700 bg-white"
                      )}
                    >
                      {n} pods
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended composition */}
              <div className="card space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <span className="text-xl">{selectedClimate.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {selectedClimate.label} — {kitSize}-pod kit
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedClimate.description}
                    </p>
                  </div>
                </div>

                {composition.map(({ podId, count }) => {
                  const pod = POD_TYPES.find((p) => p.id === podId);
                  if (!pod) return null;
                  return (
                    <div key={podId} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: pod.color + "30" }}
                      >
                        {pod.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {pod.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {pod.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-eden-700">
                          ×{count}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* 5-year projection teaser */}
                <div className="mt-1 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">After 5 years if left to spread:</p>
                  <p className="text-sm font-bold text-eden-700">
                    ~{getBirthrightProjection(kitSize)[5]?.pods.toLocaleString()} plants
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Ready to throw?
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Once you have your pods, use the Throw wizard to mint each
                    one as an NFT and start tracking your forest.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/throw/new")}
                  className="btn-primary w-full bg-eden-600 hover:bg-eden-700"
                >
                  Log a Throw →
                </button>
              </div>
            </>
          )}

          {/* If no zone selected yet, show a nudge */}
          {!selectedClimate && (
            <div className="text-center py-6 text-gray-400">
              <div className="text-4xl mb-2">🌍</div>
              <p className="text-sm">
                Select your climate above to see your recommended kit
              </p>
            </div>
          )}

          {/* Your throws summary if any */}
          {throws.length > 0 && (
            <div className="card-sm bg-eden-50 border-eden-200 text-center">
              <p className="text-sm font-medium text-eden-800">
                You have{" "}
                <span className="font-bold text-eden-600">{throws.length}</span>{" "}
                pod{throws.length !== 1 ? "s" : ""} in the ground
              </p>
              <p className="text-xs text-eden-600 mt-0.5">
                After 5 years:{" "}
                <strong>
                  ~{getBirthrightProjection(throws.length)[5]?.pods.toLocaleString()} plants
                </strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Projection tab ───────────────────────────────────────────────── */}
      {tab === "projection" && (
        <div className="space-y-4">
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kit size
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {([12, 24] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setKitSize(n)}
                  className={cn(
                    "py-3 rounded-2xl border-2 font-bold text-lg transition-all",
                    kitSize === n
                      ? "border-eden-500 bg-eden-50 text-eden-700"
                      : "border-gray-200 text-gray-700"
                  )}
                >
                  {n} pods
                </button>
              ))}
            </div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Growth over 7 years
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #dcfce7",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pods"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={{ fill: "#16a34a", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-eden-50">
                  <th className="text-left py-3 px-4 font-semibold text-eden-800">Year</th>
                  <th className="text-right py-3 px-4 font-semibold text-eden-800">Plants</th>
                  <th className="text-right py-3 px-4 font-semibold text-eden-800">Area</th>
                </tr>
              </thead>
              <tbody>
                {proj.map((p) => (
                  <tr key={p.year} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {p.year === 0 ? "Start" : `Year ${p.year}`}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-eden-700">
                      {p.pods.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {p.area}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Zones tab ────────────────────────────────────────────────────── */}
      {tab === "zones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Harvest Rotation</h2>
            <div className="flex gap-1">
              {([3, 5] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => setHarvestZones(z)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-sm font-medium transition-all",
                    harvestZones === z
                      ? "bg-eden-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {z}-Zone
                </button>
              ))}
            </div>
          </div>

          <div className="card-sm bg-eden-50 border-eden-200">
            <p className="text-sm text-eden-800">
              <strong>Key principle:</strong> Always harvest the nearest zone
              first. Leave outer zones to spread.
            </p>
          </div>

          <div className="space-y-3">
            {(harvestZones === 3 ? ZONES3 : ZONES5).map((z, i) => (
              <div key={z.z} className={cn("rounded-2xl border-2 p-4", z.color)}>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/60",
                      z.text
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className="font-bold">{z.z}</span>
                  <span className="text-sm">{z.icon} {z.dist}</span>
                </div>
                <p className={cn("text-sm", z.text)}>{z.desc}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Rotation Rules</h3>
            <div className="space-y-2">
              {[
                "Harvest Zone 1 on every visit",
                "Harvest Zone 2 weekly — leave 40% to regrow",
                "Harvest outer zones seasonally only",
                "Never harvest the outermost zone — let it spread",
                "After year 3: rotate zones inward as forest matures",
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-eden-100 text-eden-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
