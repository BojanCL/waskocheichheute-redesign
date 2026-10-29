/* ==========================================================================
   Wireframe waskocheichheute.ch: gemeinsames Verhalten aller Seiten
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  var viewport = document.getElementById('viewport');

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Ansicht Desktop / Handy (bleibt beim Seitenwechsel) ---------- */
  var viewButtons = document.querySelectorAll('[data-view]');
  function setView(view) {
    body.classList.toggle('is-phone', view === 'phone');
    viewButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
    store('wf-view', view);
  }
  viewButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setView(btn.getAttribute('data-view'));
      if (viewport) viewport.scrollTop = 0;
      window.scrollTo(0, 0);
    });
  });
  if (store('wf-view') === 'phone') setView('phone');

  /* ---------- Notizen ein/aus (bleibt beim Seitenwechsel) ---------- */
  var notesBtn = document.getElementById('notes-toggle');
  function setNotes(show) {
    body.classList.toggle('hide-notes', !show);
    if (notesBtn) notesBtn.setAttribute('aria-pressed', String(show));
    store('wf-notes', show ? '1' : '0');
  }
  if (notesBtn) {
    notesBtn.addEventListener('click', function () { setNotes(body.classList.contains('hide-notes')); });
  }
  if (store('wf-notes') === '0') setNotes(false);

  /* ---------- Seitenwahl in der Leiste ---------- */
  var pageSelect = document.getElementById('page-select');
  if (pageSelect) {
    pageSelect.addEventListener('change', function () { window.location.href = pageSelect.value; });
  }

  /* ---------- Mobiles Menü ---------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobile-nav');
  function setMenu(open) {
    if (!burger || !mobileNav) return;
    mobileNav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!mobileNav.classList.contains('is-open')); });
  }

  /* ---------- Sprunglinks innerhalb der Seite (auch im Handy-Rahmen) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* Anker aus anderer Seite (z. B. fuer-dich.html#veggie) */
  if (window.location.hash) {
    var initial = document.getElementById(window.location.hash.slice(1));
    if (initial) window.setTimeout(function () { initial.scrollIntoView({ block: 'start' }); }, 60);
  }

  /* ---------- Reiter ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });

  /* ---------- Formulare im Wireframe nicht absenden ---------- */
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  /* ==========================================================================
     Finder: «Was hast du heute da?»
     Gerichte aus den heutigen Kochideen und Rezepten von waskocheichheute.ch.
     Im Betrieb kommt das aus der gemeinsamen Rezept-Datenbank von Website und Shop.
     ========================================================================== */
  var PROTEINS = [
    { id: 'poulet', label: 'Poulet' },
    { id: 'rind', label: 'Rind' },
    { id: 'fisch', label: 'Fisch' },
    { id: 'gemuese', label: 'Gemüse' }
  ];
  var METHODS = [
    { id: 'grill', label: 'Grillieren / braten' },
    { id: 'rahm', label: 'Rahm' },
    { id: 'tomate', label: 'Tomate' },
    { id: 'kokos', label: 'Kokosmilch' },
    { id: 'soja', label: 'Soja' }
  ];
  var REGIONS = [
    { id: 'alle', label: 'Alle Regionen' },
    { id: 'asien', label: 'Asien' },
    { id: 'europa', label: 'Europa' },
    { id: 'schweiz', label: 'Schweiz' },
    { id: 'amerika', label: 'Amerika und Karibik' }
  ];
  var DISHES = [
    { p: 'poulet', l: 'kokos', r: 'asien', spice: 'Redline Mekong', name: 'Mekong Kokos-Chicken «Golden River»', text: 'Pouletfilet in Kokosmilch und Ingwer, dazu Jasminreis und Kokos-Karotten-Püree.' },
    { p: 'poulet', l: 'kokos', r: 'amerika', spice: 'Redline Puerto Rico', name: 'Poulet mit Federkohl und Birne', text: 'Regionaler Federkohl und Birne, karibisch gewürzt, mit Kokosmilch.' },
    { p: 'poulet', l: 'rahm', r: 'schweiz', spice: 'Redline Helvetica', name: 'Geschnetzeltes nach Zürcher Art', text: 'Der Schweizer Klassiker mit Rahmsauce.' },
    { p: 'poulet', l: 'tomate', r: 'europa', spice: 'Redline Spanien', name: 'Poulet-Ragout nach spanischer Art', text: 'Poulet und Zucchetti in Tomatensauce.' },
    { p: 'poulet', l: 'tomate', r: 'amerika', spice: 'Redline Cajun', name: 'Jambalaya', text: 'Reis, Poulet und Gemüse aus einer Pfanne, mit Louisiana-Flair.' },
    { p: 'poulet', l: 'grill', r: 'amerika', spice: 'Redline BBQ Südstaaten', name: 'Smoky Soul Chicken', text: 'Rauchiges Poulet mit süsser Glasur vom Grill.' },
    { p: 'poulet', l: 'grill', r: 'amerika', spice: 'Redline Argentinien', name: 'Pollo del Sol', text: 'Poulet mit Kräutern und Knoblauch, südamerikanisch gegrillt.' },
    { p: 'fisch', l: 'kokos', r: 'asien', spice: 'Redline South India Curry', name: 'Kerala-Fischcurry', text: 'Fischfilets in Kokos-Curry mit Ingwer und Koriander.' },
    { p: 'fisch', l: 'kokos', r: 'asien', spice: 'Redline Mekong', name: 'Mok Sonnenbarsch «Mekong Breeze»', text: 'Gebratener Sonnenbarsch mit Thai-Basilikum, Pak Choi und Kokosmilch.' },
    { p: 'fisch', l: 'soja', r: 'asien', spice: 'Redline Korea', name: 'Koreanischer Fischwok', text: 'Fisch und Gemüse aus dem Wok.' },
    { p: 'rind', l: 'grill', r: 'amerika', spice: 'Redline Argentinien', name: 'Argentina Burger', text: 'Rindfleisch-Burger mit Kräutern und Knoblauch.' },
    { p: 'rind', l: 'grill', r: 'schweiz', spice: 'Redline Helvetica', name: 'Rindsplätzli Helvetica', text: 'Kurz gebraten, mit dem Schweizer Urgewürz.' },
    { p: 'rind', l: 'soja', r: 'asien', spice: 'Redline Peking', name: 'Rindfleisch aus dem Wok', text: 'Rindfleischstreifen mit Gemüse und Soja.' },
    { p: 'gemuese', l: 'tomate', r: 'asien', spice: 'Redline South India Curry', name: 'Chana Masala', text: 'Kichererbsen mit Tomaten und Kokosmilch.' },
    { p: 'gemuese', l: 'grill', r: 'asien', spice: 'Redline Mekong', name: 'Kohlrabi-Steak «Mekong Garden»', text: 'Gegrillter Kohlrabi mit Ingwer und Zitronengras.' },
    { p: 'gemuese', l: 'grill', r: 'amerika', spice: 'Redline Canada', name: 'Selleriesteak mit Champignons', text: 'Sellerie, grilliert wie ein Steak.' },
    { p: 'gemuese', l: 'rahm', r: 'schweiz', spice: 'Redline Helvetica', name: 'Veggie-Geschnetzeltes mit Sellerie', text: 'Sellerie statt Fleisch, mit Rahmsauce.' },
    { p: 'gemuese', l: 'rahm', r: 'europa', spice: 'Redline France', name: 'Pariser Pilz-Senf-Flan', text: 'Cremiger Flan mit Steinpilzen, ohne Boden.' }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function labelOf(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].label;
    return '';
  }

  document.querySelectorAll('[data-finder]').forEach(function (root) {
    var mode = root.getAttribute('data-finder');           /* "teaser" oder "full" */
    var full = mode === 'full';
    var detail = root.getAttribute('data-detail') || 'kochidee-mekong.html';
    var shop = root.getAttribute('data-shop') || 'kochidee-mekong.html#kaufen';
    var state = full ? { p: null, l: null, r: 'alle' } : { p: 'poulet', l: 'kokos', r: 'alle' };

    var elP = root.querySelector('[data-chips="p"]');
    var elL = root.querySelector('[data-chips="l"]');
    var elR = root.querySelector('[data-chips="r"]');
    var elTitle = root.querySelector('[data-results-title]');
    var elList = root.querySelector('[data-results]');
    var elReset = root.querySelector('[data-reset]');

    function chips(container, items, key) {
      if (!container) return;
      container.textContent = '';
      items.forEach(function (item) {
        var b = el('button', 'chip', item.label);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(state[key] === item.id));
        b.addEventListener('click', function () {
          state[key] = (full && key !== 'r' && state[key] === item.id) ? null : item.id;
          render();
        });
        container.appendChild(b);
      });
    }

    function card(d) {
      var c = el('article', 'card dish');
      var ph = el('div', 'ph');
      ph.setAttribute('aria-hidden', 'true');
      ph.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>';
      ph.appendChild(el('span', null, 'Foto: Gericht'));
      c.appendChild(ph);
      var b = el('div', 'dish__body');
      b.appendChild(el('span', 'kicker', d.spice));
      b.appendChild(el('h3', 'h3', d.name));
      b.appendChild(el('p', 'body dish__text', d.text));
      var links = el('div', 'dish__links');
      var a1 = el('a', 'link', 'Kochidee ansehen'); a1.href = detail;
      var a2 = el('a', 'link', 'Gewürz im Shop · CHF 6.90'); a2.href = shop;
      links.appendChild(a1); links.appendChild(a2);
      b.appendChild(links);
      c.appendChild(b);
      return c;
    }

    function render() {
      chips(elP, PROTEINS, 'p');
      chips(elL, METHODS, 'l');
      chips(elR, REGIONS, 'r');

      var list, title;
      if (full) {
        list = DISHES.filter(function (d) {
          return (!state.p || d.p === state.p) && (!state.l || d.l === state.l) && (state.r === 'alle' || d.r === state.r);
        });
        var parts = [];
        if (state.p) parts.push(labelOf(PROTEINS, state.p));
        if (state.l) parts.push(labelOf(METHODS, state.l));
        if (state.r !== 'alle') parts.push(labelOf(REGIONS, state.r));
        title = list.length + (list.length === 1 ? ' Kochidee' : ' Kochideen') + (parts.length ? ' · ' + parts.join(' · ') : '');
        if (!list.length) title = 'Für diese Kombination gibt es noch keine Kochidee. Wähle einen Filter weniger.';
        if (elReset) elReset.hidden = !(state.p || state.l || state.r !== 'alle');
      } else {
        var exact = DISHES.filter(function (d) { return d.p === state.p && d.l === state.l; });
        var rest = DISHES.filter(function (d) { return d.p === state.p && d.l !== state.l; });
        list = exact.concat(rest).slice(0, 3);
        var pL = labelOf(PROTEINS, state.p), lL = labelOf(METHODS, state.l);
        title = exact.length ? 'Ideen für ' + pL + ' · ' + lL : 'Für ' + pL + ' · ' + lL + ' gibt es noch keine Idee. Hier weitere mit ' + pL;
      }

      elTitle.textContent = title;
      elList.textContent = '';
      var limit = full && !showAll ? 6 : list.length;
      list.slice(0, limit).forEach(function (d) { elList.appendChild(card(d)); });

      if (elMore) {
        elMore.hidden = list.length <= limit;
        elMore.querySelector('button').textContent = 'Alle ' + list.length + ' Kochideen anzeigen';
      }
    }

    var showAll = false;
    var elMore = null;
    if (full) {
      elMore = el('div', 'more-row');
      var moreBtn = el('button', 'btn btn--secondary');
      moreBtn.type = 'button';
      moreBtn.addEventListener('click', function () { showAll = true; render(); });
      elMore.appendChild(moreBtn);
      elList.parentNode.appendChild(elMore);
    }

    if (elReset) {
      elReset.addEventListener('click', function () { state = { p: null, l: null, r: 'alle' }; render(); });
    }
    render();
  });
})();
