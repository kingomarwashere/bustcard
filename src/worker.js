import { handleAPI } from './api.js';
import { landingPage } from './landing.js';
import { dashboardPage } from './dashboard.js';
import { adminPage } from './admin.js';
import { lawyerClientPage } from './lawyer.js';
import { loginPage } from './login.js';
import { accountPage } from './account.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path.startsWith('/api/')) {
        return handleAPI(request, env, corsHeaders);
      }

      if (path === '/dashboard' || path === '/dashboard/') {
        return new Response(dashboardPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/login' || path === '/login/') {
        return new Response(loginPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/account' || path === '/account/') {
        return new Response(accountPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      if (path === '/admin' || path === '/admin/') {
        return new Response(adminPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // /lawyer/:token — client signup with lawyer pre-filled
      if (path.startsWith('/lawyer/')) {
        const token = path.replace('/lawyer/', '').replace(/\/$/, '');
        const lawyer = token ? await env.DB.prepare(
          'SELECT name, firm, phone FROM lawyers WHERE token = ?'
        ).bind(token).first() : null;
        if (!lawyer) {
          return new Response('Lawyer link not found.', { status: 404 });
        }
        return new Response(lawyerClientPage(lawyer), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // /cancel/:token — deadman switch cancel link
      if (path.startsWith('/cancel/')) {
        const token = path.replace('/cancel/', '');
        return handleCancel(token, env);
      }

      return new Response(landingPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },

  // Cron: runs every minute to fire expired deadman switches
  async scheduled(event, env, ctx) {
    const now = new Date().toISOString();
    const due = await env.DB.prepare(`
      SELECT d.*, u.name, u.phone as user_phone
      FROM deadman_switches d
      JOIN users u ON u.id = d.user_id
      WHERE d.fires_at <= ? AND d.cancelled = 0 AND d.fired = 0 AND u.active = 1
    `).bind(now).all();

    for (const sw of (due.results || [])) {
      const contacts = await env.DB.prepare(
        'SELECT * FROM contacts WHERE user_id = ? ORDER BY sort_order'
      ).bind(sw.user_id).all();

      if (!contacts.results?.length) continue;

      const firedAt = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
      const locationLine = sw.location ? `Location: ${sw.location}. ` : '';
      const messageLine = sw.message ? `Their message: "${sw.message}" ` : '';

      const smsBody =
        `DEADMAN ALERT: ${sw.name} set an automatic check-in and did not cancel it. ` +
        `${locationLine}` +
        `Triggered: ${firedAt} AEST. ` +
        `${messageLine}` +
        `They may be in custody or need help. Legal help: Legal Aid in your state · ALS 1800 765 767.`;

      for (const contact of contacts.results) {
        try {
          await sendSMS(env, contact.phone, smsBody);
        } catch (_) {}
      }

      await env.DB.prepare(
        'UPDATE deadman_switches SET fired = 1 WHERE id = ?'
      ).bind(sw.id).run();

      await env.DB.prepare(
        'INSERT INTO notifications (user_id, contacts_notified, status) VALUES (?, ?, ?)'
      ).bind(sw.user_id, contacts.results.length, 'deadman').run();
    }
  },
};

async function handleCancel(token, env) {
  const html = (msg, color) => new Response(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>1800 BUSTED — Cancel Switch</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{font-family:'Roboto Mono',monospace;background:#000;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
  .box{border:1px solid ${color};padding:40px;max-width:460px;text-align:center;}
  .label{font-size:.65rem;text-transform:uppercase;letter-spacing:.15em;color:${color};margin-bottom:16px;}
  h1{font-size:1.6rem;font-weight:700;margin-bottom:12px;}
  p{font-size:.85rem;color:#aaa;line-height:1.7;}
  a{color:${color};text-decoration:none;font-size:.8rem;display:block;margin-top:24px;}
</style></head><body>
<div class="box">
  <div class="label">// 1800 BUSTED</div>
  <h1>${msg.title}</h1>
  <p>${msg.body}</p>
  <a href="/">← BACK TO 1800 BUSTED</a>
</div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  if (!token) return html({ title: 'Invalid link.', body: 'This cancel link is not valid.' }, '#ff4444');

  const sw = await env.DB.prepare(
    'SELECT * FROM deadman_switches WHERE cancel_token = ?'
  ).bind(token).first();

  if (!sw) return html({ title: 'Not found.', body: 'This cancel link is not valid or has already been used.' }, '#ff4444');
  if (sw.fired) return html({ title: 'Already fired.', body: 'This switch already triggered before you cancelled it. Your contacts have been notified.' }, '#ff4444');
  if (sw.cancelled) return html({ title: 'Already cancelled.', body: 'This switch was already cancelled. You\'re good.' }, '#11cc77');

  await env.DB.prepare(
    'UPDATE deadman_switches SET cancelled = 1 WHERE cancel_token = ?'
  ).bind(token).run();

  return html({ title: 'Switch cancelled.', body: 'Your deadman switch has been cancelled. Your contacts will not be alerted.' }, '#11cc77');
}

async function sendSMS(env, to, body) {
  if (!env.TELNYX_API_KEY || !env.TELNYX_FROM_NUMBER) {
    console.log(`[SMS stub] To: ${to} | Body: ${body}`);
    return;
  }
  const res = await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: env.TELNYX_FROM_NUMBER, to, text: body }),
  });
  if (!res.ok) throw new Error(`Telnyx SMS error: ${res.status}`);
}
