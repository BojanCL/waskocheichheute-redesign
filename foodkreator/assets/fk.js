/* ==========================================================================
   FoodKreator · Kopf, Fuss, Illustrationen und die Bausteine aller Seiten
   Inhalte von foodkreator.ch (Produktentwicklung, Portfolio, Über uns,
   Kontakt). Zeichnungen im Stil von waskocheichheute.ch (art.js).
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, G = window.Gerichte;
  var WKIH = '../waskocheichheute-welten/', SHOP = '../waskocheichheute-shop/';
  var PAGE = document.body.getAttribute('data-page');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]motion=0/.test(location.search);
  if (reduced) document.documentElement.classList.add('no-motion');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function param(k) { return new URLSearchParams(location.search).get(k); }
  function n(v) { return Math.round(v * 10) / 10; }
  function P(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function C(x, y, r, fill, extra) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function E(x, y, rx, ry, fill, extra) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function R(x, y, w, h, fill, rx, extra) { return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '"' + (rx ? ' rx="' + rx + '"' : '') + ' fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function L(x1, y1, x2, y2, col, w, extra) { return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra ? ' ' + extra : '') + '/>'; }
  function at(x, y, s, inner, r) { return '<g transform="translate(' + n(x) + ' ' + n(y) + ')' + (r ? ' rotate(' + r + ')' : '') + ' scale(' + s + ')">' + inner + '</g>'; }

  var SVG = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
  };

  /* ------------------------------------------------------------------
     Verpackungen mit «Ihre Marke»: Glas, Flasche, Beutel
     Koordinaten: Breite ca. 120 (Beutel 140), Höhe 300, Boden bei 294
     ------------------------------------------------------------------ */
  function wrap(name, max) {
    var words = String(name).trim().split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) {
      if (w.length > max) w = w.slice(0, max);
      if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = (cur ? cur + ' ' : '') + w;
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }
  function label(cx, top, w, name, brand, ink) {
    var lines = wrap(name || 'Ihr Produkt', 11), longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var fs = Math.min(19, w / Math.max(longest * 0.6, 4)), lh = fs * 1.06, y = top + 24 + (3 - lines.length) * lh * 0.35;
    return '<text x="' + cx + '" y="' + (top + 14) + '" text-anchor="middle" font-family="Inter, sans-serif" font-size="8.5" font-weight="800" letter-spacing="1.6" fill="#d7261e">' + esc((brand || 'Ihre Marke').toUpperCase()) + '</text>' +
      lines.map(function (l, i) { return '<text x="' + cx + '" y="' + n(y + (i + 0.8) * lh) + '" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-size="' + n(fs) + '" font-weight="800" fill="' + (ink || '#261f1f') + '">' + esc(l) + '</text>'; }).join('');
  }
  var uid = 0;
  function jarFK(o) {
    var id = 'fj' + (++uid), col = o.color || '#b9853f', ridges = '';
    for (var x = 26; x <= 94; x += 8) ridges += L(x, 22, x, 50, '#e2ddd3', 3);
    return '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".16" stop-color="#fff" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".76" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>' +
      '<pattern id="' + id + 'p" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#000" opacity=".24"/><circle cx="6.5" cy="5.5" r="1.1" fill="#fff" opacity=".28"/></pattern></defs>' +
      R(14, 62, 92, 232, col, 18) + R(14, 62, 92, 232, 'url(#' + id + 'p)', 18) +
      R(14, 108, 92, 142, '#fffdf8') + label(60, 112, 82, o.name, o.brand) +
      P('M14 226C40 214 78 240 106 222L106 250L14 250Z', '#f68e10') + P('M14 236C44 226 76 248 106 234L106 250L14 250Z', '#ffd08a', 'opacity=".95"') +
      R(14, 62, 92, 232, 'url(#' + id + ')', 18) + R(14, 62, 92, 232, 'none', 18, 'stroke="#261f1f" stroke-opacity=".14" stroke-width="2"') +
      R(10, 50, 100, 16, '#e4dfd6', 5) + R(16, 6, 88, 50, '#f6f4ef', 12) + ridges + R(16, 6, 88, 12, '#ffffff', 6);
  }
  function bottle(o) {
    var col = o.color || '#b8452a';
    return P('M48 30L72 30L72 70Q72 92 94 110Q106 122 106 142L106 280Q106 294 92 294L28 294Q14 294 14 280L14 142Q14 122 26 110Q48 92 48 70Z', col) +
      P('M48 30L72 30L72 70Q72 92 94 110Q106 122 106 142L106 280Q106 294 92 294L28 294Q14 294 14 280L14 142Q14 122 26 110Q48 92 48 70Z', 'none', 'stroke="#261f1f" stroke-opacity=".18" stroke-width="2"') +
      P('M24 150L24 270', 'none', 'stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".28"') + P('M54 40L54 72', 'none', 'stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".35"') +
      R(42, 6, 36, 30, '#261f1f', 6) + R(42, 6, 36, 8, '#3a302c', 4) +
      R(14, 156, 92, 104, '#fffdf8') + label(60, 160, 82, o.name, o.brand) + R(14, 248, 92, 12, '#f68e10');
  }
  function pouch(o) {
    var col = o.color || '#c9a46a', nuts = '';
    var r = A.rnd(7);
    for (var i = 0; i < 16; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()) * 30; nuts += E(70 + Math.cos(a) * d, 236 + Math.sin(a) * d * 0.8, 9, 6.5, i % 3 ? '#b98a4e' : '#d6a865', 'transform="rotate(' + Math.round(r() * 180) + ' ' + n(70 + Math.cos(a) * d) + ' ' + n(236 + Math.sin(a) * d * 0.8) + ')"'); }
    return P('M8 34L132 34L128 272Q126 294 104 294L36 294Q14 294 12 272Z', col) + P('M8 34L132 34L128 272Q126 294 104 294L36 294Q14 294 12 272Z', 'none', 'stroke="#261f1f" stroke-opacity=".16" stroke-width="2"') +
      R(6, 18, 128, 22, '#a8844c', 4) + C(70, 29, 5, '#fdf1e6') + L(14, 46, 126, 46, '#a8844c', 2, 'stroke-dasharray="4 5"') +
      R(22, 62, 96, 116, '#fffdf8', 10) + label(70, 66, 86, o.name, o.brand) +
      E(70, 236, 42, 36, '#f6ead6') + nuts + E(70, 236, 42, 36, 'none', 'stroke="#fff" stroke-width="3" opacity=".7"') + P('M40 212Q52 202 66 204', 'none', 'stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"');
  }

  /* Kleine Zeichnungen für Zielgruppen, Leistungen und Ablauf (Mitte 0/0, ca. ±50) */
  var ART = {
    idee: function () { return C(0, -10, 30, '#ffd166') + C(0, -10, 30, 'none', 'stroke="#261f1f" stroke-width="5"') + R(-14, 22, 28, 8, '#261f1f', 3) + R(-11, 32, 22, 7, '#261f1f', 3) + P('M-8 -4Q0 6 8 -4', 'none', 'stroke="#261f1f" stroke-width="4" stroke-linecap="round"') + L(0, 2, 0, 18, '#261f1f', 4) + L(-46, -10, -38, -10, '#f68e10', 5) + L(38, -10, 46, -10, '#f68e10', 5) + L(0, -52, 0, -46, '#f68e10', 5) + L(-32, -40, -27, -35, '#f68e10', 5) + L(32, -40, 27, -35, '#f68e10', 5); },
    marke: function () { return P('M-40 -28L10 -28L42 4L10 36L-40 36Z', '#f68e10') + P('M-40 -28L10 -28L42 4L10 36L-40 36Z', 'none', 'stroke="#261f1f" stroke-width="5" stroke-linejoin="round"') + C(-24, 4, 7, '#fdf1e6', 'stroke="#261f1f" stroke-width="4"') + P('M2 -8l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z', '#261f1f'); },
    brot: function () { return P('M-46 18C-50 -20 -24 -36 0 -36C24 -36 50 -20 46 18C46 28 40 32 30 32L-30 32C-40 32 -46 28 -46 18Z', '#d99a48') + P('M-46 18C-50 -20 -24 -36 0 -36C24 -36 50 -20 46 18C46 28 40 32 30 32L-30 32C-40 32 -46 28 -46 18Z', 'none', 'stroke="#261f1f" stroke-width="5"') + P('M-22 -20L-12 8M0 -24L8 6M20 -20L28 4', 'none', 'stroke="#fbe2b0" stroke-width="5" stroke-linecap="round"'); },
    fleisch: function () { return at(0, 0, 0.62, A.parts.steak(true)); },
    gastro: function () { return at(0, 6, 0.95, A.liquidIcon('sauce', '#e8a24a')); },
    handel: function () { return R(-46, -36, 92, 6, '#261f1f', 3) + R(-46, 30, 92, 6, '#261f1f', 3) + R(-46, -36, 6, 72, '#261f1f', 3) + R(40, -36, 6, 72, '#261f1f', 3) + [-26, 0, 26].map(function (x, i) { return R(x - 9, -2 - (i === 1 ? 4 : 0), 18, 32 + (i === 1 ? 4 : 0), ['#b9853f', '#c0502a', '#8f8a52'][i], 4) + R(x - 9, 8, 18, 10, '#fffdf8') + R(x - 8, -8 - (i === 1 ? 4 : 0), 16, 7, '#e4dfd6', 2); }).join('') + R(-30, -26, 60, 6, '#f68e10', 3); },
    produzent: function () { return P('M-46 36L-46 -6L-24 -22L-24 -6L-2 -22L-2 -6L20 -22L20 -40L36 -40L36 36Z', '#d6c6ad') + P('M-46 36L-46 -6L-24 -22L-24 -6L-2 -22L-2 -6L20 -22L20 -40L36 -40L36 36Z', 'none', 'stroke="#261f1f" stroke-width="5" stroke-linejoin="round"') + R(-36, 6, 14, 12, '#261f1f', 2) + R(-14, 6, 14, 12, '#261f1f', 2) + R(8, 14, 14, 22, '#f68e10', 2) + P('M28 -46q-6 -8 2 -14q8 -6 2 -14', 'none', 'stroke="#c9b8a8" stroke-width="4" stroke-linecap="round"'); },
    moerser: function (light) { var ink = light ? '#fff6e8' : '#261f1f'; return P('M-38 -6L38 -6C38 22 22 36 0 36C-22 36 -38 22 -38 -6Z', '#8a6a4a') + P('M-38 -6L38 -6C38 22 22 36 0 36C-22 36 -38 22 -38 -6Z', 'none', 'stroke="' + ink + '" stroke-width="5" stroke-linejoin="round"') + E(0, -6, 38, 8, '#c99a2e') + C(-12, -8, 3, '#b0442a') + C(8, -6, 3, '#8f8a52') + C(18, -9, 2.5, '#fff6e8') + R(4, -52, 12, 52, '#b98a5a', 6, 'transform="rotate(28 10 -26)"') + R(4, -52, 12, 52, 'none', 6, 'transform="rotate(28 10 -26)" stroke="' + ink + '" stroke-width="4"') + R(-20, 34, 40, 8, ink, 4); },
    rezept: function () { return R(-34, -42, 62, 82, '#fffdf8', 8, 'transform="rotate(-6)"') + R(-34, -42, 62, 82, 'none', 8, 'transform="rotate(-6)" stroke="#261f1f" stroke-width="5"') + [-24, -12, 0, 12].map(function (y, i) { return L(-24, y + i * -1.2, i === 3 ? 0 : 14, y - 1.5 - i * 1.2, i ? '#c9b8a8' : '#f68e10', 5); }).join('') + R(18, -14, 10, 56, '#c9b8a8', 5, 'transform="rotate(24 23 14)"') + E(30, 46, 16, 12, 'none', 'stroke="#261f1f" stroke-width="4" transform="rotate(24 30 46)"'); },
    loeffel: function (light) { var ink = light ? '#fff6e8' : '#261f1f'; return E(-12, 0, 24, 16, '#c0502a', 'transform="rotate(-30 -12 0)"') + E(-12, 0, 24, 16, 'none', 'stroke="' + ink + '" stroke-width="5" transform="rotate(-30 -12 0)"') + L(6, -12, 44, -40, ink, 7) + C(26, 30, 18, '#7fb35c') + P('M17 30l6 6 12 -12', 'none', 'stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'); },
    etikett: function (light) { var ink = light ? '#fff6e8' : '#261f1f'; return R(-40, -32, 80, 64, '#fffdf8', 8) + R(-40, -32, 80, 64, 'none', 8, 'stroke="' + ink + '" stroke-width="5"') + R(-40, -32, 80, 14, '#f68e10', 8) + L(-28, -6, 20, -6, '#261f1f', 4) + L(-28, 6, 12, 6, '#c9b8a8', 4) + L(-28, 16, 16, 16, '#c9b8a8', 4) + [0, 4, 6, 10, 12, 16, 19, 22].map(function (x) { return L(14 + x, 10, 14 + x, 24, '#261f1f', 1.6); }).join(''); },
    band: function (light) { var ink = light ? '#fff6e8' : '#261f1f'; return R(-50, 22, 100, 12, ink, 6) + C(-38, 28, 4, '#8a7a6a') + C(38, 28, 4, '#8a7a6a') + C(0, 28, 4, '#8a7a6a') + [-30, -4, 22].map(function (x, i) { return R(x - 9, -10, 18, 32, ['#b9853f', '#c0502a', '#8f8a52'][i], 4) + R(x - 9, 0, 18, 10, '#fffdf8') + R(x - 8, -17, 16, 8, '#e4dfd6', 2); }).join('') + P('M-50 -30L-36 -30L-36 -20', 'none', 'stroke="#f68e10" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'); },
    reden: function () { return P('M-46 -34Q-46 -44 -36 -44L8 -44Q18 -44 18 -34L18 -6Q18 4 8 4L-22 4L-36 16L-34 4Q-46 4 -46 -6Z', '#fff6e8') + [-32, -16, 0].map(function (x) { return C(x, -20, 3.5, '#261f1f'); }).join('') + P('M-6 6Q-6 -4 4 -4L36 -4Q46 -4 46 6L46 28Q46 38 36 38L34 38L36 50L22 38L4 38Q-6 38 -6 28Z', '#f68e10'); },
    tausch: function () { return R(-46, -30, 34, 46, '#fffdf8', 6, 'stroke="#261f1f" stroke-width="4"') + R(12, -16, 34, 46, '#fffdf8', 6, 'stroke="#261f1f" stroke-width="4"') + L(-40, -18, -20, -18, '#c9b8a8', 4) + L(-40, -8, -24, -8, '#c9b8a8', 4) + L(18, -4, 38, -4, '#f68e10', 4) + L(18, 6, 34, 6, '#f68e10', 4) + P('M-8 -36Q12 -46 26 -26', 'none', 'stroke="#261f1f" stroke-width="5" stroke-linecap="round"') + P('M20 -32l7 7 4-10', 'none', 'stroke="#261f1f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"') + P('M8 36Q-12 46 -26 26', 'none', 'stroke="#261f1f" stroke-width="5" stroke-linecap="round"') + P('M-20 32l-7-7-4 10', 'none', 'stroke="#261f1f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'); }
  };
  function art(id, vb, light) { return '<svg viewBox="' + (vb || '-56 -56 112 112') + '" aria-hidden="true">' + ART[id](light) + '</svg>'; }
  function serie() {
    return '<svg viewBox="0 0 300 310" aria-hidden="true">' + [['Limited', '#c0502a', 20, 0], ['Edition', '#8f8a52', 160, 0], ['Classic', '#b9853f', 90, -12]].map(function (j) { return at(j[2] + 6, j[3] + 6, 0.95, jarFK({ name: j[0], brand: 'Ihre Marke', color: j[1] })); }).join('') + '</svg>';
  }

  /* ------------------------------------------------------------------
     Inhalte
     ------------------------------------------------------------------ */
  var LOGOS = [
    ['coop', 'Coop'], ['bianchi', 'Bianchi'], ['transgourmet-prodega', 'Transgourmet Prodega'], ['pistor', 'Pistor'], ['schweizer-salinen', 'Schweizer Salinen'], ['v-zug', 'V-ZUG'],
    ['confiserie-bachmann', 'Confiserie Bachmann'], ['panellino', 'Panellino'], ['metzgerei-kuenzli', 'Metzgerei Künzli'], ['reichmuth-metzgerei', 'Reichmuth Metzgerei'], ['beris-zurzi-metzg', 'Beris Zurzi Metzg'],
    ['wauwiler-champignons', 'Wauwiler Champignons'], ['seefischerei-zwimpfer', 'Seefischerei Zwimpfer'], ['dyhrberg', 'Dyhrberg'], ['dueby', 'Düby'], ['mundo', 'Mundo'], ['remimag', 'Remimag']
  ];
  function logo(id) { var l = LOGOS.filter(function (x) { return x[0] === id; })[0]; return '<img src="assets/img/partner-logo-' + id + '.png" alt="' + esc(l ? l[1] : id) + '" loading="lazy">'; }

  var CASES = {
    coop: { name: 'Coop Fine Food', logo: 'coop', k: 'Handel · Eigenmarke', h: 'Spezialitäten für die Linie Coop Fine Food', aufgabe: 'Coop Fine Food steht für Spezialitäten aus der ganzen Welt, besonders in Herkunft, Herstellung oder Zusammensetzung.', loesung: 'Für die Linie mischen wir unter anderem drei Spezialcurrys (Delhi, Caribbean, Sri Lanka), Salze wie Persian Salt, Rose Salt, Sel au piment, Wasabi & Nori Salt und Fleur de Sel, dazu Za\'atar, Ras el Hanout, Jasmin- und Grüntee-Zucker sowie Cocoa- und Maple-Zucker.' },
    bettybossi: { name: 'Betty Bossi', k: 'Handel · Aktion', h: 'Drei indische Currys für eine Ausgabe der Betty-Bossi-Zeitung', aufgabe: 'Für eine neue Ausgabe der Zeitung suchte Betty Bossi besondere Currys, die vorgestellt und gleich angeboten werden.', loesung: 'Wir haben drei spezielle indische Currys gemischt. Sie wurden in der Zeitung vorgestellt und verkauft.' },
    wagamama: { name: 'Wagamama', k: 'Gastronomie · Rezept anpassen', h: 'Marinaden nachgebaut, damit sie in der Schweiz erlaubt sind', aufgabe: 'Die Nassmarinaden der Restaurantkette wurden in England hergestellt und durften nicht importiert werden: Sie enthielten Inhaltsstoffe, die in der Schweiz nicht zulässig sind.', loesung: 'Wir haben die Marinaden so genau nachgebaut, dass kaum ein Unterschied zum Original merkbar ist. Seither stellen wir sie für Wagamama her.' },
    sv: { name: 'SV Group', k: 'Gemeinschaftsgastronomie', h: 'Authentische Gerichte aus anderen Kulturen für die SV Group', aufgabe: 'Die SV Group, Schweizer Marktführerin in der Gemeinschaftsgastronomie, will ihren Gästen mehr Abwechslung bieten. Gerichte aus anderen Kulturen sollen authentisch schmecken.', loesung: 'Die SV Group bezieht Gerichte aus unserer Redline-Linie, inzwischen 60 Gerichte aus Südafrika, Skandinavien, Südamerika, Südostasien und Indien/Sri Lanka.' },
    bianchi: { name: 'Bianchi', logo: 'bianchi', k: 'Handel · Gewürzlieferant', h: 'Neue Konzepte mit einem Familienunternehmen in vierter Generation', aufgabe: 'Bianchi importiert, verarbeitet und verkauft seit über 125 Jahren frische Lebensmittel.', loesung: 'Als Gewürzlieferant setzen wir mit Bianchi immer wieder neue Konzepte um: Wild- und Bärlauch-Spezialitäten, nord- und südafrikanische Küche, die Welt der Currys und Südamerika.' }
  };
  function caseCard(id, short) {
    var c = CASES[id];
    return '<article class="case" data-reveal><div class="case__who">' + (c.logo ? logo(c.logo) : '<b>' + esc(c.name) + '</b>') + '<span class="pill" style="display:inline-flex;min-height:26px;padding:0 10px;border-radius:999px;background:var(--paper);color:var(--orange-deep);font-size:12px;font-weight:800">' + esc(c.k) + '</span></div>' +
      '<h3>' + esc(c.h) + '</h3>' + (short ? '<p>' + esc(c.loesung) + '</p>' : '<p class="case__k">Aufgabe</p><p>' + esc(c.aufgabe) + '</p><p class="case__k">Lösung</p><p>' + esc(c.loesung) + '</p>') + '</article>';
  }

  var WER = [
    { id: 'privat', t: 'Privatperson mit einer Idee', icon: 'idee', h: 'Sie haben ein Rezept, das andere auch wollen?', text: 'Ihr Grillgewürz, Ihre Marinade oder eine Mischung als Geschenk: Wir machen daraus ein Produkt mit Etikett, das Sie verschenken oder verkaufen können.', was: ['Wir entwickeln die Rezeptur aus Ihrer Idee', 'Kleinmengen und einmalige Aufträge sind möglich', 'Etikett und Deklaration denken wir mit'] },
    { id: 'marke', t: 'Start-up oder eigene Marke', icon: 'marke', h: 'Sie bauen eine eigene Marke auf?', text: 'Wir entwickeln Produkte, die nicht nur gut schmecken, sondern auch verkauft werden können. Mit Verpackung, Deklaration und einer ersten Serie.', was: ['Produktkonzept und Rezeptur', 'Tests und Pilotserien ohne lange Vorlaufzeit', 'Verpackung, Deklaration, Hygiene und Vorschriften'] },
    { id: 'baeckerei', t: 'Bäckerei oder Confiserie', icon: 'brot', h: 'Eine eigene Produktlinie für Ihre Bäckerei?', text: 'Rezepturen für Backwaren und Mischungen für Ihre eigenen Produkte, als feste Linie oder als limitierte Serie.', was: ['Rezepturen für Backwaren', 'Eigene Produktlinien', 'Limitierte Serien'], logos: ['confiserie-bachmann', 'panellino'] },
    { id: 'metzgerei', t: 'Metzgerei', icon: 'fleisch', h: 'Gewürze und Marinaden unter Ihrem Namen?', text: 'Für Metzgereien mit Markenambitionen: eigene Gewürz- und Marinadenmischungen für Fleisch, abgefüllt und angeschrieben mit Ihrer Marke.', was: ['Rezepturen für Fleisch', 'Gewürz- und Marinadenmischungen', 'Eigenmarke für Ihre Theke'], logos: ['metzgerei-kuenzli', 'reichmuth-metzgerei', 'beris-zurzi-metzg'] },
    { id: 'gastro', t: 'Gastronomie oder Grossküche', icon: 'gastro', h: 'Gerichte, die jeden Tag gleich gut schmecken?', text: 'Gewürzmischungen, Marinaden und Saucen für Ihre Küche. Gleichbleibend im Geschmack, auch für Gerichte aus anderen Kulturen.', was: ['Mischungen und Marinaden für Ihre Gerichte', 'Bestehende Rezepte nachbauen und anpassen', 'Redline-Gewürze im Eimer für die Gastro'], cases: ['wagamama', 'sv'] },
    { id: 'handel', t: 'Handel und Eigenmarken', icon: 'handel', h: 'Eine Eigenmarke für Ihr Regal?', text: 'Eigenmarken und Private Label, Produktlinien und limitierte Serien. Von der Idee bis ins Regal, mit Verpackung und Deklaration.', was: ['Eigenmarken und Private Label', 'Produktlinien und limitierte Serien', 'Aktionen und Sondereditionen'], cases: ['coop', 'bettybossi'], logos: ['coop', 'bianchi', 'pistor', 'transgourmet-prodega'] },
    { id: 'produzent', t: 'Produzent oder Manufaktur', icon: 'produzent', h: 'Sie möchten Ihr Sortiment erweitern?', text: 'Sie stellen Lebensmittel her und möchten ein neues Produkt oder ein bestehendes Rezept anpassen. Oder Sie suchen jemanden, der Gewürze für Sie produziert und verpackt.', was: ['Anpassung bestehender Rezepte', 'Lohnarbeit: produzieren und verpacken', 'Kleinmengen und einmalige Aufträge'], logos: ['wauwiler-champignons', 'seefischerei-zwimpfer', 'dyhrberg'] }
  ];
  var TYPEN = [{ id: 'gewuerz', t: 'Gewürzmischung' }, { id: 'sauce', t: 'Sauce oder Marinade' }, { id: 'snack', t: 'Snack oder Nüsse' }, { id: 'anderes', t: 'Etwas anderes' }];
  var WAS = ['Gewürzmischung', 'Marinade oder Sauce', 'Backwaren', 'Snack oder Nüsse', 'Getränk', 'Bestehendes Rezept anpassen', 'Abfüllen und verpacken lassen', 'Weiss ich noch nicht'];
  var MENGE = ['Erst einmal testen', 'Kleinmenge oder einmalig', 'Laufend produzieren', 'Weiss ich noch nicht'];

  /* ------------------------------------------------------------------
     Kopf und Fuss
     ------------------------------------------------------------------ */
  function header() {
    function c(p) { return PAGE === p ? ' aria-current="page"' : ''; }
    var start = PAGE === 'start' ? '' : 'index.html';
    var links = '<a href="' + start + '#leistungen">Leistungen</a><a href="' + start + '#ablauf">So läuft es ab</a><a href="referenzen.html"' + c('referenzen') + '>Referenzen</a><a href="ueber-uns.html"' + c('ueberuns') + '>Über uns</a>';
    return '<header class="top" id="top">' +
      '<div class="hint-bar"><div class="hint-bar__in"><span class="hb-long">Sie suchen Redline-Gewürze für Ihre Küche?</span><span class="hb-short">Redline für zu Hause:</span><a href="' + SHOP + 'index.html">Zum Shop ' + SVG.arrow + '</a><a href="' + WKIH + 'startseite.html">Zu den Kochideen ' + SVG.arrow + '</a></div></div>' +
      '<div class="wrap top__in"><a class="brand" href="index.html" aria-label="FoodKreator, zur Startseite"><img src="assets/img/logo-foodkreator-white.svg" alt="" width="511" height="262"></a>' +
      '<nav class="nav" aria-label="Hauptnavigation">' + links + '<a class="btn btn--orange btn--small" href="kontakt.html"' + c('kontakt') + '>Idee besprechen</a></nav>' +
      '<button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menü öffnen"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button></div>' +
      '<nav class="mnav" id="mnav" aria-label="Hauptnavigation mobil">' + links + '<a class="btn btn--orange" href="kontakt.html">Idee besprechen</a></nav></header>';
  }
  function footer() {
    return '<footer class="foot2"><div class="wrap"><p class="foot2__claim">Ihre Idee. Unser <em>Know-how.</em></p><div class="foot2__grid">' +
      '<div><img class="foot2__logo" src="assets/img/logo-foodkreator-white.svg" alt="FoodKreator" width="511" height="262" style="filter:none"><p>FoodKreator AG<br>Sagenhofweg 7, 6030 Ebikon<br><a href="tel:+41414420155">+41 41 442 01 55</a><br><a href="mailto:info@foodkreator.ch">info@foodkreator.ch</a></p></div>' +
      '<div><h4>FoodKreator</h4><ul><li><a href="index.html#leistungen">Leistungen</a></li><li><a href="index.html#ablauf">So läuft es ab</a></li><li><a href="referenzen.html">Referenzen</a></li><li><a href="ueber-uns.html">Über uns</a></li><li><a href="kontakt.html">Kontakt</a></li></ul></div>' +
      '<div><h4>Redline</h4><ul><li><a href="' + SHOP + 'index.html">Gewürze-Shop</a></li><li><a href="' + WKIH + 'startseite.html">Was koche ich heute?</a></li><li><a href="' + WKIH + 'kochideen.html">Kochideen</a></li></ul></div>' +
      '<div><h4>Eigenes Produkt?</h4><p>Erzählen Sie uns Ihre Idee. Ein paar Sätze reichen.</p><a class="link" href="kontakt.html">Idee besprechen ' + SVG.arrow + '</a></div>' +
      '</div><div class="foot2__legal"><span>© FoodKreator AG · UID CHE-108.597.625</span><nav aria-label="Rechtliches"><a href="#">Impressum</a><a href="#">AGB</a><a href="#">Datenschutz</a></nav></div></div></footer>';
  }

  /* ------------------------------------------------------------------
     1 · Produkt-Vorschau im Einstieg
     ------------------------------------------------------------------ */
  function initMaker(root) {
    var st = { name: '', typ: 'gewuerz' }, stage = $('[data-maker-stage]', root), input = $('#produktname', root);
    function render() {
      var nm = st.name.trim() || 'Ihr Produkt';
      stage.innerHTML = '<span class="maker__tag">Ihre Marke, Ihr Name</span><svg viewBox="0 -50 600 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
        E(300, 316, 240, 14, '#261f1f', 'opacity=".12"') +
        at(92, 36, 0.94, '<g class="prod" data-t="sauce">' + bottle({ name: nm }) + '</g>') +
        at(240, 36, 0.94, '<g class="prod" data-t="gewuerz">' + jarFK({ name: nm, color: '#b9853f' }) + '</g>') +
        at(382, 36, 0.94, '<g class="prod" data-t="snack">' + pouch({ name: nm }) + '</g>') + '</svg>';
      $$('.prod', stage).forEach(function (g) {
        var on = st.typ === 'anderes' || g.getAttribute('data-t') === st.typ;
        g.classList.toggle('is-on', on && st.typ !== 'anderes'); g.classList.toggle('is-dim', !on);
      });
      $$('[data-typ]', root).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-typ') === st.typ)); });
      var q = new URLSearchParams(); if (st.name.trim()) q.set('name', st.name.trim()); q.set('typ', st.typ);
      $('[data-maker-go]', root).href = 'kontakt.html?' + q;
    }
    input.addEventListener('input', function () { st.name = input.value.slice(0, 30); render(); });
    $$('[data-typ]', root).forEach(function (b) { b.addEventListener('click', function () { st.typ = b.getAttribute('data-typ'); render(); }); });
    render();
  }

  /* ------------------------------------------------------------------
     2 · Für wen
     ------------------------------------------------------------------ */
  function initWho(root) {
    var list = $('[data-who-list]', root), panel = $('[data-who-panel]', root), cur = 0;
    list.innerHTML = WER.map(function (w, i) {
      return '<li><button type="button" role="tab" id="wt-' + w.id + '" aria-controls="who-panel" aria-selected="' + (i === 0) + '" data-i="' + i + '"><i>' + art(w.icon) + '</i>' + esc(w.t) + '<svg class="go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></li>';
    }).join('');
    function show(i) {
      cur = i; var w = WER[i];
      $$('button', list).forEach(function (b) { b.setAttribute('aria-selected', String(+b.getAttribute('data-i') === i)); });
      panel.setAttribute('aria-labelledby', 'wt-' + w.id);
      panel.innerHTML = '<div class="who__head"><div class="who__art">' + art(w.icon) + '</div><h3>' + esc(w.h) + '</h3></div><p>' + esc(w.text) + '</p>' +
        '<ul class="ticks">' + w.was.map(function (x) { return '<li>' + SVG.check + esc(x) + '</li>'; }).join('') + '</ul>' +
        (w.cases ? w.cases.map(function (c) { return '<div class="who__case"><b>Beispiel: ' + esc(CASES[c].name) + '</b>' + esc(CASES[c].loesung) + '</div>'; }).slice(0, 1).join('') : '') +
        (w.logos ? '<div class="who__logos"><span>Sie vertrauen FoodKreator</span>' + w.logos.map(logo).join('') + '</div>' : '') +
        '<div class="who__cta btn-row"><a class="btn btn--orange" href="kontakt.html?wer=' + w.id + '">Als ' + esc(w.t.split(' oder ')[0].replace(' mit einer Idee', '').replace(' und Eigenmarken', '')) + ' anfragen</a><a class="btn btn--ghost" href="#ablauf">So läuft es ab</a></div>';
    }
    list.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.getAttribute('data-i')); });
    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault(); var i = (cur + (e.key === 'ArrowDown' ? 1 : -1) + WER.length) % WER.length; show(i); $$('button', list)[i].focus();
    });
    show(0);
  }

  /* ------------------------------------------------------------------
     Anfrage (Startseite und Kontakt)
     ------------------------------------------------------------------ */
  function initAsk(root) {
    var wer = param('wer'), typ = param('typ'), name = param('name') || '';
    var preWas = { gewuerz: 'Gewürzmischung', sauce: 'Marinade oder Sauce', snack: 'Snack oder Nüsse' }[typ];
    function chips(key, list, multi, pre) {
      return '<div class="chips" data-chips="' + key + '" data-multi="' + (multi ? 1 : 0) + '">' + list.map(function (x) {
        var id = x.id || x, t = x.t || x;
        return '<button type="button" data-v="' + esc(id) + '" aria-pressed="' + (pre === id) + '">' + esc(t) + '</button>';
      }).join('') + '</div>';
    }
    root.innerHTML = '<form class="askform" data-keep novalidate>' +
      '<fieldset><legend><b>1</b>Wer sind Sie?</legend>' + chips('wer', WER.map(function (w) { return { id: w.id, t: w.t }; }), false, wer) + '</fieldset>' +
      '<fieldset><legend><b>2</b>Was möchten Sie machen? <small>Mehrere möglich</small></legend>' + chips('was', WAS, true, preWas) + '</fieldset>' +
      '<fieldset><legend><b>3</b>Welche Menge stellen Sie sich vor?</legend>' + chips('menge', MENGE, false, '') + '</fieldset>' +
      '<div><label class="lab" for="idee"><b>4</b>Ihre Idee in ein paar Sätzen</label><textarea id="idee" placeholder="Zum Beispiel: Ich möchte mein Grillgewürz in kleinen Gläsern als Geschenk für unsere Kunden.">' + (name ? esc('Arbeitstitel: ' + name + '. ') : '') + '</textarea></div>' +
      '<div><p class="lab"><b>5</b>Wie erreichen wir Sie?</p><div class="fields2">' +
        '<label><span>Vorname und Name</span><input autocomplete="name" required></label><label><span>Firma <small>(falls vorhanden)</small></span><input autocomplete="organization"></label>' +
        '<label><span>E-Mail</span><input type="email" autocomplete="email" required></label><label><span>Telefon <small>(freiwillig)</small></span><input type="tel" autocomplete="tel"></label></div></div>' +
      '<div class="askform__send"><button class="btn btn--orange" type="submit">Idee senden</button><small>Unverbindlich. Wir melden uns bei Ihnen.</small></div></form>';
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-chips] button'); if (!b) return;
      var box = b.parentNode, multi = box.getAttribute('data-multi') === '1', on = b.getAttribute('aria-pressed') !== 'true';
      if (!multi) $$('button', box).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', String(on));
    });
    $('form', root).addEventListener('submit', function (e) {
      e.preventDefault();
      root.innerHTML = '<div class="askform__done" role="status"><b>Danke. Ihre Idee ist bei uns.</b><p>Wir lesen sie und melden uns bei Ihnen. Eilt es? Rufen Sie an: <a href="tel:+41414420155">041 442 01 55</a>.</p><p class="hint" style="font-size:13px;color:var(--muted)">Entwurf: Es wurde nichts gesendet.</p></div>';
    });
  }

  /* ------------------------------------------------------------------
     Seiten
     ------------------------------------------------------------------ */
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }
  function renderCommon() {
    fill('[data-art-svc]', '');
    $$('[data-art]').forEach(function (el) {
      var id = el.getAttribute('data-art');
      if (id === 'eigenmarke') el.innerHTML = '<svg viewBox="-10 -6 140 310" aria-hidden="true">' + jarFK({ name: 'Ihr Produkt', color: '#c0502a' }) + '</svg>';
      else if (id === 'serie') el.innerHTML = serie();
      else if (ART[id]) el.innerHTML = art(id, null, el.hasAttribute('data-light'));
    });
    var track = $('[data-logos]');
    if (track) { var imgs = LOGOS.map(function (l) { return logo(l[0]); }).join(''); track.innerHTML = imgs + imgs.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"'); }
    var grid = $('[data-logogrid]');
    if (grid) grid.innerHTML = LOGOS.map(function (l) { return '<div>' + logo(l[0]) + '</div>'; }).join('');
    $$('[data-cases]').forEach(function (el) {
      var ids = el.getAttribute('data-cases').split(','), short = el.hasAttribute('data-short');
      el.innerHTML = ids.map(function (id) { return caseCard(id, short); }).join('');
    });
    var own = $('[data-own]');
    if (own && G) own.innerHTML = ['helvetica', 'mekong', 'argentinien', 'suedindien', 'peking'].map(function (k) { var s = G.SPICE[k]; return A.jarSvg({ name: s.name, spice: s.color, label: 'Redline ' + s.name }); }).join('');
    var chef = $('[data-chef]');
    if (chef) chef.innerHTML = '<svg viewBox="0 0 200 200" aria-hidden="true">' +
      P('M30 200C30 150 62 128 100 128C138 128 170 150 170 200Z', '#fffdf8') + P('M100 128L84 160L100 200L116 160Z', '#f68e10') + C(84, 168, 3.5, '#261f1f') + C(116, 168, 3.5, '#261f1f') + C(84, 186, 3.5, '#261f1f') + C(116, 186, 3.5, '#261f1f') +
      R(88, 108, 24, 26, '#e8b48a', 8) + E(100, 86, 30, 34, '#efc39b') + E(70, 88, 6, 9, '#e8b48a') + E(130, 88, 6, 9, '#e8b48a') +
      P('M66 58C60 30 84 18 100 26C116 18 140 30 134 58Z', '#fffdf8') + R(70, 50, 60, 16, '#fffdf8', 4) + P('M70 66L130 66', 'none', 'stroke="#e4dacb" stroke-width="3"') +
      C(89, 86, 3, '#261f1f') + C(111, 86, 3, '#261f1f') + P('M90 102Q100 110 110 102', 'none', 'stroke="#261f1f" stroke-width="3.5" stroke-linecap="round"') + '</svg><span class="person__note">Illustration, Foto folgt</span>';
  }

  /* Ablauf: Schritt für Schritt aufleuchten, solange man nicht selbst darüber fährt */
  function initFlow() {
    var items = $$('.flow li'); if (!items.length || reduced) return;
    var i = 0, timer = null, flow = $('.flow');
    function tick() { items.forEach(function (li, k) { li.classList.toggle('is-on', k === i); }); i = (i + 1) % items.length; }
    flow.addEventListener('mouseenter', function () { clearInterval(timer); items.forEach(function (li) { li.classList.remove('is-on'); }); });
    flow.addEventListener('mouseleave', function () { timer = setInterval(tick, 1600); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { clearInterval(timer); if (es[0].isIntersecting) { tick(); timer = setInterval(tick, 1600); } }).observe(flow);
  }

  function initChrome() {
    var top = $('#top'), lastY = window.scrollY;
    function measure() { document.body.style.setProperty('--toph', top.offsetHeight + 'px'); }
    measure(); window.addEventListener('resize', measure); if (document.fonts) document.fonts.ready.then(measure);
    window.addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      var keep = y < top.offsetHeight || $('.mnav').classList.contains('is-open') || !!top.querySelector(':focus-visible');
      top.classList.toggle('is-hidden', dy > 0 && !keep);
      lastY = y;
    }, { passive: true });
    if (window.parent !== window) { var report = function () { window.parent.postMessage({ wsScroll: window.scrollY }, '*'); }; window.addEventListener('scroll', report, { passive: true }); report(); }
    var burger = $('.burger'), mnav = $('.mnav');
    burger.addEventListener('click', function () { var open = !mnav.classList.contains('is-open'); mnav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen'); });
    $$('.mnav a').forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    } else $$('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
    $$('form:not([data-keep])').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); var b = f.querySelector('button'); if (b) { b.textContent = 'Danke!'; b.disabled = true; } }); });
  }

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */
  document.body.insertAdjacentHTML('afterbegin', header());
  var ft = $('[data-footer]'); if (ft) ft.outerHTML = footer();
  renderCommon();
  var mk = $('[data-maker]'); if (mk) initMaker(mk);
  var wh = $('[data-who]'); if (wh) initWho(wh);
  $$('[data-ask]').forEach(initAsk);
  initFlow();
  initChrome();
})();
