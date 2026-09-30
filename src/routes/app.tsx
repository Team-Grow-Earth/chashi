import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Satellite, Layers, ChevronsUpDown, PencilLine, Sprout, Droplets } from "lucide-react";
import { FieldWiseLogo } from "@/components/fieldwise/logo";
import { FarmProvider, useFarm } from "@/lib/fieldwise/farm-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/nasa", label: "NASA Data", icon: Satellite, exact: false },
  { to: "/app/soil", label: "Soil", icon: Layers, exact: false },
  { to: "/app/crops", label: "Crops", icon: Sprout, exact: false },
  { to: "/app/water", label: "Water", icon: Droplets, exact: false },
  { to: "/app/farm", label: "My Farm", icon: PencilLine, exact: false },
] as const;

function FarmSwitcher() {
  const { farm, farms, setFarmId } = useFarm();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-accent/5">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{farm.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {farm.region}, {farm.country}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch farm</DropdownMenuLabel>
        {farms.map((f) => (
          <DropdownMenuItem key={f.id} onSelect={() => setFarmId(f.id)}>
            <span className="flex flex-col">
              <span className="text-sm font-medium">{f.name}</span>
              <span className="text-xs text-muted-foreground">
                {f.sizeValue} {f.sizeUnit} · {f.currentCrop}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppLayout() {
  return (
    <FarmProvider>
      <div className="min-h-screen bg-background">
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
          <Link to="/" className="mb-6 px-1">
            <FieldWiseLogo />
          </Link>
          <FarmSwitcher />
          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                activeProps={{
                  className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Badge variant="secondary" className="mb-2">
              Demo data
            </Badge>
            <p>
              Examples load from a data file; your own entries are saved on this device. Estimates are illustrative.
            </p>
          </div>
        </aside>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
            <Link to="/">
              <FieldWiseLogo />
            </Link>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground">
              Demo
            </span>
          </header>
          <main className="px-4 pt-4 pb-28 sm:px-6 lg:px-10 lg:pt-8 lg:pb-12">
            <Outlet />
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-background/95 backdrop-blur lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-medium text-muted-foreground"
            >
              <item.icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </FarmProvider>
  );
}
