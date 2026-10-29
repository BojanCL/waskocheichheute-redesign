/* ==========================================================================
   Redline · Gewürzseite «Kochidee» (Vorlage für alle Gewürze, Beispiel Mekong)
   Inhalte aus der heutigen Seite «Kochideen › Redline Mekong», dem Rezept-PDF
   und der Produktseite im Shop. Gerichte kommen aus gerichte.js.
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, G = window.Gerichte, T = G.tools;
  var g = T.g, svg = T.svg, n = T.n;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ARROW_DOWN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
  var SPICE = { name: 'Mekong', color: '#b9853f', dish: '#f6eedb' };
  function jar(x, y, s, deg) { return g(x, y, s, '<g transform="translate(-60 -150)">' + A.jar({ name: SPICE.name, spice: SPICE.color, dish: SPICE.dish }) + '</g>', deg); }

  /* Die 1-Liter-Dose: Blech mit umlaufendem Etikett */
  function tin(x, y, s) {
    var gid = A.uid('tin');
    return g(x, y, s,
      '<defs><linearGradient id="' + gid + '" x1="0" x2="1"><stop offset="0" stop-color="#8d939d"/><stop offset=".22" stop-color="#eef1f5"/><stop offset=".5" stop-color="#b9bfc8"/><stop offset="1" stop-color="#7a808a"/></linearGradient></defs>' +
      '<ellipse cx="0" cy="150" rx="96" ry="18" fill="#261f1f" opacity=".2"/>' +
      '<rect x="-86" y="-120" width="172" height="264" rx="12" fill="url(#' + gid + ')"/>' +
      '<rect x="-86" y="-70" width="172" height="164" fill="#fffdf8"/><rect x="-86" y="-70" width="172" height="164" fill="none" stroke="#261f1f" stroke-opacity=".08" stroke-width="2"/>' +
      '<rect x="-86" y="44" width="172" height="50" fill="' + SPICE.color + '"/><path d="M-86 52C-40 38 40 66 86 48L86 70L-86 70Z" fill="#2d78c4"/><path d="M-86 64C-36 54 36 76 86 62L86 76L-86 76Z" fill="#8cc6ef"/>' +
      '<text x="0" y="-36" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="800" letter-spacing="2.4" fill="#d7261e">REDLINE</text>' +
      '<text x="0" y="0" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-size="34" font-weight="800" fill="#1f2a44">' + SPICE.name + '</text>' +
      '<text x="0" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#6b5b52">590 g</text>' +
      '<ellipse cx="0" cy="-120" rx="86" ry="16" fill="#c4c9d1"/><ellipse cx="0" cy="-122" rx="74" ry="11" fill="#a9afb8"/><ellipse cx="0" cy="-124" rx="62" ry="7" fill="#d9dde3"/>');
  }

  /* ------------------------------------------------------------------
     1 · Einstieg: das Glas vor der Landschaft Kambodschas, daneben das Gericht
     ------------------------------------------------------------------ */
  fill('[data-art="kd-hero"]', '<svg class="kd-window__bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + A.scene('tropen') + '</svg>' +
    svg('0 0 1000 800', g(400, 470, 1.05, G.draw('goldenriver')) + '<ellipse cx="760" cy="690" rx="78" ry="16" fill="#261f1f" opacity=".2"/>' + jar(760, 470, 1.35, 8)));
  fill('[data-ico="kokos"]', svg('-56 -60 112 112', A.liquidIcon('kokos')));
  fill('[data-ico="grillsauce"]', svg('-130 -70 260 140', g(-58, 6, 0.9, '<path d="M0 50C-40 30 -30 -10 0 -60C30 -10 40 30 0 50Z" fill="#f68e10"/><path d="M0 46C-20 30 -14 6 0 -20C14 6 20 30 0 46Z" fill="#ffd166"/>') + g(58, 4, 0.9, A.liquidIcon('sauce'))));

  /* ------------------------------------------------------------------
     2 · Fünf Gerichte: Fleisch, Fisch, Veggie, lokal, Wochenende
     ------------------------------------------------------------------ */
  var FIVE = [
    { id: 'goldenriver', cat: 'Fleisch', bg: '#d6efe4', name: 'Mekong Kokos-Chicken «Golden River»', text: 'Pouletfilet in Kokosmilch und Ingwer, mit Jasminreis und Kokos-Karotten-Püree.', href: '#rezept', down: true },
    { id: 'mok', cat: 'Fisch', bg: '#dcecf6', name: 'Mok Sonnenbarsch «Mekong Breeze»', text: 'Gebratener Sonnenbarsch mit Thai-Basilikum, dazu Pak Choi und Paprika in Kokosmilch.' },
    { id: 'kohlrabi', cat: 'Veggie', bg: '#e7efd9', name: 'Kohlrabi-Steak «Mekong Garden»', text: 'Gegrillter Kohlrabi mit Ingwer, Zitronengras und Kokos, dazu Shiitake und Paprika.' },
    { id: 'salbeichicken', cat: 'Lokale Zutaten', bg: '#fbe0bf', name: 'Kokos-Zitronen-Salbei-Chicken', text: 'Mit saisonalem Spargel und Rosenblättern. Lokale Zutaten, fernöstliches Aroma.' },
    { id: 'garnelen', cat: 'Weekend Special', bg: '#f6d6c2', name: 'Mekong Garnelen «Fishermen\'s Feast»', text: 'Garnelen auf Kokos-Thai-Basilikum-Püree mit gerösteten Cashews.' }
  ];
  var five = $('[data-five]');
  if (five) {
    five.innerHTML = FIVE.map(function (d, i) {
      return '<article class="idea' + (i ? '' : ' idea--here') + '" style="--i:' + i + '; --bgc:' + d.bg + '">' +
        '<div class="idea__art">' + svg('-235 -235 470 470', g(0, 0, 0.94, G.draw(d.id))) + '</div>' +
        '<div class="idea__body"><span class="idea__kicker">' + d.cat + '</span>' +
          '<h3><a href="' + (d.href || '#') + '">' + d.name + '</a></h3>' +
          '<p class="idea__text">' + d.text + '</p>' +
          '<div class="idea__links"><span class="idea__go' + (d.down ? ' idea__go--down' : '') + '">Zum Rezept ' + (d.down ? ARROW_DOWN : ARROW) + '</span></div>' +
        '</div></article>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     3 · Rezept: Mengen für 2 bis 12 Personen, Zutaten und Schritte abhaken
     ------------------------------------------------------------------ */
  fill('[data-art="kd-recipe"]', svg('-235 -235 470 470', g(-42, -22, 0.82, G.draw('goldenriver')) + '<ellipse cx="166" cy="200" rx="50" ry="11" fill="#261f1f" opacity=".16"/>' + jar(166, 78, 0.8)));
  /* Grundrezept für 4 Personen (aus dem Rezept-PDF); r = Rundung */
  var INGR = [
    { q: 600, u: 'g', name: 'Pouletfilet', r: 10 },
    { q: 18, u: 'g', name: 'Redline Mekong', r: 1, spoon: 9, spice: true },
    { q: 400, u: 'ml', name: 'Kokosmilch', r: 10 },
    { q: 1, u: 'Stück', name: 'frischer Ingwer', r: 0.5 },
    { q: 300, u: 'g', name: 'Jasminreis', r: 10 },
    { q: 500, u: 'g', name: 'Karotten', r: 10 },
    { q: 1, u: 'EL', name: 'Öl', r: 0.5 }
  ];
  function nice(v, r) {
    var x = Math.max(r, Math.round(v / r) * r);
    if (r === 0.5) { var whole = Math.floor(x), half = x - whole >= 0.5; return (whole ? whole : '') + (half ? '½' : '') || '½'; }
    return String(x);
  }
  var ingr = $('[data-ingr]'), servOut = $('[data-serv-out]'), people = 4;
  function renderIngr() {
    var k = people / 4;
    ingr.innerHTML = INGR.map(function (it, i) {
      var amount = nice(it.q * k, it.r) + ' ' + it.u;
      var extra = it.spoon ? ' <small>(ca. ' + nice(it.q * k / it.spoon, 0.5) + ' EL)</small>' : '';
      return '<li' + (it.spice ? ' class="is-spice"' : '') + '><label><input type="checkbox" data-i="' + i + '"><span class="ingr__q">' + amount + '</span><span class="ingr__n">' + it.name + extra + '</span>' +
        (it.spice ? '<a class="ingr__buy" href="#kaufen">kaufen</a>' : '') + '</label></li>';
    }).join('');
    servOut.textContent = people + ' Personen';
    $$('[data-serv]').forEach(function (b) { var d = +b.getAttribute('data-serv'); b.disabled = d < 0 ? people <= 2 : people >= 12; });
  }
  if (ingr) {
    $$('[data-serv]').forEach(function (b) {
      b.addEventListener('click', function () {
        var checked = $$('input:checked', ingr).map(function (c) { return c.getAttribute('data-i'); });
        people = Math.min(12, Math.max(2, people + 2 * +b.getAttribute('data-serv')));
        renderIngr();
        checked.forEach(function (i) { $('input[data-i="' + i + '"]', ingr).checked = true; });
      });
    });
    renderIngr();
  }
  $$('[data-steps] li').forEach(function (li) {
    li.tabIndex = 0;
    li.setAttribute('role', 'checkbox');
    li.setAttribute('aria-checked', 'false');
    var toggle = function () { var on = li.classList.toggle('is-done'); li.setAttribute('aria-checked', String(on)); };
    li.addEventListener('click', toggle);
    li.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });
  });
  /* Drucken: nur das Rezept */
  $$('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.body.classList.add('print-recipe');
      window.print();
      setTimeout(function () { document.body.classList.remove('print-recipe'); }, 500);
    });
  });

  /* ------------------------------------------------------------------
     4 · Dosierung: pro kg 30 g Gewürz, 5 g Öl, 80 g Wasser
     ------------------------------------------------------------------ */
  fill('[data-art="kd-jar"]', A.jarSvg({ name: SPICE.name, spice: SPICE.color, dish: SPICE.dish }));
  var w = $('#kdw');
  if (w) {
    var upd = function () {
      var kg = +w.value / 1000;
      $('[data-kd-w]').textContent = w.value + ' g';
      $('[data-kd-spice]').textContent = Math.round(kg * 30);
      $('[data-kd-oil]').textContent = Math.max(1, Math.round(kg * 5)) + ' g';
      $('[data-kd-water]').textContent = Math.round(kg * 80) + ' g';
    };
    w.addEventListener('input', upd);
    upd();
  }

  /* ------------------------------------------------------------------
     5 · Kaufen: Streuer oder Dose
     ------------------------------------------------------------------ */
  var buyArt = $('[data-art="kd-buy"]');
  if (buyArt) {
    buyArt.innerHTML = svg('-260 -230 520 440',
      '<circle cx="0" cy="-10" r="190" fill="#3a302c"/>' +
      '<g class="pk pk--streuer is-on">' + g(-10, 0, 1, '<ellipse cx="0" cy="168" rx="62" ry="13" fill="#000" opacity=".3"/>' + jar(0, 18, 1.0, -4)) + '</g>' +
      '<g class="pk pk--dose">' + tin(0, 10, 1.05) + '</g>');
    var buyBtn = $('[data-buy]');
    $$('[data-pack]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-pack');
        $$('[data-pack]').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
        $$('.pk', buyArt).forEach(function (p) { p.classList.toggle('is-on', p.classList.contains('pk--' + k)); });
        buyBtn.textContent = (k === 'dose' ? 'Dose' : 'Streuer') + ' im Shop kaufen';
      });
    });
  }

  /* ------------------------------------------------------------------
     6 · Ähnliche Gewürze (Glasfarben angenähert)
     ------------------------------------------------------------------ */
  var SIMILAR = [
    { name: 'Laos', color: '#a8862e', world: 'tropen', tag: 'Asien · Kokosmilch' },
    { name: 'Thai Wok', color: '#a5502b', world: 'fernost', tag: 'Asien · Soja' },
    { name: 'Vietnam Streetfood', color: '#8f6a2a', world: 'tropen', tag: 'Asien' },
    { name: 'Ceylon Curry', color: '#c9902e', world: 'tropen', tag: 'Asien · Kokosmilch' }
  ];
  var similar = $('[data-similar]');
  if (similar) {
    similar.innerHTML = SIMILAR.map(function (s) {
      return '<a class="gw" href="#">' +
        '<div class="gw__scene"><svg class="gw__bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + A.scene(s.world) + '</svg>' +
          '<span class="gw__jar">' + A.jarSvg({ name: s.name, spice: s.color }) + '</span></div>' +
        '<div class="gw__body"><h3>Redline ' + s.name + '</h3><p>' + s.tag + '</p><span class="gw__go">5 Gerichte ' + ARROW + '</span></div></a>';
    }).join('');
  }
})();
