/* ==========================================================================
   Redline · Shop · Kopf, Suche, Warenkorb und alle Shop-Seiten
   Daten: assets/daten.js (aus dem Shop-Prototyp). Zeichnungen: art.js und
   gerichte.js von waskocheichheute.ch. Keine Bestellung, der Warenkorb liegt
   nur im Browser.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.SHOP, A = window.Art, G = window.Gerichte;
  var WKIH = '../waskocheichheute-welten/';
  var VERSAND = 9.9, GRATIS_AB = 80, STREUER_PREIS = 6.9;
  var PAGE = document.body.getAttribute('data-page');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]motion=0/.test(location.search);
  if (reduced) document.documentElement.classList.add('no-motion');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function chf(n) { return 'CHF ' + Number(n).toFixed(2); }
  function param(k) { return new URLSearchParams(location.search).get(k); }

  /* ------------------------------------------------------------------
     Ordnung des Sortiments
     ------------------------------------------------------------------ */
  var BY = {};
  D.produkte.forEach(function (p) { BY[p.s] = p; });
  function P(s) { return BY[s]; }
  var GEWUERZE = D.produkte.filter(function (p) { return p.g[0] === 'gewuerz'; });

  var ARTEN = [
    { id: 'grill', t: 'Grill & BBQ', h: 'Grillgewürze und Rubs', d: 'Für Steak, Poulet, Spiesse, Smoker und Ofen. Jedes Redline-Gewürz kann auf den Grill, diese sind dafür gemacht.' },
    { id: 'curry', t: 'Currys & Masala', h: 'Currys und Masalas', d: 'Currypulver und Masalas aus Indien, Südostasien, Afrika und der Karibik. Mild, mit Kokosmilch oder Tomate.' },
    { id: 'wok', t: 'Wok & Asia', h: 'Wok- und Asia-Gewürze', d: 'Für Wok, Streetfood und asiatische Pfannengerichte, typisch mit Soja oder Kokosmilch.' },
    { id: 'fisch', t: 'Fisch & Seafood', h: 'Gewürze für Fisch und Seafood', d: 'Mischungen für Fisch, Lachs, Crevetten und Meeresfrüchte.' },
    { id: 'pfanne', t: 'Pfanne & Eintopf', h: 'Gewürze für Pfanne, Eintopf und Ofen', d: 'Gulasch, Fajita, Paella, Tajine und Schmortöpfe.' },
    { id: 'klassiker', t: 'Schweizer Klassiker', h: 'Schweizer Klassiker', d: 'Helvetica, 1 für Alles, Raclette und Fondue, Swiss BBQ.' },
    { id: 'salz', t: 'Salz, Pfeffer & Chili', h: 'Salz, Pfeffer und Chili', d: 'Gewürzsalze mit Himalaya-Salz, Kampot-Pfeffer und Chili.' },
    { id: 'kraeuter', t: 'Kräuter, Salat & Dips', h: 'Kräuter, Salat und Dips', d: 'Kräutermischungen, Dressings, Dips, Saucen und Suppen.' },
    { id: 'pasta', t: 'Pasta, Pizza & Tomaten', h: 'Pasta, Pizza und Tomaten', d: 'Italienische Kräuter, Tomaten- und Pizzagewürze.' },
    { id: 'suess', t: 'Süss & Glühwein', h: 'Süsses und Glühwein', d: 'Glühwein, Punsch und Gewürz für Desserts und Früchte.' }
  ];
  var ICON = {
    poulet: '<path d="M3 12.5c0-3.6 3.2-6 7-5.6 4 .4 7.8 2.3 10.6 4.6.6.5.5 1.3-.2 1.6-3 1.4-6.4 3-9.8 3.6C6.6 17.3 3 15.8 3 12.5z" fill="#261f1f"/><path d="M6.5 14c3 .8 7 0 10.5-1.8" stroke="#fbf6ec" stroke-width="1.3" fill="none" stroke-linecap="round"/>',
    rind: '<path d="M5 9c3-4 11-4 14 0 2 3 0 8-5 8-3 0-4-2-7-2-3 0-4-3-2-6z" fill="#261f1f"/><circle cx="14" cy="11" r="2.2" fill="#fbf6ec"/>',
    fisch: '<path d="M3 12c4-5 10-5 14 0-4 5-10 5-14 0z" fill="#261f1f"/><path d="M17 12l4-4v8z" fill="#261f1f"/><circle cx="7" cy="11" r="1.2" fill="#fbf6ec"/>',
    gemuese: '<path d="M12 21c-5-2-7-8-4-12l8 8c-1 2-2 3-4 4z" fill="#261f1f"/><path d="M14 9c1-3 3-5 6-5-1 3-2 5-5 6M14 9c-1-2-1-4 0-6" stroke="#261f1f" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
    schwein: '<ellipse cx="12" cy="13" rx="8" ry="6" fill="#261f1f"/><ellipse cx="12" cy="14" rx="3.2" ry="2.2" fill="#fbf6ec"/><circle cx="10.8" cy="14" r=".7" fill="#261f1f"/><circle cx="13.2" cy="14" r=".7" fill="#261f1f"/><path d="M6 8l-1-4 4 2M18 8l1-4-4 2" fill="#261f1f"/>',
    lamm: '<circle cx="8" cy="10" r="3.4" fill="#261f1f"/><circle cx="12" cy="8.6" r="3.6" fill="#261f1f"/><circle cx="16" cy="10" r="3.4" fill="#261f1f"/><circle cx="10" cy="14" r="3.6" fill="#261f1f"/><circle cx="14.4" cy="14" r="3.6" fill="#261f1f"/><ellipse cx="12" cy="13" rx="2.4" ry="3" fill="#fbf6ec"/>',
    wild: '<path d="M12 21c-3 0-5-3-5-6 0-2 2-4 5-4s5 2 5 4c0 3-2 6-5 6z" fill="#261f1f"/><path d="M9 11L6 5M6 5L4 6M6 5L7 3M15 11l3-6M18 5l2 1M18 5l-1-2" stroke="#261f1f" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    grill: '<path d="M12 21c-5 0-7-3-6-7 1-3 4-5 4-9 3 2 4 5 3 8 1-1 2-2 2-4 2 2 3 5 2 8-1 3-2 4-5 4z" fill="#f68e10"/><path d="M12 21c-2 0-3-2-2-4 0-1 1-2 2-4 1 2 2 3 2 4 0 2-1 4-2 4z" fill="#ffd166"/>'
  };
  var ZU = [{ id: 'poulet', t: 'Poulet' }, { id: 'rind', t: 'Rind' }, { id: 'schwein', t: 'Schwein' }, { id: 'lamm', t: 'Lamm' }, { id: 'wild', t: 'Wild' }, { id: 'fisch', t: 'Fisch' }, { id: 'gemuese', t: 'Gemüse' }];
  var FL = [{ id: 'rahm', t: 'Rahm', in: 'an Rahmsauce' }, { id: 'tomate', t: 'Tomate', in: 'an Tomatensauce' }, { id: 'kokos', t: 'Kokosmilch', in: 'in Kokosmilch' }, { id: 'soja', t: 'Soja', in: 'mit Soja' }];
  var REG = [{ id: 'schweiz', t: 'Schweiz' }, { id: 'europa', t: 'Europa' }, { id: 'asien', t: 'Asien' }, { id: 'afrika', t: 'Afrika' }, { id: 'nordamerika', t: 'Nordamerika und Karibik' }, { id: 'suedamerika', t: 'Südamerika' }, { id: 'australien', t: 'Australien' }];
  var GROESSE = [{ id: 'Streuer', t: 'Streuer' }, { id: 'Mühle', t: 'Mühle' }, { id: 'Dose', t: 'Dose' }, { id: 'Eimer', t: 'Eimer' }];
  var GEBINDE_FUER = { Streuer: 'für den Haushalt', 'Mühle': 'für den Tisch', Dose: 'für Vielkocher und Vereine', Eimer: 'für Gastro und Grossküche', '5 Streuer': 'fünf Streuer im Set', '5 Dosen': 'fünf Dosen im Set' };
  var GRUPPEN = {
    gewuerze: { t: 'Gewürze', h1: 'Alle Redline-<em>Gewürze</em>', d: 'Über 100 Mischungen aus aller Welt, von Simon Keller in Ebikon entwickelt. Die meisten als Streuer für CHF 6.90, viele auch als Dose und als Eimer für die Gastronomie.' },
    sets: { t: 'Sets & Geschenke', h1: 'Fünf Gewürze im Set, günstiger als <em>einzeln</em>', d: 'Fünf Streuer für CHF 24.90 statt CHF 34.50. Zum Kennenlernen oder als Geschenk für Leute, die gerne kochen.' },
    feines: { t: 'Snacks & Feines', h1: 'Gewürzte Nüsse und ausgesuchte <em>Delikatessen</em>', d: 'Redline-Nüsse mit eigenen Mischungen, dazu Bresaola, Salami, Schinken und Speck aus Italien.' },
    kueche: { t: 'Küche & Zubehör', h1: 'Mühlen, Gläser und Zubehör für die <em>Küche</em>', d: 'Gewürzmühlen aus Schweizer Handwerk, Ersatzteile für die Redline-Gläser, Bretter aus Schweizer Holz und Helfer für Grill und Küche.' },
    grill: { t: 'Grill & Feuer', h1: 'Grills, Smoker und alles fürs <em>Feuer</em>', d: 'Jiko-Holzöfen, handgefertigte Design-Grills und Smoker, dazu Holzkohle, Räucherzubehör und Holz-Heizer für die Terrasse.' }
  };
  var SUCH_ANLASS = [
    [/grillier|grillen|bbq|barbecue/, { art: 'grill' }, 'zum Grillieren'], [/raclette|fondue/, { s: ['raclette-fondue', 'helvetica-110g', '1fueralles-gewuerzmischung-90g'] }, 'zu Raclette und Fondue'],
    [/weihnacht|advent|glühwein|punsch/, { art: 'suess' }, 'für Weihnachten'], [/gastro|grossküche|restaurant|verein/, { size: 'Eimer' }, 'als Eimer für die Gastro'],
    [/vegan|vegetar|veggie|gemüse/, { zu: 'gemuese' }, 'passt zu Gemüse'], [/apéro|apero|snack|nüsse/, { g: 'feines' }, 'für den Apéro'],
    [/geschenk|schenken/, { g: 'sets' }, 'als Geschenk'], [/curry/, { art: 'curry' }, 'Curry'], [/wok/, { art: 'wok' }, 'für den Wok']
  ];

  /* Beliebtheit: Bestseller, dann Gewürze mit Menü-Idee, dann der Rest */
  function rank(p) {
    var b = D.bestseller.indexOf(p.s);
    return (b >= 0 ? 100 - b : 0) + (D.ideen[p.s] ? 20 : 0) + (D.rezepte[p.s] ? Math.min(D.rezepte[p.s].n, 15) : 0) + (p.him ? -5 : 0);
  }
  function byRank(a, b) { return rank(b) - rank(a); }

  /* ------------------------------------------------------------------
     Darstellung: Namen, Gläser, Bilder, Preise
     ------------------------------------------------------------------ */
  function title(p) { return p.g[0] === 'gewuerz' ? 'Redline ' + p.k : (p.g[0] === 'set' ? p.k : p.n.split(/[,:|]/)[0].trim()); }
  function sub(p) {
    if (p.g[0] === 'gewuerz') return p.u.replace(/^[&,:\s]+/, '');
    if (p.g[0] === 'set') return p.so && p.so.length ? p.so.map(function (s) { return P(s) ? (P(s).k || P(s).n.replace(/ gewürzt| gesalzen/, '')) : s; }).join(', ') : '';
    var k = (p.kt || [])[0];
    return k ? D.kats[k] || '' : '';
  }
  function jar(p, label) {
    return A.jarSvg({ name: p.k, spice: p.c, label: label ? 'Redline ' + p.k : '' });
  }
  function setJars(p) {
    var sp = (p.so || []).map(P).filter(function (x) { return x && x.g[0] === 'gewuerz'; });
    return sp.length ? sp.map(function (x) { return jar(x); }).join('') : '';
  }
  function img(p, big) { return '<img src="' + esc(big ? p.img : p.imgk) + '" alt="' + esc(title(p)) + '" loading="lazy">'; }
  function thumb(p) {
    if (p.g[0] === 'gewuerz') return jar(p);
    if (p.g[0] === 'set' && setJars(p)) return setJars(p);
    return img(p);
  }
  function fmtMenge(m) {
    var x = /^([\d.]+)(kg|g)$/.exec(m || '');
    if (!x) return m || '';
    var g = parseFloat(x[1]) * (x[2] === 'kg' ? 1000 : 1);
    return g >= 1000 ? String(g / 1000).replace('.', ',') + ' kg' : g + ' g';
  }
  function vname(v) { return v[0] + (v[1] ? ' ' + fmtMenge(v[1]) : ''); }
  function minPrice(p) { return p.v.length ? Math.min.apply(null, p.v.map(function (v) { return v[2]; })) : 1e9; }
  function priceLabel(p) { return !p.v.length ? 'Auf Anfrage' : p.v.length > 3 ? 'ab ' + chf(minPrice(p)) : chf(p.v[0][2]); }
  function einzelpreis(p, art) {
    /* Summe der Einzelpreise der fünf Sorten im Set */
    var sum = 0, ok = true;
    (p.so || []).forEach(function (s) {
      var x = P(s); if (!x || x.g[0] !== 'gewuerz') { ok = false; return; } /* Nüsse: Beutelgrösse im Set unbekannt, darum kein Vergleich */
      var v = x.v.filter(function (vv) { return art === '5 Dosen' ? vv[0] === 'Dose' : (vv[0] === 'Streuer' || vv[0] === 'Beutel'); })[0];
      if (v) sum += v[2]; else ok = false;
    });
    return ok && sum ? Math.round(sum * 100) / 100 : 0;
  }
  function badges(p) {
    var b = [];
    if (D.bestseller.indexOf(p.s) >= 0) b.push('<span class="pill pill--orange">Bestseller</span>');
    if (p.s === 'die-welt-der-pilze-ab-35' || (BY['die-welt-der-pilze-ab-35'].so || []).indexOf(p.s) >= 0) b.push('<span class="pill pill--dark">Monatshit</span>');
    if (p.him) b.push('<span class="pill pill--olive">Himalaya-Salz</span>');
    return b.join('');
  }
  function regionName(id) { var r = REG.filter(function (x) { return x.id === id; })[0]; return r ? r.t : ''; }
  function artName(id) { var a = ARTEN.filter(function (x) { return x.id === id; })[0]; return a ? a.t : ''; }
  function eyebrow(p) {
    if (p.g[0] === 'gewuerz') return [regionName(p.rh), p.a[0] ? artName(p.a[0]) : ''].filter(Boolean).join(' · ');
    if (p.g[0] === 'set') return 'Set mit fünf Sorten';
    return GRUPPEN[p.g[0]] ? GRUPPEN[p.g[0]].t : '';
  }
  function fitText(p) {
    if (!p.hm) return '';
    return 'Passt zu ' + p.hm.replace(/\.$/, '');
  }
  function url(p) { return 'produkt.html?p=' + encodeURIComponent(p.s); }
  function per100(v) { return v[3] ? 'CHF ' + v[3].toFixed(2) + ' / 100 g' : ''; }

  var SVG = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11.2L21 8H7"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10l1.5-5h13L20 10"/><path d="M4 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 6 0"/><path d="M5 12v8h14v-8M10 20v-5h4v5"/></svg>',
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l7-7"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
  };

  /* ------------------------------------------------------------------
     Warenkorb (nur im Browser)
     ------------------------------------------------------------------ */
  var KEY = 'redline-shop-korb';
  function korb() { try { return JSON.parse(localStorage.getItem(KEY) || '[]').filter(function (x) { return P(x.s) && P(x.s).v[x.i]; }); } catch (e) { return []; } }
  function save(k) { try { localStorage.setItem(KEY, JSON.stringify(k)); } catch (e) { /* ohne Speicher */ } updateCount(true); }
  function add(s, i, q) {
    var k = korb(), hit = k.filter(function (x) { return x.s === s && x.i === i; })[0];
    if (hit) hit.q += q; else k.push({ s: s, i: i, q: q });
    save(k);
    openDrawer(s, i, q);
  }
  function setQ(s, i, q) { var k = korb(); k.forEach(function (x) { if (x.s === s && x.i === i) x.q = q; }); save(k.filter(function (x) { return x.q > 0; })); }
  function sum(k) { return Math.round((k || korb()).reduce(function (a, x) { return a + P(x.s).v[x.i][2] * x.q; }, 0) * 100) / 100; }
  function count() { return korb().reduce(function (a, x) { return a + x.q; }, 0); }
  function versand(t) { return t >= GRATIS_AB || t === 0 ? 0 : VERSAND; }
  function updateCount(bump) {
    $$('[data-count]').forEach(function (el) {
      el.textContent = count();
      if (bump) { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }
    });
  }
  function shipHtml(t) {
    var rest = Math.max(0, GRATIS_AB - t), pct = Math.min(100, t / GRATIS_AB * 100);
    return '<div class="ship"><div class="ship__bar"><i style="width:' + pct + '%"></i></div><p>' +
      (rest > 0 ? 'Noch <b>' + chf(rest) + '</b> bis zum Gratisversand.' : '<b>Gratisversand.</b> Dein Warenkorb ist über CHF 80.') + '</p></div>';
  }

  /* ------------------------------------------------------------------
     Kopf und Fuss
     ------------------------------------------------------------------ */
  function artCount(id) { return GEWUERZE.filter(function (p) { return p.a.indexOf(id) >= 0; }).length; }
  function regCount(id) { return GEWUERZE.filter(function (p) { return p.r.indexOf(id) >= 0; }).length; }
  function header() {
    var cur = PAGE === 'kategorie' ? (param('k') || 'gewuerze') : (PAGE === 'produkt' && P(param('p') || '') ? { gewuerz: 'gewuerze', set: 'sets' }[P(param('p')).g[0]] || P(param('p')).g[0] : '');
    function c(k) { return cur === k ? ' aria-current="page"' : ''; }
    var mega = '<div class="mega" id="mega"><div class="mega__arten"><h4>Nach Art</h4><ul>' +
      ARTEN.map(function (a) { return '<li><a href="kategorie.html?art=' + a.id + '">' + a.t + '<small>' + artCount(a.id) + '</small></a></li>'; }).join('') +
      '</ul></div><div><h4>Nach Region</h4><ul>' + REG.map(function (r) { return '<li><a href="kategorie.html?r=' + r.id + '">' + r.t + '<small>' + regCount(r.id) + '</small></a></li>'; }).join('') +
      '<li><a href="kategorie.html"><b>Alle ' + GEWUERZE.length + ' Gewürze</b></a></li></ul></div>' +
      '<a class="mega__promo" href="index.html#finden"><svg viewBox="0 0 300 90" aria-hidden="true">' + [0, 1, 2].map(function (i) { var p = [BY['helvetica-110g'], BY['kambotscha-wok'], BY['argentinien']][i]; return '<g transform="translate(' + (96 + i * 40) + ' ' + (i === 1 ? 0 : 8) + ') scale(.27)">' + A.jar({ name: p.k, spice: p.c }) + '</g>'; }).join('') + '</svg><b>Welches Gewürz passt zu deinem Gericht?</b><span>Drei Fragen, dann siehst du die passenden Mischungen.</span></a></div>';
    var h = '<header class="top" id="top">' +
      '<div class="util"><div class="util__in"><span>' + SVG.check + 'Versand CHF 9.90, gratis ab CHF 80</span><span>' + SVG.truck + 'Heute bestellt, morgen unterwegs</span><span>' + SVG.shop + 'Auch bei Coop erhältlich</span><span><a href="tel:+41414420155">' + SVG.tel + ' 041 442 01 55</a></span></div></div>' +
      '<div class="wrap top__in">' +
        '<a class="brand" href="index.html" aria-label="Redline Shop, zur Startseite"><img src="' + WKIH + 'assets/img/logo.svg" alt="" width="174" height="136"><span class="brand__shop">Shop</span></a>' +
        '<div class="search" role="search"><form action="kategorie.html" autocomplete="off"><label class="sr-only" for="q">Suche</label>' + SVG.search +
          '<input id="q" name="q" type="search" placeholder="Gewürz, Gericht oder Zutat, z. B. Raclette" aria-autocomplete="list" aria-controls="suggest" value="' + esc(PAGE === 'kategorie' ? param('q') || '' : '') + '"><button type="submit">Suchen</button></form>' +
          '<div class="suggest" id="suggest" hidden></div></div>' +
        '<div class="tools"><a class="tool tool--ideas" href="' + WKIH + 'kochideen.html">' + SVG.book + '<span class="tool__label">Kochideen</span></a>' +
          '<a class="tool tool--cart" href="warenkorb.html" aria-label="Warenkorb">' + SVG.cart + '<span class="tool__label">Warenkorb</span><span class="tool__n" data-count>0</span></a>' +
          '<button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menü öffnen"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button></div>' +
      '</div>' +
      '<nav class="cats" aria-label="Sortiment"><div class="wrap cats__in">' +
        '<div class="dd" id="dd"><button type="button" aria-expanded="false" aria-controls="mega"' + c('gewuerze') + '>Gewürze ' + SVG.down + '</button>' + mega + '</div>' +
        '<a href="kategorie.html?k=sets"' + c('sets') + '>Sets & Geschenke</a>' +
        '<a href="kategorie.html?k=feines"' + c('feines') + '>Snacks & Feines</a>' +
        '<a href="kategorie.html?k=kueche"' + c('kueche') + '>Küche & Zubehör</a>' +
        '<a href="kategorie.html?k=grill"' + c('grill') + '>Grill & Feuer</a>' +
        '<a class="cats__ext" href="' + WKIH + 'startseite.html">Was koche ich heute? ↗</a>' +
        '<a class="cats__find" href="index.html#finden">Gewürz finden</a>' +
      '</div></nav>' +
      '<nav class="mnav" id="mnav" aria-label="Sortiment mobil">' +
        '<a href="kategorie.html">Gewürze</a>' + ARTEN.slice(0, 6).map(function (a) { return '<a class="mnav__sub" href="kategorie.html?art=' + a.id + '">' + a.t + '</a>'; }).join('') +
        '<a href="kategorie.html?k=sets">Sets & Geschenke</a><a href="kategorie.html?k=feines">Snacks & Feines</a><a href="kategorie.html?k=kueche">Küche & Zubehör</a><a href="kategorie.html?k=grill">Grill & Feuer</a>' +
        '<a href="index.html#finden">Gewürz finden</a><a href="' + WKIH + 'kochideen.html">Kochideen ↗</a>' +
      '</nav></header>';
    return h;
  }
  function footer() {
    return '<section class="sec sec--tight" aria-labelledby="h-nl"><div class="wrap"><div class="news news--wide">' +
      '<p class="eyebrow" style="color: var(--orange);">Newsletter</p><h2 class="h2" id="h-nl">Neue Mischungen und Sets per <em>E-Mail.</em></h2>' +
      '<p>Etwa einmal im Monat: neue Mischungen, Sets zur Saison und Kochideen. Jederzeit abbestellbar.</p>' +
      '<form><label class="sr-only" for="nl">E-Mail-Adresse</label><input id="nl" type="email" placeholder="deine@email.ch" autocomplete="email" required><button class="btn btn--orange" type="submit">Anmelden</button></form></div></div></section>' +
      '<footer class="foot2"><div class="wrap"><p class="foot2__claim">Regionale Zutaten. Globaler <em>Geschmack.</em></p><div class="foot2__grid">' +
      '<div><img class="foot2__logo" src="' + WKIH + 'assets/img/logo.svg" alt="Redline · Was koche ich heute?" width="174" height="136"><p>FoodKreator AG<br>Sagenhofweg 7, 6030 Ebikon<br><a href="tel:+41414420155">+41 41 442 01 55</a><br><a href="mailto:info@foodkreator.ch">info@foodkreator.ch</a></p></div>' +
      '<div><h4>Sortiment</h4><ul><li><a href="kategorie.html">Gewürze</a></li><li><a href="kategorie.html?k=sets">Sets & Geschenke</a></li><li><a href="kategorie.html?k=feines">Snacks & Feines</a></li><li><a href="kategorie.html?k=kueche">Küche & Zubehör</a></li><li><a href="kategorie.html?k=grill">Grill & Feuer</a></li></ul></div>' +
      '<div><h4>Service</h4><ul><li><a href="warenkorb.html">Warenkorb</a></li><li><a href="#">Versand und Zahlung</a></li><li><a href="#">Fragen und Antworten</a></li><li><a href="' + WKIH + 'ueber-uns.html#kontakt">Verkaufsstellen</a></li><li><a href="' + WKIH + 'ueber-uns.html#kontakt">Kontakt</a></li></ul></div>' +
      '<div><h4>Kochen</h4><p>Zu jedem Gewürz Gerichte, Rezepte und die Logik dahinter.</p><a class="link" href="' + WKIH + 'startseite.html">Zu waskocheichheute.ch ' + SVG.arrow + '</a><h4 style="margin-top:22px">Eigenes Produkt?</h4><p>FoodKreator entwickelt und produziert es mit Ihnen.</p><a class="link" href="../foodkreator/index.html">Zu foodkreator.ch ' + SVG.arrow + '</a></div>' +
      '</div><div class="foot2__legal"><span>© FoodKreator AG · Entwurf, keine Bestellung möglich</span><nav aria-label="Rechtliches"><a href="#">Impressum</a><a href="#">AGB</a><a href="#">Datenschutz</a></nav></div></div></footer>';
  }
  function drawerHtml() {
    return '<div class="drawer" id="drawer" aria-hidden="true"><div class="drawer__bg" data-close></div><aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-h">' +
      '<div class="drawer__head"><h2 id="drawer-h"><i>' + SVG.check + '</i>Im Warenkorb</h2><button class="drawer__x" type="button" data-close aria-label="Schliessen">×</button></div>' +
      '<div data-drawer-body></div></aside></div>';
  }

  /* ------------------------------------------------------------------
     Karten
     ------------------------------------------------------------------ */
  function card(p, o) {
    o = o || {};
    var isG = p.g[0] === 'gewuerz', isSet = p.g[0] === 'set', jars = isSet ? setJars(p) : '';
    var media = isG ? '<a class="card__media" href="' + url(p) + '" style="--c:' + p.c + '" tabindex="-1" aria-hidden="true">' + jar(p) + '</a>'
      : (jars ? '<a class="card__media card__media--set" href="' + url(p) + '" tabindex="-1" aria-hidden="true">' + jars + '</a>'
        : '<a class="card__media card__media--photo" href="' + url(p) + '" tabindex="-1" aria-hidden="true">' + img(p) + '</a>');
    var vs = p.v.slice(0, 3), toggle = p.v.length > 1 && p.v.length <= 3;
    var sizes = toggle ? '<div class="sizes" role="group" aria-label="Grösse">' + vs.map(function (v, i) {
      return '<button type="button" data-size="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(v[0].replace(/^5 /, '5 ')) + (v[1] ? '<small>' + fmtMenge(v[1]) + '</small>' : '') + '</button>';
    }).join('') + '</div>' : '';
    var priceTxt = priceLabel(p);
    var small = !p.v.length ? 'Sonderanfertigung' : p.v.length > 3 ? p.v.length + ' Varianten' : (isSet && einzelpreis(p, p.v[0][0]) ? 'statt ' + chf(einzelpreis(p, p.v[0][0])) + ' einzeln' : per100(p.v[0]) || vname(p.v[0]));
    return '<article class="card" data-s="' + p.s + '" data-i="0">' +
      '<div class="card__badges">' + badges(p) + '</div>' + media +
      '<div class="card__body"><p class="card__eyebrow">' + esc(eyebrow(p)) + '</p>' +
      '<h3 class="card__title"><a href="' + url(p) + '">' + esc(title(p)) + '</a></h3>' +
      (sub(p) ? '<p class="card__sub">' + esc(sub(p)) + '</p>' : '') +
      (isG && fitText(p) && !o.short ? '<p class="card__fit">' + esc(fitText(p)) + '</p>' : '') +
      '<div class="card__buy">' + sizes + '<div class="card__row"><p class="card__price chf" data-price>' + priceTxt + '<small data-small>' + esc(small) + '</small></p>' +
      (!p.v.length || p.v.length > 3 ? '<a class="add" href="' + url(p) + '">' + (p.v.length ? 'Auswählen' : 'Anfragen') + '</a>' : '<button class="add" type="button" data-add>' + SVG.plus + 'In den Warenkorb</button>') + '</div></div></div></article>';
  }
  function row(p, tag) {
    var v = p.v[0];
    var isSet = p.g[0] === 'set', pic = p.g[0] === 'gewuerz' ? jar(p) : (isSet && P(p.so[0]) && P(p.so[0]).g[0] === 'gewuerz' ? jar(P(p.so[0])) : img(p));
    return '<li class="row"><span>' + pic + '</span><span><b><a href="' + url(p) + '">' + esc(title(p)) + '</a></b><small>' + esc(isSet ? vname(v) + ' im Set' : sub(p) + ' · ' + vname(v)) + '</small></span>' +
      (tag ? '<span class="pill">' + esc(tag) + '</span>' : '<span></span>') +
      '<button class="add" type="button" data-quick="' + p.s + '" aria-label="' + esc(title(p)) + ', ' + esc(vname(v)) + ' für ' + chf(v[2]) + ' in den Warenkorb">' + SVG.plus + '<span class="chf">' + chf(v[2]) + '</span></button></li>';
  }

  /* Klicks auf Karten: Grösse wählen, in den Warenkorb */
  document.addEventListener('click', function (e) {
    var sb = e.target.closest('[data-size]');
    if (sb) {
      var c = sb.closest('[data-s]'), p = P(c.getAttribute('data-s')), i = +sb.getAttribute('data-size'), v = p.v[i];
      c.setAttribute('data-i', i);
      $$('[data-size]', c).forEach(function (b) { b.setAttribute('aria-pressed', String(b === sb)); });
      var pr = $('[data-price]', c);
      if (pr) pr.innerHTML = chf(v[2]) + '<small data-small>' + esc(p.g[0] === 'set' ? (einzelpreis(p, v[0]) ? 'statt ' + chf(einzelpreis(p, v[0])) + ' einzeln' : '') : per100(v) || vname(v)) + '</small>';
      return;
    }
    var ab = e.target.closest('[data-add]');
    if (ab) {
      var cc = ab.closest('[data-s]');
      add(cc.getAttribute('data-s'), +cc.getAttribute('data-i') || 0, 1);
      ab.classList.add('is-done'); ab.innerHTML = SVG.check + 'Im Warenkorb';
      setTimeout(function () { ab.classList.remove('is-done'); ab.innerHTML = SVG.plus + 'In den Warenkorb'; }, 2200);
      return;
    }
    var qb = e.target.closest('[data-quick]');
    if (qb) { add(qb.getAttribute('data-quick'), 0, 1); return; }
    if (e.target.closest('[data-close]')) closeDrawer();
  });

  /* ------------------------------------------------------------------
     Mini-Warenkorb nach dem Hinzufügen
     ------------------------------------------------------------------ */
  var lastFocus = null;
  function lineImg(p) {
    var cls = p.g[0] === 'set' && setJars(p) ? ' line__img--set' : '';
    return '<span class="line__img' + cls + '">' + thumb(p) + '</span>';
  }
  function suggestions(s, n) {
    var p = P(s), pool;
    if (p.g[0] === 'gewuerz') {
      pool = GEWUERZE.filter(function (x) { return x.s !== s && !x.him && x.a.some(function (a) { return p.a.indexOf(a) >= 0; }); });
      if (pool.length < n) pool = pool.concat(GEWUERZE.filter(function (x) { return x.s !== s && pool.indexOf(x) < 0; }));
    } else pool = GEWUERZE.slice();
    return pool.sort(byRank).slice(0, n);
  }
  function openDrawer(s, i, q) {
    var dr = $('#drawer'), p = P(s), v = p.v[i], t = sum();
    var setFor = D.produkte.filter(function (x) { return x.g[0] === 'set' && (x.so || []).indexOf(s) >= 0; })[0];
    $('[data-drawer-body]', dr).innerHTML =
      '<div class="drawer__item">' + lineImg(p) + '<div><b>' + esc(title(p)) + '</b><small>' + esc(vname(v)) + ' · ' + q + ' × ' + chf(v[2]) + '</small></div></div>' +
      '<div class="drawer__tot"><span>Warenkorb</span><span class="chf">' + chf(t) + '</span></div>' + shipHtml(t) +
      '<div class="drawer__btns"><a class="btn btn--orange" href="warenkorb.html">Zum Warenkorb</a><button class="btn btn--ghost" type="button" data-close>Weiter einkaufen</button></div>' +
      '<div class="drawer__also"><h3>' + (setFor ? 'Im Set günstiger' : 'Passt dazu') + '</h3><ul class="fd__list" style="min-height:0">' +
      (setFor ? row(setFor, 'statt ' + chf(einzelpreis(setFor, '5 Streuer'))) : '') + suggestions(s, setFor ? 2 : 3).map(function (x) { return row(x); }).join('') + '</ul></div>';
    lastFocus = document.activeElement;
    dr.classList.add('is-open'); dr.setAttribute('aria-hidden', 'false');
    setTimeout(function () { var b = $('.drawer__x', dr); if (b) b.focus(); }, 60);
  }
  function closeDrawer() {
    var dr = $('#drawer'); if (!dr.classList.contains('is-open')) return;
    dr.classList.remove('is-open'); dr.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    if (PAGE === 'warenkorb') renderKorb();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeMega(); } });

  /* ------------------------------------------------------------------
     Suche: Name, Zutaten, Passt zu, Gerichte, Rezepte und Anlässe
     ------------------------------------------------------------------ */
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var INDEX = D.produkte.map(function (p) {
    var ideen = D.ideen[p.s] ? D.ideen[p.s].gr.map(function (g) { return g.t; }) : [];
    var rez = D.rezepte[p.s] ? D.rezepte[p.s].l.map(function (r) { return r[0]; }) : [];
    return { p: p, name: norm(title(p) + ' ' + p.n), sub: norm(p.u || ''), hm: norm(p.hm), zt: norm(p.zt), arten: norm((p.a || []).map(artName).join(' ') + ' ' + (p.r || []).map(regionName).join(' ')), ideen: ideen, rez: rez };
  });
  function search(q) {
    var n = norm(q).trim();
    if (n.length < 2) return [];
    var words = n.split(/\s+/), anlass = SUCH_ANLASS.filter(function (a) { return a[0].test(n); })[0], out = [];
    var lang = words.filter(function (w) { return w.length >= 3; });
    INDEX.forEach(function (x) {
      var score = 0, why = '', all = x.name + ' ' + x.sub + ' ' + x.arten + ' ' + x.hm + ' ' + x.zt + ' ' + norm(x.ideen.join(' ') + ' ' + x.rez.join(' '));
      /* mehrere Wörter: jedes muss irgendwo vorkommen */
      if (lang.length > 1 && !lang.every(function (w) { return all.indexOf(w) >= 0; })) return;
      var ganz = x.ideen.concat(x.rez).filter(function (t) { return norm(t).indexOf(n) >= 0; })[0];
      if (ganz && words.length > 1) { score += 12; why = (x.ideen.indexOf(ganz) >= 0 ? 'Gericht: ' : 'Rezept: ') + ganz; }
      words.forEach(function (w) {
        if (x.name.indexOf(w) >= 0) { score += x.name.indexOf(w) === 0 || x.name.indexOf(' ' + w) >= 0 ? 14 : 8; }
        else if (x.sub.indexOf(w) >= 0) { score += 7; }
        else if (x.arten.indexOf(w) >= 0) { score += 6; why = why || 'Art oder Region'; }
        else if (x.hm.indexOf(w) >= 0) { score += 5; why = why || 'Passt zu ' + x.p.hm; }
        else {
          var g = x.ideen.filter(function (t) { return norm(t).indexOf(w) >= 0; })[0];
          var r = x.rez.filter(function (t) { return norm(t).indexOf(w) >= 0; })[0];
          if (g) { score += 5; why = why || 'Gericht: ' + g; }
          else if (r) { score += 4; why = why || 'Rezept: ' + r; }
          else if (x.zt.indexOf(w) >= 0) { score += 2; why = why || 'Zutat: ' + w; }
        }
      });
      if (anlass) {
        var a = anlass[1], p = x.p, hit = (a.art && p.a && p.a.indexOf(a.art) >= 0) || (a.s && a.s.indexOf(p.s) >= 0) || (a.zu && p.z && p.z.indexOf(a.zu) >= 0) ||
          (a.g && (a.g === 'sets' ? p.g[0] === 'set' : p.g.indexOf(a.g) >= 0)) || (a.size && p.v.some(function (v) { return v[0] === a.size; }));
        if (hit) { score += 9; why = why || anlass[2]; }
      }
      if (score) out.push({ p: x.p, score: score + rank(x.p) / 40, why: why });
    });
    return out.sort(function (a, b) { return b.score - a.score; });
  }
  function initSearch() {
    var input = $('#q'), box = $('#suggest'), act = -1;
    function render() {
      var q = input.value, res = search(q).slice(0, 6);
      act = -1;
      if (!q.trim() || q.trim().length < 2) { box.hidden = true; return; }
      box.innerHTML = (res.length ? '<p class="suggest__h">Treffer</p>' + res.map(function (r) {
        return '<a href="' + url(r.p) + '"><span>' + (r.p.g[0] === 'gewuerz' ? jar(r.p) : (r.p.g[0] === 'set' ? jar(P(r.p.so[0])) : img(r.p))) + '</span><span><b>' + esc(title(r.p)) + '</b><small>' + esc(r.why || r.p.u || sub(r.p)) + '</small></span><span class="chf">' + priceLabel(r.p) + '</span></a>';
      }).join('') : '<p class="suggest__h">Kein Treffer für «' + esc(q) + '»</p>') +
        '<a class="suggest__all" href="kategorie.html?q=' + encodeURIComponent(q) + '">Alle Treffer für «' + esc(q) + '» anzeigen</a>';
      box.hidden = false;
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (e) {
      var links = $$('a', box);
      if (box.hidden || !links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); act = (act + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle('is-active', i === act); });
      } else if (e.key === 'Enter' && act >= 0) { e.preventDefault(); location.href = links[act].href; }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.hidden = true; });
  }

  /* ------------------------------------------------------------------
     Kopf: Verhalten
     ------------------------------------------------------------------ */
  function closeMega() { var dd = $('#dd'); if (dd) { dd.classList.remove('is-open'); $('button', dd).setAttribute('aria-expanded', 'false'); } }
  function initHeader() {
    var top = $('#top'), lastY = window.scrollY;
    function measure() { document.body.style.setProperty('--toph', top.offsetHeight + 'px'); }
    measure(); window.addEventListener('resize', measure);
    if (document.fonts) document.fonts.ready.then(measure);
    window.addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      var keep = y < top.offsetHeight || $('.mnav').classList.contains('is-open') || !$('#suggest').hidden || $('#dd').classList.contains('is-open');
      top.classList.toggle('is-hidden', dy > 0 && !keep);
      lastY = y;
    }, { passive: true });
    if (window.parent !== window) {
      var report = function () { window.parent.postMessage({ wsScroll: window.scrollY }, '*'); };
      window.addEventListener('scroll', report, { passive: true }); report();
    }
    var burger = $('.burger'), mnav = $('.mnav');
    burger.addEventListener('click', function () {
      var open = !mnav.classList.contains('is-open');
      mnav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    });
    var dd = $('#dd'), btn = $('button', dd), timer;
    function openMega() { clearTimeout(timer); dd.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    btn.addEventListener('click', function () { if (dd.classList.contains('is-open')) closeMega(); else openMega(); });
    dd.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) openMega(); });
    dd.addEventListener('mouseleave', function () { timer = setTimeout(closeMega, 180); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#dd')) closeMega(); });
    initSearch();
    updateCount(false);
    $$('form').forEach(function (f) {
      if (f.closest('.search') || f.hasAttribute('data-keep')) return;
      f.addEventListener('submit', function (e) { e.preventDefault(); var b = f.querySelector('button'); if (b) { b.textContent = 'Danke!'; b.disabled = true; } });
    });
  }

  /* ------------------------------------------------------------------
     Kleine Zeichnungen
     ------------------------------------------------------------------ */
  function jarAt(p, x, y, s, r) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (r || 0) + ') scale(' + s + ')"><g transform="translate(-60 -150)">' + A.jar({ name: p.k, spice: p.c }) + '</g></g>'; }
  function dishAt(id, x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + G.draw(id) + '</g>'; }
  function icon(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON[id] || '') + '</svg>'; }
  function liqIcon(id, bg) { return '<svg viewBox="-56 -56 112 112" aria-hidden="true">' + (id === 'sauce' ? A.liquidIcon('sauce', '#e8a24a') : A.liquidIcon(id)) + '</svg>'; }
  function artIcon(a) {
    var P2 = A.parts;
    if (a === 'Fleisch') return '<svg class="dish__icon" viewBox="-90 -70 180 140" aria-hidden="true">' + P2.steak(false) + '</svg>';
    if (a === 'Fisch') return '<svg class="dish__icon" viewBox="-110 -60 220 120" aria-hidden="true">' + P2.fish(false) + '</svg>';
    if (a === 'Veggie') return '<svg class="dish__icon" viewBox="-30 -30 60 60" aria-hidden="true">' + P2.broccoli() + '</svg>';
    if (a === 'Lokal') return '<svg class="dish__icon" viewBox="-30 -30 60 60" aria-hidden="true"><rect x="-22" y="-22" width="44" height="44" rx="8" fill="#d7261e"/><path d="M-4 -14h8v10h10v8H4v10h-8V4h-10v-8h10z" fill="#fff"/></svg>';
    return '<svg class="dish__icon" viewBox="0 0 24 24" aria-hidden="true">' + ICON.grill + '</svg>';
  }

  /* ------------------------------------------------------------------
     Startseite
     ------------------------------------------------------------------ */
  function renderStart() {
    var pilz = P('die-welt-der-pilze-ab-35'), sorten = pilz.so.map(P);
    /* Monatshit */
    var art = '<svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
      dishAt('flan', 110, 250, 0.52) + dishAt('pfifferling', 530, 250, 0.52) +
      sorten.map(function (p, i) { return jarAt(p, 200 + i * 60, 214 - (i === 2 ? 26 : (i % 2 ? 14 : 0)), 0.62, (i - 2) * 6); }).join('') + '</svg>';
    $('[data-hit]').innerHTML = '<div class="hit__art">' + art + '<span class="pill pill--orange hit__label">Monatshit im Herbst</span></div>' +
      '<div class="hit__body" data-s="' + pilz.s + '" data-i="0"><p class="hit__k">Set mit fünf Gewürzen</p><h2>Die Welt der Pilze</h2>' +
      '<p>' + sorten.map(function (p) { return 'Redline ' + p.k; }).join(', ') + '. Dazu fünf Pilzgerichte als Rezept.</p>' +
      '<div class="hit__opts" role="group" aria-label="Grösse">' + pilz.v.map(function (v, i) {
        var e = einzelpreis(pilz, v[0]);
        return '<button class="hit__opt" type="button" data-hit-size="' + i + '" aria-pressed="' + (i === 0) + '"><b>' + esc(v[0]) + '</b><span class="chf">' + chf(v[2]) + '</span>' + (e ? '<span>statt ' + chf(e) + ' einzeln</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="hit__cta"><button class="btn btn--orange" type="button" data-add>' + SVG.plus + 'In den Warenkorb</button><a class="link" href="' + url(pilz) + '">Set ansehen ' + SVG.arrow + '</a></div></div>';
    $('[data-hit]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-hit-size]'); if (!b) return;
      $('[data-hit] .hit__body').setAttribute('data-i', b.getAttribute('data-hit-size'));
      $$('[data-hit-size]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });

    /* Schnellwahl im Kopf */
    $('[data-quick-arten]').innerHTML = ['grill', 'curry', 'wok', 'klassiker', 'fisch'].map(function (id) {
      var top = GEWUERZE.filter(function (p) { return p.a.indexOf(id) >= 0; }).sort(byRank)[0];
      return '<li><a href="kategorie.html?art=' + id + '"><i><svg viewBox="-12 -14 144 328" aria-hidden="true">' + A.jar({ name: top.k, spice: top.c }) + '</svg></i>' + artName(id) + ' <small>' + artCount(id) + '</small></a></li>';
    }).join('');

    /* Nach Art */
    $('[data-arten]').innerHTML = ARTEN.map(function (a) {
      var top = GEWUERZE.filter(function (p) { return p.a.indexOf(a.id) >= 0 && !p.him; }).sort(byRank).slice(0, 3);
      return '<a class="art" href="kategorie.html?art=' + a.id + '"><span class="art__jars">' + top.map(function (p) { return jar(p); }).join('') + '</span><b>' + a.t + '</b><small>' + artCount(a.id) + ' Mischungen</small></a>';
    }).join('');
    $('[data-regions]').innerHTML = '<span>Oder nach Region:</span>' + REG.map(function (r) { return '<a href="kategorie.html?r=' + r.id + '">' + r.t + ' <small>' + regCount(r.id) + '</small></a>'; }).join('');

    /* Gewürz finden */
    initFinder($('[data-finder]'));

    /* Bestseller, Sets */
    $('[data-bestseller]').innerHTML = D.bestseller.map(function (s) { return card(P(s)); }).join('');
    var sets = D.produkte.filter(function (p) { return p.g[0] === 'set'; });
    $('[data-sets]').innerHTML = sets.map(setCard).join('');

    /* Brücke */
    $('[data-bridge]').innerHTML = '<svg viewBox="-235 -235 470 470" aria-hidden="true">' + G.draw('pollo') + '</svg><svg viewBox="-235 -235 470 470" aria-hidden="true">' + G.draw('goldenriver') + '</svg><svg viewBox="-235 -235 470 470" aria-hidden="true">' + G.draw('geschnetzeltes') + '</svg>';
  }
  function setCard(p) {
    var jars = setJars(p), e = einzelpreis(p, p.v[0][0]), bg = { 'die-welt-der-pilze-ab-35': '#efe4cf', 'probierset-asia-total-35': '#dcefe6', 'probierset-bbq-um-die-welt-total-35': '#f3d9c6', 'probierset-um-die-welt': '#fbe3c2', 'probierset-curry-um-die-welt-total-35': '#f6e7b8' }[p.s] || '#fff';
    return '<article class="setc" data-s="' + p.s + '" data-i="0"><div class="setc__art" style="--sbg:' + bg + '">' + (jars || img(p)) + (e ? '<span class="pill pill--dark setc__save">Du sparst ' + chf(e - p.v[0][2]) + '</span>' : '') + '</div>' +
      '<div class="setc__body"><h3><a href="' + url(p) + '">' + esc(p.k) + '</a></h3><p class="setc__sorts">' + esc(sub(p)) + '</p>' +
      '<div class="setc__buy">' + (p.v.length > 1 ? '<div class="sizes" role="group" aria-label="Grösse">' + p.v.map(function (v, i) { return '<button type="button" data-size="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(v[0]) + '</button>'; }).join('') + '</div>' : '') +
      '<div class="card__row"><p class="card__price chf" data-price>' + chf(p.v[0][2]) + '<small data-small>' + (e ? 'statt ' + chf(e) + ' einzeln' : '') + '</small></p><button class="add" type="button" data-add>' + SVG.plus + 'In den Warenkorb</button></div></div></div></article>';
  }

  function initFinder(root) {
    var st = { p: 'poulet', m: 'sauce', l: 'rahm' };
    var qP = $('[data-q="p"]', root), qM = $('[data-q="m"]', root), qL = $('[data-q="l"]', root);
    function opt(label, on, iconHtml, fn) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt'; b.setAttribute('aria-pressed', String(on));
      b.innerHTML = '<i>' + iconHtml + '</i>' + label;
      b.addEventListener('click', fn);
      return b;
    }
    function fill(q, list) { var box = $('.opts', q); box.innerHTML = ''; list.forEach(function (b) { box.appendChild(b); }); }
    function render() {
      fill(qP, ZU.map(function (z) { return opt(z.t, st.p === z.id, icon(z.id), function () { st.p = st.p === z.id ? '' : z.id; render(); }); }));
      fill(qM, [opt('Braten oder grillieren', st.m === 'grill', icon('grill'), function () { st.m = 'grill'; render(); }),
        opt('In einer Sauce', st.m === 'sauce', liqIcon('sauce'), function () { st.m = 'sauce'; if (!st.l) st.l = 'rahm'; render(); })]);
      fill(qL, FL.map(function (f) { return opt(f.t, st.m === 'sauce' && st.l === f.id, liqIcon(f.id), function () { st.m = 'sauce'; st.l = f.id; render(); }); }));
      qL.classList.toggle('is-off', st.m !== 'sauce');
      var list = GEWUERZE.filter(function (p) { return !p.him && (!st.p || p.z.indexOf(st.p) >= 0); });
      function typ(p) { return st.m === 'grill' ? p.a.indexOf('grill') >= 0 : p.f.indexOf(st.l) >= 0; }
      list.sort(function (a, b) { return (typ(b) - typ(a)) || byRank(a, b); });
      var nTyp = list.filter(typ).length, zu = ZU.filter(function (z) { return z.id === st.p; })[0], fl = FL.filter(function (f) { return f.id === st.l; })[0];
      var was = zu ? zu.t : 'dein Gericht';
      $('[data-fd-title]', root).textContent = list.length + ' Gewürze passen zu ' + was + (st.m === 'grill' ? ' vom Grill' : ' ' + fl.in) + '.';
      $('[data-fd-note]', root).textContent = st.m === 'grill'
        ? 'Oben die ' + nTyp + ' Grillgewürze. Jedes Redline-Gewürz kann auf den Grill, diese sind dafür gemacht.'
        : 'Oben die ' + nTyp + ', die typisch ' + fl.in + ' sind. Mit Wasser geht jedes Gewürz.';
      $('[data-fd-list]', root).innerHTML = list.slice(0, 6).map(function (p) { return row(p, typ(p) ? (st.m === 'grill' ? 'Grill-Rub' : 'typisch ' + fl.t) : ''); }).join('');
      var q = [];
      if (st.p) q.push('zu=' + st.p);
      if (st.m === 'grill') q.push('art=grill'); else q.push('fl=' + st.l);
      $('[data-fd-all]', root).href = 'kategorie.html?' + q.join('&');
      $('[data-fd-all]', root).innerHTML = 'Alle ' + nTyp + (st.m === 'grill' ? ' Grillgewürze' : ' typischen') + ' ansehen ' + SVG.arrow;
    }
    render();
  }

  /* ------------------------------------------------------------------
     Kategorie, Suche
     ------------------------------------------------------------------ */
  function renderKategorie() {
    var q = param('q') || '', k = param('k') || 'gewuerze';
    if (!GRUPPEN[k]) k = 'gewuerze';
    var st = { art: param('art') || '', zu: param('zu') || '', fl: param('fl') || '', r: param('r') || '', size: param('size') || '', kt: param('kt') || '', sort: param('sort') || 'rank', show: 24 };
    var gew = k === 'gewuerze' && !q;
    var base = q ? search(q).map(function (x) { return x.p; }) : (k === 'gewuerze' ? GEWUERZE : D.produkte.filter(function (p) { return k === 'sets' ? p.g[0] === 'set' : p.g.indexOf(k) >= 0; }));
    var whyMap = {};
    if (q) search(q).forEach(function (x) { whyMap[x.p.s] = x.why; });
    var grp = GRUPPEN[k];

    function match(p, skip) {
      if (st.art && skip !== 'art' && (p.a || []).indexOf(st.art) < 0) return false;
      if (st.zu && skip !== 'zu' && (p.z || []).indexOf(st.zu) < 0) return false;
      if (st.fl && skip !== 'fl' && (p.f || []).indexOf(st.fl) < 0) return false;
      if (st.r && skip !== 'r' && (p.r || []).indexOf(st.r) < 0) return false;
      if (st.size && skip !== 'size' && !p.v.some(function (v) { return v[0] === st.size; })) return false;
      if (st.kt && skip !== 'kt' && (p.kt || []).indexOf(st.kt) < 0) return false;
      return true;
    }
    function groups() {
      if (gew) return [
        { key: 'art', t: 'Nach Art', list: ARTEN },
        { key: 'zu', t: 'Passt zu', list: ZU, icon: true },
        { key: 'fl', t: 'Typische Kochflüssigkeit', list: FL },
        { key: 'r', t: 'Region', list: REG },
        { key: 'size', t: 'Grösse', list: GROESSE }
      ];
      if (q) return [];
      var kts = {};
      base.forEach(function (p) { (p.kt || []).forEach(function (x) { kts[x] = 1; }); });
      var list = Object.keys(kts).map(function (x) { return { id: x, t: D.kats[x] || x }; });
      return list.length > 1 ? [{ key: 'kt', t: 'Bereich', list: list }] : [];
    }
    function head() {
      var a = ARTEN.filter(function (x) { return x.id === st.art; })[0], h1, lead, crumbs = '<li><a href="index.html">Shop</a></li>';
      if (q) { h1 = 'Suche: «' + esc(q) + '»'; lead = 'Gefunden über Name, Zutaten, «Passt zu», die Gerichte zu jedem Gewürz und die Rezepte auf waskocheichheute.ch.'; crumbs += '<li aria-current="page">Suche</li>'; }
      else if (gew && a && !st.zu && !st.fl && !st.r) { h1 = esc(a.h); lead = a.d; crumbs += '<li><a href="kategorie.html">Gewürze</a></li><li aria-current="page">' + a.t + '</li>'; }
      else if (gew && st.r && !st.art && !st.zu && !st.fl) { h1 = 'Gewürze aus ' + (st.r === 'schweiz' ? 'der Schweiz' : st.r === 'nordamerika' ? 'Nordamerika und der Karibik' : regionName(st.r)); lead = 'Mischungen, die nach den Küchen dieser Region gewürzt sind. Gekocht wird damit überall.'; crumbs += '<li><a href="kategorie.html">Gewürze</a></li><li aria-current="page">' + regionName(st.r) + '</li>'; }
      else if (gew && st.zu && !st.art && !st.fl && !st.r) { var z = ZU.filter(function (x) { return x.id === st.zu; })[0]; h1 = 'Gewürze für ' + z.t; lead = 'Alle Mischungen, bei denen die Produktbeschreibung unter «Harmoniert mit» ' + z.t + ' nennt.'; crumbs += '<li><a href="kategorie.html">Gewürze</a></li><li aria-current="page">' + z.t + '</li>'; }
      else { h1 = grp.h1; lead = grp.d; crumbs += '<li aria-current="page">' + grp.t + '</li>'; }
      $('[data-kh]').innerHTML = '<ol class="crumbs">' + crumbs + '</ol><h1>' + h1 + '</h1><p class="lead">' + esc(lead) + '</p>';
      document.title = (q ? 'Suche ' + q : (a && gew ? a.t : grp.t)) + ' · Redline Shop';
    }
    function sync() {
      var u = new URLSearchParams();
      if (q) u.set('q', q); else if (k !== 'gewuerze') u.set('k', k);
      ['art', 'zu', 'fl', 'r', 'size', 'kt'].forEach(function (x) { if (st[x]) u.set(x, st[x]); });
      if (st.sort !== 'rank') u.set('sort', st.sort);
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    }
    function render() {
      head();
      var fbox = $('[data-filters]'), gs = groups();
      fbox.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><b style="font:800 18px var(--display)">Filter</b><button class="drawer__x filters__close" type="button" data-fclose aria-label="Filter schliessen" style="display:none">×</button></div>' +
        gs.map(function (g) {
          return '<fieldset class="fgroup"><legend>' + g.t + '</legend><div class="fopts">' + g.list.map(function (o) {
            var n = base.filter(function (p) { return match(p, g.key); }).filter(function (p) {
              if (g.key === 'art') return (p.a || []).indexOf(o.id) >= 0; if (g.key === 'zu') return (p.z || []).indexOf(o.id) >= 0;
              if (g.key === 'fl') return (p.f || []).indexOf(o.id) >= 0; if (g.key === 'r') return (p.r || []).indexOf(o.id) >= 0;
              if (g.key === 'size') return p.v.some(function (v) { return v[0] === o.id; }); return (p.kt || []).indexOf(o.id) >= 0;
            }).length;
            var on = st[g.key] === o.id;
            return '<button class="fopt" type="button" data-f="' + g.key + '" data-v="' + o.id + '" aria-pressed="' + on + '"' + (!n && !on ? ' disabled' : '') + '>' + o.t + ' <small>' + n + '</small></button>';
          }).join('') + '</div>' + (g.key === 'fl' ? '<p class="hint-proto" style="margin:8px 0 0">Laut Produktbeschreibung. Mit Wasser geht jedes Gewürz.</p>' : '') + '</fieldset>';
        }).join('') + (gs.length ? '' : '<p class="hint-proto" style="margin:0">Keine Filter für diese Auswahl.</p>');
      $('[data-kl]').classList.toggle('kl--nofilter', !gs.length);
      var list = base.filter(function (p) { return match(p); });
      if (!q || st.sort !== 'rank') list.sort(st.sort === 'name' ? function (a, b) { return title(a).localeCompare(title(b), 'de'); } : st.sort === 'preis' ? function (a, b) { return minPrice(a) - minPrice(b) || byRank(a, b); } : byRank);
      var active = gs.filter(function (g) { return st[g.key]; }).map(function (g) { var o = g.list.filter(function (x) { return x.id === st[g.key]; })[0]; return '<button type="button" data-f="' + g.key + '" data-v="' + st[g.key] + '">' + (o ? o.t : st[g.key]) + ' <span aria-hidden="true">×</span><span class="sr-only">entfernen</span></button>'; });
      $('[data-tb]').innerHTML = '<div><p class="tb__count" aria-live="polite">' + list.length + ' ' + (list.length === 1 ? 'Artikel' : 'Artikel') + '</p><div class="tb__active">' + active.join('') + (active.length > 1 ? '<button class="tb__reset" type="button" data-freset>Alle Filter löschen</button>' : '') + '</div></div>' +
        '<div style="display:flex;gap:8px;align-items:center"><button class="btn btn--ghost btn--small ftoggle" type="button" data-fopen>Filter' + (active.length ? ' (' + active.length + ')' : '') + '</button>' +
        '<label class="sr-only" for="sort">Sortierung</label><select id="sort"><option value="rank"' + (st.sort === 'rank' ? ' selected' : '') + '>' + (q ? 'Beste Treffer' : 'Beliebt zuerst') + '</option><option value="preis"' + (st.sort === 'preis' ? ' selected' : '') + '>Preis aufsteigend</option><option value="name"' + (st.sort === 'name' ? ' selected' : '') + '>Name A bis Z</option></select></div>';
      $('#sort').addEventListener('change', function () { st.sort = this.value; st.show = 24; render(); sync(); });
      var grid = $('[data-grid]');
      if (!list.length) {
        grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><p>' + (q ? 'Zu «' + esc(q) + '» haben wir nichts gefunden. Versuch es mit einem Gericht, einer Zutat oder einem Land.' : 'Mit diesen Filtern gibt es keinen Artikel.') + '</p><a class="btn btn--orange" href="index.html#finden">Gewürz finden</a></div>';
      } else {
        grid.innerHTML = list.slice(0, st.show).map(function (p) {
          var c = card(p);
          if (q && whyMap[p.s]) c = c.replace('<p class="card__eyebrow">', '<p class="card__eyebrow" style="color:var(--orange-deep)">' + esc(whyMap[p.s]) + '</p><p class="card__eyebrow" hidden>');
          return c;
        }).join('');
      }
      var more = $('[data-more]');
      more.hidden = list.length <= st.show;
      more.innerHTML = '<button class="btn btn--ghost" type="button">Weitere ' + Math.min(24, list.length - st.show) + ' von ' + (list.length - st.show) + ' zeigen</button>';
    }
    document.addEventListener('click', function (e) {
      var f = e.target.closest('[data-f]');
      if (f) { var key = f.getAttribute('data-f'), v = f.getAttribute('data-v'); st[key] = st[key] === v ? '' : v; st.show = 24; render(); sync(); return; }
      if (e.target.closest('[data-freset]')) { ['art', 'zu', 'fl', 'r', 'size', 'kt'].forEach(function (x) { st[x] = ''; }); render(); sync(); return; }
      if (e.target.closest('[data-more] button')) { st.show += 24; render(); return; }
      if (e.target.closest('[data-fopen]')) { $('[data-filters]').classList.add('is-open'); return; }
      if (e.target.closest('[data-fclose]')) { $('[data-filters]').classList.remove('is-open'); }
    });
    render();
  }

  /* ------------------------------------------------------------------
     Produktseite
     ------------------------------------------------------------------ */
  function renderProdukt() {
    var p = P(param('p') || '') || P('helvetica-110g'), isG = p.g[0] === 'gewuerz', isSet = p.g[0] === 'set';
    var idee = D.ideen[p.s], rez = D.rezepte[p.s], st = { i: 0 };
    document.title = title(p) + ' · Redline Shop';
    var grp = isG ? 'gewuerze' : isSet ? 'sets' : p.g[0];
    var crumbs = '<ol class="crumbs"><li><a href="index.html">Shop</a></li><li><a href="kategorie.html' + (grp === 'gewuerze' ? '' : '?k=' + grp) + '">' + GRUPPEN[grp].t + '</a></li>' +
      (isG && p.a[0] ? '<li><a href="kategorie.html?art=' + p.a[0] + '">' + artName(p.a[0]) + '</a></li>' : '') + '<li aria-current="page">' + esc(title(p)) + '</li></ol>';

    /* Bühne */
    var stage;
    if (isG) {
      var dish = idee && idee.gr.filter(function (g) { return g.d; })[0];
      stage = '<div class="stage" style="--c:' + p.c + '"><div class="stage__badges">' + badges(p) + '</div><svg viewBox="0 0 600 550" aria-hidden="true">' +
        (dish ? dishAt(dish.d, 250, 330, 0.95) + jarAt(p, 450, 300, 1.25, 4) : '<ellipse cx="300" cy="470" rx="120" ry="22" fill="#261f1f" opacity=".14"/>' + jarAt(p, 300, 290, 1.6, -3)) + '</svg>' +
        (dish ? '<span class="stage__note">Im Bild: ' + esc(dish.t) + '</span>' : '') + '</div>';
    } else if (isSet && setJars(p)) {
      var sp = p.so.map(P);
      stage = '<div class="stage" style="--c:#c9a26a"><div class="stage__badges">' + badges(p) + '</div><svg viewBox="0 0 600 550" aria-hidden="true"><ellipse cx="300" cy="470" rx="230" ry="26" fill="#261f1f" opacity=".14"/>' +
        sp.map(function (x, i) { return jarAt(x, 140 + i * 80, 300 - (i === 2 ? 30 : i % 2 ? 16 : 0), 1, (i - 2) * 5); }).join('') + '</svg></div>';
    } else stage = '<div class="stage stage--photo"><div class="stage__badges">' + badges(p) + '</div>' + img(p, true) + '</div>';

    /* Kaufen (Sonderanfertigungen ohne Preis: Anfrage) */
    if (!p.v.length) p = Object.assign({}, p, { v: [['Auf Anfrage', '', 0, 0]], anfrage: true });
    var v0 = p.v[0];
    var gb = '<fieldset class="gb" style="--n:' + Math.min(p.v.length, 3) + '"><legend>' + (p.v.length > 1 ? 'Grösse wählen' : 'Grösse') + '</legend>' + p.v.map(function (v, i) {
      var e = isSet ? einzelpreis(p, v[0]) : 0;
      return '<button type="button" data-gb="' + i + '" aria-pressed="' + (i === 0) + '"><b>' + esc(vname(v)) + '</b><span class="chf">' + chf(v[2]) + '</span><span>' + esc(e ? 'statt ' + chf(e) + ' einzeln' : [per100(v), GEBINDE_FUER[v[0]] || ''].filter(Boolean).join(', ')) + '</span></button>';
    }).join('') + '</fieldset>';
    var facts = [];
    if (p.hm) facts.push(['Passt zu', esc(p.hm)]);
    if (p.fl) facts.push(['Typische Kochflüssigkeit', (p.f || []).map(function (f) { return '<span class="liq">' + liqIcon(f) + '</span>'; }).join('') + ' ' + esc(p.fl)]);
    if (p.rt) facts.push(['Regio-Tipp', esc(p.rt)]);
    if (p.ds) facts.push(['Dosierung', esc(p.ds)]);
    else if (p.mr) facts.push(['Marinieren', esc(p.mr)]);
    var buy = '<div class="pd__buy' + (p.anfrage ? ' is-anfrage' : '') + '" data-s="' + p.s + '" data-i="0"><div class="pd__eyebrow">' + (isG ? [regionName(p.rh)].concat(p.a.map(artName)).filter(Boolean).map(function (t) { return '<span class="pill">' + esc(t) + '</span>'; }).join('') : '<span class="pill">' + esc(eyebrow(p)) + '</span>') + '</div>' +
      '<h1>' + esc(title(p)) + '</h1>' + (sub(p) ? '<p class="pd__sub">' + esc(isSet ? '5 Streuer: ' + sub(p) : sub(p)) + '</p>' : '') +
      (p.claim ? '<p class="pd__claim">' + esc(p.claim.charAt(0).toUpperCase() + p.claim.slice(1)) + '.</p>' : '') +
      '<div class="pd__price"><b class="chf" data-pd-price>' + (p.anfrage ? 'Preis auf Anfrage' : chf(v0[2])) + '</b><span data-pd-per>' + esc(vname(v0)) + (per100(v0) ? ', ' + per100(v0) : '') + ', inkl. MWST</span></div>' + gb +
      (p.anfrage ? '<div class="pd__cta"><a class="btn btn--orange" href="mailto:info@foodkreator.ch?subject=' + encodeURIComponent(title(p)) + '">Per E-Mail anfragen</a><a class="btn btn--ghost" href="tel:+41414420155">041 442 01 55</a></div>' : '') +
      '<div class="pd__cta"' + (p.anfrage ? ' hidden' : '') + '><div class="qty"><button type="button" data-qm aria-label="Eins weniger">−</button><input type="number" min="1" max="99" value="1" aria-label="Menge" data-qv><button type="button" data-qp aria-label="Eins mehr">+</button></div>' +
      '<button class="btn btn--orange" type="button" data-pd-add>' + SVG.plus + 'In den Warenkorb</button></div>' +
      '<p class="pd__stock"><i></i>' + (p.lager ? 'An Lager. Heute bestellt, morgen unterwegs.' : 'Zurzeit nicht an Lager.') + '</p>' +
      '<div class="pd__info"><span>' + SVG.truck + 'Versand CHF 9.90, gratis ab CHF 80</span><span>' + SVG.box + 'PostPac Priority, am Folgetag</span>' + (isG && p.frei ? '<span>' + SVG.leaf + 'Ohne künstliche Zusätze</span>' : '') + '</div>' +
      (facts.length ? '<dl class="facts2">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' : '') + '</div>';

    var html = '<section class="pd"><div class="wrap">' + crumbs + '<div class="pd__grid"><div class="pd__stage">' + stage + '</div>' + buy + '</div></div></section>';

    /* Menü-Idee: fünf Gerichte */
    if (idee) {
      html += '<section class="sec sec--tight sec--cream" id="gerichte" aria-labelledby="h-ger"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Ein Gewürz, fünf Gerichte</p><h2 class="h2" id="h-ger" style="font-size:clamp(2rem,3.6vw,3rem)">Fünf Gerichte mit ' + esc(title(p)) + '</h2></div>' +
        '<div class="btn-row" style="display:flex;flex-wrap:wrap;gap:10px">' + (idee.pdf ? '<a class="btn btn--orange btn--small" href="' + esc(idee.pdf) + '" target="_blank" rel="noopener">Alle Rezepte als PDF</a>' : '') +
        '<a class="btn btn--ghost btn--small" href="' + (p.s === 'kambotscha-wok' ? WKIH + 'kochidee-mekong.html' : esc(idee.url)) + '"' + (p.s === 'kambotscha-wok' ? '' : ' target="_blank" rel="noopener"') + '>Zur Kochidee</a></div></div>' +
        '<div class="dishes">' + idee.gr.map(function (g) {
          return '<article class="dish"><div class="dish__art"><span class="pill pill--dark">' + esc(g.a === 'Lokal' ? 'Lokale Zutaten' : g.a === 'Weekend' ? 'Weekend' : g.a) + '</span>' + (g.d ? '<svg viewBox="-235 -235 470 470" aria-hidden="true">' + G.draw(g.d) + '</svg>' : artIcon(g.a)) + '</div>' +
            '<div class="dish__body"><b>' + esc(g.t) + '</b>' + (g.u ? '<small>' + esc(g.u) + '</small>' : '') + '<p>' + esc(g.x.length > 150 ? g.x.slice(0, 147).replace(/\s+\S*$/, '') + ' …' : g.x) + '</p></div></article>';
        }).join('') + '</div></div></section>';
    }

    /* Dosierung */
    var dm = (p.mr || '').match(/(\d+(?:[.,]\d+)?)\s*kg[^,]*,\s*(\d+)\s*g[^,]*,\s*(\d+)\s*g\s*Öl,\s*(\d+)\s*g\s*Wasser/i);
    if (isG && dm) {
      html += '<section class="sec sec--tight" aria-labelledby="h-dose"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">So viel brauchst du</p><h2 class="h2" id="h-dose" style="font-size:clamp(2rem,3.6vw,3rem)">' + dm[2] + ' g ' + esc(title(p)) + ' für 1 kg Fleisch oder Fisch.</h2></div><p class="lead">Mit Öl und Wasser verrühren und marinieren. Angaben aus der Produktbeschreibung.</p></div>' +
        '<div class="dose"><div class="dose__item"><svg viewBox="-90 -70 180 140" aria-hidden="true">' + A.parts.steak(true) + '</svg><b>' + dm[1] + ' kg</b><small>Fleisch oder Fisch</small></div><span class="dose__op">+</span>' +
        '<div class="dose__item"><svg viewBox="-30 -10 180 320" aria-hidden="true">' + A.jar({ name: p.k, spice: p.c }) + '</svg><b>' + dm[2] + ' g</b><small>' + esc(title(p)) + '</small></div><span class="dose__op">+</span>' +
        '<div class="dose__item"><svg viewBox="-60 -60 120 120" aria-hidden="true"><path d="M0 -44C14 -18 30 4 30 20A30 30 0 0 1 -30 20C-30 4 -14 -18 0 -44Z" fill="#e8c24a"/><path d="M-14 14A16 16 0 0 0 0 34" stroke="#fff6c8" stroke-width="6" fill="none" stroke-linecap="round"/></svg><b>' + dm[3] + ' g</b><small>Öl</small></div><span class="dose__op">+</span>' +
        '<div class="dose__item"><svg viewBox="-56 -56 112 112" aria-hidden="true">' + A.liquidIcon('wasser') + '</svg><b>' + dm[4] + ' g</b><small>Wasser</small></div></div></div></section>';
    }

    /* Rezepte */
    if (rez && rez.n) {
      html += '<section class="sec sec--tight" style="padding-top:0" aria-labelledby="h-rez"><div class="wrap"><div class="sec-head" style="margin-bottom:24px"><div><p class="eyebrow">Rezepte</p><h2 class="h2" id="h-rez" style="font-size:clamp(1.8rem,3vw,2.6rem);margin:0">' + rez.n + ' Rezepte mit ' + esc(title(p)) + '</h2></div>' +
        '<a class="link" href="https://www.waskocheichheute.ch/rezepte/" target="_blank" rel="noopener">Alle auf waskocheichheute.ch ' + SVG.arrow + '</a></div>' +
        '<ul class="recipes">' + rez.l.map(function (r) { return '<li><a href="' + esc(r[1]) + '" target="_blank" rel="noopener"><span><b>' + esc(r[0]) + '</b><small>' + esc([r[2], r[3]].filter(Boolean).join(' · ')) + '</small></span>' + SVG.ext + '</a></li>'; }).join('') + '</ul></div></section>';
    }

    /* Beschreibung */
    if ((p.txt && p.txt.length) || p.zt) {
      html += '<section class="sec sec--tight sec--cream" aria-labelledby="h-desc"><div class="wrap"><div class="desc"><div><p class="eyebrow">Beschreibung</p><h2 class="h3" id="h-desc" style="font-size:clamp(1.6rem,2.4vw,2.1rem);margin-bottom:16px">' + esc(title(p)) + (p.claim ? ': ' + esc(p.claim) : '') + '</h2>' +
        (p.txt || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
        (p.zt ? '<div class="desc__box"><h3>Zutaten</h3><p>' + esc(p.zt) + '</p>' + (p.frei ? '<p><b>Enthält keine künstlichen Zusätze.</b></p>' : '') + (p.ds && p.mr ? '<h3>Marinieren</h3><p>' + esc(p.mr) + '</p>' : '') + '</div>' : '') + '</div></div></section>';
    }

    /* Set-Hinweis und Passt dazu */
    var setFor = D.produkte.filter(function (x) { return x.g[0] === 'set' && (x.so || []).indexOf(p.s) >= 0; })[0];
    html += '<section class="sec sec--tight" aria-labelledby="h-more"><div class="wrap">' +
      (setFor ? '<a class="inset" href="' + url(setFor) + '" style="text-decoration:none;margin-bottom:28px"><span class="jars">' + setJars(setFor) + '</span><span><b>Im Set günstiger: ' + esc(setFor.k) + '</b><span>' + esc(sub(setFor)) + '. Fünf Streuer für ' + chf(setFor.v[0][2]) + ' statt ' + chf(einzelpreis(setFor, '5 Streuer')) + '.</span></span><span class="btn btn--orange btn--small">Set ansehen</span></a>' : '') +
      '<div class="sec-head" style="margin-bottom:24px"><h2 class="h2" id="h-more" style="font-size:clamp(1.8rem,3vw,2.6rem);margin:0">Passt dazu</h2>' + (isG && p.a[0] ? '<a class="link" href="kategorie.html?art=' + p.a[0] + '">Alle ' + artName(p.a[0]) + ' ' + SVG.arrow + '</a>' : '') + '</div>' +
      '<div class="grid">' + (isG || isSet ? suggestions(isSet ? p.so[0] : p.s, 4) : D.produkte.filter(function (x) { return x.s !== p.s && x.g[0] === p.g[0]; }).slice(0, 4)).map(function (x) { return card(x, { short: true }); }).join('') + '</div></div></section>';

    $('[data-pd]').innerHTML = html;

    /* Leiste unten, sobald der Kaufen-Knopf weg ist */
    var sb = document.createElement('div');
    sb.className = 'stickybuy'; sb.setAttribute('aria-hidden', 'true');
    sb.innerHTML = '<div class="wrap stickybuy__in">' + (isG ? jar(p) : thumb(p).indexOf('<img') === 0 ? thumb(p) : '') + '<span class="stickybuy__name"><b>' + esc(title(p)) + '</b><small data-sb-v>' + esc(vname(v0)) + ' · ' + chf(v0[2]) + '</small></span><button class="btn btn--orange" type="button" data-sb-add tabindex="-1">In den Warenkorb</button></div>';
    document.body.appendChild(sb);

    var box = $('.pd__buy'), qv = $('[data-qv]');
    function pick(i) {
      st.i = i; box.setAttribute('data-i', i);
      var v = p.v[i];
      $$('[data-gb]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-gb') === i)); });
      $('[data-pd-price]').textContent = chf(v[2]);
      $('[data-pd-per]').textContent = vname(v) + (per100(v) ? ', ' + per100(v) : '') + ', inkl. MWST';
      $('[data-sb-v]', sb).textContent = vname(v) + ' · ' + chf(v[2]);
    }
    $$('[data-gb]').forEach(function (b) { b.addEventListener('click', function () { pick(+b.getAttribute('data-gb')); }); });
    $('[data-qm]').addEventListener('click', function () { qv.value = Math.max(1, (+qv.value || 1) - 1); });
    $('[data-qp]').addEventListener('click', function () { qv.value = Math.min(99, (+qv.value || 1) + 1); });
    $('[data-pd-add]').addEventListener('click', function () { add(p.s, st.i, Math.max(1, Math.min(99, +qv.value || 1))); });
    $('[data-sb-add]', sb).addEventListener('click', function () { add(p.s, st.i, Math.max(1, +qv.value || 1)); });
    var cta = $('.pd__cta');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
        sb.classList.toggle('is-on', past); sb.setAttribute('aria-hidden', String(!past));
        $('[data-sb-add]', sb).tabIndex = past ? 0 : -1;
      }).observe(cta);
    }
  }

  /* ------------------------------------------------------------------
     Warenkorb
     ------------------------------------------------------------------ */
  function renderKorb() {
    var k = korb(), t = sum(k), vs = versand(t), root = $('[data-korb]');
    if (!k.length) {
      root.innerHTML = '<div class="empty" style="grid-column:1/-1"><p style="font:800 24px var(--display);color:var(--ink)">Dein Warenkorb ist leer.</p><p>Über 100 Gewürze warten. Am schnellsten findest du das passende mit drei Fragen.</p><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center"><a class="btn btn--orange" href="index.html#finden">Gewürz finden</a><a class="btn btn--ghost" href="kategorie.html">Alle Gewürze</a></div></div>';
      $('[data-korb-also]').innerHTML = D.bestseller.slice(0, 4).map(function (s) { return card(P(s), { short: true }); }).join('');
      return;
    }
    root.innerHTML = '<ul class="wk__list">' + k.map(function (x) {
      var p = P(x.s), v = p.v[x.i];
      return '<li class="line" data-line="' + x.s + '|' + x.i + '">' + lineImg(p) + '<span><b><a href="' + url(p) + '">' + esc(title(p)) + '</a></b><small>' + esc(vname(v)) + ' · ' + chf(v[2]) + '</small></span>' +
        '<div class="qty qty--s"><button type="button" data-lq="-1" aria-label="Eins weniger">−</button><input type="number" min="0" max="99" value="' + x.q + '" aria-label="Menge ' + esc(title(p)) + '" data-lqv><button type="button" data-lq="1" aria-label="Eins mehr">+</button></div>' +
        '<span class="line__sum chf">' + chf(v[2] * x.q) + '</span><button class="line__rm" type="button" data-lrm aria-label="' + esc(title(p)) + ' entfernen">' + SVG.trash + '</button></li>';
    }).join('') + '</ul>' +
      '<aside class="sum" aria-labelledby="h-sum"><h2 id="h-sum">Zusammenfassung</h2>' + shipHtml(t) +
      '<dl><div><dt>Artikel (' + count() + ')</dt><dd class="chf">' + chf(t) + '</dd></div><div><dt>Versand, PostPac Priority</dt><dd class="chf">' + (vs ? chf(vs) : 'gratis') + '</dd></div><div class="sum__total"><dt>Total inkl. MWST</dt><dd class="chf">' + chf(t + vs) + '</dd></div></dl>' +
      '<a class="btn btn--orange" href="kasse.html">Zur Kasse</a><div class="pay"><span>Rechnung</span><span>Kreditkarte</span><span>TWINT</span></div>' +
      '<p class="sum__small">Heute bestellt, morgen unterwegs. Fragen? 041 442 01 55.</p></aside>';
    var inK = k.map(function (x) { return x.s; });
    var also = D.produkte.filter(function (p) { return p.g[0] === 'set' && inK.indexOf(p.s) < 0 && p.so.some(function (s) { return inK.indexOf(s) >= 0; }); }).slice(0, 1)
      .concat(suggestions(k[0].s, 4).filter(function (p) { return inK.indexOf(p.s) < 0; })).slice(0, 4);
    $('[data-korb-also]').innerHTML = also.map(function (p) { return p.g[0] === 'set' ? card(p, { short: true }) : card(p, { short: true }); }).join('');
  }
  function initKorb() {
    renderKorb();
    $('[data-korb]').addEventListener('click', function (e) {
      var li = e.target.closest('[data-line]'); if (!li) return;
      var id = li.getAttribute('data-line').split('|'), s = id[0], i = +id[1], cur = korb().filter(function (x) { return x.s === s && x.i === i; })[0];
      if (e.target.closest('[data-lq]')) { setQ(s, i, Math.max(0, Math.min(99, cur.q + +e.target.closest('[data-lq]').getAttribute('data-lq')))); renderKorb(); }
      if (e.target.closest('[data-lrm]')) { setQ(s, i, 0); renderKorb(); }
    });
    $('[data-korb]').addEventListener('change', function (e) {
      var li = e.target.closest('[data-line]'); if (!li || !e.target.matches('[data-lqv]')) return;
      var id = li.getAttribute('data-line').split('|'); setQ(id[0], +id[1], Math.max(0, Math.min(99, +e.target.value || 0))); renderKorb();
    });
  }

  /* ------------------------------------------------------------------
     Kasse (nur Ansicht)
     ------------------------------------------------------------------ */
  function renderKasse() {
    var k = korb(), t = sum(k), vs = versand(t);
    $('[data-kasse-sum]').innerHTML = '<h2 id="h-sum">Deine Bestellung</h2>' + (k.length ? '<ul class="sum__lines">' + k.map(function (x) {
      var p = P(x.s), v = p.v[x.i];
      return '<li><span>' + (p.g[0] === 'gewuerz' ? jar(p) : thumb(p).indexOf('<img') === 0 ? thumb(p) : jar(P(p.so[0]))) + '</span><span><b>' + x.q + ' × ' + esc(title(p)) + '</b><small>' + esc(vname(v)) + '</small></span><span class="chf">' + chf(v[2] * x.q) + '</span></li>';
    }).join('') + '</ul>' : '<p class="sum__small">Dein Warenkorb ist leer. <a href="kategorie.html">Zu den Gewürzen</a></p>') +
      '<dl><div><dt>Artikel</dt><dd class="chf">' + chf(t) + '</dd></div><div><dt>Versand</dt><dd class="chf" data-ship>' + (vs ? chf(vs) : 'gratis') + '</dd></div><div class="sum__total"><dt>Total inkl. MWST</dt><dd class="chf" data-total>' + chf(t + vs) + '</dd></div></dl>' +
      '<button class="btn btn--orange" type="button" disabled style="opacity:.55;cursor:not-allowed">Kostenpflichtig bestellen</button><p class="sum__small">Entwurf: Hier wird nichts bestellt und nichts gespeichert.</p>';
    $$('input[name="versand"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var pick = r.value === 'abholen' ? 0 : vs;
        $('[data-ship]').textContent = pick ? chf(pick) : 'gratis';
        $('[data-total]').textContent = chf(t + pick);
      });
    });
    var gr = $('[data-ship-std]'); if (gr) gr.textContent = vs ? chf(vs) : 'gratis';
  }

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */
  document.body.insertAdjacentHTML('afterbegin', header());
  var ft = $('[data-footer]'); if (ft) ft.outerHTML = footer();
  document.body.insertAdjacentHTML('beforeend', drawerHtml());
  if (PAGE === 'start') renderStart();
  if (PAGE === 'kategorie') renderKategorie();
  if (PAGE === 'produkt') renderProdukt();
  if (PAGE === 'warenkorb') initKorb();
  if (PAGE === 'kasse') renderKasse();
  initHeader();
  window.addEventListener('storage', function () { updateCount(false); });
})();
