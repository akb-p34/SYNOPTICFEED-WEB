const { getClient } = require('../lib/supabase');
const { sendWelcome, sendNotification } = require('../lib/resend');

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

    // Honeypot: bots often fill hidden fields
    if (body.website || body.fax) {
        res.status(200).json({ ok: true });
        return;
    }

    const email = clean(body.email, 254).toLowerCase();
    const name = clean(body.name, 120);
    const company = clean(body.company, 160);

    if (!isValidEmail(email) || !name || !company) {
        res.status(400).json({ error: 'Invalid input' });
        return;
    }

    const lead = {
        email,
        name,
        company,
        source: clean(body.source, 40) || 'popup',
        source_context: clean(body.source_context, 60) || null,
        source_page: clean(body.source_page, 200) || null,
        utm_source: clean(body.utm_source, 120) || null,
        utm_medium: clean(body.utm_medium, 120) || null,
        utm_campaign: clean(body.utm_campaign, 160) || null,
        visitor_id: clean(body.visitor_id, 36) || null
    };

    const sb = getClient();

    // Guarantee FK: if a visitor_id was sent but no row exists, create a minimal visitor
    // so the lead insert doesn't fail (e.g., tracker.js was blocked or hasn't fired yet).
    if (lead.visitor_id) {
        const { data: existing } = await sb
            .from('visitors')
            .select('visitor_id')
            .eq('visitor_id', lead.visitor_id)
            .maybeSingle();
        if (!existing) {
            const ua = clean(req.headers['user-agent'], 500);
            const country = clean(req.headers['x-vercel-ip-country'], 4);
            await sb.from('visitors').insert({
                visitor_id: lead.visitor_id,
                user_agent: ua,
                country
            });
        }
    }

    const { data: leadRow, error: upsertError } = await sb
        .from('leads')
        .upsert(lead, { onConflict: 'email' })
        .select()
        .single();

    if (upsertError) {
        console.error('leads upsert error', upsertError);
        res.status(500).json({ error: 'Storage failed' });
        return;
    }

    // Context lookup for notification email (recent page_views + first_seen)
    let context = null;
    if (lead.visitor_id) {
        const [{ data: pages }, { data: visitor }] = await Promise.all([
            sb.from('page_views').select('page_path, viewed_at').eq('visitor_id', lead.visitor_id).order('viewed_at', { ascending: false }).limit(10),
            sb.from('visitors').select('first_seen_at, first_referrer').eq('visitor_id', lead.visitor_id).single()
        ]);
        context = {
            recent_pages: pages || [],
            first_seen_at: visitor?.first_seen_at || null,
            first_referrer: visitor?.first_referrer || null
        };
    }

    // Fire-and-forget: email failures should not block the user-facing success response
    Promise.all([
        sendWelcome(leadRow).catch(err => console.error('welcome email error', err)),
        sendNotification(leadRow, context).catch(err => console.error('notify email error', err))
    ]);

    res.status(200).json({ ok: true });
};
