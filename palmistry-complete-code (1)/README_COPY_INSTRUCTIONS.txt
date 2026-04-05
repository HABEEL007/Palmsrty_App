# PALMISTRY AI — FILE COPY INSTRUCTIONS
# =======================================
# Copy each file to its exact location in apps/web/src/

COPY THIS FILE → TO THIS LOCATION
─────────────────────────────────────────────────────────────
App.tsx                                         → apps/web/src/App.tsx
index.css                                       → apps/web/src/index.css
lib/env.ts                                      → apps/web/src/lib/env.ts
lib/supabase.ts                                 → apps/web/src/lib/supabase.ts
store/reading-store.ts                          → apps/web/src/store/reading-store.ts
pages/HomePage.tsx                              → apps/web/src/pages/HomePage.tsx
pages/CaptureView.tsx                           → apps/web/src/pages/CaptureView.tsx
pages/ProcessingView.tsx                        → apps/web/src/pages/ProcessingView.tsx
pages/ResultView.tsx                            → apps/web/src/pages/ResultView.tsx
pages/HistoryView.tsx                           → apps/web/src/pages/HistoryView.tsx
features/auth/types/auth.types.ts               → apps/web/src/features/auth/types/auth.types.ts
features/auth/services/auth.service.ts          → apps/web/src/features/auth/services/auth.service.ts
features/auth/hooks/useAuth.ts                  → apps/web/src/features/auth/hooks/useAuth.ts
features/auth/components/LoginPage.tsx          → apps/web/src/features/auth/components/LoginPage.tsx
features/onboarding/services/profile.service.ts → apps/web/src/features/onboarding/services/profile.service.ts
features/onboarding/components/OnboardingFlow.tsx → apps/web/src/features/onboarding/components/OnboardingFlow.tsx

─────────────────────────────────────────────────────────────
KEEP THESE EXISTING FILES (do not overwrite):
─────────────────────────────────────────────────────────────
apps/web/src/main.tsx                 (already correct)
apps/web/src/components/ErrorBoundary.tsx      (already exists)
apps/web/src/i18n/                             (already exists)
apps/web/src/features/auth/components/AuthGuard.tsx   (already exists)
apps/web/src/features/auth/components/AuthButton.tsx  (already exists)

─────────────────────────────────────────────────────────────
AFTER COPYING — RUN:
─────────────────────────────────────────────────────────────
cd apps/web
pnpm add zustand
pnpm run dev

─────────────────────────────────────────────────────────────
APP FLOW:
─────────────────────────────────────────────────────────────
/login         → LoginPage     (Google + Apple OAuth)
/onboarding    → OnboardingFlow (Name → Age → DOB)
/              → HomePage      (Hero + CTA)
/scan          → CaptureView   (Camera + quality checks)
/processing    → ProcessingView (AI animation)
/reading/result → ResultView   (Cards + share)
/history       → HistoryView   (Past readings)
