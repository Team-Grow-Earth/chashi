import { createFileRoute } from "@tanstack/react-router";
import { Check, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SourceBadge } from "@/components/fieldwise/source-badge";
import { useFarm } from "@/lib/fieldwise/farm-context";
import { getEnvironment } from "@/lib/fieldwise/demo-data";
import { recommendCrops } from "@/lib/fieldwise/crop-engine";

export const Route = createFileRoute("/app/crops")({
  head: () => ({
    meta: [
      { title: "Crop recommendations — FieldWise" },
      { name: "description", content: "Compare the crops that best fit your farm's season, soil and current conditions." },
      { property: "og:title", content: "Crop recommendations — FieldWise" },
      { property: "og:description", content: "Top crop options for your farm with strengths and trade-offs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CropsPage,
});

function CropsPage() {
  const { farm, soil } = useFarm();
  const env = getEnvironment(farm, soil);
  const recs = recommendCrops(farm, soil, env, new Date().getMonth());
  const top = recs.slice(0, 3);
  const rest = recs.slice(3);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Crop recommendations</p>
        <h1 className="font-display text-3xl font-semibold">Best options for {farm.name}</h1>
        <p className="text-sm text-muted-foreground">
          Based on your season ({farm.season}), soil ({soil.soilType}) and this month's estimated
          conditions. These are options — you decide.
        </p>
        <SourceBadge source="model" note="Fit scores are estimated from your farm details and area-wide weather estimates." />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {top.map((r, i) => (
          <Card key={r.crop.name} className={i === 0 ? "border-primary" : ""}>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-xl">
                  {r.crop.name} <span className="text-sm font-normal text-muted-foreground">{r.crop.bn}</span>
                </CardTitle>
                {i === 0 && <Badge>Best fit</Badge>}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fit score</span>
                  <span>{r.score}/100</span>
                </div>
                <Progress value={r.score} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{r.crop.note}</p>
              <ul className="space-y-1.5">
                {r.strengths.map((s) => (
                  <li key={s} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{s}</li>
                ))}
                {r.tradeoffs.map((s) => (
                  <li key={s} className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-regional" />{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Other crops checked</CardTitle></CardHeader>
        <CardContent className="divide-y divide-border">
          {rest.map((r) => (
            <div key={r.crop.name} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>{r.crop.name} <span className="text-muted-foreground">{r.crop.bn}</span></span>
              <span className="text-muted-foreground">{r.score}/100 · {r.tradeoffs[0] ?? "Possible option"}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Assumptions: estimates use example weather for your location, not direct farm measurements.
        Check local market prices and seed availability before deciding.
      </p>
    </div>
  );
}
