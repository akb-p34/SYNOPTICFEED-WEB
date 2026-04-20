(function () {
    'use strict';

    var VISITOR_COOKIE = 'syf_visitor_id';
    var CONSENT_COOKIE = 'syf_cookie_consent';

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }
    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/; samesite=lax';
    }

    function uuidv4() {
        if (crypto && crypto.randomUUID) return crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function ensureVisitorId() {
        var id = getCookie(VISITOR_COOKIE);
        if (id) return id;
        id = uuidv4();
        setCookie(VISITOR_COOKIE, id, 365);
        return id;
    }

    function readUtm() {
        var params = new URLSearchParams(window.location.search);
        return {
            source: params.get('utm_source'),
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign')
        };
    }

    function send(visitor_id) {
        var body = JSON.stringify({
            visitor_id: visitor_id,
            page_path: window.location.pathname.replace(/\/+$/, '') || '/',
            referrer: document.referrer || null,
            utm: readUtm()
        });
        var url = '/api/track-visit';
        try {
            if (navigator.sendBeacon) {
                var blob = new Blob([body], { type: 'application/json' });
                navigator.sendBeacon(url, blob);
                return;
            }
        } catch (_) { /* fall through to fetch */ }
        fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: body,
            keepalive: true
        }).catch(function () { /* silent */ });
    }

    function track() {
        // Respect explicit decline from the cookie banner.
        if (getCookie(CONSENT_COOKIE) === 'declined') return;
        var id = ensureVisitorId();
        send(id);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', track);
    } else {
        track();
    }
})();
