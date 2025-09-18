# SYFE — Ground Reception & Networks Plan (HRIT→GRB, Radar/Models, International)
*Version: 2025‑09‑18 · Owner: Eng/Ops*

> Consolidates receiver site design (hobbyist HRIT → pro GRB), BOMs, install/permits, radar/model ingest, and expansion paths (EUMETCast/HimawariCast). Includes costs and risks.

---

## 1) Architecture at a glance
- **Phase 1 (POC):** 1× HRIT node (L‑band ~1694 MHz) → PNG/JPEG loops. Radar/HRRR over network.  
- **Phase 2 (Pro):** 2× GRB sites (East/West) → ABI L1b netCDF + GLM; co‑lo near cloud mirrors for radar/models.

---

## 2) HRIT node (POC) — BOM & cost
**Capex (one node)**  
- 1.0–1.2 m dish + mount: **$300–$800**  
- LNA/LNB + SAW filter: **$150–$400**  
- SDR (Airspy/RSP class): **$200–$800**  
- Decode PC (mini‑server): **$500–$1,500**  
- Cables, grounding, lightning kit: **$150–$300**  
- **Total:** **$1.3k–$3.8k**

**Output**: HRIT frames (PNG/JPEG) + EMWIN text. Use for dashboards; not for quantitative sat features.

---

## 3) GRB site (Pro) — BOM, cost & install
**Capex (per site, DIY)**  
- 2.4–3.8 m dish + mount (motorized not required): **$20k–$60k**  
- LNAs/filters + DVB‑S2/GRB demod: **$10k–$20k**  
- Decode servers (dual): **$15k–$30k**  
- Racks/UPS/environmental: **$5k–$10k**  
- Install (crane, concrete, labor, permits): **$15k–$30k**  
- **Total per site:** **$60k–$150k** (typical **$60k–$120k**)

**Opex (per site)**  
- Site lease/power/insurance: **$2k–$6k/mo**  
- Bandwidth/cross‑connects: **$1k–$3k/mo**  
- Maintenance/spares/monitoring: **$1k–$3k/mo**  
- **Total per site:** **$4k–$12k/mo**

**Install playbook**  
1) Site survey: horizon, RFI, roof load, grounding path.  
2) Permits/approvals: landlord, structural, electrical.  
3) Pour pad or roof mounts; lightning protection.  
4) Align to GOES‑E/W; validate MER/SNR.  
5) Bring up demod/decoder; integrate to feature engine.  
6) Synthetic failover tests (fiber cut, power fail).

**Output**: ABI L1b (16 bands, netCDF), GLM events, L2 products. Basis for quantitative features.

---

## 4) Site selection & redundancy
- East + West (or East + Central) to cover GOES‑E/W with geographic diversity.  
- Dual ISPs; UPS + generator ready.  
- GPSDO/PTP time sync; NTP fallback.

---

## 5) Radar & models (network ingest)
- **NEXRAD Level II/III:** S3/SNS watcher; parse, composite, advect; emit `radar_onset/eta`.  
- **HRRR/GFS:** Parallel chunk fetch at publish; compute `hdd/cdd/precip/wind` deltas; push within ≤60s.  
- **Co‑lo** near cloud mirrors; PrivateLink/peering for short paths.

---

## 6) International expansion
- **EUMETCast** (EU/AF) via satellite broadcast → requires registration/keys; dish + DVB receiver + PC.  
- **HimawariCast** (APAC) for JMA imagery (10‑min FD).  
- Optional later: **GK‑2A** (KMA) HRIT/UHRIT; regional operations.

---

## 7) Legal/permits (receive‑only)
- No FCC transmit license; follow local building/structural/electrical codes.  
- Vendor T&Cs for EUMETCast/HimawariCast keys.  
- Document provenance and license scope for all feeds.

---

## 8) Risks & mitigations
- **Wind/ice damage** → overspec mounts, inspections, spares.  
- **RFI/interference** → filters, site selection, spectrum survey.  
- **Network congestion** → cross‑connects, QoS, regional compute.  
- **Decoder faults** → hot spare servers; watchdog restarts.  
- **Policy changes** → diversify feed mix; alternative mirrors.

---

## 9) Budget summary (year 1)
- **Capex (2 GRB sites):** **$120k–$260k** DIY (or **$300k–$500k** turnkey both).  
- **Opex (2 sites + co‑lo + cloud):** **$31k–$51k/mo** (=$372k–$612k/yr).  
- **HRIT POC:** **$1.3k–$3.8k** capex; cloud **$2k–$5k/mo** frugal.

