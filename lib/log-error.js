const { getClient } = require('./supabase');

// Per-instance token bucket. Caps error inserts at 30/min so a Supabase outage
// or a bad deploy cannot loop-amplify load by trying to log every downstream
// failure. Over budget, falls back to console.error only.
let bucket = [];
const BUDGET = 30;
const WINDOW_MS = 60_000;

async function logError(req, endpoint, err, statusCode) {
    const now = Date.now();
    bucket = bucket.filter(t => now - t < WINDOW_MS);
    if (bucket.length >= BUDGET) {
        console.error(`[log-error] budget exceeded (${BUDGET}/min), dropping:`, endpoint, err && err.message);
        return;
    }
    bucket.push(now);

    try {
        const sb = getClient();
        await sb.from('errors').insert({
            endpoint,
            status_code: statusCode || 500,
            message: String((err && err.message) || err || 'unknown').slice(0, 1000),
            stack: String((err && err.stack) || '').slice(0, 4000),
            user_agent: String((req && req.headers && req.headers['user-agent']) || '').slice(0, 500),
            ip: String((req && req.headers && req.headers['x-forwarded-for']) || (req && req.socket && req.socket.remoteAddress) || '').slice(0, 64)
        });
    } catch (_) {
        // never throw from logError
    }
}

module.exports = { logError };
