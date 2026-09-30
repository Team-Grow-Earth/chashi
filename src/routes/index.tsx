import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Satellite,
  Sprout,
  Map,
  FlaskConical,
  ArrowRight,
  ShieldCheck,
  Scale,
  Droplets,
} from "lucide-react";
import heroImage from "@/assets/hero-fields.jpg";
import { FieldWiseLogo } from "@/components/fieldwise/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FieldWise — Adapting farms with NASA data" },
      {
        name: "description",
        content:
          "FieldWise helps farmers understand changing conditions on their land and compare practical crop-rotation options, with every number clearly sourced.",
      },
      { property: "og:title", content: "FieldWise — Adapting farms with NASA data" },
      {
        property: "og:description",
        content:
          "Understand your farm's changing conditions and compare crop-rotation options you can trust.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    icon: Sprout,
    title: "Tell us about your farm",
    body: "Location, size, soil and the crops you have grown. Skip anything you do not know.",
  },
  {
    icon: Satellite,
    title: "See the conditions",
    body: "Temperature, rain, soil moisture and greenness around your fields, in plain words.",
  },
  {
    icon: Scale,
    title: "Compare strategies",
    body: "Two or three rotation options side by side, with strengths and trade-offs spelled out.",
  },
  {
    icon: ShieldCheck,
    title: "Decide for yourself",
    body: "Test drier or hotter seasons, build a plan, and download a report. You choose.",
  },
];

const SOURCES = [
  { icon: Satellite, label: "NASA-derived", body: "Rain, heat, soil moisture, greenness", tone: "bg-nasa-soft text-nasa" },
  { icon: Sprout, label: "Farmer-provided", body: "What you entered about your land", tone: "bg-farmer-soft text-farmer" },
  { icon: Map, label: "Regional data", body: "District crop and yield statistics", tone: "bg-regional-soft text-regional" },
  { icon: FlaskConical, label: "Model-derived", body: "Estimates we calculate, never measurements", tone: "bg-model-soft text-model" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <FieldWiseLogo />
        <Button asChild size="sm">
          <Link to="/app">Explore demo farm</Link>
        </Button>
      </header>

      <section className="field-grid border-y border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
              NASA Space Apps Challenge 2026
            </span>
            <h1 className="text-balance-tight font-display text-4xl leading-tight font-semibold sm:text-5xl">
              Adapting farms with NASA data
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Your land is changing. FieldWise shows you what is happening around your fields and
              lays out a few practical crop-rotation options, so you can weigh them up and decide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/app">
                  Start planning my farm <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app/nasa">See the data first</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No account needed to look around. This preview uses clearly labelled demo data.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-lift)]">
            <img
              src={heroImage}
              alt="Farm fields viewed from above with a satellite gathering data overhead"
              width={1600}
              height={1008}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-semibold">How FieldWise works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Card key={step.title} className="gap-0 p-5 shadow-[var(--shadow-card)]">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-2xl font-semibold">You always know where a number came from</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Every figure carries a label. Satellite data, your own entries, regional statistics and
            our own estimates are never mixed together silently.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOURCES.map((s) => (
              <Card key={s.label} className="gap-0 p-5">
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${s.tone}`}
                >
                  <s.icon className="size-3" aria-hidden />
                  {s.label}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-semibold">Never one unexplained answer</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          FieldWise does not tell you what to plant. It shows options like these, with the
          trade-offs visible.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <StrategyPreview
            name="Keep current rotation"
            path="Rice → Wheat → Rice"
            strength="Familiar, known market"
            tradeoff="Highest water demand of the three"
          />
          <StrategyPreview
            name="Water-saving option"
            path="Rice → Lentil → Maize"
            strength="Lower estimated water need"
            tradeoff="New crop to learn and sell"
          />
          <StrategyPreview
            name="Soil-building option"
            path="Rice → Mustard → Lentil"
            strength="Better for long-term soil health"
            tradeoff="Lower estimated income in year one"
          />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <FieldWiseLogo className="text-foreground" />
          <p>Built for NASA Space Apps Challenge 2026. Demo data, not farm measurements.</p>
        </div>
      </footer>
    </div>
  );
}

function StrategyPreview({
  name,
  path,
  strength,
  tradeoff,
}: {
  name: string;
  path: string;
  strength: string;
  tradeoff: string;
}) {
  return (
    <Card className="gap-0 p-5 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-base font-semibold">{name}</h3>
      <p className="mt-2 font-medium text-primary">{path}</p>
      <div className="mt-4 space-y-2 text-sm">
        <p className="flex gap-2">
          <Droplets className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>{strength}</span>
        </p>
        <p className="flex gap-2 text-muted-foreground">
          <Scale className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{tradeoff}</span>
        </p>
      </div>
    </Card>
  );
}
