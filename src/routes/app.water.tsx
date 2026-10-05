import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Droplets, CloudRain, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/fieldwise/source-badge";
import { useFarm } from "@/lib/fieldwise/farm-context";
import { getEnvironment } from "@/lib/fieldwise/demo-data";
import { crops, findCrop, waterAdvice } from "@/lib/fieldwise/crop-engine";

export const Route = createFileRoute("/app/water")({
  head: () => ({
    meta: [
      { title: "Water today — Chashi" },
      { name: "description", content: "Type your crop and find out whether it needs watering today." },
      { property: "og:title", content: "Water today — Chashi" },
      { property: "og:description", content: "A daily watering check for your crop based on today's conditions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WaterPage,
});

const KEY = "fieldwise:water-crop";

function WaterPage() {
  const { farm, soil } = useFarm();
  const [input, setInput] = useState("");
  const [cropName, setCropName] = useState("");
  const [rained, setRained] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) || farm.currentCrop;
    setInput(saved);
    setCropName(saved);
  }, [farm.currentCrop]);

  const crop = findCrop(cropName);
  const env = getEnvironment(farm, soil);
  const today = new Date();
  const rainNum = rained.trim() === "" ? null : Math.max(0, Math.min(500, Number(rained) || 0));
  const advice = crop ? waterAdvice(crop, farm, soil, env, today, { rainedMm: rainNum }) : null;

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const c = findCrop(input);
    if (!c) {
      setError("We don't know this crop yet. Try one from the list below.");
      return;
    }
    setError("");
    setCropName(c.name);
    localStorage.setItem(KEY, c.name);
  };

  const tone =
    advice?.decision === "skip"
      ? "border-farmer bg-farmer/10"
      : advice?.decision === "light"
        ? "border-regional bg-regional/10"
        : "border-nasa bg-nasa/10";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {today.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="font-display text-3xl font-semibold">Should I water today?</h1>
        <p className="text-sm text-muted-foreground">For {farm.name} · {farm.sizeValue} {farm.sizeUnit}</p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={check} className="grid gap-4 sm:grid-cols-[1fr_160px_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="crop">Crop name</Label>
              <Input id="crop" list="crop-list" value={input} maxLength={40} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Rice / ধান" />
              <datalist id="crop-list">
                {crops.map((c) => <option key={c.name} value={c.name}>{c.bn}</option>)}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rain">Rain today (mm, optional)</Label>
              <Input id="rain" type="number" min={0} max={500} value={rained} onChange={(e) => setRained(e.target.value)} placeholder="Auto" />
            </div>
            <Button type="submit">Check</Button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {crops.map((c) => (
              <button key={c.name} type="button" onClick={() => { setInput(c.name); setCropName(c.name); setError(""); localStorage.setItem(KEY, c.name); }}
                className="rounded-full border border-border px-2.5 py-1 text-xs hover:bg-muted">
                {c.name} {c.bn}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {advice && crop && (
        <Card className={`border-2 ${tone}`}>
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              {advice.decision === "skip" ? <CloudRain className="size-8" /> : <Droplets className="size-8" />}
              <CardTitle className="font-display text-2xl">{advice.headline}</CardTitle>
            </div>
            {advice.litres > 0 && (
              <p className="text-sm">
                Suggested amount: about <strong>{advice.litres.toLocaleString()} litres</strong> across the whole
                farm (≈ {Math.round(advice.litres / (farm.sizeValue || 1)).toLocaleString()} L per {farm.sizeUnit.replace(/s$/, "")}).
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-1.5">
              {advice.reasons.map((r) => <li key={r} className="flex gap-2"><Sprout className="mt-0.5 size-4 shrink-0" />{r}</li>)}
            </ul>
            <div className="flex flex-wrap gap-2">
              <SourceBadge source={rainNum != null ? "farmer" : "nasa"} note="Rain today" />
              <SourceBadge source="model" note="Soil moisture and water need are estimates" />
            </div>
            <p className="text-xs text-muted-foreground">
              This is guidance, not a measurement from your field. Check the soil by hand — if it's
              wet 5 cm down, you can wait.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
