import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SourceBadge } from "@/components/fieldwise/source-badge";
import { useFarm } from "@/lib/fieldwise/farm-context";
import type { DataSourceKind } from "@/lib/fieldwise/types";

export const Route = createFileRoute("/app/soil")({
  head: () => ({
    meta: [
      { title: "Soil profile — Chashi" },
      {
        name: "description",
        content:
          "Your soil in one place: what you entered, what is estimated from regional data, and what is still missing.",
      },
      { property: "og:title", content: "Soil profile — Chashi" },
      {
        property: "og:description",
        content: "A clear, honest picture of your soil and where each value came from.",
      },
    ],
  }),
  component: SoilPage,
});

function Row({
  label,
  value,
  source,
  help,
}: {
  label: string;
  value: string | null;
  source: DataSourceKind;
  help?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 last:border-0">
      <div className="min-w-40">
        <p className="text-sm font-medium">{label}</p>
        {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        {value ? (
          <span className="font-display text-base font-semibold">{value}</span>
        ) : (
          <span className="text-sm text-muted-foreground">Not provided</span>
        )}
        <SourceBadge source={source} />
      </div>
    </div>
  );
}

function SoilPage() {
  const { farm, soil } = useFarm();
  const known = Object.values(soil).filter(
    (v) => v !== null && typeof v !== "object",
  ).length;
  const completeness = Math.round((known / 9) * 100);

  const level = (v: string | null) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : null);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Soil profile</p>
        <h1 className="font-display text-3xl font-semibold">Soil at {farm.name}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Anything you did not know is filled in from regional data or estimated, and labelled as
          such. Nothing here is presented as a lab measurement of your field.
        </p>
      </header>

      <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">How complete is this profile?</p>
          <span className="font-display text-lg font-semibold">{completeness}%</span>
        </div>
        <Progress value={completeness} className="mt-3" />
        <p className="mt-3 text-sm text-muted-foreground">
          More detail means fewer estimates. You can add missing values at any time.
        </p>
      </Card>

      <Card className="px-5 py-1 shadow-[var(--shadow-card)]">
        <Row label="Soil type" value={soil.soilType} source={soil.provenance.soilType} />
        <Row
          label="Acidity (pH)"
          value={soil.ph ? String(soil.ph) : null}
          help="Below 6 is acidic, around 7 is neutral"
          source={soil.provenance.ph}
        />
        <Row
          label="Organic matter"
          value={soil.organicMatter ? `${soil.organicMatter}%` : null}
          help="Decayed plant material that feeds the soil"
          source={soil.provenance.organicMatter}
        />
        <Row label="Nitrogen" value={level(soil.nitrogen)} source={soil.provenance.nitrogen} />
        <Row label="Phosphorus" value={level(soil.phosphorus)} source={soil.provenance.phosphorus} />
        <Row label="Potassium" value={level(soil.potassium)} source={soil.provenance.potassium} />
        <Row
          label="Drainage"
          value={soil.drainage}
          help="How quickly water leaves the soil"
          source={soil.provenance.drainage}
        />
        <Row label="Texture" value={soil.texture} source={soil.provenance.texture} />
        <Row
          label="Water retention"
          value={soil.waterRetention}
          help="How long the soil stays moist after rain"
          source={soil.provenance.waterRetention}
        />
      </Card>

      <Card className="gap-0 bg-surface p-5">
        <div className="flex items-center gap-2">
          <SourceBadge source="model" />
        </div>
        <h2 className="mt-3 font-display text-lg font-semibold">Soil health overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on what is known so far, this soil looks workable for cereals, with phosphorus as
          the weakest point. This is an estimate built from your entries plus regional data, not a
          soil test result.
        </p>
      </Card>
    </div>
  );
}
