// SynopticFeed demo data — representative, clearly illustrative
// All values are synthetic for the demo and should not be confused with real market data.

window.SF_DATA = {
  isos: [
    { code: "CAISO",  name: "California ISO",      status: "yellow", alerts: 2, zones: 4 },
    { code: "SPP",    name: "Southwest Power Pool", status: "green",  alerts: 0, zones: 3 },
    { code: "ERCOT",  name: "Electric Reliability Council of Texas", status: "red",    alerts: 3, zones: 6 },
    { code: "MISO",   name: "Midcontinent ISO",    status: "yellow", alerts: 1, zones: 5 },
    { code: "PJM",    name: "PJM Interconnection", status: "red",    alerts: 2, zones: 7 },
    { code: "NYISO",  name: "New York ISO",        status: "green",  alerts: 0, zones: 4 },
    { code: "ISO-NE", name: "ISO New England",     status: "yellow", alerts: 1, zones: 3 }
  ],

  alerts: [
    {
      id: "SF-24A71",
      ts: "8:50 AM CT",
      iso: "ERCOT",
      zone: "HOUSTON, TX",
      metric: "Clouds 34% thicker than forecast",
      detail: "GFS forecast said clouds would clear by 7 AM. Our satellite shows they haven't. Solar power will come on ~90 minutes late.",
      vendor: "GFS",
      confidence: "HIGH",
      sev: "red",
      divergence_pct: 34,
      contract_impact_mwh: 1280
    },
    {
      id: "SF-24A68",
      ts: "8:41 AM CT",
      iso: "PJM",
      zone: "DOMINION · PJM",
      metric: "Temperature 4.2°F colder than forecast",
      detail: "CWG forecast said it would be warmer than it actually is. About 340 MW more power is needed than planned.",
      vendor: "CWG",
      confidence: "HIGH",
      sev: "red",
      divergence_pct: 22,
      contract_impact_mwh: 820
    },
    {
      id: "SF-24A66",
      ts: "8:33 AM CT",
      iso: "PJM",
      zone: "AEP · PJM",
      metric: "Wind 18% below forecast",
      detail: "DTN's forecast said wind would ramp up early. Ground readings show winds are still slow across Ohio and Indiana nodes.",
      vendor: "DTN",
      confidence: "MEDIUM",
      sev: "yellow",
      divergence_pct: 18,
      contract_impact_mwh: 540
    },
    {
      id: "SF-24A65",
      ts: "8:29 AM CT",
      iso: "CAISO",
      zone: "SP15 · CAISO",
      metric: "Clouds 12% thicker than forecast",
      detail: "Coastal clouds aren't burning off as the forecast said. Utility-scale solar ramp rate tracking 14% below forecast.",
      vendor: "NWS",
      confidence: "MEDIUM",
      sev: "yellow",
      divergence_pct: 12,
      contract_impact_mwh: 310
    },
    {
      id: "SF-24A62",
      ts: "8:18 AM CT",
      iso: "MISO",
      zone: "MICHIGAN · MISO",
      metric: "Temperature 2.1°F warmer than forecast",
      detail: "DTN's forecast is cool in lower Michigan. Actual load running warm.",
      vendor: "DTN",
      confidence: "MEDIUM",
      sev: "yellow",
      divergence_pct: 9,
      contract_impact_mwh: 190
    },
    {
      id: "SF-24A60",
      ts: "8:15 AM CT",
      iso: "ERCOT",
      zone: "NORTH TX · ERCOT",
      metric: "Wind 9% above forecast",
      detail: "Observed hub winds above GFS forecast. Wind generation running ahead of schedule.",
      vendor: "GFS",
      confidence: "LOW",
      sev: "yellow",
      divergence_pct: 9,
      contract_impact_mwh: 140
    },
    {
      id: "SF-24A58",
      ts: "8:04 AM CT",
      iso: "ISO-NE",
      zone: "BOSTON · ISO-NE",
      metric: "Temperature 1.6°F colder than forecast",
      detail: "CWG forecast cool in Boston metro. Net load delta is small.",
      vendor: "CWG",
      confidence: "LOW",
      sev: "yellow",
      divergence_pct: 6,
      contract_impact_mwh: 80
    }
  ],

  positions: [
    { id: "HB_HOUSTON.DA.07", iso: "ERCOT", zone: "HOUSTON", direction: "LONG",  mw: 120, hours: "HE07-HE10", markp: 68.40, pnl: -142800, exposure: "high" },
    { id: "DOM.DA.17",        iso: "PJM",   zone: "DOM",     direction: "SHORT", mw: 80,  hours: "HE17-HE20", markp: 54.10, pnl: -48200,  exposure: "high" },
    { id: "AEP.DA.19",        iso: "PJM",   zone: "AEP",     direction: "LONG",  mw: 50,  hours: "HE18-HE22", markp: 41.20, pnl: -6100,   exposure: "med"  },
    { id: "SP15.DA.13",       iso: "CAISO", zone: "SP15",    direction: "SHORT", mw: 60,  hours: "HE13-HE16", markp: 37.80, pnl:  9400,   exposure: "med"  },
    { id: "NORTH.DA.00",      iso: "ERCOT", zone: "NORTH",   direction: "LONG",  mw: 40,  hours: "HE22-HE02", markp: 29.60, pnl:  3200,   exposure: "low"  },
    { id: "ZONE-J.RT.BLK",    iso: "NYISO", zone: "ZONE-J",  direction: "SHORT", mw: 25,  hours: "PEAK",      markp: 62.15, pnl:  1800,   exposure: "low"  },
    { id: "MASS-HUB.DA.18",   iso: "ISO-NE",zone: "MASS-HUB",direction: "LONG",  mw: 35,  hours: "HE17-HE20", markp: 45.30, pnl:  -400,   exposure: "low"  }
  ],

  scorecard: [
    { vendor: "NWS", iso: "ALL",   pct: 91, trend: "up",   band: "green"  },
    { vendor: "GFS", iso: "ERCOT", pct: 63, trend: "down", band: "red"    },
    { vendor: "CWG", iso: "PJM",   pct: 68, trend: "down", band: "red"    },
    { vendor: "DTN", iso: "MISO",  pct: 79, trend: "flat", band: "yellow" },
    { vendor: "ECMWF",   iso: "ALL",   pct: 88, trend: "up",   band: "green"  }
  ],

  // Chart: 4 hours of data, 5-min cadence = 49 points
  chart: (function() {
    const pts = 49;
    const data = [];
    for (let i = 0; i < pts; i++) {
      const t = i / (pts - 1); // 0..1
      // Forecast: smooth solar ramp from 320 → 1140 MW
      const forecast = 320 + 820 * Math.pow(t, 0.7);
      // Observation: starts close, diverges after ~45% of window (marine stratus)
      let obs;
      if (t < 0.45) {
        obs = forecast + (Math.sin(i * 0.6) * 8 - 4);
      } else {
        // Stalls — ramp 35% slower than forecast
        const stallStart = 320 + 820 * Math.pow(0.45, 0.7);
        obs = stallStart + (820 * Math.pow(t, 0.7) - 820 * Math.pow(0.45, 0.7)) * 0.58 + (Math.sin(i*0.7)*10);
      }
      data.push({ t: i, forecast: Math.round(forecast), obs: Math.round(obs) });
    }
    return data;
  })(),

  // Timestamps for chart — 4-hour window in CT, 5-min cadence. Alarm fires near index 22 (≈ 8:45 AM CT).
  chartTimes: (function() {
    const out = [];
    // Start at 7:00 AM CT, end at 11:00 AM CT. Index 22 = 8:50 AM CT (alarm fire moment).
    let h = 7, m = 0; // 24-hour format, CT
    for (let i = 0; i < 49; i++) {
      const hh = h % 24;
      const suffix = hh === 0 || hh === 12 ? (hh === 0 ? 'AM' : 'PM') : (hh > 12 ? 'PM' : 'AM');
      const h12 = hh === 0 ? 12 : (hh > 12 ? hh - 12 : hh);
      out.push(String(h12) + ':' + String(m).padStart(2, '0') + ' ' + suffix);
      m += 5;
      if (m >= 60) { m -= 60; h++; }
    }
    return out;
  })(),

  // Four per-scenario drills, keyed by scenario code. State.detailTarget points at one of these.
  // drill (legacy) points at ERCOT_HOUSTON for back-compat with older callers.
  drills: {
    PJM_DOM: {
      id: "SF-24A68",
      breadcrumbs: { region: "MID-ATLANTIC (PJM)", zone: "DOMINION" },
      title: "DOMINION: THE FORECAST IS RUNNING WARM",
      hero: "Forecast divergence detected. Dominion, PJM. Temperature is 4.2°F colder than the forecast said. Your day-ahead load positions are under-covered. Confidence: HIGH.",
      heroSegments: [
        { t: "Forecast divergence detected. " },
        { t: "Dominion, PJM.", c: "hero-zone" },
        { t: " Temperature is " },
        { t: "4.2°F colder", c: "hero-delta" },
        { t: " than the forecast said. Your " },
        { t: "day-ahead load positions", c: "hero-contract" },
        { t: " are under-covered. Confidence: " },
        { t: "HIGH", c: "hero-conf-hi" },
        { t: "." }
      ],
      fired: "8:41 AM CT",
      vendor: "CWG",
      confidence: "HIGH",
      divergence: "+22%",
      exposure: "$1.08M",
      zones_affected: 3,
      contracts_affected: 2,
      timeline: [
        { ts: "8:06 AM CT", sev: "lo", msg: "Temperature readings running ~1.4°F colder than CWG forecast across Dominion.", note: "Within tolerance. Confidence LOW. Watching." },
        { ts: "8:18 AM CT", sev: "md", msg: "Gap widening to 2.8°F. Dominion load starting to track above plan.", note: "Confidence MEDIUM. On the watchlist." },
        { ts: "8:30 AM CT", sev: "md", msg: "Three frames confirm the cold bias. Confidence upgraded MED → HIGH.", note: "Sustained across three consecutive 5-min obs." },
        { ts: "8:41 AM CT", sev: "hi", msg: "ALARM — gap hit 4.2°F. Your 80 MW Dominion 5 PM short is losing about $9K per minute.", note: "Impact estimate dispatched. 2 contracts flagged." },
        { ts: "8:48 AM CT", sev: "hi", msg: "Recommendation — consider unwinding 30 MW of the short before 1:00 AM CT, when the grid re-runs.", note: "~12 minutes until the next update." }
      ],
      contracts: [
        { id: "DOM.DA.17", mw: 80, hr: "HE17-HE20", mark: 54.10, expected: 62.80, impact: -696000 },
        { id: "DOM.DA.19", mw: 50, hr: "HE19-HE22", mark: 49.40, expected: 56.10, impact: -335000 },
        { id: "DOM.RT.18", mw: 20, hr: "HE18-HE19", mark: 71.20, expected: 68.40, impact:  +56000 }
      ],
      closeMW: 30,
      closeContract: "DOM.DA.17",
      predictedLoss: "$975K",
      realizedIfLocked: "$380K"
    },
    ERCOT_NORTH: {
      id: "SF-24A60",
      breadcrumbs: { region: "TEXAS GRID (ERCOT)", zone: "NORTH HUB" },
      title: "NORTH TEXAS: WIND ARRIVED EARLY",
      hero: "Forecast divergence detected. North Texas, ERCOT. Wind is 9% above the forecast. Your short wind positions are exposed. Confidence: MEDIUM.",
      heroSegments: [
        { t: "Forecast divergence detected. " },
        { t: "North Texas, ERCOT.", c: "hero-zone" },
        { t: " Wind is " },
        { t: "9% above", c: "hero-delta" },
        { t: " the forecast. Your " },
        { t: "short wind positions", c: "hero-contract" },
        { t: " are exposed. Confidence: " },
        { t: "MEDIUM", c: "hero-conf-md" },
        { t: "." }
      ],
      fired: "8:11 AM CT",
      vendor: "GFS",
      confidence: "MEDIUM",
      divergence: "+9%",
      exposure: "$182K",
      zones_affected: 2,
      contracts_affected: 2,
      timeline: [
        { ts: "7:40 AM CT", sev: "lo", msg: "North Texas hub winds tracking slightly above GFS forecast.", note: "Small gap. Confidence LOW." },
        { ts: "7:52 AM CT", sev: "lo", msg: "Wind +5%. Generation running marginally ahead of schedule.", note: "Still within tolerance." },
        { ts: "8:01 AM CT", sev: "md", msg: "Gap widening to +7%. Two consecutive frames agree — confidence bumped.", note: "Confidence MEDIUM." },
        { ts: "8:11 AM CT", sev: "hi", msg: "ALARM — wind is 9% above forecast. Your 40 MW North long and 25 MW Zone-J short both moving.", note: "Impact estimate dispatched." },
        { ts: "8:18 AM CT", sev: "hi", msg: "Recommendation — consider holding the long, lightening the Zone-J short by 10 MW before 8:30 AM CT.", note: "~12 minutes until real-time re-dispatch." }
      ],
      contracts: [
        { id: "NORTH.DA.00", mw: 40, hr: "HE22-HE02", mark: 29.60, expected: 26.80, impact:  +112000 },
        { id: "ZONE-J.RT.BLK", mw: 25, hr: "PEAK", mark: 62.15, expected: 58.40, impact:  -94000 },
        { id: "HB_N.DA.23",    mw: 30, hr: "HE23-HE02", mark: 33.10, expected: 31.20, impact:  +57000 }
      ],
      closeMW: 10,
      closeContract: "ZONE-J.RT.BLK",
      predictedLoss: "$182K",
      realizedIfLocked: "$64K"
    },
    CAISO_SP15: {
      id: "SF-24A65",
      breadcrumbs: { region: "CALIFORNIA (CAISO)", zone: "SP15" },
      title: "SOUTHERN CAL: THE MARINE LAYER IS STICKY",
      hero: "Forecast divergence detected. SP15, California. Coastal clouds are 12% thicker than the forecast. Solar generation is running 14% below plan. Confidence: MEDIUM.",
      heroSegments: [
        { t: "Forecast divergence detected. " },
        { t: "SP15, California.", c: "hero-zone" },
        { t: " Coastal clouds are " },
        { t: "12% thicker", c: "hero-delta" },
        { t: " than the forecast. " },
        { t: "Solar generation", c: "hero-contract" },
        { t: " is running 14% below plan. Confidence: " },
        { t: "MEDIUM", c: "hero-conf-md" },
        { t: "." }
      ],
      fired: "8:29 AM CT",
      vendor: "NWS",
      confidence: "MEDIUM",
      divergence: "+12%",
      exposure: "$410K",
      zones_affected: 2,
      contracts_affected: 2,
      timeline: [
        { ts: "7:58 AM CT", sev: "lo", msg: "Coastal clouds holding past forecasted burn-off time.", note: "Small gap. Confidence LOW." },
        { ts: "8:10 AM CT", sev: "lo", msg: "Gap widening to +6%. Solar ramp tracking 4% below plan.", note: "Watching." },
        { ts: "8:20 AM CT", sev: "md", msg: "Three frames confirm the marine layer is stuck. Confidence MED.", note: "Added to watchlist." },
        { ts: "8:29 AM CT", sev: "hi", msg: "ALARM — coastal clouds are 12% thicker than forecast. Your 60 MW SP15 short is starting to bleed.", note: "Impact estimate dispatched. 2 contracts flagged." },
        { ts: "8:36 AM CT", sev: "hi", msg: "Recommendation — consider lightening the SP15 short by 20 MW before the next ISO re-run.", note: "~16 minutes until real-time dispatch re-runs." }
      ],
      contracts: [
        { id: "SP15.DA.13", mw: 60, hr: "HE13-HE16", mark: 37.80, expected: 31.60, impact: -372000 },
        { id: "NP15.DA.14", mw: 40, hr: "HE14-HE16", mark: 41.20, expected: 37.10, impact: -164000 },
        { id: "SP15.RT.15", mw: 20, hr: "HE15-HE16", mark: 56.40, expected: 52.80, impact:  +72000 }
      ],
      closeMW: 20,
      closeContract: "SP15.DA.13",
      predictedLoss: "$464K",
      realizedIfLocked: "$160K"
    },

    MISO_CENTRAL: {
      id: "SF-24A66",
      breadcrumbs: { region: "MIDWEST (MISO)", zone: "CENTRAL" },
      title: "MIDWEST: STORM ARRIVING EARLY",
      hero: "Forecast divergence detected. MISO Central. Thunderstorms are 4 hours ahead of schedule. Your wind and temperature positions are exposed. Confidence: HIGH.",
      heroSegments: [
        { t: "Forecast divergence detected. " },
        { t: "MISO Central.", c: "hero-zone" },
        { t: " Thunderstorms are " },
        { t: "4 hours ahead", c: "hero-delta" },
        { t: " of schedule. Your " },
        { t: "wind and temperature positions", c: "hero-contract" },
        { t: " are exposed. Confidence: " },
        { t: "HIGH", c: "hero-conf-hi" },
        { t: "." }
      ],
      fired: "8:33 AM CT",
      vendor: "DTN",
      confidence: "HIGH",
      divergence: "+18%",
      exposure: "$540K",
      zones_affected: 3,
      contracts_affected: 3,
      timeline: [
        { ts: "8:02 AM CT", sev: "lo", msg: "Radar picks up convective activity 2 hours ahead of DTN forecast.", note: "Small deviation. Confidence LOW." },
        { ts: "8:15 AM CT", sev: "md", msg: "Storm front moving faster than expected. Wind ramping early.", note: "Confidence MEDIUM. Watchlist." },
        { ts: "8:24 AM CT", sev: "md", msg: "Three frames confirm the advance. Wind tracking 14% below forecast in downstream zones.", note: "Confidence upgraded MED → HIGH." },
        { ts: "8:33 AM CT", sev: "hi", msg: "ALARM — storm is now 4 hours ahead of the forecast. Your 50 MW AEP long is losing about $6K per minute.", note: "Impact estimate dispatched. 3 contracts flagged." },
        { ts: "8:40 AM CT", sev: "hi", msg: "Recommendation — consider closing the AEP long entirely before 1:00 AM CT.", note: "~20 minutes until the next ISO re-run." }
      ],
      contracts: [
        { id: "AEP.DA.19", mw: 50, hr: "HE18-HE22", mark: 41.20, expected: 47.10, impact: -295000 },
        { id: "IND-HUB.DA.16", mw: 40, hr: "HE16-HE19", mark: 38.80, expected: 43.60, impact: -192000 },
        { id: "AEP.RT.18", mw: 20, hr: "HE18-HE19", mark: 58.10, expected: 54.60, impact:  +70000 }
      ],
      closeMW: 25,
      closeContract: "AEP.DA.19",
      predictedLoss: "$417K",
      realizedIfLocked: "$145K"
    }
  },

  // Alert drill-down example: ERCOT / HOUSTON — also aliased as drills.ERCOT_HOUSTON below.
  drill: {
    id: "SF-24A71",
    breadcrumbs: { region: "TEXAS GRID (ERCOT)", zone: "HOUSTON" },
    title: "HOUSTON: THE SOLAR FORECAST JUST BROKE",
    hero: "Forecast divergence detected. Houston, Texas. Clouds are 34% thicker than the forecast said. Your day-ahead solar positions are exposed. Confidence: HIGH.",
    heroSegments: [
      { t: "Forecast divergence detected. " },
      { t: "Houston, Texas.", c: "hero-zone" },
      { t: " Clouds are " },
      { t: "34% thicker", c: "hero-delta" },
      { t: " than the forecast said. Your " },
      { t: "day-ahead solar positions", c: "hero-contract" },
      { t: " are exposed. Confidence: " },
      { t: "HIGH", c: "hero-conf-hi" },
      { t: "." }
    ],
    fired: "8:50 AM CT",
    vendor: "GFS",
    confidence: "HIGH",
    divergence: "+34%",
    exposure: "$2.22M",
    zones_affected: 4,
    contracts_affected: 3,
    timeline: [
      { ts: "8:15 AM CT", sev: "lo", msg: "Clouds are 8% thicker than forecast. Small gap. Low confidence. Watching.", note: "Within tolerance. No action yet." },
      { ts: "8:24 AM CT", sev: "md", msg: "Gap widening to 17%. Your Houston solar long is starting to look exposed.", note: "Confidence MEDIUM. Added to watchlist." },
      { ts: "8:33 AM CT", sev: "md", msg: "Satellite confirms the clouds aren't clearing. Three checks in a row agree — confidence now HIGH.", note: "Three consecutive 5-min frames. Confidence upgraded MED → HIGH." },
      { ts: "8:50 AM CT", sev: "hi", msg: "ALARM — gap hit 34%. Your 120 MW Houston 7 AM long is losing about $14K per minute.", note: "Impact estimate dispatched. 3 contracts flagged." },
      { ts: "8:51 AM CT", sev: "hi", msg: "Recommendation — consider reducing long by 60 MW before 1:00 AM CT, when the grid updates its forecast.", note: "About 9 minutes until the next update. Your window to rebalance is narrow." }
    ],
    contracts: [
      { id: "HB_HOUSTON.DA.07", mw: 120, hr: "HE07-HE10", mark: 68.40, expected: 54.20, impact: -1704000 },
      { id: "HB_HOUSTON.DA.09", mw:  60, hr: "HE09-HE11", mark: 72.10, expected: 61.90, impact:  -612000 },
      { id: "HB_HOUSTON.RT.08", mw:  20, hr: "HE08-HE09", mark: 89.50, expected: 94.20, impact:   +94000 }
    ],
    closeMW: 60,
    closeContract: "HB_HOUSTON.DA.07",
    predictedLoss: "$2.22M",
    realizedIfLocked: "$900K"
  },

  // (backfill) alias ERCOT_HOUSTON to the legacy drill object defined above.
  // Done at the bottom so drills is already initialized.
  _init: (function() { /* placeholder anchor for alias — the IIFE patches this after DATA is built. */ return true; })(),

  archive: [
    { id: "SF-22D14", ts: "2022-12-22 10:30 PM CT", event: "Elliott Arctic Blast", iso: "PJM",   metric: "Temp 11.4°F colder than forecast", conf: "HIGH",   res: "Confirmed", impact: -8420000 },
    { id: "SF-22D09", ts: "2022-12-22 05:15 PM CT", event: "Pre-Elliott temp collapse", iso: "MISO", metric: "Temp 7.8°F colder than forecast", conf: "HIGH", res: "Confirmed", impact: -2100000 },
    { id: "SF-23F02", ts: "2023-02-14 08:02 AM CT", event: "ERCOT cold snap", iso: "ERCOT", metric: "Load 2.1 GW above forecast", conf: "HIGH",  res: "Confirmed", impact: -1840000 },
    { id: "SF-23M17", ts: "2023-05-09 04:48 PM CT", event: "CAISO solar over-forecast", iso: "CAISO", metric: "Solar 890 MW below forecast", conf: "MEDIUM", res: "Confirmed", impact:  -410000 },
    { id: "SF-23J04", ts: "2023-07-12 02:33 PM CT", event: "TX wind ramp miss",    iso: "ERCOT", metric: "Wind 1.2 GW below forecast", conf: "HIGH", res: "Confirmed", impact: -2030000 },
    { id: "SF-23A09", ts: "2023-08-04 10:17 AM CT", event: "PJM heat-dome spike",  iso: "PJM",   metric: "Temp 3.9°F above forecast", conf: "MEDIUM", res: "Confirmed", impact:  -680000 },
    { id: "SF-23S22", ts: "2023-09-19 05:44 AM CT", event: "False alarm — sensor glitch", iso: "MISO",  metric: "Clouds 42% thicker", conf: "LOW", res: "False",      impact:        0 },
    { id: "SF-23O11", ts: "2023-10-03 07:12 AM CT", event: "NE coastal fog",      iso: "ISO-NE", metric: "Clouds 21% thicker", conf: "MEDIUM", res: "Confirmed", impact:  -215000 },
    { id: "SF-24A14", ts: "2024-01-17 8:02 AM CT", event: "Midwest wind bust",   iso: "MISO",   metric: "Wind 820 MW below forecast", conf: "HIGH", res: "Confirmed", impact:  -940000 },
    { id: "SF-24M03", ts: "2024-03-11 12:33 PM CT", event: "CA marine layer",     iso: "CAISO", metric: "Clouds 18% thicker", conf: "MEDIUM", res: "Confirmed", impact:  -180000 }
  ]
};

// Backfill drills.ERCOT_HOUSTON from the legacy drill object so per-scenario routing has all four keys.
if (window.SF_DATA && window.SF_DATA.drill && window.SF_DATA.drills) {
  window.SF_DATA.drills.ERCOT_HOUSTON = window.SF_DATA.drill;
}

// Per-scenario chart datasets — each storm gets a distinct forecast-vs-actual curve.
(function() {
  function gen(opts) {
    const pts = 49;
    const data = [];
    const fExp = opts.fExp || 0.7;
    for (let i = 0; i < pts; i++) {
      const t = i / (pts - 1);
      const forecast = opts.base + opts.range * Math.pow(t, fExp);
      let obs;
      if (t < opts.divStart) {
        obs = forecast + (Math.sin(i * 0.6) * opts.noise - opts.noise / 2);
      } else {
        const ref = opts.base + opts.range * Math.pow(opts.divStart, fExp);
        const slope = (forecast - ref) * opts.divMult;
        obs = ref + slope + Math.sin(i * 0.7) * opts.noise;
      }
      data.push({ t: i, forecast: Math.round(forecast), obs: Math.round(obs) });
    }
    return data;
  }
  if (window.SF_DATA) {
    window.SF_DATA.charts = {
      ERCOT_HOUSTON: gen({ base: 320, range: 820, divStart: 0.45, divMult: 0.58, fExp: 0.7,  noise: 10 }),  // solar stall
      PJM_DOM:       gen({ base: 380, range: 260, divStart: 0.40, divMult: 1.55, fExp: 0.95, noise: 14 }),  // load way above forecast
      ERCOT_NORTH:   gen({ base: 620, range: 420, divStart: 0.35, divMult: 1.48, fExp: 0.85, noise: 22 }),  // wind sharply above forecast
      CAISO_SP15:    gen({ base: 300, range: 560, divStart: 0.50, divMult: 0.60, fExp: 0.65, noise: 12 }),  // solar stalls harder
      MISO_CENTRAL:  gen({ base: 560, range: 420, divStart: 0.50, divMult: 0.35, fExp: 0.9,  noise: 28 })   // storm crashes output
    };
  }
})();
