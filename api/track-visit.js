const { getClient } = require('../lib/supabase');

function clean(s, max = 500) {
    return s == null ? null : String(s).trim().slice(0, max) || null;
}
function isUuid(s) {
    return typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const body = req.body || {};
    const visitor_id = body.visitor_id;
    if (!isUuid(visitor_id)) {
        res.status(400).json({ error: 'Invalid visitor_id' });
        return;
    }

    const page_path = clean(body.page_path, 200) || '/';
    const referrer = clean(body.referrer, 500);
    const utm = body.utm || {};
    const utm_source = clean(utm.source, 120);
    const utm_medium = clean(utm.medium, 120);
    const utm_campaign = clean(utm.campaign, 160);
    const user_agent = clean(req.headers['user-agent'], 500);
    const country = clean(req.headers['x-vercel-ip-country'], 4);

    const sb = getClient();

    // Upsert visitor: insert on first hit, update last_seen_at otherwise. first_* fields set only on insert.
    const { data: existing } = await sb
        .from('visitors')
        .select('visitor_id')
        .eq('visitor_id', visitor_id)
        .maybeSingle();

    if (existing) {
        await sb.from('visitors')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('visitor_id', visitor_id);
    } else {
        await sb.from('visitors').insert({
            visitor_id,
            first_referrer: referrer,
            first_utm_source: utm_source,
            first_utm_medium: utm_medium,
            first_utm_campaign: utm_campaign,
            user_agent,
            country
        });
    }

    await sb.from('page_views').insert({
        visitor_id,
        page_path,
        referrer
    });

    res.status(200).json({ ok: true });
};
