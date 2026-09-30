import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptySoil, seedData, type FieldWiseData } from "./demo-data";
import type { CropHistoryEntry, Farm, SoilProfile } from "./types";

const STORAGE_KEY = "fieldwise:data:v1";
const SELECTED_KEY = "fieldwise:selected";

interface FarmContextValue {
  farm: Farm;
  farms: Farm[];
  soil: SoilProfile;
  history: CropHistoryEntry[];
  setFarmId: (id: string) => void;
  saveFarm: (farm: Farm, soil: SoilProfile, history: CropHistoryEntry[]) => void;
  deleteFarm: (id: string) => void;
  resetData: () => void;
}

const FarmContext = createContext<FarmContextValue | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FieldWiseData>(seedData);
  const [farmId, setFarmId] = useState(seedData.farms[0]!.id);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(JSON.parse(saved) as FieldWiseData);
      const sel = localStorage.getItem(SELECTED_KEY);
      if (sel) setFarmId(sel);
    } catch {
      /* ignore bad storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(SELECTED_KEY, farmId);
  }, [data, farmId, loaded]);

  const value = useMemo<FarmContextValue>(() => {
    const farms = data.farms.length ? data.farms : seedData.farms;
    const farm = farms.find((f) => f.id === farmId) ?? farms[0]!;
    return {
      farm,
      farms,
      soil: data.soil[farm.id] ?? emptySoil(farm.soilType),
      history: data.history[farm.id] ?? [],
      setFarmId,
      saveFarm: (f, s, h) => {
        setData((d) => ({
          farms: d.farms.some((x) => x.id === f.id)
            ? d.farms.map((x) => (x.id === f.id ? f : x))
            : [...d.farms, f],
          soil: { ...d.soil, [f.id]: s },
          history: { ...d.history, [f.id]: h },
        }));
        setFarmId(f.id);
      },
      deleteFarm: (id) => {
        setData((d) => ({ ...d, farms: d.farms.filter((x) => x.id !== id) }));
        setFarmId(seedData.farms[0]!.id);
      },
      resetData: () => {
        setData(seedData);
        setFarmId(seedData.farms[0]!.id);
      },
    };
  }, [data, farmId]);

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmProvider");
  return ctx;
}
