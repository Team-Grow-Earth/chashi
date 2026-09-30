import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SourceBadge } from "@/components/fieldwise/source-badge";
import { useFarm } from "@/lib/fieldwise/farm-context";
import { getEnvironment } from "@/lib/fieldwise/demo-data";
import type { ReactNode } from "react";

export const Route = createFileRoute("/app/nasa")({
  head: () => ({
    meta: [
      { title: "Environmental data — FieldWise" },
      {
        name: "description",
        content:
          "Temperature, rainfall, soil moisture, vegetation greenness and dryness around your farm, explained in plain language.",
      },
      { property: "og:title", content: "Environmental data — FieldWise" },
      {
        property: "og:description",
        content: "NASA-style Earth-observation data for your farm, without the jargon.",
      },
    ],
  }),
  component: NasaDashboard,
});

function ChartCard({
  title,
  plain,
  unit,
  children,
}: {
  title: string;
  plain: string;
  unit: string;
  children: ReactNode;
}) {
  return (
    <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{plain}</p>
        </div>
        <SourceBadge source="nasa" />
      </div>
      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children as never}
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Last 12 months · {unit} · area-wide estimate, roughly 10 km grid
      </p>
    </Card>
  );
}

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    fontSize: 12,
  },
};

function NasaDashboard() {
  const { farm, soil } = useFarm();
  const env = getEnvironment(farm, soil);
  const data = env.monthly;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Environmental data</p>
        <h1 className="font-display text-3xl font-semibold">Conditions around {farm.name}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          These figures come from Earth-observation data for the area around your field, not from
          sensors in your soil. They show the pattern of a typical year and how recent months
          compare.
        </p>
      </header>

      <Card className="flex flex-col gap-3 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <SourceBadge source="model" />
          <p className="text-sm">{env.summary}</p>
        </div>
        <div className="rounded-lg bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Dryness right now: </span>
          <span className="font-semibold">
            {env.droughtLevel === "None" ? "Normal" : env.droughtLevel}
          </span>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Temperature" plain="How warm the air usually is each month" unit="°C">
          <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-chart-3)"
              strokeWidth={2.5}
              dot={false}
              name="Temperature (°C)"
            />
          </LineChart>
        </ChartCard>

        <ChartCard title="Rainfall" plain="How much rain falls in a typical month" unit="mm">
          <BarChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip {...tooltipStyle} />
            <Bar
              dataKey="rainfall"
              fill="var(--color-chart-2)"
              radius={[6, 6, 0, 0]}
              name="Rainfall (mm)"
            />
          </BarChart>
        </ChartCard>

        <ChartCard
          title="Soil moisture"
          plain="How much water the soil holds through the year"
          unit="% of capacity"
        >
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone"
              dataKey="soilMoisture"
              stroke="var(--color-chart-5)"
              fill="var(--color-chart-5)"
              fillOpacity={0.2}
              strokeWidth={2.5}
              name="Soil moisture (%)"
            />
          </AreaChart>
        </ChartCard>

        <ChartCard
          title="Vegetation condition"
          plain="How green and healthy the land looks from space"
          unit="greenness index"
        >
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis domain={[0, 1]} {...axis} />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone"
              dataKey="ndvi"
              stroke="var(--color-chart-1)"
              fill="var(--color-chart-1)"
              fillOpacity={0.2}
              strokeWidth={2.5}
              name="Greenness"
            />
          </AreaChart>
        </ChartCard>
      </div>

      <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
        <AccordionItem value="tech">
          <AccordionTrigger>View technical details</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Vegetation condition is shown here as a greenness index (commonly called NDVI), where
              higher values mean denser, healthier plant cover.
            </p>
            <p>
              Soil moisture is expressed as a share of how much water the soil can hold, averaged
              over the grid cell that contains your field.
            </p>
            <p>
              Location used: {farm.lat.toFixed(4)}, {farm.lon.toFixed(4)} · {env.resolution}.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="limits">
          <AccordionTrigger>What this data cannot tell you</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              It cannot show conditions in one corner of your field, sudden local storms, or what
              happened under a tree line.
            </p>
            <p>
              In this preview the values are realistic demo data, so treat every number as an
              example rather than a measurement.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
