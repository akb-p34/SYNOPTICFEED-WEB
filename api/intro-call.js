const { getClient } = require('../lib/supabase');
const { sendIntroCallNotification } = require('../lib/resend');
const { logError } = require('../lib/log-error');

const CALENDLY_BASE = 'https://calendly.com/akbar-pathan034/intro-call';

// Per-field autosave makes the partial path hot — a normal form session can easily
// produce 5-8 blur events. Complete stage stays tightly limited (it's the
// brute-force risk surface that ships Resend notifications + real redirects).
const rateBucketsPartial = new Map();
const rateBucketsComplete = new Map();
const RATE_LIMIT_PARTIAL = 20;
const RATE_LIMIT_COMPLETE = 5;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip, stage) {
    const buckets = stage === 'partial' ? rateBucketsPartial : rateBucketsComplete;
    const limit = stage === 'partial' ? RATE_LIMIT_PARTIAL : RATE_LIMIT_COMPLETE;
    const now = Date.now();
    const bucket = buckets.get(ip) || [];
    const fresh = bucket.filter(t => now - t < RATE_WINDOW_MS);
    if (fresh.length >= limit) return true;
    fresh.push(now);
    buckets.set(ip, fresh);
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

// Returns the cleaned phone string if 10-15 digits (stripped), else empty string.
function cleanPhone(s) {
    const raw = clean(s, 32);
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return '';
    return raw;
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
    const body = req.body || {};
    const stage = body.stage === 'partial' ? 'partial' : 'complete';

    if (rateLimited(ip, stage)) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }

    if (body.website || body.fax) {
        if (stage === 'partial') {
            res.status(200).json({ ok: true });
        } else {
            res.status(200).json({ ok: true, redirect: CALENDLY_BASE });
        }
        return;
    }

    const email = clean(body.email, 254).toLowerCase();
    const name = clean(body.name, 120);
    const company = clean(body.company, 160);
    const title = clean(body.title, 120);
    const phone = cleanPhone(body.phone);
    const linkedin = clean(body.linkedin, 500);
    const isos = cleanArray(body.isos);
    const tradeTypes = cleanArray(body.trade_types);
    const weatherStack = cleanArray(body.weather_stack);
    const eoi = body.eoi === true;

    // Email is required on every stage (it's the conflict key).
    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid input' });
        return;
    }

    // Complete stage requires every contact field, a valid phone, and EOI.
    if (stage === 'complete' && (!name || !company || !title || !phone || !eoi)) {
        res.status(400).json({ error: 'Invalid input' });
        return;
    }

    let entry;
    if (stage === 'complete') {
        entry = {
            email,
            name,
            company,
            title,
            phone,
            linkedin: linkedin || null,
            eoi: true,
            isos,
            trade_types: tradeTypes,
            weather_stack: weatherStack,
            visitor_id: clean(body.visitor_id, 36) || null,
            utm_source: clean(body.utm_source, 120) || null,
            utm_medium: clean(body.utm_medium, 120) || null,
            utm_campaign: clean(body.utm_campaign, 160) || null,
            user_agent: clean(req.headers['user-agent'], 500),
            source: clean(body.source, 40) || 'call-page',
            stage: 'complete'
        };
    } else {
        // Overwrite-safe partial: only include fields with truthy values.
        // Postgres UPSERT only touches columns that appear in the INSERT list,
        // so omitted fields preserve whatever was already written on the row.
        entry = { email, stage: 'partial' };
        if (name) entry.name = name;
        if (company) entry.company = company;
        if (title) entry.title = title;
        if (phone) entry.phone = phone;
        if (linkedin) entry.linkedin = linkedin;
        if (eoi === true) entry.eoi = true; // never downgrade to false
        const vid = clean(body.visitor_id, 36);
        if (vid) entry.visitor_id = vid;
        const utmSource = clean(body.utm_source, 120);
        if (utmSource) entry.utm_source = utmSource;
        const utmMedium = clean(body.utm_medium, 120);
        if (utmMedium) entry.utm_medium = utmMedium;
        const utmCampaign = clean(body.utm_campaign, 160);
        if (utmCampaign) entry.utm_campaign = utmCampaign;
        const ua = clean(req.headers['user-agent'], 500);
        if (ua) entry.user_agent = ua;
        const src = clean(body.source, 40);
        if (src) entry.source = src;
    }

    if (stage === 'partial') {
        try {
            const sb = getClient();
            // Guard: never regress a completed row to partial.
            const { data: existing, error: selectError } = await sb
                .from('intro_call_requests')
                .select('stage')
                .eq('email', email)
                .maybeSingle();
            if (selectError) console.error('intro_call_requests select error', selectError);
            if (existing && existing.stage === 'complete') {
                res.status(200).json({ ok: true });
                return;
            }
            const { error: upsertError } = await sb
                .from('intro_call_requests')
                .upsert(entry, { onConflict: 'email' });
            if (upsertError) {
                console.error('intro_call_requests partial upsert error', upsertError);
                await logError(req, '/api/intro-call', upsertError, 500);
            }
        } catch (err) {
            console.error('intro_call_requests partial storage error', err);
            await logError(req, '/api/intro-call', err, 500);
        }
        res.status(200).json({ ok: true });
        return;
    }

    const redirect = buildCalendlyUrl(name, email);

    // Fail-soft: the Calendly redirect is the most important thing.
    // If Supabase is down, still notify and redirect.
    try {
        const sb = getClient();
        const { error: upsertError } = await sb
            .from('intro_call_requests')
            .upsert(entry, { onConflict: 'email' });
        if (upsertError) {
            console.error('intro_call_requests upsert error', upsertError);
            await logError(req, '/api/intro-call', upsertError, 500);
        }
    } catch (err) {
        console.error('intro_call_requests storage error', err);
        await logError(req, '/api/intro-call', err, 500);
    }

    try {
        await sendIntroCallNotification(entry);
    } catch (err) {
        console.error('intro-call notification error', err);
        await logError(req, '/api/intro-call:notify', err, 500);
    }

    res.status(200).json({ ok: true, redirect });
};
