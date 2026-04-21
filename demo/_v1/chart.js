// Divergence chart — forecast vs. satellite observations, with scrubber
(function() {
  const PAD = { top: 18, right: 20, bottom: 26, left: 52 };

  function renderChart(containerEl, state) {
    const { data, times, scrubIdx, onScrub } = state;
    const rect = containerEl.getBoundingClientRect();
    const W = rect.width || 800;
    const H = rect.height || 260;

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const minY = 200;
    const maxY = 1200;
    const xAt = (i) => PAD.left + (i / (data.length - 1)) * innerW;
    const yAt = (v) => PAD.top + (1 - (v - minY) / (maxY - minY)) * innerH;

    const forecastPath = data.map((p, i) =>
      (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ' ' + yAt(p.forecast).toFixed(1)
    ).join(' ');
    const obsPath = data.map((p, i) =>
      (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ' ' + yAt(p.obs).toFixed(1)
    ).join(' ');

    // Divergence area between forecast and obs
    const divPath =
      data.map((p, i) => (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ' ' + yAt(p.forecast).toFixed(1)).join(' ') +
      ' ' +
      data.slice().reverse().map((p, i) => {
        const realI = data.length - 1 - i;
        return 'L' + xAt(realI).toFixed(1) + ' ' + yAt(p.obs).toFixed(1);
      }).join(' ') +
      ' Z';

    // Y axis ticks
    const yTicks = [300, 500, 700, 900, 1100];
    const xTicks = [0, 12, 24, 36, 48]; // 4hr / 3hr / 2hr / 1hr / now

    const cur = data[scrubIdx] || data[data.length - 1];
    const divergencePct = cur ? Math.round(((cur.obs - cur.forecast) / cur.forecast) * 100) : 0;

    containerEl.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <!-- grid -->
        ${yTicks.map(v => `
          <line class="chart-grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${yAt(v)}" y2="${yAt(v)}"/>
          <text class="chart-axis" x="${PAD.left - 8}" y="${yAt(v) + 3}" text-anchor="end">${v}</text>
        `).join('')}
        ${xTicks.map(i => {
          const label = times[i] || '';
          return `
            <line class="chart-grid" x1="${xAt(i)}" x2="${xAt(i)}" y1="${PAD.top}" y2="${H - PAD.bottom}"/>
            <text class="chart-axis" x="${xAt(i)}" y="${H - PAD.bottom + 14}" text-anchor="middle">${label}</text>
          `;
        }).join('')}

<!-- Divergence shaded area (clipped so it only shows behind where the obs line has swept). -->
        <defs>
          <clipPath id="obs-reveal-clip">
            <rect class="chart-reveal-rect" x="${PAD.left}" y="0" width="0" height="${H}"/>
          </clipPath>
        </defs>
        <path class="chart-div" d="${divPath}" clip-path="url(#obs-reveal-clip)"/>

        <!-- Forecast line (dashed grey) -->
        <path class="chart-forecast" d="${forecastPath}" stroke-dasharray="4 3"/>

        <!-- Observation line (orange) — draws in left-to-right as real time advances (T2-2). -->
        <path class="chart-obs chart-obs-sweep" d="${obsPath}"/>

        <!-- Scrub dots removed — the static alarm-fire vertical line is enough. -->


        <!-- Watch threshold line at 8:15 AM CT (index 15) — solid yellow, fades in as the obs sweep crosses it. -->
        <line class="chart-watch-line" x1="${xAt(15)}" x2="${xAt(15)}" y1="${PAD.top}" y2="${H - PAD.bottom}" stroke="#eab308" stroke-width="1.5"/>
        <!-- Alarm threshold line at 8:50 AM CT (index 22) — solid red, fades in as the obs sweep crosses it. -->
        <line class="chart-threshold" x1="${xAt(22)}" x2="${xAt(22)}" y1="${PAD.top}" y2="${H - PAD.bottom}" stroke="#ef4444" stroke-width="1.5"/>
      </svg>

    `;

    // Chart scrub is non-interactive on the live dashboard — CSS animates the sweep instead.
    // Drag wiring intentionally removed so the cursor reads as ambient UI, not a user control.

    // Return current readout for outside use
    return {
      time: times[scrubIdx],
      forecast: cur.forecast,
      obs: cur.obs,
      divergencePct
    };
  }

  window.SF_CHART = { render: renderChart };
})();
