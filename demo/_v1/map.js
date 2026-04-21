// ISO map — US with recognizable CONUS outline + stylized ISO polygons
(function() {
  // viewBox 0 0 960 540. CONUS fills roughly x:60..900, y:110..430
  // ISO polygons positioned over real geography.
  const REGIONS = {
    CAISO: {
      // West coast (California)
      points: "110,200 145,185 165,230 170,295 155,340 125,355 100,325 95,270 100,230",
      labelX: 132, labelY: 275, pulseX: 140, pulseY: 240
    },
    SPP: {
      // Great Plains: ND/SD/NE/KS/OK/TX panhandle
      points: "340,180 440,170 455,230 460,310 440,360 380,365 355,320 335,250",
      labelX: 395, labelY: 275, pulseX: 400, pulseY: 240
    },
    ERCOT: {
      // Texas
      points: "370,365 460,365 490,410 480,450 410,465 360,430 355,390",
      labelX: 420, labelY: 415, pulseX: 430, pulseY: 395
    },
    MISO: {
      // Upper Midwest down to LA: MN/IA/IL/MO/AR/LA/MI
      points: "460,170 560,160 590,215 600,295 560,345 490,345 465,270",
      labelX: 525, labelY: 255, pulseX: 525, pulseY: 230
    },
    PJM: {
      // Mid-Atlantic: OH/WV/VA/PA/MD/NJ/DE/DC
      points: "600,195 720,190 745,235 725,290 660,305 615,280 605,240",
      labelX: 675, labelY: 245, pulseX: 685, pulseY: 225
    },
    NYISO: {
      // New York
      points: "735,155 790,150 800,190 755,205 730,185",
      labelX: 767, labelY: 180, pulseX: 767, pulseY: 175
    },
    "ISO-NE": {
      // New England
      points: "800,140 855,138 860,180 825,195 800,180",
      labelX: 830, labelY: 165, pulseX: 830, pulseY: 160
    }
  };

  window.SF_MAP = {
    render(containerEl, state) {
      const { isos, selected, onHover, onLeave, onSelect } = state;

      const svg = `
        <svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="fine-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#141414" stroke-width="0.5"/>
            </pattern>
            <pattern id="coarse-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1f1f1f" stroke-width="0.5"/>
            </pattern>
          </defs>

          <rect width="960" height="540" fill="url(#fine-grid)"/>
          <rect width="960" height="540" fill="url(#coarse-grid)"/>

          <!-- CORNER COORDS -->
          <g fill="#606060" font-family="Helvetica Neue" font-size="9" letter-spacing="1">
            <text x="10" y="18">49°N</text>
            <text x="10" y="532">24°N</text>
            <text x="890" y="18" text-anchor="end">66°W</text>
            <text x="70" y="532" text-anchor="end">125°W</text>
          </g>

          <!-- CROSSHAIR -->
          <g stroke="#2e2e2e" stroke-width="0.5" stroke-dasharray="2 4">
            <line x1="0" y1="270" x2="960" y2="270"/>
            <line x1="480" y1="0" x2="480" y2="540"/>
          </g>

          <!-- CONUS outline — recognizable silhouette of the lower 48.
               Diagrammatic trace on the 960x540 viewBox. -->
          <g class="conus">
            <!-- Main landmass -->
            <path fill="rgba(255,255,255,0.035)" stroke="#6a6a6a" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"
                  d="
              M 88,180
              C 90,168 105,158 120,154
              L 160,148 200,142 245,136 290,130 340,126
              L 390,124 440,122 495,122 545,126 600,130
              L 650,134 695,140 735,146
              L 770,148 800,144 830,138 855,134
              C 868,132 875,140 872,152
              L 866,170 858,184
              C 870,188 880,196 884,210
              C 886,226 882,240 874,250
              L 860,258 830,262 800,260 775,254
              C 760,252 748,258 740,270
              L 720,290 695,310 665,325 630,335
              L 590,345 550,355 508,370 470,388
              C 445,400 422,410 400,415
              C 378,418 360,414 345,404
              L 325,388 308,368 295,346 285,322
              L 275,298 265,272 255,244 244,216
              L 230,188 214,164 195,148 172,140 148,144 125,156
              C 110,164 98,172 88,180 Z
            "/>
            <!-- Florida -->
            <path fill="rgba(255,255,255,0.035)" stroke="#6a6a6a" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"
                  d="M 475,418 L 488,448 495,470 491,478 482,475 474,455 470,430 Z"/>

            <!-- Great Lakes (dark voids for recognition) -->
            <g fill="#000" stroke="#3a3a3a" stroke-width="0.8">
              <!-- Lake Superior -->
              <path d="M 478,170 Q 510,162 555,166 Q 580,172 578,184 Q 545,188 505,184 Q 482,180 478,170 Z"/>
              <!-- Lake Michigan -->
              <path d="M 545,192 Q 558,190 562,212 Q 560,238 548,242 Q 538,232 540,210 Q 542,196 545,192 Z"/>
              <!-- Lake Huron -->
              <path d="M 580,186 Q 600,186 608,200 Q 606,216 594,222 Q 578,216 576,200 Z"/>
              <!-- Lake Erie -->
              <path d="M 610,220 Q 642,216 670,222 Q 672,232 652,236 Q 620,234 610,228 Z"/>
              <!-- Lake Ontario -->
              <path d="M 680,212 Q 712,208 728,215 Q 726,224 708,226 Q 686,224 680,218 Z"/>
            </g>
          </g>

          <!-- ISO regions (drawn on top of CONUS) -->
          ${isos.map(iso => {
            const r = REGIONS[iso.code];
            if (!r) return '';
            const isSelected = selected === iso.code;
            return `
              <g class="iso-group" data-code="${iso.code}">
                <polygon class="iso-region status-${iso.status} ${isSelected ? 'selected' : ''}"
                         points="${r.points}"
                         data-code="${iso.code}"/>
                <text class="iso-label" x="${r.labelX}" y="${r.labelY}">${iso.code}</text>
                <text class="iso-substatus" x="${r.labelX}" y="${r.labelY + 13}">
                  ${iso.alerts > 0 ? iso.alerts + ' ALERT' + (iso.alerts > 1 ? 'S' : '') : 'ALIGNED'}
                </text>
                ${iso.status === 'red' ? `
                  <circle class="pulse-ring" cx="${r.pulseX}" cy="${r.pulseY}" r="4"/>
                  <circle cx="${r.pulseX}" cy="${r.pulseY}" r="3" fill="#ef4444"/>
                ` : ''}
                ${iso.status === 'yellow' ? `
                  <circle cx="${r.pulseX}" cy="${r.pulseY}" r="2.5" fill="#eab308"/>
                ` : ''}
              </g>
            `;
          }).join('')}

          <!-- Satellite fanout lines -->
          <g stroke="#2f2f2f" stroke-width="0.5" stroke-dasharray="1 3" fill="none">
            <line x1="480" y1="50" x2="132" y2="240"/>
            <line x1="480" y1="50" x2="400" y2="240"/>
            <line x1="480" y1="50" x2="430" y2="395"/>
            <line x1="480" y1="50" x2="525" y2="230"/>
            <line x1="480" y1="50" x2="685" y2="225"/>
            <line x1="480" y1="50" x2="767" y2="175"/>
            <line x1="480" y1="50" x2="830" y2="160"/>
          </g>

          <!-- Satellite node -->
          <g>
            <polygon points="462,42 498,42 504,52 498,62 462,62 456,52" fill="#000" stroke="#FF7800" stroke-width="1"/>
            <text x="480" y="55" fill="#FF7800" font-family="Helvetica Neue" font-size="8" text-anchor="middle" font-weight="700" letter-spacing="1">GOES-16/18</text>
          </g>

          <!-- Scan line sweep -->
          <line x1="0" x2="960" y1="0" y2="0" stroke="#FF7800" stroke-width="0.5" opacity="0.25">
            <animate attributeName="y1" from="0" to="540" dur="8s" repeatCount="indefinite"/>
            <animate attributeName="y2" from="0" to="540" dur="8s" repeatCount="indefinite"/>
          </line>
        </svg>
        <div class="sat-scan"></div>
        <div class="map-tip" id="map-tip"></div>
      `;

      containerEl.innerHTML = svg;

      const tip = containerEl.querySelector('#map-tip');
      const groups = containerEl.querySelectorAll('.iso-group');
      groups.forEach(g => {
        const code = g.dataset.code;
        g.addEventListener('mousemove', (e) => {
          const iso = isos.find(i => i.code === code);
          if (!iso) return;
          const rect = containerEl.getBoundingClientRect();
          tip.style.display = 'block';
          tip.style.left = (e.clientX - rect.left) + 'px';
          tip.style.top = (e.clientY - rect.top) + 'px';
          tip.innerHTML = `
            <div class="row"><b>${iso.code}</b><span class="status-${iso.status}">${iso.status.toUpperCase()}</span></div>
            <div class="row"><span>ZONES</span><span>${iso.zones}</span></div>
            <div class="row"><span>ACTIVE</span><span>${iso.alerts}</span></div>
          `;
          if (onHover) onHover(code);
        });
        g.addEventListener('mouseleave', () => {
          tip.style.display = 'none';
          if (onLeave) onLeave(code);
        });
        g.addEventListener('click', () => {
          if (onSelect) onSelect(code);
        });
      });
    }
  };
})();
