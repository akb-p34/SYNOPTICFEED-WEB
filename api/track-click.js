const { getClient } = require('../lib/supabase');
const { logError } = require('../lib/log-error');

function clean(s, max = 200) {
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
    const visitor_id = isUuid(body.visitor_id) ? body.visitor_id : null;
    const cta_context = clean(body.cta_context, 60);
    const page_path = clean(body.page_path, 200) || '/';

    if (!cta_context) {
        res.status(400).json({ error: 'Missing cta_context' });
        return;
    }

    try {
        const sb = getClient();
        await sb.from('cta_clicks').insert({ visitor_id, cta_context, page_path });
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('cta_clicks insert error', err);
        await logError(req, '/api/track-click', err, 500);
        res.status(500).json({ error: 'Storage failed' });
    }
};
