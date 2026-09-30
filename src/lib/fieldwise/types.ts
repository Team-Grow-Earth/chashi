export type DataSourceKind = "nasa" | "farmer" | "regional" | "model";

export interface Farm {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  sizeValue: number;
  sizeUnit: "acres" | "hectares";
  currentCrop: string;
  soilType: string;
  season: string;
  lastUpdated: string;
}

export interface SoilProfile {
  soilType: string;
  ph: number | null;
  organicMatter: number | null;
  nitrogen: "low" | "medium" | "high" | null;
  phosphorus: "low" | "medium" | "high" | null;
  potassium: "low" | "medium" | "high" | null;
  drainage: string | null;
  texture: string | null;
  waterRetention: string | null;
  provenance: {
    soilType: DataSourceKind;
    ph: DataSourceKind;
    organicMatter: DataSourceKind;
    nitrogen: DataSourceKind;
    phosphorus: DataSourceKind;
    potassium: DataSourceKind;
    drainage: DataSourceKind;
    texture: DataSourceKind;
    waterRetention: DataSourceKind;
  };
}

export interface MonthlyPoint {
  month: string;
  temperature: number;
  rainfall: number;
  soilMoisture: number;
  ndvi: number;
}

export interface EnvironmentalData {
  updated: string;
  resolution: string;
  monthly: MonthlyPoint[];
  droughtLevel: "None" | "Mild" | "Moderate" | "Severe";
  summary: string;
}

export interface CropHistoryEntry {
  year: number;
  season: string;
  crop: string;
  yield?: string | undefined;
}
