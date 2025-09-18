# SYFE — Investor FAQ (One‑Pager)
*Version: 2025‑09‑18 · Audience: Investors (exec summary)*

**Q: What is SYFE?**  
A: A real‑time weather **data rail** for trading. We turn satellite/radar/model outputs into **numeric deltas** (e.g., HDD/CDD shocks, lightning bursts, radar onset) delivered in **seconds–minutes** with finance‑grade SLAs.

**Q: Who buys first?**  
A: Energy & commodities desks (power, gas, ag/softs), multi‑strats, prop firms. Later: insurers, grid operators, logistics.

**Q: Why now?**  
A: Extreme weather moves markets daily; funds already pay for weather. Cloud + public broadcasts + co‑lo make **deterministic low latency** feasible today.

**Q: What’s the moat?**  
A: (1) **Owned ingest** (GOES GRB, NEXRAD, co‑lo for models) → sub‑2–3 min features. (2) **Delta‑first** packaging (what changed). (3) **Selective priority deals** on high‑impact streams (finance‑vertical, time‑bounded). (4) **Distribution embeds** (be the rail). (5) **Replay/backtests** that lock into quant workflows.

**Q: How fast, exactly? (Targets)**  
A: **Sat/GLM features** p50 ≤ **90s**, p95 ≤ **150s** from observation. **Radar** p50 ≤ **120s**, p95 ≤ **180s**. **Model deltas** ≤ **60s** from publish. Every event carries `ts_obs`, `ts_ingest`, `ts_emit`, `latency_ms`.

**Q: What do you deliver—images or numbers?**  
A: **Numbers first** (features/deltas over WebSocket/Kafka + REST + Parquet). Images (sat/radar tiles) support human review.

**Q: Which networks/data?**  
A: **GOES East/West** (GRB) for satellite + GLM lightning; **NEXRAD** radar; **HRRR/GFS** (models). Optional: **ECMWF/UKM** (accuracy), **lightning/private radar** (precision/coverage). Formats: **netCDF**, **GRIB2**, **GeoTIFF/PMTiles**, **Parquet/JSON**.

**Q: Legal / compliance?**  
A: Receive‑only public broadcasts and licensed feeds; no classified sources. Publish provenance. Pilot/GA SLAs with credits; privacy‑respecting telemetry; on‑prem option.

**Q: How do funds integrate?**  
A: **Stream:** Kafka/NATS (or WebSocket for pilots). **API:** REST for snapshots/replay. **Files:** S3‑style **Parquet** drops. Stable, versioned schemas; 30‑day replay; exactly‑once via idempotent keys.

**Q: What’s the MVP and who is it for?**  
A: **SYFE Lite:** HRRR deltas + NEXRAD nowcasts + GOES HRIT loops (demo/backup). Sells to mid‑tier funds/utilities/ag; top‑tier treats as POC.

**Q: What unlocks tier‑one funds?**  
A: **SYFE Pro:** full **GOES GRB** ingest (31 Mbps), dual sites, co‑lo near model mirrors; deterministic p50/p95; optional lightning/private radar. That’s when we convert Citadel‑class buyers.

**Q: Pricing?**  
A: Pilots **$10–25k/quarter** (creditable). Pro **$150–250k ARR**. Enterprise **$300–500k+ ARR** with add‑ons (lightning/private radar/ECMWF, on‑prem, custom endpoints).

**Q: Timeline to revenue?**  
A: **6–8 weeks** to SYFE Lite pilots. **3–4 months** to GRB‑backed Pro pilots; **5–6 months** to tier‑one conversions with latency receipts.

**Q: Competition?**  
A: IBM/DTN/MetDesk (broad), CWG/StormVista/Speedwell (forecasts), ICE/Bloomberg (distribution), Tomorrow.io/Climavision/Spire (unique obs). We win on **latency + deltas + packaging**, and by composing selective premium streams.

**Q: What about house‑level imagery?**  
A: Weather sats (GOES) aren’t parcel‑resolution. We overlay latest orthophotos now; later, integrate **commercial EO** (Maxar/Planet/SAR) for post‑event verification—separate add‑on.

**Q: Key risks & mitigations?**  
A: Bundling by giants (embed as their rail), data policy shifts (diversify/licensed mix), outages (redundant sites, SLAs), cost creep (feature pre‑filtering; hot/cold tiers).

**Q: Use of funds (pre‑seed reference)?**  
A: Two U.S. receiver sites + co‑lo, one priority stream, convert 2 pilots → ARR. Lean: $650–900k; Recommended: **$1.3–1.5M**; Aggressive: $2.0–2.2M.

