(function () {
    'use strict';

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

    function init() {
        if (getCookie(CONSENT_COOKIE)) return;
        var el = document.getElementById('syf-cookie-banner');
        if (!el) return;
        el.removeAttribute('hidden');
        el.classList.add('is-visible');

        el.addEventListener('click', function (e) {
            var ok = e.target.closest('[data-cookie-accept]');
            var decline = e.target.closest('[data-cookie-decline]');
            if (!ok && !decline) return;
            setCookie(CONSENT_COOKIE, ok ? 'accepted' : 'declined', 365);
            el.classList.remove('is-visible');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
