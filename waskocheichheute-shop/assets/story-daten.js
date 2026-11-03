/* ==========================================================================
   Redline · Shop · Daten für die Produktseite mit Geschichte
   «Von <Herkunft> auf deinen Teller» (produkt-story.html?p=<slug>)

   Gerichte, Texte, Preise und Rezepte kommen aus assets/daten.js (Prototyp).
   Hier steht nur, was die Geschichte zusätzlich braucht:
   - titel: konkreter Name «Gericht mit Gewürz» (aus dem Gerichtstext
     abgeleitet, zur Freigabe durch den Kunden). Der Originalname steht klein
     darunter.
   - bild: Datei in assets/img/story/ ohne Endung (es gibt <name>.webp und
     <name>-s.webp). Fehlt das Bild, zeigt die Seite einen Platzhalter.
   - fokus: Bildausschnitt (CSS object-position), weil das Foto hoch
     zugeschnitten wird.
   Ein neues Gewürz braucht nur einen Eintrag hier und die Bilder.
   ========================================================================== */
window.STORY = {
  'bbq-kentucky': {
    ort: 'Kentucky',
    geschmack: ['Rauchig', 'Leicht süsslich', 'Kräftige Paprika'],
    geschmackSatz: 'Rauchig, leicht süsslich, mit kräftiger Paprika.',
    start: {
      text: 'Rauchig, leicht süsslich und mit kräftiger Paprika: So schmeckt BBQ in Kentucky. Simon Keller kennt die Kochmuster der Welt und hat diesen Geschmack in einen Streuer gepackt.',
      video: 'https://www.waskocheichheute.ch/wp-content/uploads/2026/09/Kentucky.mp4',
      poster: 'https://www.waskocheichheute.ch/wp-content/uploads/2026/07/header-img-e1783428221770.png'
    },
    streuer: 'streuer-kentucky',
    dose: 'dose-kentucky',
    blanko: 'streuer-blanko',
    hero: 'Weekend',
    passtZu: 'Für Spareribs, Truthahn, Welsfilet und Süsskartoffeln.',
    gerichte: {
      Fleisch: { titel: 'Überbackener Truthahn-Toast', kurz: 'Truthahn', ort: 'Der Klassiker aus Kentucky', bild: 'kentucky-fleisch', fokus: '50% 50%' },
      Fisch: { titel: 'Knuspriges Welsfilet', kurz: 'Wels', ort: 'Typisch Südstaaten', bild: 'kentucky-fisch', fokus: '38% 50%' },
      Veggie: { titel: 'Süsskartoffeln vom Grill', kurz: 'Süsskartoffel', ort: 'Gemüse mit BBQ-Charakter', bild: null,
        foto: 'Dicke Süsskartoffelscheiben vom Grill mit gebratenem Mais, Paprika und schwarzen Bohnen' },
      Lokal: { titel: 'Raclette-Toast mit Felchen', kurz: 'Felchen', ort: 'Angekommen in der Schweiz', bild: null,
        foto: 'Bauernbrot mit Raclettekäse, Felchenfilets, Rauch-Béchamel und geröstetem Wurzelgemüse' },
      Weekend: { titel: 'Glasierte Spareribs', kurz: 'Spareribs', ort: 'Bei dir am Grill', bild: 'kentucky-weekend', fokus: '60% 50%' }
    },
    /* Weiterreisen: andere Gewürze, wenn vorhanden mit Gerichtsfoto */
    weiter: [
      { s: 'argentinien', streuer: 'streuer-argentina', bild: 'argentinien-lokal', gericht: 'Lokal' },
      { s: 'bbq-sued-staaten', streuer: 'streuer-suedstaaten', gericht: 'Fleisch' },
      { s: 'cajun', streuer: 'streuer-cajun', gericht: 'Fleisch' }
    ],
    kongo: 'kongo-gewuerzmischung-55g',
    set: 'probierset-bbq-um-die-welt-total-35',
    setBild: 'set-bbq',
    geschenkBild: 'geschenk-5er'
  }
};
