// ========================================
// SOVEREIGN CORNER EXPAND — brackets grow when tile is fully in view
// ========================================

(function () {
    var sov = document.querySelector('.pricing-tier.sovereign');
    if (!sov) return;
    // Fires only when the tile is essentially fully in the viewport.
    // Fallback threshold 0.95 in case intrinsic height exceeds viewport.
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                entry.target.classList.add('corners-open');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: [0.9, 0.95, 1.0] });
    obs.observe(sov);
})();

// ========================================
// CURSOR-FOLLOWING GLOW — radial gradient follows mouse on tiles
// ========================================

(function () {
    var glowTargets = document.querySelectorAll('.pricing-tier, .capability-block');
    glowTargets.forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
            var rect = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
            el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
        });
    });
})();

// ========================================
// ACTIVE NAV — mark current page link
// ========================================

(function () {
    var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-contact[data-nav]').forEach(function (link) {
        var linkPath = link.getAttribute('data-nav');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
})();

// ========================================
// SCROLL REVEAL — IntersectionObserver
// ========================================

(function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
        observer.observe(el);
    });

    // ========================================
    // SCROLL CHEVRON — hide on scroll
    // ========================================

    var chevron = document.getElementById('scrollChevron');
    if (chevron) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                chevron.classList.add('hidden');
            } else {
                chevron.classList.remove('hidden');
            }
        });
    }

    // ========================================
    // ANIMATED COUNTERS
    // ========================================

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(function (el) {
        counterObserver.observe(el);
    });

    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-target'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = parseInt(el.getAttribute('data-decimals')) || 0;
        var duration = 1200;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = (target * eased).toFixed(decimals);
            el.textContent = prefix + current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // ========================================
    // DASHBOARD SIMULATION
    // ========================================

    var dashboardStarted = false;
    var dashboardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !dashboardStarted) {
                dashboardStarted = true;
                startDashboardSequence();
                dashboardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    var dashboardMock = document.getElementById('dashboardMock');
    if (dashboardMock) {
        dashboardObserver.observe(dashboardMock);
    }

    function startDashboardSequence() {
        // Update clock
        updateDashboardClock();
        setInterval(updateDashboardClock, 1000);

        // Run the alert cycle after a pause
        setTimeout(runAlertCycle, 2000);
    }

    function updateDashboardClock() {
        var el = document.getElementById('dashboardTime');
        if (!el) return;
        var now = new Date();
        var time = now.toLocaleTimeString('en-US', { hour12: false });
        var tz = '';
        try {
            var parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now);
            var tzPart = parts.find(function (p) { return p.type === 'timeZoneName'; });
            tz = tzPart ? ' ' + tzPart.value : '';
        } catch (e) { /* older browsers: skip abbrev */ }
        el.textContent = time + tz;
    }

    var scenarios = [
        {
            primary: 'pjm-west',
            secondary: ['pjm-east', 'nyiso'],
            message: 'Forecast divergence detected. PJM Western Hub. Temperature delta +8.2\u00B0F from model. Day-ahead contracts exposed. Confidence: HIGH.'
        },
        {
            primary: 'ercot',
            secondary: ['miso'],
            message: 'Forecast divergence detected. ERCOT North. Heat-index +6.4\u00B0F above forecast. Real-time dispatch exposed. Confidence: HIGH.'
        },
        {
            primary: 'caiso',
            secondary: ['ercot'],
            message: 'Forecast divergence detected. CAISO. Cloud cover 42% denser than forecast. Solar output exposed. Confidence: MEDIUM.'
        },
        {
            primary: 'miso',
            secondary: ['pjm-east'],
            message: 'Forecast divergence detected. MISO Central. Wind speed 15.3% below forecast. Generation schedule exposed. Confidence: HIGH.'
        }
    ];
    var scenarioIndex = 0;

    function runAlertCycle() {
        var zones = document.querySelectorAll('.zone');
        var alertPanel = document.getElementById('dashboardAlert');
        var alertText = document.getElementById('alertText');
        var scenario = scenarios[scenarioIndex % scenarios.length];
        scenarioIndex++;

        // Phase 1: primary zone goes yellow
        setTimeout(function () {
            var el = document.querySelector('[data-zone="' + scenario.primary + '"]');
            if (!el) return;
            var status = el.querySelector('.zone-status');
            status.className = 'zone-status status-yellow';
            status.textContent = 'DIVERGING';
        }, 0);

        // Phase 2: primary goes red, secondary zones go yellow
        setTimeout(function () {
            var primary = document.querySelector('[data-zone="' + scenario.primary + '"]');
            if (primary) {
                var pStatus = primary.querySelector('.zone-status');
                pStatus.className = 'zone-status status-red';
                pStatus.textContent = 'DIVERGENCE';
                primary.classList.add('alert-active');
            }
            scenario.secondary.forEach(function (z) {
                var sec = document.querySelector('[data-zone="' + z + '"]');
                if (!sec) return;
                var sStatus = sec.querySelector('.zone-status');
                sStatus.className = 'zone-status status-yellow';
                sStatus.textContent = 'DIVERGING';
            });
        }, 2000);

        // Phase 3: Alert panel opens, typing effect
        setTimeout(function () {
            alertPanel.classList.add('active');
            typeText(alertText, scenario.message, 22);
        }, 3500);

        // Phase 4: Recovery — everything back to green
        setTimeout(function () {
            zones.forEach(function (zone) {
                var status = zone.querySelector('.zone-status');
                status.className = 'zone-status status-green';
                status.textContent = 'ALIGNED';
                zone.classList.remove('alert-active');
            });
            alertPanel.classList.remove('active');
            alertText.textContent = '';
            alertText.classList.remove('typing-done');
        }, 14000);

        // Phase 5: Next scenario
        setTimeout(function () {
            runAlertCycle();
        }, 18000);
    }

    function typeText(element, text, speed) {
        var i = 0;
        element.classList.remove('typing-done');

        function type() {
            if (i < text.length) {
                element.textContent = text.substring(0, i + 1);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.add('typing-done');
            }
        }

        type();
    }

})();
