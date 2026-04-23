(function () {
    'use strict';

    // Vendored web-vitals is loaded as an IIFE and exposes `webVitals` as a global.
    // Wait for it before wiring; bail silently if it failed to load.
    if (typeof window === 'undefined') return;

    var ENDPOINT = '/api/vitals';
    var VISITOR_COOKIE = 'syf_visitor_id';

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function detectDevice() {
        return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    }

    function connectionType() {
        var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return c && c.effectiveType ? c.effectiveType : null;
    }

    function send(metric) {
        try {
            var payload = {
                name: metric.name,
                value: metric.value,
                id: metric.id,
                rating: metric.rating,
                page_path: window.location.pathname,
                visitor_id: getCookie(VISITOR_COOKIE),
                device: detectDevice(),
                connection: connectionType()
            };
            var body = JSON.stringify(payload);

            // text/plain Blob keeps the request CORS-simple so iOS Safari
            // doesn't drop the beacon on preflight.
            if (navigator.sendBeacon) {
                var blob = new Blob([body], { type: 'text/plain' });
                if (navigator.sendBeacon(ENDPOINT, blob)) return;
            }
            fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'content-type': 'text/plain' },
                body: body,
                keepalive: true
            }).catch(function () { /* silent */ });
        } catch (_) { /* never break the page */ }
    }

    function wire() {
        if (!window.webVitals) return;
        try {
            window.webVitals.onCLS(send);
            window.webVitals.onLCP(send);
            window.webVitals.onINP(send);
            window.webVitals.onFCP(send);
            window.webVitals.onTTFB(send);
        } catch (_) { /* silent */ }
    }

    if (window.webVitals) {
        wire();
    } else {
        // Library loads via a separate <script> tag that may resolve slightly after us.
        // Poll once on next tick; give up silently if absent.
        setTimeout(wire, 0);
    }
})();
