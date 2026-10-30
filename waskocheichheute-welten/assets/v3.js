/* ==========================================================================
   Startseite V3 · läuft nach start.js. Alle Bilder bleiben Illustrationen.
   1. Hero: Über dem Teller wechselt nur das Essen von der Zeichnung zum Bild
      (Teller bleibt). Über einem Gewürzglas wechselt das Glas zum Produktfoto.
   2. «Ein Gericht aus aller Welt»: neu gezeichnet als Kokos-Curry mit Reis.
   Bilder: KI-Bild aus Silvias Entwurf (rohes Poulet, Zucchetti),
   Produktfotos aus dem Shop. Beide nur als Platzhalter für bessere Fotos.
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, IMG = 'assets/img/v3/';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var NS = 'http://www.w3.org/2000/svg';
  function n(v) { return Math.round(v * 10) / 10; }
  function svgEl(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  /* ------------------------------------------------------------------
     1 · Hero: Zeichnung ↔ Bild
     ------------------------------------------------------------------ */
  var heroSvg = $('[data-art="hero"] > svg');
  if (heroSvg) {
    var food = $('.food', heroSvg);
    if (food) {
      /* Bild an der Stelle des gezeichneten Essens, im Teller zentriert (Mulde: Radius 152) */
      var real = svgEl('g', { class: 'v3-real v3-real--food', 'aria-hidden': 'true' });
      real.appendChild(svgEl('ellipse', { cx: 8, cy: 14, rx: 104, ry: 84, fill: '#261f1f', opacity: '.06' }));
      real.appendChild(svgEl('image', { href: IMG + 'hero-roh.webp', x: -136, y: -126, width: 272, height: 238, preserveAspectRatio: 'xMidYMid meet' }));
      food.parentNode.insertBefore(real, food.nextSibling);
      var hit = svgEl('circle', { class: 'v3-hit', cx: 0, cy: 0, r: 200, fill: 'transparent', tabindex: '0', role: 'button', 'aria-label': 'Zutaten als Bild zeigen' });
      real.parentNode.insertBefore(hit, real.nextSibling);
      bindSwap(hit, food.parentNode);
    }
    /* Gläser: Helvetica, Mekong, Argentinien (Reihenfolge wie in start.js) */
    ['helvetica', 'mekong', 'argentinien'].forEach(function (k, i) {
      var jar = $$('.jar', heroSvg)[i];
      if (!jar) return;
      var box = jar.parentNode;          /* <g transform="translate(-60 -150)"> */
      var holder = box.parentNode;       /* <g transform="translate rotate scale"> */
      holder.classList.add('v3-jar');
      jar.classList.add('v3-draw');
      var photo = svgEl('image', { class: 'v3-real', href: IMG + 'echt/' + k + '.webp', x: 4, y: 2, width: 112, height: 294, preserveAspectRatio: 'xMidYMax meet', 'aria-hidden': 'true' });
      box.appendChild(photo);
      holder.setAttribute('tabindex', '0');
      holder.setAttribute('role', 'button');
      holder.setAttribute('aria-label', 'Redline ' + k.charAt(0).toUpperCase() + k.slice(1) + ' als Foto zeigen');
      bindSwap(holder, holder);
    });
    /* Hinweis unter dem Teller: was passiert und dass es ein Platzhalterbild ist */
    var art = $('[data-art="hero"]');
    var note = document.createElement('p');
    note.className = 'v3-note';
    note.innerHTML = canHover ? '<span>Maus auf Teller oder Glas: so sieht es echt aus</span>' : '<span>Teller oder Glas antippen: so sieht es echt aus</span>';
    art.appendChild(note);
  }
  function bindSwap(trigger, scope) {
    var on = function () { scope.classList.add('is-real'); heroSvg.classList.add('has-real'); };
    var off = function () { scope.classList.remove('is-real'); if (!$('.is-real', heroSvg)) heroSvg.classList.remove('has-real'); };
    if (canHover) {
      trigger.addEventListener('pointerenter', on);
      trigger.addEventListener('pointerleave', off);
    }
    trigger.addEventListener('click', function () { if (scope.classList.contains('is-real')) off(); else on(); });
    trigger.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.dispatchEvent(new Event('click')); } });
    trigger.addEventListener('blur', off);
  }

  /* ------------------------------------------------------------------
     2 · «Ein Gericht aus aller Welt»: Kokos-Curry mit Pouletstücken, Jasminreis,
     Koriander, Chili und Limette. Teller-Koordinaten: Mitte 0/0, Teller-Radius 200.
     ------------------------------------------------------------------ */
  function P(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function E(x, y, rx, ry, fill, extra) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function C(x, y, r, fill, extra) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function rot(x, y, d) { return 'transform="rotate(' + n(d) + ' ' + n(x) + ' ' + n(y) + ')"'; }
  /* glatte, geschlossene Form durch Punkte (Catmull-Rom) */
  function blob(pts) {
    var d = 'M' + n(pts[0][0]) + ' ' + n(pts[0][1]), k = pts.length;
    for (var i = 0; i < k; i++) {
      var p0 = pts[(i - 1 + k) % k], p1 = pts[i], p2 = pts[(i + 1) % k], p3 = pts[(i + 2) % k];
      d += 'C' + n(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + n(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + n(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + n(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + n(p2[0]) + ' ' + n(p2[1]);
    }
    return d + 'Z';
  }
  function ring(cx, cy, r, k, wob, seed) {
    var q = A.rnd(seed), pts = [];
    for (var i = 0; i < k; i++) { var a = i / k * Math.PI * 2, rr = r * (1 - wob / 2 + q() * wob); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    return pts;
  }
  function coriander(x, y, s, deg) {
    /* dreiteiliges Korianderblatt mit gezacktem Rand und Stiel */
    var lobe = 'M0 0C-7 -4 -12 -12 -9 -19C-6 -24 0 -21 0 -16C1 -22 8 -24 10 -18C12 -12 7 -4 0 0Z';
    return '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(deg) + ') scale(' + s + ')">' +
      '<path d="M0 0L0 16" stroke="#5f8f3a" stroke-width="2.2" stroke-linecap="round"/>' +
      P(lobe, '#4e9a3a') + P(lobe, '#5aa845', 'transform="rotate(-62)"') + P(lobe, '#3f8a32', 'transform="rotate(62)"') +
      '<path d="M0 0L0 -14M0 0L-11 -7M0 0L11 -7" stroke="#8cc46a" stroke-width="1.2" stroke-linecap="round" opacity=".8"/></g>';
  }
  function chili(x, y, s) {
    return '<g transform="translate(' + n(x) + ' ' + n(y) + ') scale(' + s + ')">' + C(0, 0, 8, '#c92a20') + C(0, 0, 5.4, '#f2d6b0') + C(0, 0, 5.4, 'none', 'stroke="#e0473a" stroke-width="1.6"') +
      C(-1.6, -1.2, 1.2, '#f7e7c4') + C(1.8, 1, 1.1, '#f7e7c4') + C(0.4, 2.4, 1, '#f7e7c4') + '</g>';
  }
  function chickenPiece(x, y, w, h, deg, seed) {
    /* Pouletwürfel, angebraten: kantig mit weichen Ecken, drei Helligkeiten wie Flächen eines Würfels, unten Sauce */
    var q = A.rnd(seed), k = 5, pts = [];
    for (var i = 0; i < k; i++) { var a = i / k * Math.PI * 2 + q() * 0.5, rr = 0.9 + q() * 0.16; pts.push([Math.cos(a) * w / 2 * rr, Math.sin(a) * h / 2 * rr]); }
    function sc(f, dx, dy) { return pts.map(function (p) { return [p[0] * f + dx, p[1] * f + dy]; }); }
    return '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(deg) + ')">' +
      P(blob(pts), '#261f1f', 'opacity=".2" transform="translate(4 7)"') +
      P(blob(pts), '#c7883f') +
      P(blob(sc(0.84, -w * 0.05, -h * 0.07)), '#e2ab62') +
      P(blob(sc(0.56, -w * 0.1, -h * 0.13)), '#f4d6a2') +
      E(-w * 0.16, -h * 0.2, w * 0.12, h * 0.06, '#fff4dc', 'opacity=".7"') +
      P('M' + n(-w * 0.56) + ' ' + n(h * 0.24) + 'C' + n(-w * 0.2) + ' ' + n(h * 0.56) + ' ' + n(w * 0.24) + ' ' + n(h * 0.56) + ' ' + n(w * 0.58) + ' ' + n(h * 0.2) + 'L' + n(w * 0.62) + ' ' + n(h * 0.7) + 'L' + n(-w * 0.62) + ' ' + n(h * 0.7) + 'Z', '#e8ab42', 'opacity=".95"') +
      '</g>';
  }
  function curry() {
    var out = A.plate({ part: 'base' });
    var clip = 'v3well';
    out += '<defs><clipPath id="' + clip + '"><circle r="150"/></clipPath>' +
      '<radialGradient id="v3sauce" cx=".62" cy=".58" r=".7"><stop offset="0" stop-color="#f2c45e"/><stop offset=".7" stop-color="#e8ab3d"/><stop offset="1" stop-color="#d48f2c"/></radialGradient>' +
      '<radialGradient id="v3rice" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f7f2e6"/><stop offset="1" stop-color="#e6dcc6"/></radialGradient></defs>';
    var g = '';
    /* Curry-Sauce füllt die Mulde */
    g += C(0, 0, 150, 'url(#v3sauce)');
    /* Kokosmilch-Schlieren */
    g += '<path d="M-10 70C30 92 92 74 118 30" fill="none" stroke="#fbe6b4" stroke-width="7" stroke-linecap="round" opacity=".75"/>' +
      '<path d="M40 -30C70 -24 96 -2 102 26" fill="none" stroke="#fbe6b4" stroke-width="5" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M-6 110C26 122 60 118 84 104" fill="none" stroke="#fde9bd" stroke-width="4" stroke-linecap="round" opacity=".55"/>';
    /* Ölperlen, wenige und dezent */
    [[78, 58, 5], [26, 128, 4], [118, -10, 3.5], [56, -44, 3]].forEach(function (o) { g += C(o[0], o[1], o[2], '#f6c35a', 'opacity=".9"') + C(o[0] - 1.2, o[1] - 1.2, o[2] * 0.4, '#fff3cf', 'opacity=".9"'); });
    /* Jasminreis als Kuppel links oben */
    var rice = blob(ring(-52, -42, 82, 11, 0.16, 5));
    g += P(rice, '#261f1f', 'opacity=".14" transform="translate(6 9)"') + P(rice, 'url(#v3rice)');
    var q = A.rnd(17), grains = '';
    for (var i = 0; i < 130; i++) {
      var a = q() * Math.PI * 2, d = Math.sqrt(q()) * 76, x = -52 + Math.cos(a) * d, y = -42 + Math.sin(a) * d * 0.96;
      var shade = (x + 52) * 0.6 + (y + 42) * 0.8 > 34 ? '#ece3cf' : '#ffffff';
      grains += E(x, y, 6, 2.5, shade, 'stroke="#e2d8c2" stroke-width=".8" ' + rot(x, y, q() * 180));
    }
    g += '<g>' + grains + '</g>';
    /* Pouletstücke in der Sauce */
    [[58, 2, 62, 50, -18, 11], [104, 52, 58, 46, 24, 12], [40, 74, 62, 48, 8, 13], [-6, 112, 56, 44, -30, 14], [96, -46, 52, 42, 40, 15], [-50, 80, 54, 42, 14, 16]].forEach(function (c) {
      g += chickenPiece(c[0], c[1], c[2], c[3], c[4], c[5]);
    });
    /* Koriander und Chili: wenige, gut erkennbare Stücke */
    g += coriander(66, 30, 1.25, 20) + coriander(-8, 54, 1.1, -40) + coriander(110, 76, 1, 70) + coriander(-70, -2, 0.95, 160);
    g += chili(24, 34, 1) + chili(70, 92, 0.9) + chili(118, 8, 0.85);
    out += '<g clip-path="url(#' + clip + ')">' + g + '</g>';
    /* Limettenspalte am Tellerrand */
    out += '<g transform="translate(104 -118) rotate(38)">' +
      P('M-34 0A34 34 0 0 0 34 0Z', '#261f1f', 'opacity=".16" transform="translate(3 6)"') +
      P('M-34 0A34 34 0 0 0 34 0Z', '#5e9a2e') + P('M-30 0A30 30 0 0 0 30 0Z', '#e7f0b8') + P('M-26 0A26 26 0 0 0 26 0Z', '#c6dc6a') +
      '<path d="M0 2L0 24M0 2L-18 17M0 2L18 17" stroke="#eef5cc" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M-34 0L34 0" stroke="#4d8526" stroke-width="2.4" stroke-linecap="round"/></g>';
    return out;
  }
  window.V3Curry = curry;

  /* Grillstreifen quer über eine Form (im Koordinatensystem der Form) */
  function stripes(w, h, gap, col, width, deg) {
    var s = '';
    for (var x = -w; x <= w; x += gap) s += '<line x1="' + n(x) + '" y1="' + n(-h) + '" x2="' + n(x) + '" y2="' + n(h) + '" stroke="' + col + '" stroke-width="' + width + '" stroke-linecap="round"/>';
    return '<g transform="rotate(' + deg + ')">' + s + '</g>';
  }
  function thyme(x, y, s, deg) {
    var leaves = '';
    for (var i = 0; i < 6; i++) { var yy = -i * 7; leaves += E(-4, yy, 3.6, 1.8, '#5f8f3a', rot(-4, yy, -30)) + E(4, yy - 3, 3.6, 1.8, '#6fa046', rot(4, yy - 3, 30)); }
    return '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(deg) + ') scale(' + s + ')"><path d="M0 6L0 -40" stroke="#7b6a3a" stroke-width="1.6" stroke-linecap="round"/>' + leaves + '</g>';
  }

  /* Pouletbrust vom Grill in Tranchen, Zucchetti mit Grillstreifen, Ofenkartoffeln (Ansicht von oben) */
  function grillPlatte() {
    var out = '<defs><clipPath id="v3slice"><rect x="-200" y="-200" width="400" height="400"/></clipPath>' +
      '<radialGradient id="v3ember" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#f68e10" stop-opacity=".55"/><stop offset="1" stop-color="#f68e10" stop-opacity="0"/></radialGradient></defs>';
    out += E(10, 20, 200, 110, 'url(#v3ember)');
    /* Kartoffeln hinten rechts */
    var potatoes = [[120, -52, 46, 30, -30], [158, -6, 44, 30, 20], [96, -8, 42, 28, 70], [150, 44, 40, 28, -10], [196, 18, 36, 26, 40]];
    potatoes.forEach(function (pp, i) {
      var q = A.rnd(40 + i), pts = [[-pp[2] / 2, 0], [-pp[2] * 0.2, -pp[3] / 2 - q() * 4], [pp[2] / 2, -pp[3] * 0.2], [pp[2] * 0.3, pp[3] / 2], [-pp[2] * 0.3, pp[3] / 2 + q() * 3]];
      out += '<g transform="translate(' + pp[0] + ' ' + pp[1] + ') rotate(' + pp[4] + ')">' + P(blob(pts), '#261f1f', 'opacity=".25" transform="translate(4 7)"') + P(blob(pts), '#c98b3a') +
        P(blob(pts.map(function (p) { return [p[0] * 0.82 - 3, p[1] * 0.78 - 3]; })), '#eab960') + P(blob(pts.map(function (p) { return [p[0] * 0.45 - 6, p[1] * 0.4 - 5]; })), '#f8dc94') + '</g>';
    });
    /* Zucchetti-Scheiben dahinter */
    [[-40, -78, 34], [12, -92, 33], [62, -84, 32], [-86, -50, 31], [104, -110, 30]].forEach(function (z, i) {
      out += '<g transform="translate(' + z[0] + ' ' + z[1] + ') rotate(' + (i * 23 - 20) + ')">' + E(0, 0, z[2] + 2, z[2] * 0.92 + 2, '#261f1f', 'opacity=".25" transform="translate(3 6)"') +
        E(0, 0, z[2], z[2] * 0.92, '#3f6e24') + E(0, 0, z[2] - 5, z[2] * 0.92 - 5, '#b8c86a') + E(0, 0, z[2] - 8, z[2] * 0.92 - 8, '#dbe2a2') +
        E(0, 0, z[2] * 0.42, z[2] * 0.38, 'none', 'stroke="#c6cf86" stroke-width="2" stroke-dasharray="2 4"') +
        '<g clip-path="none">' + [-14, 0, 14].map(function (x) { return '<line x1="' + x + '" y1="' + n(-z[2] * 0.82) + '" x2="' + x + '" y2="' + n(z[2] * 0.82) + '" stroke="#4a3418" stroke-width="5" stroke-linecap="round" opacity=".85" transform="rotate(-35)"/>'; }).join('') + '</g></g>';
    });
    /* Pouletbrust in Tranchen: geschuppt, links jeweils die helle Schnittfläche, oben goldbraun mit Grillstreifen */
    var slices = '';
    for (var i = 0; i < 7; i++) {
      var k = Math.sin((i + 0.5) / 7 * Math.PI), x = -138 + i * 30, y = 22 - k * 10, h = 54 + k * 30, w = 34;
      var top = 'M' + n(-w / 2) + ' ' + n(-h / 2 + 8) + 'Q' + n(0) + ' ' + n(-h / 2 - 8) + ' ' + n(w / 2) + ' ' + n(-h / 2 + 4) + 'L' + n(w / 2 + 3) + ' ' + n(h / 2 - 8) + 'Q' + n(0) + ' ' + n(h / 2 + 8) + ' ' + n(-w / 2) + ' ' + n(h / 2 - 2) + 'Z';
      var cut = 'M' + n(-w / 2) + ' ' + n(-h / 2 + 8) + 'Q' + n(-w / 2 - 14) + ' ' + n(-h / 2 + 2) + ' ' + n(-w / 2 - 15) + ' ' + n(-h / 2 + 14) + 'L' + n(-w / 2 - 14) + ' ' + n(h / 2 - 6) + 'Q' + n(-w / 2 - 12) + ' ' + n(h / 2 + 4) + ' ' + n(-w / 2) + ' ' + n(h / 2 - 2) + 'Z';
      slices += '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(-12)">' +
        P(top, '#261f1f', 'opacity=".3" transform="translate(6 9)"') +
        P(cut, '#f7ead6') + P(cut, 'none', 'stroke="#e7cfa9" stroke-width="2"') +
        '<path d="M' + n(-w / 2 - 8) + ' ' + n(-h / 2 + 16) + 'L' + n(-w / 2 - 8) + ' ' + n(h / 2 - 10) + '" stroke="#fffaf0" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>' +
        P(top, '#c98a44') + P(top, '#e3ad66', 'transform="translate(2 -1) scale(.86 .9)"') +
        [-0.28, 0, 0.28].map(function (f) { var yy = h * f; return '<line x1="' + n(-w / 2 + 2) + '" y1="' + n(yy + 7) + '" x2="' + n(w / 2 + 1) + '" y2="' + n(yy - 7) + '" stroke="#4a2a12" stroke-width="5.5" stroke-linecap="round" opacity=".85"/>'; }).join('') +
        C(-2, -h * 0.14, 1.3, '#3a2a1a', 'opacity=".55"') + C(7, h * 0.12, 1.1, '#3a2a1a', 'opacity=".55"') + '</g>';
    }
    out += slices;
    out += thyme(-60, -10, 1, 20) + thyme(40, 70, 0.9, -60) + thyme(140, 74, 0.85, 40) + thyme(-130, -60, 0.8, -20);
    return out;
  }

  /* Selleriesteak vom Grill auf Karottenpüree, mit Ofenkarotten und Salbei */
  function selleriesteak() {
    var out = A.plate({ part: 'base' });
    /* Püree als Spiegel */
    out += P(blob(ring(-6, 14, 112, 12, 0.18, 21)), '#f0a35a') + P(blob(ring(-10, 8, 92, 10, 0.2, 22)), '#f6b872', 'opacity=".9"') +
      '<path d="M-80 30C-40 60 30 66 86 30" fill="none" stroke="#fbd39b" stroke-width="6" stroke-linecap="round" opacity=".7"/>';
    /* Ofenkarotten mit Grün */
    [[96, 74, 40, 1], [70, 104, 20, 0.9]].forEach(function (c) {
      out += '<g transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ') scale(' + c[3] + ')">' + P('M-50 -9C-20 -12 26 -8 46 -2C52 0 52 4 46 6C26 10 -20 14 -50 10C-56 6 -56 -6 -50 -9Z', '#261f1f', 'opacity=".18" transform="translate(3 6)"') +
        P('M-50 -9C-20 -12 26 -8 46 -2C52 0 52 4 46 6C26 10 -20 14 -50 10C-56 6 -56 -6 -50 -9Z', '#e2721f') + P('M-48 -5C-20 -8 20 -5 40 0', 'none', 'stroke="#f7a04a" stroke-width="4" stroke-linecap="round"') +
        P('M-30 -9L-28 -3M-6 -10L-4 -4M18 -8L19 -3', 'none', 'stroke="#b8540f" stroke-width="2" stroke-linecap="round"') +
        P('M-52 0C-66 -10 -74 -16 -82 -14M-52 2C-66 4 -76 10 -84 8M-52 1C-64 -2 -74 -2 -80 -4', 'none', 'stroke="#4f8a2e" stroke-width="3" stroke-linecap="round"') + '</g>';
    });
    /* das Steak: dicke Selleriescheibe, Rand sichtbar, Oberfläche angeröstet mit Rautenmuster */
    var slab = blob(ring(-14, -6, 92, 14, 0.07, 31));
    out += P(slab, '#261f1f', 'opacity=".22" transform="translate(8 14)"');
    out += P(slab, '#cdb98a', 'transform="translate(0 12)"');
    out += P(slab, '#e4d3a8', 'transform="translate(0 6)"');
    out += '<defs><clipPath id="v3slab"><path d="' + slab + '"/></clipPath><radialGradient id="v3sear" cx=".45" cy=".42" r=".65"><stop offset="0" stop-color="#e7c27e"/><stop offset=".65" stop-color="#cf9a52"/><stop offset="1" stop-color="#a8692e"/></radialGradient></defs>';
    out += P(slab, 'url(#v3sear)');
    out += '<g clip-path="url(#v3slab)"><g transform="translate(-14 -6)">' + stripes(130, 130, 40, '#4a2a12', 9, 38) + '<g opacity=".45">' + stripes(130, 130, 40, '#5a3418', 6, -52) + '</g></g></g>';
    out += P(slab, 'none', 'stroke="#8f5a26" stroke-width="3" opacity=".6"');
    out += E(-44, -42, 26, 9, '#fff3d6', 'opacity=".35" ' + rot(-44, -42, -30));
    /* Salbei und grobes Salz, wenig */
    out += '<g transform="translate(-60 -64) rotate(-30)">' + P('M0 0C14 -14 40 -16 56 -4C40 8 14 10 0 0Z', '#6f8f5e') + P('M2 0L52 -4', 'none', 'stroke="#a9c09a" stroke-width="2" stroke-linecap="round"') + '</g>' +
      '<g transform="translate(-30 -76) rotate(10)">' + P('M0 0C14 -12 36 -12 50 -2C36 8 14 8 0 0Z', '#809f6c') + P('M2 0L46 -2', 'none', 'stroke="#b8cda8" stroke-width="2" stroke-linecap="round"') + '</g>';
    [[10, -20], [-30, 20], [30, 26], [-50, -4]].forEach(function (s) { out += '<rect x="' + s[0] + '" y="' + s[1] + '" width="5" height="5" rx="1" fill="#fffaf0" opacity=".85" transform="rotate(20 ' + s[0] + ' ' + s[1] + ')"/>'; });
    return out;
  }
  var veg = $('[data-art="veggie"]');
  if (veg) veg.innerHTML = '<svg viewBox="-240 -240 480 480" aria-hidden="true">' + selleriesteak() + '</svg>';
  var gr = $('[data-art="grill"]');
  if (gr) { gr.classList.add('v3-grill'); gr.innerHTML = '<svg viewBox="-230 -150 460 300" aria-hidden="true">' + grillPlatte() + '</svg>'; }
  $$('[data-art="step-gericht"]').forEach(function (el) { el.innerHTML = '<svg viewBox="-230 -230 460 460" role="img" aria-label="Kokos-Curry mit Poulet, Jasminreis, Koriander und Limette">' + curry() + '</svg>'; });

  /* Bewegung: der Hinweis blendet nach dem ersten Wechsel aus */
  if (heroSvg && !reduced) heroSvg.addEventListener('pointerenter', function () { var nt = $('.v3-note'); if (nt) nt.classList.add('is-seen'); }, { once: true });
})();
