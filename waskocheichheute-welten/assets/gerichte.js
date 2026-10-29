/* ==========================================================================
   Redline · Gerichte: gemeinsame Zeichnungen für Kochideen, Für dich und Co.
   Jedes Gericht ist so gezeichnet, wie es im echten Leben aussieht
   (Schnitt, Pfanne oder Teller, Beilagen), dazu das passende Gewürzglas.
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, P = A.parts;

  /* Glasfarben angenähert, an die echten Produkte anpassen */
  var SPICE = {
    mekong:        { name: 'Mekong', color: '#b9853f', world: 'tropen' },
    puertorico:    { name: 'Puerto Rico', color: '#c27a2a', world: 'tropen' },
    helvetica:     { name: 'Helvetica', color: '#b9ae78', world: 'norden' },
    spanien:       { name: 'Spanien', color: '#c0502a', world: 'sueden' },
    cajun:         { name: 'Cajun', color: '#a8462a', world: 'tropen' },
    bbq:           { name: 'BBQ Südstaaten', color: '#7b4a2c', world: 'feuer' },
    argentinien:   { name: 'Argentinien', color: '#8a5a34', world: 'sueden' },
    suedindien:    { name: 'Süd Indien', color: '#c99a2e', world: 'tropen' },
    korea:         { name: 'Korea', color: '#7a3a2a', world: 'fernost' },
    peking:        { name: 'Peking', color: '#a5462b', world: 'fernost' },
    canada:        { name: 'Canada', color: '#8a6a3a', world: 'norden' },
    france:        { name: 'France', color: '#8f8a52', world: 'norden' },
    einsfueralles: { name: '1 für Alles', color: '#9c8c5a', world: 'norden' },
    schweden:      { name: 'Schweden', color: '#a89a5c', world: 'norden' },
    quebec:        { name: 'Quebec', color: '#8a5a3a', world: 'norden' },
    kosaken:       { name: 'Kosaken', color: '#7d5a3a', world: 'norden' },
    newmexiko:     { name: 'New Mexiko', color: '#b0442a', world: 'sueden' },
    aethiopien:    { name: 'Äthiopien', color: '#9a3a1f', world: 'sueden' }
  };

  /* ------------------------------------------------------------------
     Zeichen-Werkzeuge (Teller-Koordinaten: Mitte 0/0, Teller-Radius 200)
     ------------------------------------------------------------------ */
  function n(v) { return Math.round(v * 10) / 10; }
  function g(x, y, s, inner, rot) { return '<g transform="translate(' + n(x) + ' ' + n(y) + ')' + (rot ? ' rotate(' + n(rot) + ')' : '') + ' scale(' + s + ')">' + inner + '</g>'; }
  function pth(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function ln(x1, y1, x2, y2, col, w, extra) { return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra ? ' ' + extra : '') + '/>'; }
  function dot(x, y, r, fill, extra) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function ell(x, y, rx, ry, fill, extra) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function box(x, y, w, h, rx, fill, extra) { return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + rx + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function rot(x, y, deg) { return 'transform="rotate(' + n(deg) + ' ' + n(x) + ' ' + n(y) + ')"'; }
  function svg(vb, inner, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="' + vb + '" aria-hidden="true">' + inner + '</svg>'; }

  function plate(o) { var q = { part: 'base' }; for (var k in o) q[k] = o[k]; return A.plate(q); }
  function scatter(seed, count, rad, draw) {
    var r = A.rnd(seed), s = '';
    for (var i = 0; i < count; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad; s += draw(Math.cos(a) * d, Math.sin(a) * d, r, i); }
    return s;
  }
  function herb(col) { return function (x, y, r) { return ell(x, y, 4 + r() * 2, 2.4, col, rot(x, y, r() * 180)); }; }
  function sesame(x, y, r) { return ell(x, y, 2.6, 1.4, '#fff4dc', rot(x, y, r() * 180)); }
  function ring(col) { return function (x, y) { return dot(x, y, 4.5, 'none', 'stroke="' + col + '" stroke-width="2.6"'); }; }
  function leaf(x, y, deg, s, col, vein) { return g(x, y, s, pth('M-14 0Q0 -10 14 0Q0 10 -14 0Z', col) + ln(-11, 0, 11, 0, vein || '#ffffff', 1.2, 'opacity=".4"'), deg); }
  function dish(x, y, r, sauce, inner) {
    return g(x, y, 1, dot(5, 7, r + 2, '#261f1f', 'opacity=".14"') + dot(0, 0, r, '#fffdf8', 'stroke="#e4dacb" stroke-width="3"') + dot(0, 0, r - 7, sauce) + (inner || '') +
      ell(-r * 0.3, -r * 0.38, r * 0.3, r * 0.1, '#fff', 'opacity=".4"'));
  }
  /* angebratenes Stück (Poulet, Fisch …) */
  function chunk(r, c) {
    c = c || ['#e0a256', '#ad682b', '#f6cf8c'];
    var w = 28 + r() * 8, h = 22 + r() * 6;
    return box(-w / 2, -h / 2 + 4, w, h, 9, c[1]) + box(-w / 2, -h / 2, w, h, 9, c[0]) + ell(-w * 0.15, -h * 0.22, w * 0.26, 3, c[2], 'opacity=".8"') +
      dot(w * 0.2, h * 0.1, 1.8, c[1], 'opacity=".6"') + dot(-w * 0.25, h * 0.2, 1.6, c[1], 'opacity=".5"');
  }
  var FISH = ['#f6efe0', '#e2c48c', '#ffffff'];
  function pieces(r, spots, draw, s) { return spots.map(function (p) { return g(p[0], p[1], s || 1, draw(r), (r() - 0.5) * 70); }).join(''); }
  /* Gemüse und Beilagen */
  function kale(x, y, deg, s) {
    var b = '';
    [[-26, 0, 11], [-14, -6, 12], [0, -8, 12], [14, -6, 11], [26, -1, 10], [-20, 8, 10], [-4, 8, 11], [12, 7, 10]].forEach(function (c, i) { b += dot(c[0], c[1], c[2], i % 2 ? '#3d6e33' : '#4f8a3f'); });
    return g(x, y, s, b + pth('M-30 2Q0 -6 30 0', 'none', 'stroke="#9cc66f" stroke-width="2.4" stroke-linecap="round"'), deg);
  }
  function pear(x, y, deg, s) { return g(x, y, s, pth('M-20 6Q0 -22 20 6Q0 -4 -20 6Z', '#f4ecc0') + pth('M-20 6Q0 -22 20 6', 'none', 'stroke="#b9a73c" stroke-width="2.6"') + ell(0, -2, 2, 3.4, '#6b4a22'), deg); }
  function pepperBit(x, y, deg, col) { return g(x, y, 1, box(-8, -6, 16, 13, 3, col) + box(-5, -4, 6, 3, 1.5, '#fff', 'opacity=".3"'), deg); }
  function scallionRing(x, y) { return dot(x, y, 5, 'none', 'stroke="#5fae4a" stroke-width="2.8"'); }
  function chili(x, y) { return dot(x, y, 4.5, 'none', 'stroke="#d63a2a" stroke-width="2.6"'); }
  function mushroomSlice(x, y, deg, s, cap) {
    return g(x, y, s, pth('M-16 2C-16 -14 16 -14 16 2C10 4 6 3 5 6L5 18C5 21 -5 21 -5 18L-5 6C-6 3 -10 4 -16 2Z', '#f1e6d2', 'stroke="' + (cap || '#b89a72') + '" stroke-width="2.4"') +
      pth('M-13 -2C-12 -10 12 -10 13 -2', 'none', 'stroke="' + (cap || '#b89a72') + '" stroke-width="3" opacity=".6"'), deg);
  }
  function chanterelle(x, y, deg, s) {
    return g(x, y, s, pth('M-14 -10Q0 -16 14 -10Q8 0 3 4L2 16Q0 19 -2 16L-3 4Q-8 0 -14 -10Z', '#f0a02a') + pth('M-10 -9Q0 -13 10 -9', 'none', 'stroke="#d07e14" stroke-width="2"') + ln(0, -6, 0, 12, '#f7c46a', 1.6), deg);
  }
  function parsley(x, y, s) { return g(x, y, s, dot(-4, 0, 4.5, '#3f8a3a') + dot(4, -1, 4.5, '#4c9a3a') + dot(0, -6, 4.5, '#5aa846') + ln(0, 2, 0, 10, '#4c8a3c', 1.4)); }
  function dill(x, y, deg) { var b = ln(-16, 0, 16, 0, '#5d9a42', 1.6); for (var i = -12; i <= 12; i += 6) b += ln(i, 0, i + 4, -6, '#6aa84f', 1.3) + ln(i, 0, i + 4, 6, '#6aa84f', 1.3); return g(x, y, 1, b, deg); }
  /* Pfannen und Schalen */
  function skillet(fill, inner) {
    return dot(10, 14, 202, '#261f1f', 'opacity=".2"') + g(0, 0, 1, box(178, -17, 150, 34, 14, '#2e2826') + box(300, -8, 18, 16, 6, '#4a4240'), -38) +
      dot(0, 0, 200, '#2e2826') + dot(0, 0, 186, '#3c3431') + dot(0, 0, 172, fill) + inner + pth('M-150 -70A160 160 0 0 1 -70 -150', 'none', 'stroke="#5a504c" stroke-width="6" stroke-linecap="round"');
  }
  function wok(fill, inner) {
    return dot(10, 14, 204, '#261f1f', 'opacity=".2"') + g(0, 0, 1, box(176, -13, 170, 26, 12, '#a8733f') + box(176, -13, 40, 26, 6, '#4a4240'), -38) +
      dot(0, 0, 202, '#3c3836') + dot(0, 0, 190, '#56504c') + dot(0, 0, 172, '#3c3836') + dot(0, 0, 160, fill) + inner +
      pth('M-160 -60A170 170 0 0 1 -60 -160', 'none', 'stroke="#7a726e" stroke-width="5" stroke-linecap="round"');
  }
  function bowl(fill, inner) {
    return dot(10, 16, 194, '#261f1f', 'opacity=".18"') + dot(0, 0, 192, '#fffdf8') + dot(0, 0, 192, 'none', 'stroke="#e7dccd" stroke-width="3"') +
      dot(0, 0, 170, '#efe5d6') + dot(4, 8, 156, fill) + inner + pth('M-150 -50A160 160 0 0 1 -50 -150', 'none', 'stroke="#ffffff" stroke-width="9" stroke-linecap="round" opacity=".9"');
  }

  /* Gemüse-Geschnetzeltes: angebratene Streifen, halb in der Rahmsauce; c = [Seite, Oberseite, Glanz] */
  function vegStrips(c, seed) {
    var r = A.rnd(seed), out = plate({ sauce: '#f1e2c4' });
    for (var y = -66; y <= 66; y += 33) {
      for (var x = -84 + (Math.abs(y / 33) % 2 ? 32 : 0); x <= 84; x += 64) {
        var px = x + (r() - 0.5) * 20, py = y + (r() - 0.5) * 12, w = 36 + r() * 8;
        if (px * px + py * py < 92 * 92) out += g(px, py, 1.3, box(-w / 2, -7, w, 17, 6, c[0]) + box(-w / 2, -9, w, 16, 6, c[1]) + ln(-w / 2 + 5, -5, w / 2 - 5, -5, c[2], 2.2) +
          pth('M' + n(-w / 2 - 5) + ' 3Q' + n(-w / 4) + ' 0 0 3T' + n(w / 2 + 5) + ' 3L' + n(w / 2 + 5) + ' 14L' + n(-w / 2 - 5) + ' 14Z', '#f1e2c4') +
          pth('M' + n(-w / 2 + 2) + ' 3Q' + n(-w / 4) + ' 0 0 3T' + n(w / 2 - 4) + ' 3', 'none', 'stroke="#fffaf0" stroke-width="1.8" stroke-linecap="round" opacity=".85"'), (r() - 0.5) * 110);
      }
    }
    return out + scatter(seed + 4, 18, 110, herb('#4c8a3c'));
  }

  /* ------------------------------------------------------------------
     Die Gerichte
     ------------------------------------------------------------------ */
  var DRAW = {
    goldenriver: function () { return A.plate({ sauce: '#f6eedb', world: 'tropen', food: 'poulet-tranchen' }); },
    geschnetzeltes: function () { return A.plate({ sauce: '#f1e2c4', world: 'norden', food: 'poulet-streifen' }); },
    pollo: function () { return A.plate({ grill: true, world: 'feuer', food: 'poulet-filet' }) + g(70, 72, 1.5, P.lemon()) + g(100, 38, 1.3, P.lemon()); },
    federkohl: function () {
      var r = A.rnd(3);
      return plate({ sauce: '#f6eedb' }) + kale(-62, -58, 20, 1.1) + kale(64, -62, -30, 1) + kale(-58, 64, 60, 1) + kale(70, 54, 120, 1.05) +
        pieces(r, [[-22, -28], [30, -14], [-34, 18], [18, 34], [-2, -72], [-84, -4], [84, 0]], chunk) +
        pear(54, -18, 30, 1.1) + pear(-8, 82, -20, 1.1) + pear(-92, -50, 10, 1) + pear(6, 0, 70, 1) + scatter(5, 10, 110, herb('#4c8a3c'));
    },
    ragout: function (o) {
      var r = A.rnd(7);
      return plate({ sauce: o.sauce || '#d6452b' }) + pieces(r, [[-40, -40], [20, -54], [56, -6], [-60, 20], [6, 4], [-14, 56], [44, 50]], chunk) +
        [[-6, -88], [80, -46], [-86, -18], [-50, 86], [70, 86], [28, 22]].map(function (z) { return g(z[0], z[1], 1.15, P.zucchini()); }).join('') +
        scatter(9, 16, 112, herb('#3f7d3a'));
    },
    jambalaya: function () {
      var r = A.rnd(11), rice = '';
      for (var i = 0; i < 150; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()) * 164, x = Math.cos(a) * d, y = Math.sin(a) * d; rice += ell(x, y, 4.2, 1.9, i % 3 ? '#f2b56c' : '#e88d43', rot(x, y, r() * 180)); }
      return skillet('#d9772e', rice + pieces(r, [[-50, -40], [30, -70], [70, 10], [-80, 40], [10, 30], [-20, 90], [80, 80]], chunk) +
        pepperBit(-10, -30, 20, '#d6452b') + pepperBit(50, 50, -30, '#4f9a3c') + pepperBit(-70, -90, 10, '#4f9a3c') + pepperBit(100, -60, 40, '#d6452b') + pepperBit(-110, 0, -20, '#d6452b') +
        scatter(13, 12, 140, scallionRing) + scatter(14, 10, 140, herb('#3f8a3a')));
    },
    smoky: function () {
      /* BBQ auf dem Holzbrett: glasierte Schenkel mit Grillstreifen, dazu BBQ-Sauce */
      var leg = function (x, y, deg) { return g(x, y, 1.08, P.drumstick(false, true, true) + ell(-26, -12, 12, 3.5, '#ffffff', 'opacity=".5"') + ell(-10, 8, 8, 2.5, '#ffffff', 'opacity=".35"'), deg); };
      var grain = [-70, -40, -10, 20, 50, 80].map(function (v) { return pth('M-190 ' + v + 'C-100 ' + (v - 8) + ' 60 ' + (v + 10) + ' 190 ' + (v - 4), 'none', 'stroke="#b07a45" stroke-width="2.5" opacity=".6"'); }).join('');
      var board = g(0, 0, 1, box(-196, -108, 392, 228, 26, '#261f1f', 'opacity=".16" transform="translate(10 14)"') + box(-196, -108, 392, 228, 26, '#d49a5c') + box(-196, -108, 392, 228, 26, 'none', 'stroke="#b47c42" stroke-width="6"') + grain +
        dot(170, -84, 9, '#b47c42'), -8);
      return board + leg(-20, -54, -20) + leg(4, 6, 160) + leg(-22, 66, -20) +
        dish(118, 70, 32, '#6b2414', ell(-4, 4, 11, 4, '#a8442a', 'opacity=".7"')) + scatter(97, 8, 120, herb('#4c8a3c'));
    },
    kerala: function () {
      var r = A.rnd(17), curry = function (x, y, deg) { return leaf(x, y, deg, 0.9, '#2f5e2a', '#6aa84f'); };
      return plate({ sauce: '#e8a33a' }) + pieces(r, [[-44, -44], [24, -60], [64, 0], [-66, 18], [0, 8], [-14, 64], [50, 56]], function (q) { return chunk(q, FISH); }) +
        curry(-90, -60, 30) + curry(84, -70, -40) + curry(-30, 100, 10) + curry(96, 40, 80) + curry(-100, 50, -20) +
        scatter(19, 12, 110, herb('#4c9a3a')) + scatter(20, 6, 110, chili);
    },
    mok: function () {
      var fillet = function (x, y, deg) {
        var d = 'M-74 0C-64 -30 44 -34 78 -8C82 -3 82 4 78 9C44 34 -64 30 -74 0Z';
        return g(x, y, 1.3, pth(d, '#b8732e', 'transform="translate(0 5)"') + pth(d, '#e3ad5e') +
          pth('M-50 -16L-40 14M-26 -22L-14 20M0 -24L12 22M26 -20L36 16M50 -12L58 10', 'none', 'stroke="#c4843a" stroke-width="3" stroke-linecap="round"') +
          ell(-16, -14, 34, 4, '#f6d494', 'opacity=".8"'), deg);
      };
      /* Pak Choi, der Länge nach halbiert: weisser Stiel, dunkelgrüne Blätter */
      var pakchoi = function (x, y, deg) {
        var veins = [-14, -4, 6, 16].map(function (v) { return pth('M6 0Q30 ' + v + ' 56 ' + n(v * 1.6), 'none', 'stroke="#7cbf5e" stroke-width="2" stroke-linecap="round"'); }).join('');
        return g(x, y, 1, pth('M-2 -16C20 -34 62 -30 68 0C62 30 20 34 -2 16Z', '#2f7a34') + pth('M4 -12C22 -26 56 -22 62 0C56 22 22 26 4 12Z', '#3f8a3a') + veins +
          pth('M-58 0C-58 -9 -34 -14 4 -12L4 12C-34 14 -58 9 -58 0Z', '#e6efcf') + pth('M-50 -3L0 -6M-50 3L0 6', 'none', 'stroke="#c9dca2" stroke-width="2" stroke-linecap="round"'), deg);
      };
      return plate({ sauce: '#f6eedb' }) + pakchoi(-34, 76, 12) + pakchoi(66, 60, -28) + fillet(-8, -30, -8) +
        leaf(-96, -60, 40, 1, '#3f8a3a', '#a2cf7c') + leaf(96, -40, -30, 1, '#3f8a3a', '#a2cf7c') + leaf(-96, 30, 80, 0.9, '#4c9a3a', '#a2cf7c') + scatter(23, 5, 110, chili);
    },
    fischwok: function () {
      var r = A.rnd(29), strip = function (x, y, deg, col) { return g(x, y, 1.1, P.pepper(col), deg); };
      return wok('#6b3f22', pieces(r, [[-40, -40], [30, -56], [62, 10], [-62, 26], [0, 50]], function (q) { return chunk(q, ['#ecd3a2', '#b98d52', '#fbefd6']); }) +
        strip(-70, -80, 20, '#e0402a') + strip(70, -70, -40, '#f2b632') + strip(-20, 0, 70, '#e0402a') + strip(70, 60, 30, '#f2b632') + g(-90, 80, 1, P.broccoli()) + g(40, 96, 0.9, P.broccoli()) +
        scatter(31, 12, 140, scallionRing) + scatter(32, 30, 140, sesame));
    },
    burger: function () {
      /* von der Seite gezeichnet, so erkennt man den Burger sofort */
      var q = A.rnd(37), seeds = '';
      for (var j = 0; j < 14; j++) { var x = q() * 140 - 70, y = -60 + q() * 40 + Math.abs(x) * 0.35; seeds += ell(x, y, 3.4, 1.8, '#fff6e0', rot(x, y, q() * 180)); }
      var lettuce = 'M-108 2';
      for (var k = 0; k < 9; k++) lettuce += 'q12 ' + (k % 2 ? 10 : -6) + ' 24 0';
      lettuce += 'L108 16L-108 16Z';
      return plate({}) + dish(116, -104, 30, '#4f8a3a', scatter(39, 12, 18, function (x, y) { return dot(x, y, 2.2, '#c9e08a'); })) +
        g(-8, 10, 1, ell(0, 84, 112, 14, '#261f1f', 'opacity=".16"') +
          box(-92, 44, 184, 36, 18, '#c98a42') + box(-92, 44, 184, 14, 8, '#dca457') +
          box(-102, 14, 204, 36, 16, '#4e2810') + box(-102, 14, 204, 14, 10, '#6b3a1e') +
          dot(-60, 32, 2.4, '#3a1c0a') + dot(-20, 36, 2.4, '#3a1c0a') + dot(30, 30, 2.4, '#3a1c0a') + dot(70, 36, 2.4, '#3a1c0a') +
          box(-94, 4, 188, 14, 6, '#d6452b') + pth(lettuce, '#5aa846') +
          pth('M-98 4C-98 -88 98 -88 98 4Z', '#d69444') + pth('M-90 -2C-90 -78 90 -78 90 -2Z', '#e3a652') + ell(-30, -50, 34, 12, '#f3c47a', 'opacity=".8" ' + rot(-30, -50, -18)) + seeds);
    },
    plaetzli: function () {
      var slice = function (x, y, deg, s) {
        var d = 'M-60 -6C-56 -30 30 -36 58 -16C70 -6 66 14 50 22C20 34 -40 34 -56 18C-62 12 -62 4 -60 -6Z';
        return g(x, y, s, pth(d, '#5e2c14', 'transform="translate(0 4)"') + pth(d, '#8a4a26') + pth('M-50 -8C-40 -22 20 -26 46 -12', 'none', 'stroke="#b0683a" stroke-width="7" stroke-linecap="round" opacity=".7"') +
          ln(-30, 14, -12, -18, '#4a200c', 3, 'opacity=".5"') + ln(0, 16, 18, -18, '#4a200c', 3, 'opacity=".5"'), deg);
      };
      return plate({}) + slice(-16, -58, -10, 1.1) + slice(10, 8, 6, 1.1) + slice(-10, 72, -4, 1.05) +
        g(20, -4, 1, dot(0, 0, 18, '#f6e08a') + dot(0, 0, 18, 'none', 'stroke="#e8c85a" stroke-width="2"') + dot(-5, -3, 2, '#4c8a3c') + dot(5, 2, 2, '#4c8a3c') + dot(1, 7, 2, '#4c8a3c')) +
        scatter(41, 14, 120, herb('#3f8a3a')) + scatter(42, 6, 120, function (x, y) { return dot(x, y, 3, '#5e2c14', 'opacity=".5"'); });
    },
    rindwok: function () {
      var r = A.rnd(43), beef = function (q) { var w = 36 + q() * 10; return box(-w / 2, -5, w, 12, 5, '#3e1a0c') + box(-w / 2, -7, w, 11, 5, '#6a3018') + ln(-w / 2 + 6, -4, w / 2 - 8, -5, '#a85a32', 2, 'opacity=".7"'); };
      return wok('#4a2a17', pieces(r, [[-60, -50], [-10, -70], [40, -40], [70, 20], [-40, 0], [10, 20], [-70, 50], [-10, 70], [40, 80]], beef, 1.2) +
        g(-90, -10, 1.1, P.pepper('#e0402a'), 40) + g(60, -90, 1.1, P.pepper('#f2b632'), -20) + g(90, 60, 1.1, P.pepper('#e0402a'), 70) + g(-30, 40, 1.1, P.pepper('#4f9a3c'), -10) +
        g(-60, -100, 0.9, P.broccoli()) + g(20, 110, 0.9, P.broccoli()) + scatter(47, 10, 140, scallionRing) + scatter(48, 30, 140, sesame));
    },
    chana: function () {
      var peas = scatter(53, 34, 130, function (x, y, q) { return dot(x + 4, y + 8, 9 + q() * 2, '#c99a52') + dot(x + 3, y + 7, 7.5, '#e6c07a') + dot(x + 1, y + 5, 2.4, '#f6e2b0'); });
      return bowl('#c9542a', peas + pth('M-60 -10C-30 -40 30 -40 50 -10C60 10 20 30 0 10', 'none', 'stroke="#fbf3e2" stroke-width="10" stroke-linecap="round" opacity=".9"') +
        leaf(-70, 60, 30, 0.9, '#4c9a3a', '#a2cf7c') + leaf(60, 70, -20, 0.9, '#4c9a3a', '#a2cf7c') + leaf(80, -50, 60, 0.8, '#4c9a3a', '#a2cf7c') + scatter(55, 8, 120, herb('#3f8a3a')));
    },
    kohlrabi: function () {
      var steak = function (x, y, s) {
        return g(x, y, s, dot(3, 5, 62, '#a9bf7a') + dot(0, 0, 62, '#c9db98') + dot(0, 0, 54, '#eef3d4') + dot(0, 0, 54, 'none', 'stroke="#dbe6b4" stroke-width="2" stroke-dasharray="3 5"') +
          [-30, -10, 10, 30].map(function (v) { return ln(v - 14, -42, v + 14, 42, '#4a3a20', 6, 'opacity=".75"'); }).join(''));
      };
      var grass = function (x, y, deg) { return g(x, y, 1, box(-60, -5, 120, 10, 5, '#c9d68a') + box(-60, -5, 40, 10, 5, '#a9bf6a') + ln(-50, 0, 50, 0, '#e6edc0', 1.6), deg); };
      return plate({}) + grass(-20, -112, 8) + grass(10, 118, -6) + steak(-46, -10, 1) + steak(58, 22, 0.9) +
        [[-90, 70], [100, -60], [90, 100]].map(function (p) { return g(p[0], p[1], 1, pth('M-12 -8C-4 -14 10 -10 12 -2C14 8 2 12 -6 10C-14 8 -16 -2 -12 -8Z', '#f2dc9a') + dot(0, 0, 3, '#e3c66e')); }).join('') +
        scatter(59, 6, 120, chili) + scatter(60, 10, 120, herb('#4c9a3a'));
    },
    sellerie: function () {
      var steak = '';
      for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; steak += dot(Math.cos(a) * 76, Math.sin(a) * 74, 12, i % 2 ? '#bfa77a' : '#cdb98e'); }
      steak += dot(0, 0, 78, '#d9c79c') + dot(0, 0, 70, '#f1e6c8') + [-36, -12, 12, 36].map(function (v) { return ln(v - 18, -54, v + 18, 54, '#4a3a20', 7, 'opacity=".7"'); }).join('') +
        ell(-20, -24, 24, 8, '#fbf3dc', 'opacity=".6"');
      return plate({}) + g(-20, -14, 1, steak) +
        mushroomSlice(84, 30, -20, 1.1) + mushroomSlice(64, 84, 10, 1.1) + mushroomSlice(-80, 88, 30, 1.05) + mushroomSlice(96, -40, 40, 1) + mushroomSlice(10, 104, -10, 1) +
        dill(-96, -70, 40) + dill(-100, 40, -20) + scatter(61, 10, 120, herb('#5d8a42'));
    },
    veggiegeschn: function () { return vegStrips(['#b8914a', '#e2c07a', '#f4dfaa'], 67); },
    kohlrabigeschn: function () { return vegStrips(['#9fb06a', '#d7e2a6', '#eef3d0'], 69); },
    /* Rettich-Satay: weisse Rettichstreifen am Stäbchen, aufgefächert auf dem Bananenblatt */
    rettichsatay: function () {
      var r = A.rnd(73), fan = '', veins = '', peanut = '';
      for (var v = -120; v <= 120; v += 30) veins += ln(v, 0, v + 26, -46, '#5aa64c', 2.2) + ln(v, 0, v + 26, 46, '#5aa64c', 2.2);
      var leafG = g(-14, 6, 1, pth('M-170 0C-90 -78 90 -78 170 0C90 78 -90 78 -170 0Z', '#3f8a3a') + veins + ln(-168, 0, 168, 0, '#8cc46a', 3.5), -36);
      [-12, -24, -36, -48, -60].forEach(function (a) {
        var strip = 'M0 -7', k, w = 17, chars = '';
        for (k = 0; k < 6; k++) strip += 'q' + n(w / 2) + ' ' + (k % 2 ? 5 : -7) + ' ' + w + ' 0';
        strip += 'l2 7l-2 7';
        for (k = 0; k < 6; k++) strip += 'q' + n(-w / 2) + ' ' + (k % 2 ? -5 : 7) + ' ' + (-w) + ' 0';
        strip += 'l-2 -7Z';
        for (k = 1; k < 6; k++) chars += ln(k * w - 2, -7, k * w + 2, 7, '#7a5a2a', 3.2, 'opacity=".5"');
        fan += g(-150, 112, 1, ln(0, 0, 268, 0, '#c99d5c', 4.5) + ln(0, 0, 268, 0, '#e2c088', 2.8) +
          g(140, 0, 1, pth(strip, '#d9d2bc', 'transform="translate(0 4)"') + pth(strip, '#f7f3e6') + ln(6, -3, w * 6 - 8, -4, '#ffffff', 2.4) + chars), a);
      });
      for (var i = 0; i < 12; i++) peanut += dot(r() * 34 - 17, r() * 34 - 17, 1.6 + r() * 1.6, i % 3 ? '#7a4520' : '#d39a56');
      return plate({}) + leafG + fan + dish(100, -100, 34, '#a8692e', peanut + dot(-6, 6, 3, '#c23b22', 'opacity=".8"')) + scatter(75, 6, 110, herb('#4c9a3a'));
    },
    /* Kokos-Zitronen-Salbei-Chicken: Pouletbrust in Kokossauce, grüner Spargel, Salbei, Zitrone, Rosenblätter */
    salbeichicken: function () {
      var spear = function (x, y, deg) {
        var tip = '';
        for (var i = 0; i < 4; i++) tip += pth('M' + (52 + i * 5) + ' -4l6 4l-6 4z', i % 2 ? '#4f8a3a' : '#5f9a44');
        return g(x, y, 1, box(-62, -5, 118, 10, 5, '#7cad55') + box(-62, -5, 118, 4, 2, '#a7cf7c') + ln(-30, 0, -24, -4, '#5f8f3e', 2) + ln(0, 0, 6, 4, '#5f8f3e', 2) + ln(26, 0, 32, -4, '#5f8f3e', 2) +
          pth('M54 -7C70 -6 74 6 54 7Z', '#5f9a44') + tip, deg);
      };
      var sage = function (x, y, deg) { return g(x, y, 1, pth('M-18 0Q0 -10 18 0Q0 10 -18 0Z', '#8faa86') + ln(-14, 0, 14, 0, '#c9d8c0', 1.4), deg); };
      var petals = scatter(81, 9, 112, function (x, y, r) { return ell(x, y, 6, 3.6, r() < 0.5 ? '#e7849a' : '#d9617e', rot(x, y, r() * 180)); });
      return plate({ sauce: '#f6eedb' }) + spear(-6, 62, -16) + spear(10, 82, -12) + spear(-20, 44, -20) +
        g(-6, -34, 1.25, P.breast(false, false)) + sage(-70, -78, 30) + sage(64, -64, -40) + sage(80, 20, 70) +
        g(90, -16, 1.1, P.lemon()) + g(70, 46, 0.9, P.lemon()) + petals;
    },
    /* Garnelen «Fishermen's Feast»: auf grünem Kokos-Thai-Basilikum-Püree, mit gerösteten Cashews */
    garnelen: function () {
      var shrimp = function (x, y, deg) {
        var arc = 'M-22 0A22 22 0 1 1 0 22', segs = '';
        [30, 80, 130, 180, 230].forEach(function (a) { var t = a * Math.PI / 180; segs += ln(Math.cos(t) * 15, -Math.sin(t) * 15 + 0, Math.cos(t) * 29, -Math.sin(t) * 29, '#ffd2b8', 2, 'opacity=".8"'); });
        return g(x, y, 1, pth(arc, 'none', 'stroke="#c8532e" stroke-width="20" stroke-linecap="round" transform="translate(0 3)"') + pth(arc, 'none', 'stroke="#ec7a4c" stroke-width="18" stroke-linecap="round"') +
          pth(arc, 'none', 'stroke="#f7a47c" stroke-width="7" stroke-linecap="round"') + segs + pth('M-22 -2l-16 -12l4 14l-4 14z', '#d85a34'), deg);
      };
      var cashew = function (x, y, deg) { return g(x, y, 1, pth('M-11 -4C-11 -13 6 -15 11 -6C13 0 7 2 5 6C3 11 -11 9 -11 -4Z', '#d9ac6a', 'stroke="#b07a3a" stroke-width="1.5"') + ell(-3, -6, 5, 2, '#f0d29a', 'opacity=".8"'), deg); };
      var puree = pth('M-96 -10C-100 -70 -20 -98 40 -84C100 -70 110 -10 96 30C80 84 10 100 -40 86C-86 72 -94 40 -96 -10Z', '#cfe3a6') +
        pth('M-60 -20C-30 -50 30 -50 50 -16C64 10 30 40 0 20', 'none', 'stroke="#e9f2cf" stroke-width="10" stroke-linecap="round"');
      return plate({}) + puree + shrimp(-34, -30, 10) + shrimp(30, -36, 60) + shrimp(-18, 30, -40) + shrimp(40, 28, 120) +
        cashew(-92, 60, 20) + cashew(96, -30, -30) + cashew(84, 70, 60) + cashew(-90, -66, -10) + cashew(6, 96, 40) +
        leaf(-70, 20, 40, 1, '#3f8a3a', '#a2cf7c') + leaf(70, -84, -20, 1, '#3f8a3a', '#a2cf7c') + leaf(4, -2, 80, 0.8, '#4c9a3a', '#a2cf7c') + scatter(83, 5, 110, function (x, y) { return dot(x, y, 4.5, 'none', 'stroke="#d63a2a" stroke-width="2.6"'); });
    },
    flan: function () {
      var flute = '';
      for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; flute += dot(Math.cos(a) * 168, Math.sin(a) * 168, 13, '#fffdf8', 'stroke="#e7dccd" stroke-width="2"'); }
      var spots = scatter(73, 14, 120, function (x, y, q) { return ell(x, y, 10 + q() * 10, 6 + q() * 5, '#d39a3e', 'opacity=".55"'); });
      return dot(10, 16, 186, '#261f1f', 'opacity=".16"') + flute + dot(0, 0, 168, '#fffdf8') + dot(0, 0, 148, '#e9b85a') + dot(0, 0, 140, '#f0c86e') + spots +
        mushroomSlice(-50, -40, -20, 1.5, '#7a4a22') + mushroomSlice(40, -60, 30, 1.4, '#7a4a22') + mushroomSlice(-20, 50, 10, 1.5, '#7a4a22') + mushroomSlice(64, 40, -40, 1.3, '#7a4a22') +
        scatter(77, 18, 120, herb('#3f8a3a'));
    },
    strudel: function () {
      var log = pth('M-150 -40C-150 -70 140 -70 150 -40L150 40C140 70 -150 70 -150 40Z', '#b97f34', 'transform="translate(0 6)"') + pth('M-150 -40C-150 -70 140 -70 150 -40L150 40C140 70 -150 70 -150 40Z', '#dca457') +
        [-110, -70, -30, 10, 50, 90].map(function (v) { return pth('M' + v + ' -46L' + (v + 22) + ' 46', 'none', 'stroke="#b97f34" stroke-width="5" stroke-linecap="round"'); }).join('') +
        ell(-40, -30, 90, 8, '#f3cf8a', 'opacity=".7"');
      var slice = g(0, 0, 1, dot(4, 6, 50, '#b97f34') + dot(0, 0, 50, '#dca457') + dot(0, 0, 40, '#f4e8cc') +
        pth('M0 0C10 -6 18 6 10 16C0 26 -20 18 -22 2C-24 -18 2 -30 20 -24', 'none', 'stroke="#c99a5a" stroke-width="6" stroke-linecap="round"') + dot(-14, 10, 4, '#7a4a22') + dot(14, -10, 4, '#7a4a22') + dot(0, 22, 3.5, '#7a4a22'));
      return plate({}) + g(-10, -40, 0.82, log, -12) + g(40, 92, 1, slice) + scatter(79, 14, 130, herb('#3f8a3a'));
    },
    pfifferling: function () {
      /* Tagliatelle als gedrehtes Nest */
      var q = A.rnd(83), nest = '';
      for (var i = 0; i < 24; i++) {
        var rr = 18 + (i % 6) * 17 + q() * 6, a0 = q() * Math.PI * 2, sweep = 1.6 + q() * 2;
        var x1 = Math.cos(a0) * rr, y1 = Math.sin(a0) * rr, x2 = Math.cos(a0 + sweep) * rr, y2 = Math.sin(a0 + sweep) * rr;
        var d = 'M' + n(x1) + ' ' + n(y1) + 'A' + n(rr) + ' ' + n(rr) + ' 0 ' + (sweep > Math.PI ? 1 : 0) + ' 1 ' + n(x2) + ' ' + n(y2);
        nest += pth(d, 'none', 'stroke="#d9b05a" stroke-width="12" stroke-linecap="round"') + pth(d, 'none', 'stroke="' + (i % 3 ? '#f4d98e' : '#efcd78') + '" stroke-width="8" stroke-linecap="round"');
      }
      return plate({ sauce: '#f1e2c4' }) + g(-4, 0, 1, nest) +
        [[-46, -44, 10], [40, -56, -30], [62, 30, 40], [-50, 46, -20], [6, 6, 70], [-6, 82, 10]].map(function (c) { return chanterelle(c[0], c[1], c[2], 1.5); }).join('') +
        dill(-86, 70, 20) + dill(86, -84, -30) + dill(96, 76, 60);
    },
    poutine: function () {
      var q = A.rnd(89), fries = '';
      for (var i = 0; i < 30; i++) { var x = q() * 220 - 110, y = q() * 220 - 110; if (x * x + y * y > 120 * 120) continue; fries += g(x, y, 1, box(-30, -7, 60, 14, 4, '#e9b44a') + box(-30, -7, 60, 9, 4, '#f6d06a') + box(18, -7, 12, 14, 3, '#d99a3a', 'opacity=".6"'), q() * 180); }
      var gravy = scatter(91, 9, 80, function (x, y, r) { return ell(x, y, 22 + r() * 12, 14 + r() * 8, '#7a4a26', rot(x, y, r() * 180)) + ell(x - 6, y - 4, 8, 3, '#b07a4a', 'opacity=".7"'); });
      var curds = scatter(93, 14, 100, function (x, y, r) { return pth('M' + n(x - 8) + ' ' + n(y - 4) + 'q6 -7 14 -2q6 6 0 12q-8 5 -14 -1z', '#fbf6e6', 'stroke="#e8dcc0" stroke-width="1.5"'); });
      return bowl('#f2e4c4', fries + gravy + curds + mushroomSlice(-40, -30, 20, 1.1) + mushroomSlice(40, 20, -30, 1.1) + mushroomSlice(-10, 60, 10, 1) + scatter(95, 10, 110, herb('#3f8a3a')));
    },
    kurnik: function () {
      var braid = '';
      for (var i = 0; i < 30; i++) { var a = i / 30 * Math.PI * 2; braid += ell(Math.cos(a) * 140, Math.sin(a) * 140, 14, 9, i % 2 ? '#c9893a' : '#dca457', rot(Math.cos(a) * 140, Math.sin(a) * 140, a * 180 / Math.PI + 60)); }
      var leaves = [0, 72, 144, 216, 288].map(function (d) { return g(0, 0, 1, pth('M0 -24C14 -50 14 -80 0 -100C-14 -80 -14 -50 0 -24Z', '#e9b25e', 'stroke="#b97f34" stroke-width="3"') + ln(0, -30, 0, -94, '#b97f34', 2), d); }).join('');
      return plate({}) + dot(6, 10, 146, '#261f1f', 'opacity=".15"') + dot(0, 0, 140, '#d79a48') + dot(-10, -12, 120, '#e3aa58') + ell(-40, -50, 50, 22, '#f3cf8a', 'opacity=".7" ' + rot(-40, -50, -30)) +
        leaves + braid + dot(0, 0, 12, '#9a6a2a') + dot(0, 0, 6, '#5a3a1a');
    }
  };

  /* Karte: Teller etwas kleiner nach links oben, rechts davor das Gewürzglas */
  function cardArt(id, s) {
    var sp = SPICE[s];
    return svg('-235 -235 470 470', g(-42, -22, 0.82, DRAW[id]({})) + '<ellipse cx="166" cy="200" rx="50" ry="11" fill="#261f1f" opacity=".16"/>' +
      '<g class="jar-hover">' + g(166, 78, 0.8, '<g transform="translate(-60 -150)">' + A.jar({ name: sp.name, spice: sp.color }) + '</g>') + '</g>');
  }
  window.Gerichte = {
    SPICE: SPICE,
    draw: function (id, o) { return DRAW[id](o || {}); },
    cardArt: cardArt,
    tools: { n: n, g: g, pth: pth, ln: ln, dot: dot, ell: ell, box: box, rot: rot, svg: svg, plate: plate, scatter: scatter, herb: herb, dish: dish, chunk: chunk, leaf: leaf }
  };
})();
