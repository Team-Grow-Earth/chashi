import cropsRaw from "./crops.json";
import type { EnvironmentalData, Farm, SoilProfile } from "./types";

export interface CropInfo {
  name: string;
  bn: string;
  tempMin: number;
  tempMax: number;
  waterMonthly: number;
  moistureMin: number;
  phMin: number;
  phMax: number;
  drought: "low" | "medium" | "high";
  soils: string[];
  seasons: string[];
  note: string;
}

export const crops = cropsRaw as CropInfo[];

export function findCrop(q: string): CropInfo | undefined {
  const s = q.trim().toLowerCase();
  if (!s) return undefined;
  return crops.find(
    (c) => c.name.toLowerCase() === s || c.bn === q.trim() || c.name.toLowerCase().startsWith(s),
  );
}

export interface CropRecommendation {
  crop: CropInfo;
  score: number;
  strengths: string[];
  tradeoffs: string[];
}

/** Model-derived fit score (0–100) from farm season, soil and this month's estimated conditions. */
export function recommendCrops(
  farm: Farm,
  soil: SoilProfile,
  env: EnvironmentalData,
  monthIndex: number,
): CropRecommendation[] {
  const now = env.monthly[monthIndex] ?? env.monthly[0]!;
  const dry = env.droughtLevel === "Moderate" || env.droughtLevel === "Severe";

  return crops
    .map((crop) => {
      let score = 50;
      const strengths: string[] = [];
      const tradeoffs: string[] = [];

      if (crop.seasons.includes(farm.season)) {
        score += 15;
        strengths.push(`Suits your ${farm.season} season`);
      } else {
        score -= 20;
        tradeoffs.push(`Not a usual ${farm.season} crop`);
      }
      if (now.temperature >= crop.tempMin && now.temperature <= crop.tempMax) {
        score += 10;
        strengths.push(`Current temperature (~${now.temperature}°C) is in its comfort range`);
      } else {
        score -= 10;
        tradeoffs.push(`Current temperature (~${now.temperature}°C) is outside its ideal ${crop.tempMin}–${crop.tempMax}°C`);
      }
      if (crop.soils.includes(soil.soilType)) {
        score += 10;
        strengths.push(`Grows well in ${soil.soilType.toLowerCase()}`);
      } else {
        score -= 5;
        tradeoffs.push(`${soil.soilType} is not its preferred soil`);
      }
      if (soil.ph != null) {
        if (soil.ph >= crop.phMin && soil.ph <= crop.phMax) score += 5;
        else {
          score -= 8;
          tradeoffs.push(`Your soil pH ${soil.ph} is outside ${crop.phMin}–${crop.phMax}`);
        }
      }
      if (dry) {
        if (crop.drought === "high") {
          score += 10;
          strengths.push("Handles dry spells well");
        } else if (crop.drought === "low") {
          score -= 10;
          tradeoffs.push("Needs a lot of water in a drier-than-usual year");
        }
      }
      if (now.rainfall < crop.waterMonthly) {
        tradeoffs.push(`Likely needs irrigation (~${crop.waterMonthly - now.rainfall} mm/month beyond rain)`);
      }
      if (crop.name === farm.currentCrop) {
        score -= 5;
        tradeoffs.push("Same as your current crop — rotating helps soil health");
      }
      return { crop, score: Math.max(0, Math.min(100, score)), strengths, tradeoffs };
    })
    .sort((a, b) => b.score - a.score);
}

export interface WaterAdvice {
  decision: "water" | "skip" | "light";
  headline: string;
  reasons: string[];
  litres: number;
  rainToday: number;
  moistureToday: number;
  needToday: number;
}

function areaM2(farm: Farm) {
  return farm.sizeValue * (farm.sizeUnit === "acres" ? 4047 : 10000);
}

/** Estimates today's rain/moisture from the monthly series with a date-seeded daily variation. */
export function waterAdvice(
  crop: CropInfo,
  farm: Farm,
  soil: SoilProfile,
  env: EnvironmentalData,
  date: Date,
  override?: { rainedMm?: number | null },
): WaterAdvice {
  const m = env.monthly[date.getMonth()] ?? env.monthly[0]!;
  const daySeed = Math.sin(date.getDate() * 12.9898 + farm.lat) * 43758.5453;
  const frac = daySeed - Math.floor(daySeed); // 0–1
  const estRain = frac > 0.55 ? Math.round((m.rainfall / 30) * frac * 2.2 * 10) / 10 : 0;
  const rainToday = override?.rainedMm ?? estRain;
  let moisture = m.soilMoisture + (rainToday > 5 ? 6 : 0) - (frac < 0.3 ? 3 : 0);
  if (soil.waterRetention === "Low" || soil.drainage === "Fast") moisture -= 4;
  if (soil.waterRetention === "High") moisture += 3;
  moisture = Math.round(moisture);
  const heat = m.temperature > crop.tempMax ? 1.25 : 1;
  const needToday = Math.round((crop.waterMonthly / 30) * heat * 10) / 10;
  const deficit = Math.max(0, needToday - rainToday);
  const reasons: string[] = [
    `Estimated rain today: ${rainToday} mm`,
    `Estimated topsoil moisture: ${moisture}% (${crop.name} is comfortable above ${crop.moistureMin}%)`,
    `${crop.name} uses about ${needToday} mm of water per day now`,
  ];
  if (heat > 1) reasons.push(`Hot day (~${m.temperature}°C) — plants lose water faster`);

  let decision: WaterAdvice["decision"];
  if (rainToday >= needToday || moisture >= crop.moistureMin + 8) {
    decision = "skip";
  } else if (moisture >= crop.moistureMin) {
    decision = "light";
  } else {
    decision = "water";
  }
  const factor = decision === "skip" ? 0 : decision === "light" ? 0.5 : 1;
  const litres = Math.round(deficit * factor * areaM2(farm));
  const headline =
    decision === "skip"
      ? `No need to water ${crop.name} today`
      : decision === "light"
        ? `Light watering is enough for ${crop.name} today`
        : `Water your ${crop.name} today`;
  return { decision, headline, reasons, litres, rainToday, moistureToday: moisture, needToday };
}
