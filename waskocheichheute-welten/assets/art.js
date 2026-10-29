/* ==========================================================================
   Redline · Welten-Workshop · Illustrations-Baukasten
   Alle Bilder dieser Entwürfe entstehen hier im Code als Vektorgrafik (SVG).
   Landschaften sind für eine Fläche von 1600 × 900 gezeichnet.
   ========================================================================== */
(function () {
  'use strict';

  var A = {};
  var counter = 0;

  /* ------------------------------------------------------------------
     Werkzeuge
     ------------------------------------------------------------------ */
  function uid(p) { counter += 1; return p + '-' + counter; }
  function f(v) { return Math.round(v * 10) / 10; }
  function rnd(seed) {
    var a = seed | 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }
  function mid(p, q) { return lerp(p, q, 0.5); }

  function P(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function C(cx, cy, r, fill, extra) { return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function E(cx, cy, rx, ry, fill, extra) { return '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function R(x, y, w, h, fill, rx, extra) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '"' + (rx ? ' rx="' + f(rx) + '"' : '') + ' fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function L(x1, y1, x2, y2, stroke, w, extra) { return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + stroke + '" stroke-width="' + f(w) + '" stroke-linecap="round"' + (extra ? ' ' + extra : '') + '/>'; }
  function G(cls, inner, extra) { return '<g' + (cls ? ' class="' + cls + '"' : '') + (extra ? ' ' + extra : '') + '>' + inner + '</g>'; }
  function T(x, y, s) { return 'transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + f(s * 100) / 100 + ')"'; }
  function stops(list) {
    return list.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('');
  }
  function vGrad(id, list) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + stops(list) + '</linearGradient>'; }
  function rGrad(id, list) { return '<radialGradient id="' + id + '">' + stops(list) + '</radialGradient>'; }

  /* Bergketten und Hügel */
  function ridge(r, o) {
    var n = o.n || 10, x0 = o.x0 || 0, x1 = o.x1 == null ? 1600 : o.x1;
    var w = (x1 - x0) / n, pts = [];
    for (var i = 0; i <= n; i++) {
      var x = x0 + i * w + (i > 0 && i < n ? (r() - 0.5) * w * 0.6 : 0);
      var h = o.peaky ? (i % 2 ? 0.55 + r() * 0.45 : 0.08 + r() * 0.3) : 0.35 + r() * 0.65;
      if (o.taper) { var u = (x - x0) / (x1 - x0); h *= Math.pow(Math.sin(Math.PI * u), 0.8); }
      pts.push([x, o.base - h * o.amp]);
    }
    return pts;
  }
  function polyD(pts, x0, x1, bottom) {
    var d = 'M' + f(x0) + ' ' + bottom;
    pts.forEach(function (p) { d += 'L' + f(p[0]) + ' ' + f(p[1]); });
    return d + 'L' + f(x1) + ' ' + bottom + 'Z';
  }
  function smoothD(pts, x0, x1, bottom) {
    var d = 'M' + f(x0) + ' ' + bottom + 'L' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (var i = 1; i < pts.length; i++) {
      var p = pts[i - 1], q = pts[i];
      d += 'Q' + f(p[0]) + ' ' + f(p[1]) + ' ' + f((p[0] + q[0]) / 2) + ' ' + f((p[1] + q[1]) / 2);
    }
    var l = pts[pts.length - 1];
    return d + 'L' + f(l[0]) + ' ' + f(l[1]) + 'L' + f(x1) + ' ' + bottom + 'Z';
  }
  function blobD(pts) {
    var n = pts.length, m = mid(pts[n - 1], pts[0]), d = 'M' + f(m[0]) + ' ' + f(m[1]);
    for (var i = 0; i < n; i++) {
      var p = pts[i], q = pts[(i + 1) % n], mm = mid(p, q);
      d += 'Q' + f(p[0]) + ' ' + f(p[1]) + ' ' + f(mm[0]) + ' ' + f(mm[1]);
    }
    return d + 'Z';
  }
  function snowCaps(pts, maxY, col) {
    var out = '';
    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i], a0 = pts[i - 1], b0 = pts[i + 1];
      if (p[1] < a0[1] && p[1] < b0[1] && p[1] < maxY) {
        var a = lerp(p, a0, 0.3), b = lerp(p, b0, 0.3);
        var m1 = lerp(a, b, 0.33), m2 = lerp(a, b, 0.66);
        out += P('M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(b[0]) + ' ' + f(b[1]) + 'L' + f(m2[0]) + ' ' + f(m2[1] + 6) + 'L' + f(m1[0]) + ' ' + f(m1[1] + 16) + 'L' + f(a[0]) + ' ' + f(a[1]) + 'Z', col);
      }
    }
    return out;
  }
  function coast(B, col, x0, x1) {
    x0 = x0 == null ? 120 : x0; x1 = x1 == null ? 1480 : x1;
    var w = x1 - x0;
    return P('M' + x0 + ' 900C' + f(x0 + w * 0.1) + ' ' + (B + 24) + ' ' + f(x0 + w * 0.22) + ' ' + B + ' ' + f(x0 + w * 0.5) + ' ' + B + 'S' + f(x1 - w * 0.1) + ' ' + (B + 24) + ' ' + x1 + ' 900Z', col);
  }

  /* ------------------------------------------------------------------
     Bausteine der Landschaften
     ------------------------------------------------------------------ */
  function sun(cx, cy, r, col) {
    var id = uid('sun');
    return '<defs>' + rGrad(id, [[0, col, 0.55], [1, col, 0]]) + '</defs>' + C(cx, cy, r * 2.6, 'url(#' + id + ')') + C(cx, cy, r, col);
  }
  function cloud(x, y, s, col, op) {
    return G('drift', C(x, y, 30 * s, col) + C(x + 36 * s, y - 16 * s, 42 * s, col) + C(x + 82 * s, y - 2 * s, 32 * s, col) + C(x + 116 * s, y + 6 * s, 22 * s, col) + R(x - 30 * s, y, 168 * s, 30 * s, col, 15 * s), 'opacity="' + op + '" style="animation-duration:' + (36 + s * 20) + 's"');
  }
  function stars(r, n, y0, y1, col) {
    var out = '';
    for (var i = 0; i < n; i++) {
      out += C(r() * 1600, y0 + r() * (y1 - y0), 0.8 + r() * 1.8, col || '#fff', (i % 3 === 0 ? 'class="twinkle" style="animation-delay:-' + f(r() * 3) + 's" ' : '') + 'opacity="' + f(0.4 + r() * 0.6) + '"');
    }
    return out;
  }
  function birds(list, col) {
    return list.map(function (b) {
      var x = b[0], y = b[1], s = b[2];
      return P('M' + f(x) + ' ' + f(y) + 'q' + f(9 * s) + ' ' + f(-8 * s) + ' ' + f(18 * s) + ' 0q' + f(9 * s) + ' ' + f(-8 * s) + ' ' + f(18 * s) + ' 0', 'none', 'stroke="' + col + '" stroke-width="' + f(2.4 * s) + '" stroke-linecap="round"');
    }).join('');
  }

  function pine(x, y, s, c) {
    var pts = [[0, -92], [18, -60], [10, -60], [27, -31], [15, -31], [34, -4], [-34, -4], [-15, -31], [-27, -31], [-10, -60], [-18, -60]];
    return R(x - 4 * s, y - 8 * s, 8 * s, 10 * s, '#4a3322') + P('M' + pts.map(function (p) { return f(x + p[0] * s) + ' ' + f(y + p[1] * s); }).join('L') + 'Z', c);
  }

  function cow(x, y, s, flip) {
    var k = flip ? -1 : 1;
    var inner =
      R(-26, -16, 6, 16, '#3a2f2a', 2) + R(-14, -16, 6, 16, '#3a2f2a', 2) + R(10, -16, 6, 16, '#3a2f2a', 2) + R(21, -16, 6, 16, '#3a2f2a', 2) +
      P('M30 -34 q10 4 8 18', 'none', 'stroke="#3a2f2a" stroke-width="2.5" stroke-linecap="round"') +
      R(-32, -44, 66, 32, '#fffaf3', 14) +
      E(-12, -34, 10, 7, '#261f1f') + E(16, -26, 8, 6, '#261f1f') + E(22, -40, 6, 4, '#261f1f') +
      R(-50, -54, 22, 24, '#fffaf3', 9) + R(-53, -40, 16, 11, '#f2b8a6', 5) +
      C(-42, -47, 2, '#261f1f') + P('M-46 -54 l-6 -7 M-34 -54 l4 -8', 'none', 'stroke="#d8c8a8" stroke-width="3" stroke-linecap="round"') +
      C(-38, -27, 3.4, '#f6c445');
    return G('', inner, 'transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + f(s * k * 100) / 100 + ' ' + f(s * 100) / 100 + ')"');
  }

  function chalet(x, y, s) {
    var planks = '';
    for (var i = 0; i < 5; i++) planks += L(-60, -86 + i * 14, 60, -86 + i * 14, '#9a5a2e', 1.5);
    var bal = '';
    for (var j = -60; j <= 60; j += 10) bal += R(j - 1.5, -56, 3, 14, '#5b3420');
    var flowers = '';
    for (var k = -56; k <= 56; k += 8) flowers += C(k, -60, 3.4, k % 16 === 0 ? '#e0483e' : '#f4a43a');
    var smoke = C(42, -160, 9, '#ffffff', 'class="rise" opacity=".6"') + C(48, -176, 12, '#ffffff', 'class="rise" style="animation-delay:-2s" opacity=".5"') + C(40, -196, 14, '#ffffff', 'class="rise" style="animation-delay:-4s" opacity=".4"');
    var inner =
      smoke + R(36, -150, 12, 30, '#7a4a2a') +
      R(-70, -26, 140, 26, '#d9d0c2', 3) +
      R(-62, -94, 124, 70, '#b06a37') + planks +
      P('M-58 -90L0 -134L58 -90Z', '#c47a42') + C(0, -104, 8, '#ffd98a') +
      P('M-90 -84L0 -154L90 -84L80 -80L0 -140L-80 -80Z', '#5b3420') +
      P('M-72 -97L0 -154L72 -97L56 -95L34 -110L12 -100L-14 -114L-40 -98Z', '#ffffff') +
      R(-50, -82, 22, 18, '#ffd98a', 2) + R(28, -82, 22, 18, '#ffd98a', 2) +
      R(-56, -82, 5, 18, '#3f6e4a') + R(-29, -82, 5, 18, '#3f6e4a') + R(22, -82, 5, 18, '#3f6e4a') + R(51, -82, 5, 18, '#3f6e4a') +
      flowers + bal + R(-66, -44, 132, 5, '#5b3420') +
      R(-11, -48, 22, 30, '#6b3b22', 3) + C(6, -33, 1.6, '#f6c445');
    return G('', inner, T(x, y, s));
  }

  function fence(x0, x1, y, s, col) {
    var out = L(x0, y - 26 * s, x1, y - 26 * s, col, 3 * s) + L(x0, y - 12 * s, x1, y - 12 * s, col, 3 * s);
    for (var x = x0; x <= x1; x += 46 * s) out += R(x - 3 * s, y - 36 * s, 6 * s, 36 * s, col, 2 * s);
    return out;
  }

  function acacia(x, y, s, col) {
    col = col || '#6f7d2f';
    var inner =
      P('M0 0L4 -62L-18 -98M4 -62L24 -102M2 -42L-12 -72', 'none', 'stroke="#5a3a22" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"') +
      E(-22, -104, 50, 13, col) + E(28, -110, 56, 15, col) + E(2, -122, 44, 12, col) + E(-40, -96, 26, 8, col);
    return G('', inner, T(x, y, s));
  }

  function rondavel(x, y, s, col) {
    var lines = '';
    for (var i = -3; i <= 3; i++) lines += L(i * 10, -86 + Math.abs(i) * 4, i * 13, -42, '#6f5330', 1.4);
    var inner = R(-34, -46, 68, 46, col, 6) + R(-9, -28, 18, 28, '#5a3a22', 9) +
      P('M-46 -40L0 -90L46 -40Z', '#9a7442') + lines + L(-46, -40, 46, -40, '#6f5330', 3);
    return G('', inner, T(x, y, s));
  }

  function tomatoPlant(x, y, s, r) {
    var inner = L(0, 0, 0, -120, '#8a6a3a', 4) + L(-22, 0, -16, -96, '#8a6a3a', 3);
    for (var i = 0; i < 9; i++) inner += E(-18 + r() * 36, -20 - r() * 100, 16, 7, i % 2 ? '#3f8f3a' : '#4fa046', 'transform="rotate(' + f(-40 + r() * 80) + ' ' + 0 + ' ' + 0 + ')" opacity=".95"');
    var tom = [[-14, -40], [10, -58], [-6, -84], [14, -26], [-20, -70]];
    tom.forEach(function (t, k) {
      inner += C(t[0], t[1], 11 - k * 0.6, '#e0402a') + C(t[0] - 3, t[1] - 4, 3, '#f58a70') +
        P('M' + t[0] + ' ' + (t[1] - 12) + 'l3 4l5 -1l-3 4l3 4l-5 -1l-3 4l-3 -4l-5 1l3 -4l-3 -4l5 1Z', '#2f6f2a');
    });
    return G('', inner, T(x, y, s));
  }

  function palm(x, y, h, lean, s) {
    var tx = x + lean, ty = y - h;
    var out = P('M' + f(x) + ' ' + f(y) + 'Q' + f(x + lean * 0.15) + ' ' + f(y - h * 0.55) + ' ' + f(tx) + ' ' + f(ty), 'none', 'stroke="#8a5a33" stroke-width="' + f(15 * s) + '" stroke-linecap="round"');
    out += P('M' + f(x) + ' ' + f(y) + 'Q' + f(x + lean * 0.15) + ' ' + f(y - h * 0.55) + ' ' + f(tx) + ' ' + f(ty), 'none', 'stroke="#6e4426" stroke-width="' + f(15 * s) + '" stroke-dasharray="' + f(3 * s) + ' ' + f(13 * s) + '" opacity=".55"');
    var angles = [-172, -140, -105, -70, -35, -8, 20];
    var cols = ['#2e8b57', '#1f6e45', '#3fa36b', '#2e8b57', '#1f6e45', '#3fa36b', '#2e8b57'];
    var leaves = '';
    angles.forEach(function (deg, i) {
      var a = deg * Math.PI / 180, Lh = 118 * s;
      var tip = [tx + Math.cos(a) * Lh, ty + Math.sin(a) * Lh + 34 * s * Math.abs(Math.cos(a))];
      var m = mid([tx, ty], tip), per = [-Math.sin(a), Math.cos(a)];
      var c1 = [m[0] + per[0] * 22 * s, m[1] + per[1] * 22 * s], c2 = [m[0] - per[0] * 6 * s, m[1] - per[1] * 6 * s];
      leaves += P('M' + f(tx) + ' ' + f(ty) + 'Q' + f(c1[0]) + ' ' + f(c1[1]) + ' ' + f(tip[0]) + ' ' + f(tip[1]) + 'Q' + f(c2[0]) + ' ' + f(c2[1]) + ' ' + f(tx) + ' ' + f(ty) + 'Z', cols[i]);
    });
    out += G('sway-soft', leaves);
    out += C(tx - 7 * s, ty + 9 * s, 8 * s, '#6b4a2b') + C(tx + 7 * s, ty + 11 * s, 7.5 * s, '#7a5531') + C(tx, ty + 15 * s, 7 * s, '#5f4126');
    return out;
  }

  function stiltHouse(x, y, s) {
    var bam = '';
    for (var i = -50; i <= 50; i += 10) bam += L(i, -94, i, -50, '#b88f4f', 2);
    var inner =
      R(-60, -50, 6, 50, '#6b4426') + R(-20, -50, 6, 50, '#6b4426') + R(16, -50, 6, 50, '#6b4426') + R(54, -50, 6, 50, '#6b4426') +
      R(-70, -52, 140, 8, '#8a5a33', 2) +
      R(-56, -98, 112, 50, '#d6ae6a') + bam + R(-14, -84, 28, 22, '#5a3a22', 3) +
      P('M-84 -92L0 -152L84 -92Z', '#8f6a3a') + P('M-84 -92L0 -152L-6 -138L-70 -94Z', '#a57c45') +
      P('M50 -44L60 0M58 -44L68 0', 'none', 'stroke="#6b4426" stroke-width="3"');
    return G('', inner, T(x, y, s));
  }

  function sampan(x, y, s) {
    var inner = P('M-66 -8Q0 16 66 -8L54 -16L-54 -16Z', '#6b3b22') + P('M-34 -16Q0 -46 34 -16Z', '#c8a165') +
      C(44, -26, 5, '#f2c29b') + P('M34 -28L44 -40L54 -28Z', '#e6c27a') + L(48, -22, 70, 10, '#8a5a33', 2.5);
    return G('bob', G('', inner, T(x, y, s)));
  }

  function bigLeaf(x, y, s, rot, col) {
    return G('sway-soft', P('M0 0Q70 -48 160 0Q70 48 0 0Z', col) + L(6, 0, 150, 0, '#ffffff', 2.5, 'opacity=".25"'),
      'transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + rot + ') scale(' + s + ')"');
  }

  function karst(x, base, w, h, col, extra) {
    return P('M' + f(x - w / 2) + ' ' + base + 'C' + f(x - w / 2) + ' ' + f(base - h * 0.85) + ' ' + f(x - w * 0.28) + ' ' + f(base - h) + ' ' + f(x) + ' ' + f(base - h) + 'C' + f(x + w * 0.28) + ' ' + f(base - h) + ' ' + f(x + w / 2) + ' ' + f(base - h * 0.85) + ' ' + f(x + w / 2) + ' ' + base + 'Z', col, extra);
  }

  function pagoda(x, y, s) {
    var inner = '';
    for (var i = 0; i < 4; i++) {
      var bw = 100 - i * 20, by = -i * 46, w = bw / 2;
      inner += R(-w * 0.72, by - 34, w * 1.44, 34, '#3b2440');
      inner += R(-8, by - 26, 16, 16, '#ffcf7a', 3);
      var yb = by - 30;
      inner += P('M' + f(-w - 18) + ' ' + f(yb) + 'Q' + f(-w - 4) + ' ' + f(yb - 6) + ' ' + f(-w + 8) + ' ' + f(yb - 16) + 'L' + f(w - 8) + ' ' + f(yb - 16) + 'Q' + f(w + 4) + ' ' + f(yb - 6) + ' ' + f(w + 18) + ' ' + f(yb) + 'Z', '#23172f');
      inner += R(-w - 12, yb - 3, w * 2 + 24, 4, '#e0483e', 2);
    }
    inner += R(-3, -224, 6, 40, '#f2b07a') + C(0, -228, 6, '#f2b07a') + R(-56, -4, 112, 6, '#23172f');
    return G('', inner, T(x, y, s));
  }

  function lantern(x, y, s, glowId) {
    var inner = L(0, -16, 0, 0, '#1d1530', 2) + C(0, 14, 34, 'url(#' + glowId + ')') +
      R(-11, 0, 22, 28, '#e0483e', 9) + L(-4, 2, -4, 26, '#b8332b', 1.6) + L(4, 2, 4, 26, '#b8332b', 1.6) +
      R(-7, -3, 14, 5, '#1d1530', 2) + R(-7, 26, 14, 5, '#1d1530', 2) + L(0, 31, 0, 40, '#f6c445', 2);
    return G('sway', G('', inner, T(x, y, s)));
  }

  function blossom(x, y, s, flip, r) {
    var k = flip ? -1 : 1;
    var inner = P('M0 0Q70 -26 150 -12M74 -22Q104 -62 136 -72M40 -12Q58 -44 52 -70', 'none', 'stroke="#3b2440" stroke-width="7" stroke-linecap="round"');
    for (var i = 0; i < 26; i++) {
      var t = r();
      var px = 20 + t * 130 + (r() - 0.5) * 30, py = -10 - r() * 66;
      inner += C(px, py, 5 + r() * 6, i % 3 ? '#f3a6b8' : '#f9cfda', 'opacity=".95"');
    }
    return G('', inner, 'transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + f(s * k * 100) / 100 + ' ' + f(s * 100) / 100 + ')"');
  }

  function flame(x, y, w, h, col, delay) {
    return P('M' + f(x) + ' ' + f(y) + 'C' + f(x - w) + ' ' + f(y - h * 0.3) + ' ' + f(x - w * 0.5) + ' ' + f(y - h * 0.7) + ' ' + f(x) + ' ' + f(y - h) + 'C' + f(x + w * 0.4) + ' ' + f(y - h * 0.6) + ' ' + f(x + w) + ' ' + f(y - h * 0.35) + ' ' + f(x) + ' ' + f(y) + 'Z', col, 'class="flicker" style="animation-delay:-' + delay + 's"');
  }

  function grill(x, y, s) {
    var inner =
      L(-70, -40, -96, 0, '#2b2220', 7) + L(70, -40, 96, 0, '#2b2220', 7) + L(-20, -40, -30, 0, '#2b2220', 6) + L(20, -40, 30, 0, '#2b2220', 6) +
      R(-96, -84, 192, 46, '#3a2a24', 8) +
      C(-50, -84, 11, '#eb5737') + C(-20, -86, 13, '#f68e10') + C(14, -84, 12, '#eb5737') + C(46, -86, 11, '#f68e10') +
      flame(-56, -86, 14, 58, '#f68e10', 0.2) + flame(-18, -86, 18, 80, '#eb5737', 0.6) + flame(20, -86, 16, 66, '#f68e10', 0.9) + flame(54, -86, 12, 48, '#ffd166', 0.4) +
      flame(-4, -86, 10, 40, '#ffd166', 1.1) +
      R(-100, -92, 200, 6, '#5a4a44', 3) +
      R(-74, -108, 46, 16, '#a0522d', 8) + R(-14, -110, 54, 18, '#8b4513', 9) + R(52, -108, 40, 16, '#a0522d', 8) +
      L(-64, -104, -54, -96, '#3a1f12', 2.5) + L(-50, -104, -40, -96, '#3a1f12', 2.5) + L(-2, -106, 8, -96, '#3a1f12', 2.5) + L(14, -106, 24, -96, '#3a1f12', 2.5) + L(62, -104, 72, -96, '#3a1f12', 2.5) +
      C(-20, -150, 16, '#ffffff', 'class="rise" opacity=".16"') + C(10, -170, 20, '#ffffff', 'class="rise" style="animation-delay:-2.5s" opacity=".14"') + C(-30, -190, 22, '#ffffff', 'class="rise" style="animation-delay:-4.5s" opacity=".12"');
    return G('', inner, T(x, y, s));
  }

  function person(x, y, s, o) {
    o = o || {};
    var inner = P('M-17 0L-14 -42Q0 -50 14 -42L17 0Z', o.shirt || '#2d78c4');
    if (o.apron) inner += R(-10, -36, 20, 36, o.apron, 3);
    inner += C(0, -56, 12, o.skin || '#f0bf98');
    if (o.chef) inner += P('M-9 -50Q0 -42 9 -50Q8 -44 0 -42Q-8 -44 -9 -50Z', '#7a4a2a') + R(-11, -74, 22, 10, '#ffffff', 2) + C(-8, -79, 8, '#ffffff') + C(0, -84, 9, '#ffffff') + C(8, -79, 8, '#ffffff');
    if (o.bun) inner += C(0, -72, 8, '#2a1a12') + P('M-12 -58Q-12 -70 0 -70Q12 -70 12 -58Q6 -64 0 -64Q-6 -64 -12 -58Z', '#2a1a12') + C(9, -64, 4, '#eb5737');
    inner += C(-4, -57, 1.4, '#261f1f') + C(4, -57, 1.4, '#261f1f');
    if (o.wave) inner += P('M13 -38Q24 -52 26 -66', 'none', 'stroke="' + (o.shirt || '#2d78c4') + '" stroke-width="6" stroke-linecap="round"') + C(26, -68, 4, o.skin || '#f0bf98');
    return G('', inner, T(x, y, s));
  }

  function grass(r, n, y0, y1, col) {
    var out = '';
    for (var i = 0; i < n; i++) {
      var x = r() * 1600, y = y0 + r() * (y1 - y0), h = 8 + r() * 12;
      out += P('M' + f(x) + ' ' + f(y) + 'l-3 ' + f(-h) + 'M' + f(x + 3) + ' ' + f(y) + 'l2 ' + f(-h * 1.1) + 'M' + f(x + 6) + ' ' + f(y) + 'l5 ' + f(-h * 0.8), 'none', 'stroke="' + col + '" stroke-width="2" stroke-linecap="round"');
    }
    return out;
  }

  /* ------------------------------------------------------------------
     Die Landschaften
     o.sky (Standard: true) zeichnet den Himmel
     o.voyage: Variante als Küste für «Die Reise»
     ------------------------------------------------------------------ */
  function skyRect(top, bottom, at) {
    var id = uid('sky');
    return '<defs>' + vGrad(id, [[0, top], [at || 0.74, bottom]]) + '</defs>' + R(-200, -400, 2000, 1700, 'url(#' + id + ')');
  }

  var scenes = {};

  scenes.norden = function (o) {
    var r = rnd(101), v = o.voyage, out = '';
    if (o.sky !== false) out += skyRect('#8ec3e3', '#eaf4f8');
    out += G('L L-sky', (v ? '' : sun(1230, 170, 58, '#fff6d6')) + cloud(220, 150, 1.1, '#ffffff', 0.92) + cloud(760, 96, 0.7, '#ffffff', 0.75) + cloud(1380, 250, 0.9, '#ffffff', 0.85));
    var far = ridge(r, { base: 560, amp: 330, n: 14, peaky: true, taper: v });
    out += G('L L-far', P(polyD(far, 0, 1600, 900), '#a9c2d2') + snowCaps(far, 400, '#ffffff'));
    var mr = ridge(r, { base: 615, amp: 220, n: 9, peaky: true, taper: v });
    var midInner = P(polyD(mr, 0, 1600, 900), '#7c9bb0') + snowCaps(mr, 470, '#f2f7fa');
    if (!v) {
      var shore = '';
      for (var x = 10; x < 1600; x += 22) shore += pine(x + r() * 8, 606, 0.3 + r() * 0.08, '#3c6a5a');
      midInner += R(0, 598, 1600, 160, '#6fa8c6') + R(0, 594, 1600, 12, '#4f7d6a') + shore +
        R(160, 640, 300, 4, '#ffffff', 2, 'opacity=".3"') + R(620, 668, 420, 4, '#ffffff', 2, 'opacity=".25"') + R(1180, 650, 260, 4, '#ffffff', 2, 'opacity=".3"') + R(380, 700, 220, 3, '#ffffff', 2, 'opacity=".2"');
    }
    out += G('L L-mid', midInner);
    var near = '';
    if (!v) {
      near += P(smoothD(ridge(r, { base: 765, amp: 60, n: 7 }), 0, 1600, 900), '#9cc66f') + P(smoothD(ridge(r, { base: 835, amp: 46, n: 6 }), 0, 1600, 900), '#7fb35c');
      near += fence(700, 1110, 868, 1, '#8a6a4a');
      near += pine(70, 836, 1.6, '#2f5d50') + pine(150, 852, 1.25, '#3d6e5a') + pine(225, 846, 1.45, '#2f5d50') + pine(1470, 840, 1.5, '#2f5d50') + pine(1545, 856, 1.2, '#3d6e5a');
      near += chalet(1250, 800, 1.3) + cow(470, 850, 1.1) + cow(610, 868, 0.9, true);
      for (var i = 0; i < 40; i++) near += C(r() * 1600, 840 + r() * 56, 2.5 + r() * 2, ['#e0483e', '#f6c445', '#ffffff'][i % 3]);
    } else {
      near += coast(700, '#8fbf66') + pine(330, 704, 1.1, '#2f5d50') + pine(392, 706, 0.9, '#3d6e5a') + pine(1290, 704, 1.1, '#2f5d50') + pine(1350, 708, 0.85, '#3d6e5a') +
        chalet(960, 704, 1.05) + cow(660, 712, 0.75) + fence(560, 760, 712, 0.7, '#8a6a4a');
    }
    out += G('L L-near', near);
    return out;
  };

  scenes.sueden = function (o) {
    var r = rnd(202), v = o.voyage, out = '';
    if (o.sky !== false) out += skyRect('#f4ae66', '#fde4bf', 0.72);
    out += G('L L-sky', (v ? '' : sun(1180, 290, 105, '#ffd36b')) + birds([[380, 170, 1], [430, 196, 0.8], [470, 160, 0.7], [1320, 120, 0.9]], '#8a4a2a'));
    var far = ridge(r, { base: 610, amp: 130, n: 8, taper: v });
    out += G('L L-far', P(smoothD(far, 0, 1600, 900), '#e8a06a'));
    var mr = ridge(r, { base: 668, amp: 80, n: 7, taper: v });
    var midInner = P(smoothD(mr, 0, 1600, 900), '#d07a4a') + acacia(430, 650, 0.6, '#5d6a2a') + acacia(1000, 640, 0.48, '#5d6a2a');
    out += G('L L-mid', midInner);
    var near = '';
    if (!v) {
      near += R(0, 694, 1600, 210, '#e3b65c') + P(smoothD(ridge(r, { base: 730, amp: 36, n: 7 }), 0, 1600, 900), '#d9a74f') + grass(r, 90, 720, 900, '#b98d3a');
      near += acacia(270, 770, 1.5) + acacia(1440, 750, 1.05);
      near += rondavel(1060, 778, 1.15, '#d9874f') + rondavel(1170, 790, 1.0, '#c9784a') + rondavel(960, 800, 0.85, '#e09a5e');
      near += tomatoPlant(110, 890, 1.35, r) + tomatoPlant(1540, 880, 1.15, r) + tomatoPlant(1610, 900, 1.2, r);
    } else {
      near += coast(700, '#e0b25a') + acacia(420, 704, 1.05) + rondavel(960, 704, 1, '#d9874f') + rondavel(1050, 708, 0.85, '#c9784a') + tomatoPlant(720, 708, 0.85, r) + tomatoPlant(1260, 706, 0.8, r);
    }
    out += G('L L-near', near);
    return out;
  };

  scenes.tropen = function (o) {
    var r = rnd(303), v = o.voyage, out = '';
    if (o.sky !== false) out += skyRect('#8fd3c1', '#ecf8f1', 0.7);
    out += G('L L-sky', (v ? '' : sun(1250, 170, 52, '#fff6cc')) + cloud(300, 130, 0.9, '#ffffff', 0.7) + cloud(980, 80, 0.6, '#ffffff', 0.6));
    var far = ridge(r, { base: 545, amp: 130, n: 9, taper: v });
    out += G('L L-far', P(smoothD(far, 0, 1600, 900), '#74b89a') + (v ? '' : R(0, 515, 1600, 46, '#ffffff', 0, 'opacity=".22"')));
    var mr = ridge(r, { base: 625, amp: 90, n: 8, taper: v });
    var midInner = P(smoothD(mr, 0, 1600, 900), '#4c9c78');
    if (!v) {
      midInner += P('M0 700C300 650 600 724 900 684S1400 640 1600 670L1600 770C1300 748 1000 796 600 776S200 764 0 796Z', '#4fb0a3') +
        R(220, 712, 180, 4, '#ffffff', 2, 'opacity=".35"') + R(760, 726, 240, 4, '#ffffff', 2, 'opacity=".3"') + R(1220, 696, 160, 4, '#ffffff', 2, 'opacity=".35"') +
        sampan(900, 724, 1.15) + stiltHouse(1330, 700, 1.15);
    }
    out += G('L L-mid', midInner);
    var near = '';
    if (!v) {
      near += P(smoothD(ridge(r, { base: 830, amp: 56, n: 6 }), 0, 1600, 900), '#2f8a5a');
      near += palm(150, 880, 390, 46, 1.3) + palm(310, 900, 300, -34, 1.1) + palm(1500, 890, 350, -56, 1.2);
      near += bigLeaf(-20, 880, 1.2, -35, '#1f6e45') + bigLeaf(30, 900, 1, -12, '#2e8b57') + bigLeaf(1620, 880, 1.2, -145, '#1f6e45') + bigLeaf(1580, 905, 0.9, -168, '#2e8b57');
      near += C(470, 862, 9, '#eb5737') + C(486, 870, 7, '#f68e10') + C(1120, 866, 8, '#eb5737');
    } else {
      near += coast(700, '#3e9a66') + stiltHouse(900, 704, 0.95) + palm(420, 706, 250, 30, 0.95) + palm(510, 708, 190, -22, 0.8) + palm(1220, 706, 240, -30, 0.95);
    }
    out += G('L L-near', near);
    return out;
  };

  scenes.fernost = function (o) {
    var r = rnd(404), v = o.voyage, out = '', glow = uid('lg');
    out += '<defs>' + rGrad(glow, [[0, '#ffb36b', 0.7], [1, '#ffb36b', 0]]) + '</defs>';
    if (o.sky !== false) {
      var id = uid('sky');
      out += '<defs>' + vGrad(id, [[0, '#241c4d'], [0.52, '#7d4a86'], [0.82, '#f0a86e']]) + '</defs>' + R(-200, -400, 2000, 1700, 'url(#' + id + ')');
    }
    out += G('L L-sky', (v ? '' : stars(r, 60, 10, 340) + sun(1160, 300, 78, '#ffd9a0')));
    var far = '';
    var xs = v ? [360, 520, 700, 860, 1080, 1250] : [90, 260, 420, 600, 760, 940, 1120, 1300, 1480];
    xs.forEach(function (x) { far += karst(x + r() * 40, 650, 110 + r() * 80, 200 + r() * 140, '#5b4380', 'opacity=".85"'); });
    out += G('L L-far', far + (v ? '' : R(0, 560, 1600, 40, '#ffffff', 0, 'opacity=".08"')));
    var mid2 = '';
    var xs2 = v ? [440, 640, 980, 1180] : [180, 380, 560, 840, 1040, 1380, 1560];
    xs2.forEach(function (x) { mid2 += karst(x + r() * 30, 690, 120 + r() * 60, 140 + r() * 110, '#3f2d63'); });
    if (!v) mid2 += R(0, 664, 1600, 240, '#2a2152') + R(1150, 680, 24, 5, '#ffd9a0', 2, 'opacity=".5"') + R(1130, 700, 60, 5, '#ffd9a0', 2, 'opacity=".4"') + R(1145, 724, 36, 5, '#ffd9a0', 2, 'opacity=".35"') + R(1120, 752, 80, 4, '#ffd9a0', 2, 'opacity=".25"');
    out += G('L L-mid', mid2);
    var near = '';
    if (!v) {
      near += P('M1080 900C1120 770 1220 760 1320 762S1560 790 1620 900Z', '#1d1530') + pagoda(1320, 770, 1.45);
      near += P('M-20 110Q340 230 740 150', 'none', 'stroke="#1d1530" stroke-width="3"');
      [[60, 140], [200, 176], [340, 196], [480, 194], [620, 170]].forEach(function (p) { near += lantern(p[0], p[1], 1.4, glow); });
      near += blossom(-10, 880, 1.6, false, r) + P('M560 790Q600 806 660 790L650 800L570 800Z', '#140e22') + R(606, 760, 3, 32, '#140e22');
    } else {
      near += coast(700, '#2c2046') + pagoda(1000, 704, 1.05) + R(540, 600, 5, 104, '#1d1530') + R(820, 600, 5, 104, '#1d1530') + P('M542 604Q682 650 822 604', 'none', 'stroke="#1d1530" stroke-width="2.5"');
      [[590, 618], [650, 630], [712, 632], [772, 620]].forEach(function (p) { near += lantern(p[0], p[1], 0.9, glow); });
      near += blossom(330, 704, 0.9, false, r);
    }
    out += G('L L-near', near);
    return out;
  };

  scenes.feuer = function (o) {
    var r = rnd(505), out = '';
    if (o.sky !== false) {
      var id = uid('sky');
      out += '<defs>' + vGrad(id, [[0, '#1d1430'], [0.5, '#6b2a3a'], [0.78, '#f07c33']]) + '</defs>' + R(-200, -400, 2000, 1700, 'url(#' + id + ')');
    }
    out += G('L L-sky', stars(r, 70, 10, 380));
    var far = R(0, 646, 1600, 260, '#3b2615') + P(smoothD(ridge(r, { base: 652, amp: 26, n: 8 }), 0, 1600, 900), '#4a2f18') +
      C(300, 600, 46, '#24170f') + C(350, 586, 54, '#24170f') + C(404, 604, 40, '#24170f') + R(338, 610, 18, 46, '#24170f');
    out += G('L L-far', far);
    out += G('L L-mid', P(smoothD(ridge(r, { base: 742, amp: 34, n: 7 }), 0, 1600, 900), '#4a3318') + fence(-20, 1640, 760, 1, '#24170f'));
    var near = P(smoothD(ridge(r, { base: 850, amp: 30, n: 6 }), 0, 1600, 900), '#5a3d1c') + grass(r, 70, 850, 900, '#7a5a2a') + grill(1180, 850, 1.6);
    for (var i = 0; i < 18; i++) near += C(1080 + r() * 200, 660 + r() * 60, 2 + r() * 2, '#ffd166', 'class="rise-spark" style="animation-delay:-' + f(r() * 4) + 's"');
    out += G('L L-near', near);
    return out;
  };

  scenes.kueche = function () {
    var r = rnd(606), out = '', tiles = '';
    out += R(-200, -400, 2000, 1100, '#f7e7cf');
    for (var x = -200; x < 1800; x += 52) tiles += L(x, 430, x, 640, '#ead3b4', 2);
    for (var y = 430; y < 640; y += 52) tiles += L(-200, y, 1800, y, '#ead3b4', 2);
    out += G('L L-far', R(-200, 430, 2000, 210, '#f3dcbd') + tiles +
      R(1040, 110, 360, 270, '#9fd0ea', 10) + R(1040, 300, 360, 80, '#bfe0ef') + C(1300, 170, 30, '#fff3c4') + L(1220, 110, 1220, 380, '#c98a4f', 10) + L(1040, 245, 1400, 245, '#c98a4f', 10) + R(1030, 100, 380, 290, 'none', 12, 'stroke="#b5763d" stroke-width="14"') +
      P('M1010 92Q1050 240 1000 400L1060 400Q1080 230 1050 92Z', '#f68e10') + P('M1430 92Q1390 240 1440 400L1380 400Q1360 230 1390 92Z', '#f68e10'));
    var shelf = R(150, 250, 440, 12, '#9b6a3e', 4);
    var jcol = ['#b9ae78', '#9a3a1f', '#b9853f', '#a5462b', '#8a5a34', '#c99a2e'];
    jcol.forEach(function (c, i) { var jx = 176 + i * 68; shelf += R(jx, 186, 40, 64, c, 8) + R(jx, 206, 40, 26, '#fffdf8') + R(jx + 2, 170, 36, 20, '#f2efe8', 6); });
    var tools = L(650, 150, 930, 150, '#8a6a4a', 6);
    [[690, 'ladle'], [760, 'spoon'], [830, 'whisk'], [895, 'spoon']].forEach(function (t) {
      tools += L(t[0], 150, t[0], 250, '#b5763d', 6) + (t[1] === 'ladle' ? C(t[0], 262, 18, '#b5763d') : t[1] === 'whisk' ? E(t[0], 266, 12, 24, 'none', 'stroke="#9aa3a8" stroke-width="4"') : E(t[0], 262, 10, 16, '#b5763d'));
    });
    out += G('L L-mid', shelf + tools);
    var near = R(-200, 640, 2000, 44, '#d4955a') + R(-200, 684, 2000, 420, '#b5763d');
    for (var dx = -120; dx < 1700; dx += 260) near += R(dx, 712, 230, 168, 'none', 10, 'stroke="#9b6233" stroke-width="5"') + R(dx + 100, 780, 30, 8, '#7a4a2a', 4);
    near += R(170, 600, 250, 40, '#d9a066', 12) + C(232, 588, 22, '#e0402a') + C(280, 594, 18, '#d6452b') + C(330, 590, 20, '#f6ecd9') + C(360, 596, 14, '#9cc66f');
    near += R(1430, 560, 90, 80, '#c9784a', 10) + E(1450, 520, 18, 44, '#3f8f3a', 'transform="rotate(-25 1450 520)"') + E(1500, 520, 18, 44, '#4fa046', 'transform="rotate(25 1500 520)"') + E(1475, 500, 16, 50, '#2e8b57');
    out += G('L L-near', near);
    void r;
    return out;
  };

  /* «Die Reise»: Sturm, Insel, Entdeckung */
  scenes.sturm = function () {
    var r = rnd(707), out = '', clouds = '', rain = '';
    for (var i = 0; i < 9; i++) {
      var x = 60 + i * 180 + r() * 60, y = 70 + r() * 120, s = 1.4 + r() * 1.2;
      clouds += C(x, y, 52 * s, i % 2 ? '#3a4058' : '#2c3146') + C(x + 60 * s, y + 10 * s, 44 * s, '#343a52');
    }
    for (var j = 0; j < 90; j++) {
      var rx = r() * 1600, ry = 180 + r() * 520;
      rain += L(rx, ry, rx - 18, ry + 46, '#c9d4ea', 2, 'opacity=".35"');
    }
    out += G('L L-far', G('rain', rain));
    out += G('L L-sky', clouds + P('M560 230L520 380L560 380L520 520L640 330L594 330L630 230Z', '#ffe27a', 'class="bolt"') + P('M1120 210L1090 330L1124 330L1094 440L1190 290L1150 290L1176 210Z', '#ffe27a', 'class="bolt" style="animation-delay:-1.3s"'));
    return out;
  };

  scenes.insel = function () {
    var r = rnd(808), out = '';
    out += G('L L-sky', cloud(240, 160, 0.9, '#ffffff', 0.7) + cloud(1220, 110, 0.7, '#ffffff', 0.6));
    var stripes = '';
    for (var i = 0; i < 8; i++) stripes += R(-120 + i * 30, -178, 30, 30, i % 2 ? '#fff3e0' : '#f68e10') + C(-105 + i * 30, -148, 15, i % 2 ? '#fff3e0' : '#f68e10');
    var stand =
      R(-112, -150, 8, 150, '#7a4a2a') + R(104, -150, 8, 150, '#7a4a2a') +
      person(-40, -54, 1.15, { shirt: '#2d78c4', apron: '#fffaf3', chef: true, wave: true }) + person(44, -54, 1.1, { shirt: '#f68e10', apron: '#fff3e0', bun: true, skin: '#c9875e' }) +
      R(-124, -62, 248, 62, '#b5763d', 6) + R(-124, -62, 248, 10, '#d4955a', 4) +
      C(-80, -70, 10, '#d6452b') + C(-56, -72, 12, '#f6ecd9') + C(70, -70, 11, '#5b3520') + C(92, -72, 9, '#f1e2c4') +
      stripes +
      R(-100, -240, 200, 60, '#261f1f', 10) +
      '<text x="0" y="-216" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-size="15" font-weight="700" fill="#ffffff">Grillen oder Kochen?</text>' +
      '<text x="0" y="-192" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-size="22" font-weight="800" fill="#ffd166">1001 Gerichte!</text>';
    var near = P('M180 900C340 704 560 664 800 664S1260 704 1420 900Z', '#f0cf8f') + P('M300 760C420 690 560 670 640 668L620 676C540 680 420 700 320 768Z', '#7ab55c', 'opacity=".9"') +
      palm(420, 694, 300, 40, 1.1) + palm(1250, 704, 250, -40, 1) +
      G('', stand, 'transform="translate(800 666)"') + grill(1020, 670, 0.6);
    out += G('L L-near', near);
    void r;
    return out;
  };

  scenes.entdeckung = function () {
    var out = sun(800, 560, 150, '#ffd36b');
    var items = [['Wasser', 'wasser'], ['Rahm', 'rahm'], ['Tomate', 'tomate'], ['Kokos', 'kokos'], ['Soja', 'soja']];
    var beach = P('M60 900C300 720 600 688 800 688S1300 720 1540 900Z', '#f2d39b') + palm(300, 720, 220, 30, 0.9) + palm(1320, 724, 200, -30, 0.85);
    items.forEach(function (d, i) {
      var x = 520 + i * 140, y = 640;
      beach += G('bob', G('', C(0, -4, 54, '#fffaf3', 'opacity=".85"') + '<g transform="scale(.85)">' + A.liquidIcon(d[1]) + '</g>', 'transform="translate(' + x + ' ' + y + ')"'), 'style="animation-delay:-' + (i * 0.4) + 's"') +
        '<text x="' + x + '" y="' + (y + 80) + '" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-size="20" font-weight="800" fill="#261f1f">' + d[0] + '</text>';
    });
    return G('L L-sky', out) + G('L L-near', beach);
  };

  A.scene = function (id, o) { return scenes[id](o || {}); };

  /* ------------------------------------------------------------------
     Das Meer für «Die Reise»
     ------------------------------------------------------------------ */
  /* Ein Meeresstück für ein Panel der Reise; x0 = Position im Gesamtbild, damit die Wellen nahtlos weiterlaufen */
  A.seaPanel = function (cols, x0, stormX, stormW) {
    var id = uid('sea');
    function amp(x) { var d = (x - stormX) / stormW; return 7 + 46 * Math.exp(-d * d); }
    var out = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">' +
      stops([[0, cols[0]], [0.5, cols[1]], [1, cols[2]]]) + '</linearGradient></defs>';
    var d = 'M-2 905L-2 735';
    for (var x = -2; x <= 1602; x += 20) d += 'L' + x + ' ' + f(735 + amp(x0 + x) * Math.sin((x0 + x) / 58));
    out += P(d + 'L1602 905Z', 'url(#' + id + ')');
    var foam = '';
    for (var k = 0; k < 3; k++) {
      var fd = 'M-2 ' + f(772 + k * 38 + (amp(x0) * 0.5 + 4) * Math.sin(x0 / 46 + k));
      for (var xx = 18; xx <= 1602; xx += 20) fd += 'L' + xx + ' ' + f(772 + k * 38 + (amp(x0 + xx) * 0.5 + 4) * Math.sin((x0 + xx) / 46 + k));
      foam += P(fd, 'none', 'stroke="#ffffff" stroke-width="3" opacity="' + (0.34 - k * 0.08) + '" stroke-linecap="round"');
    }
    return out + foam;
  };

  A.sea = function (W, cols, storm) {
    var id = uid('sea'), out = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="' + W + '" y2="0" gradientUnits="userSpaceOnUse">';
    cols.forEach(function (c, i) { out += '<stop offset="' + f((i + 0.5) / cols.length) + '" stop-color="' + c + '"/>'; });
    out += '</linearGradient></defs>';
    function amp(x) { var d = (x - storm[0]) / storm[1]; return 7 + 46 * Math.exp(-d * d); }
    var d = 'M0 900L0 735';
    for (var x = 0; x <= W; x += 30) d += 'L' + x + ' ' + f(735 + amp(x) * Math.sin(x / 58));
    d += 'L' + W + ' 900Z';
    out += P(d, 'url(#' + id + ')');
    var foam = '';
    for (var k = 0; k < 3; k++) {
      var fd = 'M-200 ' + (770 + k * 36);
      for (var xx = -200; xx <= W + 200; xx += 40) fd += 'L' + xx + ' ' + f(770 + k * 36 + (amp(xx) * 0.5 + 4) * Math.sin(xx / 46 + k));
      foam += P(fd, 'none', 'stroke="#ffffff" stroke-width="3" opacity="' + (0.35 - k * 0.08) + '" stroke-linecap="round"');
    }
    return out + G('waves', foam);
  };

  /* ------------------------------------------------------------------
     Schiff und Floss von Mr. Spice
     ------------------------------------------------------------------ */
  A.ship = function () {
    return '<svg class="ship" viewBox="0 0 320 280" aria-hidden="true">' +
      P('M156 22L196 31L156 40Z', '#eb5737') + R(152, 20, 6, 160, '#5a3420', 2) +
      P('M161 34C226 74 244 136 238 168L161 168Z', '#fff6e6') + P('M161 34C190 64 200 120 196 168L161 168Z', '#fde7c7') +
      P('M149 44C102 84 82 134 74 168L149 168Z', '#fff6e6') +
      R(206, 132, 12, 34, '#f68e10', 3) + R(222, 136, 12, 30, '#d6452b', 3) + R(190, 140, 12, 26, '#b9853f', 3) +
      person(110, 172, 0.9, { shirt: '#2d78c4', apron: '#fffaf3', chef: true, wave: true }) +
      P('M18 170L304 170L272 230C210 246 108 246 48 230Z', '#7a4527') + P('M18 170L304 170L298 182L24 182Z', '#f68e10') +
      C(90, 202, 7, '#ffd98a') + C(150, 206, 7, '#ffd98a') + C(210, 202, 7, '#ffd98a') +
      '</svg>';
  };
  A.raft = function () {
    var logs = '';
    for (var i = 0; i < 6; i++) logs += R(50 + i * 36, 200, 34, 26, i % 2 ? '#8a5a33' : '#7a4a2a', 13);
    return '<svg class="raft" viewBox="0 0 320 280" aria-hidden="true">' +
      R(156, 70, 6, 132, '#5a3420', 2) + P('M162 78C206 104 212 160 206 196L162 196Z', '#fde7c7') + R(176, 120, 16, 14, '#e0b98a', 2) +
      person(110, 206, 0.9, { shirt: '#2d78c4', apron: '#fffaf3', chef: true }) + logs + L(46, 214, 268, 214, '#5a3420', 3) +
      '</svg>';
  };

  /* ------------------------------------------------------------------
     Der Teller (Mitte 0/0, Radius 200)
     o.sauce, o.world, o.raw, o.all, o.grill, o.part ('base' | 'top')
     ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     Zutaten auf dem Teller, von oben gesehen (Mitte 0/0, Radius bis ca. 120)
     kind: poulet | rind | fisch | gemuese | mix
     ------------------------------------------------------------------ */
  function at(x, y, rot, s, inner, cls) {
    return '<g class="fd' + (cls ? ' ' + cls : '') + '" transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(rot || 0) + ') scale(' + f(s || 1) + ')">' + inner + '</g>';
  }
  function charLines(list, w) {
    return list.map(function (l) { return L(l[0], l[1], l[2], l[3], '#4a240e', w || 5); }).join('');
  }

  /* Pouletbrust: dickes Ende links, Spitze rechts, Innenfilet als Linie unten */
  function breast(raw, grill) {
    var c = raw ? ['#f4c3b5', '#d9978a', '#fde3db', '#e3a596'] : ['#e0a256', '#ad682b', '#f6cf8c', '#bf7a38'];
    var d = 'M-58 2C-60 -24 -38 -36 -10 -32C18 -28 44 -16 64 -2C68 1 67 5 62 7C44 12 26 18 8 24C-14 32 -56 30 -58 2Z';
    var dots = '';
    if (!raw) [[-40, -8], [-28, 10], [-16, -18], [-4, 4], [12, -12], [26, 4], [40, -4]].forEach(function (p) { dots += C(p[0], p[1], 2.2, '#9a5420', 'opacity=".45"'); });
    return P(d, c[1], 'transform="translate(0 5)"') +
      P(d, c[0], 'class="pc"') +
      P('M-44 16C-20 22 14 16 48 4', 'none', 'stroke="' + c[3] + '" stroke-width="3" stroke-linecap="round" opacity=".7"') +
      E(-24, -18, 20, 6, c[2], 'opacity=".7" transform="rotate(-6 -24 -18)"') +
      G('pc-sear', dots, raw ? 'opacity="0"' : '') +
      G('char', charLines([[-44, 18, -30, -26], [-24, 22, -8, -28], [-4, 20, 12, -24], [16, 14, 30, -16]], 5), 'opacity="' + (grill ? 1 : 0) + '"');
  }

  /* Pouletschenkel mit Knochen (z. B. Doro Wot); braised = in Sauce geschmort */
  function drumstick(raw, grill, braised) {
    var c = raw ? ['#f3c4b2', '#d99a88', '#fde1d6'] : braised ? ['#8f3c1c', '#5e2410', '#c9744a'] : ['#d98f45', '#a95f25', '#f4c47e'];
    var dots = '';
    if (!raw) [[-30, -10], [-20, 8], [-8, -14], [4, 6], [-36, 10], [-14, -2]].forEach(function (d) { dots += C(d[0], d[1], 2.2, braised ? '#3e160a' : '#9a5420', 'opacity=".45"'); });
    return P('M14 -6L52 -5L52 5L14 6Z', '#f4e9d4', 'stroke="#ddcdb0" stroke-width="2"') +
      C(57, -8, 8, '#f6ecd9', 'stroke="#ddcdb0" stroke-width="2"') + C(57, 8, 8, '#f6ecd9', 'stroke="#ddcdb0" stroke-width="2"') +
      P('M-48 4C-48 -22 -22 -32 0 -22C10 -17 18 -10 26 -6L26 8C18 12 10 18 0 24C-22 34 -48 28 -48 4Z', c[1]) +
      P('M-48 0C-48 -26 -22 -36 0 -26C10 -21 18 -14 26 -10L26 4C18 8 10 14 0 20C-22 30 -48 24 -48 0Z', c[0], 'class="pc"') +
      E(-24, -14, 14, 5, c[2], 'opacity=".7"') +
      G('pc-sear', dots, raw ? 'opacity="0"' : '') +
      G('char', charLines([[-38, 16, -26, -22], [-22, 20, -10, -22], [-6, 16, 4, -18]], 5), 'opacity="' + (grill ? 1 : 0) + '"');
  }

  /* Geschnetzeltes: ein unregelmässiges Fleischstück, mit Sauce überzogen */
  function sliver(r, len, wid, sauce) {
    var h = len / 2, w = wid / 2, b = (r() - 0.5) * 6;
    var d = 'M' + f(-h) + ' ' + f(-w * 0.4) + 'C' + f(-h * 0.5) + ' ' + f(-w + b) + ' ' + f(h * 0.4) + ' ' + f(-w * 1.1 + b) + ' ' + f(h) + ' ' + f(-w * 0.5) +
      'C' + f(h + 3) + ' 0 ' + f(h) + ' ' + f(w * 0.8) + ' ' + f(h * 0.6) + ' ' + f(w) + 'L' + f(-h * 0.7) + ' ' + f(w * 0.9) + 'C' + f(-h - 2) + ' ' + f(w * 0.7) + ' ' + f(-h - 2) + ' 0 ' + f(-h) + ' ' + f(-w * 0.4) + 'Z';
    var out = P(d, '#b8844a', 'transform="translate(0 2.5)"') + P(d, '#dcac6e', 'class="pc"') +
      P('M' + f(-h * 0.6) + ' ' + f(-w * 0.45 + b / 2) + 'Q0 ' + f(-w * 0.75 + b) + ' ' + f(h * 0.6) + ' ' + f(-w * 0.55 + b / 2), 'none', 'stroke="#f0d3a2" stroke-width="2.4" stroke-linecap="round"');
    /* Die untere Hälfte liegt in der Sauce: gleiche Farbe wie die Sauce,
       darum verschmilzt sie mit dem Teller. Oben eine glänzende Kante. */
    if (sauce) {
      var e = 'M' + f(-h - 6) + ' ' + f(w * 0.5) + 'Q' + f(-h * 0.5) + ' ' + f(w * 0.2) + ' 0 ' + f(w * 0.5) + 'T' + f(h + 6) + ' ' + f(w * 0.45);
      out += P(e + 'L' + f(h + 6) + ' ' + f(w + 8) + 'L' + f(-h - 6) + ' ' + f(w + 8) + 'Z', sauce) +
        P('M' + f(-h * 0.7) + ' ' + f(w * 0.4) + 'Q' + f(-h * 0.35) + ' ' + f(w * 0.3) + ' 0 ' + f(w * 0.5) + 'T' + f(h * 0.6) + ' ' + f(w * 0.45), 'none', 'stroke="#fffaf0" stroke-width="2.2" stroke-linecap="round" opacity=".85"');
    }
    return out;
  }

  /* Gebratenes Pouletfilet in Tranchen: jede Scheibe leicht verschoben,
     an der Schnittkante sieht man das helle Fleisch */
  function slicedFillet() {
    var d = 'M-58 2C-60 -24 -38 -36 -10 -32C18 -28 44 -16 64 -2C68 1 67 5 62 7C44 12 26 18 8 24C-14 32 -56 30 -58 2Z';
    var cuts = [-62, -38, -18, 2, 22, 42, 70], shape = uid('sf'), out = '<defs><clipPath id="' + shape + '"><path d="' + d + '"/></clipPath></defs>';
    for (var i = 0; i < cuts.length - 1; i++) {
      var id = uid('sl'), x0 = cuts[i], w = cuts[i + 1] - x0;
      out += '<defs><clipPath id="' + id + '"><rect x="' + x0 + '" y="-50" width="' + w + '" height="100"/></clipPath></defs>' +
        '<g transform="translate(' + f(i * 8) + ' ' + f(i * 0.8) + ')"><g clip-path="url(#' + id + ')">' +
        P(d, '#ad682b', 'transform="translate(0 5)"') +
        '<g clip-path="url(#' + shape + ')">' + P(d, '#e0a256') +
        E(-24, -18, 20, 6, '#f6cf8c', 'opacity=".6" transform="rotate(-6 -24 -18)"') +
        (i ? R(x0, -50, 6, 100, '#f7e8cc') + R(x0 + 6, -50, 2, 100, '#c98a44', 0, 'opacity=".5"') : '') +
        '</g></g></g>';
    }
    return out;
  }
  /* Sauce, die über das Fleisch gelaufen ist */
  function glaze(color, spots) {
    return spots.map(function (s) { return E(s[0], s[1], s[2], s[3], color, 'transform="rotate(' + f(s[4] || 0) + ' ' + f(s[0]) + ' ' + f(s[1]) + ')"'); }).join('');
  }

  function steak(raw, grill) {
    var c = raw ? ['#b8323e', '#cf4652', '#f7ece0'] : ['#5f2a14', '#86411f', '#ecd6b0'];
    var marb = raw
      ? P('M-40 -10Q-20 -24 0 -12T40 -6M-30 20Q-6 8 20 22T52 12M-50 6Q-40 -2 -26 4', 'none', 'stroke="#f7e4dc" stroke-width="2.5" opacity=".75" stroke-linecap="round"')
      : P('M-40 -10Q-20 -24 0 -12T40 -6M-30 20Q-6 8 20 22', 'none', 'stroke="#a8603a" stroke-width="2" opacity=".5" stroke-linecap="round"');
    return P('M-70 -16C-66 -48 -20 -56 18 -46C52 -38 76 -20 72 10C68 44 30 60 -10 56C-48 52 -74 22 -70 -16Z', c[0]) +
      P('M-66 -18C-62 -44 -20 -50 16 -42C48 -34 70 -18 66 8C62 38 28 52 -10 49C-44 46 -68 18 -66 -18Z', c[1], 'class="pc"') +
      P('M-62 -28C-56 -50 -20 -56 16 -46C38 -40 56 -32 64 -20', 'none', 'stroke="' + c[2] + '" stroke-width="10" stroke-linecap="round"') +
      marb +
      G('char', charLines([[-50, 30, -10, -40], [-24, 42, 16, -34], [2, 48, 40, -22], [-58, -8, 40, 30]], 6), 'opacity="' + (grill ? 1 : 0) + '"');
  }
  function steakSlice() {
    return P('M-44 -8C-44 -20 44 -22 44 -8L44 8C44 22 -44 20 -44 8Z', '#5f2a14') + P('M-38 -4C-38 -13 38 -15 38 -4L38 4C38 13 -38 11 -38 4Z', '#c94f5a') + E(0, 0, 26, 4.5, '#e98a86');
  }

  function fish(raw, grill) {
    var c = raw ? ['#c4d0d7', '#6f8ea0', '#eef3f5', '#9fb4c0'] : ['#dba86c', '#a96a32', '#f4dcae', '#c48a4c'];
    var scales = '';
    for (var x = -30; x <= 34; x += 14) scales += P('M' + x + ' -12q6 6 0 12M' + (x + 7) + ' 2q6 6 0 12', 'none', 'stroke="' + c[3] + '" stroke-width="2" opacity=".8"');
    return P('M58 -10L94 -36C88 -12 88 12 94 36L58 10Z', c[1]) +
      P('M-10 -34Q14 -54 36 -30Z', c[1]) + P('M-4 32Q14 46 30 28Z', c[3]) +
      P('M-82 0C-62 -40 22 -46 62 -12L62 12C22 46 -62 40 -82 0Z', c[0], 'class="pc"') +
      P('M-82 0C-62 -40 22 -46 62 -12L62 -2C24 -16 -40 -18 -82 0Z', c[1], 'opacity=".55"') +
      P('M-74 8C-50 30 10 34 54 10C20 22 -40 22 -74 8Z', c[2], 'opacity=".8"') +
      scales +
      P('M-48 -22Q-38 0 -48 22', 'none', 'stroke="' + c[1] + '" stroke-width="3" stroke-linecap="round"') +
      C(-62, -6, 6.5, '#ffffff') + C(-61, -6, 3.4, '#1d1515') +
      G('char', charLines([[-34, 24, -18, -26], [-12, 28, 4, -28], [10, 26, 26, -24], [32, 18, 46, -14]], 5), 'opacity="' + (grill ? 1 : 0) + '"');
  }
  function lemon() {
    var seg = '';
    for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; seg += L(0, 0, Math.cos(a) * 13, Math.sin(a) * 13, '#f2df7a', 2); }
    return C(0, 0, 17, '#f2c63a') + C(0, 0, 14, '#fbeaa0') + seg;
  }

  function broccoli() {
    return P('M-5 4L-3 22L3 22L5 4Z', '#9cc66f') +
      C(-11, -4, 11, '#2f6f2a') + C(9, -5, 11, '#2f6f2a') + C(0, -14, 12, '#3f8a3a') + C(-8, -8, 9, '#4fa046') + C(8, -10, 9, '#4fa046') + C(0, -2, 9, '#3f8a3a') +
      C(-4, -16, 2, '#7cbf5e') + C(6, -12, 2, '#7cbf5e') + C(-10, -6, 2, '#7cbf5e');
  }
  function carrot() {
    var r = '';
    for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2; r += L(Math.cos(a) * 3, Math.sin(a) * 3, Math.cos(a) * 9, Math.sin(a) * 9, '#f4b25a', 1.5); }
    return C(0, 0, 13, '#e8761c') + C(0, 0, 9.5, '#f39a3a') + r + C(0, 0, 3, '#f6c06a');
  }
  function tomato() {
    var seeds = '';
    [[-5, -3], [4, -5], [6, 3], [-3, 5], [-6, 2]].forEach(function (s) { seeds += E(s[0], s[1], 2.2, 1.4, '#f6d36b'); });
    return C(0, 0, 14, '#c9331f') + C(0, 0, 11, '#e65a3e') + C(0, 0, 3.5, '#f39a7e') + seeds;
  }
  function zucchini(grill) {
    var seeds = '';
    for (var i = 0; i < 7; i++) { var a = i / 7 * Math.PI * 2; seeds += E(Math.cos(a) * 6, Math.sin(a) * 6, 1.8, 1.1, '#c8d48a', 'transform="rotate(' + f(i / 7 * 360) + ' ' + f(Math.cos(a) * 6) + ' ' + f(Math.sin(a) * 6) + ')"'); }
    return C(0, 0, 15, '#2f6a28') + C(0, 0, 12.5, '#e9f0bf') + seeds +
      G('char', charLines([[-9, 9, 3, -11], [-1, 12, 11, -8]], 3.5), 'opacity="' + (grill ? 1 : 0) + '"');
  }
  function pepper(col) {
    return P('M-22 6Q0 -14 22 4', 'none', 'stroke="' + col + '" stroke-width="10" stroke-linecap="round"') +
      P('M-18 2Q0 -12 18 0', 'none', 'stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity=".35"');
  }

  A.food = function (kind, o) {
    o = o || {};
    var raw = !!o.raw, grill = !!o.grill, out = '';
    if (kind === 'rind') {
      if (raw) return at(0, 0, -8, 1.25, steak(true, false));
      out += at(-30, -26, -12, 0.98, steak(false, grill));
      [[8, 72, -14], [34, 56, -30], [56, 34, -46], [72, 8, -62]].forEach(function (s) { out += at(s[0], s[1], s[2], 1, steakSlice()); });
      return out;
    }
    if (kind === 'fisch') {
      return at(0, -10, -12, 1.12, fish(raw, grill)) + (raw ? '' : at(-44, 66, 0, 1, lemon()) + at(-12, 78, 0, 0.85, lemon()));
    }
    if (kind === 'gemuese') {
      out += '<g transform="scale(1.22)">';
      [[-46, -50, 0, 1.15], [-80, 4, 20, 1.05], [-6, -84, -10, 1]].forEach(function (b) { out += at(b[0], b[1], b[2], b[3], broccoli()); });
      [[-38, 52], [-2, 74], [-70, 56], [30, 88]].forEach(function (c) { out += at(c[0], c[1], 0, 1, carrot()); });
      [[40, -34], [74, 6], [16, 4], [-22, 2]].forEach(function (z) { out += at(z[0], z[1], 0, 1, zucchini(grill)); });
      [[46, -74], [64, 50]].forEach(function (t) { out += at(t[0], t[1], 0, 1, tomato()); });
      out += at(90, -32, 70, 1, pepper('#e0402a')) + at(42, 44, -20, 0.9, pepper('#f2b632'));
      return out + '</g>';
    }
    if (kind === 'mix') {
      return at(-30, 58, 6, 0.74, fish(true, false)) +
        at(-52, -26, -150, 0.95, breast(true, false)) +
        at(44, -48, 14, 0.66, steak(true, false)) +
        at(62, 30, 0, 1.25, broccoli()) + at(94, -2, 0, 1.1, carrot()) + at(40, 82, 0, 1.1, carrot()) + at(84, 62, 0, 1.1, tomato()) + at(16, 4, 0, 1.1, tomato());
    }
    /* Poulet je nach Gericht anders geschnitten */
    if (kind === 'poulet-streifen') {
      var rs = rnd(41);
      for (var y = -66; y <= 66; y += 33) {
        for (var x = -84 + (Math.abs(y / 33) % 2 ? 32 : 0); x <= 84; x += 64) {
          var px = x + (rs() - 0.5) * 20, py = y + (rs() - 0.5) * 12;
          if (px * px + py * py < 92 * 92) out += at(px, py, (rs() - 0.5) * 110, 1.5, sliver(rs, 36 + rs() * 8, 18 + rs() * 4, raw ? null : o.sauce));
        }
      }
      return out;
    }
    if (kind === 'poulet-tranchen') {
      return at(-2, -40, -8, 1.1, slicedFillet()) + at(2, 44, -8, 1.1, slicedFillet());
    }
    if (kind === 'poulet-schenkel') {
      var braised = !raw && !!o.sauce;
      out += at(-10, -62, -24, 1.12, drumstick(raw, grill, braised)) + at(10, 0, 156, 1.12, drumstick(raw, grill, braised)) + at(-10, 62, -24, 1.12, drumstick(raw, grill, braised));
      if (braised) out += G('', glaze(o.sauce, [[-44, -46, 14, 6, -24], [-6, -70, 10, 5, -24], [30, 8, 13, 6, -24], [-4, -12, 9, 4, -24], [-48, 68, 12, 5, -24], [-12, 44, 10, 4, -24]]), 'opacity=".9"');
      return out;
    }
    if (kind === 'poulet-filet') {
      return at(-10, -8, -14, 1.5, breast(raw, grill));
    }
    return at(-6, -40, -16, 1.15, breast(raw, grill)) + at(6, 42, 164, 1.15, breast(raw, grill));
  };

  function garnish(id, r) {
    var out = '', i, a, d;
    function spot() { a = r() * Math.PI * 2; d = Math.sqrt(r()) * 104; return [Math.cos(a) * d, Math.sin(a) * d]; }
    if (id === 'norden' || id === 'kueche') {
      for (i = 0; i < 22; i++) { var p = spot(); out += E(p[0], p[1], 3.5 + r() * 2, 2.4, i % 2 ? '#4c8a3c' : '#6aa84f', 'transform="rotate(' + f(r() * 180) + ' ' + f(p[0]) + ' ' + f(p[1]) + ')"'); }
    } else if (id === 'sueden') {
      for (i = 0; i < 20; i++) { var q = spot(); out += E(q[0], q[1], 4, 2.6, '#3f7d3a', 'transform="rotate(' + f(r() * 180) + ' ' + f(q[0]) + ' ' + f(q[1]) + ')"'); }
      for (i = 0; i < 8; i++) { var q2 = spot(); out += C(q2[0], q2[1], 3, '#f6ecd9', 'opacity=".9"'); }
    } else if (id === 'tropen') {
      for (i = 0; i < 9; i++) { var t = spot(); out += P('M0 0Q8 -8 18 0Q8 8 0 0Z', '#3f9a52', 'transform="translate(' + f(t[0]) + ' ' + f(t[1]) + ') rotate(' + f(r() * 360) + ')"'); }
      for (i = 0; i < 5; i++) { var c = spot(); out += C(c[0], c[1], 4.5, 'none', 'stroke="#d63a2a" stroke-width="2.5"'); }
      out += P('M80 60A26 26 0 0 1 132 60Z', '#9ccc4a', 'transform="rotate(-20 106 60)"') + P('M84 60A22 22 0 0 1 128 60Z', '#e9f5c8', 'transform="rotate(-20 106 60)"');
    } else if (id === 'fernost') {
      for (i = 0; i < 36; i++) { var s = spot(); out += E(s[0], s[1], 2.6, 1.4, '#fff4dc', 'transform="rotate(' + f(r() * 180) + ' ' + f(s[0]) + ' ' + f(s[1]) + ')"'); }
      for (i = 0; i < 12; i++) { var g = spot(); out += C(g[0], g[1], 4, 'none', 'stroke="#6aa84f" stroke-width="2.4"'); }
    } else if (id === 'feuer') {
      for (i = 0; i < 26; i++) { var h = spot(); out += C(h[0], h[1], 2.6 + r() * 1.6, i % 3 ? '#3f7d3a' : '#d63a2a'); }
      out += P('M80 60A26 26 0 0 1 132 60Z', '#9ccc4a', 'transform="rotate(-20 106 60)"') + P('M84 60A22 22 0 0 1 128 60Z', '#e9f5c8', 'transform="rotate(-20 106 60)"');
    }
    return out;
  }

  A.plate = function (o) {
    o = o || {};
    var r = rnd(o.seed || 77), out = '', sh = uid('psh');
    if (o.part !== 'top') {
      out += '<defs>' + rGrad(sh, [[0.62, '#261f1f', 0.3], [1, '#261f1f', 0]]) + '</defs>';
      out += E(18, 30, 246, 236, 'url(#' + sh + ')');
      out += C(0, 0, 200, '#fffdf8') + C(0, 0, 194, 'none', 'stroke="#ebe3d6" stroke-width="2"') + C(0, 0, 152, '#f4efe7') + C(0, 0, 152, 'none', 'stroke="#e4dacb" stroke-width="3"') +
        P('M-158 -62A170 170 0 0 1 -62 -158', 'none', 'stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".9"');
      if (o.grill || o.all) {
        var ridges = '';
        for (var y = -112; y <= 112; y += 22) { var hw = Math.sqrt(132 * 132 - y * y); ridges += L(-hw, y, hw, y, '#4a3a33', 8); }
        out += G('grill-g', C(0, 0, 136, '#2e2320') + ridges, o.all ? 'opacity="0"' : '');
      }
      var hasSauce = !!o.sauce && !o.grill;
      out += G('sauce-g', C(0, 0, 128, o.sauce || '#f1e2c4', 'class="sauce"') +
        P('M-82 -70C-40 -106 40 -106 84 -64', 'none', 'stroke="#ffffff" stroke-width="9" stroke-linecap="round" opacity=".32"') + C(-60, 58, 10, '#ffffff', 'opacity=".2"'),
        (hasSauce || o.all ? '' : 'opacity="0"'));
    }
    if (o.part === 'base') return out;
    out += G('food', A.food(o.food || 'poulet', { raw: o.raw, grill: o.grill && !o.all, sauce: o.grill ? null : o.sauce }));
    if (o.all) {
      ['norden', 'sueden', 'tropen', 'fernost', 'feuer'].forEach(function (id) { out += G('gar gar-' + id, garnish(id, rnd(id.length * 31)), 'opacity="0"'); });
    } else if (o.world) {
      out += G('gar gar-' + o.world, garnish(o.world, rnd(o.world.length * 31)));
    }
    return out;
  };

  /* Flammenkranz um den Teller («Feuer») */
  A.flameRing = function () {
    var out = '';
    for (var i = 0; i < 14; i++) {
      var a = i / 14 * 360, h = 40 + (i % 3) * 14;
      out += G('', flame(0, -196, 16, h, i % 2 ? '#f68e10' : '#eb5737', f(i * 0.17)) + flame(0, -196, 8, h * 0.6, '#ffd166', f(i * 0.23)), 'transform="rotate(' + f(a) + ')"');
    }
    return out;
  };

  /* ------------------------------------------------------------------
     Gefässe zum Giessen (Ausguss oben rechts bei 0/0)
     ------------------------------------------------------------------ */
  A.vessel = function (id) {
    if (id === 'norden') {
      return P('M0 0L-22 4L-30 10L-34 20C-40 46 -44 84 -36 112C-30 126 -82 126 -86 112C-94 84 -92 46 -82 20L-84 6Q-60 -2 -30 2Z', '#fffdf6', 'stroke="#d9d2c4" stroke-width="2"') +
        P('M-86 30Q-110 40 -104 66Q-100 86 -86 84', 'none', 'stroke="#fffdf6" stroke-width="9" stroke-linecap="round"') +
        R(-84, 56, 50, 14, '#7fb3d8', 3) + E(-58, 8, 26, 6, '#f1e2c4');
    }
    if (id === 'sueden') {
      return R(-92, 4, 92, 124, '#c9ccd0', 8) + R(-92, 30, 92, 76, '#d6452b') + R(-92, 30, 92, 8, '#f6c445') + R(-92, 98, 92, 8, '#f6c445') +
        C(-46, 66, 20, '#e0402a') + C(-52, 60, 5, '#f58a70') + P('M-46 46l3 4l5 -1l-3 4l3 4l-5 -1l-3 4l-3 -4l-5 1l3 -4l-3 -4l5 1Z', '#2f6f2a') +
        R(-96, 0, 96, 10, '#aeb2b8', 5) + E(-48, 4, 40, 4, '#b8321f');
    }
    if (id === 'tropen') {
      return P('M0 0C-4 44 -42 66 -60 66C-82 66 -110 44 -112 0Z', '#6b4a2b') + P('M-6 0C-10 34 -40 52 -56 52C-76 52 -104 34 -106 0Z', '#fffaf0') +
        E(-56, 2, 50, 6, '#f6eedb') + P('M-30 30l-4 4M-70 24l-3 5M-50 40l-2 5', 'none', 'stroke="#8a6a4a" stroke-width="2"');
    }
    if (id === 'fernost') {
      return P('M0 0L-12 4L-30 30L-30 44L-62 70L-62 150Q-62 162 -50 162L-6 162Q6 162 6 150L6 70L-24 44L-24 30Z', '#3b2214', 'transform="translate(-6 0)"') +
        R(-46, 92, 48, 42, '#e0483e', 4) + R(-38, 104, 32, 18, '#fffdf8', 3) + R(-34, 18, 12, 14, '#e0483e', 3, 'transform="rotate(-50 -28 25)"');
    }
    return '';
  };

  /* ------------------------------------------------------------------
     Das Redline-Gewürzglas (0..120 × 0..300)
     ------------------------------------------------------------------ */
  A.jar = function (o) {
    o = o || {};
    var name = o.name || 'Mekong', spice = o.spice || '#b9853f', g1 = uid('jg'), sp = uid('js');
    var fs = Math.min(18, 136 / Math.max(name.length, 3));
    var ridges = '';
    for (var x = 26; x <= 94; x += 8) ridges += L(x, 22, x, 50, '#e2ddd3', 3);
    return '<g class="jar">' +
      '<defs><linearGradient id="' + g1 + '" x1="0" x2="1">' + stops([[0, '#000', 0.22], [0.16, '#fff', 0.5], [0.3, '#fff', 0], [0.76, '#000', 0], [1, '#000', 0.26]]) + '</linearGradient>' +
      '<pattern id="' + sp + '" width="9" height="9" patternUnits="userSpaceOnUse">' + C(2, 2, 1.3, '#000', 'opacity=".24"') + C(6.5, 5.5, 1.1, '#fff', 'opacity=".28"') + C(3.5, 7.5, 0.8, '#000', 'opacity=".16"') + '</pattern></defs>' +
      R(14, 62, 92, 232, spice, 18) + R(14, 62, 92, 232, 'url(#' + sp + ')', 18) +
      R(14, 112, 92, 134, '#fffdf8') +
      '<text x="60" y="131" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" letter-spacing="1.6" fill="#d7261e">REDLINE</text>' +
      '<text x="60" y="153" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-size="' + f(fs) + '" font-weight="800" fill="#1f2a44">' + esc(name) + '</text>' +
      C(60, 186, 22, o.dish || '#f1e2c4') + C(60, 186, 22, 'none', 'stroke="#ffffff" stroke-width="3"') + E(52, 184, 7, 5, '#e0a95e') + E(66, 190, 8, 5, '#d39550') + E(62, 178, 6, 4, '#e0a95e') + C(54, 194, 2, '#4c8a3c') + C(70, 180, 2, '#4c8a3c') +
      P('M14 216C40 202 78 232 106 210L106 246L14 246Z', '#2d78c4') + P('M14 228C44 216 76 242 106 226L106 246L14 246Z', '#8cc6ef', 'opacity=".95"') +
      R(14, 62, 92, 232, 'url(#' + g1 + ')', 18) + R(14, 62, 92, 232, 'none', 18, 'stroke="#261f1f" stroke-opacity=".14" stroke-width="2"') +
      R(10, 50, 100, 16, '#e4dfd6', 5) + R(16, 6, 88, 50, '#f6f4ef', 12) + ridges + R(16, 6, 88, 12, '#ffffff', 6) +
      '</g>';
  };
  A.jarSvg = function (o) {
    o = o || {};
    var a = o.label ? 'role="img" aria-label="' + esc(o.label) + '"' : 'aria-hidden="true"';
    return '<svg class="jar-svg" viewBox="0 0 120 300" ' + a + '>' + A.jar(o) + '</svg>';
  };

  /* ------------------------------------------------------------------
     Kochflüssigkeiten als Gefäss oder Zutat (Mitte etwa 0/0, Höhe ca. 100)
     rahm | tomate | kokos | soja | wasser | sauce (Pfanne, Farbe als 2. Wert)
     ------------------------------------------------------------------ */
  A.liquidIcon = function (kind, col) {
    if (kind === 'rahm') {
      return P('M24 -26Q46 -22 44 0Q42 18 26 20', 'none', 'stroke="#d9d2c4" stroke-width="12" stroke-linecap="round"') +
        P('M24 -26Q46 -22 44 0Q42 18 26 20', 'none', 'stroke="#fffdf6" stroke-width="6" stroke-linecap="round"') +
        P('M-24 -42L24 -42L27 -28C31 -4 31 20 25 34Q23 40 15 40L-15 40Q-23 40 -25 34C-31 20 -31 -4 -27 -28Z', '#fffdf6', 'stroke="#d9d2c4" stroke-width="3" stroke-linejoin="round"') +
        P('M-24 -42L-40 -50L-27 -30Z', '#fffdf6', 'stroke="#d9d2c4" stroke-width="3" stroke-linejoin="round"') +
        E(0, -42, 23, 5, '#f1e2c4') + R(-29, -4, 58, 12, '#7fb3d8') +
        P('M-17 -30C-21 -8 -21 12 -17 28', 'none', 'stroke="#ffffff" stroke-width="5" stroke-linecap="round"');
    }
    if (kind === 'tomate') {
      return P('M-36 4C-36 -22 -17 -32 0 -32C17 -32 36 -22 36 4C36 28 19 40 0 40C-19 40 -36 28 -36 4Z', '#d6452b') +
        P('M-36 4C-36 28 -19 40 0 40C19 40 36 28 36 4C32 24 17 34 0 34C-17 34 -32 24 -36 4Z', '#b02e1c') +
        E(-15, -12, 10, 6, '#f58a70', 'transform="rotate(-30 -15 -12)"') +
        P('M0 -38L5 -30L16 -36L12 -25L24 -22L12 -18L14 -10L4 -16L0 -8L-4 -16L-14 -10L-12 -18L-24 -22L-12 -25L-16 -36L-5 -30Z', '#2f7a2a') +
        R(-2.5, -50, 5, 14, '#3f7d3a', 2);
    }
    if (kind === 'kokos') {
      return E(22, 30, 14, 9, '#f3ead8', 'stroke="#6b4a2b" stroke-width="4"') +
        P('M-40 -8A40 40 0 0 0 40 -8Z', '#6b4a2b') +
        P('M-26 6l-6 6M-8 16l-3 8M12 14l3 8M30 2l6 5M-34 -2l-6 3', 'none', 'stroke="#8f6b48" stroke-width="2.5" stroke-linecap="round"') +
        E(0, -8, 40, 11, '#f3ead8') + E(0, -8, 33, 8, '#fffaf0') + E(-12, -10, 9, 2.4, '#ffffff');
    }
    if (kind === 'soja') {
      return P('M-8 -50L8 -50L8 -38C8 -30 22 -24 22 -8L22 32Q22 40 14 40L-14 40Q-22 40 -22 32L-22 -8C-22 -24 -8 -30 -8 -38Z', '#3b2214') +
        R(-10, -60, 20, 12, '#d7261e', 3) + R(-11, -50, 22, 4, '#a81c16', 1) +
        R(-18, -2, 36, 30, '#fffdf8', 3) + C(0, 13, 9, '#d7261e') + P('M-4 9Q0 5 4 9Q0 12 0 17', 'none', 'stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"') +
        P('M-15 -14L-15 -4', 'none', 'stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".3"');
    }
    if (kind === 'wasser') {
      return P('M-27 -44L27 -44L21 34Q20 40 13 40L-13 40Q-20 40 -21 34Z', '#eef8fc', 'stroke="#8fbfd8" stroke-width="3" stroke-linejoin="round"') +
        P('M-25 -16Q-12 -22 0 -16T25 -16L21 34Q20 40 13 40L-13 40Q-20 40 -21 34Z', '#9fd3f0') +
        P('M-17 -36L-12 30', 'none', 'stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".85"') +
        C(8, 4, 3.2, '#ffffff', 'opacity=".75"') + C(2, 20, 2.2, '#ffffff', 'opacity=".65"') + C(12, 24, 1.8, '#ffffff', 'opacity=".6"');
    }
    if (kind === 'sauce') {
      return P('M-12 -32q-7 -8 0 -16M2 -34q-7 -8 0 -16M16 -32q-7 -8 0 -16', 'none', 'stroke="#c9b8a8" stroke-width="3.5" stroke-linecap="round"') +
        R(-50, -10, 18, 9, '#261f1f', 4) + R(32, -10, 18, 9, '#261f1f', 4) +
        P('M-36 -14L36 -14L33 26Q32 36 22 36L-22 36Q-32 36 -33 26Z', '#3a302c') +
        E(0, -14, 36, 9, '#4a3e38') + E(0, -14, 31, 6.5, col || '#e8a24a') + E(-10, -15, 8, 2, '#ffffff', 'opacity=".45"');
    }
    return '';
  };

  /* ------------------------------------------------------------------
     Inhalte der fünf Welten (aus waskocheichheute.ch)
     ------------------------------------------------------------------ */
  A.WORLDS = [
    { id: 'norden', num: '01', region: 'Kalte Klimazone · Schweiz, Skandinavien, Nordamerika', pre: 'Der', name: 'Norden', liquid: 'Rahm', spice: 'Helvetica', dish: 'Geschnetzeltes nach Zürcher Art', text: 'Wo Kühe, Ziegen und Schafe weiden, kocht man mit Milch und Rahm. Mild, rund und gemütlich.', sauce: '#f1e2c4', spiceColor: '#b9ae78', liquidColor: '#fbf6ec', bg: '#cfe6f2', sky: '#8ec3e3', ground: '#7fb35c' },
    { id: 'sueden', num: '02', region: 'Lateinische und afrikanische Länder', pre: 'Der', name: 'Süden', liquid: 'Tomate', spice: 'Äthiopien', dish: 'Doro Wot', text: 'Von Argentinien über Italien bis Äthiopien: Wo Tomaten in der Sonne reifen, werden sie zur Sauce.', sauce: '#d6452b', spiceColor: '#9a3a1f', liquidColor: '#d6452b', bg: '#fbd9a8', sky: '#f4ae66', ground: '#e3b65c' },
    { id: 'tropen', num: '03', region: 'Tropischer Gürtel · Südostasien, Karibik, Madagaskar', pre: 'Die', name: 'Tropen', liquid: 'Kokosmilch', spice: 'Mekong', dish: 'Golden River', text: 'Wo Palmen wachsen, gibt die Kokosnuss den Ton an. Cremig, frisch und exotisch.', sauce: '#f6eedb', spiceColor: '#b9853f', liquidColor: '#fffaf0', bg: '#bfe9dc', sky: '#8fd3c1', ground: '#2f8a5a' },
    { id: 'fernost', num: '04', region: 'Fernost · China, Korea, Japan', pre: 'Der', name: 'Osten', liquid: 'Soja', spice: 'Peking', dish: 'Peking-Spiess', text: 'In Hongkong und China lernte Mr. Spice den Umgang mit Soja: salzig, tief und voller Umami.', sauce: '#5b3520', spiceColor: '#a5462b', liquidColor: '#3b2214', bg: '#2c2350', sky: '#241c4d', ground: '#2a2152', dark: true },
    { id: 'feuer', num: '05', region: 'Überall auf der Welt', pre: 'Das', name: 'Feuer', liquid: 'Grill', spice: 'Argentinien', dish: 'Pollo del Sol', text: 'Grilliert wird überall. Ob Pampa oder Balkon: Das Gewürz entscheidet, wohin die Reise geht.', sauce: '#3a2a24', spiceColor: '#8a5a34', liquidColor: '#f68e10', bg: '#2a1b2e', sky: '#1d1430', ground: '#5a3d1c', dark: true }
  ];

  A.rnd = rnd;
  A.uid = uid;
  A.parts = { breast: breast, drumstick: drumstick, slicedFillet: slicedFillet, fish: fish, steak: steak, steakSlice: steakSlice, broccoli: broccoli, carrot: carrot, tomato: tomato, zucchini: zucchini, pepper: pepper, lemon: lemon, grill: grill, person: person, cow: cow, chalet: chalet, palm: palm, pine: pine, acacia: acacia, tomatoPlant: tomatoPlant, lantern: lantern, pagoda: pagoda, flame: flame, sun: sun, cloud: cloud };
  window.Art = A;
})();
