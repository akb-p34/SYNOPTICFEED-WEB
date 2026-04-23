const { getClient } = require('../lib/supabase');
const { logError } = require('../lib/log-error');

// Per-instance bucket. 60/min/IP is generous — web-vitals emits ~5 metrics
// per pageview. Prevents storage-flood from an attacker spamming fake metrics.
const rateBuckets = new Map();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip) {
    const now = Date.now();
    const bucket = rateBuckets.get(ip) || [];
    const fresh = bucket.filter(t => now - t < RATE_WINDOW_MS);
    if (fresh.length >= RATE_LIMIT) return true;
    fresh.push(now);
    rateBuckets.set(ip, fresh);
    return false;
}

function clean(s, max = 200) {
    return String(s || '').trim().slice(0, max);
}

const ALLOWED_METRICS = new Set(['CLS', 'LCP', 'INP', 'FCP', 'TTFB', 'FID']);

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (rateLimited(ip)) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }

    // Client sends via sendBeacon with text/plain for simple-CORS on iOS Safari.
    // Vercel auto-parses application/json; for text/plain we parse ourselves.
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    body = body || {};

    const metric_name = clean(body.name, 16);
    if (!ALLOWED_METRICS.has(metric_name)) {
        res.status(400).json({ error: 'Invalid metric' });
        return;
    }
    const metric_value = Number(body.value);
    if (!Number.isFinite(metric_value)) {
        res.status(400).json({ error: 'Invalid value' });
        return;
    }

    const entry = {
        visitor_id: clean(body.visitor_id, 36) || null,
        page_path: clean(body.page_path, 200) || '/',
        metric_name,
        metric_value,
        metric_id: clean(body.id, 64) || null,
        rating: clean(body.rating, 32) || null,
        device: clean(body.device, 16) || null,
        connection: clean(body.connection, 16) || null,
        user_agent: clean(req.headers['user-agent'], 500)
    };

    try {
        const sb = getClient();
        const { error: insertError } = await sb.from('web_vitals').insert(entry);
        if (insertError) {
            console.error('web_vitals insert error', insertError);
            await logError(req, '/api/vitals', insertError, 500);
        }
    } catch (err) {
        console.error('web_vitals storage error', err);
        await logError(req, '/api/vitals', err, 500);
    }

    res.status(200).json({ ok: true });
};
