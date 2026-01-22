# SYFE — Brand & Design Language Memo (One‑Page)
*Version: 2025‑09‑18 · Owner: Brand/PM · Audience: Writers, Designers, Engineers*

> **Essence**: SYFE should feel like a declassified, sovereign‑grade system quietly commercialized by accident. The emotional trigger is **greed through unrestricted access**: “keys to the mainframe.” We never say we’re a startup. We **show** authority via restraint, latency receipts, and surgical language. Minimal, black/white, with a single accent used sparingly. **Speed is the product.**

---

## 1) Voice & Copy Rules (Plain English)
- **Tone:** Bold, terse, unapologetic. **Brevity = authority.** No hype words, no filler.
- **Positioning:** “Clearance‑grade weather → trading signal in seconds.” We talk outcomes (lead minutes, action), not features.
- **Never say:** startup, tool, app, AI magic, “disrupt,” “next‑gen,” emojis, exclamation points.
- **Always imply:** restricted access, inevitability, precision, *you’re getting something others don’t*.
- **Speed grammar:** Use concrete envelopes: *“ingest→alert ≤ 120 s,” “publish→delta ≤ 60 s.”*
- **Public vs depth:** Public = simple & spare. Depth on request = technical briefs, data lineage, SLAs.

**Sample hero lines**  
- *Beat the storm. Beat the market.*  
- *Live satellite nowcasting — seconds sooner.*  
- *From sky to signal in seconds.*  

**Sample subcopy**  
- *We intercept satellite, radar, and model outputs and stream only what changed — the trading deltas — with deterministic latency.*

**CTA copy**  
- *Request clearance* · *Run a pilot* · *View latency receipts*

---

## 2) Visual System (CIA/Black‑Ops Minimalism)
- **Palette:** Black **#000000**, White **#FFFFFF**, one accent only per artifact. Approved accents: **Deep Navy #0A1B2B** *or* **Ops Red #B10202** (use for numbers, status strips, or emphasis—not blocks).
- **Imagery:** Orbital grids, satellite frames, radar tiles, mission‑patch glyphs. **Never** stock photography or lifestyle.
- **Layouts:** Briefing style. Short blocks, stamped labels (e.g., *EYES ONLY*, *RESTRICTED*), generous negative space, occasional redactions.
- **Motion:** Quick fades/slide‑ins under 200ms. Motion = speed, not flourish. No parallax.

---

## 3) Typography Map (use exactly as follows)
- **Tier A — Narrative (high‑level):** **Times New Roman** — *regular only*. **Never bold, never underlined.** For headlines, section intros, big claims.
- **Tier B — Technical:** **Alliance No.2** (Regular/Bold). For explanations, data labels, diagrams, code‑adjacent UI.
- **Tier C — Actions/UI:** **Helvetica Neue Bold** (or **Helvetica Bold**). For buttons, menus, status pills, classification stamps.

**Font stacks**  
- Times: `"Times New Roman", Times, serif`  
- Alliance No.2: `"Alliance No.2", "IBM Plex Sans", Inter, system-ui, sans-serif` (fallbacks ok)  
- Helvetica: `"Helvetica Neue", Helvetica, Arial, sans-serif`

**Typescale (desktop)**  
- H1 (Tier A): 48/56 · H2: 32/40 · H3: 24/32 · Body (Tier B): 16/24 · Caption: 12/18  
- Buttons (Tier C): 14/16 ALL‑CAPS, letter‑spacing +2%

---

## 4) Components & Patterns
- **Buttons (Tier C):** Helvetica Bold, ALL‑CAPS, black bg / white text; hover invert. Primary labels: *REQUEST CLEARANCE*, *RUN PILOT*, *VIEW RECEIPTS*.
- **Status strip:** Fixed footer/header with *LATENCY p50/p95* and *UPTIME 30d*. Accent color for numbers only.
- **Cards:** Briefing cards with header stamp (e.g., *SITREP‑NG‑021*). No shadows; 1px hairline borders.
- **Tables/Charts:** White background, black gridlines 10% opacity. Accent only for the current run/alert.
- **Icons:** Line icons, monoweight. Mission patches for products (see §5 names).

---

## 5) Naming & Codenames (internal + external)
Use **codenames** for every surface. No “v1.2.” Approved set:
- **Operation HORIZON** — global intercept layer (first pixel path).  
- **Project KESTREL** — 0–6 h nowcasting ensemble.  
- **SF PULSE** — alerts/apps/connectors.  
- **SF STREAM** — API/WebSocket rail.  
- **SF EDGE** — on‑prem/air‑gapped installs.  
- **SF VERIFY** — audit, provenance, latency receipts.  

Label assets like: `HORIZON // Rev K`.

---

## 6) Ethical & Legal Guardrails (non‑negotiable)
- **Provenance:** Authorized public broadcasts and licensed commercial feeds only. No classified sources.
- **Representation:** *“Defense‑grade”* speaks to rigor, **not** government affiliation. Be explicit in fine print.
- **Financial:** Signals ≠ advice. Practice mode by default for new users. Publish SLAs and limitations.
- **Privacy:** Opt‑in telemetry, purge policies, on‑prem option for sensitive buyers.

---

## 7) Page & Deck Templates (direction for Claude/teams)
- **Homepage hero:** H1 (Tier A) + single‑line subcopy; two buttons (Tier C): *FOR FUNDS* / *FOR TRADERS*. Live status strip below fold. Background: single satellite frame with 70% desaturation.
- **Product page (Funds):** Left nav with stamps; sections: *Architecture Brief*, *SLA Matrix*, *Security Posture*, *Case Studies*. Each section opens with Tier A, details in Tier B.
- **Deck cover:** Black background, H1 in Times (regular), small stamp in Helvetica Bold: *RESTRICTED // INVESTOR BRIEF*. One accent line under title.
- **SITREP one‑pager:** Fields: **SITUATION / INTERCEPT / ASSESSMENT / ACTION / CONFIDENCE**. Use Alliance for body; stamps and headers in Helvetica Bold.

---

## 8) Do / Don’t Checklist (ship‑blocker)
**Do**  
- Speak in numbers (lead minutes, p50/p95).  
- Show fewer screens, more receipts.  
- Use one accent, once.  
- Codename everything.  

**Don’t**  
- Say “startup,” “AI‑powered,” or “next‑gen.”  
- Use stock photos or gradients.  
- Bold Times New Roman.  
- Over‑explain in public copy.

---

## 9) Microcopy Library (paste‑ready)
- **Hero:** *Beat the storm. Beat the market.*  
- **Tagline:** *From sky to signal in seconds.*  
- **CTA:** *REQUEST CLEARANCE* · *RUN A PILOT* · *VIEW LATENCY RECEIPTS*  
- **Status:** *LATENCY p50 90s · p95 170s · UPTIME 99.95% (30d)*  
- **Footnote:** *Authorized public broadcasts and licensed feeds. Signals are not financial advice.*

---

## 10) Implementation Notes (for engineers/designers)
- **Spacing/grid:** 8‑pt system; container max‑width 1200px; sections 64–96px vertical rhythm.
- **Contrast:** Maintain WCAG AA at minimum; avoid red‑only cues; pair Ops Red with iconography or labels.
- **Data viz:** Default black/white. Accent = “current alert/run.” Animations < 200ms, no easing beyond standard.
- **Export styles:** All PDFs in black/white with accent sparingly; watermark stamp (e.g., *EYES ONLY*) for internal docs.

---

**North Star:** If it doesn’t feel like a clean room with a red phone to the sky, cut it. **Less surface, more signal.**

