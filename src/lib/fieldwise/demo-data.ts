import raw from "./data.json";
import type {
  CropHistoryEntry,
  EnvironmentalData,
  Farm,
  MonthlyPoint,
  SoilProfile,
} from "./types";

/** All seed data comes from data.json. User edits are layered on top via localStorage (see farm-context). */
export interface FieldWiseData {
  farms: Farm[];
  soil: Record<string, SoilProfile>;
  history: Record<string, CropHistoryEntry[]>;
}

export const seedData = raw as unknown as FieldWiseData;
export const demoFarms = seedData.farms;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthly(seed: number, lat: number): MonthlyPoint[] {
  // Latitude shifts baseline temperature; seed varies the series per location.
  const base = 30 - Math.abs(lat) * 0.25;
  const wetness = 0.7 + ((Math.sin(seed * 3.1) + 1) / 2) * 0.6; // 0.7 – 1.3
  return MONTHS.map((month, i) => {
    const wave = Math.sin(((i - 3) / 12) * Math.PI * 2);
    const jitter = Math.sin(seed + i * 1.7) * 0.5;
    const temperature = Math.round((base + wave * 6 + jitter) * 10) / 10;
    const monsoon = Math.max(0, Math.sin(((i - 4) / 12) * Math.PI * 2));
    const rainfall = Math.max(0, Math.round((15 + monsoon * 330 + jitter * 18) * wetness));
    const soilMoisture = Math.round((0.14 + monsoon * 0.2 * wetness + jitter * 0.02) * 100);
    const ndvi = Math.round((0.3 + monsoon * 0.34 * wetness + jitter * 0.03) * 100) / 100;
    return { month, temperature, rainfall, soilMoisture, ndvi };
  });
}

/** Location-driven sample series: change lat/lon or soil in the form and the output changes. */
export function getEnvironment(farm: Farm, soil?: SoilProfile): EnvironmentalData {
  const monthly = buildMonthly(farm.lat + farm.lon, farm.lat);
  const totalRain = monthly.reduce((s, m) => s + m.rainfall, 0);
  let score = totalRain < 1200 ? 2 : totalRain < 1500 ? 1 : 0;
  if (soil?.drainage === "Fast" || soil?.waterRetention === "Low") score += 1;
  if (soil?.waterRetention === "High") score -= 1;
  const droughtLevel = (["None", "Mild", "Moderate", "Severe"] as const)[
    Math.max(0, Math.min(3, score))
  ]!;
  const summary =
    droughtLevel === "Severe"
      ? "Rainfall is low and your soil loses water quickly — dry-season crops face high water stress."
      : droughtLevel === "Moderate"
        ? "Recent conditions point to drier-than-usual soil, especially in the dry season."
        : droughtLevel === "Mild"
          ? "Conditions are slightly drier than a normal year, but not unusual."
          : "Recent conditions look close to a normal year for this area.";
  return {
    updated: `Estimated for ${farm.lat.toFixed(2)}, ${farm.lon.toFixed(2)}`,
    resolution: "Area-wide estimate, roughly 10 km grid",
    monthly,
    droughtLevel,
    summary,
  };
}

export function emptySoil(soilType: string): SoilProfile {
  return {
    soilType,
    ph: null,
    organicMatter: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    drainage: null,
    texture: soilType,
    waterRetention: null,
    provenance: {
      soilType: "farmer",
      ph: "farmer",
      organicMatter: "farmer",
      nitrogen: "farmer",
      phosphorus: "farmer",
      potassium: "farmer",
      drainage: "farmer",
      texture: "farmer",
      waterRetention: "farmer",
    },
  };
}

export function plainLevel(value: number, low: number, high: number) {
  if (value < low) return "Low";
  if (value > high) return "High";
  return "Medium";
}
