import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useFarm } from "@/lib/fieldwise/farm-context";
import { emptySoil } from "@/lib/fieldwise/demo-data";
import type { CropHistoryEntry, Farm, SoilProfile } from "@/lib/fieldwise/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/farm")({
  head: () => ({
    meta: [
      { title: "Farm details — FieldWise" },
      { name: "description", content: "Enter or edit your farm, soil and crop history to update every FieldWise result." },
      { property: "og:title", content: "Farm details — FieldWise" },
      { property: "og:description", content: "Enter your farm information and see results update instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FarmForm,
});

const blankFarm = (): Farm => ({
  id: `farm-${Date.now()}`,
  name: "",
  region: "",
  country: "Bangladesh",
  lat: 24,
  lon: 90,
  sizeValue: 1,
  sizeUnit: "acres",
  currentCrop: "Rice",
  soilType: "Loam",
  season: "Kharif (monsoon)",
  lastUpdated: "just now",
});

const selCls =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function FarmForm() {
  const { farm, soil, history, saveFarm, deleteFarm, resetData } = useFarm();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"edit" | "new">("edit");
  const [f, setF] = useState<Farm>(farm);
  const [s, setS] = useState<SoilProfile>(soil);
  const [h, setH] = useState<CropHistoryEntry[]>(history);

  useEffect(() => {
    if (mode === "edit") {
      setF(farm);
      setS(soil);
      setH(history);
    }
  }, [farm, soil, history, mode]);

  const startNew = () => {
    const nf = blankFarm();
    setMode("new");
    setF(nf);
    setS(emptySoil(nf.soilType));
    setH([]);
  };

  const num = (v: string) => (v === "" ? null : Number(v));
  const level = (v: string) => (v === "" ? null : (v as "low" | "medium" | "high"));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.region.trim()) {
      toast.error("Please add a farm name and region.");
      return;
    }
    if (f.lat < -90 || f.lat > 90 || f.lon < -180 || f.lon > 180) {
      toast.error("Please check the location — latitude or longitude looks off.");
      return;
    }
    saveFarm({ ...f, soilType: s.soilType, lastUpdated: "just now" }, s, h);
    setMode("edit");
    toast.success("Saved on this device. Your dashboard is updated.");
    navigate({ to: "/app" });
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {mode === "new" ? "Add a new farm" : "Edit farm details"}
          </p>
          <h1 className="font-display text-3xl font-semibold">{f.name || "New farm"}</h1>
          <p className="text-sm text-muted-foreground">
            Everything you enter is saved on this device and updates every page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={startNew}>
            <Plus className="size-4" /> New farm
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              resetData();
              setMode("edit");
              toast("Example data restored.");
            }}
          >
            <RotateCcw className="size-4" /> Reset examples
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Farm basics</CardTitle>
          <CardDescription>Location drives the weather and satellite estimates.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Farm name">
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={80} />
          </Field>
          <Field label="Region / district">
            <Input value={f.region} onChange={(e) => setF({ ...f, region: e.target.value })} maxLength={80} />
          </Field>
          <Field label="Country">
            <Input value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} maxLength={60} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Farm size">
              <Input type="number" min={0.1} step={0.1} value={f.sizeValue} onChange={(e) => setF({ ...f, sizeValue: Number(e.target.value) })} />
            </Field>
            <Field label="Unit">
              <select className={selCls} value={f.sizeUnit} onChange={(e) => setF({ ...f, sizeUnit: e.target.value as Farm["sizeUnit"] })}>
                <option value="acres">acres</option>
                <option value="hectares">hectares</option>
              </select>
            </Field>
          </div>
          <Field label="Latitude">
            <Input type="number" step="0.0001" value={f.lat} onChange={(e) => setF({ ...f, lat: Number(e.target.value) })} />
          </Field>
          <Field label="Longitude">
            <Input type="number" step="0.0001" value={f.lon} onChange={(e) => setF({ ...f, lon: Number(e.target.value) })} />
          </Field>
          <Field label="Current crop">
            <Input value={f.currentCrop} onChange={(e) => setF({ ...f, currentCrop: e.target.value })} maxLength={40} />
          </Field>
          <Field label="Season">
            <select className={selCls} value={f.season} onChange={(e) => setF({ ...f, season: e.target.value })}>
              <option>Kharif (monsoon)</option>
              <option>Rabi (dry)</option>
              <option>Pre-Kharif (summer)</option>
            </select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil</CardTitle>
          <CardDescription>Leave blank what you don't know — it will show as "Not provided".</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Soil type">
            <select className={selCls} value={s.soilType} onChange={(e) => setS({ ...s, soilType: e.target.value, texture: e.target.value })}>
              {["Loam", "Silty loam", "Sandy loam", "Clay loam", "Clay", "Sandy"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="pH">
            <Input type="number" step="0.1" min={3} max={10} value={s.ph ?? ""} onChange={(e) => setS({ ...s, ph: num(e.target.value), provenance: { ...s.provenance, ph: "farmer" } })} />
          </Field>
          <Field label="Organic matter (%)">
            <Input type="number" step="0.1" min={0} max={20} value={s.organicMatter ?? ""} onChange={(e) => setS({ ...s, organicMatter: num(e.target.value), provenance: { ...s.provenance, organicMatter: "farmer" } })} />
          </Field>
          {(["nitrogen", "phosphorus", "potassium"] as const).map((k) => (
            <Field key={k} label={k[0]!.toUpperCase() + k.slice(1)}>
              <select className={selCls} value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: level(e.target.value), provenance: { ...s.provenance, [k]: "farmer" } })}>
                <option value="">Don't know</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          ))}
          <Field label="Drainage">
            <select className={selCls} value={s.drainage ?? ""} onChange={(e) => setS({ ...s, drainage: e.target.value || null, provenance: { ...s.provenance, drainage: "farmer" } })}>
              <option value="">Don't know</option>
              <option>Slow</option>
              <option>Moderate</option>
              <option>Fast</option>
            </select>
          </Field>
          <Field label="Water retention">
            <select className={selCls} value={s.waterRetention ?? ""} onChange={(e) => setS({ ...s, waterRetention: e.target.value || null, provenance: { ...s.provenance, waterRetention: "farmer" } })}>
              <option value="">Don't know</option>
              <option>Low</option>
              <option>Good</option>
              <option>High</option>
            </select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crop history</CardTitle>
          <CardDescription>What you grew in past seasons.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {h.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[90px_1fr_1fr_1fr_auto]">
              <Input type="number" aria-label="Year" value={row.year} onChange={(e) => setH(h.map((r, j) => (j === i ? { ...r, year: Number(e.target.value) } : r)))} />
              <Input aria-label="Season" placeholder="Season" value={row.season} onChange={(e) => setH(h.map((r, j) => (j === i ? { ...r, season: e.target.value } : r)))} />
              <Input aria-label="Crop" placeholder="Crop" value={row.crop} onChange={(e) => setH(h.map((r, j) => (j === i ? { ...r, crop: e.target.value } : r)))} />
              <Input aria-label="Yield" placeholder="Yield (optional)" value={row.yield ?? ""} onChange={(e) => setH(h.map((r, j) => (j === i ? { ...r, yield: e.target.value || undefined } : r)))} />
              <Button type="button" variant="ghost" size="icon" aria-label="Remove row" onClick={() => setH(h.filter((_, j) => j !== i))}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setH([...h, { year: new Date().getFullYear(), season: "Kharif", crop: "" }])}>
            <Plus className="size-4" /> Add season
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between gap-3">
        {mode === "edit" ? (
          <Button type="button" variant="ghost" className="text-destructive" onClick={() => { deleteFarm(f.id); toast("Farm removed."); }}>
            <Trash2 className="size-4" /> Delete this farm
          </Button>
        ) : <span />}
        <Button type="submit" size="lg">Save & see results</Button>
      </div>
    </form>
  );
}
