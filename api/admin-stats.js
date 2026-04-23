const crypto = require('crypto');
const { getClient } = require('../lib/supabase');
const { logError } = require('../lib/log-error');

// Tight 5/min/IP so brute force is impractical. Constant-time compare
// prevents timing-oracle leakage. Min password length enforced server-side.
const rateBuckets = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const MIN_PASSWORD_LEN = 24;

function rateLimited(ip) {
    const now = Date.now();
    const bucket = rateBuckets.get(ip) || [];
    const fresh = bucket.filter(t => now - t < RATE_WINDOW_MS);
    if (fresh.length >= RATE_LIMIT) return true;
    fresh.push(now);
    rateBuckets.set(ip, fresh);
    return false;
}

function timingSafeCompare(a, b) {
    const ab = Buffer.from(a || '', 'utf8');
    const bb = Buffer.from(b || '', 'utf8');
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
}

module.exports = async function handler(req, res) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

    if (rateLimited(ip)) {
        res.status(429).json({ error: 'Too many attempts' });
        return;
    }

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || expected.length < MIN_PASSWORD_LEN) {
        await logError(req, '/api/admin-stats', new Error('ADMIN_PASSWORD missing or below min length'), 503);
        res.status(503).json({ error: 'Admin not configured' });
        return;
    }

    const header = String(req.headers['authorization'] || '');
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!timingSafeCompare(token, expected)) {
        await logError(req, '/api/admin-stats', new Error('401 admin auth failed'), 401);
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const sb = getClient();
    const days = Math.max(1, Math.min(90, parseInt(req.query?.days, 10) || 30));
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    try {
        const [
            visitorsRes,
            pagesRes,
            ctasRes,
            vitalsRes,
            leadsRes,
            completeLeadsCountRes,
            partialLeadsCountRes,
            errorsListRes,
            errorCount24hRes,
            contactsTopRes
        ] = await Promise.all([
            sb.rpc('admin_visitors_daily', { days }),
            sb.rpc('admin_top_pages', { days }),
            sb.rpc('admin_top_ctas', { days }),
            sb.rpc('admin_vitals_p75', { days }),
            sb.from('intro_call_requests')
                .select('email,name,company,title,phone,stage,eoi,created_at,updated_at')
                .order('updated_at', { ascending: false })
                .limit(25),
            sb.from('intro_call_requests').select('id', { count: 'exact', head: true }).eq('stage', 'complete'),
            sb.from('intro_call_requests').select('id', { count: 'exact', head: true }).eq('stage', 'partial'),
            sb.from('errors')
                .select('created_at,endpoint,status_code,message')
                .order('created_at', { ascending: false })
                .limit(20),
            sb.from('errors').select('id', { count: 'exact', head: true }).gte('created_at', since24h),
            sb.from('contacts')
                .select('name,company,title,tier,status,next_action,last_contact')
                .in('tier', ['S', 'A'])
                .order('updated_at', { ascending: false })
                .limit(25)
        ]);

        res.status(200).json({
            days,
            visitors: visitorsRes.data || [],
            pageviews: pagesRes.data || [],
            clicks: ctasRes.data || [],
            vitals: vitalsRes.data || [],
            leads: leadsRes.data || [],
            lead_counts: {
                complete: completeLeadsCountRes.count || 0,
                partial: partialLeadsCountRes.count || 0
            },
            errors: errorsListRes.data || [],
            errors_24h: errorCount24hRes.count || 0,
            contacts_top: contactsTopRes.data || []
        });
    } catch (err) {
        console.error('admin-stats aggregate error', err);
        await logError(req, '/api/admin-stats', err, 500);
        res.status(500).json({ error: 'Aggregate failed' });
    }
};
