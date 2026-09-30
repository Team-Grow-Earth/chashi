# Project rules

- FieldWise demo data lives in `src/lib/fieldwise/` (types, demo-data, farm-context); routes and components read from it so a real backend can replace one module later.
- The selected farm is shared via `FarmProvider` in `src/routes/app.tsx`, so every app page reacts to the farm switcher.
- Every displayed value carries a `SourceBadge` (nasa / farmer / regional / model) so data provenance is never implicit.
