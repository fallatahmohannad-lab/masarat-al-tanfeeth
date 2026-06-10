# مسارات · Masaraat

**From RFP to paid — a simple, verified way to bid, deliver, and get paid on government work.**

A bilingual (Arabic RTL · English LTR), mobile-friendly **Vite + React + Tailwind CSS + Lucide
React** clickable prototype. It walks a contractor/supplier through a clear **5-step journey**,
and gives the government buyer, the owner, and a financier the views they each need — all driven
by one shared state engine, so an action by one role is reflected for the others.

Light cyan-on-white, calm and government-grade. No technical jargon anywhere in the UI.

---

## Quick start

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

Requires Node.js ≥ 18.

---

## The 5-step journey

| Step | Screen | What the user does |
|------|--------|--------------------|
| 1 | **Start the bid** (ابدأ العرض) | Pick the RFP, then *Price it* (smart suggestion + low-price warning), *Plan it* (auto milestone checklist), *Check the numbers* (cash-flow). Nothing is auto-submitted. |
| 2 | **Record delivery** (سجّل التسليم) | Mark each milestone delivered and attach proof — on mobile, or auto-sync from your system. Live progress panel. |
| 3 | **Check & changes** (المراجعة والتغييرات) | Auto quantity match (mismatches flagged amber), flag a faulty item, and handle a change request with its impact on scope/spec/schedule/local content. Payment holds until the change is cleared. |
| 4 | **Submit to Etimad** (الإرسال إلى اعتماد) | Run the local-content check, then submit a verified claim. The Owner role sees the verified claim with proof. |
| 5 | **Dashboard & payment** (المتابعة والدفع) | KPI cards (claim status, days-to-payment, cost of delay, local-content score), the locked activity history, and Owner payment approval → *Paid & closed ✓*. Financier sees a *Safe to finance* badge. |

## Roles (demo switcher, top bar — default: Sara)

- **Sara** — Contractor / Supplier (prepares bids, records delivery, submits claims)
- **Khalid** — Government Engineer / Buyer (reviews & approves verified work, change requests)
- **Owner** — Government Entity (reviews the verified claim, approves payment)
- **Financier** — optional (sees verified claims that are safe to finance)

Each role sees what matters to it; switching is recorded in the activity history.

---

## Design system (light theme)

| Token | Value |
|-------|-------|
| Page background | `#F4F6F9` |
| Cards | white, 12px radius, `#E2E8EB` border, soft shadow |
| Primary action / active / highlights | cyan `#00B4DB` |
| Text / headings / icons | deep teal `#0F2027` / `#1E5F74` (never large fills) |
| Verified / success | green `#1D9E75` |
| Waiting / attention | amber `#EF9F27` |
| Problem / rejected | red `#E24B4A` |
| Fonts | Inter (EN) · IBM Plex Sans Arabic / Tajawal (AR), 16px body |

---

## Project structure

```
app/
├── index.html · vite.config.js · tailwind.config.js · postcss.config.js
├── public/mark.svg
└── src/
    ├── main.jsx · App.jsx · index.css
    ├── i18n/strings.js            # plain-language bilingual labels (t / tx)
    ├── data/mock.js               # realistic Saudi mock data (RFP, milestones, SAR)
    ├── context/AppStateContext.jsx# shared state engine: roles, 5-step state, locked activity log
    └── components/
        ├── common/                # TopBar, Stepper, RoleSwitcher, StepShell, StepNav,
        │                          # ActivityHistory, ui kit (Card, Badge, Banner, StatCard…)
        └── steps/                 # Step1StartBid … Step5Dashboard
```

## Architecture notes

- **One shared state engine** (`AppStateContext`) holds all mock state in a reducer. Every
  mutation routes through bound actions, so Sara's delivery, Khalid's change approval, the Owner's
  payment, and the Financier's view all read/write the same store.
- **Locked activity history** — every action appends to an append-only timeline (plain language),
  surfaced on the dashboard: *“Every step is recorded and can't be changed after the fact.”*
- **Plain language only** — internal mechanics are never shown; the user sees friendly labels
  (e.g. “Smart price suggestion”, “Submit to Etimad”, “Activity history (locked)”).
- **Bilingual + RTL** — `lang` lives in context; `<html dir lang>` is synced in `App`. Shared
  strings use `t('key')`; inline strings use `tx({ ar, en })`.
- **No backend** — all data is mock and in-memory. The **Restart** button (top bar) resets state.

_Built for the MIS 698 graduation research project — Masaraat._
