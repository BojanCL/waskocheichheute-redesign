/* ==========================================================================
   Redline · «Kochideen» · Filter, Gerichtskarten und Illustrationen
   Inhalte aus waskocheichheute.ch (Kochideen, Rezepte, Gewürzseiten,
   Monatshit «Die Welt der Pilze»). Im Betrieb kommen die Gerichte aus der
   gemeinsamen Rezept-Datenbank von Website und Shop.
   Jedes Gericht ist so gezeichnet, wie es im echten Leben aussieht.
   Die Gerichtszeichnungen kommen aus gerichte.js.
   ========================================================================== */
(function () {
  'use strict';

  var A = window.Art, G = window.Gerichte, SPICE = G.SPICE, g = G.tools.g, svg = G.tools.svg, cardArt = G.cardArt;
  function draw(id) { return G.draw(id); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var KOCHIDEE = 'kochidee-mekong.html';
  var SHOP = 'https://shop.waskocheichheute.ch/';
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ------------------------------------------------------------------
     Daten
     ------------------------------------------------------------------ */
  var PROT = [
    { id: 'poulet', label: 'Poulet', icon: '<path d="M3 12.5c0-3.6 3.2-6 7-5.6 4 .4 7.8 2.3 10.6 4.6.6.5.5 1.3-.2 1.6-3 1.4-6.4 3-9.8 3.6C6.6 17.3 3 15.8 3 12.5z" fill="#261f1f"/><path d="M6.5 14c3 .8 7 0 10.5-1.8" stroke="#fbf6ec" stroke-width="1.3" fill="none" stroke-linecap="round"/>' },
    { id: 'rind', label: 'Rind', icon: '<path d="M5 9c3-4 11-4 14 0 2 3 0 8-5 8-3 0-4-2-7-2-3 0-4-3-2-6z" fill="#261f1f"/><circle cx="14" cy="11" r="2.2" fill="#fbf6ec"/>' },
    { id: 'fisch', label: 'Fisch', icon: '<path d="M3 12c4-5 10-5 14 0-4 5-10 5-14 0z" fill="#261f1f"/><path d="M17 12l4-4v8z" fill="#261f1f"/><circle cx="7" cy="11" r="1.2" fill="#fbf6ec"/>' },
    { id: 'gemuese', label: 'Gemüse', icon: '<path d="M12 21c-5-2-7-8-4-12l8 8c-1 2-2 3-4 4z" fill="#261f1f"/><path d="M14 9c1-3 3-5 6-5-1 3-2 5-5 6M14 9c-1-2-1-4 0-6" stroke="#261f1f" stroke-width="1.8" fill="none" stroke-linecap="round"/>' }
  ];
  var METHOD = [
    { id: 'grill', label: 'Braten oder grillieren', short: 'Grill und Pfanne' },
    { id: 'rahm', label: 'Rahm', short: 'Rahm' },
    { id: 'tomate', label: 'Tomate', short: 'Tomate' },
    { id: 'kokos', label: 'Kokosmilch', short: 'Kokosmilch' },
    { id: 'soja', label: 'Soja', short: 'Soja' }
  ];
  var REGION = [
    { id: 'alle', label: 'Alle Regionen' },
    { id: 'asien', label: 'Asien', bg: '#d6efe4' },
    { id: 'europa', label: 'Europa', bg: '#fbe0bf' },
    { id: 'schweiz', label: 'Schweiz', bg: '#dcecf6' },
    { id: 'amerika', label: 'Amerika und Karibik', bg: '#f6d6c2' }
  ];
  var DISHES = [
    { id: 'goldenriver', p: 'poulet', l: 'kokos', r: 'asien', s: 'mekong', name: 'Mekong Kokos-Chicken «Golden River»', text: 'Pouletfilet in Kokosmilch und Ingwer, dazu Jasminreis und cremiges Kokos-Karotten-Püree.' },
    { id: 'pollo', p: 'poulet', l: 'grill', r: 'amerika', s: 'argentinien', name: 'Pollo del Sol', text: 'Pouletbrust mit Zitrone und einem Hauch Honig, gegrillt, dazu Paprikareis und Kräuterjoghurt.' },
    { id: 'geschnetzeltes', p: 'poulet', l: 'rahm', r: 'schweiz', s: 'helvetica', name: 'Geschnetzeltes nach Zürcher Art', text: 'Der Schweizer Klassiker: Poulet in feiner Rahmsauce.' },
    { id: 'chana', p: 'gemuese', l: 'tomate', r: 'asien', s: 'suedindien', name: 'Chana Masala', text: 'Kichererbsen mit Tomaten und Kokosmilch.' },
    { id: 'mok', p: 'fisch', l: 'kokos', r: 'asien', s: 'mekong', name: 'Mok Sonnenbarsch «Mekong Breeze»', text: 'Gebratener Sonnenbarsch mit Thai-Basilikum, Pak Choi und Kokosmilch.' },
    { id: 'burger', p: 'rind', l: 'grill', r: 'amerika', s: 'argentinien', name: 'Argentina Burger', text: 'Rindfleisch-Burger mit Kräutern und Knoblauch.' },
    { id: 'federkohl', p: 'poulet', l: 'kokos', r: 'amerika', s: 'puertorico', name: 'Poulet mit Federkohl und Birne', text: 'Regionaler Federkohl und Birne, karibisch gewürzt, mit Kokosmilch.' },
    { id: 'ragout', p: 'poulet', l: 'tomate', r: 'europa', s: 'spanien', name: 'Poulet-Ragout nach spanischer Art', text: 'Poulet und Zucchetti in Tomatensauce.' },
    { id: 'jambalaya', p: 'poulet', l: 'tomate', r: 'amerika', s: 'cajun', name: 'Jambalaya', text: 'Reis, Poulet und Gemüse aus einer Pfanne, mit Louisiana-Flair.' },
    { id: 'smoky', p: 'poulet', l: 'grill', r: 'amerika', s: 'bbq', name: 'Smoky Soul Chicken', text: 'Rauchiges Poulet mit süsser Glasur vom Grill.' },
    { id: 'kerala', p: 'fisch', l: 'kokos', r: 'asien', s: 'suedindien', name: 'Kerala-Fischcurry', text: 'Fischfilets in Kokos-Curry mit Ingwer und Koriander.' },
    { id: 'fischwok', p: 'fisch', l: 'soja', r: 'asien', s: 'korea', name: 'Koreanischer Fischwok', text: 'Fisch und Gemüse aus dem Wok.' },
    { id: 'plaetzli', p: 'rind', l: 'grill', r: 'schweiz', s: 'helvetica', name: 'Rindsplätzli Helvetica', text: 'Kurz gebraten, mit dem Schweizer Urgewürz.' },
    { id: 'rindwok', p: 'rind', l: 'soja', r: 'asien', s: 'peking', name: 'Rindfleisch aus dem Wok', text: 'Rindfleischstreifen mit Gemüse und Soja.' },
    { id: 'kohlrabi', p: 'gemuese', l: 'grill', r: 'asien', s: 'mekong', name: 'Kohlrabi-Steak «Mekong Garden»', text: 'Gegrillter Kohlrabi mit Ingwer und Zitronengras.' },
    { id: 'sellerie', p: 'gemuese', l: 'grill', r: 'amerika', s: 'canada', name: 'Selleriesteak mit Champignons', text: 'Sellerie, grilliert wie ein Steak.' },
    { id: 'veggiegeschn', p: 'gemuese', l: 'rahm', r: 'schweiz', s: 'helvetica', name: 'Veggie-Geschnetzeltes mit Sellerie', text: 'Sellerie statt Fleisch, mit Rahmsauce.' },
    { id: 'flan', p: 'gemuese', l: 'rahm', r: 'europa', s: 'france', name: 'Pariser Pilz-Senf-Flan', text: 'Cremiger Flan mit Steinpilzen, ohne Boden.' }
  ];
  /* Thema des Monats: «Die Welt der Pilze» */
  var THEME = [
    { id: 'flan', s: 'france', name: 'Pariser Pilz-Senf-Flan mit Steinpilzen', bg: '#f3e3c8' },
    { id: 'strudel', s: 'einsfueralles', name: 'Strudel di Funghi e Mascarpone', bg: '#efe0c2' },
    { id: 'pfifferling', s: 'schweden', name: 'Schwedische Pfifferlingsnudeln', bg: '#e7e5cc' },
    { id: 'poutine', s: 'quebec', name: 'Québecer Poutine mit Pilzen', bg: '#f0dcc4' },
    { id: 'kurnik', s: 'kosaken', name: 'Kosaken-Kurnik mit Huhn und Austernseitlingen', bg: '#e9dcc6' }
  ];
  /* Nach Gewürz: je ein Beispielgericht */
  var BY_SPICE = [
    ['mekong', 'Mekong Kokos-Chicken «Golden River»'], ['argentinien', 'Pollo del Sol'], ['bbq', 'Smoky Soul Chicken'], ['helvetica', 'Rindsplätzli Helvetica'],
    ['canada', 'Canadian Game Stew mit Blaubeeren'], ['newmexiko', 'Hatch-Chili Chicken'], ['aethiopien', 'Doro Wot'], ['cajun', 'Jambalaya']
  ];

  function labelOf(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  /* ------------------------------------------------------------------
     Einstieg: drei Gerichte, drei Gewürze
     ------------------------------------------------------------------ */
  var heroArt = $('[data-art="ideen-hero"]');
  if (heroArt) {
    var jar = function (x, y, s, k, deg) { return g(x, y, s, '<g transform="translate(-60 -150)">' + A.jar({ name: SPICE[k].name, spice: SPICE[k].color }) + '</g>', deg); };
    heroArt.innerHTML = svg('0 0 760 560',
      g(560, 150, 0.5, draw('pollo')) + g(190, 170, 0.48, draw('chana')) + g(390, 330, 0.78, draw('goldenriver')) +
      jar(640, 380, 0.62, 'mekong', 8) + jar(96, 400, 0.52, 'suedindien', -10) + jar(700, 210, 0.42, 'argentinien', 12));
  }

  /* ------------------------------------------------------------------
     Idee finden: Filter links, Gerichte rechts
     ------------------------------------------------------------------ */
  var finder = $('[data-ideen]');
  if (finder) {
    var st = { p: null, l: null, r: 'alle' }, showAll = false, PAGE = 6;
    /* Filter aus dem Link übernehmen, z. B. kochideen.html?p=gemuese#finden (von «Für dich») */
    var qs = new URLSearchParams(location.search);
    if (labelOf(PROT, qs.get('p'))) st.p = qs.get('p');
    if (labelOf(METHOD, qs.get('l'))) st.l = qs.get('l');
    if (labelOf(REGION, qs.get('r'))) st.r = qs.get('r');
    var elP = $('[data-f="p"]', finder), elL = $('[data-f="l"]', finder), elR = $('[data-f="r"]', finder);
    var elTitle = $('[data-ideas-title]', finder), elGrid = $('[data-ideas]', finder), elMore = $('[data-more]', finder), elReset = $$('[data-reset]', finder);
    var flame = '<svg viewBox="-60 -70 120 130" aria-hidden="true"><path d="M0 50C-40 30 -30 -10 0 -60C30 -10 40 30 0 50Z" fill="#f68e10"/><path d="M0 46C-20 30 -14 6 0 -20C14 6 20 30 0 46Z" fill="#ffd166"/></svg>';
    var methodIcon = function (id) { return id === 'grill' ? flame : svg('-56 -60 112 112', A.liquidIcon(id)); };

    var opt = function (label, on, icon, click) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.setAttribute('aria-pressed', String(on));
      b.innerHTML = (icon ? '<i>' + icon + '</i>' : '') + '<span>' + label + '</span>';
      b.addEventListener('click', click);
      return b;
    };
    var renderControls = function () {
      elP.textContent = ''; elL.textContent = ''; elR.textContent = '';
      PROT.forEach(function (p) { elP.appendChild(opt(p.label, st.p === p.id, '<svg viewBox="0 0 24 24" aria-hidden="true">' + p.icon + '</svg>', function () { st.p = st.p === p.id ? null : p.id; showAll = false; update(); })); });
      METHOD.forEach(function (m) { elL.appendChild(opt(m.label, st.l === m.id, methodIcon(m.id), function () { st.l = st.l === m.id ? null : m.id; showAll = false; update(); })); });
      REGION.forEach(function (r) { elR.appendChild(opt(r.label, st.r === r.id, null, function () { st.r = r.id; showAll = false; update(); })); });
      var any = st.p || st.l || st.r !== 'alle';
      elReset.forEach(function (b) { b.hidden = !any; });
    };
    var card = function (d, i) {
      var sp = SPICE[d.s], region = labelOf(REGION, d.r);
      return '<article class="idea" style="--i:' + i + '; --bgc:' + region.bg + '">' +
        '<div class="idea__art">' + cardArt(d.id, d.s) + '</div>' +
        '<div class="idea__body">' +
          '<span class="idea__kicker">' + labelOf(PROT, d.p).label + ' · ' + labelOf(METHOD, d.l).short + ' · ' + region.label + '</span>' +
          '<h3><a href="' + KOCHIDEE + '">' + d.name + '</a></h3>' +
          '<p class="idea__with">mit <strong>Redline ' + sp.name + '</strong></p>' +
          '<p class="idea__text">' + d.text + '</p>' +
          '<div class="idea__links"><span class="idea__go">Zur Kochidee ' + ARROW + '</span>' +
          '<a class="idea__buy" href="' + SHOP + '" target="_blank" rel="noopener">Gewürz kaufen</a></div>' +
        '</div></article>';
    };
    var update = function () {
      renderControls();
      var list = DISHES.filter(function (d) { return (!st.p || d.p === st.p) && (!st.l || d.l === st.l) && (st.r === 'alle' || d.r === st.r); });
      var parts = [];
      if (st.p) parts.push(labelOf(PROT, st.p).label);
      if (st.l) parts.push(labelOf(METHOD, st.l).label);
      if (st.r !== 'alle') parts.push(labelOf(REGION, st.r).label);
      if (!parts.length) elTitle.textContent = 'Beliebte Kochideen';
      else elTitle.textContent = list.length + (list.length === 1 ? ' Kochidee' : ' Kochideen') + ' · ' + parts.join(' · ');
      if (!list.length) {
        elGrid.innerHTML = '<div class="ideas__empty"><b>Für diese Kombination gibt es noch keine Kochidee.</b>' +
          '<p>Wähle einen Filter weniger. Übrigens: Jedes Redline-Gewürz passt zu jeder Kochflüssigkeit.</p></div>';
        elMore.hidden = true;
        return;
      }
      var shown = showAll ? list : list.slice(0, PAGE);
      elGrid.innerHTML = shown.map(card).join('');
      elMore.hidden = list.length <= shown.length;
      var rest = list.length - shown.length;
      $('button', elMore).textContent = rest === 1 ? 'Eine weitere Kochidee anzeigen' : 'Weitere ' + rest + ' Kochideen anzeigen';
    };
    elReset.forEach(function (b) { b.addEventListener('click', function () { st = { p: null, l: null, r: 'alle' }; showAll = false; update(); }); });
    $('button', elMore).addEventListener('click', function () { showAll = true; update(); });
    update();
  }

  /* ------------------------------------------------------------------
     Thema des Monats: fünf Pilzgerichte
     ------------------------------------------------------------------ */
  var theme = $('[data-theme]');
  if (theme) {
    theme.innerHTML = THEME.map(function (t, i) {
      return '<a class="tcard" href="' + KOCHIDEE + '" style="--bgc:' + t.bg + '; --i:' + i + '">' +
        '<div class="tcard__art">' + cardArt(t.id, t.s) + '</div>' +
        '<div class="tcard__body"><b>' + t.name + '</b><span>mit <strong>Redline ' + SPICE[t.s].name + '</strong></span></div></a>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Nach Gewürz: das Glas vor seiner Landschaft
     ------------------------------------------------------------------ */
  var bySpice = $('[data-by-spice]');
  if (bySpice) {
    bySpice.innerHTML = BY_SPICE.map(function (b) {
      var sp = SPICE[b[0]];
      return '<a class="gw" href="' + KOCHIDEE + '">' +
        '<div class="gw__scene"><svg class="gw__bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + A.scene(sp.world) + '</svg>' +
          '<span class="gw__jar">' + A.jarSvg({ name: sp.name, spice: sp.color }) + '</span></div>' +
        '<div class="gw__body"><h3>Redline ' + sp.name + '</h3><p>z. B. ' + b[1] + '</p><span class="gw__go">5 Gerichte ' + ARROW + '</span></div></a>';
    }).join('');
  }
})();
