(function () {
    'use strict';

    var EXCLUDED_PATHS = ['/pricing', '/demo'];
    var SEEN_COOKIE = 'syf_popup_seen';
    var MOBILE_DELAY_MS = 30000;

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()\[\]\\\/\+^]/g, '\\$&') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }
    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/; samesite=lax';
    }

    function currentPath() {
        var p = window.location.pathname.replace(/\/+$/, '');
        return p === '' ? '/' : p;
    }

    function isExcludedPath() {
        var p = currentPath();
        for (var i = 0; i < EXCLUDED_PATHS.length; i++) {
            if (p === EXCLUDED_PATHS[i] || p.indexOf(EXCLUDED_PATHS[i] + '/') === 0) return true;
        }
        return false;
    }

    function isCoarsePointer() {
        return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    }

    function readUtm() {
        var params = new URLSearchParams(window.location.search);
        return {
            source: params.get('utm_source'),
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign')
        };
    }

    var popup, form, errorEl, successEl, isOpen = false, triggerSetup = false;

    function openPopup(sourceContext) {
        if (!popup || isOpen) return;
        popup.dataset.sourceContext = sourceContext || 'auto';
        popup.setAttribute('aria-hidden', 'false');
        popup.classList.add('is-open');
        document.body.classList.add('syf-popup-open');
        isOpen = true;
        setTimeout(function () {
            var firstInput = form && form.querySelector('input[name="name"]');
            if (firstInput) firstInput.focus();
        }, 60);
    }

    function closePopup() {
        if (!popup || !isOpen) return;
        popup.setAttribute('aria-hidden', 'true');
        popup.classList.remove('is-open');
        document.body.classList.remove('syf-popup-open');
        isOpen = false;
        setCookie(SEEN_COOKIE, '1', 365);
    }

    function showSuccess() {
        if (form) form.hidden = true;
        if (successEl) successEl.hidden = false;
    }

    function showError(message) {
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }
    function clearError() {
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        clearError();
        var data = new FormData(form);
        var utm = readUtm();
        var body = {
            name: (data.get('name') || '').toString().trim(),
            email: (data.get('email') || '').toString().trim(),
            company: (data.get('company') || '').toString().trim(),
            website: (data.get('website') || '').toString(),
            source: 'popup',
            source_context: popup.dataset.sourceContext || 'auto',
            source_page: currentPath(),
            visitor_id: getCookie('syf_visitor_id') || null,
            utm_source: utm.source,
            utm_medium: utm.medium,
            utm_campaign: utm.campaign
        };

        if (!body.name || !body.email || !body.company) {
            showError('All fields required.');
            trackClick('popup:form:submit-missing-fields');
            return;
        }

        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'SENDING...'; }
        trackClick('popup:form:submit-started');

        fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        }).then(function (r) {
            if (!r.ok) throw new Error('Bad response');
            return r.json();
        }).then(function () {
            setCookie(SEEN_COOKIE, '1', 365);
            trackClick('popup:form:submit-success');
            showSuccess();
        }).catch(function () {
            showError('Something went wrong. Try again or email akbar@synopticfeed.com.');
            trackClick('popup:form:submit-error');
            if (btn) { btn.disabled = false; btn.textContent = 'REQUEST ACCESS'; }
        });
    }

    function wireFocusTracking() {
        if (!form) return;
        var fieldNames = ['name', 'email', 'company'];
        var focused = {};
        fieldNames.forEach(function (n) {
            var el = form.querySelector('input[name="' + n + '"]');
            if (!el) return;
            el.addEventListener('focus', function () {
                if (focused[n]) return;
                focused[n] = true;
                trackClick('popup:form:focus-' + n);
            });
        });
    }

    function onKey(e) {
        if (e.key === 'Escape' && isOpen) closePopup();
    }

    function trackClick(context) {
        try {
            var body = JSON.stringify({
                visitor_id: getCookie('syf_visitor_id') || null,
                cta_context: context,
                page_path: currentPath()
            });
            if (navigator.sendBeacon) {
                var blob = new Blob([body], { type: 'application/json' });
                navigator.sendBeacon('/api/track-click', blob);
                return;
            }
            fetch('/api/track-click', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: body,
                keepalive: true
            }).catch(function () { /* silent */ });
        } catch (_) { /* silent */ }
    }

    function wireTriggers() {
        if (triggerSetup) return;
        triggerSetup = true;
        document.addEventListener('click', function (e) {
            var t = e.target.closest('[data-popup-trigger]');
            if (t) {
                e.preventDefault();
                var context = t.getAttribute('data-popup-trigger') || 'click';
                trackClick(context);
                openPopup(context);
                return;
            }
            var c = e.target.closest('[data-popup-close]');
            if (c) {
                e.preventDefault();
                closePopup();
            }
        });
        document.addEventListener('keydown', onKey);
    }

    function armAutoTrigger() {
        if (getCookie(SEEN_COOKIE)) return;
        if (isExcludedPath()) return;

        if (isCoarsePointer()) {
            setTimeout(function () {
                if (!getCookie(SEEN_COOKIE) && !isOpen) openPopup('mobile-delay');
            }, MOBILE_DELAY_MS);
        } else {
            var armed = true;
            var handler = function (e) {
                if (!armed) return;
                if (e.clientY <= 0 && (e.relatedTarget === null || e.relatedTarget === undefined)) {
                    armed = false;
                    if (!getCookie(SEEN_COOKIE) && !isOpen) openPopup('exit-intent');
                }
            };
            document.addEventListener('mouseleave', handler);
        }
    }

    function init() {
        popup = document.getElementById('syf-popup');
        if (!popup) return;
        form = popup.querySelector('#syf-popup-form');
        errorEl = popup.querySelector('.syf-popup-error');
        successEl = popup.querySelector('.syf-popup-success');
        if (form) form.addEventListener('submit', handleSubmit);

        wireTriggers();
        wireFocusTracking();
        armAutoTrigger();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
