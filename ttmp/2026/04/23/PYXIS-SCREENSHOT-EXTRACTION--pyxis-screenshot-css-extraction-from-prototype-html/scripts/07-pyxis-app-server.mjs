#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = '/home/manuel/code/wesen/2026-04-23--pyxis';
const dist = `${repoRoot}/web/packages/pyxis-user-site/dist`;
const port = Number(process.env.PYXIS_APP_PORT || 8790);

function flyer(title, bg = '#C8270D', fg = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900"><rect width="600" height="900" fill="${bg}"/><text x="300" y="410" text-anchor="middle" fill="${fg}" font-family="Georgia,serif" font-size="54" font-weight="700">${escapeXml(title)}</text><text x="300" y="470" text-anchor="middle" fill="${fg}" opacity="0.8" font-family="Inter,Arial,sans-serif" font-size="22">pyxis placeholder</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[ch]));
}

const shows = [
  { id: 42, artist: 'Burial Hex', date: '2025-05-02', doors_time: '8:00 PM', start_time: '9:00 PM', age: '21+', price: '$12 adv / $15 door', genre: 'Darkwave / Ritual Ambient', description: "Cole Coonce's long-running ritual electronics project. Heavy drones, processed vocals, and an immersive ceremony-like performance. Support TBA.", lineup: [{ artist: 'Burial Hex', role: 'headline', start_time: '9:00 PM' }], flyer_url: flyer('Burial Hex', '#3D0505'), status: 'confirmed', artist_id: 101, created_at: '2025-04-01T00:00:00Z', updated_at: '2025-04-01T00:00:00Z' },
  { id: 43, artist: 'Moor Mother', date: '2025-05-09', doors_time: '7:00 PM', start_time: '8:00 PM', age: 'All Ages', price: '$15', genre: 'Experimental / Noise Poetry', description: 'Philadelphia-based poet, musician, and activist Camae Ayewa performing as Moor Mother. Raw, confrontational, essential.', lineup: [{ artist: 'Moor Mother', role: 'headline', start_time: '8:00 PM' }], flyer_url: flyer('Moor Mother', '#682046'), status: 'confirmed', artist_id: 102, created_at: '2025-04-02T00:00:00Z', updated_at: '2025-04-02T00:00:00Z' },
  { id: 44, artist: 'Cygnus + Guests', date: '2025-05-17', doors_time: '9:00 PM', start_time: '10:00 PM', age: '18+', price: '$8', genre: 'Techno', description: 'Cygnus brings his signature hybrid live/DJ set of hard techno and electro, joined by local guests TBA. Dance floor in full effect.', lineup: [{ artist: 'Cygnus', role: 'headline', start_time: '11:00 PM' }, { artist: 'DJ TBA', role: 'dj', start_time: '10:00 PM' }], flyer_url: flyer('Cygnus', '#081118'), status: 'confirmed', artist_id: 103, created_at: '2025-04-03T00:00:00Z', updated_at: '2025-04-03T00:00:00Z' },
  { id: 45, artist: 'Open Mic Night', date: '2025-05-23', doors_time: '7:00 PM', age: 'All Ages', price: 'Free', genre: 'Open Format', description: "Monthly open mic. All formats welcome — music, spoken word, performance, whatever you've got. Sign up at the door from 6:30.", status: 'confirmed', created_at: '2025-04-04T00:00:00Z', updated_at: '2025-04-04T00:00:00Z' },
  { id: 46, artist: 'Zola Jesus', date: '2025-06-06', doors_time: '8:00 PM', start_time: '9:00 PM', age: '21+', price: '$20', genre: 'Art Pop / Darkwave', description: 'Nika Roza Danilova returns to Providence on her headline tour. One of the most powerful live performers working today.', lineup: [{ artist: 'Zola Jesus', role: 'headline', start_time: '9:00 PM' }], flyer_url: flyer('Zola Jesus', '#2b1020'), status: 'confirmed', artist_id: 104, created_at: '2025-04-05T00:00:00Z', updated_at: '2025-04-05T00:00:00Z' },
  { id: 47, artist: 'Orphx', date: '2025-07-04', doors_time: '9:00 PM', start_time: '10:00 PM', age: '18+', price: '$12', genre: 'EBM / Industrial', description: 'Canadian EBM veterans Orphx make a rare US appearance. Driving beats, sharp synths, a wall of sound.', lineup: [{ artist: 'Orphx', role: 'headline', start_time: '10:00 PM' }], flyer_url: flyer('Orphx', '#111111'), status: 'confirmed', artist_id: 105, created_at: '2025-04-06T00:00:00Z', updated_at: '2025-04-06T00:00:00Z' },
];

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(data) });
  res.end(data);
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === '/api/public/shows') return sendJson(res, 200, shows);
  const showMatch = url.pathname.match(/^\/api\/public\/shows\/(\d+)$/);
  if (showMatch) {
    const show = shows.find(s => s.id === Number(showMatch[1]));
    return show ? sendJson(res, 200, show) : sendJson(res, 404, { error: { code: 'NOT_FOUND', message: 'Show not found' } });
  }
  let filePath = path.join(dist, decodeURIComponent(url.pathname));
  if (url.pathname === '/' || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(dist, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': mime[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log(`pyxis app server listening on http://localhost:${port}`));
