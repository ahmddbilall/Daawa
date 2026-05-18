# PRODUCT — Daawa

Short: Daawa is an offline-first rural health triage assistant that gives community health workers (CHWs) fast, clear, and actionable triage guidance using local Gemma 4 inference.

Vision

- Make safe, responsible triage available offline in low-resource settings.
- Reduce time-to-action for urgent cases and increase appropriate referrals.

Target users

- Community health workers, lay caregivers, small-clinic nurses in rural settings.
- Low literacy and limited bandwidth environments.

Success metrics

- Median triage turnaround < 10s on local hardware (Gemma 4:4b)
- Referral accuracy (clinically reviewed) ≥ 85% for HIGH/CRITICAL cases
- CHW task completion rate increase and reduced unnecessary referrals

Non-goals

- Provide definitive diagnoses
- Replace clinicians — the app only recommends actions and referrals

Design Principles (Impeccable-aligned)

- Anti-slop: every screen enforces contrast, spacing, and readable language.
- Purpose-first: primary CTA is clear, single-action (Submit Triage).
- Minimal cognitive load: one task per screen, plain language, explicit examples.
- Durable offline UX: local model-first, graceful network features.

Tone & Language

- Empathetic, directive, actionable.
- Use simple sentences and local language when available.

Critical UX Rules

- Always show urgency badge with color + text (CRITICAL/HIGH/MEDIUM/LOW).
- When urgency is CRITICAL, surface a big red referral card with "Refer Immediately" and local emergency steps.
- If image provided, show a single clear observation sentence extracted from model output.
- Show confidence/score as an integer (1–5) with short guidance.

Design Tokens (OKLCH-inspired palette)

- Brand-Primary: oklch(60% 0.12 260) /_ deep indigo blue _/
- Accent-Warn: oklch(65% 0.18 30) /_ warm red/orange for critical _/
- Surface: oklch(95% 0.03 260) /_ near-white _/
- Muted: oklch(82% 0.02 260) /_ subtle gray _/

Accessibility

- Minimum AA contrast on all text; large interactive targets (≥ 44px hit area).
- Language toggles presented prominently; translations use native script labels.

Files produced by `/impeccable teach`

- `PRODUCT.md` — this file (product goals, tokens, rules)
- `DESIGN.md` — UI patterns and component guidance (generated via `/impeccable document`)

Next steps

- Run `/impeccable document` to generate `DESIGN.md` from these tokens.
- I can also scaffold `frontend/components/DesignTokens.ts` and update CSS variables.

---

If you'd like, I can: generate `DESIGN.md`, scaffold token CSS, or commit this file to Git. Which do you want next?
