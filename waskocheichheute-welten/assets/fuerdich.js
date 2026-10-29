/* ==========================================================================
   Redline · «Für dich» · Illustrationen und Interaktionen
   Inhalte aus waskocheichheute.ch (VeggieEvolution, Abnehmen mit Redline,
   BBQ Vizeweltmeister, Kinder, Schulen). Die Gerichte kommen aus gerichte.js.
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, P = A.parts, G = window.Gerichte, T = G.tools, SPICE = G.SPICE;
  var g = T.g, pth = T.pth, ln = T.ln, dot = T.dot, ell = T.ell, box = T.box, svg = T.svg, n = T.n, rot = T.rot;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }
  function jarAt(name, color, x, y, s, deg) { return g(x, y, s, '<g transform="translate(-60 -150)">' + A.jar({ name: name, spice: color }) + '</g>', deg); }

  /* Kalorien aus «Abnehmen mit Redline»: pro 100 ml und pro Teller Pouletragout */
  var LIGHT = [
    { k: 'wasser', label: 'Wasser', with: 'Mit Wasser', per100: 0, plate: 203, sauce: '#ead9a4' },
    { k: 'soja', label: 'Soja mit Wasser (20:80)', with: 'Mit Soja und Wasser', per100: 13, plate: 216, sauce: '#b98a52' },
    { k: 'tomate', label: 'Tomate', with: 'Mit Tomate', per100: 40, plate: 243, sauce: '#d6452b' },
    { k: 'rahm', label: 'Milch mit Rahm (50:50)', with: 'Mit Milch und Rahm', per100: 90, plate: 293, sauce: '#f1e2c4' },
    { k: 'kokos', label: 'Kokosmilch', with: 'Mit Kokosmilch', per100: 200, plate: 403, sauce: '#f6eedb' }
  ];

  /* ------------------------------------------------------------------
     Rohe Zutaten auf dem Schneidebrett (für «Gemüse wie Fleisch»)
     ------------------------------------------------------------------ */
  function board(inner) {
    var grain = [-40, -14, 12, 38].map(function (y) { return pth('M-74 ' + y + 'C-30 ' + (y - 8) + ' 30 ' + (y + 8) + ' 74 ' + y, 'none', 'stroke="#c48d52" stroke-width="2" opacity=".55"'); }).join('');
    return dot(4, 8, 86, '#261f1f', 'opacity=".14"') + dot(0, 0, 86, '#c9965a') + dot(0, 0, 80, '#e2b47a') + grain + inner;
  }
  var RAW = {
    rind: function () { return g(0, 0, 0.82, P.steak(true, false)); },
    kalb: function () {
      var d = 'M-62 -4C-58 -32 34 -40 60 -16C72 -4 66 18 48 26C16 38 -44 36 -58 18C-64 10 -64 4 -62 -4Z';
      return g(0, 2, 0.95, pth(d, '#c97a74', 'transform="translate(0 4)"') + pth(d, '#eaa9a1') + pth('M-46 -6Q-10 -20 38 -12M-40 14Q0 4 40 12', 'none', 'stroke="#f6d3cc" stroke-width="2.5" opacity=".8" stroke-linecap="round"'));
    },
    schwein: function () {
      var d = 'M-58 -10C-56 -40 30 -46 56 -20C70 -6 64 22 40 32C10 44 -40 40 -54 20C-60 10 -60 0 -58 -10Z';
      return g(0, 2, 0.95, pth(d, '#f8ebe2', 'stroke="#efd9cc" stroke-width="3"') + pth('M-46 -8C-44 -30 26 -34 46 -14C56 -4 52 16 34 24C10 32 -32 30 -44 16C-48 8 -48 0 -46 -8Z', '#efb1a6') +
        pth('M-30 -14C-26 -22 -14 -22 -10 -14L-10 16C-14 22 -26 22 -30 16Z', '#f6ecd9', 'stroke="#e2d4bc" stroke-width="2"'));
    },
    poulet: function () { return g(0, 0, 0.92, P.breast(true, false)); },
    randen: function () {
      var slice = function (x, y, s) { return g(x, y, s, dot(0, 0, 42, '#5e1734') + dot(0, 0, 38, '#9a2456') + dot(0, 0, 28, 'none', 'stroke="#c43d74" stroke-width="3"') + dot(0, 0, 16, 'none', 'stroke="#c43d74" stroke-width="3"') + dot(-10, -12, 6, '#d65a8e', 'opacity=".6"')); };
      return slice(-18, 10, 1) + slice(20, -12, 0.95);
    },
    kohlrabi: function () {
      var slice = function (x, y, s) { return g(x, y, s, dot(0, 0, 42, '#9fbe5c') + dot(0, 0, 37, '#eef2d2') + dot(0, 0, 26, 'none', 'stroke="#dbe5b0" stroke-width="2" stroke-dasharray="3 5"') + ell(-10, -12, 12, 5, '#ffffff', 'opacity=".6"')); };
      return slice(-18, 10, 1) + slice(20, -12, 0.95);
    },
    sellerie: function () {
      var rim = '';
      for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; rim += dot(Math.cos(a) * 46, Math.sin(a) * 45, 8, i % 2 ? '#bfa77a' : '#cdb98e'); }
      return rim + dot(0, 0, 48, '#d9c79c') + dot(0, 0, 42, '#f1e6c8') + dot(0, 0, 28, 'none', 'stroke="#e3d4ac" stroke-width="2"') + ell(-12, -14, 14, 5, '#fbf3dc', 'opacity=".7"');
    },
    rettich: function () {
      var slice = function (x, y) { var s = dot(x, y, 26, '#e2e5d6') + dot(x, y, 23, '#fbfaf3'); for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; s += ln(x, y, x + Math.cos(a) * 18, y + Math.sin(a) * 18, '#ecefe0', 1.5); } return s; };
      return slice(-26, 16) + slice(10, -20) + slice(30, 22);
    }
  };
  var SWAPS = [['randen', 'Randen', 'rind', 'Rind'], ['kohlrabi', 'Kohlrabi', 'kalb', 'Kalb'], ['sellerie', 'Sellerie', 'schwein', 'Schwein'], ['rettich', 'Rettich', 'poulet', 'Poulet']];
  var swaps = $('[data-swaps]');
  if (swaps) {
    swaps.innerHTML = SWAPS.map(function (s) {
      return '<li class="swap">' +
        svg('0 0 420 220', '<g class="swap__meat">' + g(112, 112, 0.78, board(RAW[s[2]]())) + '</g>' +
          '<path d="M196 112h36m-12 -12l12 12l-12 12" fill="none" stroke="#b45f00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<g class="swap__veg">' + g(316, 110, 1.08, board(RAW[s[0]]())) + '</g>') +
        '<p><b>' + s[1] + '</b><span>zubereiten wie ' + s[3] + '</span></p></li>';
    }).join('');
  }

  /* Drei vegetarische Beispiele, mit Gewürzglas */
  var VEG = [
    { id: 'sellerie', s: 'canada', name: 'Sellerie-Steak', text: 'Grilliert, mit Champignons.', instead: 'statt Schweinesteak' },
    { id: 'kohlrabigeschn', s: 'helvetica', name: 'Kohlrabi-Geschnetzeltes', text: 'Mit Rahm, nach Zürcher Art.', instead: 'statt Geschnetzeltem' },
    { id: 'rettichsatay', s: 'mekong', name: 'Rettich-Satay', text: 'Am Spiess, mit Redline Mekong.', instead: 'statt Poulet-Satay' }
  ];
  var vdish = $('[data-veg-dishes]');
  if (vdish) {
    vdish.innerHTML = VEG.map(function (v) {
      return '<a class="vcard" href="kochideen.html?p=gemuese#finden">' +
        '<div class="vcard__art">' + G.cardArt(v.id, v.s) + '</div>' +
        '<div class="vcard__body"><span class="vcard__instead">' + v.instead + '</span><b>' + v.name + '</b><span>' + v.text + '</span>' +
        '<span class="vcard__with">mit <strong>Redline ' + SPICE[v.s].name + '</strong></span></div></a>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Einstieg: vier Bereiche zur Wahl
     ------------------------------------------------------------------ */
  fill('[data-art="fd-pick-veggie"]', svg('-235 -235 470 470', G.draw('sellerie')));
  fill('[data-art="fd-pick-abnehmen"]', svg('-235 -235 470 470', G.draw('ragout', { sauce: LIGHT[0].sauce }) + g(150, -128, 1.5, '<circle r="44" fill="#fff"/>' + g(0, 2, 0.62, A.liquidIcon('wasser')))));
  fill('[data-art="fd-pick-grill"]', svg('-150 -230 300 260', '<circle cx="86" cy="-176" r="26" fill="#ffd9a0" opacity=".9"/>' + P.grill(0, 10, 1.2)));
  fill('[data-art="fd-pick-familie"]', svg('-240 -240 480 480', table(true)));

  /* ------------------------------------------------------------------
     Abnehmen: Kalorienvergleich, der Teller zeigt die gewählte Sauce
     ------------------------------------------------------------------ */
  var kcal = $('[data-kcal]');
  if (kcal) {
    var art = $('[data-kcal-art]', kcal), bars = $('[data-kbars]', kcal), tip = $('[data-ktip]', kcal);
    var num = $('[data-kcal-num]', kcal), delta = $('[data-kcal-delta]', kcal);
    var MAX = 420;
    art.innerHTML = svg('-235 -235 470 470', LIGHT.map(function (l, i) { return '<g class="kplate' + (i ? '' : ' is-on') + '" data-k="' + l.k + '">' + G.draw('ragout', { sauce: l.sauce }) + '</g>'; }).join(''));
    bars.innerHTML = LIGHT.map(function (l, i) {
      var icon = svg('-56 -60 112 112', A.liquidIcon(l.k === 'rahm' ? 'rahm' : l.k));
      return '<button type="button" class="kbar" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' +
        '<span class="kbar__label"><i>' + icon + '</i>' + l.label + '</span>' +
        '<span class="kbar__track"><span class="kbar__fill" style="width:' + (l.plate / MAX * 100).toFixed(1) + '%"></span>' +
        '<span class="kbar__val" style="left:' + (l.plate / MAX * 100).toFixed(1) + '%">' + l.plate + ' kcal</span></span></button>';
    }).join('');
    $('tbody', $('[data-ktable]', kcal)).innerHTML = LIGHT.map(function (l) { return '<tr><th scope="row">' + l.label + '</th><td>' + l.per100 + '</td><td>' + l.plate + '</td></tr>'; }).join('');

    var pick = function (i) {
      var l = LIGHT[i], kokos = LIGHT[LIGHT.length - 1];
      $$('.kbar', bars).forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
      $$('.kplate', art).forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-k') === l.k); });
      num.textContent = l.plate;
      delta.textContent = l.k === 'kokos' ? 'Mit Kokosmilch ist das Gericht am reichhaltigsten.' : l.with + ': ' + (kokos.plate - l.plate) + ' kcal weniger als mit Kokosmilch.';
    };
    $$('.kbar', bars).forEach(function (b) {
      var i = +b.getAttribute('data-i'), l = LIGHT[i];
      b.addEventListener('click', function () { pick(i); });
      b.addEventListener('mouseenter', function () {
        var r = $('.kbar__fill', b).getBoundingClientRect(), box2 = kcal.getBoundingClientRect();
        tip.innerHTML = '<b>' + l.label + '</b>' + l.plate + ' kcal pro Teller · ' + l.per100 + ' kcal pro 100 ml';
        tip.style.left = (r.right - box2.left) + 'px';
        tip.style.top = (r.top - box2.top) + 'px';
        tip.hidden = false;
      });
      b.addEventListener('mouseleave', function () { tip.hidden = true; });
    });
    pick(0);
  }

  /* Tipps: kleine Symbole */
  fill('[data-art="fd-tip-gemuese"]', svg('-40 -40 80 80', g(-12, 4, 1.2, P.broccoli()) + g(16, 10, 1.1, P.carrot())));
  fill('[data-art="fd-tip-strecken"]', svg('-56 -60 112 112', g(-16, 6, 0.6, A.liquidIcon('kokos')) + g(22, 4, 0.6, A.liquidIcon('wasser'))));
  fill('[data-art="fd-tip-beilage"]', svg('-40 -40 80 80', [[-14, 6], [10, 10], [-2, -12], [16, -10]].map(function (p) { return ell(p[0], p[1], 13, 10, '#e8c27a') + ell(p[0] - 3, p[1] - 3, 4, 2, '#f6dfa6') + dot(p[0] + 5, p[1] + 2, 1.5, '#b8914a'); }).join('') + ell(0, 22, 5, 2.4, '#4c8a3c')));

  /* ------------------------------------------------------------------
     Grill und BBQ: Grill mit Pokal, darunter die fünf Rubs
     ------------------------------------------------------------------ */
  var BBQ = [['Kentucky', 'BBQ Kentucky Chicken Rub', '#7b4a2c'], ['Südstaaten', 'BBQ Südstaaten', '#8a3a22'], ['Australian', 'Australian BBQ Rub', '#a0522d'], ['Asado', 'Argentinien Asado', '#8a5a34'], ['Swiss BBQ', 'Swiss BBQ', '#a8462a']];
  var trophy = g(0, 0, 1, ell(0, 10, 70, 10, '#000', 'opacity=".25"') + box(-46, -16, 92, 24, 5, '#5a3a1a') + box(-34, -36, 68, 22, 4, '#7a5226') +
    box(-8, -76, 16, 42, 4, '#d9a521') + pth('M-56 -190L56 -190C56 -120 30 -84 0 -80C-30 -84 -56 -120 -56 -190Z', '#e8b923') +
    pth('M-56 -176C-96 -176 -96 -118 -44 -118', 'none', 'stroke="#e8b923" stroke-width="10" stroke-linecap="round"') + pth('M56 -176C96 -176 96 -118 44 -118', 'none', 'stroke="#e8b923" stroke-width="10" stroke-linecap="round"') +
    pth('M-40 -184C-40 -140 -26 -108 -10 -98', 'none', 'stroke="#fff3b0" stroke-width="7" stroke-linecap="round" opacity=".8"') +
    '<text x="0" y="-122" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="40" fill="#8a6a10">2</text>');
  fill('[data-art="fd-bbq"]', svg('-300 -330 600 360', '<defs><radialGradient id="bbqglow"><stop offset="0" stop-color="#f68e10" stop-opacity=".45"/><stop offset="1" stop-color="#f68e10" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse cx="-70" cy="-170" rx="250" ry="170" fill="url(#bbqglow)"/>' + g(-70, 10, 1.9, P.grill(0, 0, 1)) + g(190, 10, 1, trophy)));
  var bbqJars = $('[data-bbq-jars]');
  if (bbqJars) bbqJars.innerHTML = BBQ.map(function (j) { return '<li>' + A.jarSvg({ name: j[0], spice: j[2], dish: '#c98b4a', label: j[1] }) + '<span>' + j[1] + '</span></li>'; }).join('');

  /* ------------------------------------------------------------------
     Familie: ein Tisch, gleiches Essen, jeder schärft selbst nach
     ------------------------------------------------------------------ */
  function table(small) {
    var r = A.rnd(5), out = dot(10, 16, 232, '#261f1f', 'opacity=".14"') + dot(0, 0, 232, '#b57a42') + dot(0, 0, 220, '#d49a5c');
    [-150, -90, -30, 30, 90, 150].forEach(function (y) { var w = Math.sqrt(220 * 220 - y * y); out += pth('M' + n(-w) + ' ' + y + 'C' + n(-w / 3) + ' ' + (y - 8) + ' ' + n(w / 3) + ' ' + (y + 8) + ' ' + n(w) + ' ' + y, 'none', 'stroke="#b88048" stroke-width="2.5" opacity=".5"'); });
    var seats = [[-112, -100, 0, 'mild'], [112, -100, 6, 'etwas schärfer'], [-112, 104, 16, 'scharf'], [112, 104, 34, 'extra scharf']];
    seats.forEach(function (s) {
      var flakes = '';
      for (var i = 0; i < s[2]; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()) * 50; flakes += ell(Math.cos(a) * d, Math.sin(a) * d, 3.4, 2, i % 2 ? '#c8321e' : '#e05a2a', rot(Math.cos(a) * d, Math.sin(a) * d, r() * 180)); }
      out += g(s[0], s[1], 0.42, G.draw('geschnetzeltes')) + g(s[0], s[1], 1, flakes);
      if (!small) out += g(s[0], s[1] + (s[1] < 0 ? -104 : 104), 1, '<rect x="-' + (s[3].length * 5 + 14) + '" y="-15" width="' + (s[3].length * 10 + 28) + '" height="30" rx="15" fill="#fffaf3"/>' +
        '<text x="0" y="6" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="17" fill="#261f1f">' + s[3] + '</text>');
    });
    return out + jarAt('Scharfmacher', '#c0261c', 0, 0, small ? 0.62 : 0.55, -6);
  }
  fill('[data-art="fd-table"]', svg('-300 -300 600 600', table(false)));
  fill('[data-art="fd-school"]', svg('-60 -60 120 120', '<rect x="-40" y="-46" width="80" height="96" rx="8" fill="#fffaf3" stroke="#e4dacb" stroke-width="3"/>' +
    '<path d="M-26 -24h52M-26 -8h52M-26 8h36" stroke="#cfc2b4" stroke-width="5" stroke-linecap="round"/>' + g(26, 26, 0.3, '<g transform="translate(-60 -150)">' + A.jar({ name: 'Mekong', spice: '#b9853f' }) + '</g>', 12)));

  /* ------------------------------------------------------------------
     Probierset
     ------------------------------------------------------------------ */
  fill('[data-art="fd-go"]', [['Argentinien', '#8a5a34', '#e0a95e'], ['Kentucky BBQ', '#7b4a2c', '#c98b4a'], ['Süd Indien', '#c99a2e', '#f6eedb'], ['1 für Alles', '#9c8c5a', '#f1e2c4'], ['Helvetica', '#b9ae78', '#f1e2c4']].map(function (j) {
    return A.jarSvg({ name: j[0], spice: j[1], dish: j[2], label: 'Redline ' + j[0] });
  }).join(''));
})();
