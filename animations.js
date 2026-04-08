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
        el.textContent = new Date().toLocaleTimeString('en-US', {
            timeZone: 'America/New_York',
            hour12: false
        }) + ' ET';
    }

    function runAlertCycle() {
        var zones = document.querySelectorAll('.zone');
        var alertPanel = document.getElementById('dashboardAlert');
        var alertText = document.getElementById('alertText');

        // Phase 1: PJM Western goes yellow (2s in)
        setTimeout(function () {
            var pjmWest = document.querySelector('[data-zone="pjm-west"]');
            var status = pjmWest.querySelector('.zone-status');
            status.className = 'zone-status status-yellow';
            status.textContent = 'DIVERGING';
        }, 0);

        // Phase 2: PJM Western goes red, ERCOT goes yellow (4s in)
        setTimeout(function () {
            var pjmWest = document.querySelector('[data-zone="pjm-west"]');
            var pjmStatus = pjmWest.querySelector('.zone-status');
            pjmStatus.className = 'zone-status status-red';
            pjmStatus.textContent = 'DIVERGENCE';
            pjmWest.classList.add('alert-active');

            var ercot = document.querySelector('[data-zone="ercot"]');
            var ercotStatus = ercot.querySelector('.zone-status');
            ercotStatus.className = 'zone-status status-yellow';
            ercotStatus.textContent = 'DIVERGING';
        }, 2000);

        // Phase 3: Alert panel opens, typing effect (5s in)
        setTimeout(function () {
            alertPanel.classList.add('active');

            var message = 'Forecast divergence detected. PJM Western Hub. Temperature delta +8.2\u00B0F from GFS prediction. Day-ahead contracts exposed. Confidence: HIGH.';
            typeText(alertText, message, 25);
        }, 3500);

        // Phase 4: Recovery — everything back to green (14s in)
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

        // Phase 5: Restart cycle (18s in)
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
