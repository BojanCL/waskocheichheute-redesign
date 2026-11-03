/* ==========================================================================
   Redline · Shop · Produktseite mit Geschichte «Von <Herkunft> auf deinen Teller»
   Oben kaufen, dann eine horizontale Reise mit den fünf Gerichten des Gewürzes,
   danach Rezepte, Mitbestellen, Zuletzt angesehen.
   Daten: daten.js (Prototyp) + story-daten.js. Kopf, Fuss und Warenkorb: shop.js.
   Grosse Bildschirme: GSAP pinnt die Geschichte, Scrollen fährt seitwärts.
   Handy und «weniger Bewegung»: Stationen zum Wischen, ohne Scroll-Steuerung.
   ========================================================================== */
(function () {
  'use strict';

  var S = window.Shop, D = window.SHOP, CFG = window.STORY || {};
  if (!S || !D) return;
  var esc = S.esc, chf = S.chf, SVG = S.SVG;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var IMG = 'assets/img/story/';
  var slug = new URLSearchParams(location.search).get('p');
  if (!CFG[slug] || !S.P(slug)) slug = 'bbq-kentucky';
  var p = S.P(slug), C = CFG[slug], K = p.k;
  var idee = D.ideen[slug] || { gr: [] }, rez = D.rezepte[slug];
  var vorher = S.zuletzt(slug);
  S.merken(slug);
  document.title = K + ': von ' + C.ort + ' auf deinen Teller · Redline Shop';

  function sauber(t) { return String(t || '').replace(/\s{2,}/g, ' ').replace(/Truthan(?!h)/g, 'Truthahn').trim(); }
  function gericht(art) { return idee.gr.filter(function (g) { return g.a === art; })[0]; }
  function pic(name, cls, alt, small) { return '<img class="' + cls + '" src="' + IMG + name + (small ? '-s' : '') + '.webp" alt="' + esc(alt || '') + '"' + (small ? ' loading="lazy"' : '') + '>'; }
  function gramm(m) { var x = String(m || '').match(/([\d.,]+)\s*(kg|g)/i); return x ? parseFloat(x[1].replace(',', '.')) * (x[2].toLowerCase() === 'kg' ? 1000 : 1) : 0; }
  function nb(n, u) { return n + '\u00a0' + u; }
  function zahl(n) { return (Math.round(n * 10) / 10).toString().replace('.', ','); }
  var ART_LABEL = { Fleisch: 'Fleisch', Fisch: 'Fisch', Veggie: 'Veggie', Lokal: 'Lokal', Weekend: 'Weekend' };

  /* Dosierung aus der Produktbeschreibung: 1 kg, 30 g Gewürz, 5 g Öl, 80 g Wasser */
  var dm = (p.mr || '').match(/(\d+(?:[.,]\d+)?)\s*kg[^,]*,\s*(\d+)\s*g[^,]*,\s*(\d+)\s*g\s*Öl,\s*(\d+)\s*g\s*Wasser/i);
  var DOS = dm ? { kg: parseFloat(dm[1].replace(',', '.')), g: +dm[2], oel: +dm[3], wasser: +dm[4] } : null;

  /* Stationen der Reise */
  var ARTEN = ['Fleisch', 'Fisch', 'wuerzen', 'Veggie', 'Lokal', 'Weekend'];
  var ST = [{ typ: 'start', kurz: C.ort }];
  ARTEN.forEach(function (a) {
    if (a === 'wuerzen') { if (DOS || p.zt) ST.push({ typ: 'wuerzen', kurz: 'So würzt du' }); return; }
    var g = gericht(a); if (!g) return;
    ST.push({ typ: 'gericht', art: a, g: g, c: C.gerichte[a] || {}, kurz: (C.gerichte[a] || {}).kurz || g.t });
  });
  ST.push({ typ: 'welt', kurz: 'Weiterreisen' });
  ST.push({ typ: 'schenken', kurz: 'Verschenken' });
  var N = ST.length;
  var WI = ST.map(function (x) { return x.typ; }).indexOf('wuerzen');
  function idx(art) { for (var i = 0; i < N; i++) if (ST[i].art === art) return i; return -1; }
  function nr(i) { return String(i + 1).padStart(2, '0'); }
  function dishTitle(st) { return esc(st.c.titel || st.g.t) + ' mit <em>' + esc(K) + '</em>'; }

  /* Kleiner Kauf-Knopf mit Streuer: das Gewürz immer mit Glas */
  function kaufChip(s, streuer, label) {
    var x = S.P(s), v = x.v[0];
    return '<button class="sx-buy" type="button" data-sx-add="' + esc(s) + '" data-vi="0">' +
      (streuer ? pic(streuer, 'sx-buy__jar', '') : '<span class="sx-buy__jar sx-buy__jar--svg">' + S.jar(x) + '</span>') +
      '<span class="sx-buy__txt"><b>' + esc(label || x.k) + '</b><small>' + esc(S.vname(v)) + ' · <span class="chf">' + chf(v[2]) + '</span></small></span>' +
      '<span class="sx-buy__plus">' + SVG.plus + '<span>In den Warenkorb</span></span></button>';
  }

  /* ------------------------------------------------------------------
     1 · Oben: Bild + Kaufen
     ------------------------------------------------------------------ */
  var heroSt = ST[idx(C.hero)] || ST.filter(function (x) { return x.typ === 'gericht' && x.c.bild; })[0];
  var v0 = p.v[0];
  var crumbs = '<ol class="crumbs"><li><a href="index.html">Shop</a></li><li><a href="kategorie.html">Gewürze</a></li>' +
    (p.a[0] ? '<li><a href="kategorie.html?art=' + p.a[0] + '">' + esc(S.artName(p.a[0])) + '</a></li>' : '') + '<li aria-current="page">' + esc(S.title(p)) + '</li></ol>';
  var gbImg = { Streuer: C.streuer, Dose: C.dose };
  var gb = '<fieldset class="gb sx-gb" style="--n:' + Math.min(p.v.length, 3) + '"><legend>Grösse wählen</legend>' + p.v.map(function (v, i) {
    return '<button type="button" data-gb="' + i + '" aria-pressed="' + (i === 0) + '">' + (gbImg[v[0]] ? pic(gbImg[v[0]], 'sx-gb__img', '') : '') +
      '<b>' + esc(S.vname(v)) + '</b><span class="chf">' + chf(v[2]) + '</span><span>' + esc(S.GEBINDE_FUER[v[0]] || '') + '</span></button>';
  }).join('') + '</fieldset>';
  var thumbs = ST.filter(function (x) { return x.typ === 'gericht'; }).map(function (x) {
    return '<button type="button" data-go="' + ST.indexOf(x) + '" class="sx-thumb' + (x.c.bild ? '' : ' sx-thumb--leer') + '">' +
      (x.c.bild ? pic(x.c.bild, 'sx-thumb__img', '', true) : '<span class="sx-thumb__img">Foto folgt</span>') +
      '<span class="sx-thumb__art">' + esc(ART_LABEL[x.art]) + '</span><b>' + esc(x.kurz) + '</b></button>';
  }).join('');
  var hero = '<section class="pd sx-hero"><div class="wrap">' + crumbs + '<div class="pd__grid sx-hero__grid">' +
    '<div class="sx-hero__media"><div class="sx-hero__stage">' +
      '<figure class="sx-hero__photo">' + (heroSt && heroSt.c.bild ? pic(heroSt.c.bild, 'sx-hero__img', (heroSt.c.titel || heroSt.g.t) + ' mit ' + K) : '') +
        '<figcaption>Im Bild: <b>' + (heroSt ? esc((heroSt.c.titel || heroSt.g.t) + ' mit ' + K) : '') + '</b></figcaption></figure>' +
      pic(C.streuer, 'sx-hero__jar', K + ', Streuer') + '</div>' +
      '<div class="sx-thumbs"><p>' + idee.gr.length + ' Gerichte mit ' + esc(K) + '</p><div class="sx-thumbs__row">' + thumbs + '</div></div>' +
    '</div>' +
    '<div class="pd__buy sx-buybox" data-s="' + p.s + '" data-i="0">' +
      '<div class="pd__eyebrow">' + [S.regionName(p.rh)].concat(p.a.map(S.artName)).filter(Boolean).map(function (t) { return '<span class="pill">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<h1>' + esc(K) + '</h1>' +
      '<p class="pd__sub">' + esc(C.passtZu || '') + '</p>' +
      (p.claim ? '<p class="pd__claim"><b>' + esc(p.claim) + '.</b> ' + esc(C.geschmackSatz || '') + '</p>' : '') +
      '<div class="pd__price"><b class="chf" data-pd-price>' + chf(v0[2]) + '</b><span data-pd-per>' + esc(S.vname(v0)) + (S.per100(v0) ? ', ' + S.per100(v0) : '') + ', inkl. MWST</span></div>' + gb +
      '<div class="pd__cta"><div class="qty"><button type="button" data-qm aria-label="Eins weniger">−</button><input type="number" min="1" max="99" value="1" aria-label="Menge" data-qv><button type="button" data-qp aria-label="Eins mehr">+</button></div>' +
      '<button class="btn btn--orange" type="button" data-pd-add>' + SVG.plus + 'In den Warenkorb</button></div>' +
      '<p class="pd__stock"><i></i>' + (p.lager ? 'An Lager. Heute bestellt, morgen unterwegs.' : 'Zurzeit nicht an Lager.') + '</p>' +
      '<nav class="sx-jump" aria-label="Auf dieser Seite"><span>Auf dieser Seite</span>' +
        '<a href="#geschichte" data-go="1">' + idee.gr.length + ' Gerichte</a>' +
        (WI >= 0 ? '<a href="#geschichte" data-go="' + WI + '">So würzt du</a>' : '') +
        (rez && rez.n ? '<a href="#rezepte">' + rez.n + ' Rezepte</a>' : '') +
        '<a href="#geschichte" data-go="' + (N - 1) + '">Verschenken</a></nav>' +
    '</div></div></div></section>';

  /* ------------------------------------------------------------------
     2 · Die Reise: Stationen
     ------------------------------------------------------------------ */
  function kicker(i, txt) { return '<p class="sx-kicker"><b>' + nr(i) + '</b>' + txt + '</p>'; }

  function panelStart(st, i) {
    var ss = C.start || {};
    return '<article class="sx-panel sx-panel--start" data-sx="' + i + '" aria-label="' + esc(st.kurz) + '">' +
      '<div class="sx-bg">' + (ss.video ? '<video class="sx-video" muted loop playsinline preload="metadata"' + (S.reduced ? '' : ' autoplay') + ' poster="' + esc(ss.poster || '') + '" src="' + esc(ss.video) + '" aria-hidden="true"></video>' : '') + '</div>' +
      '<div class="sx-text sx-text--light">' + kicker(i, 'Die Reise von ' + esc(K)) +
        '<h2 class="sx-title">Von ' + esc(C.ort) + ' auf deinen <em>Teller.</em></h2>' +
        '<p class="sx-lead">' + esc(ss.text || (p.txt || [])[0] || '') + '</p>' +
        '<p class="sx-lead">' + idee.gr.length + ' Gerichte zeigen dir, was du damit kochst.</p>' +
        (C.geschmack ? '<ul class="sx-tags">' + C.geschmack.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '<p class="sx-hint" aria-hidden="true"><span class="sx-hint__scroll">Weiterscrollen</span><span class="sx-hint__swipe">Zum Weiterwischen</span> ' + SVG.arrow + '</p>' +
      '</div></article>';
  }

  function panelGericht(st, i) {
    var g = st.g, c = st.c;
    var foto = c.bild
      ? '<div class="sx-photo"><img class="sx-photo__img" src="' + IMG + c.bild + '.webp" alt="' + esc((c.titel || g.t) + ' mit ' + K) + '"' + (c.fokus ? ' style="object-position:' + esc(c.fokus) + '"' : '') + ' loading="lazy"></div>'
      : '<div class="sx-photo sx-photo--leer"><div class="sx-photo__ph">' + pic(C.streuer, 'sx-photo__jar', '') + '<span class="pill pill--dark">Foto folgt</span><p>' + esc(c.foto || g.t) + '</p></div></div>';
    return '<article class="sx-panel sx-panel--dish" data-sx="' + i + '" aria-label="' + esc(st.kurz) + '">' +
      '<div class="sx-text">' + kicker(i, esc(ART_LABEL[st.art]) + ' · ' + esc(c.ort || '')) +
        '<h2 class="sx-title sx-title--dish">' + dishTitle(st) + '</h2>' +
        '<p class="sx-orig">' + esc(g.t) + (g.u ? ' · ' + esc(g.u) : '') + '</p>' +
        '<p class="sx-copy">' + esc(sauber(g.x)) + '</p>' +
        '<div class="sx-actions">' + kaufChip(slug, C.streuer, K) +
          (idee.pdf ? '<a class="link sx-pdf" href="' + esc(idee.pdf) + '" target="_blank" rel="noopener">Rezept im PDF ' + SVG.arrow + '</a>' : '') + '</div>' +
      '</div>' + foto + '</article>';
  }

  function panelWuerzen(st, i) {
    var reicht = p.v.map(function (v, k) {
      var gr = gramm(v[1]), kg = DOS && gr ? gr / DOS.g * DOS.kg : 0;
      var bild = gbImg[v[0]];
      return '<div class="sx-size">' + (bild ? pic(bild, 'sx-size__img', '') : '<svg class="sx-size__img sx-size__img--eimer" viewBox="0 0 100 120" aria-hidden="true"><path d="M14 22h72l-8 92H22z" fill="#fffaf3" stroke="#261f1f" stroke-width="3" stroke-linejoin="round"/><path d="M10 14h80v10H10z" fill="#261f1f"/><path d="M22 18c0-16 56-16 56 0" fill="none" stroke="#261f1f" stroke-width="3"/><rect x="26" y="48" width="48" height="34" rx="4" fill="#f68e10"/><text x="50" y="70" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="11" fill="#261f1f">' + esc(S.fmtMenge(v[1])) + '</text></svg>') +
        '<b>' + esc(S.vname(v)) + '</b>' + (kg ? '<span class="sx-size__reicht">reicht für ' + nb(zahl(kg), 'kg') + '</span>' : '') +
        '<button class="sx-size__add" type="button" data-sx-add="' + esc(slug) + '" data-vi="' + k + '" aria-label="' + esc(K + ', ' + S.vname(v) + ' für ' + chf(v[2]) + ' in den Warenkorb') + '"><span class="chf">' + chf(v[2]) + '</span>' + SVG.plus + '</button></div>';
    }).join('');
    var fakten = [];
    if (p.hm) fakten.push(['Passt zu', p.hm]);
    if (p.rt) fakten.push(['Regio-Tipp', p.rt]);
    if (p.fl) fakten.push(['Kochflüssigkeit', p.fl]);
    var senf = /senf/i.test(p.zt || '');
    return '<article class="sx-panel sx-panel--wuerzen" data-sx="' + i + '" aria-label="' + esc(st.kurz) + '">' +
      '<div class="sx-text">' + kicker(i, 'So würzt du') +
        (DOS ? '<h2 class="sx-title">' + nb(DOS.g, 'g') + ' ' + esc(K) + ' pro <em>Kilo.</em></h2>' +
          '<p class="sx-copy">Für ' + nb(zahl(DOS.kg), 'kg') + ' Fleisch oder Fisch: ' + nb(DOS.g, 'g') + ' ' + esc(K) + ' mit ' + nb(DOS.oel, 'g') + ' Öl und ' + nb(DOS.wasser, 'g') + ' Wasser verrühren und das Fleisch oder den Fisch damit marinieren.</p>' +
          '<div class="sx-calc" data-calc><span class="sx-calc__lbl">Wie viel kochst du?</span>' +
            '<div class="qty qty--s"><button type="button" data-calc-m aria-label="Ein halbes Kilo weniger">−</button><output data-calc-kg>1 kg</output><button type="button" data-calc-p aria-label="Ein halbes Kilo mehr">+</button></div>' +
            '<dl class="sx-calc__out"><div><dt>' + esc(K) + '</dt><dd data-calc-g>' + DOS.g + ' g</dd></div><div><dt>Öl</dt><dd data-calc-o>' + DOS.oel + ' g</dd></div><div><dt>Wasser</dt><dd data-calc-w>' + DOS.wasser + ' g</dd></div></dl></div>'
          : '<h2 class="sx-title">So würzt du mit <em>' + esc(K) + '.</em></h2>') +
      '</div>' +
      '<div class="sx-facts">' +
        '<div class="sx-sizes">' + reicht + '</div>' +
        '<dl class="sx-factlist">' +
          (p.zt ? '<div class="sx-factlist__wide"><dt>Zutaten</dt><dd>' + esc(p.zt) + (senf ? '<span class="sx-allerg">Enthält Senf</span>' : '') + '</dd></div>' : '') +
          fakten.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') +
        '</dl>' +
      '</div></article>';
  }

  function panelWelt(st, i) {
    var cards = (C.weiter || []).filter(function (w) { return S.P(w.s); }).map(function (w) {
      var x = S.P(w.s), g = (D.ideen[w.s] || { gr: [] }).gr.filter(function (y) { return y.a === w.gericht; })[0];
      return '<article class="sx-card">' +
        '<a class="sx-card__media' + (w.bild ? '' : ' sx-card__media--jar') + '" href="produkt.html?p=' + esc(w.s) + '" tabindex="-1" aria-hidden="true">' +
          (w.bild ? pic(w.bild, 'sx-card__photo', '', true) : '') + (w.streuer ? pic(w.streuer, 'sx-card__jar', '') : '') + '</a>' +
        '<div class="sx-card__body"><h3><a href="produkt.html?p=' + esc(w.s) + '">' + esc(x.k) + '</a></h3>' +
          (g ? '<p>Zum Beispiel: ' + esc(sauber(g.t)) + '</p>' : '') +
          '<button class="sx-card__add" type="button" data-sx-add="' + esc(w.s) + '" data-vi="0">' + SVG.plus + '<span>' + esc(S.vname(x.v[0])) + ' · <span class="chf">' + chf(x.v[0][2]) + '</span></span></button></div></article>';
    }).join('');
    var kongo = C.kongo && S.P(C.kongo);
    return '<article class="sx-panel sx-panel--welt" data-sx="' + i + '" aria-label="' + esc(st.kurz) + '">' +
      '<div class="sx-text">' + kicker(i, 'Weiterreisen') +
        '<h2 class="sx-title">Mit Redline kochst du die ganze Welt <em>zuhause.</em></h2>' +
        '<p class="sx-copy">Simon Keller war mit seiner Freundin im Westkongo. Beim Essen sagte sie: <q>Das schmeckt, als hättest du es gekocht.</q> Das Kongo-Gewürz hatte er gemischt, ohne je dort gewesen zu sein.</p>' +
        '<p class="sx-copy">Er kennt die Kochmuster der Welt: welche Gewürze und welche Kochflüssigkeit eine Küche ausmachen. Darum schmeckt es mit Redline wie dort.</p>' +
        (kongo ? '<a class="link" href="produkt.html?p=' + esc(C.kongo) + '">Zum Kongo-Gewürz ' + SVG.arrow + '</a>' : '') +
      '</div>' +
      '<div class="sx-more"><p class="sx-more__h">Nach ' + esc(C.ort) + ' weiterreisen</p><div class="sx-cards">' + cards + '</div></div></article>';
  }

  function panelSchenken(st, i) {
    var set = C.set && S.P(C.set), ez = set ? S.einzelpreis(set, set.v[0][0]) : 0;
    var setCard = set ? '<article class="sx-gift">' +
      '<div class="sx-gift__media">' + pic(C.geschenkBild, 'sx-gift__photo', 'Geschenkkarton mit fünf Gewürzstreuern') + (C.setBild ? pic(C.setBild, 'sx-gift__inset', 'Die fünf Streuer im Set') : '') + '</div>' +
      '<div class="sx-gift__body"><p class="sx-gift__k">Im Set</p><h3>' + esc(set.k) + ' als Geschenk</h3>' +
        '<p>' + esc(K) + ' und vier weitere BBQ-Gewürze: ' + esc(set.so.filter(function (s) { return s !== slug && S.P(s); }).map(function (s) { return S.P(s).k; }).join(', ')) + '. Im Geschenkkarton mit Karte und Schleife.</p>' +
        '<button class="btn btn--orange btn--small" type="button" data-sx-add="' + esc(set.s) + '" data-vi="0">' + SVG.plus + '5 Streuer · ' + chf(set.v[0][2]) + '</button>' +
        (ez ? '<small class="sx-gift__statt">statt ' + chf(ez) + ' einzeln</small>' : '') + '</div></article>' : '';
    var anl = ['Happy Birthday', 'Alles Liebe zum Muttertag', 'Danke von Herzen', 'Frohe Weihnachten'];
    var anlKurz = ['Geburtstag', 'Muttertag', 'Danke', 'Weihnachten'];
    var label = '<article class="sx-gift sx-gift--label">' +
      '<div class="sx-gift__media sx-label"><span class="sx-label__wrap">' + pic(C.blanko, 'sx-label__jar', K + ' Streuer mit eigenem Etikett') +
        '<span class="sx-label__tag" aria-hidden="true"><em class="sx-label__brand">Redline · ' + esc(K) + '</em><small data-lb-anlass>' + anl[0] + '</small><strong data-lb-name>Dein Name</strong><i data-lb-jahr>2026</i></span></span></div>' +
      '<div class="sx-gift__body"><p class="sx-gift__k">Persönlich</p><h3>Streuer mit eigenem Etikett</h3>' +
        '<div class="sx-chips" role="group" aria-label="Anlass">' + anlKurz.map(function (a, k) { return '<button type="button" data-lb="' + esc(anl[k]) + '" aria-pressed="' + (k === 0) + '">' + a + '</button>'; }).join('') + '</div>' +
        '<div class="sx-fields"><label>Name<input type="text" maxlength="22" value="Dein Name" data-lb-in="name"></label><label>Jahr<input type="text" maxlength="6" inputmode="numeric" value="2026" data-lb-in="jahr"></label></div>' +
        '<button class="btn btn--ghost btn--small" type="button" data-sx-add="' + esc(slug) + '" data-vi="0">' + SVG.plus + 'Mit Etikett · ' + chf(p.v[0][2]) + '</button>' +
        '<small class="sx-gift__statt">Preis für das Etikett noch offen</small></div></article>';
    return '<article class="sx-panel sx-panel--schenken" data-sx="' + i + '" aria-label="' + esc(st.kurz) + '">' +
      '<div class="sx-text">' + kicker(i, 'Verschenken') +
        '<h2 class="sx-title">' + esc(K) + ' <em>verschenken.</em></h2>' +
        '<p class="sx-copy">Für alle, die gerne grillieren: im Set mit vier weiteren BBQ-Gewürzen oder als einzelner Streuer mit eigenem Etikett.</p>' +
      '</div>' +
      '<div class="sx-gifts">' + setCard + label + '</div></article>';
  }

  var panels = ST.map(function (st, i) {
    return st.typ === 'start' ? panelStart(st, i) : st.typ === 'gericht' ? panelGericht(st, i) : st.typ === 'wuerzen' ? panelWuerzen(st, i) : st.typ === 'welt' ? panelWelt(st, i) : panelSchenken(st, i);
  }).join('');
  var route = ST.map(function (st, i) { return '<button type="button" data-go="' + i + '" aria-label="Station ' + (i + 1) + ': ' + esc(st.kurz) + '"><i></i><span>' + esc(st.kurz) + '</span></button>'; }).join('');
  var story = '<section class="sx" id="geschichte" aria-label="Von ' + esc(C.ort) + ' auf deinen Teller">' +
    '<a class="sx-skip" href="#rezepte">Geschichte überspringen</a>' +
    '<nav class="sx-route" aria-label="Stationen der Reise"><div class="sx-route__in">' + route + '<img class="sx-route__jar" src="' + IMG + C.streuer + '.webp" alt="" aria-hidden="true"></div></nav>' +
    '<div class="sx-track">' + panels + '</div>' +
    '<div class="sx-nav"><button type="button" data-step="-1" aria-label="Vorherige Station">‹</button><span data-pos>1 / ' + N + '</span><button type="button" data-step="1" aria-label="Nächste Station">›</button></div>' +
    '</section>';

  /* ------------------------------------------------------------------
     3 · Danach: Rezepte, Mitbestellen, Zuletzt angesehen
     ------------------------------------------------------------------ */
  var after = '';
  if (rez && rez.n) {
    after += '<section class="sec sec--tight" id="rezepte" aria-labelledby="h-rez"><div class="wrap"><div class="sec-head" style="margin-bottom:24px"><div><p class="eyebrow">Rezepte</p><h2 class="h2" id="h-rez" style="font-size:clamp(1.8rem,3vw,2.6rem);margin:0">' + rez.n + ' Rezepte mit ' + esc(K) + '</h2></div>' +
      '<div class="btn-row">' + (idee.pdf ? '<a class="btn btn--orange btn--small" href="' + esc(idee.pdf) + '" target="_blank" rel="noopener">Die ' + idee.gr.length + ' Gerichte als PDF</a>' : '') +
      '<a class="btn btn--ghost btn--small" href="https://www.waskocheichheute.ch/kochideen/" target="_blank" rel="noopener">Alle Kochideen von Redline</a></div></div>' +
      '<ul class="recipes">' + rez.l.map(function (r) { return '<li><a href="' + esc(r[1]) + '" target="_blank" rel="noopener"><span><b>' + esc(r[0]) + '</b><small>' + esc([r[2], r[3]].filter(Boolean).join(' · ')) + '</small></span>' + SVG.ext + '</a></li>'; }).join('') + '</ul></div></section>';
  } else after += '<span id="rezepte"></span>';
  var mit = S.suggestions(slug, 3);
  if (mit.length) {
    after += '<section class="sec sec--tight sec--cream" aria-labelledby="h-mit"><div class="wrap sx-mit"><div><p class="eyebrow">Direkt mitbestellen</p><h2 class="h2" id="h-mit" style="font-size:clamp(1.8rem,3vw,2.6rem)">Passt auf denselben Grill.</h2><p class="lead" style="margin:0">Ankreuzen und zusammen mit ' + esc(K) + ' in den Warenkorb legen.</p></div>' +
      '<div class="sx-mit__box"><ul class="sx-mit__list">' + mit.map(function (x) {
        return '<li><label><input type="checkbox" value="' + esc(x.s) + '"><span class="sx-mit__jar">' + S.jar(x) + '</span><span><b>' + esc(x.k) + '</b><small>' + esc(S.vname(x.v[0])) + '</small></span><span class="chf">' + chf(x.v[0][2]) + '</span></label></li>';
      }).join('') + '</ul><button class="btn btn--orange" type="button" data-mit disabled>' + SVG.plus + 'Ausgewählte in den Warenkorb</button></div></div></section>';
  }
  var zl = vorher.slice(0, 4).map(S.P);
  if (zl.length) {
    after += '<section class="sec sec--tight" aria-labelledby="h-zl"><div class="wrap"><h2 class="h2" id="h-zl" style="font-size:clamp(1.8rem,3vw,2.6rem)">Zuletzt angesehen</h2><div class="grid">' + zl.map(function (x) { return S.card(x, { short: true }); }).join('') + '</div></div></section>';
  }
  after += '<section class="sec sec--tight" style="padding-top:0"><div class="wrap"><details class="sx-notes"><summary>Hinweise zum Entwurf</summary><ul>' +
    '<li>Gerichte, Texte, Preise, Zutaten, Dosierung und Rezepte stammen aus dem Prototyp des Kunden.</li>' +
    '<li>Die grossen Namen wie «' + esc((C.gerichte.Fisch || {}).titel || '') + ' mit ' + esc(K) + '» sind aus den Gerichtstexten abgeleitet, der Originalname steht jeweils darunter. Bitte freigeben.</li>' +
    '<li>«Reicht für … kg» ist aus der Dosierung gerechnet (' + (DOS ? DOS.g + ' g pro ' + zahl(DOS.kg) + ' kg' : 'ohne Angabe') + ').</li>' +
    '<li>Fotos folgen für: ' + ST.filter(function (x) { return x.typ === 'gericht' && !x.c.bild; }).map(function (x) { return x.g.t; }).join(', ') + '.</li>' +
    '<li>Geschenkkarton und eigenes Etikett sind Ideen aus dem Prototyp. Preis und Umsetzung sind offen.</li>' +
    '<li>Kongo-Geschichte nach Erzählung des Kunden.</li></ul></details></div></section>';

  $('[data-pd]').innerHTML = hero + story + after;

  /* ------------------------------------------------------------------
     Kaufen oben, Leiste unten
     ------------------------------------------------------------------ */
  var stI = 0, box = $('.sx-buybox'), qv = $('[data-qv]');
  var sb = document.createElement('div');
  sb.className = 'stickybuy'; sb.setAttribute('aria-hidden', 'true');
  sb.innerHTML = '<div class="wrap stickybuy__in">' + pic(C.streuer, 'sx-sb__jar', '') + '<span class="stickybuy__name"><b>' + esc(K) + '</b><small data-sb-v>' + esc(S.vname(v0)) + ' · ' + chf(v0[2]) + '</small></span><button class="btn btn--orange" type="button" data-sb-add tabindex="-1">In den Warenkorb</button></div>';
  document.body.appendChild(sb);
  function pick(i) {
    stI = i; box.setAttribute('data-i', i);
    var v = p.v[i];
    $$('[data-gb]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-gb') === i)); });
    $('[data-pd-price]').textContent = chf(v[2]);
    $('[data-pd-per]').textContent = S.vname(v) + (S.per100(v) ? ', ' + S.per100(v) : '') + ', inkl. MWST';
    $('[data-sb-v]', sb).textContent = S.vname(v) + ' · ' + chf(v[2]);
  }
  $$('[data-gb]').forEach(function (b) { b.addEventListener('click', function () { pick(+b.getAttribute('data-gb')); }); });
  $('[data-qm]').addEventListener('click', function () { qv.value = Math.max(1, (+qv.value || 1) - 1); });
  $('[data-qp]').addEventListener('click', function () { qv.value = Math.min(99, (+qv.value || 1) + 1); });
  $('[data-pd-add]').addEventListener('click', function () { S.add(p.s, stI, Math.max(1, Math.min(99, +qv.value || 1))); });
  $('[data-sb-add]', sb).addEventListener('click', function () { S.add(p.s, stI, 1); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
      sb.classList.toggle('is-on', past); sb.setAttribute('aria-hidden', String(!past));
      $('[data-sb-add]', sb).tabIndex = past ? 0 : -1;
    }).observe($('.pd__cta'));
  }

  /* Kauf-Knöpfe in der Geschichte */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sx-add]');
    if (!b) return;
    S.add(b.getAttribute('data-sx-add'), +b.getAttribute('data-vi') || 0, 1);
    b.classList.add('is-done');
    setTimeout(function () { b.classList.remove('is-done'); }, 1800);
  });

  /* Dosierrechner */
  var calc = $('[data-calc]');
  if (calc && DOS) {
    var kg = DOS.kg;
    var setKg = function (v) {
      kg = Math.max(0.5, Math.min(10, v));
      var f = kg / DOS.kg;
      $('[data-calc-kg]').textContent = zahl(kg) + ' kg';
      $('[data-calc-g]').textContent = zahl(DOS.g * f) + ' g';
      $('[data-calc-o]').textContent = zahl(DOS.oel * f) + ' g';
      $('[data-calc-w]').textContent = zahl(DOS.wasser * f) + ' g';
    };
    $('[data-calc-m]').addEventListener('click', function () { setKg(kg - 0.5); });
    $('[data-calc-p]').addEventListener('click', function () { setKg(kg + 0.5); });
  }

  /* Eigenes Etikett */
  $$('[data-lb]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-lb]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $('[data-lb-anlass]').textContent = b.getAttribute('data-lb');
    });
  });
  $$('[data-lb-in]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var t = inp.value.trim();
      $(inp.getAttribute('data-lb-in') === 'name' ? '[data-lb-name]' : '[data-lb-jahr]').textContent = t || (inp.getAttribute('data-lb-in') === 'name' ? 'Dein Name' : '');
    });
  });

  /* Direkt mitbestellen */
  var mb = $('[data-mit]');
  if (mb) {
    var boxes = $$('.sx-mit__list input');
    boxes.forEach(function (c) { c.addEventListener('change', function () { mb.disabled = !boxes.some(function (x) { return x.checked; }); }); });
    mb.addEventListener('click', function () {
      var sel = boxes.filter(function (x) { return x.checked; });
      sel.forEach(function (x) { S.add(x.value, 0, 1); x.checked = false; });
      mb.disabled = true;
    });
  }

  /* ------------------------------------------------------------------
     Bewegung: Reise seitwärts
     ------------------------------------------------------------------ */
  var sx = $('.sx'), track = $('.sx-track', sx), routeBtns = $$('.sx-route [data-go]', sx), rjar = $('.sx-route__jar', sx), pos = $('[data-pos]', sx);
  var cur = -1;
  function setActive(i) {
    if (i === cur) return; cur = i;
    routeBtns.forEach(function (b, k) { b.setAttribute('aria-current', String(k === i)); b.classList.toggle('is-past', k < i); });
    var b = routeBtns[i];
    if (b && rjar) rjar.style.transform = 'translateX(' + (b.offsetLeft + b.offsetWidth / 2) + 'px)';
    if (pos) pos.textContent = (i + 1) + ' / ' + N;
    var vid = $('.sx-video', sx);
    if (vid && !S.reduced) { if (i === 0) { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); } else vid.pause(); }
  }

  var gsap = window.gsap, STg = window.ScrollTrigger, tl = null;
  function pinned() { return sx.classList.contains('is-pinned'); }
  function go(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (pinned() && tl) {
      var st = tl.scrollTrigger;
      window.scrollTo({ top: st.start + (st.end - st.start) * i / (N - 1) + 1, behavior: S.reduced ? 'auto' : 'smooth' });
    } else {
      var r = sx.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.4 || r.bottom < window.innerHeight * 0.4) window.scrollTo({ top: r.top + window.scrollY - 70, behavior: S.reduced ? 'auto' : 'smooth' });
      track.scrollTo({ left: track.clientWidth * i, behavior: S.reduced ? 'auto' : 'smooth' });
    }
  }
  $$('[data-go]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); go(+b.getAttribute('data-go')); }); });
  $$('[data-step]', sx).forEach(function (b) { b.addEventListener('click', function () { go(cur + (+b.getAttribute('data-step'))); }); });

  /* Wischen (Handy, weniger Bewegung, ohne GSAP) */
  var raf = 0;
  track.addEventListener('scroll', function () {
    if (pinned()) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { setActive(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))); });
  }, { passive: true });
  track.addEventListener('keydown', function (e) {
    if (pinned()) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });
  setActive(0);

  if (!gsap || !STg || S.reduced) return;
  gsap.registerPlugin(STg);
  var mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (min-height: 600px)', function () {
    sx.classList.add('is-pinned');
    track.scrollLeft = 0;
    var dir = 1, points = [];
    for (var k = 0; k < N; k++) points.push(k / (N - 1));
    function snapTo(v) {
      var best = points[0], bd = 9;
      points.forEach(function (q) { var d = Math.abs(q - v); if (d < bd) { bd = d; best = q; } });
      if (bd < 0.012) return best;
      var next = dir > 0 ? points.filter(function (q) { return q > v; }) : points.filter(function (q) { return q < v; }).reverse();
      return next.length ? next[0] : best;
    }
    tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sx, start: 'top top',
        end: function () { return '+=' + Math.round(window.innerWidth * (N - 1) * 1.05); },
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        snap: { snapTo: snapTo, inertia: false, duration: { min: 0.3, max: 0.9 }, delay: 0.1, ease: 'power2.inOut' },
        onUpdate: function (self) { if (self.direction) dir = self.direction; setActive(Math.round(self.progress * (N - 1))); }
      }
    });
    tl.to(track, { x: function () { return -window.innerWidth * (N - 1); }, duration: N - 1 }, 0);
    /* Fotos ziehen etwas langsamer mit, Texte kommen leicht verzögert */
    $$('.sx-panel', track).forEach(function (pn, i) {
      var img = $('.sx-photo__img', pn);
      if (img) tl.fromTo(img, { xPercent: i ? 4 : 0 }, { xPercent: -4, duration: i ? 2 : 1 }, Math.max(0, i - 1));
      if (i) tl.fromTo($('.sx-text', pn), { x: 140, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, i - 0.55);
    });
    return function () { sx.classList.remove('is-pinned'); tl = null; gsap.set(track, { clearProps: 'transform' }); };
  });
  window.addEventListener('load', function () { STg.refresh(); });
})();
