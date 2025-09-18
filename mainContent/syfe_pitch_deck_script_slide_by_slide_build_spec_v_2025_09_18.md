# SYFE — Pitch Deck Script (Condensed 12‑Slide Build Spec)
*Version: 2025‑09‑18 · Audience: Non‑technical investors · Owner: Founder/PM*

> Keep it plain, fast, and visual. 12 content slides total. Each slide lists copy + any chart with axes and sample values. (Design applies brand memo later.)

---

## 0) Cover
**Title:** SYFE — From Sky to Signal in Seconds  
**Subtitle:** The real‑time weather rail for trading  
**Footer:** Confidential · v2025‑09‑18

---

## 1) One‑liner (What we do)
**Headline:** Beat the storm. Beat the market.  
**Copy:** SYFE turns satellite, radar, and model updates into **small, tradable signals** delivered in **seconds to minutes**.

---

## 2) Problem (Today’s options are slow & clunky)
**Bullets:**  
- Public/free feeds arrive **minutes late** and in bulky files.  
- "Forecasts" get pushed; **changes** that move prices are buried.  
- Building private ingest is **expensive** and slow to stand up.

**Chart:** *Bar — “How fast do traders actually see updates?”*  
- **X:** Source (Public/free | Typical vendor | Build‑it‑yourself)  
- **Y:** Minutes to desk  
- **Bars:** 3–10 min | 2–5 min | 2–6 min (varies)  
- **Note on slide:** Our targets beat these (see Slide 5).

---

## 3) Solution (SYFE overview)
**Copy:** We **own the ingest path** where possible (satellite dishes, co‑lo near model/radar mirrors), compute **what changed**, and **push signals** via stream/API. Simple to integrate, easy to backtest, designed for desks.

**Flow:** Ingest → Compute deltas → Deliver (Stream/API/Parquet)

---

## 4) Product Split — **SYFE Lite vs SYFE Pro**
**Two columns:**  
- **SYFE Lite (POC, 3 months):** 1 hobbyist HRIT station + NEXRAD + HRRR deltas; stream/API + Parquet; live dashboard.  
- **SYFE Pro (Premium, 9 months):** Dual GRB sites (GOES East/West), GLM lightning, co‑lo delivery; optional lightning/private radar partner.

**Table:**
- **Lite speeds (targets):** Radar ≈ **2–3 min**, Model deltas ≤ **1 min** from publish.  
- **Pro speeds (targets):** Satellite/GLM ≈ **1.5–2.5 min**, Radar ≈ **2–3 min**, Model deltas ≤ **1 min**.

---

## 5) Why we win on speed (simple numbers)
**Bullets:**  
- Satellite scans happen every **1–10 min**; we process and push within **~2 min**.  
- Radar scans complete every **~5 min**; we emit on‑polygon **onset/ETAs** in **~2–3 min** after scan.  
- Models publish hourly; we ship **run‑over‑run deltas** within **~1 min** of publish.

**Chart:** *Clustered bars — “Seconds/Minutes, not hours”*  
- **X:** Sat/Lightning | Radar | Models  
- **Y:** Time to client (min)  
- **Bars:** Public/free (6, 4, 30–90+), Typical vendor (3–5, 3–4, 10–30), **SYFE Pro** (**~2**, **~2–3**, **≤1**)

---

## 6) Market size & our wedge
**Copy:** Weather services are a **$2.7B** global market today and growing. Alternative data spend in finance is **$11B+** and rising—funds already budget for fast, unique data. Our **first‑beach** is U.S. energy/commodities funds, utilities/ISOs, and large ag.

**Chart:** *TAM / SAM / SOM (donut or stacked bars)*  
- **TAM (global weather services):** **$2.7B** today (growing ~7% CAGR).  
- **SAM (our initial buyers):** **~$150–300M** (e.g., ~200 logos × $150k avg).  
- **SOM (Year‑1/2 goal):** **$2–6M ARR** (10–25 logos at Lite/Pro mix).  
- **Footnote on slide:** Sources: market research + bottoms‑up buyer counts.

---

## 7) Competition & our edge
**Landscape (simple table):**  
- **Legacy weather vendors (IBM/The Weather Company, DTN):** broad products, **minutes‑level lag**, portals over streams.  
- **New obs networks (Tomorrow.io, Climavision, Spire):** unique sensors/coverage; **not finance‑first speed packaging**.  
- **Data rails (ICE/Bloomberg):** distribution, **not** weather‑specialized deltas.

**Our edge:** **deterministic speed**, **delta‑first packaging**, **simple stream/API**, **replay**.

---

## 8) What we ship (investor‑friendly)
**Signals (numbers):** HDD/CDD shocks, radar onset/ETA by geofence, lightning bursts (Pro), cloud‑top cooling (Pro).  
**Interfaces:** Live stream (WebSocket/Kafka), REST API, Parquet backfill.  
**Visuals:** Optional tiles to review the event.

**Mini snippet:** `feature, region, value, ts_obs, ts_emit, latency_ms`.

---

## 9) Business model & pricing
**Copy:**  
- **Pilot:** $10–25k/quarter (creditable).  
- **Lite:** $25–100k ARR.  
- **Pro:** $150–250k ARR.  
- **Enterprise:** $300–500k+ (add‑ons: lightning/private radar/ECMWF, on‑prem).

**Chart:** *Ladder* — Pilot → Lite → Pro → Enterprise (bars at ~$40k annualized, $75k, $200k, $400k)

---

## 10) Traction plan & milestones
**Timeline:**  
- **Now → Christmas (3 months):** Ship **SYFE Lite**; 2–4 pilots; try to convert to paid Lite (revenue **attempted but not guaranteed**).  
- **Next 9 months:** Build **SYFE Pro**; dual sites live; Pro pilots → 2+ Pro conversions.

**Chart:** *Simple Gantt* with milestones at Weeks 2 (HRIT live), 6 (Lite pilots), 12 (Q4 pilot conversions), Months 4–6 (GRB sites), Month 9 (Pro pilots), Month 12 (Pro conversions).

---

## 11) Funding ask (pre‑seed for POC only)
**Copy:** Seeking **$200k SAFE for 5%** (pre‑seed) to fund the **3‑month POC**. Includes **~30% buffer** for surprises.  
**Use of funds:** interns + HRIT hardware + cloud/colo + legal + pilot ops.  
**Next raise (if POC succeeds):** fund **Pro build** (dual GRB sites + co‑lo + first premium data partner).

**Chart:** *Use‑of‑funds donut (POC $200k)* — People ~40%, Cloud/Infra ~30%, Hardware ~10%, Legal/Other ~20%.

---

## 12) Team & close
**Copy:** Small, fast, execution‑first. Advisors from markets/ops.  
**Call to action:** Join us as we make weather **tradeable in real time**.

---

### Builder notes (for Claude/Design)
- No p50/p95 on slides; **show times in seconds/minutes** only.  
- Keep charts minimal; label axes clearly; include a tiny “Targets” badge on Slide 5.  
- Use black/white with one accent for key numbers.

