/* ==========================================================================
   Redline · «Über uns» · Illustrationen und «Die Reise» (horizontaler Scroll)
   Inhalte aus waskocheichheute.ch (Über uns, Geschichte des Essens, Fair,
   BBQ Vizeweltmeister, Kontakt) und foodaktuell.ch (2019, Simon Keller).
   Die Reise: Stationen 1 bis 4 hat Simon Keller erlebt, ab Station 5 ist
   es die Legende von Mr. Spice, so wie Redline sie erzählt.
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, P = A.parts;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }
  function n(v) { return Math.round(v * 10) / 10; }
  function g(x, y, s, inner, rot) { return '<g transform="translate(' + n(x) + ' ' + n(y) + ')' + (rot ? ' rotate(' + n(rot) + ')' : '') + ' scale(' + s + ')">' + inner + '</g>'; }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" aria-hidden="true">' + inner + '</svg>'; }
  function jarAt(name, color, x, y, s, deg) { return g(x, y, s, '<g transform="translate(-60 -150)">' + A.jar({ name: name, spice: color }) + '</g>', deg); }
  function liq(k, x, y, s) { return g(x, y, s, A.liquidIcon(k)); }
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var JAR = { helvetica: ['Helvetica', '#b9ae78'], argentinien: ['Argentinien', '#8a5a34'], italien: ['Italien', '#8a8a4a'], peking: ['Peking', '#a5462b'], mekong: ['Mekong', '#b9853f'], kongo: ['Kongo', '#7a3a20'], aethiopien: ['Äthiopien', '#9a3a1f'], suedindien: ['Süd Indien', '#c99a2e'] };

  /* ------------------------------------------------------------------
     Kleine Illustrationen
     ------------------------------------------------------------------ */
  var flame = '<path d="M0 50C-40 30 -30 -10 0 -60C30 -10 40 30 0 50Z" fill="#f68e10"/><path d="M0 46C-20 30 -14 6 0 -20C14 6 20 30 0 46Z" fill="#ffd166"/>';
  fill('[data-art="uu-logic-1"]', svg('-160 -70 320 140', g(-86, 6, 0.85, flame) + '<text x="-4" y="12" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="22" fill="#6b5b52">oder</text>' + liq('sauce', 84, 4, 0.8)));
  fill('[data-art="uu-logic-2"]', svg('-150 -40 300 80', ['wasser', 'rahm', 'tomate', 'kokos', 'soja'].map(function (k, i) { return '<circle cx="' + (-120 + i * 60) + '" cy="0" r="27" fill="#fff"/>' + liq(k, -120 + i * 60, 2, 0.42); }).join('')));
  fill('[data-art="uu-logic-3"]', svg('-130 -80 260 160', jarAt('Helvetica', '#b9ae78', -70, 6, 0.42, -8) + jarAt('Mekong', '#b9853f', 0, 0, 0.46) + jarAt('Argentinien', '#8a5a34', 70, 6, 0.42, 8)));
  fill('[data-art="uu-kongo"]', svg('-110 -90 220 180', '<circle r="78" fill="#fdf1e6"/>' + liq('tomate', -34, 10, 0.95) + jarAt('Kongo', '#7a3a20', 40, 4, 0.5, 6)));
  fill('[data-art="uu-fair"]', svg('-70 -70 140 140', '<circle r="62" fill="#fdf1e6"/>' + jarAt('Helvetica', '#b9ae78', -8, 8, 0.36, -6) +
    '<path d="M30 -10c0-12 18-12 18 0c0-12 18-12 18 0c0 14-18 24-18 24s-18-10-18-24z" fill="#eb5737" transform="translate(-10 -20)"/>'));
  fill('[data-art="uu-pfeffer"]', svg('-70 -70 140 140', '<circle r="62" fill="#fdf1e6"/>' +
    '<path d="M-6 54C-12 20 8 -10 -2 -52" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
    [[-30, -22, -30], [24, -4, 30], [-26, 22, -20], [22, 30, 20]].map(function (l) { return g(l[0], l[1], 1, '<path d="M-20 0Q0 -14 20 0Q0 14 -20 0Z" fill="#3f8a3a"/>', l[2]); }).join('') +
    [[8, -34, '#3f8a3a'], [-12, 0, '#c8321e'], [12, 16, '#3f8a3a'], [-4, 38, '#c8321e']].map(function (c) {
      var s = ''; for (var i = 0; i < 6; i++) s += '<circle cx="' + (c[0] + (i % 2) * 6) + '" cy="' + (c[1] + i * 5) + '" r="3.6" fill="' + c[2] + '"/>'; return s;
    }).join('')));
  fill('[data-art="uu-kenia"]', svg('-70 -70 140 140', '<circle r="62" fill="#fdf1e6"/>' + g(-14, 40, 0.42, P.acacia(0, 0, 1, '#4f8a3f')) +
    '<path d="M18 22h40l-6 26h-28z" fill="#5a4a44"/><rect x="16" y="16" width="44" height="8" rx="3" fill="#3a2a24"/>' + g(38, 14, 0.24, flame)));

  /* Einstieg der Reise: Globus mit Route und Schiff */
  (function () {
    var el = $('[data-art="uu-globe"]');
    if (!el) return;
    var r = A.rnd(9), land = '';
    [[250, 220, 70], [330, 300, 60], [430, 210, 80], [520, 330, 55], [600, 250, 46]].forEach(function (b) {
      var pts = [];
      for (var i = 0; i < 9; i++) { var a = i / 9 * Math.PI * 2, rr = b[2] * (0.7 + r() * 0.5); pts.push([b[0] + Math.cos(a) * rr, b[1] + Math.sin(a) * rr * 0.8]); }
      land += '<path d="M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z" fill="#9cc66f" stroke="#7fb35c" stroke-width="6" stroke-linejoin="round"/>';
    });
    el.innerHTML = '<svg class="rz-globe" viewBox="0 0 700 600" aria-hidden="true"><defs><clipPath id="uugc"><circle cx="400" cy="290" r="250"/></clipPath>' +
      '<radialGradient id="uugg" cx=".35" cy=".3"><stop offset="0" stop-color="#8fd0ea"/><stop offset="1" stop-color="#3d8fbf"/></radialGradient></defs>' +
      '<circle cx="410" cy="306" r="256" fill="#261f1f" opacity=".12"/><circle cx="400" cy="290" r="250" fill="url(#uugg)"/>' +
      '<g clip-path="url(#uugc)">' + land + '</g>' +
      '<path d="M210 230 C300 140, 470 120, 560 220 S 560 420, 420 460 S 230 420, 250 330" fill="none" stroke="#f68e10" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>' +
      '<circle cx="210" cy="230" r="11" fill="#eb5737" stroke="#fff" stroke-width="4"/><circle cx="560" cy="220" r="8" fill="#fff"/><circle cx="420" cy="460" r="8" fill="#fff"/><circle cx="250" cy="330" r="11" fill="#261f1f" stroke="#fff" stroke-width="4"/>' +
      '</svg>' + A.ship();
  })();

  /* ------------------------------------------------------------------
     Auszeichnungen
     ------------------------------------------------------------------ */
  var MEDAL = { 1: ['#e8b923', '#b8891a'], 2: ['#c9ced6', '#98a0ab'], 3: ['#d08f50', '#9e6634'] };
  var AWARDS = [
    { y: '2013', ev: 'Swiss BBQ Masters, Biel', items: [[1, 'Fingerfood'], [2, 'Fisch'], [3, 'Spare Ribs']] },
    { y: '2014', ev: 'Swiss BBQ Masters, Küssnacht', items: [[1, 'mit Beilage'], [2, 'Fingerfood']] },
    { y: '2015', ev: 'BBQ-Weltmeisterschaft, Göteborg', items: [[2, 'Vize-Weltmeister mit dem Schweizer BBQ-Team', true]], top: true },
    { y: 'USA', ev: 'Jack Daniel\'s World Championship', items: [[2, 'Homecooking, mit dem Schweizer BBQ-Team']] }
  ];
  var medals = $('[data-medals]');
  if (medals) {
    medals.innerHTML = AWARDS.map(function (a) {
      return '<li class="medal' + (a.top ? ' medal--top' : '') + '"><span class="medal__year">' + a.y + '</span><div><b>' + a.ev + '</b><ul>' +
        a.items.map(function (it) {
          var c = MEDAL[it[0]];
          return '<li><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="' + c[1] + '"/><circle cx="20" cy="20" r="14" fill="' + c[0] + '"/>' +
            '<text x="20" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="16" fill="#261f1f">' + it[0] + '</text></svg>' +
            '<span>' + (it[2] ? '' : it[0] + '. Rang ') + it[1] + '</span></li>';
        }).join('') + '</ul></div></li>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Die Reise: neun Stationen, damals gelernt und heute im Glas
     ------------------------------------------------------------------ */
  var stage = $('.rz-stage'), track = $('[data-rz-track]');
  if (!stage || !track) return;

  function chip(k, label) { return '<span class="rz-chip">' + (k ? '<i>' + svg('-56 -60 112 112', A.liquidIcon(k)) + '</i>' : '') + label + '</span>'; }
  function then(items) { return '<div class="rz-row"><span class="rz-label">Damals gelernt</span><div class="rz-items">' + items + '</div></div>'; }
  function now(keys, text, compact) {
    return '<div class="rz-row rz-row--now"><span class="rz-label">Heute im Glas</span><div class="rz-items' + (compact ? ' rz-items--compact' : '') + '">' +
      keys.map(function (k) { return '<span class="rz-jar">' + A.jarSvg({ name: JAR[k][0], spice: JAR[k][1], label: 'Redline ' + JAR[k][0] }) + '<b>Redline ' + JAR[k][0] + '</b></span>'; }).join('') +
      (text ? '<p class="rz-nowtext">' + text + '</p>' : '') + '</div></div>';
  }
  function op(t) { return '<span class="rz-op" aria-hidden="true">' + t + '</span>'; }
  var LEGEND = '<span class="rz-legend">Legende</span>';

  /* Neue Szenen: allein auf der Insel und zurück in der Schweiz */
  function strandedScene() {
    var herbs = '';
    [['#3f8a3a', -16], ['#c8321e', -6], ['#e8b923', 4], ['#7cbf5e', 14], ['#a8642a', -12], ['#4f9a3c', 8], ['#d6452b', 0]].forEach(function (h, i) {
      herbs += '<ellipse cx="' + h[1] + '" cy="' + (-48 - (i % 3) * 7) + '" rx="9" ry="5" fill="' + h[0] + '" transform="rotate(' + (i * 25 - 60) + ' ' + h[1] + ' ' + (-48 - (i % 3) * 7) + ')"/>';
    });
    var bucket = '<path d="M-26 -44h52l-6 44h-40z" fill="#9aa3ad"/><path d="M-26 -44h52" stroke="#6c757f" stroke-width="5"/>' + herbs;
    var fire = '<path d="M-40 0L40 0" stroke="#7a4a2a" stroke-width="10" stroke-linecap="round"/><path d="M-30 4L30 -6M-30 -6L30 4" stroke="#5a3420" stroke-width="8" stroke-linecap="round"/>' +
      g(0, -24, 0.5, flame) + '<path d="M-56 -78L56 -50" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>' +
      g(0, -66, 1, '<path d="M-26 0C-16 -14 16 -14 26 0C16 14 -16 14 -26 0Z" fill="#9fb4c0"/><path d="M26 0L40 -10L40 10Z" fill="#6f8ea0"/><circle cx="-16" cy="-2" r="3" fill="#261f1f"/>', 14);
    var logs = '';
    for (var i = 0; i < 5; i++) logs += '<rect x="' + (-90 + i * 34) + '" y="-24" width="32" height="24" rx="11" fill="' + (i % 2 ? '#8a5a33' : '#7a4a2a') + '"/>';
    return P.cloud(260, 150, 0.9, '#ffffff', 0.7) + P.cloud(1240, 110, 0.7, '#ffffff', 0.6) +
      '<path d="M140 900C330 706 560 664 800 664S1280 706 1460 900Z" fill="#f0cf8f"/><path d="M300 760C420 690 560 670 640 668L620 676C540 680 420 700 320 768Z" fill="#7ab55c" opacity=".9"/>' +
      P.palm(420, 694, 300, 40, 1.1) + P.palm(1240, 704, 250, -40, 1) +
      g(560, 700, 1, logs, -6) + g(760, 686, 1, bucket) + g(960, 690, 1, fire) + P.person(860, 684, 1.2, { shirt: '#2d78c4', apron: '#fffaf3', chef: true, wave: true });
  }
  function todayScene() {
    var jars = [['Helvetica', '#b9ae78'], ['Argentinien', '#8a5a34'], ['Peking', '#a5462b'], ['Mekong', '#b9853f'], ['Äthiopien', '#9a3a1f'], ['Süd Indien', '#c99a2e']];
    var table = '<rect x="-300" y="0" width="600" height="26" rx="8" fill="#b5763d"/><rect x="-280" y="26" width="20" height="90" fill="#8f5a2c"/><rect x="260" y="26" width="20" height="90" fill="#8f5a2c"/>' +
      jars.map(function (j, i) { return jarAt(j[0], j[1], -230 + i * 92, -84, 0.56, (i % 2 ? 4 : -4)); }).join('');
    return A.scene('norden', { sky: false, voyage: true }) + g(1270, 650, 0.78, table);
  }

  var STOPS = [
    { key: 'Schweiz', scene: 'norden', sky: '#8ec3e3', sea: '#5f9fc0', kicker: 'Schweiz · Kindheit', title: 'Alles beginnt mit <em>Rahm.</em>',
      text: 'Schon als Kind steht Simon Keller in Schweizer Restaurantküchen. Er lernt, mit dem Eigengeschmack der Zutaten zu arbeiten, und merkt: Die Schweizer Küche kocht mit Milch und Rahm.',
      then: chip('rahm', 'Milch und Rahm'), now: now(['helvetica'], 'Sein Liebling: Sie bringt den Eigengeschmack der Zutaten heraus.') },
    { key: 'Süden', scene: 'sueden', sky: '#f4ae66', sea: '#4d9ab8', kicker: 'Argentinien und Italien', title: 'Dann kommen die <em>Tomaten.</em>',
      text: 'Nach Jahren in der Schweiz zieht er los und kocht in vielen Ländern der Welt. In Argentinien und Italien lernt er die Küche mit Tomaten.',
      then: chip('tomate', 'Tomaten'), now: now(['argentinien', 'italien']) },
    { key: 'Asien', scene: 'fernost', sky: '#3a2a66', sea: '#2d3f73', kicker: 'Hongkong und China', title: 'In Asien lernt er <em>Soja.</em>',
      text: 'In Hongkong und China lernt er den Umgang mit Sojasauce. Weil er immer weiss, welches Gewürz das richtige ist, nennen ihn seine Küchenpartner «Mr. Spice».',
      then: chip('soja', 'Sojasauce'), now: now(['peking']) },
    { key: 'Tropen', scene: 'tropen', sky: '#8fd3c1', sea: '#38a39a', kicker: 'Die Tropen', title: 'In den Tropen: <em>Kokosmilch.</em>',
      text: 'In den tropischen Ländern lernt er alles über die Kokosnuss und ihre Milch. Jetzt kennt er vier Küchen der Welt.',
      then: chip('kokos', 'Kokosmilch'), now: now(['mekong', 'suedindien']) },
    { key: 'Sturm', scene: 'sturm', sky: '#262b3f', sea: '#25364f', kicker: 'Auf hoher See', legend: true, title: 'Zu viele Küchen, keine <em>Übersicht.</em>',
      text: 'Er hat so viel gelernt, dass ihm die Übersicht fehlt. Auf der Heimreise in die Schweiz will er ein System finden. Doch sein Schiff gerät in einen Sturm und sinkt. Er rettet sich auf ein Floss.',
      then: '', now: '' },
    { key: 'Insel', scene: 'gestrandet', sky: '#ffcf8f', sea: '#3fa8b8', kicker: 'Gestrandet', legend: true, title: 'Eine Insel, sieben <em>Gewürze.</em>',
      text: 'Er strandet auf einer Insel, fast ohne Vorräte. Er sammelt sieben wilde Gewürze, etwa Koriander, Ingwer und Chili. Den Fisch grilliert er oder kocht ihn in Kokosmilch oder Wasser. So isst er aus demselben Fisch jeden Tag ein anderes Gericht.',
      then: chip('', '1 Fisch') + op('×') + chip('', '7 Gewürze') + op('×') + chip('', 'grillen oder kochen') + op('=') + '<b class="rz-result">21 Gerichte</b>',
      now: '<div class="rz-row rz-row--now"><span class="rz-label">Heute</span><p class="rz-nowtext">Grillgericht oder Saucengericht: Das ist bis heute die erste Frage beim Kochen mit Redline. <a href="so-funktionierts.html">So funktioniert\'s</a></p></div>' },
    { key: 'Entdeckung', scene: 'entdeckung', sky: '#ffb86b', sea: '#4cb0c4', kicker: 'Die Entdeckung', legend: true, title: 'Jedes Gewürz passt zu jeder <em>Kochflüssigkeit.</em>',
      text: 'Auf der Insel versteht er, was er gesucht hat: Woher eine Zutat kommt, ist egal. Ob ein Gericht nach Thailand oder nach der Schweiz schmeckt, entscheiden Kochflüssigkeit und Gewürz. Und auf seinen Reisen hat er gesehen, dass die Welt mit nur fünf Flüssigkeiten kocht: Wasser, Rahm, Tomate, Kokosmilch und Soja.',
      then: '', now: now(['aethiopien', 'helvetica', 'argentinien', 'mekong', 'peking'], 'Jede Flüssigkeit hat ihr typisches Gewürz. Kombinieren darfst du alles: Das nennen wir Mischküche.', true) },
    { key: 'Heute', scene: 'heute', sky: '#9ccbe6', sea: '#5f9fc0', kicker: 'Heute · Ebikon', title: 'Daraus wurde <em>Redline.</em>',
      text: 'Ein Schiff bringt ihn zurück in die Schweiz. Dort entwickelt er daraus rund 100 Gewürzmischungen, für jede Region der Welt. Gemischt und abgefüllt wird bis heute in der Schweiz.',
      then: '', now: '<div class="btn-row"><a class="btn btn--orange btn--small" href="https://shop.waskocheichheute.ch/de/produkt/probierset-um-die-welt" target="_blank" rel="noopener">Probierset · CHF 24.90</a><a class="btn btn--ghost btn--small" href="kochideen.html">Kochideen</a></div>' }
  ];
  var N = STOPS.length, STORM = 4;

  function mix(a, b) {
    var pa = [1, 3, 5].map(function (k) { return parseInt(a.substr(k, 2), 16); }), pb = [1, 3, 5].map(function (k) { return parseInt(b.substr(k, 2), 16); });
    return '#' + pa.map(function (v, k) { return ('0' + Math.round((v + pb[k]) / 2).toString(16)).slice(-2); }).join('');
  }
  function scene(id) {
    if (id === 'gestrandet') return strandedScene();
    if (id === 'heute') return todayScene();
    /* Entdeckung: die fünf Flüssigkeiten rechts neben die Textkarte rücken */
    if (id === 'entdeckung') return g(170, 0, 1, A.scene(id, { sky: false, voyage: true }));
    return A.scene(id, { sky: false, voyage: true });
  }

  track.style.background = 'linear-gradient(90deg, ' + STOPS[0].sky + ' 0%, ' + STOPS.map(function (s, i) { return s.sky + ' ' + ((i + 0.5) / N * 100).toFixed(2) + '%'; }).join(', ') + ', ' + STOPS[N - 1].sky + ' 100%)';
  track.innerHTML = STOPS.map(function (s, i) {
    var left = i ? mix(STOPS[i - 1].sea, s.sea) : s.sea, right = i < N - 1 ? mix(s.sea, STOPS[i + 1].sea) : s.sea;
    return '<div class="rz-panel" data-i="' + i + '" style="--sky:' + s.sky + '">' +
      '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + scene(s.scene) + A.seaPanel([left, s.sea, right], i * 1600, (STORM + 0.5) * 1600, 1500) + '</svg>' +
      '<div class="rz-card"><article class="wp-card">' +
        '<p class="wp-kicker"><b>' + String(i + 1).padStart(2, '0') + '</b>' + s.kicker + (s.legend ? LEGEND : '') + '</p>' +
        '<h3 class="rz-title">' + s.title + '</h3><p class="rz-text">' + s.text + '</p>' +
        (s.then ? then(s.then) : '') + (s.now || '') +
      '</article></div></div>';
  }).join('');

  var gsap = window.gsap, ST = window.ScrollTrigger;
  var boat = $('[data-rz-boat]'), route = $('[data-rz-route]');
  /* Ohne Bewegung (oder ohne GSAP): Stationen untereinander */
  if (reduced || !gsap || !ST) { stage.classList.add('is-static'); return; }
  gsap.registerPlugin(ST);

  /* Boot: Schiff, das im Sturm zum Floss wird */
  boat.innerHTML = A.ship() + A.raft();
  var ship = $('.ship', boat), raft = $('.raft', boat);
  function placeBoat() {
    var vw = window.innerWidth, vh = window.innerHeight, s = Math.max(vw / 1600, vh / 900), seaY = vh - (900 - 742) * s;
    var bw = boat.getBoundingClientRect().width || 240;
    boat.style.top = (seaY - bw * (214 / 320)) + 'px';
    boat.style.height = (bw * 280 / 320) + 'px';
  }
  placeBoat();
  window.addEventListener('resize', placeBoat);

  /* Route oben */
  route.innerHTML = STOPS.map(function (s) { return '<button type="button" aria-label="' + s.key + '"><i></i><span>' + s.key + '</span></button>'; }).join('');
  var rb = $$('button', route);
  function setActive(idx) { rb.forEach(function (b, k) { b.setAttribute('aria-current', String(k === idx)); b.classList.toggle('is-past', k < idx); }); }
  rb.forEach(function (b, k) { b.addEventListener('click', function () { var st = tl.scrollTrigger; window.scrollTo({ top: st.start + (st.end - st.start) * k / (N - 1), behavior: 'smooth' }); }); });

  /* Einrasten: nah an einer Station bleibt man dort, sonst geht es in Scrollrichtung weiter */
  var dir = 1, points = [];
  for (var k = 0; k < N; k++) points.push(k / (N - 1));
  function snapTo(v) {
    var best = points[0], bd = 9;
    points.forEach(function (p) { var d = Math.abs(p - v); if (d < bd) { bd = d; best = p; } });
    if (bd < 0.012) return best;
    var next = dir > 0 ? points.filter(function (p) { return p > v; }) : points.filter(function (p) { return p < v; }).reverse();
    return next.length ? next[0] : best;
  }

  var tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top',
      end: function () { return '+=' + Math.round(window.innerWidth * (N - 1) * 1.1); },
      pin: true, scrub: 1, invalidateOnRefresh: true,
      snap: { snapTo: snapTo, inertia: false, duration: { min: 0.35, max: 1 }, delay: 0.12, ease: 'power2.inOut' },
      onUpdate: function (self) { if (self.direction) dir = self.direction; setActive(Math.round(self.progress * (N - 1))); }
    }
  });
  tl.to(track, { x: function () { return -window.innerWidth * (N - 1); }, duration: N - 1 }, 0);

  /* Sturm: das Schiff schaukelt, zerbricht und wird zum Floss; danach treibt das Floss davon */
  var S0 = STORM - 1;
  tl.to(boat, { rotation: -14, duration: 0.18, ease: 'sine.inOut' }, S0)
    .to(boat, { rotation: 16, y: -24, duration: 0.18, ease: 'sine.inOut' }, S0 + 0.18)
    .to(boat, { rotation: -22, y: 10, duration: 0.16, ease: 'sine.inOut' }, S0 + 0.36)
    .to(boat, { rotation: 24, y: -30, duration: 0.16, ease: 'sine.inOut' }, S0 + 0.52)
    .to(ship, { opacity: 0, y: 60, rotation: 40, transformOrigin: '50% 80%', duration: 0.14 }, S0 + 0.62)
    .to(raft, { opacity: 1, duration: 0.12 }, S0 + 0.7)
    .to(boat, { rotation: -8, y: 0, duration: 0.2, ease: 'sine.inOut' }, S0 + 0.68)
    .to(boat, { rotation: 0, duration: 0.25, ease: 'sine.out' }, S0 + 0.88)
    .to(boat, { x: function () { return window.innerWidth * 0.25; }, opacity: 0, duration: 0.45, ease: 'power1.in' }, STORM + 0.45);

  /* Texte fahren mit leichter Verzögerung herein */
  $$('.rz-card', track).forEach(function (c, i) {
    if (!i) return;
    tl.fromTo(c, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, i - 0.5);
  });

  setActive(0);
  window.addEventListener('load', function () { ST.refresh(); });
})();
