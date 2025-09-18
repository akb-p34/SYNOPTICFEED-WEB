# SYFE — Pilot Playbook & SLA Pack
*Version: 2025‑09‑18 · Owner: GTM/Eng*

> Purpose: Run 90‑day design‑partner pilots that prove latency, integration, and P&L relevance—then convert to ARR. Includes scope, metrics, receipts method, onboarding, incident comms, and a lite MSA/SLA outline.

---

## 1) Pilot objectives (90 days)
- **Latency proof:** hit targets (Sat p50≤90s/p95≤150s; Radar p50≤120s/p95≤180s; Models ≤60s publish→delta).  
- **Integration:** client consumes stream + API; replay works; idempotent processing verified.  
- **Impact:** 2–3 **event studies** showing ≥5–10 min lead vs client’s status quo.

**Deliverables**  
- Live stream endpoint + Postman collection.  
- Weekly latency report + incident log.  
- Event study notebooks + Parquet bundle.  
- End‑of‑pilot ROI memo.

---

## 2) Scope & features (pilot menu)
- **Core deltas:** HDD/CDD (regional), precip/wind/solar, radar onset/ETA, tropical track/intensity deltas.  
- **Visuals:** GOES/NEXRAD tiles for context.  
- **Optional:** GLM bursts (if GRB live); ECMWF deltas (if licensed).

---

## 3) Success criteria → conversion
- ≥ 2 weeks on‑target SLOs.  
- ≥ 2 event studies with measurable P&L relevance or operational value.  
- Integration checklist completed (below).  
- **Convert:** Pro $150–250k ARR (Enterprise $300–500k+ with add‑ons).

---

## 4) Integration checklist (client‑side)
- Network path: PrivateLink/peering/cross‑connect validated.  
- Auth: service account + mTLS or OAuth2.  
- Stream: ordering/partitioning confirmed; dedup keys respected.  
- Replay: 30‑day window fetch tested.  
- Monitoring: client dashboards show our latency/uptime topics.

---

## 5) Latency receipts — methodology
- Each message carries `ts_obs`, `ts_ingest`, `ts_emit`, `latency_ms`.  
- Server signs hourly digest (HMAC); publish to `/receipts`.  
- Weekly histogram (p50/p95) per feature/region; outlier drill‑downs.  
- Independent verification: client timestamps on receipt for round‑trip analysis.

---

## 6) Incident management
- **Sev1 (market hours):** < 15 min comms, hourly updates, RCA in 48h. Credit per SLA grid.  
- **Sev2:** < 60 min comms, daily updates, RCA in 5 days.  
- Status page with current SLOs; customer Slack/Bridge on request.

---

## 7) Light MSA/SLA outline (pilot)
- **Uptime:** 99.9% pilot; maintenance windows pre‑announced.  
- **Latency targets:** as above; credits for p95 misses on sustained basis.  
- **Data rights:** broadcast + licensed feeds only; no redistribution beyond client org.  
- **Privacy:** opt‑in telemetry; purge on request; logs retained 30 days.  
- **Termination:** either party with 14 days notice; handover of data collected.

---

## 8) Event study template
- **Setup:** market, contract (e.g., NG1), date/time window, regions.  
- **Signal:** which delta (e.g., HDD shock), magnitude/units.  
- **Timing:** SYFE emit time; competing/pubic availability time.  
- **Outcome:** price move, entry/exit logic, P&L.  
- **Controls:** alternative signals, null days.  
- **Artifacts:** chart image, notebook, Parquet slice.

---

## 9) Communication plan
- **T‑0:** pilot kickoff + integration brief.  
- **Weekly:** latency + ingest report (bullets).  
- **Monthly:** event‑study deep dive.  
- **T‑90:** conversion meeting; present ROI memo + SLA proposal.

