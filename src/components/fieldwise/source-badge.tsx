import { useState } from "react";
import { Info, Satellite, Sprout, Map, FlaskConical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DataSourceKind } from "@/lib/fieldwise/types";

const SOURCES: Record<
  DataSourceKind,
  { label: string; icon: typeof Info; classes: string; what: string; limits: string }
> = {
  nasa: {
    label: "NASA-derived",
    icon: Satellite,
    classes: "bg-nasa-soft text-nasa",
    what: "Environmental information derived from NASA Earth-observation products, such as temperature, rainfall, soil moisture and vegetation greenness.",
    limits:
      "These are area-wide satellite and model estimates, not measurements taken inside your field. A single value can cover several kilometres of land.",
  },
  farmer: {
    label: "Farmer-provided",
    icon: Sprout,
    classes: "bg-farmer-soft text-farmer",
    what: "Information you entered yourself: farm size, location, soil details, crops, history and your priorities.",
    limits:
      "The analysis is only as accurate as what was entered. You can update these values at any time.",
  },
  regional: {
    label: "Regional data",
    icon: Map,
    classes: "bg-regional-soft text-regional",
    what: "Typical values for your district or region, taken from agricultural statistics and crop reference data.",
    limits:
      "Regional averages can differ a lot from one field to the next. Treat them as a starting point, not a measurement.",
  },
  model: {
    label: "Model-derived",
    icon: FlaskConical,
    classes: "bg-model-soft text-model",
    what: "A value calculated by FieldWise by combining environmental data, soil details, crop needs and your priorities.",
    limits:
      "This is an estimate, not a prediction or a guarantee. Results change when the underlying information or assumptions change.",
  },
};

export function SourceBadge({
  source,
  className,
  note,
}: {
  source: DataSourceKind;
  className?: string;
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  const meta = SOURCES[source];
  const Icon = meta.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${meta.label}. Learn where this information comes from`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          meta.classes,
          className,
        )}
      >
        <Icon className="size-3" aria-hidden />
        {meta.label}
        <Info className="size-3 opacity-70" aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="size-5" aria-hidden />
              {meta.label}
            </DialogTitle>
            <DialogDescription>Where this information comes from</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>{meta.what}</p>
            {note ? <p className="text-muted-foreground">{note}</p> : null}
            <div className="rounded-lg bg-muted p-3">
              <p className="font-semibold">Good to know</p>
              <p className="mt-1 text-muted-foreground">{meta.limits}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              This preview uses demo / example data so you can explore the full journey. Values are
              not real measurements of your field.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
