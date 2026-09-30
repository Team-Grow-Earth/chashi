import { cn } from "@/lib/utils";

export function FieldWiseLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="none">
          <path
            d="M3 19c0-5 4-9 9-9M12 10c0-3 2-6 6-7 1 5-1 9-6 10Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M18 14v-2M21 17h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">FieldWise</span>
    </span>
  );
}
