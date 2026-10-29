/* ==========================================================================
   Redline · Welten-Workshop · gemeinsame Logik der vier Richtungen
   ========================================================================== */
(function () {
  'use strict';

  var W = window.Art.WORLDS;
  var params = new URLSearchParams(window.location.search);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var motion = hasGsap && !reduced && params.get('motion') !== '0';

  if (!motion) document.documentElement.classList.add('no-motion');
  if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);

  var SHOP = 'https://shop.waskocheichheute.ch/';
  var SET = 'https://shop.waskocheichheute.ch/de/produkt/probierset-um-die-welt';

  function markSvg() {
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#f68e10"/><circle cx="20" cy="20" r="13" fill="#fffaf3"/><circle cx="20" cy="20" r="8.5" fill="#d6452b"/><path d="M8 27c6-5 18 3 24-3" fill="none" stroke="#261f1f" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  /* Textkarte einer Welt */
  function chip(label, cls, dot) {
    return '<li><span class="chip' + (cls ? ' chip--' + cls : '') + '" style="--dot:' + dot + '"><i></i>' + label + '</span></li>';
  }
  function op(s) { return '<li><span class="op" aria-hidden="true">' + s + '</span></li>'; }
  function panel(w) {
    return '<article class="wp" data-w="' + w.id + '">' +
      '<p class="wp-kicker"><b>' + w.num + '</b>' + w.region + '</p>' +
      '<h2 class="wp-title">' + w.pre + ' <em>' + w.name + '</em></h2>' +
      '<p class="wp-text">' + w.text + '</p>' +
      '<ol class="formula" aria-label="Rezeptformel">' +
        chip('Poulet', '', '#e0a95e') + op('+') + chip(w.liquid, '', w.liquidColor) + op('+') + chip('Redline ' + w.spice, 'spice', w.spiceColor) +
      '</ol>' +
      '<p class="wp-dish"><span>=</span>' + w.dish + '</p>' +
    '</article>';
  }
  function introPanel(o) {
    return '<article class="wp" data-w="' + (o.id || 'intro') + '">' +
      (o.kicker ? '<p class="wp-kicker">' + o.kicker + '</p>' : '') +
      '<h2 class="wp-title">' + o.title + '</h2>' +
      '<p class="wp-text">' + o.text + '</p>' +
      (o.cta ? '<a class="btn btn--orange btn--small" href="' + o.cta[1] + '">' + o.cta[0] + '</a>' : '') +
    '</article>';
  }

  /* Kopf */
  document.querySelectorAll('[data-header]').forEach(function (el) {
    el.className = 'hdr';
    el.innerHTML = '<a class="mark" href="#top" aria-label="Redline · Was koche ich heute? Zum Anfang">' + markSvg() + '<span><small>REDLINE</small><b>Was koche ich heute?</b></span></a>' +
      '<a class="btn btn--orange btn--small" href="' + SHOP + '" target="_blank" rel="noopener">Zum Shop</a>';
  });

  /* Schluss */
  document.querySelectorAll('[data-outro]').forEach(function (el) {
    var jars = [['Argentinien', '#8a5a34', '#e0a95e'], ['Kentucky BBQ', '#7b4a2c', '#c98b4a'], ['Süd Indien', '#c99a2e', '#f6eedb'], ['1 für Alles', '#9c8c5a', '#f1e2c4'], ['Helvetica', '#b9ae78', '#f1e2c4']];
    el.outerHTML =
      '<section class="outro" id="probierset" aria-labelledby="h-outro"><div class="wrap outro__grid">' +
        '<div>' +
          '<p class="eyebrow eyebrow--light">Der einfachste Einstieg</p>' +
          '<h2 class="outro__title" id="h-outro">Die Idee, was du kochst, gibt dir das <em>Gewürz.</em></h2>' +
          '<p class="outro__lead">Starte mit dem Probierset «Um die Welt»: fünf Mischungen aus fünf Regionen. Genug für Dutzende Gerichte.</p>' +
          '<div class="price"><b>CHF 24.90</b><span>statt CHF 34.50 einzeln</span></div>' +
          '<div class="btn-row"><a class="btn btn--orange" href="' + SET + '" target="_blank" rel="noopener">Probierset bestellen</a>' +
          '<a class="btn btn--ghost-light" href="kochideen.html">Kochideen entdecken</a></div>' +
        '</div>' +
        '<div class="jars" role="img" aria-label="Die fünf Gewürze des Probiersets: Argentinien, Kentucky BBQ, Süd Indien, 1 für Alles und Helvetica">' +
          jars.map(function (j) { return window.Art.jarSvg({ name: j[0], spice: j[1], dish: j[2] }); }).join('') +
        '</div>' +
      '</div></section>' +
      '<footer class="foot"><div class="wrap"><span>© FoodKreator AG · Sagenhofweg 7, 6030 Ebikon · +41 41 442 01 55</span>' +
        '<nav aria-label="Weitere Seiten"><a href="../waskocheichheute/index.html">Wireframes</a><a href="https://www.foodkreator.ch/" target="_blank" rel="noopener">Für Gastronomie und Handel</a><a href="#top">Nach oben</a></nav></div></footer>';
  });

  /* Ruhige Fassung: die fünf Welten untereinander */
  function staticWorlds(container) {
    container.innerHTML = W.map(function (w) {
      return '<section class="sw">' +
        '<svg class="sw-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + window.Art.scene(w.id) + '</svg>' +
        '<div class="wrap sw-inner"><div class="wp-card">' + panel(w) + '</div>' +
        '<svg class="sw-plate" viewBox="-270 -270 540 540" aria-hidden="true">' + window.Art.plate({ sauce: w.sauce, world: w.id, grill: w.id === 'feuer' }) + '</svg></div>' +
      '</section>';
    }).join('');
  }

  /* Rail: Schaltflächen für die Welten */
  function rail(el, items, onPick) {
    el.innerHTML = items.map(function (it, i) {
      return '<button type="button" style="--dot:' + it.dot + '" aria-label="' + it.label + '"><i></i><span>' + it.label + '</span></button>';
    }).join('');
    var buttons = el.querySelectorAll('button');
    buttons.forEach(function (b, i) { b.addEventListener('click', function () { onPick(i); }); });
    return function setActive(i) {
      buttons.forEach(function (b, k) { b.setAttribute('aria-current', String(k === i)); });
    };
  }

  /* Einrasten: nah an einer Station bleibt man dort, sonst geht es in Scrollrichtung weiter */
  function snapper(points) {
    var dir = 1;
    return {
      track: function (self) { if (self.direction) dir = self.direction; },
      snapTo: function (v) {
        var pts = points(), best = pts[0], bd = 9;
        pts.forEach(function (p) { var d = Math.abs(p - v); if (d < bd) { bd = d; best = p; } });
        if (bd < 0.012) return best;
        var next = dir > 0 ? pts.filter(function (p) { return p > v; }) : pts.filter(function (p) { return p < v; }).reverse();
        return next.length ? next[0] : best;
      }
    };
  }

  if (hasGsap && motion) window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });

  window.Welten = {
    motion: motion,
    worlds: W,
    panel: panel,
    introPanel: introPanel,
    staticWorlds: staticWorlds,
    rail: rail,
    snapper: snapper
  };

  /* Nur für die Werkstatt (index.html): Scrollhöhe melden, damit die Werkstatt-Leiste mitscrollt */
  if (window.parent !== window) {
    var report = function () { window.parent.postMessage({ wsScroll: window.scrollY }, '*'); };
    window.addEventListener('scroll', report, { passive: true });
    window.addEventListener('load', report);
    report();
  }
})();
