import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { SourceBadge } from "./source-badge";
import { cn } from "@/lib/utils";
import type { DataSourceKind } from "@/lib/fieldwise/types";

export function MetricCard({
  label,
  value,
  detail,
  source,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  source?: DataSourceKind;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 p-5 shadow-[var(--shadow-card)]", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {label}
        </div>
        {source ? <SourceBadge source={source} /> : null}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-foreground">{value}</p>
      {detail ? <p className="mt-1 text-sm text-muted-foreground">{detail}</p> : null}
    </Card>
  );
}
