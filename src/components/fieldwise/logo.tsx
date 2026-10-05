import { cn } from "@/lib/utils";
import logo from "@/assets/chashi-logo.png";

export function FieldWiseLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img src={logo} alt="" width={1024} height={1024} className="size-10 object-contain" />
      <span className="font-display text-lg font-semibold tracking-tight">Chashi</span>
    </span>
  );
}
