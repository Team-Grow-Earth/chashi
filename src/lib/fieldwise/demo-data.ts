import type {
  CropHistoryEntry,
  EnvironmentalData,
  Farm,
  MonthlyPoint,
  SoilProfile,
} from "./types";

export const demoFarms: Farm[] = [
  {
    id: "green-valley",
    name: "Green Valley Farm",
    region: "Rajshahi",
    country: "Bangladesh",
    lat: 24.3745,
    lon: 88.6042,
    sizeValue: 4.5,
    sizeUnit: "acres",
    currentCrop: "Rice",
    soilType: "Silty loam",
    season: "Kharif (monsoon)",
    lastUpdated: "2 days ago",
  },
  {
    id: "riverbank",
    name: "Riverbank Farm",
    region: "Bogura",
    country: "Bangladesh",
    lat: 24.8465,
    lon: 89.3773,
    sizeValue: 2.1,
    sizeUnit: "hectares",
    currentCrop: "Maize",
    soilType: "Sandy loam",
    season: "Rabi (dry)",
    lastUpdated: "6 days ago",
  },
  {
    id: "north-field",
    name: "North Field",
    region: "Dinajpur",
    country: "Bangladesh",
    lat: 25.6217,
    lon: 88.6354,
    sizeValue: 7.0,
    sizeUnit: "acres",
    currentCrop: "Wheat",
    soilType: "Clay loam",
    season: "Rabi (dry)",
    lastUpdated: "3 weeks ago",
  },
];

export const demoSoil: Record<string, SoilProfile> = {
  "green-valley": {
    soilType: "Silty loam",
    ph: 6.4,
    organicMatter: 1.8,
    nitrogen: "medium",
    phosphorus: "low",
    potassium: "medium",
    drainage: "Moderate",
    texture: "Silty loam",
    waterRetention: "Good",
    provenance: {
      soilType: "farmer",
      ph: "farmer",
      organicMatter: "model",
      nitrogen: "farmer",
      phosphorus: "regional",
      potassium: "regional",
      drainage: "farmer",
      texture: "farmer",
      waterRetention: "model",
    },
  },
  riverbank: {
    soilType: "Sandy loam",
    ph: 7.1,
    organicMatter: null,
    nitrogen: "low",
    phosphorus: "medium",
    potassium: "medium",
    drainage: "Fast",
    texture: "Sandy loam",
    waterRetention: "Low",
    provenance: {
      soilType: "farmer",
      ph: "farmer",
      organicMatter: "model",
      nitrogen: "regional",
      phosphorus: "regional",
      potassium: "regional",
      drainage: "farmer",
      texture: "farmer",
      waterRetention: "model",
    },
  },
  "north-field": {
    soilType: "Clay loam",
    ph: 5.9,
    organicMatter: 2.4,
    nitrogen: "medium",
    phosphorus: "medium",
    potassium: "low",
    drainage: "Slow",
    texture: "Clay loam",
    waterRetention: "High",
    provenance: {
      soilType: "farmer",
      ph: "farmer",
      organicMatter: "farmer",
      nitrogen: "regional",
      phosphorus: "regional",
      potassium: "farmer",
      drainage: "farmer",
      texture: "farmer",
      waterRetention: "model",
    },
  },
};

export const demoHistory: Record<string, CropHistoryEntry[]> = {
  "green-valley": [
    { year: 2023, season: "Kharif", crop: "Rice", yield: "3.4 t/ha" },
    { year: 2024, season: "Rabi", crop: "Wheat", yield: "2.8 t/ha" },
    { year: 2025, season: "Kharif", crop: "Rice", yield: "3.1 t/ha" },
    { year: 2026, season: "Rabi", crop: "Maize" },
  ],
  riverbank: [
    { year: 2024, season: "Rabi", crop: "Maize", yield: "5.1 t/ha" },
    { year: 2025, season: "Kharif", crop: "Rice", yield: "3.0 t/ha" },
    { year: 2026, season: "Rabi", crop: "Maize" },
  ],
  "north-field": [
    { year: 2023, season: "Rabi", crop: "Wheat", yield: "2.6 t/ha" },
    { year: 2024, season: "Rabi", crop: "Wheat", yield: "2.4 t/ha" },
    { year: 2025, season: "Kharif", crop: "Jute" },
    { year: 2026, season: "Rabi", crop: "Wheat" },
  ],
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Deterministic, location-seeded sample series. Clearly labelled in the UI as
 * demo/example values shaped like NASA Earth-observation products.
 */
function buildMonthly(seed: number): MonthlyPoint[] {
  return MONTHS.map((month, i) => {
    const wave = Math.sin(((i - 3) / 12) * Math.PI * 2);
    const jitter = Math.sin(seed + i * 1.7) * 0.5;
    const temperature = Math.round((26 + wave * 6 + jitter) * 10) / 10;
    const monsoon = Math.max(0, Math.sin(((i - 4) / 12) * Math.PI * 2));
    const rainfall = Math.round(15 + monsoon * 330 + jitter * 18);
    const soilMoisture = Math.round((0.18 + monsoon * 0.2 + jitter * 0.02) * 100);
    const ndvi = Math.round((0.32 + monsoon * 0.34 + jitter * 0.03) * 100) / 100;
    return { month, temperature, rainfall, soilMoisture, ndvi };
  });
}

export function getEnvironment(farmId: string): EnvironmentalData {
  const farm = demoFarms.find((f) => f.id === farmId) ?? demoFarms[0];
  const seed = farm.lat + farm.lon;
  const monthly = buildMonthly(seed);
  const droughtLevel =
    farm.id === "riverbank" ? "Moderate" : farm.id === "north-field" ? "Mild" : "None";
  const summary =
    droughtLevel === "Moderate"
      ? "Recent conditions point to drier-than-usual soil, especially in the dry season."
      : droughtLevel === "Mild"
        ? "Conditions are slightly drier than a normal year, but not unusual."
        : "Recent conditions look close to a normal year for this area.";
  return {
    updated: "Updated 2 days ago",
    resolution: "Area-wide estimate, roughly 10 km grid",
    monthly,
    droughtLevel,
    summary,
  };
}

export function getFarm(farmId: string): Farm {
  return demoFarms.find((f) => f.id === farmId) ?? demoFarms[0];
}

export function plainLevel(value: number, low: number, high: number) {
  if (value < low) return "Low";
  if (value > high) return "High";
  return "Medium";
}
