/* ==========================================================================
   Redline · «So funktioniert's» · Illustrationen und Interaktionen
   Inhalte aus waskocheichheute.ch (Anleitung, Kochideen, Fragen & Antworten)
   und der ausdruckbaren Anleitung (PDF)
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function g(x, y, s, inner, rot) { return '<g transform="translate(' + x + ' ' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + ' scale(' + s + ')">' + inner + '</g>'; }
  function jar(name, color, dish) { return '<g transform="translate(-60 -150)">' + A.jar({ name: name, spice: color, dish: dish || '#f1e2c4' }) + '</g>'; }
  function flame(s) { return '<g transform="scale(' + (s || 1) + ')"><path d="M0 50C-40 30 -30 -10 0 -60C30 -10 40 30 0 50Z" fill="#f68e10"/><path d="M0 46C-20 30 -14 6 0 -20C14 6 20 30 0 46Z" fill="#ffd166"/></g>'; }
  function svg(vb, inner, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="' + vb + '" aria-hidden="true">' + inner + '</svg>'; }
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }

  /* ------------------------------------------------------------------
     1 · Hero: gleiche Zutat, andere Flüssigkeit, anderes Gewürz
     ------------------------------------------------------------------ */
  var COMBOS = [
    { liq: 'kokos', liqName: 'Kokosmilch', spice: 'Mekong', color: '#b9853f', sauce: '#f6eedb', world: 'tropen', dish: 'Mekong Kokos-Chicken «Golden River»', from: 'Kambodscha', bg: '#d6efe4', zutat: 'brust', food: 'poulet-tranchen' },
    { liq: 'rahm', liqName: 'Rahm', spice: 'Helvetica', color: '#b9ae78', sauce: '#f1e2c4', world: 'norden', dish: 'Geschnetzeltes nach Zürcher Art', from: 'Schweiz', bg: '#dcecf6', zutat: 'brust', food: 'poulet-streifen' },
    { liq: 'tomate', liqName: 'Tomate', spice: 'Äthiopien', color: '#9a3a1f', sauce: '#d6452b', world: 'sueden', dish: 'Doro Wot', from: 'Äthiopien', bg: '#fbe0bf', zutat: 'schenkel', food: 'poulet-schenkel' },
    { liq: 'grill', liqName: 'Grill', spice: 'Argentinien', color: '#8a5a34', sauce: null, world: 'feuer', dish: 'Pollo del Sol', from: 'Argentinien', bg: '#f6d6c2', zutat: 'brust', food: 'poulet-filet', lemon: true }
  ];
  /* Die rohe Zutat passend zum Gericht: Brust oder Schenkel */
  var ZUTAT = { brust: { food: 'poulet', name: 'Pouletbrust' }, schenkel: { food: 'poulet-schenkel', name: 'Pouletschenkel' } };
  var hero = $('.ph');
  if (hero) {
    var cur = 0, timer = null;
    var elZ = $('[data-fh="zutat"]'), elL = $('[data-fh="liq"]'), elJ = $('[data-fh="jar"]'), elD = $('[data-fh="dish"]');
    function icon(c) { return c.liq === 'grill' ? svg('-60 -70 120 130', flame(1)) : svg('-56 -60 112 112', A.liquidIcon(c.liq)); }
    /* Alle Texte liegen übereinander, nur der aktuelle ist sichtbar:
       so bestimmt der längste die Höhe und die Sektion springt nie. */
    function caps(i, text) {
      return '<figcaption class="fh__cap">' + COMBOS.map(function (c, k) { return '<span' + (k === i ? '' : ' aria-hidden="true"') + '>' + text(c) + '</span>'; }).join('') + '</figcaption>';
    }
    function paint(i) {
      var c = COMBOS[i];
      elZ.innerHTML = svg('-230 -230 460 460', A.plate({ raw: true, food: ZUTAT[c.zutat].food })) + caps(i, function (x) { return ZUTAT[x.zutat].name + '<small>deine Zutat</small>'; });
      elL.innerHTML = '<div class="fh__badge">' + icon(c) + '</div>' + caps(i, function (x) { return (x.liq === 'grill' ? 'Grillieren' : x.liqName) + '<small>' + (x.liq === 'grill' ? 'statt Sauce' : 'Kochflüssigkeit') + '</small>'; });
      elJ.innerHTML = svg('-70 -160 140 320', jar(c.spice, c.color, c.sauce || '#e0a95e')) + caps(i, function (x) { return 'Redline ' + x.spice + '<small>Gewürz</small>'; });
      elD.innerHTML = svg('-250 -250 500 500', A.plate({ sauce: c.sauce, world: c.world, grill: !c.sauce, food: c.food }) +
        (c.lemon ? g(70, 72, 1.5, A.parts.lemon()) + g(100, 38, 1.3, A.parts.lemon()) : '') + (c.sauce ? '' : A.flameRing())) +
        caps(i, function (x) { return '<b>' + x.dish + '</b><small>Aromen aus ' + x.from + '</small>'; });
      hero.style.setProperty('--hbg', c.bg);
      $$('.fh-pick button').forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    }
    function show(i, user) {
      if (user && timer) { clearInterval(timer); timer = null; }
      if (i === cur && !user) return;
      var items = COMBOS[i].zutat === COMBOS[cur].zutat ? [elL, elJ, elD] : [elZ, elL, elJ, elD];
      cur = i;
      if (reduced) { paint(i); return; }
      items.forEach(function (el, k) { setTimeout(function () { el.classList.add('is-swap'); }, k * 70); });
      setTimeout(function () { paint(i); items.forEach(function (el, k) { setTimeout(function () { el.classList.remove('is-swap'); }, k * 90); }); }, 380);
    }
    var pick = $('.fh-pick');
    COMBOS.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<i>' + icon(c) + '</i>' + c.liqName + ' + ' + c.spice;
      b.addEventListener('click', function () { show(i, true); });
      pick.appendChild(b);
    });
    paint(0);
    if (!reduced) timer = setInterval(function () { show((cur + 1) % COMBOS.length); }, 4200);
  }

  /* ------------------------------------------------------------------
     2 · Vier Schritte
     ------------------------------------------------------------------ */
  var VB = '-280 -280 560 560';
  var liqKinds = ['rahm', 'tomate', 'kokos', 'soja', 'wasser'];
  var LIQ3 = {
    rahm:   { name: 'Rahm', sauce: '#f1e2c4', world: 'norden', region: 'Kalte Klimazone' },
    tomate: { name: 'Tomate', sauce: '#d6452b', world: 'sueden', region: 'Lateinische und afrikanische Länder' },
    kokos:  { name: 'Kokosmilch', sauce: '#f6eedb', world: 'tropen', region: 'Tropischer Gürtel' },
    soja:   { name: 'Soja', sauce: '#5b3520', world: 'fernost', region: 'Fernost' },
    wasser: { name: 'Wasser', sauce: '#e2c98f', world: null, region: 'Überall auf der Welt' }
  };
  var STEP_ART = [
    A.plate({ raw: true, food: 'mix' }),
    g(-152, 10, 0.42, A.plate({ grill: true, food: 'poulet' }) + A.flameRing()) +
      g(152, 10, 0.42, A.plate({ sauce: '#f1e2c4', food: 'poulet' })) +
      g(-152, -150, 1, flame(0.7)) + g(152, -148, 1.05, A.liquidIcon('sauce', '#f1e2c4')) +
      '<circle cx="0" cy="10" r="34" fill="#261f1f"/><text x="0" y="19" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="24" fill="#fffaf3">oder</text>' +
      '<text x="-152" y="160" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="21" fill="#261f1f">braten oder grillieren</text>' +
      '<text x="152" y="160" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="21" fill="#261f1f">in Sauce kochen</text>',
    /* Schritt 3: pro Flüssigkeit ein Teller (Sauce und Garnitur der Region), sichtbar ist der aktive;
       beim Hovern über ein Symbol wechselt der Teller, siehe pickLiquid3 */
    liqKinds.map(function (k) {
      return '<g class="p3' + (k === 'kokos' ? ' is-on' : '') + '" data-k="' + k + '">' + g(0, 40, 0.8, A.plate({ sauce: LIQ3[k].sauce, world: LIQ3[k].world, food: 'poulet' })) + '</g>';
    }).join('') +
      liqKinds.map(function (k, i) {
        var a = (-160 + i * 35) * Math.PI / 180, x = (Math.cos(a) * 225).toFixed(1), y = (Math.sin(a) * 225 + 40).toFixed(1);
        return '<g class="liq3' + (k === 'kokos' ? ' is-on' : '') + '" data-k="' + k + '"><circle cx="' + x + '" cy="' + y + '" r="40" fill="#fff"/>' + g(x, (+y + 2).toFixed(1), 0.52, A.liquidIcon(k)) + '</g>';
      }).join('') +
      '<text class="l3-name" x="0" y="240" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="24" fill="#261f1f">' + LIQ3.kokos.name + '</text>' +
      '<text class="l3-region" x="0" y="266" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="17" fill="#6b5f57">' + LIQ3.kokos.region + '</text>',
    g(-20, 50, 0.82, A.plate({ sauce: '#f6eedb', food: 'poulet' })) +
      g(150, -150, 0.95, jar('Mekong', '#b9853f', '#f6eedb'), -140) +
      (function () { var r = A.rnd(5), d = ''; for (var i = 0; i < 26; i++) { var t = r(); d += '<circle cx="' + (40 + t * 60 - r() * 140).toFixed(1) + '" cy="' + (-70 + t * 90 + r() * 70).toFixed(1) + '" r="' + (2 + r() * 3).toFixed(1) + '" fill="' + (i % 3 ? '#b9853f' : '#261f1f') + '" opacity=".85"/>'; } return d; })(),
    A.plate({ sauce: '#f6eedb', world: 'tropen', food: 'poulet' }) +
      '<g transform="translate(0 232)"><rect x="-170" y="-26" width="340" height="52" rx="26" fill="#261f1f"/><text x="0" y="8" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="22" fill="#fffaf3">Golden River · Kambodscha</text></g>'
  ];
  var stage = $('.how__frame');
  if (stage) {
    stage.insertAdjacentHTML('beforeend', STEP_ART.map(function (s, i) { return '<div class="how__art' + (i ? '' : ' is-on') + '">' + svg(VB, s) + '</div>'; }).join(''));
    $$('.how__inline').forEach(function (el, i) { el.innerHTML = svg(VB, STEP_ART[i]); });
    /* Schritt 3: Hovern (oder Antippen) eines Flüssigkeits-Symbols zeigt die passende Sauce */
    function pickLiquid3(root, k) {
      $$('.liq3', root).forEach(function (el) { el.classList.toggle('is-on', el.getAttribute('data-k') === k); });
      $$('.p3', root).forEach(function (el) { el.classList.toggle('is-on', el.getAttribute('data-k') === k); });
      $('.l3-name', root).textContent = LIQ3[k].name;
      $('.l3-region', root).textContent = LIQ3[k].region;
    }
    $$('.how__frame, .how__inline').forEach(function (root) {
      $$('.liq3', root).forEach(function (el) {
        var pick = function () { pickLiquid3(root, el.getAttribute('data-k')); };
        el.addEventListener('mouseenter', pick);
        el.addEventListener('click', pick);
      });
      if ($('.liq3', root)) root.addEventListener('mouseleave', function () { pickLiquid3(root, 'kokos'); });
    });
    var arts = $$('.how__art', stage), steps = $$('.how__step'), bodies = $$('.how__body'), count = $('.how__count'), sticky = stage.parentNode, curStep = -1;
    function activate(i) {
      if (i === curStep) return;
      curStep = i;
      arts.forEach(function (a, k) { a.classList.toggle('is-on', k === i); });
      steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      count.textContent = i < 4 ? 'Schritt ' + (i + 1) + ' von 4' : 'Fertig';
    }
    /* Text auf dieselbe Mitte wie das Bild stellen */
    function placeSteps() {
      var mid = parseFloat(getComputedStyle(sticky).top) + sticky.offsetHeight / 2;
      bodies.forEach(function (b) { b.style.top = Math.max(0, mid - b.offsetHeight / 2) + 'px'; });
    }
    /* Aktiv ist der Schritt, dessen Text am nächsten bei der Bildmitte liegt */
    function pickStep() {
      if (!sticky.offsetParent) return;
      var r = stage.getBoundingClientRect(), mid = r.top + r.height / 2, best = 0, dist = Infinity;
      bodies.forEach(function (b, k) {
        var br = b.getBoundingClientRect(), d = Math.abs(br.top + br.height / 2 - mid);
        if (d < dist) { dist = d; best = k; }
      });
      activate(best);
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; pickStep(); });
    }, { passive: true });
    window.addEventListener('resize', function () { placeSteps(); pickStep(); });
    if (document.fonts) document.fonts.ready.then(placeSteps);
    activate(0);
    placeSteps();
    pickStep();
  }

  /* ------------------------------------------------------------------
     3 · Die fünf Kochflüssigkeiten
     ------------------------------------------------------------------ */
  var LQ = [
    { k: 'rahm', name: 'Rahm', head: 'Rahm: die Küche der kalten Klimazone', where: 'Nordamerika, Skandinavien, Schweiz und Russland', world: 'norden', tag: 'Kalte Klimazone', spices: [['Helvetica', '#b9ae78'], ['1 für Alles', '#9c8c5a'], ['Canada', '#8a6a3a']] },
    { k: 'tomate', name: 'Tomate', head: 'Tomate: die Küche der Sonne', where: 'Lateinische und afrikanische Länder, von Argentinien bis Spanien', world: 'sueden', tag: 'Lateinische und afrikanische Länder', spices: [['Argentinien', '#8a5a34'], ['Spanien', '#c0502a'], ['Kongo', '#7a3a20']] },
    { k: 'kokos', name: 'Kokosmilch', head: 'Kokosmilch: die Küche der Tropen', where: 'Südostasien, Karibik und Madagaskar', world: 'tropen', tag: 'Tropischer Gürtel', spices: [['Mekong', '#b9853f'], ['Süd Indien', '#c99a2e'], ['Caribbean Curry', '#c27a2a']] },
    { k: 'soja', name: 'Soja', head: 'Soja: die Küche des Fernen Ostens', where: 'China, Korea und Japan', world: 'fernost', tag: 'Fernost', spices: [['Peking', '#a5462b'], ['Korea', '#7a3a2a'], ['Yakitori', '#7a4a2a']] },
    { k: 'wasser', name: 'Wasser', head: 'Wasser: gekocht wird damit überall', where: 'Weltweit, von Äthiopien über Italien bis Südafrika', world: null, tag: 'Überall auf der Welt', spices: [['Äthiopien', '#9a3a1f'], ['Italien', '#8a8a4a'], ['South Africa', '#a8622e']] }
  ];
  function globe() {
    var r = A.rnd(9), land = '';
    [[-90, -60, 60], [-20, 10, 52], [60, -50, 64], [90, 60, 44], [-70, 80, 40]].forEach(function (b) {
      var pts = [];
      for (var i = 0; i < 9; i++) { var a = i / 9 * Math.PI * 2, rr = b[2] * (0.7 + r() * 0.5); pts.push((b[0] + Math.cos(a) * rr).toFixed(1) + ' ' + (b[1] + Math.sin(a) * rr * 0.8).toFixed(1)); }
      land += '<path d="M' + pts.join('L') + 'Z" fill="#9cc66f" stroke="#7fb35c" stroke-width="5" stroke-linejoin="round"/>';
    });
    return '<rect x="-500" y="-300" width="1000" height="600" fill="#cfe8f5"/><defs><clipPath id="lxg"><circle r="150"/></clipPath></defs><g transform="translate(60 0)"><circle r="150" fill="#5aa9d6"/><g clip-path="url(#lxg)">' + land + '</g><circle r="150" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/></g>';
  }
  var lx = $('.lx');
  if (lx) {
    var tabs = $('.lx-tabs', lx), panel = $('.lx-panel', lx);
    LQ.forEach(function (q, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'lx-tab'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === 0)); b.setAttribute('aria-controls', 'lx-panel');
      b.innerHTML = '<i>' + svg('-56 -60 112 112', A.liquidIcon(q.k)) + '</i>' + q.name;
      b.addEventListener('click', function () { pickLiquid(i); });
      tabs.appendChild(b);
    });
    function renderLiquid(i) {
      var q = LQ[i];
      panel.innerHTML =
        '<div class="lx-scene">' + (q.world ? '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + A.scene(q.world) + '</svg>' : svg('-400 -225 800 450', globe()).replace('<svg', '<svg preserveAspectRatio="xMidYMid slice"')) +
          '<div class="lx-badge">' + svg('-56 -60 112 112', A.liquidIcon(q.k)) + '</div></div>' +
        '<div class="lx-body"><span class="tag">' + q.tag + '</span><h3>' + q.head + '</h3><p>' + q.where + '.</p>' +
          '<h4>Typische Redline-Gewürze</h4><ul class="lx-jars">' + q.spices.map(function (s) {
            return '<li>' + A.jarSvg({ name: s[0], spice: s[1] }) + s[0] + '</li>';
          }).join('') + '</ul></div>';
    }
    function pickLiquid(i) {
      $$('.lx-tab', tabs).forEach(function (b, k) { b.setAttribute('aria-selected', String(k === i)); });
      if (reduced) { renderLiquid(i); return; }
      panel.classList.add('is-swap');
      setTimeout(function () { renderLiquid(i); panel.classList.remove('is-swap'); }, 260);
    }
    renderLiquid(0);
  }
  fill('[data-art="mixbox"]', svg('-60 -70 120 140', g(-30, 30, 0.5, A.liquidIcon('rahm')) + g(2, 18, 0.5, A.liquidIcon('tomate')) + g(32, 32, 0.5, A.liquidIcon('kokos')) + g(0, -36, 1, flame(0.42))));

  /* ------------------------------------------------------------------
     4 · Eine Zutat, vier Länder
     ------------------------------------------------------------------ */
  var P = A.parts;
  /* ---- Spiesse: jeder so gezeichnet, wie er im echten Leben aussieht ---- */
  function n(v) { return Math.round(v * 10) / 10; }
  function pth(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function ln(x1, y1, x2, y2, col, w, extra) { return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra ? ' ' + extra : '') + '/>'; }
  function dot(x, y, r, fill, extra) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function ell(x, y, rx, ry, fill, extra) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function box(x, y, w, h, rx, fill, extra) { return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + rx + '" fill="' + fill + '"' + (extra ? ' ' + extra : '') + '/>'; }
  function dish(x, y, r, sauce, inner) {
    return g(x, y, 1, dot(5, 7, r + 2, '#261f1f', 'opacity=".14"') + dot(0, 0, r, '#fffdf8', 'stroke="#e4dacb" stroke-width="3"') + dot(0, 0, r - 7, sauce) + (inner || '') +
      ell(-r * 0.3, -r * 0.38, r * 0.3, r * 0.1, '#fff', 'opacity=".4"'));
  }
  function bamboo(x1, x2, w) { return ln(x1, 0, x2, 0, '#c99d5c', w + 2) + ln(x1, 0, x2, 0, '#e2c088', w) + ln(x1 + 4, -w * 0.2, x2 - 4, -w * 0.2, '#f3dcae', 1.4); }
  function coriander(x, y, s) { return g(x, y, s, ln(0, 0, 0, 12, '#5d9a42', 1.6) + dot(-5, -2, 5, '#4c9a3a') + dot(5, -2, 5, '#4c9a3a') + dot(0, -7, 5.5, '#5aa846')); }
  function lemonWedge(x, y, rot) {
    return g(x, y, 1, pth('M0 0L40 -14A42 42 0 0 1 36 22Z', '#f2c63a') + pth('M5 0L38 -10A37 37 0 0 1 34 18Z', '#fdf3c4') + pth('M9 0L36 -7A33 33 0 0 1 32 15Z', '#f7df72') +
      ln(9, 0, 34, -2, '#fdf3c4', 1.5) + ln(9, 0, 30, 9, '#fdf3c4', 1.5), rot);
  }

  /* Indien · Tandoori: grosse, rot-orange marinierte Stücke mit Röststellen am Metallspiess,
     dazwischen rote Zwiebel und Peperoni; dazu Zwiebelringe, Zitrone, Koriander, Minz-Chutney */
  function tikka(r) {
    var d = 'M-20 -13C-12 -22 9 -22 19 -14C25 -7 24 8 18 15C10 22 -10 22 -19 15C-25 8 -25 -6 -20 -13Z', out = pth(d, '#8e2412', 'transform="translate(0 5)"') + pth(d, '#d4452a') + ell(-6, -8, 11, 5, '#ee7b4c', 'opacity=".75"');
    for (var i = 0; i < 7; i++) out += dot(r() * 32 - 16, r() * 26 - 13, 1 + r() * 1.3, '#f8c8a2', 'opacity=".75"');
    return out + pth('M-20 -13C-15 -18 -10 -20 -4 -20L-9 -12L-17 -6Z', '#35120a', 'opacity=".85"') + pth('M18 15C13 19 8 21 2 21L7 13Z', '#35120a', 'opacity=".8"') + pth('M19 -14C22 -10 24 -5 24 0L17 -3Z', '#4a1a0c', 'opacity=".7"');
  }
  function redOnion() { return pth('M-17 10C-13 -9 13 -9 17 10L10 10C8 -1 -8 -1 -10 10Z', '#8e2f6e') + pth('M-13.5 9C-10 -4 10 -4 13.5 9', 'none', 'stroke="#f0d6e6" stroke-width="2"'); }
  function capsicum() { return box(-14, -12, 28, 28, 6, '#2f6a28') + box(-14, -15, 28, 27, 6, '#4f9a3c') + box(-9, -11, 10, 5, 2.5, '#fff', 'opacity=".3"'); }
  function metalSkewer(r) {
    var s = '<circle cx="-178" cy="0" r="9" fill="none" stroke="#8d939d" stroke-width="4.5"/>' + ln(-170, 0, 166, 0, '#8d939d', 5) + ln(-168, -1.5, 164, -1.5, '#eef1f5', 1.5);
    ['m', 'o', 'm', 'p', 'm', 'o', 'm'].forEach(function (k, i) { s += g(-114 + i * 38, 0, 1, k === 'm' ? tikka(r) : k === 'o' ? redOnion() : capsicum(), k === 'm' ? n((r() - 0.5) * 30) : 0); });
    return s;
  }
  function tandooriArt() {
    var r = A.rnd(12), rings = '';
    [[0, 0, 17], [14, 8, 14], [-10, 12, 12]].forEach(function (o) { rings += dot(o[0], o[1], o[2], 'none', 'stroke="#9b3a7d" stroke-width="5"') + dot(o[0], o[1], o[2], 'none', 'stroke="#f3dcea" stroke-width="1.6"'); });
    return plateWith(dish(-104, -100, 30, '#5aa040', ell(-4, 2, 12, 6, '#8fcf6a', 'opacity=".7"')) + g(96, -112, 1, rings) + lemonWedge(-74, 112, 12) +
      g(-2, -44, 1, metalSkewer(r), -12) + g(6, 52, 1, metalSkewer(r), -12) +
      coriander(-60, -112, 1) + coriander(40, 112, 0.9) + coriander(-100, 40, 0.8) + coriander(118, -40, 0.9));
  }

  /* China · Peking: glänzend lackierte, dunkelrote Stücke am Bambusspiess mit Sesam und
     Frühlingszwiebeln; dazu Hoisin-Sauce, Gurken- und Frühlingszwiebelstreifen */
  function lacquered(r) {
    var w = 34 + r() * 6, h = 28 + r() * 4, s = '';
    for (var i = 0; i < 4; i++) { var sx = n(r() * w * 0.7 - w * 0.35), sy = n(r() * h * 0.6 - h * 0.3); s += ell(sx, sy, 2.6, 1.4, '#fff4dc', 'transform="rotate(' + n(r() * 180) + ' ' + sx + ' ' + sy + ')"'); }
    return box(-w / 2, -h / 2 + 5, w, h, 11, '#4e180b') + box(-w / 2, -h / 2, w, h, 11, '#8f2f17') + box(-w / 2 + 4, -h / 2 + 3, w - 8, h * 0.45, 8, '#b4492a', 'opacity=".75"') +
      ell(-w * 0.16, -h * 0.24, w * 0.24, 3.2, '#fff', 'opacity=".8"') + dot(w * 0.26, -h * 0.14, 2.3, '#fff', 'opacity=".85"') + s;
  }
  function pekingSkewer(r) {
    var s = bamboo(-176, 150, 5) + ln(-176, 0, -150, 0, '#a77c42', 7);
    for (var i = 0; i < 5; i++) s += g(-92 + i * 40, 0, 1, lacquered(r), n((r() - 0.5) * 16));
    return s;
  }
  function pekingArt() {
    var r = A.rnd(21), sprinkle = '', q = A.rnd(5), baton = function (x, y, rot, a, b) { return g(x, y, 1, box(-30, -5, 60, 10, 4, a) + box(-28, -2.5, 56, 4.5, 2, b), rot); };
    for (var i = 0; i < 16; i++) sprinkle += dot(q() * 230 - 100, q() * 190 - 95, 4.5, 'none', 'stroke="#5fae4a" stroke-width="2.6"');
    for (var j = 0; j < 30; j++) { var ex = n(q() * 240 - 110), ey = n(q() * 200 - 100); sprinkle += ell(ex, ey, 2.6, 1.4, '#fff4dc', 'transform="rotate(' + n(q() * 180) + ' ' + ex + ' ' + ey + ')"'); }
    return plateWith(dish(96, -98, 32, '#3b1a12', ell(-6, 4, 2.6, 1.4, '#fff4dc') + ell(6, -4, 2.6, 1.4, '#fff4dc') + ell(2, 10, 2.6, 1.4, '#fff4dc')) +
      baton(-110, 96, 60, '#3f7d34', '#cfe6a8') + baton(-96, 104, 66, '#3f7d34', '#cfe6a8') + baton(-124, 92, 54, '#7cbf5e', '#eef6dc') +
      g(-8, -62, 1, pekingSkewer(r), -18) + g(0, 0, 1, pekingSkewer(r), -18) + g(8, 62, 1, pekingSkewer(r), -18) + sprinkle);
  }

  /* Mekong · Satay: viele dünne Bambusstäbchen mit flachen, gelben Fleischstreifen (Kurkuma),
     aufgefächert auf einem Bananenblatt; dazu Erdnusssauce, Gurke und rote Zwiebel */
  function satayStrip(r) {
    var top = 'M0 -6', bot = '', chars = '', k, w = 17;
    for (k = 0; k < 6; k++) top += 'q' + n(w / 2) + ' ' + (k % 2 ? 5 : -7) + ' ' + w + ' 0';
    top += 'l2 6l-2 6';
    for (k = 0; k < 6; k++) top += 'q' + n(-w / 2) + ' ' + (k % 2 ? -5 : 7) + ' ' + (-w) + ' 0';
    top += 'l-2 -6Z';
    for (k = 1; k < 6; k++) chars += ln(k * w - 2, -7, k * w + 2, 7, '#5a2e0e', 3.2, 'opacity=".55"');
    return pth(top, '#a8661a', 'transform="translate(0 4)"') + pth(top, '#e3a32e') + ln(6, -3, w * 6 - 8, -4, '#f6cf6e', 2.4, 'opacity=".8"') + chars + dot(30 + r() * 40, 2, 1.6, '#7a3f12', 'opacity=".5"');
  }
  function satayArt() {
    var r = A.rnd(31), fan = '', veins = '', cuc = function (x, y, s) { return g(x, y, s, dot(0, 0, 15, '#3f7d34') + dot(0, 0, 12.5, '#d8ecb4') + dot(0, 0, 6, '#c2dc94') + dot(-3, -2, 1.3, '#f4f8e6') + dot(3, -1, 1.3, '#f4f8e6') + dot(0, 3, 1.3, '#f4f8e6')); };
    for (var v = -120; v <= 120; v += 30) veins += ln(v, 0, v + 26, -46, '#5aa64c', 2.2) + ln(v, 0, v + 26, 46, '#5aa64c', 2.2);
    var leaf = g(-14, 6, 1, pth('M-170 0C-90 -78 90 -78 170 0C90 78 -90 78 -170 0Z', '#3f8a3a') + veins + ln(-168, 0, 168, 0, '#8cc46a', 3.5), -36);
    [-12, -24, -36, -48, -60].forEach(function (a) {
      fan += g(-150, 112, 1, ln(0, 0, 268, 0, '#c99d5c', 4.5) + ln(0, 0, 268, 0, '#e2c088', 2.8) + g(140, 0, 1, satayStrip(r)), a);
    });
    var peanut = '';
    for (var i = 0; i < 12; i++) peanut += dot(r() * 34 - 17, r() * 34 - 17, 1.6 + r() * 1.6, i % 3 ? '#7a4520' : '#d39a56');
    peanut += dot(-6, 6, 3, '#c23b22', 'opacity=".8"') + dot(8, -2, 2.4, '#c23b22', 'opacity=".8"');
    return plateWith(leaf + fan + dish(100, -100, 34, '#a8692e', peanut) + cuc(-116, -50, 1) + cuc(-96, -72, 1) + cuc(-132, -24, 0.95) +
      g(-74, -100, 1, redOnion(), 20) + g(-140, 10, 0.8, redOnion(), -30));
  }

  /* Japan · Yakitori: kleine, glänzende Stücke im Wechsel mit Lauch (Negima) am flachen
     Bambusspiess, mit Tare-Sauce; auf einem rechteckigen Teller, mit Shichimi bestreut */
  function yakiMeat(r) {
    var w = 28 + r() * 4, h = 26 + r() * 3;
    return box(-w / 2, -h / 2 + 4, w, h, 9, '#4e2209') + box(-w / 2, -h / 2, w, h, 9, '#82411a') + box(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.42, 7, '#a65a26', 'opacity=".8"') +
      ell(-w * 0.12, -h * 0.24, w * 0.22, 2.6, '#fff', 'opacity=".75"') + dot(-w * 0.3, h * 0.25, 3, '#2a1206', 'opacity=".6"') + dot(w * 0.28, h * 0.1, 2.2, '#2a1206', 'opacity=".5"');
  }
  function negi() {
    return box(-11, -13, 22, 30, 7, '#c9c3a0') + box(-11, -15, 22, 30, 7, '#f3efdb') + box(-11, -15, 22, 10, 6, '#b9d67e') + box(-11, -9, 22, 4, 0, '#b9d67e') +
      ln(-6, -10, -6, 12, '#ffffff', 1.6, 'opacity=".7"') + ell(4, 6, 5, 3, '#6b4a22', 'opacity=".55"');
  }
  function yakiSkewer(r) {
    var s = box(-168, -7, 28, 14, 3, '#d8b878') + box(-144, -4, 290, 8, 3, '#e6c992') + ln(-142, -1.5, 140, -1.5, '#f6e2b8', 1.2);
    ['m', 'n', 'm', 'n', 'm', 'n', 'm'].forEach(function (k, i) { s += g(-92 + i * 37, 0, 1.3, k === 'm' ? yakiMeat(r) : negi()); });
    return s;
  }
  function yakitoriArt() {
    var r = A.rnd(41), q = A.rnd(9), shichimi = '';
    for (var i = 0; i < 40; i++) shichimi += dot(q() * 220 - 90, q() * 180 - 90, 1.4 + q(), ['#c8321e', '#e07a1e', '#261f1f', '#c8321e'][i % 4]);
    var plate = box(-197, -110, 410, 244, 22, '#261f1f', 'opacity=".14"') + box(-205, -122, 410, 244, 22, '#f6f0e2') + box(-205, -122, 410, 244, 22, 'none', 'stroke="#34507e" stroke-width="10"') +
      box(-188, -105, 376, 210, 14, 'none', 'stroke="#e4dacb" stroke-width="2"');
    return g(0, 0, 1, plate + g(10, -66, 1, yakiSkewer(r), -4) + g(10, 0, 1, yakiSkewer(r), -4) + g(10, 66, 1, yakiSkewer(r), -4) + shichimi + lemonWedge(150, -92, 40), -6);
  }
  function noodles(base, dark, seed) {
    var id = A.uid('nd'), r = A.rnd(seed), s = '<defs><clipPath id="' + id + '"><circle r="116"/></clipPath></defs><g clip-path="url(#' + id + ')">';
    for (var i = 0; i < 34; i++) {
      var x = r() * 260 - 130, y = r() * 260 - 130, rot = r() * 180, len = 3 + Math.floor(r() * 3), d = 'M0 0';
      for (var k = 0; k < len; k++) d += 'q14 ' + (k % 2 ? 12 : -12) + ' 28 0';
      s += '<path d="' + d + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot.toFixed(0) + ')" fill="none" stroke="' + (i % 4 ? base : dark) + '" stroke-width="8" stroke-linecap="round"/>';
    }
    return s + '</g>';
  }
  function plateWith(inner) { return A.plate({ part: 'base' }) + inner; }
  var EX = {
    grill: [
      { land: 'Indien', dish: 'Tandoori-Spiess', spice: 'Tandoori', color: '#c0482a', bg: '#fbe0bf', art: tandooriArt() },
      { land: 'China', dish: 'Peking-Spiess', spice: 'Peking', color: '#a5462b', bg: '#efe0f1', art: pekingArt() },
      { land: 'Mekong', dish: 'Satay-Spiess', spice: 'Mekong', color: '#b9853f', bg: '#d6efe4', art: satayArt() },
      { land: 'Japan', dish: 'Yakitori-Spiess', spice: 'Yakitori', color: '#7a4a2a', bg: '#f6e3d3', art: yakitoriArt() }
    ],
    sauce: [
      { land: 'Mekong', dish: 'Bami Goreng', liq: 'Soja', spice: 'Mekong', color: '#b9853f', bg: '#d6efe4', art: plateWith(noodles('#d2a04e', '#a8692e', 11) +
          '<path d="M30 -60C60 -80 90 -50 74 -24C60 0 20 -10 18 -34C16 -48 22 -54 30 -60Z" fill="#fffdf6"/><circle cx="46" cy="-40" r="14" fill="#f6b43a"/>' +
          '<path d="M-80 30L-30 50M-70 60L-24 70M-90 0L-50 18" stroke="#4f9a3c" stroke-width="8" stroke-linecap="round"/>' + g(-20, -70, 1, '<circle r="7" fill="none" stroke="#d63a2a" stroke-width="3"/>') + g(10, 60, 1, '<circle r="7" fill="none" stroke="#d63a2a" stroke-width="3"/>')) },
      { land: 'China', dish: 'Nudeln aus dem Wok', liq: 'Soja', spice: 'Peking', color: '#a5462b', bg: '#efe0f1', art: plateWith(noodles('#e0b866', '#9c5a24', 21) + g(-50, -40, 1, P.broccoli()) + g(46, 40, 1, P.broccoli()) +
          '<rect x="20" y="-60" width="46" height="10" rx="5" fill="#f08a24" transform="rotate(30 43 -55)"/><rect x="-80" y="30" width="46" height="10" rx="5" fill="#f08a24" transform="rotate(-20 -57 35)"/>' +
          g(-6, 6, 1, '<circle r="5" fill="none" stroke="#5fae4a" stroke-width="3"/>') + g(30, -10, 1, '<circle r="5" fill="none" stroke="#5fae4a" stroke-width="3"/>')) },
      { land: 'Italien', dish: 'Pasta Verdura', liq: 'Tomate', spice: 'Pizza & Pasta', color: '#7d8a3c', bg: '#fbe0bf', art: plateWith(noodles('#f2d48a', '#e2b860', 31) +
          '<circle cx="-20" cy="-10" r="40" fill="#d6452b" opacity=".85"/><circle cx="30" cy="30" r="28" fill="#d6452b" opacity=".75"/>' +
          g(50, -50, 1, P.zucchini()) + g(-60, 50, 1, P.zucchini()) + g(10, 70, 1, P.tomato()) + g(-70, -40, 1, P.tomato()) +
          '<path d="M60 10Q80 0 92 14Q76 24 60 10Z" fill="#3f8a3a"/><path d="M-30 -70Q-10 -84 4 -70Q-14 -58 -30 -70Z" fill="#3f8a3a"/>') },
      { land: 'Schweiz', dish: 'Nudelgratin', liq: 'Rahm', spice: 'Helvetica', color: '#b9ae78', bg: '#dcecf6', art: '<ellipse cx="14" cy="24" rx="226" ry="176" fill="#261f1f" opacity=".14"/>' +
          '<ellipse cx="0" cy="0" rx="226" ry="168" fill="#c9612e"/><ellipse cx="0" cy="-6" rx="200" ry="144" fill="#a84a22"/><ellipse cx="0" cy="-6" rx="186" ry="132" fill="#ecb84e"/>' +
          (function () { var r = A.rnd(8), s = ''; for (var i = 0; i < 26; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()); s += '<ellipse cx="' + (Math.cos(a) * d * 160).toFixed(1) + '" cy="' + (Math.sin(a) * d * 110 - 6).toFixed(1) + '" rx="' + (10 + r() * 14).toFixed(1) + '" ry="' + (6 + r() * 8).toFixed(1) + '" fill="#c4782a" opacity="' + (0.4 + r() * 0.5).toFixed(2) + '"/>'; } return s; })() +
          '<path d="M-150 -60q10 -10 20 0M-120 70q10 -10 20 0M90 -80q10 -10 20 0M130 40q10 -10 20 0" fill="none" stroke="#f6dc8e" stroke-width="7" stroke-linecap="round"/>' +
          '<circle cx="-40" cy="-30" r="5" fill="#4c8a3c"/><circle cx="20" cy="20" r="5" fill="#4c8a3c"/><circle cx="70" cy="-20" r="5" fill="#4c8a3c"/><circle cx="-80" cy="40" r="5" fill="#4c8a3c"/>' }
    ]
  };
  var exGrid = $('.ex-grid');
  if (exGrid) {
    var exBtns = $$('.ex-toggle button');
    fill('[data-ico="grill"]', svg('-60 -70 120 130', flame(1)));
    fill('[data-ico="sauce"]', svg('-56 -56 112 112', A.liquidIcon('sauce', '#e8a24a')));
    function renderEx(key) {
      exBtns.forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-ex') === key)); });
      exGrid.innerHTML = EX[key].map(function (e, i) {
        /* Teller etwas kleiner nach links oben, rechts davor das Gewürzglas */
        var art = g(-42, -22, 0.82, e.art) + '<ellipse cx="166" cy="200" rx="50" ry="11" fill="#261f1f" opacity=".16"/>' + g(166, 78, 0.8, jar(e.spice, e.color, e.liq ? '#f1e2c4' : '#e0a95e'));
        return '<figure class="ex-card" style="--i:' + i + '; --bgc:' + e.bg + '"><div class="ex-card__art">' + svg('-235 -235 470 470', art) + '</div>' +
          '<figcaption><small>' + e.land + '</small><b>' + e.dish + '</b><span class="ex-card__with">mit ' + (e.liq ? e.liq + ' und ' : '') + '<strong>Redline ' + e.spice + '</strong></span></figcaption></figure>';
      }).join('');
    }
    exBtns.forEach(function (b) { b.addEventListener('click', function () { renderEx(b.getAttribute('data-ex')); }); });
    renderEx('grill');
  }

  /* ------------------------------------------------------------------
     5 · Rechner: Wie viel Gewürz?
     ------------------------------------------------------------------ */
  var calc = $('.calc');
  if (calc) {
    var SP = [
      { name: 'Helvetica', per: 10, color: '#b9ae78', src: 'laut Etikett' },
      { name: 'Mekong', per: 30, color: '#b9853f', src: 'zum Marinieren' },
      { name: 'Kentucky BBQ', per: 30, color: '#7b4a2c', src: 'zum Marinieren' }
    ];
    var cs = { s: 0, food: 600, liq: 300 }, shown = 9;
    var spBox = $('.calc__spices', calc), rf = $('#food', calc), rl = $('#liq', calc);
    var oF = $('[for="food"] output', calc), oL = $('[for="liq"] output', calc), out = $('[data-out]', calc), outJar = $('[data-out-jar]', calc), outTot = $('[data-out-total]', calc);
    SP.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.style.setProperty('--dot', s.color);
      b.innerHTML = '<i></i>' + s.name + ' <small>' + s.per + ' g/kg</small>';
      b.addEventListener('click', function () { cs.s = i; update(); });
      spBox.appendChild(b);
    });
    function tween(to) {
      if (reduced) { shown = to; out.textContent = to; return; }
      var from = shown, t0 = performance.now();
      (function step(t) {
        var p = Math.min(1, (t - t0) / 350), v = from + (to - from) * (1 - Math.pow(1 - p, 3));
        out.textContent = Math.round(v); if (p < 1) requestAnimationFrame(step); else shown = to;
      })(t0);
    }
    function update() {
      cs.food = +rf.value; cs.liq = +rl.value;
      var s = SP[cs.s], total = cs.food + cs.liq, grams = Math.round(total / 1000 * s.per);
      oF.textContent = cs.food + ' g'; oL.textContent = cs.liq + ' ml';
      outTot.textContent = 'Gesamtgewicht ' + total + ' g × ' + s.per + ' g pro Kilo';
      $('[data-out-name]', calc).textContent = 'Redline ' + s.name;
      outJar.innerHTML = A.jarSvg({ name: s.name, spice: s.color });
      $$('button', spBox).forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === cs.s)); });
      tween(grams);
    }
    rf.addEventListener('input', update); rl.addEventListener('input', update);
    update();
  }

  /* ------------------------------------------------------------------
     7 · Vorrat: das Regal
     ------------------------------------------------------------------ */
  var shelf = $('[data-art="shelf"]');
  if (shelf) {
    function board(y) { return '<rect x="20" y="' + y + '" width="1160" height="22" rx="6" fill="#b5763d"/><rect x="20" y="' + (y + 22) + '" width="1160" height="8" fill="#8f5a2c"/>'; }
    function bottle(x, y, col, label) { return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-6 -150L6 -150L6 -116C6 -104 22 -98 22 -78L22 -6Q22 0 16 0L-16 0Q-22 0 -22 -6L-22 -78C-22 -98 -6 -104 -6 -116Z" fill="' + col + '"/><rect x="-7" y="-160" width="14" height="12" rx="3" fill="#7a2a1a"/><rect x="-18" y="-70" width="36" height="34" rx="4" fill="#fffdf8"/><text x="0" y="-48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="800" fill="#7a2a1a">' + label + '</text></g>'; }
    function sack(x, y, col, label) { return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-42 0L-46 -96Q-40 -112 -26 -106L26 -106Q40 -112 46 -96L42 0Z" fill="' + col + '"/><path d="M-30 -106Q0 -122 30 -106" fill="none" stroke="#8a6a4a" stroke-width="4"/><rect x="-30" y="-74" width="60" height="34" rx="6" fill="#fffdf8"/><text x="0" y="-52" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#261f1f">' + label + '</text></g>'; }
    function glass(x, y, fillc, label) { return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-34" y="-118" width="68" height="118" rx="12" fill="#e9f2f2" stroke="#c9d6d6" stroke-width="3"/><rect x="-30" y="-92" width="60" height="88" rx="9" fill="' + fillc + '"/><rect x="-38" y="-130" width="76" height="16" rx="5" fill="#9b6a3e"/><rect x="-28" y="-56" width="56" height="24" rx="5" fill="#fffdf8"/><text x="0" y="-39" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#261f1f">' + label + '</text></g>'; }
    /* Jedes Teil gehört zu einer Karte darunter (data-cat), fürs Hervorheben beim Hovern */
    function it(cat, inner) { return '<g class="it" data-cat="' + cat + '">' + inner + '</g>'; }
    function pastaFill() { var s = ''; for (var i = 0; i < 9; i++) s += '<path d="M' + (-24 + (i % 3) * 18) + ' ' + (-86 + Math.floor(i / 3) * 11) + 'l8 -6l8 6l-8 6z" fill="#f2d48a" stroke="#e0b860" stroke-width="1.5"/>'; return s; }
    var art = '<rect width="1200" height="560" fill="#f3dcc0"/>' +
      board(196) + board(386) + board(530) +
      /* oben: Kochflüssigkeiten */
      it('fluessig', g(110, 140, 1.2, A.liquidIcon('rahm'))) + it('fluessig', g(240, 146, 1.15, A.liquidIcon('tomate'))) + it('fluessig', g(370, 162, 1.2, A.liquidIcon('kokos'))) + it('fluessig', g(490, 146, 1.2, A.liquidIcon('soja'))) +
      it('basis', bottle(610, 196, '#6b1f2a', 'ROT')) + it('basis', bottle(680, 196, '#d9cf8a', 'WEISS')) +
      it('fluessig', '<g transform="translate(820 196)"><rect x="-40" y="-90" width="80" height="90" rx="6" fill="#c9ccd0"/><rect x="-40" y="-70" width="80" height="50" fill="#d6452b"/><circle cx="0" cy="-45" r="16" fill="#e0402a"/><rect x="-44" y="-96" width="88" height="10" rx="4" fill="#aeb2b8"/><text x="0" y="-8" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#261f1f">PELATI</text></g>') +
      it('gewuerze', g(965, 196, 0.56, '<g transform="translate(-60 -300)">' + A.jar({ name: 'Helvetica', spice: '#b9ae78' }) + '</g>')) +
      it('gewuerze', g(1055, 196, 0.56, '<g transform="translate(-60 -300)">' + A.jar({ name: '1 für Alles', spice: '#9c8c5a' }) + '</g>')) +
      /* Mitte: Beilagen */
      it('beilagen', sack(130, 386, '#efe2c8', 'REIS')) + it('beilagen', glass(260, 386, '#f7ead0', 'PASTA').replace('</g>', pastaFill() + '</g>')) +
      it('beilagen', sack(390, 386, '#f6d36b', 'POLENTA')) + it('basis', sack(520, 386, '#e9d7b8', 'MEHL')) + it('basis', glass(640, 386, '#fffaf0', 'ZUCKER')) +
      it('beilagen', '<g transform="translate(800 386)"><path d="M-70 0L-80 -60Q-80 -70 -70 -70L70 -70Q80 -70 80 -60L70 0Z" fill="#a8763e"/><path d="M-76 -40L76 -40M-72 -20L72 -20" stroke="#8a5f30" stroke-width="3"/>' +
        [[-46, -82], [-14, -88], [18, -84], [50, -80], [-30, -100], [6, -104], [36, -100]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="22" ry="16" fill="#c8a06a"/><circle cx="' + (p[0] - 6) + '" cy="' + (p[1] - 4) + '" r="2" fill="#8a6a3a"/>'; }).join('') + '<text x="0" y="-14" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#fffaf3">KARTOFFELN</text></g>') +
      it('basis', glass(960, 386, '#8a6a4a', 'PILZE')) + it('basis', bottle(1070, 386, '#c9b04a', 'ÖL').replace('#7a2a1a"/>', '#4a3a1a"/>')) +
      /* unten: frisch */
      it('frisch', [[90, '#c98a4a'], [140, '#b07a3a'], [190, '#c98a4a']].map(function (o) { return '<g transform="translate(' + o[0] + ' 530)"><path d="M0 -6C-30 -6 -30 -50 0 -62C30 -50 30 -6 0 -6Z" fill="' + o[1] + '"/><path d="M0 -62L0 -76" stroke="#7a5a2a" stroke-width="3"/></g>'; }).join('')) +
      it('frisch', [[270, 530], [310, 530]].map(function (o) { return '<g transform="translate(' + o[0] + ' ' + o[1] + ')"><path d="M0 -4C-24 -4 -26 -40 0 -50C26 -40 24 -4 0 -4Z" fill="#f6f1e6" stroke="#d9cfbd" stroke-width="3"/><path d="M0 -44V-6M-10 -34C-12 -20 -8 -10 -2 -6M10 -34C12 -20 8 -10 2 -6" fill="none" stroke="#d9cfbd" stroke-width="2"/></g>'; }).join('')) +
      it('frisch', '<g transform="translate(450 530)"><rect x="-90" y="-36" width="180" height="36" rx="6" fill="#d9c4a0"/>' + [-62, -20, 22, 64].map(function (x) { return '<ellipse cx="' + x + '" cy="-44" rx="18" ry="22" fill="#fbf3e4" stroke="#e8d9bf" stroke-width="2"/>'; }).join('') + '</g>') +
      it('frisch', [[620, 530, -10], [660, 530, 8], [700, 530, -4]].map(function (c) { return '<g transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ')"><path d="M-10 -8L0 -96L10 -8Z" fill="#f08a24"/><path d="M0 -96L-8 -116M0 -96L4 -118M0 -96L10 -112" stroke="#4f9a3c" stroke-width="4" stroke-linecap="round"/></g>'; }).join('')) +
      it('frisch', '<g transform="translate(830 530)"><rect x="-60" y="-50" width="120" height="50" rx="8" fill="#f6c445"/><rect x="-60" y="-50" width="120" height="14" rx="6" fill="#e0a92e"/><circle cx="-24" cy="-22" r="7" fill="#e0a92e"/><circle cx="18" cy="-14" r="5" fill="#e0a92e"/><text x="0" y="-60" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#261f1f">KÄSE</text></g>') +
      it('frisch', '<g transform="translate(980 530)"><rect x="-50" y="-34" width="100" height="34" rx="6" fill="#fff6c8" stroke="#e8d98a" stroke-width="3"/><text x="0" y="-12" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="800" fill="#261f1f">BUTTER</text></g>') +
      it('frisch', g(1100, 510, 1.2, P.broccoli()));
    shelf.innerHTML = '<svg viewBox="0 0 1200 560" role="img" aria-label="Ein Vorratsregal mit Kochflüssigkeiten, Beilagen, Grundzutaten und frischen Zutaten">' + art + '</svg>';
    /* Hover über eine Karte: passende Vorräte im Regal hervorheben, den Rest abschwächen */
    var items = $$('.it', shelf);
    $$('.pantry > [data-cat]').forEach(function (card) {
      var cat = card.getAttribute('data-cat');
      card.addEventListener('mouseenter', function () {
        shelf.classList.add('is-focus');
        card.classList.add('is-hl');
        items.forEach(function (i) { i.classList.toggle('is-hl', i.getAttribute('data-cat') === cat); });
      });
      card.addEventListener('mouseleave', function () {
        shelf.classList.remove('is-focus');
        card.classList.remove('is-hl');
        items.forEach(function (i) { i.classList.remove('is-hl'); });
      });
    });
  }

  fill('[data-art="go"]', [['Argentinien', '#8a5a34', '#e0a95e'], ['Kentucky BBQ', '#7b4a2c', '#c98b4a'], ['Süd Indien', '#c99a2e', '#f6eedb'], ['1 für Alles', '#9c8c5a', '#f1e2c4'], ['Helvetica', '#b9ae78', '#f1e2c4']].map(function (j) {
    return A.jarSvg({ name: j[0], spice: j[1], dish: j[2], label: 'Redline ' + j[0] });
  }).join(''));
})();
