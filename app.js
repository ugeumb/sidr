/* SIDR UGE - Student Internship Daily Report by UGE. Frontend PWA (tanpa build). */
(function () {
'use strict';

var CFG = window.SIDR_CONFIG || {};
var APP = document.getElementById('app');
var S = { token: lsGet('sidr_token'), user: null, cfg: null, offset: 0, view: '', sub: '', home: null, rep: null, pad: null, installEv: null };

/* ---------- util ---------- */
function lsGet(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
function lsSet(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { } }
function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function $(id) { return document.getElementById(id); }
function val(id) { var e = $(id); return e ? e.value : ''; }
var toastT;
function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 3200); }
function setBusy(b, txt) { if (!b) return; if (!b._h) b._h = b.innerHTML; b.disabled = true; b.innerHTML = '<span class="spin"></span> ' + esc(txt || 'Memproses...'); }
function unBusy(b) { if (!b) return; b.disabled = false; if (b._h) b.innerHTML = b._h; b._h = null; }
function msg(id, type, text) { var e = $(id); if (!e) return; e.innerHTML = text ? '<div class="msg ' + type + '">' + esc(text) + '</div>' : ''; }

var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
var BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
function p2(n) { return (n < 10 ? '0' : '') + n; }
function pd(s) { var m = String(s).split('-'); return new Date(Date.UTC(+m[0], +m[1] - 1, +m[2])); }
function fd(d) { return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate()); }
function addD(s, n) { var d = pd(s); d.setUTCDate(d.getUTCDate() + n); return fd(d); }
function tgl(s) { var d = pd(s); return HARI[d.getUTCDay()] + ', ' + d.getUTCDate() + ' ' + BLN[d.getUTCMonth()].substr(0, 3) + ' ' + d.getUTCFullYear(); }
function tglS(s) { var d = pd(s); return d.getUTCDate() + ' ' + BLN[d.getUTCMonth()].substr(0, 3) + ' ' + d.getUTCFullYear(); }
function tglL(s) { var d = pd(s); return d.getUTCDate() + ' ' + BLN[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
function mondayOf(s) { var w = pd(s).getUTCDay(); return addD(s, w === 0 ? -6 : 1 - w); }
function nowJkt() {
  var d = new Date(Date.now() + S.offset);
  var f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(d), o = {};
  f.forEach(function (x) { o[x.type] = x.value; });
  var h = o.hour === '24' ? '00' : o.hour;
  return { date: o.year + '-' + o.month + '-' + o.day, time: h + ':' + o.minute, sec: o.second };
}
var ICON = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.4"/><path d="M3 4v4h4"/><path d="M12 7v5l3 2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  week: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M8 14l2.5 2.5L16 12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>',
  today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><circle cx="12" cy="15" r="2"/></svg>'
};

/* ---------- api ---------- */
async function api(action, payload, opt) {
  if (!CFG.API_URL || CFG.API_URL.indexOf('GANTI_') === 0) throw new Error('Backend belum disambungkan. Isi API_URL di config.js.');
  var ctl = new AbortController(), to = setTimeout(function () { ctl.abort(); }, (opt && opt.timeout) || 60000), r;
  try {
    r = await fetch(CFG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ action: action, token: S.token }, payload || {})), signal: ctl.signal, redirect: 'follow' });
  } catch (e) {
    throw new Error(e && e.name === 'AbortError' ? 'Server tidak merespons. Coba lagi.' : 'Tidak dapat terhubung ke server. Periksa koneksi internet.');
  } finally { clearTimeout(to); }
  var j;
  try { j = await r.json(); } catch (e) { throw new Error('Respons server tidak valid. Pastikan deployment Apps Script berakses "Siapa saja" dan memakai versi terbaru.'); }
  if (!j.ok) {
    if (j.code === 'AUTH') { logout(true); }
    var er = new Error(j.error || 'Terjadi kesalahan.'); er.code = j.code; throw er;
  }
  return j.data;
}

/* ---------- session ---------- */
function logout(expired) {
  S.token = ''; S.user = null; lsSet('sidr_token', '');
  viewLogin(expired ? 'Sesi berakhir. Silakan masuk kembali.' : '');
}
async function boot() {
  if (!S.token) return viewLogin();
  try {
    var d = await api('me');
    S.user = d.user; S.cfg = d.config; S.offset = d.serverMs - Date.now();
    if (d.token) { S.token = d.token; lsSet('sidr_token', d.token); }
    start();
  } catch (e) {
    if (S.token) {
      APP.innerHTML = '<div class="login"><div class="box"><div class="hd"><img src="icons/logo.png" alt="UMB"><h1>Student Internship Daily Report by UGE</h1></div><div class="card"><div class="msg err">' + esc(e.message) + '</div><button class="btn full mt" id="b-retry">Coba lagi</button></div></div></div>';
      $('b-retry').onclick = function () { APP.innerHTML = '<div class="boot"><p>Memuat aplikasi...</p></div>'; boot(); };
    }
  }
}
function start() {
  if (S.user.must_change) return viewChangePw(true);
  S.view = S.user.role === 'peserta' ? 'home' : 'hariini'; S.sub = '';
  shell();
}

/* ---------- login ---------- */
function viewLogin(m) {
  document.title = 'Student Internship Daily Report by UGE';
  APP.innerHTML = '<div class="login"><div class="box"><div class="hd"><img src="icons/logo.png" alt="UMB"><h1>Student Internship Daily Report by UGE</h1><p>UMB Global Engagement</p></div>' +
    '<form class="card" id="f-login" autocomplete="on"><h2>Masuk</h2><label for="l-email">Email</label><input id="l-email" type="email" autocomplete="username" inputmode="email" required>' +
    '<label for="l-pw">Password</label><input id="l-pw" type="password" autocomplete="current-password" required>' +
    '<div id="l-msg">' + (m ? '<div class="msg err">' + esc(m) + '</div>' : (!CFG.API_URL || CFG.API_URL.indexOf('GANTI_') === 0 ? '<div class="msg warn">Backend belum disambungkan. Isi API_URL di config.js.</div>' : '')) + '</div>' +
    '<button class="btn full mt" type="submit" id="l-btn">Masuk</button>' +
    '<p class="xs mut mt">Login pertama memakai password bawaan dari admin, lalu Anda akan diminta menggantinya.</p></form></div></div>';
}
async function doLogin(btn) {
  msg('l-msg', '', '');
  setBusy(btn, 'Memeriksa...');
  try {
    var d = await api('login', { email: val('l-email'), password: val('l-pw') });
    S.token = d.token; lsSet('sidr_token', d.token); S.user = d.user;
    var me = await api('me'); S.cfg = me.config; S.offset = me.serverMs - Date.now();
    start();
  } catch (e) { msg('l-msg', 'err', e.message); unBusy(btn); }
}

/* ---------- ganti password ---------- */
function viewChangePw(forced) {
  var f = '<form class="card" id="f-pw"><h2>' + (forced ? 'Buat password baru' : 'Ganti password') + '</h2>' +
    (forced ? '<p class="sm mut">Demi keamanan, Anda wajib mengganti password bawaan sebelum memakai aplikasi.</p>' : '') +
    '<label for="p-old">Password lama</label><input id="p-old" type="password" autocomplete="current-password" required>' +
    '<label for="p-new">Password baru (min. 8 karakter)</label><input id="p-new" type="password" autocomplete="new-password" required minlength="8">' +
    '<label for="p-new2">Ulangi password baru</label><input id="p-new2" type="password" autocomplete="new-password" required minlength="8">' +
    '<div id="p-msg"></div><button class="btn full mt" type="submit" id="p-btn">Simpan password</button>' +
    (forced ? '<button class="btn ghost full mt2" type="button" data-a="logout">Keluar</button>' : '') + '</form>';
  if (forced) APP.innerHTML = '<div class="login"><div class="box"><div class="hd"><img src="icons/logo.png" alt="UMB"><h1>Halo, ' + esc(S.user.nama.split(',')[0]) + '</h1></div>' + f + '</div></div>';
  return f;
}
async function doChangePw(btn) {
  var n1 = val('p-new'), n2 = val('p-new2');
  if (n1 !== n2) return msg('p-msg', 'err', 'Password baru dan ulangannya tidak sama.');
  setBusy(btn, 'Menyimpan...');
  try {
    var d = await api('changePassword', { oldPassword: val('p-old'), newPassword: n1 });
    S.token = d.token; lsSet('sidr_token', d.token); S.user = d.user;
    toast('Password berhasil diganti.');
    start();
  } catch (e) { msg('p-msg', 'err', e.message); unBusy(btn); }
}

/* ---------- shell ---------- */
function navItems() {
  if (S.user.role === 'peserta') return [['home', 'Beranda', ICON.home], ['riwayat', 'Riwayat', ICON.hist], ['akun', 'Akun', ICON.user]];
  return [['hariini', 'Hari Ini', ICON.today], ['mingguan', 'Mingguan', ICON.week], ['bulanan', 'Bulanan', ICON.mail], ['kelola', 'Kelola', ICON.set], ['akun', 'Akun', ICON.user]];
}
function shell() {
  var roleLbl = { peserta: 'Peserta Magang', supervisor: 'Supervisor', superadmin: 'Superadmin' }[S.user.role];
  APP.innerHTML = '<div class="shell"><header class="top"><img src="icons/logo.png" alt="UMB"><div><div class="t1">Student Internship Daily Report by UGE</div><div class="t2">' + esc(S.user.nama.split(',')[0]) + ' · ' + roleLbl + '</div></div>' +
    '<div class="clock"><b id="clk">--:--</b><span id="clkd"></span></div></header><main id="main"></main><nav class="bar" id="nav"></nav></div>';
  $('nav').innerHTML = navItems().map(function (n) { return '<button data-a="nav" data-v="' + n[0] + '" id="nv-' + n[0] + '">' + n[2] + '<span>' + n[1] + '</span></button>'; }).join('');
  go(S.view);
}
function go(v, sub) {
  S.view = v; if (sub !== undefined) S.sub = sub;
  navItems().forEach(function (n) { var b = $('nv-' + n[0]); if (b) b.classList.toggle('on', n[0] === v); });
  var main = $('main'); if (!main) return;
  main.innerHTML = '<div class="empty"><span class="spin dark"></span></div>';
  window.scrollTo(0, 0);
  var fn = VIEWS[v]; if (fn) fn();
}
setInterval(function () {
  var c = $('clk'); if (!c || !S.user) return;
  var n = nowJkt(); c.textContent = n.time + ':' + n.sec; $('clkd').textContent = tglS(n.date);
  if (S.view === 'home' && S.home && S._lastMin !== n.time) { S._lastMin = n.time; refreshHomeButtons(); }
}, 1000);

/* ---------- komponen: pad tanda tangan ---------- */
function SigPad(canvas, wrap) {
  var ctx = canvas.getContext('2d'), drawing = false, last = null, pts = 0, self = this;
  function fit() {
    var r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0a0a0a';
  }
  function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener('pointerdown', function (e) { e.preventDefault(); canvas.setPointerCapture(e.pointerId); drawing = true; last = pos(e); ctx.beginPath(); ctx.arc(last.x, last.y, 1.2, 0, 6.3); ctx.fillStyle = '#0a0a0a'; ctx.fill(); pts++; wrap.classList.add('has'); });
  canvas.addEventListener('pointermove', function (e) {
    if (!drawing) return; e.preventDefault();
    var p = pos(e), mx = (last.x + p.x) / 2, my = (last.y + p.y) / 2;
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.quadraticCurveTo(last.x, last.y, mx, my); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p; pts++;
  });
  function up() { drawing = false; }
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('pointerleave', up);
  this.clear = function () { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore(); pts = 0; wrap.classList.remove('has'); };
  this.empty = function () { return pts < 12; };
  this.data = function () {
    var w = canvas.width, h = canvas.height, d = ctx.getImageData(0, 0, w, h).data, x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0 || y1 <= y0) return '';
    var pad = 8; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
    var cw = x1 - x0 + 1, ch = y1 - y0 + 1, sc = Math.min(1, 420 / cw), o = document.createElement('canvas');
    o.width = Math.max(1, Math.round(cw * sc)); o.height = Math.max(1, Math.round(ch * sc));
    o.getContext('2d').drawImage(canvas, x0, y0, cw, ch, 0, 0, o.width, o.height);
    return o.toDataURL('image/png');
  };
  fit(); this.fit = fit;
}
function sigHtml(id) { return '<div class="sigwrap" id="' + id + '-w"><canvas id="' + id + '"></canvas><div class="hint">Tanda tangan di sini dengan jari atau stylus</div></div><div class="row sp mt2"><span class="xs mut">Tanda tangan wajib diisi</span><button class="btn ghost sm" type="button" data-a="sigclear" data-id="' + id + '">Hapus</button></div>'; }
function mkPad(id) { var c = $(id); S.pads = S.pads || {}; S.pads[id] = new SigPad(c, $(id + '-w')); return S.pads[id]; }

/* ---------- peserta: beranda ---------- */
var VIEWS = {};
VIEWS.home = async function () {
  try { await loadHome(); } catch (e) { $('main').innerHTML = '<div class="card"><div class="msg err">' + esc(e.message) + '</div><button class="btn full mt" data-a="reload">Coba lagi</button></div>'; }
};
async function loadHome() {
  var d = await api('today');
  S.home = d; S.cfg = d.config; S.offset = d.serverMs - Date.now();
  if (!S.rep || S.rep.tanggal !== d.tanggal) S.rep = { tanggal: d.tanggal, status: {}, note: {}, own: [] };
  renderHome();
}
function dayIndex(tg) { var p = String(tg || '').split('-'); return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
function dailyCard(tg) {
  var M = window.SIDR_MOTIV || [], A = window.SIDR_AYAT || [], n = dayIndex(tg || (S.home && S.home.tanggal) || todayStr());
  if (!M.length || !A.length) return '';
  var m = M[n % M.length], a = A[n % A.length];
  return '<div class="card daily"><div class="dq">' + esc(m) + '</div><div class="da" dir="rtl" lang="ar">' + esc(a.ar) + '</div><div class="di">' + esc(a.id) + '</div><div class="dr">' + esc(a.ref) + '</div></div>';
}
function todayStr() { var n = nowJkt(); return n.date; }
function greet(type) {
  var nm = esc(String(S.user.nama || '').split(',')[0].split(' ')[0]);
  var h = type === 'masuk' ?
    '<div class="greet"><h2>Assalamualaikum, ' + nm + '.</h2><p>Terima kasih sudah absen. Awali magang hari ini dengan berdoa ya. Semoga hari ini diberi kelancaran.</p><button class="btn full mt" data-a="closemodal">Aamiin</button></div>' :
    '<div class="greet"><h2>Alhamdulillah.</h2><p>Terima kasih sudah memberikan dedikasi terbaikmu hari ini di tempat kerja. Selamat kembali ke rumah dan beristirahat. Sampai jumpa esok hari.</p><p class="xs mut">Jangan lupa mengirim laporan KPI harian bila belum.</p><button class="btn full mt" data-a="closemodal">Sampai jumpa</button></div>';
  var m = modal(h); m.classList.add('center');
}
function pillFor(st) {
  var m = { 'Hadir': 'ok', 'Tepat Waktu': 'ok', 'Terkirim': 'ok', 'Terlambat': 'warn', 'Dikembalikan': 'warn', 'Izin': 'warn', 'Sakit': 'warn', 'Tidak Hadir': 'bad', 'Libur': 'info', 'Disetujui': 'ok' };
  return '<span class="pill ' + (m[st] || '') + '">' + esc(st) + '</span>';
}
function renderHome() {
  var h = S.home, r = h.rec, c = h.config, main = $('main'); if (!main) return;
  var off = r.status === 'Libur' || r.status === 'Izin' || r.status === 'Sakit';
  var html = dailyCard(h.tanggal) + '<div class="card"><div class="row sp"><div><h2>' + esc(tgl(h.tanggal)) + '</h2><p class="sm mut">Titik absen: ' + esc(c.lokasi_nama) + ', radius ' + c.radius_m + ' m</p></div><button class="btn ghost sm" data-a="reload">Muat ulang</button></div></div>';
  if (!h.workday) html += '<div class="card"><div class="empty">Hari ini bukan hari kerja. Selamat beristirahat.</div></div>';
  else if (off) html += '<div class="card"><div class="row"><h2>Hari ini ' + esc(r.status) + '</h2></div><p class="sm mut mt2">' + esc(r.keterangan || 'Tidak perlu absen dan melapor.') + '</p></div>';
  else {
    html += '<div class="card"><div class="step"><div class="dot ' + (r.masuk ? 'done' : '') + '">1</div><div class="grow"><div class="row sp"><h2>Absen pagi</h2>' + (r.masuk ? pillFor(r.statusMasuk) : '') + '</div>' +
      (r.masuk ? '<p class="sm mt2">Tercatat pukul <b>' + esc(r.masuk) + '</b> (jarak ' + esc(r.jarakMasuk) + ' m dari titik).</p>' :
        '<p class="sm mut mt2">Batas tepat waktu pukul ' + esc(c.jam_masuk_maks) + '. Aktifkan GPS lalu tekan tombol.</p><button class="btn big full mt" id="b-masuk" data-a="checkin" data-t="masuk">Absen Pagi</button>') +
      '<div id="m-masuk"></div></div></div></div>';
    html += '<div class="card"><h2>Tugas dari supervisor hari ini</h2>' + (r.assigned.length ? '<ol class="sm" style="padding-left:20px;margin:8px 0 0">' + r.assigned.map(function (t) { return '<li style="margin:4px 0">' + esc(t.judul) + (t.detail ? '<div class="xs mut">' + esc(t.detail) + '</div>' : '') + '</li>'; }).join('') + '</ol>' : '<p class="sm mut mt2">Belum ada tugas yang diberikan. Anda tetap bisa mencatat kegiatan sendiri saat laporan sore.</p>') + '</div>';
    html += '<div class="card"><div class="step"><div class="dot ' + (r.pulang ? 'done' : '') + '">2</div><div class="grow"><div class="row sp"><h2>Absen sore</h2>' + (r.pulang ? pillFor('Hadir') : '') + '</div>' +
      (r.pulang ? '<p class="sm mt2">Tercatat pukul <b>' + esc(r.pulang) + '</b> (jarak ' + esc(r.jarakPulang) + ' m dari titik).</p>' :
        '<p class="sm mut mt2" id="t-pulang">Dibuka mulai pukul ' + esc(c.jam_pulang_min) + '.</p><button class="btn big full mt" id="b-pulang" data-a="checkin" data-t="pulang">Absen Sore</button>') +
      '<div id="m-pulang"></div></div></div></div>';
    html += '<div class="card" id="rep-card"><div class="step"><div class="dot ' + (r.laporan === 'Terkirim' ? 'done' : '') + '">3</div><div class="grow"><div class="row sp"><h2>Laporan KPI harian</h2>' + (r.laporan !== 'Belum' ? pillFor(r.laporan) : '') + '</div>' + repBody(r) + '</div></div></div>';
  }
  main.innerHTML = html;
  refreshHomeButtons();
  if (r.pulang && r.laporan !== 'Terkirim' && !off) { initRepPad(); }
}
function repBody(r) {
  if (r.laporan === 'Terkirim') {
    return '<p class="sm mt2 mut">Laporan terkirim. Terima kasih.</p><ul class="items sm" style="list-style:none;padding:0;margin:8px 0 0">' + r.items.map(function (it) {
      return '<li style="padding:4px 0;border-top:1px dashed var(--line)">' + esc(it.judul) + ' <span class="pill ' + (it.status === 'Selesai' ? 'ok' : 'warn') + '">' + esc(it.status) + '</span>' + (it.own ? ' <span class="pill">tambahan</span>' : '') + (it.catatan ? '<div class="xs mut">' + esc(it.catatan) + '</div>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  if (!r.pulang) return '<p class="sm mut mt2">Formulir terbuka setelah Anda absen sore.</p>';
  var h = r.laporan === 'Dikembalikan' ? '<div class="msg warn">Laporan dikembalikan supervisor' + (r.catatanSv ? ': ' + esc(r.catatanSv) : '') + '. Silakan perbaiki dan kirim ulang.</div>' : '';
  h += '<p class="sm mut mt2">Tandai tiap tugas, tambahkan kegiatan lain bila ada, lalu tanda tangan.</p>';
  r.assigned.forEach(function (t) {
    var st = S.rep.status[t.id] || '';
    h += '<div class="task"><div class="b sm">' + esc(t.judul) + '</div>' + (t.detail ? '<div class="xs mut">' + esc(t.detail) + '</div>' : '') +
      '<div class="seg"><button type="button" class="' + (st === 'Selesai' ? 'sel y' : '') + '" data-a="setst" data-id="' + esc(t.id) + '" data-s="Selesai">Selesai</button><button type="button" class="' + (st === 'Belum' ? 'sel n' : '') + '" data-a="setst" data-id="' + esc(t.id) + '" data-s="Belum">Belum</button></div>' +
      '<input type="text" class="mt2" placeholder="Catatan (opsional)" maxlength="300" data-n="' + esc(t.id) + '" value="' + esc(S.rep.note[t.id] || '') + '"></div>';
  });
  h += '<label>Kegiatan lain di luar tugas (opsional)</label><div id="own-list"></div><button class="btn sec sm mt2" type="button" data-a="addown">+ Tambah kegiatan</button>';
  h += '<label class="mt">Tanda tangan</label>' + sigHtml('sig-p');
  h += '<div id="r-msg"></div><button class="btn big full mt" type="button" id="b-send" data-a="sendrep">Kirim Laporan</button>';
  return h;
}
function renderOwn() {
  var el = $('own-list'); if (!el) return;
  el.innerHTML = S.rep.own.map(function (o, i) {
    return '<div class="task"><input type="text" placeholder="Kegiatan yang Anda kerjakan" maxlength="250" data-own="' + i + '" data-f="judul" value="' + esc(o.judul) + '"><input type="text" class="mt2" placeholder="Catatan (opsional)" maxlength="300" data-own="' + i + '" data-f="catatan" value="' + esc(o.catatan) + '"><button class="btn ghost sm mt2" type="button" data-a="delown" data-i="' + i + '">Hapus</button></div>';
  }).join('');
}
function initRepPad() { renderOwn(); if ($('sig-p')) mkPad('sig-p'); }
function refreshHomeButtons() {
  var h = S.home; if (!h) return;
  var n = nowJkt(), c = h.config, r = h.rec;
  var bm = $('b-masuk'), bp = $('b-pulang'), tp = $('t-pulang');
  if (bm && !bm._h) { var okm = n.time >= c.jam_masuk_buka; bm.disabled = !okm; var mm = $('m-masuk'); if (mm && !okm && !mm.innerHTML) mm.innerHTML = '<p class="xs mut mt2">Dibuka pukul ' + esc(c.jam_masuk_buka) + '.</p>'; }
  if (bp) { var okp = !!r.masuk && n.time >= c.jam_pulang_min; if (!bp._h) bp.disabled = !okp; if (tp) tp.textContent = !r.masuk ? 'Absen pagi dulu. Absen sore dibuka mulai pukul ' + c.jam_pulang_min + '.' : (n.time >= c.jam_pulang_min ? 'Sudah dibuka. Tekan tombol saat Anda akan pulang.' : 'Dibuka mulai pukul ' + c.jam_pulang_min + '.'); }
}
function getPos() {
  return new Promise(function (res, rej) {
    if (!navigator.geolocation) return rej(new Error('Perangkat atau browser ini tidak mendukung GPS.'));
    var best = null, wid, fin = false, to;
    function done() { if (fin) return; fin = true; navigator.geolocation.clearWatch(wid); clearTimeout(to); if (best) res(best); else rej(new Error('Lokasi tidak berhasil dibaca. Aktifkan GPS dan coba lagi di area terbuka.')); }
    wid = navigator.geolocation.watchPosition(function (p) {
      var c = p.coords; if (!best || c.accuracy < best.acc) best = { lat: c.latitude, lng: c.longitude, acc: c.accuracy };
      if (best.acc <= 30) done();
    }, function (err) {
      if (err.code === 1) { fin = true; clearTimeout(to); navigator.geolocation.clearWatch(wid); rej(new Error('Izin lokasi ditolak. Izinkan akses lokasi untuk situs ini di pengaturan browser, lalu coba lagi.')); }
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
    to = setTimeout(done, 12000);
  });
}
async function doCheckin(btn) {
  var t = btn.dataset.t, mid = 'm-' + t; msg(mid, '', '');
  setBusy(btn, 'Mengambil lokasi...');
  try {
    var p = await getPos();
    btn.innerHTML = '<span class="spin"></span> Memverifikasi...';
    var d = await api('checkin', { type: t, lat: p.lat, lng: p.lng, acc: p.acc });
    toast((t === 'masuk' ? 'Absen pagi' : 'Absen sore') + ' berhasil pukul ' + d.jam);
    await loadHome(); greet(t);
  } catch (e) { msg(mid, 'err', e.message); unBusy(btn); refreshHomeButtons(); }
}
async function sendReport(btn) {
  var r = S.home.rec, items = [], i;
  for (i = 0; i < r.assigned.length; i++) {
    var t = r.assigned[i], st = S.rep.status[t.id];
    if (!st) return msg('r-msg', 'err', 'Pilih Selesai atau Belum untuk tugas: ' + t.judul);
    items.push({ tid: t.id, status: st, catatan: S.rep.note[t.id] || '' });
  }
  S.rep.own.forEach(function (o) { if (o.judul.trim()) items.push({ own: true, judul: o.judul.trim(), catatan: o.catatan || '' }); });
  if (!items.length) return msg('r-msg', 'err', 'Isi minimal satu kegiatan.');
  var pad = S.pads['sig-p'];
  if (!pad || pad.empty()) return msg('r-msg', 'err', 'Tanda tangan belum diisi.');
  if (!confirm('Kirim laporan hari ini? Setelah terkirim tidak bisa diubah.')) return;
  setBusy(btn, 'Mengirim...'); msg('r-msg', '', '');
  try {
    await api('submitReport', { items: items, signature: pad.data() });
    toast('Laporan terkirim.'); S.rep = null; await loadHome();
  } catch (e) { msg('r-msg', 'err', e.message); unBusy(btn); }
}

/* ---------- peserta: riwayat ---------- */
VIEWS.riwayat = async function () {
  try {
    var d = await api('history');
    $('main').innerHTML = d.weeks.length ? d.weeks.map(function (w) { return weekCard(w, false); }).join('') : '<div class="card empty">Belum ada riwayat.</div>';
  } catch (e) { $('main').innerHTML = '<div class="card"><div class="msg err">' + esc(e.message) + '</div></div>'; }
};
function dayRow(d, sv) {
  var sub = '';
  if (d.status === 'Hadir') sub = esc(d.masuk || '-') + ' - ' + esc(d.pulang || '-') + (d.statusMasuk === 'Terlambat' ? ' · terlambat' : '');
  else if (d.keterangan) sub = esc(d.keterangan);
  var lap = d.status === 'Hadir' ? ' ' + (d.laporan === 'Terkirim' ? '<span class="pill ok">Laporan terkirim</span>' : d.laporan === 'Dikembalikan' ? '<span class="pill warn">Dikembalikan</span>' : '<span class="pill bad">Laporan belum</span>') : '';
  var h = '<div class="day"><div class="row sp wrap"><div><span class="b">' + esc(tgl(d.tanggal)) + '</span><div class="xs mut">' + sub + '</div></div><div>' + pillFor(d.status) + lap + '</div></div>';
  if (d.assigned.length || d.items.length) {
    h += '<details class="mt2"><summary class="sm">Rincian kegiatan' + (d.tugasTotal ? ' · tugas ' + d.tugasSelesai + '/' + d.tugasTotal : '') + (d.tambahan ? ' · tambahan ' + d.tambahan : '') + '</summary><ul class="items">';
    if (d.items.length) d.items.forEach(function (it) { h += '<li>' + esc(it.judul) + ' <span class="pill ' + (it.status === 'Selesai' ? 'ok' : 'warn') + '">' + esc(it.status) + '</span>' + (it.own ? ' <span class="pill">tambahan</span>' : '') + (it.catatan ? '<div class="xs mut">' + esc(it.catatan) + '</div>' : '') + '</li>'; });
    else d.assigned.forEach(function (t) { h += '<li>' + esc(t.judul) + ' <span class="pill">belum dilaporkan</span></li>'; });
    h += '</ul></details>';
  }
  return h + '</div>';
}
function weekCard(w, sv) {
  var r = w.rekap, pct = r.tugasTotal ? Math.round(r.tugasSelesai * 100 / r.tugasTotal) : 0, ws = w.weekStart;
  var h = '<div class="card"><div class="row sp wrap"><div><h2>' + (sv ? esc(w.nama) : 'Minggu ' + esc(tglS(ws))) + '</h2><p class="xs mut">' + esc(tglL(ws)) + ' - ' + esc(tglL(addD(ws, 4))) + '</p></div><div>' +
    (w.approval ? '<span class="pill ok">Disetujui ' + esc(w.approval.pada.substr(0, 10) ? tglS(w.approval.pada.substr(0, 10)) : '') + '</span>' : '<span class="pill warn">Belum disetujui</span>') + '</div></div>';
  h += '<div class="kpi mt"><div><b>' + r.hadir + '/' + r.hariKerja + '</b><span>Hadir</span></div><div><b>' + r.tugasSelesai + '/' + r.tugasTotal + '</b><span>Tugas selesai</span></div><div><b>' + r.laporan + '</b><span>Laporan terkirim</span></div></div>';
  if (r.tugasTotal) h += '<div class="prog mt"><i style="width:' + pct + '%"></i></div>';
  if (w.approval) h += '<div class="row mt wrap"><button class="btn line sm" data-a="pdf" data-k="weekly" data-id="' + esc(w.approval.id) + '">Unduh PDF mingguan</button><span class="xs mut">oleh ' + esc(w.approval.oleh) + '</span></div>';
  h += '<div class="days mt">' + w.days.map(function (d) { return dayRow(d, sv); }).join('') + '</div></div>';
  return h;
}
async function downloadPdf(btn) {
  var old = btn.innerHTML; setBusy(btn, 'Menyiapkan...');
  try {
    var d = await api('getPdf', { kind: btn.dataset.k, id: btn.dataset.id });
    var bin = atob(d.b64), arr = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    var url = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' })), a = document.createElement('a');
    a.href = url; a.download = d.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  } catch (e) { toast(e.message); }
  btn.disabled = false; btn.innerHTML = old; btn._h = null;
}

/* ---------- akun ---------- */
VIEWS.akun = function () {
  var u = S.user, inst = '';
  inst = '<div class="card"><h2>Pasang sebagai aplikasi</h2><p class="sm mut mt2">Agar muncul di layar utama seperti aplikasi biasa.</p>' +
    (S.installEv ? '<button class="btn full mt" data-a="install">Pasang aplikasi</button>' :
      '<p class="sm mt2"><b>Android (Chrome):</b> menu ⋮ lalu "Instal aplikasi" atau "Tambahkan ke layar utama".<br><b>iPhone (Safari):</b> tombol Bagikan lalu "Tambah ke Layar Utama".<br><b>Laptop (Chrome/Edge):</b> ikon pasang di kanan kolom alamat.</p>') + '</div>';
  $('main').innerHTML = '<div class="card"><h2>' + esc(u.nama) + '</h2><p class="sm mut">' + esc(u.email) + '</p><p class="mt2"><span class="pill info">' + esc({ peserta: 'Peserta Magang', supervisor: 'Supervisor', superadmin: 'Superadmin' }[u.role]) + '</span></p>' +
    (u.role === 'peserta' && u.sekolah ? '<p class="sm mt2">Sekolah: ' + esc(u.sekolah) + '</p>' : '') + '</div>' + viewChangePw(false) + inst +
    '<button class="btn red full" data-a="logout">Keluar</button><p class="xs mut mt" style="text-align:center">Student Internship Daily Report by UGE · UMB Global Engagement</p>';
};

/* ---------- supervisor: hari ini ---------- */
VIEWS.hariini = async function (tanggal) {
  var d = tanggal || S.sd || (S.cfg ? nowJkt().date : '');
  S.sd = d;
  try {
    var r = await api('svDay', { tanggal: d });
    S.day = r; S.tasks = r.tasks.map(function (t) { return { id: t.id, judul: t.judul, detail: t.detail || '', assignees: t.assignees.slice() }; });
    renderDay();
  } catch (e) { $('main').innerHTML = '<div class="card"><div class="msg err">' + esc(e.message) + '</div></div>'; }
};
function renderDay() {
  var r = S.day, h = dailyCard(todayStr()) + '<div class="card"><div class="row sp"><button class="btn ghost sm" data-a="daymv" data-n="-1">‹</button><div class="grow" style="text-align:center"><input type="date" id="sd-date" value="' + esc(r.tanggal) + '" style="text-align:center"></div><button class="btn ghost sm" data-a="daymv" data-n="1">›</button></div>' +
    '<p class="xs mut mt2" style="text-align:center">' + esc(r.hariNama) + (r.workday ? '' : ' · bukan hari kerja') + '</p></div>';
  h += '<div class="card"><h2>Tugas untuk tanggal ini</h2><p class="sm mut mt2">Tulis tugas, lalu pilih siapa yang mengerjakan. Tugas muncul di dashboard peserta.</p><div id="task-list"></div>' +
    '<div class="row wrap mt"><button class="btn sec sm" data-a="addtask">+ Tambah tugas</button></div><div id="t-msg"></div><button class="btn full mt" id="b-savetask" data-a="savetasks">Simpan tugas</button></div>';
  h += r.peserta.map(function (p) { return pesertaDayCard(p, r.tanggal); }).join('');
  $('main').innerHTML = h; renderTasks();
}
function renderTasks() {
  var el = $('task-list'); if (!el) return;
  if (!S.tasks.length) { el.innerHTML = '<div class="empty">Belum ada tugas pada tanggal ini.</div>'; return; }
  el.innerHTML = S.tasks.map(function (t, i) {
    return '<div class="task"><input type="text" placeholder="Contoh: Merapikan arsip MoU mitra" maxlength="250" data-t="' + i + '" data-f="judul" value="' + esc(t.judul) + '">' +
      '<div class="chips">' + S.day.peserta.map(function (p) { var on = t.assignees.indexOf(p.email) >= 0; return '<label class="chip ' + (on ? 'on' : '') + '" style="margin:0"><input type="checkbox" data-t="' + i + '" data-e="' + esc(p.email) + '" ' + (on ? 'checked' : '') + '>' + esc(p.nama.split(' ')[0]) + '</label>'; }).join('') + '</div>' +
      '<button class="btn ghost sm mt2" type="button" data-a="deltask" data-i="' + i + '">Hapus tugas</button></div>';
  }).join('');
}
function pesertaDayCard(p, d) {
  var r = p.rec, off = r.status === 'Libur' || r.status === 'Izin' || r.status === 'Sakit';
  var h = '<div class="card"><div class="row sp wrap"><h2>' + esc(p.nama) + '</h2><div>' + pillFor(r.status) + '</div></div>';
  if (!off) {
    h += '<p class="sm mt2">Masuk <b>' + esc(r.masuk || '-') + '</b>' + (r.statusMasuk ? ' ' + pillFor(r.statusMasuk) : '') + ' · Pulang <b>' + esc(r.pulang || '-') + '</b>' + (r.jarakMasuk ? ' · jarak ' + esc(r.jarakMasuk) + ' m' : '') + '</p>';
    if (r.catatanAbsen) h += '<p class="xs mut">' + esc(r.catatanAbsen) + '</p>';
    h += '<p class="sm mt2">Laporan KPI: ' + (r.laporan === 'Belum' ? '<span class="pill">belum dikirim</span>' : pillFor(r.laporan)) + (r.tugasTotal ? ' · tugas ' + r.tugasSelesai + '/' + r.tugasTotal : '') + '</p>';
    if (r.items.length) h += '<ul class="items sm" style="list-style:none;padding:0;margin:6px 0 0">' + r.items.map(function (it) { return '<li style="padding:3px 0;border-top:1px dashed var(--line)">' + esc(it.judul) + ' <span class="pill ' + (it.status === 'Selesai' ? 'ok' : 'warn') + '">' + esc(it.status) + '</span>' + (it.own ? ' <span class="pill">tambahan</span>' : '') + (it.catatan ? '<div class="xs mut">' + esc(it.catatan) + '</div>' : '') + '</li>'; }).join('') + '</ul>';
    h += '<div class="row wrap mt">' + (r.laporan === 'Terkirim' ? '<button class="btn line sm" data-a="retrep" data-e="' + esc(p.email) + '" data-d="' + esc(d) + '">Kembalikan laporan</button>' : '') +
      '<button class="btn ghost sm" data-a="fixabs" data-e="' + esc(p.email) + '" data-d="' + esc(d) + '" data-m="' + esc(r.masuk) + '" data-p="' + esc(r.pulang) + '" data-n="' + esc(p.nama) + '">Koreksi absen</button></div>';
  } else h += '<p class="sm mut mt2">' + esc(r.keterangan || '') + '</p>';
  return h + '</div>';
}

/* ---------- supervisor: mingguan ---------- */
VIEWS.mingguan = async function (ws) {
  S.sw = ws || S.sw || mondayOf(nowJkt().date);
  try {
    var r = await api('svWeek', { weekStart: S.sw }); S.week = r;
    var pend = r.peserta.filter(function (p) { return !p.approval; });
    var h = '<div class="card"><div class="row sp"><button class="btn ghost sm" data-a="wkmv" data-n="-7">‹</button><div style="text-align:center"><b>' + esc(tglL(r.weekStart)) + ' - ' + esc(tglL(addD(r.weekStart, 4))) + '</b></div><button class="btn ghost sm" data-a="wkmv" data-n="7">›</button></div>' +
      (pend.length ? '<button class="btn full mt" data-a="approvemodal" ' + (r.canApprove ? '' : 'disabled') + '>Setujui laporan minggu ini</button>' + (r.canApprove ? '' : '<p class="xs mut mt2" style="text-align:center">Persetujuan dibuka pada hari kerja terakhir minggu ini.</p>') : '<div class="msg ok">Semua laporan minggu ini sudah disetujui.</div>') + '</div>';
    h += r.peserta.map(function (p) { return weekCard(p, true); }).join('') || '<div class="card empty">Belum ada peserta.</div>';
    $('main').innerHTML = h;
  } catch (e) { $('main').innerHTML = '<div class="card"><div class="msg err">' + esc(e.message) + '</div></div>'; }
};
function modal(html) {
  closeModal();
  var m = document.createElement('div'); m.className = 'modal'; m.id = 'modal'; m.innerHTML = '<div class="sheet">' + html + '</div>';
  m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
  document.body.appendChild(m); return m;
}
function closeModal() { var m = $('modal'); if (m) m.remove(); if (S.pads) { delete S.pads['sig-a']; } }
function approveModal() {
  var r = S.week, h = '<h2>Setujui laporan mingguan</h2><p class="sm mut mt2">Periode ' + esc(tglL(r.weekStart)) + ' - ' + esc(tglL(addD(r.weekStart, 4))) + '. Setelah ditandatangani, PDF dibuat otomatis dan tersimpan.</p>';
  r.peserta.forEach(function (p, i) {
    var w = p.rekap.laporanBelum, warn = w ? '<div class="xs" style="color:var(--amb)">Ada ' + w + ' hari hadir tanpa laporan KPI. PDF akan mencatat "Laporan KPI tidak dikirim".</div>' : '';
    h += '<label class="chip ' + (p.approval ? '' : 'on') + '" style="display:flex;margin:8px 0;align-items:flex-start"><input type="checkbox" data-ap="' + esc(p.email) + '" ' + (p.approval ? '' : 'checked') + '><span><b>' + esc(p.nama) + '</b>' + (p.approval ? ' <span class="pill ok">sudah disetujui, akan dibuat ulang</span>' : '') +
      '<div class="xs mut">Hadir ' + p.rekap.hadir + '/' + p.rekap.hariKerja + ' · Tugas ' + p.rekap.tugasSelesai + '/' + p.rekap.tugasTotal + '</div>' + warn + '</span></label>';
  });
  h += '<label>Tanda tangan Anda</label>' + sigHtml('sig-a') + '<div id="a-msg"></div><div class="row mt"><button class="btn ghost" data-a="closemodal">Batal</button><button class="btn grow" id="b-approve" data-a="doapprove">Setujui dan buat PDF</button></div>';
  modal(h); mkPad('sig-a');
}
async function doApprove(btn) {
  var emails = Array.prototype.slice.call(document.querySelectorAll('[data-ap]')).filter(function (x) { return x.checked; }).map(function (x) { return x.dataset.ap; });
  if (!emails.length) return msg('a-msg', 'err', 'Pilih minimal satu peserta.');
  var pad = S.pads['sig-a']; if (!pad || pad.empty()) return msg('a-msg', 'err', 'Tanda tangan belum diisi.');
  setBusy(btn, 'Membuat PDF...'); msg('a-msg', '', '');
  try {
    await api('svApprove', { weekStart: S.sw, emails: emails, signature: pad.data() }, { timeout: 120000 });
    closeModal(); toast('Laporan disetujui. PDF tersimpan.'); VIEWS.mingguan(S.sw);
  } catch (e) { msg('a-msg', 'err', e.message); unBusy(btn); }
}

/* ---------- supervisor: bulanan ---------- */
VIEWS.bulanan = async function (ym) {
  S.sm = ym || S.sm || nowJkt().date.substr(0, 7);
  try {
    var r = await api('svMonth', { bulan: S.sm }); S.month = r;
    var h = '<div class="card"><label style="margin-top:0">Bulan</label><input type="month" id="sm-in" value="' + esc(r.bulan) + '"></div>';
    h += r.peserta.map(function (p, i) {
      var last = p.logs.length ? p.logs[p.logs.length - 1] : null;
      return '<div class="card"><div class="row sp wrap"><h2>' + esc(p.nama) + '</h2><span class="pill ' + (p.approvedWeeks ? 'ok' : 'warn') + '">' + p.approvedWeeks + ' minggu disetujui</span></div>' +
        '<p class="sm mut mt2">' + (p.sekolah ? esc(p.sekolah) + ' · ' : '') + 'Hadir ' + p.rekap.hadir + ' hari · Tugas ' + p.rekap.tugasSelesai + '/' + p.rekap.tugasTotal + '</p>' +
        (p.pendingWeeks.length ? '<div class="msg warn">Minggu berikut belum disetujui dan tidak ikut dikirim: ' + p.pendingWeeks.map(function (w) { return esc(tglS(w)); }).join(', ') + '.</div>' : '') +
        (last ? '<div class="msg info">Terakhir dikirim ke ' + esc(last.guru) + ' pada ' + esc(last.pada) + ' oleh ' + esc(last.oleh) + '.</div>' : '') +
        '<label for="g-' + i + '">Email guru di sekolah</label><input type="email" id="g-' + i + '" value="' + esc(p.guru_email) + '" placeholder="guru@sekolah.sch.id" inputmode="email">' +
        '<label for="ps-' + i + '">Pesan pengantar (boleh dikosongkan)</label><textarea id="ps-' + i + '" placeholder="Kosongkan untuk memakai pesan standar"></textarea>' +
        '<div id="bm-' + i + '"></div><button class="btn full mt" data-a="sendmonth" data-i="' + i + '" ' + (p.approvedWeeks ? '' : 'disabled') + '>Kirim laporan bulan ini ke guru</button></div>';
    }).join('') || '<div class="card empty">Belum ada peserta.</div>';
    $('main').innerHTML = h;
  } catch (e) { $('main').innerHTML = '<div class="card"><div class="msg err">' + esc(e.message) + '</div></div>'; }
};
async function sendMonth(btn) {
  var i = +btn.dataset.i, p = S.month.peserta[i], g = val('g-' + i).trim();
  if (!g) return msg('bm-' + i, 'err', 'Isi email guru terlebih dahulu.');
  if (!confirm('Kirim laporan ' + S.month.label + ' milik ' + p.nama + ' ke ' + g + '?')) return;
  setBusy(btn, 'Membuat PDF dan mengirim...');
  try {
    await api('svSendMonthly', { email: p.email, bulan: S.month.bulan, guru_email: g, pesan: val('ps-' + i) }, { timeout: 120000 });
    toast('Terkirim ke ' + g); VIEWS.bulanan(S.month.bulan);
  } catch (e) { msg('bm-' + i, 'err', e.message); unBusy(btn); }
}

/* ---------- supervisor + admin: kelola ---------- */
VIEWS.kelola = function () {
  var tabs = [['peserta', 'Peserta'], ['kalender', 'Libur & Izin']];
  if (S.user.role === 'superadmin') tabs = tabs.concat([['pengguna', 'Pengguna'], ['setelan', 'Pengaturan'], ['rekap', 'Rekap Absensi']]);
  if (!S.sub) S.sub = 'peserta';
  $('main').innerHTML = '<div class="tabs">' + tabs.map(function (t) { return '<button data-a="subtab" data-s="' + t[0] + '" class="' + (S.sub === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div><div id="sub"></div>';
  SUBS[S.sub]();
};
var SUBS = {};
SUBS.peserta = async function () {
  try {
    var r = await api('svPeserta');
    $('sub').innerHTML = r.peserta.map(function (p, i) {
      return '<div class="card"><h2>' + esc(p.nama) + '</h2><p class="xs mut">' + esc(p.email) + '</p><label for="sk-' + i + '">Asal sekolah (tampil di PDF)</label><input type="text" id="sk-' + i + '" value="' + esc(p.sekolah) + '" maxlength="120" placeholder="Nama sekolah">' +
        '<label for="gu-' + i + '">Email guru</label><input type="email" id="gu-' + i + '" value="' + esc(p.guru_email) + '" placeholder="guru@sekolah.sch.id"><div id="pm-' + i + '"></div><button class="btn sec mt" data-a="savepeserta" data-i="' + i + '" data-e="' + esc(p.email) + '">Simpan</button></div>';
    }).join('') || '<div class="card empty">Belum ada peserta.</div>';
  } catch (e) { $('sub').innerHTML = '<div class="msg err">' + esc(e.message) + '</div>'; }
};
SUBS.kalender = async function () {
  try {
    var r = await api('svDays'); S.cal = r;
    var td = nowJkt().date;
    $('sub').innerHTML = '<div class="card"><h2>Tandai hari tidak masuk</h2><p class="sm mut mt2">Hari libur berlaku untuk semua peserta. Izin dan sakit untuk satu peserta. Hari yang ditandai tidak dihitung sebagai tidak hadir.</p>' +
      '<label for="k-tipe">Jenis</label><select id="k-tipe"><option>Libur</option><option>Izin</option><option>Sakit</option></select>' +
      '<label for="k-peserta">Peserta</label><select id="k-peserta"><option value="*">Semua peserta (libur)</option>' + r.peserta.map(function (p) { return '<option value="' + esc(p.email) + '">' + esc(p.nama) + '</option>'; }).join('') + '</select>' +
      '<div class="row"><div class="grow"><label for="k-dari">Dari</label><input type="date" id="k-dari" value="' + td + '"></div><div class="grow"><label for="k-sampai">Sampai</label><input type="date" id="k-sampai" value="' + td + '"></div></div>' +
      '<label for="k-ket">Keterangan</label><input type="text" id="k-ket" maxlength="200" placeholder="Contoh: Maulid Nabi / Sakit demam"><div id="k-msg"></div><button class="btn full mt" data-a="addday">Simpan</button></div>' +
      '<div class="card"><h2>Daftar</h2>' + (r.hari.length ? '<div class="scroll"><table class="tbl"><tr><th>Tanggal</th><th>Jenis</th><th>Peserta</th><th></th></tr>' + r.hari.map(function (h) {
        var nm = h.email === '*' ? 'Semua' : (r.peserta.filter(function (p) { return p.email === h.email; })[0] || { nama: h.email }).nama;
        return '<tr><td>' + esc(tglS(h.tanggal)) + '</td><td>' + esc(h.tipe) + (h.keterangan ? '<div class="xs mut">' + esc(h.keterangan) + '</div>' : '') + '</td><td>' + esc(nm) + '</td><td><button class="btn ghost sm" data-a="delday" data-id="' + esc(h.id) + '">Hapus</button></td></tr>';
      }).join('') + '</table></div>' : '<div class="empty">Belum ada data.</div>') + '</div>';
    $('k-tipe').addEventListener('change', function () { if (this.value !== 'Libur' && $('k-peserta').value === '*') $('k-peserta').selectedIndex = 1; });
  } catch (e) { $('sub').innerHTML = '<div class="msg err">' + esc(e.message) + '</div>'; }
};
SUBS.pengguna = async function () {
  try {
    var r = await api('adUsers'); S.users = r.users;
    $('sub').innerHTML = '<button class="btn sec mb" data-a="useredit" data-i="-1">+ Tambah pengguna</button>' + r.users.map(function (u, i) {
      return '<div class="card"><div class="row sp wrap"><div><h2>' + esc(u.nama) + '</h2><p class="xs mut">' + esc(u.email) + '</p></div><div><span class="pill info">' + esc(u.role) + '</span> ' + (u.aktif ? '' : '<span class="pill bad">nonaktif</span>') + '</div></div>' +
        (u.must_change ? '<p class="xs mt2" style="color:var(--amb)">Belum mengganti password bawaan.</p>' : '') +
        '<div class="row wrap mt"><button class="btn sec sm" data-a="useredit" data-i="' + i + '">Ubah</button><button class="btn ghost sm" data-a="userreset" data-e="' + esc(u.email) + '" data-n="' + esc(u.nama) + '">Reset password</button></div></div>';
    }).join('');
  } catch (e) { $('sub').innerHTML = '<div class="msg err">' + esc(e.message) + '</div>'; }
};
function supHas(f, e) { return String(f || '').toLowerCase().split(',').map(function (z) { return z.trim(); }).indexOf(String(e).toLowerCase()) >= 0; }
function userModal(i) {
  var u = i >= 0 ? S.users[i] : { email: '', nama: '', role: 'peserta', supervisor: '', sekolah: '', guru_email: '', aktif: true };
  var sups = S.users.filter(function (x) { return x.role === 'supervisor' || x.role === 'superadmin'; });
  modal('<h2>' + (i >= 0 ? 'Ubah pengguna' : 'Tambah pengguna') + '</h2><label for="u-email">Email</label><input type="email" id="u-email" value="' + esc(u.email) + '" ' + (i >= 0 ? 'readonly' : '') + '>' +
    '<label for="u-nama">Nama lengkap</label><input type="text" id="u-nama" value="' + esc(u.nama) + '"><label for="u-role">Peran</label><select id="u-role">' + ['peserta', 'supervisor', 'superadmin'].map(function (r) { return '<option ' + (u.role === r ? 'selected' : '') + '>' + r + '</option>'; }).join('') + '</select>' +
    '<label>Supervisor pembimbing (untuk peserta)</label><div id="u-sup" style="display:flex;flex-direction:column;gap:6px;margin-top:4px">' + sups.map(function (s) { return '<label class="chip" style="display:flex"><input type="checkbox" class="u-sup-c" value="' + esc(s.email) + '" ' + (supHas(u.supervisor, s.email) ? 'checked' : '') + '>' + esc(s.nama) + '</label>'; }).join('') + '</div><p class="xs mut">Boleh lebih dari satu. Bila tidak ada yang dicentang, peserta terlihat oleh semua supervisor.</p>' +
    '<label for="u-sk">Asal sekolah</label><input type="text" id="u-sk" value="' + esc(u.sekolah) + '"><label for="u-gu">Email guru</label><input type="email" id="u-gu" value="' + esc(u.guru_email) + '">' +
    '<label class="chip" style="display:flex;margin-top:12px"><input type="checkbox" id="u-aktif" ' + (u.aktif ? 'checked' : '') + '>Akun aktif</label>' +
    (i < 0 ? '<p class="xs mut mt2">Password awal 12345, wajib diganti saat login pertama.</p>' : '') +
    '<div id="u-msg"></div><div class="row mt"><button class="btn ghost" data-a="closemodal">Batal</button><button class="btn grow" data-a="usersave">Simpan</button></div>');
}
SUBS.setelan = async function () {
  try {
    var r = await api('adConfigGet'), c = r.config;
    var f = function (k, lbl, t) { return '<label for="c-' + k + '">' + lbl + '</label><input type="' + (t || 'text') + '" id="c-' + k + '" value="' + esc(c[k]) + '">'; };
    $('sub').innerHTML = '<div class="card"><h2>Lokasi absensi</h2>' + f('lokasi_nama', 'Nama titik') + '<div class="row"><div class="grow">' + f('lat', 'Latitude') + '</div><div class="grow">' + f('lng', 'Longitude') + '</div></div>' + f('radius_m', 'Radius (meter)', 'number') + f('akurasi_maks_m', 'Akurasi GPS maksimal (meter)', 'number') +
      '<button class="btn sec sm mt" data-a="usemypos">Pakai lokasi saya sekarang sebagai titik</button><div id="c-pos"></div></div>' +
      '<div class="card"><h2>Jam dan hari kerja</h2><div class="row"><div class="grow">' + f('jam_masuk_buka', 'Absen pagi dibuka', 'time') + '</div><div class="grow">' + f('jam_masuk_maks', 'Batas tepat waktu', 'time') + '</div></div>' +
      '<div class="row"><div class="grow">' + f('jam_pulang_min', 'Absen sore dibuka', 'time') + '</div><div class="grow">' + f('jam_pulang_maks', 'Absen sore ditutup', 'time') + '</div></div>' + f('hari_kerja', 'Hari kerja (0=Minggu, 1=Senin ... 6=Sabtu)') + '</div>' +
      '<div class="card"><h2>Kop laporan PDF</h2>' + f('kop_alamat', 'Baris alamat di bawah nama unit') + f('kota_ttd', 'Kota pada tanda tangan') + '<div id="c-msg"></div><button class="btn full mt" data-a="savecfg">Simpan pengaturan</button></div>';
  } catch (e) { $('sub').innerHTML = '<div class="msg err">' + esc(e.message) + '</div>'; }
};
SUBS.rekap = function () {
  var td = nowJkt().date;
  $('sub').innerHTML = '<div class="card"><h2>Rekap absensi dan KPI</h2><div class="row"><div class="grow"><label for="x-dari">Dari</label><input type="date" id="x-dari" value="' + td.substr(0, 8) + '01"></div><div class="grow"><label for="x-sampai">Sampai</label><input type="date" id="x-sampai" value="' + td + '"></div></div><div id="x-msg"></div><button class="btn full mt" data-a="doexport">Tampilkan dan unduh CSV</button></div><div id="x-out"></div>';
};
async function doExport(btn) {
  setBusy(btn, 'Memuat...');
  try {
    var r = await api('adExport', { dari: val('x-dari'), sampai: val('x-sampai') });
    $('x-out').innerHTML = '<div class="card"><div class="scroll"><table class="tbl"><tr>' + r.header.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr>' + r.rows.map(function (row) { return '<tr>' + row.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' + (r.rows.length ? '' : '<div class="empty">Tidak ada data.</div>') + '</div>';
    var csv = [r.header].concat(r.rows).map(function (row) { return row.map(function (x) { return '"' + String(x === undefined ? '' : x).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'rekap-sidr-' + val('x-dari') + '_' + val('x-sampai') + '.csv'; document.body.appendChild(a); a.click(); a.remove();
  } catch (e) { msg('x-msg', 'err', e.message); }
  unBusy(btn);
}

/* ---------- aksi (event delegation) ---------- */
var ACT = {
  nav: function (t) { go(t.dataset.v, ''); },
  reload: function () { go(S.view); },
  logout: function () { logout(false); },
  checkin: function (t) { doCheckin(t); },
  setst: function (t) {
    S.rep.status[t.dataset.id] = t.dataset.s;
    var seg = t.parentNode; Array.prototype.forEach.call(seg.children, function (b) { b.className = ''; });
    t.className = 'sel ' + (t.dataset.s === 'Selesai' ? 'y' : 'n');
  },
  addown: function () { S.rep.own.push({ judul: '', catatan: '' }); renderOwn(); },
  delown: function (t) { S.rep.own.splice(+t.dataset.i, 1); renderOwn(); },
  sendrep: function (t) { sendReport(t); },
  sigclear: function (t) { var p = S.pads && S.pads[t.dataset.id]; if (p) p.clear(); },
  pdf: function (t) { downloadPdf(t); },
  install: async function () { if (S.installEv) { S.installEv.prompt(); await S.installEv.userChoice; S.installEv = null; VIEWS.akun(); } },
  daymv: function (t) { VIEWS.hariini(addD(S.sd, +t.dataset.n)); },
  addtask: function () { S.tasks.push({ id: '', judul: '', detail: '', assignees: S.day.peserta.map(function (p) { return p.email; }) }); renderTasks(); },
  deltask: function (t) { S.tasks.splice(+t.dataset.i, 1); renderTasks(); },
  savetasks: async function (t) {
    setBusy(t, 'Menyimpan...'); msg('t-msg', '', '');
    try { var r = await api('svSaveTasks', { tanggal: S.sd, tasks: S.tasks }); S.day = r; S.tasks = r.tasks.map(function (x) { return { id: x.id, judul: x.judul, detail: x.detail || '', assignees: x.assignees.slice() }; }); toast('Tugas tersimpan.'); renderDay(); }
    catch (e) { msg('t-msg', 'err', e.message); unBusy(t); }
  },
  retrep: async function (t) {
    var c = prompt('Catatan untuk peserta (mengapa dikembalikan):', ''); if (c === null) return;
    try { await api('svReturnReport', { email: t.dataset.e, tanggal: t.dataset.d, catatan: c }); toast('Laporan dikembalikan.'); VIEWS.hariini(S.sd); } catch (e) { toast(e.message); }
  },
  fixabs: function (t) {
    modal('<h2>Koreksi absen</h2><p class="sm mut mt2">' + esc(t.dataset.n) + ' · ' + esc(tgl(t.dataset.d)) + '</p><div class="row"><div class="grow"><label for="f-in">Jam masuk</label><input type="time" id="f-in" value="' + esc(t.dataset.m) + '"></div><div class="grow"><label for="f-out">Jam pulang</label><input type="time" id="f-out" value="' + esc(t.dataset.p) + '"></div></div>' +
      '<label for="f-al">Alasan koreksi (wajib)</label><input type="text" id="f-al" maxlength="200" placeholder="Contoh: HP peserta rusak"><div id="f-msg"></div><div class="row mt"><button class="btn ghost" data-a="closemodal">Batal</button><button class="btn grow" data-a="savefix" data-e="' + esc(t.dataset.e) + '" data-d="' + esc(t.dataset.d) + '">Simpan koreksi</button></div>');
  },
  savefix: async function (t) {
    setBusy(t, 'Menyimpan...');
    try { await api('svSetAttendance', { email: t.dataset.e, tanggal: t.dataset.d, jam_masuk: val('f-in'), jam_pulang: val('f-out'), alasan: val('f-al') }); closeModal(); toast('Koreksi tersimpan.'); VIEWS.hariini(S.sd); }
    catch (e) { msg('f-msg', 'err', e.message); unBusy(t); }
  },
  wkmv: function (t) { VIEWS.mingguan(addD(S.sw, +t.dataset.n)); },
  approvemodal: function () { approveModal(); },
  doapprove: function (t) { doApprove(t); },
  closemodal: function () { closeModal(); },
  sendmonth: function (t) { sendMonth(t); },
  subtab: function (t) { S.sub = t.dataset.s; VIEWS.kelola(); },
  savepeserta: async function (t) {
    var i = t.dataset.i; setBusy(t, 'Menyimpan...');
    try { await api('svSavePeserta', { email: t.dataset.e, sekolah: val('sk-' + i), guru_email: val('gu-' + i) }); toast('Tersimpan.'); msg('pm-' + i, '', ''); } catch (e) { msg('pm-' + i, 'err', e.message); }
    unBusy(t);
  },
  addday: async function (t) {
    setBusy(t, 'Menyimpan...');
    try { await api('svAddDay', { tipe: val('k-tipe'), email: val('k-peserta'), dari: val('k-dari'), sampai: val('k-sampai'), keterangan: val('k-ket') }); toast('Tersimpan.'); SUBS.kalender(); }
    catch (e) { msg('k-msg', 'err', e.message); unBusy(t); }
  },
  delday: async function (t) { if (!confirm('Hapus data ini?')) return; try { await api('svDelDay', { id: t.dataset.id }); SUBS.kalender(); } catch (e) { toast(e.message); } },
  useredit: function (t) { userModal(+t.dataset.i); },
  usersave: async function (t) {
    setBusy(t, 'Menyimpan...');
    try { await api('adSaveUser', { email: val('u-email'), nama: val('u-nama'), role: val('u-role'), supervisor: [].slice.call(document.querySelectorAll('.u-sup-c:checked')).map(function (c) { return c.value; }).join(','), sekolah: val('u-sk'), guru_email: val('u-gu'), aktif: $('u-aktif').checked }); closeModal(); toast('Tersimpan.'); SUBS.pengguna(); }
    catch (e) { msg('u-msg', 'err', e.message); unBusy(t); }
  },
  userreset: async function (t) { if (!confirm('Reset password ' + t.dataset.n + ' ke 12345? Pengguna wajib menggantinya saat login berikutnya.')) return; try { await api('adResetPw', { email: t.dataset.e }); toast('Password direset ke 12345.'); SUBS.pengguna(); } catch (e) { toast(e.message); } },
  usemypos: async function (t) {
    setBusy(t, 'Membaca lokasi...');
    try { var p = await getPos(); $('c-lat').value = p.lat.toFixed(7); $('c-lng').value = p.lng.toFixed(7); msg('c-pos', 'info', 'Lokasi terbaca dengan akurasi sekitar ' + Math.round(p.acc) + ' m. Tekan "Simpan pengaturan" untuk menerapkan.'); }
    catch (e) { msg('c-pos', 'err', e.message); }
    unBusy(t);
  },
  savecfg: async function (t) {
    var keys = ['lokasi_nama', 'lat', 'lng', 'radius_m', 'akurasi_maks_m', 'jam_masuk_buka', 'jam_masuk_maks', 'jam_pulang_min', 'jam_pulang_maks', 'hari_kerja', 'kop_alamat', 'kota_ttd'], cfg = {};
    keys.forEach(function (k) { cfg[k] = val('c-' + k); });
    setBusy(t, 'Menyimpan...');
    try { await api('adConfigSet', { config: cfg }); toast('Pengaturan tersimpan.'); msg('c-msg', '', ''); } catch (e) { msg('c-msg', 'err', e.message); }
    unBusy(t);
  },
  doexport: function (t) { doExport(t); }
};
APP.addEventListener('click', function (e) {
  var t = e.target.closest('[data-a]'); if (!t || t.disabled) return;
  var f = ACT[t.dataset.a]; if (f) f(t, e);
});
document.addEventListener('click', function (e) {
  var t = e.target.closest('#modal [data-a]'); if (!t || t.disabled) return;
  var f = ACT[t.dataset.a]; if (f) f(t, e);
});
APP.addEventListener('submit', function (e) {
  e.preventDefault();
  if (e.target.id === 'f-login') doLogin($('l-btn'));
  else if (e.target.id === 'f-pw') doChangePw($('p-btn'));
});
function onInput(e) {
  var t = e.target;
  if (t.dataset.n !== undefined && S.rep) S.rep.note[t.dataset.n] = t.value;
  else if (t.dataset.own !== undefined && S.rep) S.rep.own[+t.dataset.own][t.dataset.f] = t.value;
  else if (t.dataset.t !== undefined && S.tasks) {
    var tk = S.tasks[+t.dataset.t]; if (!tk) return;
    if (t.dataset.f === 'judul') tk.judul = t.value;
    else if (t.dataset.e) { var ix = tk.assignees.indexOf(t.dataset.e); if (t.checked && ix < 0) tk.assignees.push(t.dataset.e); if (!t.checked && ix >= 0) tk.assignees.splice(ix, 1); t.parentNode.classList.toggle('on', t.checked); }
  } else if (t.dataset.ap !== undefined) t.parentNode.classList.toggle('on', t.checked);
}
APP.addEventListener('input', onInput); APP.addEventListener('change', onInput);
document.addEventListener('input', function (e) { if (e.target.closest('#modal')) onInput(e); });
document.addEventListener('change', function (e) {
  if (e.target.closest('#modal')) onInput(e);
  if (e.target.id === 'sd-date' && e.target.value) VIEWS.hariini(e.target.value);
  if (e.target.id === 'sm-in' && e.target.value) VIEWS.bulanan(e.target.value);
});

/* ---------- PWA ---------- */
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); S.installEv = e; if (S.view === 'akun') VIEWS.akun(); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  var hadCtl = !!navigator.serviceWorker.controller, reloaded = false, swReg = null;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (r) { swReg = r; r.update().catch(function () { }); }).catch(function () { });
  navigator.serviceWorker.addEventListener('controllerchange', function () { if (hadCtl && !reloaded) { reloaded = true; location.reload(); } });
}
/* Pembaruan otomatis: bandingkan penanda versi berkas utama di server dengan yang sedang dipakai. */
var verSig = '';
async function verCheck() {
  try {
    var parts = [];
    for (var f of ['app.js', 'style.css', 'index.html', 'quotes.js']) {
      var r = await fetch(f + '?_=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      parts.push((r.headers.get('etag') || '') + (r.headers.get('last-modified') || '') + (r.headers.get('content-length') || ''));
    }
    var sig = parts.join('|');
    if (!verSig) { verSig = sig; return; }
    if (sig !== verSig) applyUpdate();
  } catch (e) { }
}
function applyUpdate() {
  var busy = !!$('modal') || !!document.querySelector('.sigwrap.has') || (S.rep && S.rep.own && S.rep.own.length);
  if (!busy) { location.reload(); return; }
  if ($('upd')) return;
  var b = document.createElement('button'); b.id = 'upd'; b.className = 'upd'; b.textContent = 'Versi baru tersedia. Ketuk untuk memperbarui.';
  b.onclick = function () { location.reload(); }; document.body.appendChild(b);
}
verCheck();
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') { verCheck(); if (typeof swReg !== 'undefined' && swReg) swReg.update().catch(function () { }); }
});
setInterval(function () { if (document.visibilityState === 'visible') verCheck(); }, 600000);
boot();
})();
