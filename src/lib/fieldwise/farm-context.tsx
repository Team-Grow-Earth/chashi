import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { demoFarms } from "./demo-data";
import type { Farm } from "./types";

interface FarmContextValue {
  farm: Farm;
  farms: Farm[];
  setFarmId: (id: string) => void;
}

const FarmContext = createContext<FarmContextValue | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farmId, setFarmId] = useState(demoFarms[0]!.id);
  const value = useMemo<FarmContextValue>(
    () => ({
      farm: demoFarms.find((f) => f.id === farmId) ?? demoFarms[0]!,
      farms: demoFarms,
      setFarmId,
    }),
    [farmId],
  );
  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmProvider");
  return ctx;
}
