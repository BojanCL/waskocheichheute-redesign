/* ==========================================================================
   Redline · Startseite · Illustrationen, Kopf und Finder mit dem Teller
   Daten aus waskocheichheute.ch (Anleitung, Kochideen, Rezepte)
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = !reduced && window.gsap ? window.gsap : null;
  if (reduced) document.documentElement.classList.add('no-motion');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ------------------------------------------------------------------
     Daten
     ------------------------------------------------------------------ */
  var LIQ = {
    rahm:   { name: 'Rahm', dot: '#f6ecd9', sauce: '#f1e2c4', world: 'norden', region: 'Kalte Klimazone', where: 'Schweiz, Skandinavien, Nordamerika, Russland', typical: ['Canada', 'Helvetica', '1 für Alles'], title: 'an Rahmsauce', how: 'mit Rahm ablöschen', adj: 'mild und rund' },
    tomate: { name: 'Tomate', dot: '#d6452b', sauce: '#d6452b', world: 'sueden', region: 'Lateinische und afrikanische Länder', where: 'Argentinien, Italien, Spanien, Kongo', typical: ['Argentinien', 'Kongo', 'Spanien'], title: 'an Tomatensauce', how: 'Tomaten dazugeben und köcheln lassen', adj: 'fruchtig' },
    kokos:  { name: 'Kokosmilch', dot: '#fbf6ec', sauce: '#f6eedb', world: 'tropen', region: 'Tropischer Gürtel', where: 'Südostasien, Karibik, Madagaskar', typical: ['Caribbean Curry', 'Süd Indien', 'Mekong'], title: 'in Kokosmilch', how: 'mit Kokosmilch ablöschen', adj: 'cremig' },
    soja:   { name: 'Soja', dot: '#4a2a17', sauce: '#5b3520', world: 'fernost', region: 'Fernost', where: 'China, Korea, Japan', typical: ['Peking', 'Yakitori', 'Korea'], title: 'aus dem Wok mit Soja', how: 'mit Soja und wenig Wasser ablöschen', adj: 'würzig und tief' },
    wasser: { name: 'Wasser', dot: '#9fd3f0', sauce: '#e2c98f', world: null, region: 'Überall auf der Welt', where: 'Von Äthiopien über Italien bis Südafrika', typical: ['Äthiopien', 'Italien', 'South Africa'], title: 'als Eintopf', how: 'mit Wasser aufgiessen und schmoren', adj: 'klar und leicht' }
  };
  var LIQ_ORDER = ['rahm', 'tomate', 'kokos', 'soja', 'wasser'];

  var SPICES = [
    { id: 'helvetica', name: 'Helvetica', color: '#b9ae78', world: 'norden', home: 'rahm', from: 'der Schweiz' },
    { id: 'einsfueralles', name: '1 für Alles', color: '#9c8c5a', world: 'norden', home: 'rahm', from: 'der Schweiz und Italien' },
    { id: 'argentinien', name: 'Argentinien', color: '#8a5a34', world: 'feuer', home: 'tomate', from: 'Argentinien', grill: true },
    { id: 'aethiopien', name: 'Äthiopien', color: '#9a3a1f', world: 'sueden', home: 'wasser', from: 'Äthiopien' },
    { id: 'mekong', name: 'Mekong', color: '#b9853f', world: 'tropen', home: 'kokos', from: 'Kambodscha' },
    { id: 'suedindien', name: 'Süd Indien', color: '#c99a2e', world: 'tropen', home: 'kokos', from: 'Südindien' },
    { id: 'peking', name: 'Peking', color: '#a5462b', world: 'fernost', home: 'soja', from: 'China' },
    { id: 'korea', name: 'Korea', color: '#7a3a2a', world: 'fernost', home: 'soja', from: 'Korea' }
  ];
  function spice(id) { return SPICES.filter(function (s) { return s.id === id; })[0]; }

  var PROT = [
    { id: 'poulet', name: 'Poulet', acc: 'Poulet', food: '#e0a95e', icon: '<path d="M3 12.5c0-3.6 3.2-6 7-5.6 4 .4 7.8 2.3 10.6 4.6.6.5.5 1.3-.2 1.6-3 1.4-6.4 3-9.8 3.6C6.6 17.3 3 15.8 3 12.5z" fill="#261f1f"/><path d="M6.5 14c3 .8 7 0 10.5-1.8" stroke="#fbf6ec" stroke-width="1.3" fill="none" stroke-linecap="round"/>' },
    { id: 'rind', name: 'Rind', acc: 'Rindfleisch', food: '#9a5a35', icon: '<path d="M5 9c3-4 11-4 14 0 2 3 0 8-5 8-3 0-4-2-7-2-3 0-4-3-2-6z" fill="#261f1f"/><circle cx="14" cy="11" r="2.2" fill="#fbf6ec"/>' },
    { id: 'fisch', name: 'Fisch', acc: 'Fisch', food: '#f0d8b8', icon: '<path d="M3 12c4-5 10-5 14 0-4 5-10 5-14 0z" fill="#261f1f"/><path d="M17 12l4-4v8z" fill="#261f1f"/><circle cx="7" cy="11" r="1.2" fill="#fbf6ec"/>' },
    { id: 'gemuese', name: 'Gemüse', acc: 'Gemüse', food: ['#7fb35c', '#f68e10', '#d6452b', '#e8c45a'], icon: '<path d="M12 21c-5-2-7-8-4-12l8 8c-1 2-2 3-4 4z" fill="#261f1f"/><path d="M14 9c1-3 3-5 6-5-1 3-2 5-5 6M14 9c-1-2-1-4 0-6" stroke="#261f1f" stroke-width="1.8" fill="none" stroke-linecap="round"/>' }
  ];
  function prot(id) { return PROT.filter(function (p) { return p.id === id; })[0]; }

  var KOCHIDEE = 'kochidee-mekong.html';
  var DISHES = [
    { p: 'poulet', m: 'sauce', l: 'kokos', s: 'mekong', name: 'Mekong Kokos-Chicken «Golden River»', text: 'Pouletfilet in Kokosmilch und Ingwer, dazu Jasminreis und cremiges Kokos-Karotten-Püree.' },
    { p: 'poulet', m: 'sauce', l: 'kokos', s: 'mekong', name: 'Kokos-Zitronen-Salbei-Chicken', text: 'Poulet mit Kokosmilch und Zitronengras, dazu saisonaler Spargel und Rosenblätter.' },
    { p: 'poulet', m: 'sauce', l: 'rahm', s: 'helvetica', name: 'Geschnetzeltes nach Zürcher Art', text: 'Der Schweizer Klassiker: Poulet in feiner Rahmsauce.' },
    { p: 'poulet', m: 'sauce', l: 'tomate', s: 'aethiopien', name: 'Doro Wot', text: 'Poulet in einer würzigen Sauce aus Zwiebeln, Knoblauch und Tomaten, mit mildem Couscous.' },
    { p: 'poulet', m: 'grill', s: 'argentinien', name: 'Pollo del Sol', text: 'Pouletbrust mit Zitrone und einem Hauch Honig, gegrillt, dazu Paprikareis und Kräuterjoghurt.' },
    { p: 'poulet', m: 'grill', s: 'helvetica', name: 'Poulet-Ragout Helvetica', text: 'Pouletwürfel angebraten, dazu Federkohl und karamellisierte Birnen.' },
    { p: 'poulet', m: 'grill', s: 'peking', name: 'Peking-Spiess', text: 'Poulet am Spiess, mit Redline Peking mariniert und grilliert.' },
    { p: 'rind', m: 'grill', s: 'argentinien', name: 'Entrecôte «Argentino»', text: 'Gegrillt, mit Kräuterbutter, Ofenkartoffeln und fruchtiger Tomatensalsa.' },
    { p: 'rind', m: 'grill', s: 'helvetica', name: 'Rindsplätzli Helvetica', text: 'Zart gebraten, mit Rösti und glasiertem Gemüse.' },
    { p: 'rind', m: 'sauce', l: 'soja', s: 'korea', name: 'Bulgogi Style Beef', text: 'Rindfleischstreifen aus dem Wok, mit Spinat und Wasserkastanien.' },
    { p: 'rind', m: 'sauce', l: 'tomate', s: 'aethiopien', name: 'Rind Äthiopien Twist', text: 'In Tomaten zart geschmortes Rind, mit sautiertem Spargel und karamellisierter Birne.' },
    { p: 'fisch', m: 'sauce', l: 'kokos', s: 'mekong', name: 'Mok Sonnenbarsch «Mekong Breeze»', text: 'Sonnenbarsch mit Thai-Basilikum, dazu Pak Choi und Paprika in feiner Kokosmilch.' },
    { p: 'fisch', m: 'sauce', l: 'kokos', s: 'suedindien', name: 'Kerala-Fischcurry', text: 'Fischfilets kurz anbraten und in Kokos-Curry ziehen lassen, mit Koriander und Ingwer.' },
    { p: 'fisch', m: 'sauce', l: 'soja', s: 'korea', name: 'Koreanischer Fischwok', text: 'Fisch und Gemüse aus dem Wok, in acht Minuten auf dem Tisch.' },
    { p: 'fisch', m: 'grill', s: 'mekong', name: 'Mekong Garnelen «Fishermen’s Feast»', text: 'Garnelen gebraten, auf Kokos-Thai-Basilikum-Püree mit gerösteten Cashews.' },
    { p: 'fisch', m: 'grill', s: 'helvetica', name: 'Felchenfilets Helvetica', text: 'Gebraten, auf Fenchel und Rucola, mit einer leichten Grappa-Butter.' },
    { p: 'fisch', m: 'grill', s: 'argentinien', name: 'Zander a la Chimichurri', text: 'Mit einer Paste aus Redline Argentinien, Petersilie und Knoblauch im Ofen gegart.' },
    { p: 'gemuese', m: 'grill', s: 'mekong', name: 'Kohlrabi-Steak «Mekong Garden»', text: 'Gegrillter Kohlrabi mit Ingwer, Zitronengras und Kokos, dazu Shiitake.' },
    { p: 'gemuese', m: 'grill', s: 'argentinien', name: 'Veggie Parrilla', text: 'Sellerie-Steaks, Peperoni, Auberginen und Mais vom Grill, mit Kartoffelpüree und Kräuterquark.' },
    { p: 'gemuese', m: 'sauce', l: 'tomate', s: 'aethiopien', name: 'Auberginen-Ragout Äthiopien Style', text: 'Auberginen mit Linsen und Kohl in sämiger Tomatensauce, mit Joghurt und Basilikum.' },
    { p: 'gemuese', m: 'sauce', l: 'kokos', s: 'suedindien', name: 'Chana Masala', text: 'Kichererbsen in Süd-Indien-Curry mit Tomaten, Frühlingszwiebeln und Kokosmilch.' },
    { p: 'gemuese', m: 'sauce', l: 'rahm', s: 'helvetica', name: 'Veggie-Geschnetzeltes mit Sellerie', text: 'Sellerie statt Fleisch, in Rahmsauce nach Zürcher Art. VeggieEvolution.' }
  ];

  /* ------------------------------------------------------------------
     Kleine Illustrationen
     ------------------------------------------------------------------ */
  var LIQ_ICON = { rahm: 'rahm', tomate: 'tomate', kokos: 'kokos', soja: 'soja', wasser: 'wasser' };
  function liq(kind, x, y, s, col) {
    return '<g transform="translate(' + (x || 0) + ' ' + (y || 0) + ') scale(' + (s || 1) + ')">' + A.liquidIcon(kind, col) + '</g>';
  }
  function flameIcon(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 50C-40 30 -30 -10 0 -60C30 -10 40 30 0 50Z" fill="#f68e10"/><path d="M0 46C-20 30 -14 6 0 -20C14 6 20 30 0 46Z" fill="#ffd166"/></g>';
  }
  function jarAt(o, x, y, s, rot) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + s + ')"><g transform="translate(-60 -150)">' + A.jar(o) + '</g></g>';
  }
  function globe(id) {
    var r = A.rnd(9), land = '';
    [[-90, -60, 60], [-20, 10, 52], [60, -50, 64], [90, 60, 44], [-70, 80, 40]].forEach(function (b) {
      var pts = [];
      for (var i = 0; i < 9; i++) { var a = i / 9 * Math.PI * 2, rr = b[2] * (0.7 + r() * 0.5); pts.push((b[0] + Math.cos(a) * rr).toFixed(1) + ' ' + (b[1] + Math.sin(a) * rr * 0.8).toFixed(1)); }
      land += '<path d="M' + pts.join('L') + 'Z" fill="#9cc66f" stroke="#7fb35c" stroke-width="5" stroke-linejoin="round"/>';
    });
    return '<defs><clipPath id="' + id + '"><circle r="150"/></clipPath></defs><circle r="150" fill="#5aa9d6"/><g clip-path="url(#' + id + ')">' + land + '</g><circle r="150" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>';
  }

  /* ------------------------------------------------------------------
     Kopf: beim Runterscrollen ausblenden, beim Hochscrollen zeigen; Menü fürs Handy
     ------------------------------------------------------------------ */
  var top = $('.top'), lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY, dy = y - lastY;
    top.classList.toggle('is-solid', y > 20);
    if (Math.abs(dy) < 6) return; /* kleine Zitterbewegungen (Touchpad) ignorieren */
    var keep = y < top.offsetHeight || $('.mnav').classList.contains('is-open') || !!top.querySelector(':focus-visible');
    top.classList.toggle('is-hidden', dy > 0 && !keep);
    lastY = y;
  }, { passive: true });
  var burger = $('.burger'), mnav = $('.mnav');
  burger.addEventListener('click', function () {
    var open = !mnav.classList.contains('is-open');
    mnav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
  });

  /* Einblenden */
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else { $$('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); }); }

  /* Formulare im Entwurf nicht absenden */
  $$('form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); var b = f.querySelector('button'); if (b) { b.textContent = 'Danke!'; b.disabled = true; } }); });

  /* ------------------------------------------------------------------
     1 · Hero
     ------------------------------------------------------------------ */
  fill('[data-art="hero"]',
    '<svg viewBox="-340 -400 700 680" aria-hidden="true">' + A.plate({ raw: true, food: 'mix' }) +
    jarAt({ name: 'Helvetica', spice: '#b9ae78', dish: '#f1e2c4' }, -262, -170, 0.8, -10) +
    jarAt({ name: 'Mekong', spice: '#b9853f', dish: '#f6eedb' }, 250, -230, 0.72, 9) +
    jarAt({ name: 'Argentinien', spice: '#8a5a34', dish: '#e0a95e' }, 268, 120, 0.78, -5) + '</svg>' +
    '<span class="bubble" style="--dot:#f6ecd9; left: 22%; top: 9%;"><i></i>Rahmsauce?</span>' +
    '<span class="bubble" style="--dot:#d6452b; left: 50%; top: 0; animation-delay: -1.5s;"><i></i>Tomatensauce?</span>' +
    '<span class="bubble" style="--dot:#9fd3f0; left: -3%; top: 54%; animation-delay: -2.2s;"><i></i>Wasser?</span>' +
    '<span class="bubble" style="--dot:#fbf6ec; left: 4%; bottom: 8%; animation-delay: -3s;"><i></i>Kokosmilch?</span>' +
    '<span class="bubble" style="--dot:#4a2a17; left: 54%; bottom: 0; animation-delay: -4.5s;"><i></i>Sojasauce?</span>');

  /* ------------------------------------------------------------------
     2 · So funktioniert's
     ------------------------------------------------------------------ */
  fill('[data-art="step-zutat"]', '<svg viewBox="-230 -230 460 460">' + A.plate({ raw: true, food: 'mix' }) + '</svg>');
  fill('[data-art="step-art"]', '<svg viewBox="-150 -80 300 160">' + flameIcon(-92, 0, 1) + '<text x="-22" y="12" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="26" fill="#6b5b52">oder</text>' + liq('sauce', 86, 12, 1.02, '#e8a24a') + '</svg>');
  fill('[data-art="step-fluessig"]', '<svg viewBox="-180 -70 360 130">' + LIQ_ORDER.map(function (k, i) { return liq(k, -144 + i * 72, 4, 0.78); }).join('') + '</svg>');
  fill('[data-art="step-gewuerz"]', '<svg viewBox="-10 -10 140 320">' + A.jar({ name: 'Mekong', spice: '#b9853f', dish: '#f6eedb' }) + '</svg>');
  fill('[data-art="step-gericht"]', '<svg viewBox="-230 -230 460 460">' + A.plate({ sauce: '#f6eedb', world: 'tropen' }) + '</svg>');

  $$('[data-liquid]').forEach(function (el) {
    var k = el.getAttribute('data-liquid'), l = LIQ[k];
    var scene = l.world
      ? '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + A.scene(l.world) + '</svg>'
      : '<svg viewBox="-400 -225 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect x="-400" y="-225" width="800" height="450" fill="#cfe8f5"/><g transform="translate(0 40) scale(1.1)">' + globe('gl-' + k) + '</g></svg>';
    el.querySelector('.lq__scene').innerHTML = scene + '<svg class="lq__drop" viewBox="-60 -60 120 120" aria-hidden="true"><circle r="56" fill="#ffffff"/>' + liq(k, 0, 2, 0.82) + '</svg>';
  });
  fill('[data-art="mix"]', '<svg viewBox="-60 -70 120 140" aria-hidden="true">' + liq('rahm', -32, 30, 0.5) + liq('tomate', 0, 18, 0.5) + liq('kokos', 32, 32, 0.5) + flameIcon(0, -36, 0.42) + '</svg>');

  /* ------------------------------------------------------------------
     3 · Finder mit Teller
     ------------------------------------------------------------------ */
  var finder = $('[data-finder]');
  if (finder) initFinder(finder);

  function initFinder(root) {
    var st = { p: 'poulet', m: 'sauce', l: 'kokos', s: 'mekong' };
    var prev = {};
    var qP = $('[data-q="p"]', root), qM = $('[data-q="m"]', root), qL = $('[data-q="l"]', root), qS = $('[data-q="s"]', root);
    var hint = $('[data-hint]', root), out = $('[data-result]', root), label = $('[data-label]', root);
    var win = $('.window', root);

    /* Landschaften im Fenster */
    var worlds = ['norden', 'sueden', 'tropen', 'fernost', 'feuer'];
    win.insertAdjacentHTML('afterbegin', worlds.map(function (w) {
      return '<svg class="window__scene" data-w="' + w + '" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + A.scene(w) + '</svg>';
    }).join(''));
    var art = $('.window__art', root);

    function opt(label, pressed, onClick, extra) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt';
      b.setAttribute('aria-pressed', String(pressed));
      b.innerHTML = extra.icon + '<span>' + label + '</span>' + (extra.tag ? '<small>' + extra.tag + '</small>' : '');
      if (extra.dot) b.style.setProperty('--dot', extra.dot);
      b.addEventListener('click', onClick);
      return b;
    }
    function opts(q, list) {
      var box = $('.opts', q); box.textContent = '';
      list.forEach(function (b) { box.appendChild(b); });
    }
    function legendNumber(q, n) { $('legend b', q).textContent = n; }

    function renderControls() {
      opts(qP, PROT.map(function (p) {
        return opt(p.name, st.p === p.id, function () { st.p = p.id; update(); }, { icon: '<i><svg viewBox="0 0 24 24" aria-hidden="true">' + p.icon + '</svg></i>' });
      }));
      opts(qM, [
        opt('Braten oder grillieren', st.m === 'grill', function () { st.m = 'grill'; update(); }, { icon: '<i style="background:#ffe2b8"><svg viewBox="-50 -64 100 120" aria-hidden="true">' + flameIcon(0, 0, 0.9) + '</svg></i>' }),
        opt('In einer Sauce', st.m === 'sauce', function () { st.m = 'sauce'; update(); }, { icon: '<i style="background:#fdeedd"><svg viewBox="-56 -56 112 112" aria-hidden="true">' + liq('sauce', 0, 8, 1, '#e8a24a') + '</svg></i>' })
      ]);
      qL.hidden = st.m !== 'sauce';
      opts(qL, LIQ_ORDER.map(function (k) {
        return opt(LIQ[k].name, st.l === k, function () { st.l = k; update(); }, { icon: '<i style="background:#fdeedd"><svg viewBox="-56 -56 112 112" aria-hidden="true">' + liq(k, 0, 4, 0.95) + '</svg></i>' });
      }));
      legendNumber(qS, st.m === 'sauce' ? 4 : 3);
      var list = SPICES.slice().sort(function (a, b) { return typ(b) - typ(a); });
      opts(qS, list.map(function (s) {
        return opt(s.name, st.s === s.id, function () { st.s = s.id; update(); }, { icon: '<i></i>', dot: s.color, tag: typ(s) ? 'typisch' : '' });
      }));
      hint.textContent = st.m === 'sauce'
        ? 'Typisch für ' + LIQ[st.l].name + ' sind die markierten Gewürze. Aber kein Gewürz ist an eine Sauce gebunden: Jede Kombination ergibt ein Gericht.'
        : 'Grilliert wird überall auf der Welt. Darum passt jedes Redline-Gewürz auf den Grill und in die Pfanne.';
    }
    function typ(s) { return st.m === 'sauce' ? (s.home === st.l ? 1 : 0) : (s.grill ? 1 : 0); }

    /* Teller und Glas zeichnen */
    function renderArt() {
      var sp = spice(st.s), pr = prot(st.p), l = LIQ[st.l];
      var grill = st.m === 'grill';
      var plate = A.plate({ sauce: grill ? null : l.sauce, world: sp.world, grill: grill, food: st.p, seed: 77 });
      art.innerHTML =
        '<g class="pour" opacity="0"><g transform="translate(330 120)">' + (grill ? '' : vessel(st.l)) + '</g></g>' +
        '<rect class="stream" x="296" y="128" width="16" height="0" rx="8" fill="' + (grill ? 'none' : l.dot) + '"/>' +
        '<g transform="translate(400 430) scale(1.18)"><g class="plate-g">' + plate + (grill ? A.flameRing() : '') + '</g></g>' +
        '<g class="jar-g">' + jarAt({ name: sp.name, spice: sp.color, dish: grill ? '#e0a95e' : l.sauce }, 760, 470, 1.15, 8) + '</g>';
      $$('.window__scene', root).forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-w') === sp.world); });
      label.innerHTML = 'Aromen aus <b>' + sp.from + '</b>';
      animateArt();
    }
    function vessel(k) {
      if (k === 'wasser') return '<path d="M0 0L-20 6L-26 30L-26 120Q-26 132 -14 132L-74 132Q-86 132 -86 120L-86 30L-92 6L-60 0Z" fill="#dff2fb" stroke="#9fd3f0" stroke-width="3" transform="translate(0 0)"/><rect x="-86" y="60" width="60" height="60" fill="#9fd3f0" opacity=".6"/>';
      return A.vessel(LIQ[k].world);
    }
    function animateArt() {
      if (!gsap) return;
      var changedLiquid = prev.l !== st.l || prev.m !== st.m;
      var changedSpice = prev.s !== st.s;
      var first = !prev.s;
      var sauceG = $('.sauce-g', art), jarG = $('.jar-g', art), gar = $('.gar', art), pour = $('.pour', art), stream = $('.stream', art);
      if (first) return;
      if (changedLiquid && st.m === 'sauce' && sauceG) {
        gsap.set(sauceG, { scale: 0, transformOrigin: '50% 50%' });
        gsap.timeline()
          .fromTo(pour, { opacity: 0, x: -60, y: -30, rotation: 0 }, { opacity: 1, x: 0, y: 0, duration: 0.25, ease: 'power2.out' })
          .to(pour, { rotation: 100, svgOrigin: '330 120', duration: 0.25 })
          .to(stream, { attr: { height: 250 }, duration: 0.12, ease: 'none' }, '-=0.05')
          .to(sauceG, { scale: 1, duration: 0.45, ease: 'power2.out' }, '-=0.02')
          .to(stream, { attr: { y: 378, height: 0 }, duration: 0.12, ease: 'none' }, '-=0.15')
          .to(pour, { opacity: 0, rotation: 0, x: -60, y: -30, duration: 0.25, ease: 'power2.in' }, '-=0.1');
      } else if (changedLiquid && st.m === 'grill') {
        gsap.from($('.plate-g', art), { scale: 0.85, rotation: -40, duration: 0.6, ease: 'back.out(1.6)', transformOrigin: '50% 50%' });
      }
      if (changedSpice || changedLiquid) {
        gsap.fromTo(jarG, { y: -140, rotation: -30, opacity: 0, svgOrigin: '760 470' }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' });
        if (gar) gsap.from(gar, { scale: 0.3, opacity: 0, duration: 0.5, delay: changedLiquid && st.m === 'sauce' ? 0.9 : 0.3, ease: 'back.out(1.8)', transformOrigin: '50% 50%' });
      }
      if (prev.p !== st.p) gsap.from($$('.food > .fd', art), { scale: 0, duration: 0.45, stagger: 0.04, ease: 'back.out(2)', transformOrigin: '50% 50%' });
    }

    /* Ergebnis */
    function renderResult() {
      var sp = spice(st.s), pr = prot(st.p), l = LIQ[st.l], grill = st.m === 'grill';
      var match = DISHES.filter(function (d) { return d.p === st.p && d.s === st.s && d.m === st.m && (grill || d.l === st.l); })[0];
      var kind = grill ? 'Grill und Pfanne' : (sp.home === st.l ? 'Landestypisch' : 'Mischküche');
      var title, text;
      if (match) { title = match.name; text = match.text; }
      else if (grill) {
        title = pr.name + ' vom Grill mit Redline ' + sp.name;
        text = pr.acc + ' mit Redline ' + sp.name + ', etwas Öl und wenig Wasser marinieren, dann auf den Grill oder in die Pfanne. So schmeckt es nach ' + sp.from + '.';
      } else {
        title = pr.name + ' ' + l.title + ' mit Redline ' + sp.name;
        text = pr.acc + ' anbraten, ' + l.how + ' und mit Redline ' + sp.name + ' würzen. ' +
          (sp.home === st.l ? 'So schmeckt es wie in ' + sp.from + '.' : 'Typisch wäre ' + LIQ[sp.home].name + ', mit ' + l.name + ' wird es ' + l.adj + ': Mischküche.');
      }
      var more = DISHES.filter(function (d) { return d.s === st.s && d !== match; }).slice(0, 2);
      out.innerHTML =
        '<span class="tag">' + kind + '</span>' +
        '<h3 class="result__title">' + title + '</h3>' +
        '<p class="result__text">' + text + '</p>' +
        '<a class="btn result__cta" href="' + KOCHIDEE + (match ? '#rezept' : '') + '">' + (match ? 'Zum Rezept' : 'Rezepte mit Redline ' + sp.name) + ' ' + ARROW + '</a>' +
        '<div class="result__buy">' +
          '<svg class="result__jar" viewBox="0 0 120 300" aria-hidden="true">' + A.jar({ name: sp.name, spice: sp.color, dish: grill ? '#e0a95e' : l.sauce }) + '</svg>' +
          '<div class="result__buytext"><b>Redline ' + sp.name + '</b><span>Das Gewürz für dieses Gericht · <em>Streuer ab CHF 6.90</em></span></div>' +
          '<a class="btn btn--ghost btn--small" href="https://shop.waskocheichheute.ch/" target="_blank" rel="noopener">Im Shop kaufen</a>' +
        '</div>' +
        (more.length ? '<p class="result__more"><span>Weitere Rezepte mit Redline ' + sp.name + ':</span>' +
          more.map(function (d) { return '<a href="' + KOCHIDEE + '">' + d.name + '</a>'; }).join('') + '</p>' : '');
    }

    function update() {
      renderControls();
      renderArt();
      renderResult();
      prev = { p: st.p, m: st.m, l: st.l, s: st.s };
    }
    update();
  }

  /* ------------------------------------------------------------------
     4 · Mr. Spice
     ------------------------------------------------------------------ */
  fill('[data-art="portrait"]', '<svg viewBox="-200 -200 400 400" aria-hidden="true">' +
    '<circle r="176" fill="none" stroke="#f68e10" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round"/>' +
    '<g transform="translate(0 120) scale(3.4)">' + A.parts.person(0, 0, 1, { shirt: '#2d78c4', apron: '#fffaf3', chef: true, wave: true }) + '</g>' +
    jarAt({ name: 'Helvetica', spice: '#b9ae78', dish: '#f1e2c4' }, 96, 70, 0.48, 10) +
    [['wasser', 180], ['rahm', -140], ['tomate', 0], ['kokos', 135], ['soja', 90]].map(function (d) {
      var a = d[1] * Math.PI / 180, x = Math.cos(a) * 176, y = Math.sin(a) * 176;
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="31" fill="#fffaf3"/>' + liq(d[0], x, y + 2, 0.47);
    }).join('') + '</svg>');

  /* ------------------------------------------------------------------
     5 · Probierset und Sets
     ------------------------------------------------------------------ */
  fill('[data-art="probierset"]', [['Argentinien', '#8a5a34', '#e0a95e'], ['Kentucky BBQ', '#7b4a2c', '#c98b4a'], ['Süd Indien', '#c99a2e', '#f6eedb'], ['1 für Alles', '#9c8c5a', '#f1e2c4'], ['Helvetica', '#b9ae78', '#f1e2c4']].map(function (j) {
    return A.jarSvg({ name: j[0], spice: j[1], dish: j[2], label: 'Redline ' + j[0] });
  }).join(''));
  $$('[data-set]').forEach(function (el) {
    var cols = el.getAttribute('data-set').split(',');
    el.innerHTML = cols.map(function (c) { var p = c.split(':'); return '<svg viewBox="0 0 120 300" aria-hidden="true">' + A.jar({ name: p[0], spice: p[1] }) + '</svg>'; }).join('');
  });

  /* ------------------------------------------------------------------
     6 · Für dich
     ------------------------------------------------------------------ */
  fill('[data-art="veggie"]', '<svg viewBox="-260 -260 520 520" aria-hidden="true">' +
    '<circle r="230" fill="#fffdf8"/><circle r="182" fill="#f4efe7"/>' +
    '<ellipse cx="-10" cy="10" rx="120" ry="104" fill="#e9dcb8"/><ellipse cx="-10" cy="4" rx="112" ry="96" fill="#f1e6c6"/>' +
    [-60, -20, 20, 60].map(function (x) { return '<path d="M' + (x - 30) + ' -60L' + (x + 30) + ' 70" stroke="#6b4426" stroke-width="12" stroke-linecap="round" opacity=".55"/>'; }).join('') +
    '<path d="M60 -150Q120 -190 170 -140Q120 -110 60 -150Z" fill="#4c8a3c"/><path d="M90 -110Q150 -120 180 -70Q120 -60 90 -110Z" fill="#6aa84f"/>' +
    '<circle cx="-150" cy="90" r="22" fill="#d6452b"/><circle cx="-118" cy="120" r="16" fill="#f68e10"/><circle cx="130" cy="120" r="18" fill="#e8c45a"/>' +
    '</svg>');
  fill('[data-art="leicht"]', (function () {
    var rows = [['Wasser', 0, '#9fd3f0', 'wasser'], ['Soja', 13, '#4a2a17', 'soja'], ['Tomate', 40, '#d6452b', 'tomate'], ['Rahm', 90, '#f1e2c4', 'rahm'], ['Kokos', 200, '#fbf6ec', 'kokos']];
    var s = '<svg viewBox="0 0 300 230" aria-hidden="true"><text x="0" y="16" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#6b5b52" letter-spacing="1.5">KCAL PRO 100 ML</text>';
    rows.forEach(function (r, i) {
      var y = 40 + i * 38, w = 8 + r[1] * 0.8;
      s += liq(r[3], 14, y + 12, 0.24) +
        '<text x="34" y="' + (y + 18) + '" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#261f1f">' + r[0] + '</text>' +
        '<rect x="96" y="' + (y + 4) + '" width="' + w + '" height="18" rx="9" fill="' + (r[1] > 80 ? '#eb5737' : '#9d9346') + '"/>' +
        '<text x="' + (104 + w) + '" y="' + (y + 18) + '" font-family="Inter, sans-serif" font-size="13" font-weight="800" fill="#261f1f">' + r[1] + '</text>';
    });
    return s + '</svg>';
  })());
  fill('[data-art="grill"]', '<svg viewBox="-200 -260 400 300" aria-hidden="true"><circle cx="110" cy="-200" r="30" fill="#ffd9a0" opacity=".9"/>' + A.parts.grill(0, 20, 1.4) + '</svg>');
  fill('[data-art="familie"]', '<svg viewBox="-170 -150 340 160" aria-hidden="true">' +
    A.parts.person(-90, 0, 1.6, { shirt: '#f68e10', apron: '#fffaf3', bun: true, skin: '#c9875e' }) +
    A.parts.person(-10, 0, 1.1, { shirt: '#2d78c4', wave: true }) + A.parts.person(55, 0, 1.25, { shirt: '#9d9346' }) +
    jarAt({ name: 'Scharfmacher', spice: '#c0261c', dish: '#d6452b' }, 132, -40, 0.42, 12) + '</svg>');

  /* ------------------------------------------------------------------
     7 · Dranbleiben
     ------------------------------------------------------------------ */
  fill('[data-art="pin"]', '<svg viewBox="0 0 54 54" aria-hidden="true"><path d="M27 44s-11-9.6-11-18a11 11 0 0 1 22 0c0 8.4-11 18-11 18z" fill="#eb5737"/><circle cx="27" cy="26" r="4.5" fill="#fffaf3"/></svg>');
  fill('[data-art="simon"]', '<svg viewBox="-27 -40 54 54" aria-hidden="true">' + A.parts.person(0, 14, 0.62, { shirt: '#261f1f', apron: '#f68e10' }) + '</svg>');

  /* ------------------------------------------------------------------
     Unternavigation «Auf dieser Seite» (Unterseiten): markiert den aktuellen Teil
     ------------------------------------------------------------------ */
  var sub = $('.subnav__list');
  if (sub) {
    var subLinks = $$('a', sub), secs = $$('main section[id]'), active = null;
    var spy = function () {
      var y = window.scrollY + 140, hit = null;
      secs.forEach(function (s) { if (s.getBoundingClientRect().top + window.scrollY <= y) hit = s.id; });
      if (hit === active) return;
      active = hit;
      if (!hit) sub.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' });
      subLinks.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + hit;
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        /* auf dem Handy den aktiven Link in den sichtbaren Bereich schieben */
        if (on && sub.scrollWidth > sub.clientWidth) sub.scrollTo({ left: a.parentNode.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
      });
    };
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', function () { active = undefined; spy(); });
    spy();
  }

  /* Nur für die Werkstatt (index.html): Scrollhöhe melden, damit die Werkstatt-Leiste mitscrollt */
  if (window.parent !== window) {
    var report = function () { window.parent.postMessage({ wsScroll: window.scrollY }, '*'); };
    window.addEventListener('scroll', report, { passive: true });
    window.addEventListener('load', report);
    report();
  }
})();
