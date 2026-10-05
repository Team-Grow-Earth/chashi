import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Thermometer,
  CloudRain,
  Droplets,
  Leaf,
  Sun,
  MapPin,
  Ruler,
  Sprout,
  Layers,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { MetricCard } from "@/components/fieldwise/metric-card";
import { SourceBadge } from "@/components/fieldwise/source-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFarm } from "@/lib/fieldwise/farm-context";
import { getEnvironment, plainLevel } from "@/lib/fieldwise/demo-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Farm dashboard — Chashi" },
      {
        name: "description",
        content:
          "See your farm at a glance: size, soil, current crop and the latest environmental conditions around your fields.",
      },
      { property: "og:title", content: "Farm dashboard — Chashi" },
      {
        property: "og:description",
        content: "Your farm, its soil and current conditions, in plain language.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { farm, soil } = useFarm();
  const env = getEnvironment(farm, soil);
  const now = env.monthly[new Date().getMonth()] ?? env.monthly[0]!;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Farm overview</p>
        <h1 className="font-display text-3xl font-semibold">{farm.name}</h1>
        <p className="text-sm text-muted-foreground">
          {farm.region}, {farm.country} · Updated {farm.lastUpdated}
        </p>
      </header>

      <section aria-labelledby="farm-facts" className="space-y-3">
        <h2 id="farm-facts" className="font-display text-lg font-semibold">
          Your farm
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Farm size"
            value={`${farm.sizeValue} ${farm.sizeUnit}`}
            source="farmer"
            icon={<Ruler className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Location"
            value={farm.region}
            detail={`${farm.lat.toFixed(3)}, ${farm.lon.toFixed(3)}`}
            source="farmer"
            icon={<MapPin className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Current crop"
            value={farm.currentCrop}
            source="farmer"
            icon={<Sprout className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Soil type"
            value={farm.soilType}
            source="farmer"
            icon={<Layers className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Current season"
            value={farm.season}
            source="regional"
            icon={<CalendarDays className="size-4" aria-hidden />}
          />
        </div>
      </section>

      <section aria-labelledby="env" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="env" className="font-display text-lg font-semibold">
            Conditions around your fields
          </h2>
          <span className="text-xs text-muted-foreground">{env.updated}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Temperature"
            value={`${now.temperature} °C`}
            detail="Typical for this month"
            source="nasa"
            icon={<Thermometer className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Rainfall"
            value={`${now.rainfall} mm`}
            detail="This month"
            source="nasa"
            icon={<CloudRain className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Soil moisture"
            value={plainLevel(now.soilMoisture, 22, 34)}
            detail={`About ${now.soilMoisture}% of soil water capacity`}
            source="nasa"
            icon={<Droplets className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Vegetation condition"
            value={plainLevel(now.ndvi * 100, 35, 60)}
            detail="How green the land looks from space"
            source="nasa"
            icon={<Leaf className="size-4" aria-hidden />}
          />
          <MetricCard
            label="Dryness"
            value={env.droughtLevel === "None" ? "Normal" : env.droughtLevel}
            detail="Compared with a normal year"
            source="model"
            icon={<Sun className="size-4" aria-hidden />}
          />
        </div>
        <Card className="flex flex-col gap-3 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <SourceBadge source="nasa" />
            <p className="text-sm">{env.summary}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/app/nasa">
              See the details <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Card>
      </section>

      <section aria-labelledby="next" className="space-y-3">
        <h2 id="next" className="font-display text-lg font-semibold">
          What you can do next
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <QuickAction
            to="/app/nasa"
            title="Explore environmental data"
            body="Temperature, rainfall, soil moisture and greenness through the year."
          />
          <QuickAction
            to="/app/soil"
            title="Check your soil profile"
            body="See what you told us, what is estimated, and what is still missing."
          />
        </div>
        <Card className="border-dashed bg-transparent p-5 text-sm text-muted-foreground shadow-none">
          Coming next in Chashi: rotation planner, strategy comparison, climate scenarios,
          seasonal plan, resilience indicators and the downloadable farm report.
        </Card>
      </section>
    </div>
  );
}

function QuickAction({
  to,
  title,
  body,
}: {
  to: "/app/nasa" | "/app/soil";
  title: string;
  body: string;
}) {
  return (
    <Card className="gap-0 p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <Button asChild variant="link" className="mt-3 h-auto justify-start p-0">
        <Link to={to}>
          Open <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
    </Card>
  );
}
