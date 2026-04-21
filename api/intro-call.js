const { getClient } = require('../lib/supabase');
const { sendIntroCallNotification } = require('../lib/resend');

const CALENDLY_BASE = 'https://calendly.com/akbar-pathan034/intro-call';

const rateBuckets = new Map();
const RATE_LIMIT = 5;
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

function isValidEmail(s) {
    if (typeof s !== 'string' || s.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function clean(s, max = 200) {
    return String(s || '').trim().slice(0, max);
}

function cleanArray(arr, max = 20, itemMax = 80) {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, max).map(v => clean(v, itemMax)).filter(Boolean);
}

function buildCalendlyUrl(name, email) {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (email) params.set('email', email);
    const qs = params.toString();
    return qs ? `${CALENDLY_BASE}?${qs}` : CALENDLY_BASE;
}

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

    const body = req.body || {};

    if (body.website || body.fax) {
        res.status(200).json({ ok: true, redirect: CALENDLY_BASE });
        return;
    }

    const email = clean(body.email, 254).toLowerCase();
    const name = clean(body.name, 120);
    const company = clean(body.company, 160);
    const title = clean(body.title, 120);
    const isos = cleanArray(body.isos);
    const tradeTypes = cleanArray(body.trade_types);
    const weatherStack = cleanArray(body.weather_stack);
    const linkedin = clean(body.linkedin, 500);
    const eoi = Boolean(body.eoi);

    if (!isValidEmail(email) || !name || !company || !title || !eoi) {
        res.status(400).json({ error: 'Invalid input' });
        return;
    }

    const entry = {
        email,
        name,
        company,
        title,
        isos,
        trade_types: tradeTypes,
        weather_stack: weatherStack,
        linkedin: linkedin || null,
        eoi,
        visitor_id: clean(body.visitor_id, 36) || null,
        utm_source: clean(body.utm_source, 120) || null,
        utm_medium: clean(body.utm_medium, 120) || null,
        utm_campaign: clean(body.utm_campaign, 160) || null,
        user_agent: clean(req.headers['user-agent'], 500),
        source: clean(body.source, 40) || 'call-page'
    };

    const redirect = buildCalendlyUrl(name, email);

    // Fail-soft: we care most about the Calendly redirect happening.
    // If Supabase is down or the table doesn't exist yet, still notify and redirect.
    try {
        const sb = getClient();
        const { error: upsertError } = await sb
            .from('intro_call_requests')
            .upsert(entry, { onConflict: 'email' });
        if (upsertError) console.error('intro_call_requests upsert error', upsertError);
    } catch (err) {
        console.error('intro_call_requests storage error', err);
    }

    try {
        await sendIntroCallNotification(entry);
    } catch (err) {
        console.error('intro-call notification error', err);
    }

    res.status(200).json({ ok: true, redirect });
};
