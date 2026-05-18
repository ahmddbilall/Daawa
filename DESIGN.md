# Daawa — Design System & UI Agent Guidelines

> **For AI Agents:** Read this file before writing ANY UI code.  
> This is your design law. Deviation from these rules produces generic, AI-looking output.  
> When in doubt: ask "does this feel considered, or does this feel generated?"

---

## 0. Agent Skill Setup (Required Before First UI Task)

Install these skills into your harness (Claude Code / Cursor) at project root:

```bash
cd Daawa/frontend

# 1. Emil Kowalski — animation craft, micro-interaction philosophy
npx skills add emilkowalski/skill

# 2. Impeccable — 23 design commands, anti-slop detection, OKLCH color
npx skills add pbakaus/impeccable

# 3. Taste Skill — premium frontend output, 3-dial system
npx skills add Leonxlnx/taste-skill

# 4. UI/UX Pro Max — design intelligence for healthcare product
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uipro
mkdir -p .claude/skills
cp -r /tmp/uipro/.claude/skills/ui-ux-pro-max .agents/skills/
```

**After install, configure Impeccable with Daawa's design context:**

```bash
# In your agent, run:
/impeccable teach
```

**Answer the teach prompts as follows:**

```
Register: product (app UI — design SERVES the product)
Product name: Daawa
Target users: Community health workers in rural/resource-limited settings
Brand tone: Serious, trustworthy, compassionate, clinical but human
Anti-references: Generic SaaS dashboards, purple gradients, glassmorphism, Bootstrap
Design personality: Utilitarian precision with warmth — like Doctors Without Borders branding
Primary action: Submitting a patient triage assessment
Success metric: Health worker gets actionable guidance in under 10 seconds of reading
```

---

## 1. Design Philosophy

### 1.1 Core Principle

This is a **medical tool**, not a tech product. Every visual decision must serve clarity and trust, not aesthetics for their own sake.

> "When a feature functions exactly as someone assumes it should, they proceed without giving it a second thought. That is the goal." — Emil Kowalski

Health workers in the field are stressed, often in poor lighting, on low-res screens. **Clarity is the feature.**

### 1.2 Taste Skill Dial Settings

For this project, configure these values mentally when generating any component:

```
DESIGN_VARIANCE: 5       (moderate — enough personality, not artsy chaos)
MOTION_INTENSITY: 4      (purposeful animation only — no cinematic effects)
VISUAL_DENSITY: 6        (data-dense — health workers need all info visible)
```

### 1.3 Anti-Patterns (Forbidden)

The Impeccable anti-pattern detector will flag these. Do not implement them:

| Anti-Pattern | Why It Fails Here |
|---|---|
| Purple-to-blue gradients | Looks tech/startup — wrong emotional register for medical |
| Cards nested inside cards | Creates visual noise when reading urgent info quickly |
| Gray text on colored backgrounds | Fails contrast for users in bright sunlight |
| Bounce easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) on medical alerts | Playful motion undermines urgency |
| Inter for everything | Default — no identity |
| Dark glow / neon effects | Medical tools need sober palette |
| Icon tiles above headings | Generic SaaS pattern |
| Gradient text | Trendy, not trustworthy |
| Glassmorphism on content | Reduces legibility in field conditions |

---

## 2. Color System

### 2.1 Base Palette (OKLCH)

Use OKLCH for all colors. This ensures perceptual uniformity and better dark mode rendering than hex.

```css
/* ─── Brand ─────────────────────────────────── */
--color-primary:        oklch(55% 0.15 195);  /* Deep medical teal */
--color-primary-light:  oklch(70% 0.12 195);  /* Interactive hover */
--color-primary-muted:  oklch(40% 0.10 195);  /* Pressed/active */
--color-primary-glow:   oklch(55% 0.15 195 / 0.2);  /* Focus ring */

/* ─── Backgrounds ────────────────────────────── */
--color-bg:             oklch(12% 0.01 240);  /* App background */
--color-bg-elevated:    oklch(16% 0.01 240);  /* Sidebar, panels */
--color-bg-card:        oklch(18% 0.015 240); /* Card surfaces */
--color-bg-input:       oklch(14% 0.01 240);  /* Form fields */
--color-border:         oklch(25% 0.01 240);  /* Borders, dividers */
--color-border-focus:   oklch(55% 0.15 195 / 0.6);

/* ─── Text ───────────────────────────────────── */
--color-text:           oklch(92% 0.005 240); /* Primary text */
--color-text-muted:     oklch(65% 0.01 240);  /* Secondary text */
--color-text-subtle:    oklch(45% 0.01 240);  /* Placeholder, hints */

/* ─── Urgency (Semantic) ─────────────────────── */
--color-critical:       oklch(55% 0.22 25);   /* Emergency red */
--color-critical-bg:    oklch(55% 0.22 25 / 0.12);
--color-critical-border:oklch(55% 0.22 25 / 0.35);

--color-high:           oklch(68% 0.18 45);   /* Urgent amber */
--color-high-bg:        oklch(68% 0.18 45 / 0.12);
--color-high-border:    oklch(68% 0.18 45 / 0.35);

--color-medium:         oklch(78% 0.15 85);   /* Caution yellow */
--color-medium-bg:      oklch(78% 0.15 85 / 0.12);
--color-medium-border:  oklch(78% 0.15 85 / 0.35);

--color-low:            oklch(68% 0.14 155);  /* Stable green */
--color-low-bg:         oklch(68% 0.14 155 / 0.12);
--color-low-border:     oklch(68% 0.14 155 / 0.35);
```

### 2.2 Color Rules

- **Never** use pure `#000000` or `#FFFFFF` — use tinted neutrals
- **Always** pair urgency color with icon AND text — color alone is insufficient
- **Contrast minimum:** 4.5:1 for body text, 3:1 for large text (WCAG AA)
- **Muted text** (`--color-text-muted`) only for truly secondary info — not for anything the user must read
- **Teal** is the only brand accent — do not introduce secondary accent colors

---

## 3. Typography

### 3.1 Typeface

Primary: **Inter Variable** (via `next/font/google`)  
Rationale: Highly legible at small sizes, excellent multilingual support (Arabic, Urdu RTL), neutral enough for medical context.

```css
/* Type Scale (fixed for app UI — not fluid) */
--text-xs:   11px;   /* Metadata, timestamps */
--text-sm:   13px;   /* Labels, captions */
--text-base: 15px;   /* Body text — slightly larger for field readability */
--text-md:   17px;   /* Subheadings */
--text-lg:   20px;   /* Section headings */
--text-xl:   24px;   /* Page title, urgency label */
--text-2xl:  32px;   /* Hero / landing only */
```

### 3.2 Typography Rules (Emil Kowalski + Impeccable)

1. **Cap body text at ~65ch** — never stretch full-width for reading comfort
2. **Use `tabular-nums`** on all numbers (processing time, scores) for alignment
3. **Loosen letter-spacing on ALL uppercase text** — `letter-spacing: 0.06em`
4. **Line height:** 1.6 for body text, 1.2 for headings, 1.0 for single-line labels
5. **Font weight:** 400 body, 500 labels/UI, 600 headings, 700 only for urgency level text
6. **Do not use italic** for UI emphasis — use weight or color instead
7. **RTL support:** Urdu and Arabic inputs must use `dir="auto"` on textarea

---

## 4. Motion & Animation

### 4.1 Guiding Principle

> "Nothing in the real world disappears and reappears completely. Elements animating from scale(0) look like they come out of nowhere." — Emil Kowalski

Every animation must have a physical metaphor. A result card appearing is like a document being placed on a desk — it arrives with weight, not teleportation.

### 4.2 Easing Curves

```css
/* Default for most UI transitions — use this 80% of the time */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* For elements that decelerate into place (like sliding panels) */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* NEVER use bounce (cubic-bezier(0.34, 1.56, 0.64, 1)) for medical UI */
/* NEVER use linear for entering elements */
```

### 4.3 Duration Guidelines

| Animation Type | Duration | Notes |
|---|---|---|
| Button press | 160ms | Fast — should feel instantaneous |
| Tooltip / popover appear | 200ms | Quick reveal |
| Card entrance | 280ms | Primary UI transitions |
| Page section entrance | 350ms | Longer elements |
| Loading shimmer | 1200ms loop | Slow breathing rhythm |
| Status indicator pulse | 2000ms loop | Very subtle, barely noticeable |

### 4.4 Stagger Pattern (For Result Sections)

```typescript
// Each section in TriageResult enters 60ms after the previous
const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// Usage: custom={index} on each motion.div
```

### 4.5 Button Active State (Universal Rule)

Every clickable element must have this:

```css
.pressable {
  transition: transform 160ms ease-out;
}
.pressable:active {
  transform: scale(0.97);
}
```

In Tailwind: `active:scale-[0.97] transition-transform duration-[160ms] ease-out`

### 4.6 Loading State

Do **not** use a generic spinner. Use this for the submit button:

```css
/* Breathing glow on button border during loading */
@keyframes loading-pulse {
  0%, 100% { box-shadow: 0 0 0 0 oklch(55% 0.15 195 / 0.4); }
  50%       { box-shadow: 0 0 0 8px oklch(55% 0.15 195 / 0); }
}
.loading { animation: loading-pulse 1.5s ease-out infinite; }
```

---

## 5. Component Specifications

### 5.1 Form Inputs

```css
/* Base input style */
.input {
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: var(--text-base);
  padding: 10px 14px;
  transition: border-color 200ms ease-out, box-shadow 200ms ease-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.input::placeholder { color: var(--color-text-subtle); }
```

### 5.2 Primary Button

```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
  letter-spacing: 0.01em;
  border-radius: 8px;
  padding: 12px 24px;
  transition: background 160ms ease-out, transform 160ms ease-out;
  border: none;
  cursor: pointer;
}

.btn-primary:hover  { background: var(--color-primary-light); }
.btn-primary:active { transform: scale(0.97); background: var(--color-primary-muted); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
```

### 5.3 Card Surface

```css
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px 24px;
}
/* NO nested cards. NO shadow stacking. ONE level deep only. */
```

### 5.4 Urgency Badge

The most critical component. Must be immediately readable in any condition.

- Minimum height: 64px
- Icon: 28px, strokeWidth 2
- Label text: 20px, weight 700, letter-spacing 0.06em
- Sublabel: 13px, weight 400, opacity 0.8
- Padding: 16px 20px
- Border-radius: 12px
- For CRITICAL only: subtle CSS border animation (not jarring — just a gentle 2-second pulse on border opacity)

### 5.5 Image Upload Dropzone

```css
.dropzone {
  border: 1.5px dashed var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-input);
  min-height: 120px;
  transition: border-color 200ms ease-out, background 200ms ease-out;
}

.dropzone:hover, .dropzone.drag-active {
  border-color: var(--color-primary);
  background: var(--color-primary-glow);
}
```

---

## 6. Layout System

### 6.1 Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo + tagline + status indicator              │ 64px
├───────────────────────────┬─────────────────────────────┤
│                           │                             │
│   Input Panel             │   Result Panel              │
│   (48% width)             │   (52% width)               │
│                           │                             │
│   - Language selector     │   - UrgencyBadge            │
│   - Age input             │   - Conditions              │
│   - Symptoms textarea     │   - Actions                 │
│   - Image upload          │   - Warnings                │
│   - Submit button         │   - Referral info           │
│                           │                             │
│   max-width: 520px        │   max-width: 580px          │
│   padding: 40px           │   padding: 40px             │
│                           │                             │
├───────────────────────────┴─────────────────────────────┤
│  Footer: "Powered by Gemma 4 · 100% offline"            │ 48px
└─────────────────────────────────────────────────────────┘
```

### 6.2 Mobile Layout (<768px)

- Input panel full width, top
- Result panel full width, below (slides up on result arrival)
- Header simplified: logo + compact status
- Textarea min-height reduced to 100px
- All touch targets minimum 44×44px

### 6.3 Spacing Scale

```
4px   — micro gap (icon + label)
8px   — tight spacing (list items)
12px  — compact spacing
16px  — base spacing (between form elements)
24px  — section spacing (between major sections)
32px  — panel padding (internal)
40px  — large gap (between panels)
64px  — section gap (header to content)
```

**Rule:** Never use arbitrary values in Tailwind. Only use scale multiples above.

---

## 7. Specific Component Patterns

### 7.1 Conditions List

```tsx
// Likely conditions — use a subtle numbered/bulleted list
// NOT cards, NOT badges for each condition
<ul className="space-y-1 mt-2">
  {conditions.map((c, i) => (
    <li key={i} className="flex items-center gap-2 text-sm">
      <span className="w-5 h-5 rounded-full bg-[var(--color-bg-elevated)] 
                       flex items-center justify-center text-xs 
                       text-[var(--color-text-muted)] font-mono tabular-nums">
        {i + 1}
      </span>
      <span>{c}</span>
    </li>
  ))}
</ul>
```

### 7.2 Immediate Actions

Display as numbered steps — these are instructions. Use a vertical timeline pattern:

```
1 ─── Isolate patient from others
      |
2 ─── Ensure adequate hydration
      |
3 ─── Monitor temperature every 2 hours
```

Each step: numbered circle (24px) + line connector + action text.

### 7.3 Warning Signs Section

These deserve visual prominence — but not as much as the urgency badge.

```tsx
// Warning signs header with a subtle amber icon
<div className="flex items-center gap-2 mb-2">
  <AlertTriangle size={16} style={{ color: 'var(--color-high)' }} />
  <span className="text-sm font-medium uppercase tracking-wider 
                   text-[var(--color-text-muted)]">
    Watch For
  </span>
</div>
```

### 7.4 Referral Section

If `refer_to_hospital: true` — make this visually clear, card-style:

```
┌─────────────────────────────────────┐
│  🏥  Hospital Referral Required     │
│      Within 24 hours                │
└─────────────────────────────────────┘
```

Background: `--color-high-bg`, border: `--color-high-border`

If `refer_to_hospital: false`:

```
┌─────────────────────────────────────┐
│  ✓  Home Care Appropriate           │
│     Routine follow-up if no improvement│
└─────────────────────────────────────┘
```

Background: `--color-low-bg`, border: `--color-low-border`

---

## 8. Multilingual / RTL Support

### 8.1 RTL Languages

Arabic and Urdu are right-to-left. Handle at textarea level:

```tsx
<textarea
  dir="auto"               // Auto-detects LTR/RTL per content
  lang={languageCode}
  className="font-sans text-base leading-relaxed"
/>
```

### 8.2 Label Language

The full UI is translated via `lib/i18n.ts` and `useI18n()`. Changing the language selector updates all labels, buttons, placeholders, and result section titles immediately. Locale is persisted in `localStorage` (`Daawa_locale`). Arabic and Urdu set `dir="rtl"` on `<html>`.

The **AI triage response** (conditions, actions, warnings) is returned in the language sent to the API (`apiLabel` from the active locale). Patient symptoms may be typed or recorded in any script (`dir="auto"` on the textarea).

---

## 9. Quick Reference: Agent Commands

When building or reviewing UI, invoke these in your agent:

```bash
# Before writing any component
/impeccable teach        # Set design context (first time only)

# After writing a component
/impeccable audit        # Check for anti-patterns
/impeccable polish       # Final quality pass

# For typography specifically
/impeccable typeset      # Fix font hierarchy

# For animations
/impeccable animate      # Add/review micro-interactions

# Full design critique (before video recording)
/impeccable critique     # UX review with scoring
```

---

## 10. What "Done" Looks Like

Before declaring any phase complete, run this mental checklist:

```
[ ] Zero hardcoded hex colors — all use CSS variables
[ ] Zero generic gradients (purple/blue)  
[ ] Zero cards nested in cards
[ ] All interactive elements have hover + active states
[ ] All animations use ease-out-expo, not linear or bounce
[ ] Urgency information is never color-only (always + icon + text)
[ ] All inputs have visible focus rings (not outline: none)
[ ] Touch targets minimum 44×44px
[ ] Body text max-width ~65ch
[ ] Numbers use tabular-nums
[ ] Loading state is visible and doesn't block the UI
[ ] RTL textarea (dir="auto") implemented
[ ] /impeccable audit reports zero critical issues
```
