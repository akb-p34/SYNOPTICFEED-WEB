(function () {
    'use strict';

    var ENDPOINT = '/api/track-click';
    var VISITOR_COOKIE = 'syf_visitor_id';
    var CONSENT_COOKIE = 'syf_cookie_consent';
    var MAX_CONTEXT_LEN = 60;

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function currentPath() {
        var p = window.location.pathname.replace(/\/+$/, '');
        return p === '' ? '/' : p;
    }

    function send(context) {
        if (!context) return;
        if (typeof context !== 'string') return;
        if (context.length > MAX_CONTEXT_LEN) context = context.slice(0, MAX_CONTEXT_LEN);
        // Respect explicit decline from the cookie banner.
        if (getCookie(CONSENT_COOKIE) === 'declined') return;

        var body = JSON.stringify({
            visitor_id: getCookie(VISITOR_COOKIE) || null,
            cta_context: context,
            page_path: currentPath()
        });

        try {
            if (navigator.sendBeacon) {
                var blob = new Blob([body], { type: 'application/json' });
                navigator.sendBeacon(ENDPOINT, blob);
                return;
            }
        } catch (_) { /* fall through to fetch */ }

        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: body,
            keepalive: true
        }).catch(function () { /* silent */ });
    }

    function onClick(e) {
        var t = e.target.closest('[data-track]');
        if (!t) return;
        var ctx = t.getAttribute('data-track');
        if (!ctx) return;
        send(ctx);
    }

    document.addEventListener('click', onClick, true);

    // Expose programmatic API for scripts that track non-click events
    // (e.g., form submits, focus, choice changes in call.html).
    window.syfTrack = send;
})();
