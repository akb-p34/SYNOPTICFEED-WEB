const { Resend } = require('resend');

// Read env lazily on each call so a env var swap (via Vercel) is picked up
// immediately without needing a cold start of the container.
function getClient() {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('Missing RESEND_API_KEY');
    return new Resend(key);
}
function fromAddr() {
    return process.env.RESEND_FROM_EMAIL || 'SynopticFeed <onboarding@resend.dev>';
}
function notifyTo() {
    return process.env.NOTIFY_TO_EMAIL || 'akbar.pathan034@gmail.com';
}

async function sendWelcome(lead) {
    return getClient().emails.send({
        from: fromAddr(),
        to: lead.email,
        reply_to: notifyTo(),
        subject: 'SynopticFeed founding partner request received',
        text: welcomeText(lead),
        html: welcomeHtml(lead)
    });
}

async function sendNotification(lead, context) {
    return getClient().emails.send({
        from: fromAddr(),
        to: notifyTo(),
        reply_to: lead.email,
        subject: `New founding partner request: ${lead.company}`,
        text: notificationText(lead, context),
        html: notificationHtml(lead, context)
    });
}

function welcomeText(lead) {
    return `${lead.name},

Got your founding partner request.

We're capping founding at ten desks. I read every request myself, and I'll reply within 48 hours with a few questions about your desk and what you trade, so I can tell you honestly whether we're a fit.

What a founding seat gets you:

- First access when the satellite feed goes live (HRIT receiver online end of March, full GRB in April).
- Founding price locked for the life of your seat.
- A direct line to me on what we build next.

Anything urgent, reply to this email. It comes straight to me.

Akbar Pathan
Founder, SynopticFeed
synopticfeed.com`;
}

function welcomeHtml(lead) {
    return `<!doctype html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
<p>${escapeHtml(lead.name)},</p>
<p>Got your founding partner request.</p>
<p>We're capping founding at ten desks. I read every request myself, and I'll reply within 48 hours with a few questions about your desk and what you trade, so I can tell you honestly whether we're a fit.</p>
<p>What a founding seat gets you:</p>
<ul>
<li>First access when the satellite feed goes live (HRIT receiver online end of March, full GRB in April).</li>
<li>Founding price locked for the life of your seat.</li>
<li>A direct line to me on what we build next.</li>
</ul>
<p>Anything urgent, reply to this email. It comes straight to me.</p>
<p>Akbar Pathan<br>Founder, SynopticFeed<br><a href="https://synopticfeed.com">synopticfeed.com</a></p>
</body></html>`;
}

function notificationText(lead, context) {
    const lines = [
        `New founding partner request.`,
        ``,
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Company: ${lead.company}`,
        `Source: ${lead.source}${lead.source_context ? ' / ' + lead.source_context : ''}`,
        `Page: ${lead.source_page || '(none)'}`,
    ];
    if (lead.utm_source || lead.utm_campaign) {
        lines.push(`UTM: source=${lead.utm_source || '-'} / medium=${lead.utm_medium || '-'} / campaign=${lead.utm_campaign || '-'}`);
    }
    if (context?.recent_pages?.length) {
        lines.push('', 'Recent pages (most recent first):');
        for (const p of context.recent_pages) {
            lines.push(`  - ${p.page_path} (${p.viewed_at})`);
        }
    }
    if (context?.first_seen_at) {
        lines.push('', `First seen: ${context.first_seen_at}`);
        if (context.first_referrer) lines.push(`First referrer: ${context.first_referrer}`);
    }
    lines.push('', `Reply to this email to respond directly. Aim for within the hour.`);
    return lines.join('\n');
}

function notificationHtml(lead, context) {
    const rows = [
        ['Name', lead.name],
        ['Email', `<a href="mailto:${escapeAttr(lead.email)}">${escapeHtml(lead.email)}</a>`],
        ['Company', lead.company],
        ['Source', `${lead.source}${lead.source_context ? ' / ' + lead.source_context : ''}`],
        ['Page', lead.source_page || '(none)'],
    ];
    if (lead.utm_source || lead.utm_campaign) {
        rows.push(['UTM', `source=${lead.utm_source || '-'} medium=${lead.utm_medium || '-'} campaign=${lead.utm_campaign || '-'}`]);
    }
    if (context?.first_seen_at) {
        rows.push(['First seen', context.first_seen_at]);
        if (context.first_referrer) rows.push(['First referrer', context.first_referrer]);
    }
    const rowsHtml = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0; color:#666;">${escapeHtml(k)}</td><td style="padding:4px 0;">${v}</td></tr>`).join('');
    const pagesHtml = context?.recent_pages?.length
        ? `<h4 style="margin-top:20px;">Recent pages</h4><ul style="padding-left:18px;">${context.recent_pages.map(p => `<li>${escapeHtml(p.page_path)} <span style="color:#999;">(${escapeHtml(p.viewed_at)})</span></li>`).join('')}</ul>`
        : '';
    return `<!doctype html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
<h3 style="margin-top:0;">New founding partner request</h3>
<table style="border-collapse:collapse;">${rowsHtml}</table>
${pagesHtml}
<p style="margin-top:24px; color:#666; font-size:13px;">Reply to this email to respond directly. Aim for within the hour.</p>
</body></html>`;
}

async function sendIntroCallNotification(entry) {
    return getClient().emails.send({
        from: fromAddr(),
        to: notifyTo(),
        reply_to: entry.email,
        subject: `Intro call request: ${entry.name} @ ${entry.company}`,
        text: introCallText(entry),
        html: introCallHtml(entry)
    });
}

function joinList(arr) {
    if (!Array.isArray(arr) || !arr.length) return '(none)';
    return arr.join(', ');
}

function introCallText(entry) {
    const lines = [
        `New intro call request (EMC25 funnel).`,
        ``,
        `Name: ${entry.name}`,
        `Email: ${entry.email}`,
        `Phone: ${entry.phone || '(not provided)'}`,
        `Company: ${entry.company}`,
        ``,
        `ISOs: ${joinList(entry.isos)}`,
        `Trades: ${joinList(entry.trade_types)}`,
        `Weather stack: ${joinList(entry.weather_stack)}`,
        `LinkedIn: ${entry.linkedin || '(not provided)'}`,
        `EOI confirmed: ${entry.eoi ? 'yes' : 'no'}`,
        `Source: ${entry.source || 'call-page'}`,
    ];
    if (entry.utm_source || entry.utm_campaign) {
        lines.push(`UTM: source=${entry.utm_source || '-'} / medium=${entry.utm_medium || '-'} / campaign=${entry.utm_campaign || '-'}`);
    }
    lines.push('', `They're being redirected to Calendly now. You'll also get the Calendly booking notification once they pick a slot.`);
    return lines.join('\n');
}

function introCallHtml(entry) {
    const rows = [
        ['Name', escapeHtml(entry.name)],
        ['Email', `<a href="mailto:${escapeAttr(entry.email)}">${escapeHtml(entry.email)}</a>`],
        ['Phone', entry.phone ? `<a href="tel:${escapeAttr(entry.phone)}">${escapeHtml(entry.phone)}</a>` : '(not provided)'],
        ['Company', escapeHtml(entry.company)],
        ['ISOs', escapeHtml(joinList(entry.isos))],
        ['Trades', escapeHtml(joinList(entry.trade_types))],
        ['Weather stack', escapeHtml(joinList(entry.weather_stack))],
        ['LinkedIn', entry.linkedin ? `<a href="${escapeAttr(entry.linkedin)}">${escapeHtml(entry.linkedin)}</a>` : '(not provided)'],
        ['EOI', entry.eoi ? 'yes' : 'no'],
        ['Source', escapeHtml(entry.source || 'call-page')],
    ];
    if (entry.utm_source || entry.utm_campaign) {
        rows.push(['UTM', escapeHtml(`source=${entry.utm_source || '-'} / medium=${entry.utm_medium || '-'} / campaign=${entry.utm_campaign || '-'}`)]);
    }
    const rowsHtml = rows.map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0; color:#666; vertical-align:top;">${escapeHtml(k)}</td><td style="padding:6px 0;">${v}</td></tr>`).join('');
    return `<!doctype html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #111; max-width: 600px; margin: 0 auto; padding: 24px;">
<h3 style="margin-top:0;">New intro call request <span style="color:#999;font-weight:400;">(EMC25 funnel)</span></h3>
<table style="border-collapse:collapse;">${rowsHtml}</table>
<p style="margin-top:24px; color:#666; font-size:13px;">They're being redirected to Calendly now. You'll get the Calendly booking notification once they pick a slot.</p>
</body></html>`;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

module.exports = { sendWelcome, sendNotification, sendIntroCallNotification };
