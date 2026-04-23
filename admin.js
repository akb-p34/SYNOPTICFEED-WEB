    (function () {
        'use strict';

        var loginEl = document.getElementById('login');
        var dashboardEl = document.getElementById('dashboard');
        var pwInput = document.getElementById('pw');
        var loginBtn = document.getElementById('login-btn');
        var loginError = document.getElementById('login-error');

        // In-memory only. Not sessionStorage. Cleared on refresh or tab close.
        var adminAuth = '';

        function setText(el, s) {
            if (!el) return;
            el.textContent = (s == null) ? '' : String(s);
        }
        function empty(el) {
            if (!el) return;
            while (el.firstChild) el.removeChild(el.firstChild);
        }
        function makeEl(tag, opts) {
            var e = document.createElement(tag);
            if (opts) {
                if (opts.text != null) e.textContent = String(opts.text);
                if (opts.cls) e.className = opts.cls;
                if (opts.attrs) Object.keys(opts.attrs).forEach(function (k) { e.setAttribute(k, opts.attrs[k]); });
            }
            return e;
        }
        function fmtDate(iso) {
            if (!iso) return '';
            var d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().slice(0, 10);
        }
        function fmtDateTime(iso) {
            if (!iso) return '';
            var d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().replace('T', ' ').slice(0, 16) + 'Z';
        }
        function fmtMs(v) {
            if (v == null || isNaN(v)) return '';
            if (v < 1) return v.toFixed(3);
            return Math.round(v) + ' ms';
        }
        function fmtCls(v) {
            if (v == null || isNaN(v)) return '';
            return Number(v).toFixed(3);
        }

        async function fetchStats() {
            var res = await fetch('/api/admin-stats', {
                headers: { 'Authorization': 'Bearer ' + adminAuth }
            });
            if (res.status === 401) {
                adminAuth = '';
                loginEl.style.display = 'block';
                dashboardEl.classList.remove('visible');
                loginError.textContent = 'Unauthorized. Re-enter password.';
                throw new Error('unauthorized');
            }
            if (res.status === 429) {
                throw new Error('Rate limited — too many attempts. Wait a minute.');
            }
            if (!res.ok) throw new Error('Stats request failed: ' + res.status);
            return res.json();
        }

        function renderKpis(data) {
            var kpis = document.getElementById('kpis');
            empty(kpis);

            var totalVisitors = (data.visitors || []).reduce(function (sum, r) {
                return sum + (Number(r.unique_visitors) || 0);
            }, 0);
            var complete = (data.lead_counts && data.lead_counts.complete) || 0;
            var partial = (data.lead_counts && data.lead_counts.partial) || 0;
            var errors24h = data.errors_24h || 0;

            var rows = [
                { label: 'Unique visitors (30d)', value: totalVisitors, cls: '' },
                { label: 'Complete leads', value: complete, cls: 'accent' },
                { label: 'Partial leads', value: partial, cls: 'accent' },
                { label: 'Errors (24h)', value: errors24h, cls: errors24h > 50 ? 'danger' : '' }
            ];
            rows.forEach(function (r) {
                var card = makeEl('div', { cls: 'kpi' });
                card.appendChild(makeEl('p', { cls: 'label', text: r.label }));
                card.appendChild(makeEl('div', { cls: 'value ' + r.cls, text: r.value }));
                kpis.appendChild(card);
            });
        }

        // Charts: color palette matches the brand. All labels are known-safe
        // strings (page paths, metric names, formatted dates) — never
        // user-controlled fields like names/companies/referrers.
        var charts = {};
        function killChart(name) {
            if (charts[name]) { charts[name].destroy(); charts[name] = null; }
        }

        function renderVisitorsChart(data) {
            killChart('visitors');
            var rows = (data.visitors || []).slice().reverse(); // ascending for chart
            var labels = rows.map(function (r) { return fmtDate(r.day); });
            var values = rows.map(function (r) { return Number(r.unique_visitors) || 0; });
            var ctx = document.getElementById('chart-visitors').getContext('2d');
            charts.visitors = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Unique visitors',
                        data: values,
                        borderColor: '#FF7800',
                        backgroundColor: 'rgba(255,120,0,0.18)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 2
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { color: 'rgba(255,255,255,0.45)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
                        y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.45)' }, grid: { color: 'rgba(255,255,255,0.08)' } }
                    }
                }
            });
        }

        function renderBarChart(name, canvasId, rows, labelKey, valueKey) {
            killChart(name);
            var labels = rows.map(function (r) { return String(r[labelKey] || ''); });
            var values = rows.map(function (r) { return Number(r[valueKey]) || 0; });
            var ctx = document.getElementById(canvasId).getContext('2d');
            charts[name] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: valueKey,
                        data: values,
                        backgroundColor: '#FF7800',
                        borderColor: '#FF7800',
                        borderWidth: 0
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.45)' }, grid: { color: 'rgba(255,255,255,0.08)' } },
                        y: { ticks: { color: 'rgba(255,255,255,0.72)', autoSkip: false }, grid: { display: false } }
                    }
                }
            });
        }

        function renderVitalsTable(data) {
            var root = document.getElementById('vitals-table');
            empty(root);
            var rows = data.vitals || [];
            if (!rows.length) {
                root.appendChild(makeEl('p', { cls: 'empty', text: 'No vitals yet. Real browser visits will populate this.' }));
                return;
            }
            var table = makeEl('table');
            var thead = makeEl('thead');
            var hr = makeEl('tr');
            ['Page', 'Metric', 'P75'].forEach(function (h) { hr.appendChild(makeEl('th', { text: h })); });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = makeEl('tbody');
            rows.forEach(function (r) {
                var tr = makeEl('tr');
                tr.appendChild(makeEl('td', { cls: 'mono', text: r.page_path }));
                tr.appendChild(makeEl('td', { text: r.metric_name }));
                var val = r.metric_name === 'CLS' ? fmtCls(r.p75) : fmtMs(r.p75);
                tr.appendChild(makeEl('td', { text: val }));
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            root.appendChild(table);
        }

        function renderLeadsTable(data) {
            var root = document.getElementById('leads-table');
            empty(root);
            var rows = data.leads || [];
            if (!rows.length) {
                root.appendChild(makeEl('p', { cls: 'empty', text: 'No leads yet.' }));
                return;
            }
            var table = makeEl('table');
            var thead = makeEl('thead');
            var hr = makeEl('tr');
            ['Stage', 'Name', 'Company', 'Title', 'Email', 'Phone', 'EOI', 'Updated'].forEach(function (h) {
                hr.appendChild(makeEl('th', { text: h }));
            });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = makeEl('tbody');
            rows.forEach(function (r) {
                var tr = makeEl('tr');
                var stageCls = r.stage === 'complete' ? 'good' : 'warn';
                var stageSpan = makeEl('span', { cls: 'pill ' + stageCls, text: r.stage || '' });
                var stageTd = makeEl('td'); stageTd.appendChild(stageSpan); tr.appendChild(stageTd);
                tr.appendChild(makeEl('td', { text: r.name || '' }));
                tr.appendChild(makeEl('td', { text: r.company || '' }));
                tr.appendChild(makeEl('td', { cls: 'dim', text: r.title || '' }));
                tr.appendChild(makeEl('td', { cls: 'mono', text: r.email || '' }));
                tr.appendChild(makeEl('td', { cls: 'mono', text: r.phone || '' }));
                tr.appendChild(makeEl('td', { text: r.eoi ? 'yes' : '' }));
                tr.appendChild(makeEl('td', { cls: 'mono dim', text: fmtDateTime(r.updated_at || r.created_at) }));
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            root.appendChild(table);
        }

        function renderContactsTable(data) {
            var root = document.getElementById('contacts-table');
            empty(root);
            var rows = data.contacts_top || [];
            if (!rows.length) {
                root.appendChild(makeEl('p', { cls: 'empty', text: 'No S/A tier contacts.' }));
                return;
            }
            var table = makeEl('table');
            var thead = makeEl('thead');
            var hr = makeEl('tr');
            ['Tier', 'Name', 'Company', 'Title', 'Status', 'Next action', 'Last contact'].forEach(function (h) {
                hr.appendChild(makeEl('th', { text: h }));
            });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = makeEl('tbody');
            rows.forEach(function (r) {
                var tr = makeEl('tr');
                var tierCls = r.tier === 'S' ? 'tier-s' : 'tier-a';
                var tierSpan = makeEl('span', { cls: 'pill ' + tierCls, text: r.tier || '' });
                var tierTd = makeEl('td'); tierTd.appendChild(tierSpan); tr.appendChild(tierTd);
                tr.appendChild(makeEl('td', { text: r.name || '' }));
                tr.appendChild(makeEl('td', { text: r.company || '' }));
                tr.appendChild(makeEl('td', { cls: 'dim', text: r.title || '' }));
                tr.appendChild(makeEl('td', { cls: 'dim', text: r.status || '' }));
                tr.appendChild(makeEl('td', { cls: 'dim', text: r.next_action || '' }));
                tr.appendChild(makeEl('td', { cls: 'mono dim', text: fmtDate(r.last_contact) }));
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            root.appendChild(table);
        }

        function renderErrorsTable(data) {
            var root = document.getElementById('errors-table');
            empty(root);
            var rows = data.errors || [];
            if (!rows.length) {
                root.appendChild(makeEl('p', { cls: 'empty', text: 'No errors logged.' }));
                return;
            }
            var table = makeEl('table');
            var thead = makeEl('thead');
            var hr = makeEl('tr');
            ['When', 'Endpoint', 'Status', 'Message'].forEach(function (h) { hr.appendChild(makeEl('th', { text: h })); });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = makeEl('tbody');
            rows.forEach(function (r) {
                var tr = makeEl('tr');
                tr.appendChild(makeEl('td', { cls: 'mono dim', text: fmtDateTime(r.created_at) }));
                tr.appendChild(makeEl('td', { cls: 'mono', text: r.endpoint || '' }));
                tr.appendChild(makeEl('td', { cls: 'dim', text: String(r.status_code || '') }));
                tr.appendChild(makeEl('td', { cls: 'dim', text: r.message || '' }));
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            root.appendChild(table);
        }

        async function loadDashboard() {
            try {
                var data = await fetchStats();
                loginEl.style.display = 'none';
                dashboardEl.classList.add('visible');
                setText(document.getElementById('refresh-meta'), 'Refreshed ' + new Date().toLocaleTimeString());
                renderKpis(data);
                renderVisitorsChart(data);
                renderBarChart('pages', 'chart-pages', data.pageviews || [], 'page_path', 'views');
                renderBarChart('ctas', 'chart-ctas', (data.clicks || []).slice(0, 12), 'cta_context', 'clicks');
                renderVitalsTable(data);
                renderLeadsTable(data);
                renderContactsTable(data);
                renderErrorsTable(data);
            } catch (e) {
                if (e && e.message && e.message !== 'unauthorized') {
                    setText(loginError, e.message);
                }
            }
        }

        function attemptLogin() {
            var pw = (pwInput.value || '').trim();
            if (pw.length < 8) {
                setText(loginError, 'Password looks too short.');
                return;
            }
            adminAuth = pw;
            pwInput.value = '';
            setText(loginError, '');
            loadDashboard();
        }

        loginBtn.addEventListener('click', attemptLogin);
        pwInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') attemptLogin();
        });
        pwInput.focus();
    })();
