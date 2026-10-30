"""Baut assets/daten.js für den Shop-Entwurf aus den Daten des Shop-Prototyps.

Quelle: foodkreator-shop-dev.kihub.ch/prototyp (shopdaten.json, daten/varianten.json,
daten/wochenhits.json, daten/rezepte.json), dort aus shop.waskocheichheute.ch gelesen.
Aufruf: python3 -I build_daten.py <ordner mit den json> <ziel daten.js>
"""
import html
import json
import re
import sys

SRC, OUT = sys.argv[1], sys.argv[2]


def load(p):
    with open(SRC + '/' + p, encoding='utf-8') as f:
        return json.load(f)


D = load('shopdaten.json')
VAR = load('daten/varianten.json')['varianten']
HITS = load('daten/wochenhits.json')['wochenhits']
REZ = load('daten/rezepte.json')['rezepte']
PR = D['produkte']

# Name auf dem Glas: so kurz, wie es auf dem echten Etikett steht
KURZ = {
    'bali-curry': 'Bali Curry', 'sued-afrika-curry': 'Südafrika Curry', 'roter-thaicurry': 'Rotes Thai Curry',
    'gruener-thaicurry': 'Grüner Thai Curry', 'tandoori': 'Tandoori', 'gelber-thaicurry': 'Gelber Thai Curry',
    'bbq-sued-afrika': 'Südafrika BBQ', 'orient': 'Orient', 'toscana-kraeuter': 'Toscana', 'griechenland': 'Griechenland',
    'nordafrika': 'Marokko', 'helvetica-110g': 'Helvetica', 'cajun': 'Cajun', 'st-tropez-kraeuter': 'St. Tropez',
    'bbq-kentucky': 'Kentucky BBQ', 'argentinien': 'Argentinien', 'gluehwein': 'Glühwein', 'natur-tempura-tempura': 'Tempura',
    'rogan-josh-curry': 'Rogan Josh', 'madagaskar-curry': 'Madagaskar', 'ungarisch': 'Ungarn',
    'sued-indischer-curry': 'Südindien', 'karibik-curry': 'Karibik Curry', 'raclette-fondue': 'Raclette',
    'sandelholz1': 'Kanada', 'sansibar-curry-afrika': 'Sansibar Curry', 'bbq-sued-staaten': 'Südstaaten BBQ',
    'bbq-californien': 'Kalifornien', 'mexiko1': 'Mexiko', 'madras-curry-35g': 'Madras', 'australien-lemon-pepper': 'Lemon Pepper',
    'sweet-chili-wok': 'Sweet Chili', 'thai-wok_1': 'Thai Wok', 'ceylon-curry-45g': 'Ceylon Curry', 'kambotscha-wok': 'Mekong',
    'vietnam-wok': 'Vietnam', 'laos-wok': 'Laos', 'kosaken-bbq-gewuerzmischung': 'Kosaken', 'paella-70g': 'Spanien',
    'yakitori': 'Yakitori', 'peking-69g': 'Peking', 'chile-gewuerzmischung-80g': 'Chile', 'brasil-gewuerzmischung-70g': 'Brasil',
    'karibik-dip-gewuerzmischung': 'Karibik Dip', 'venezuela-gewuerzmischung-80g': 'Venezuela', 'australian-bbq': 'Australian BBQ',
    'sizilien-dip-gewuerzmischung': 'Sizilien', 'asia-dip-gewuerzmischung': 'Asia Dip', 'french-dressing-60g': 'French Dressing',
    'pizza-gewuerzmischung-17g': 'Pizza', 'italien-dressing-60g': 'Italien Dressing', 'fleisch-gewuerzmischung-120g': 'Deutschland',
    'poulet-gewuerzmischung-50g': 'Swiss BBQ', 'scharfmacher-gewuerzmischung-50g': 'Scharfmacher',
    'kampotpfeffer-rot-45g': 'Kampot Rot', 'kampotpfeffer-schwarz-50g': 'Kampot', '6pfeffer-gewuerzmischung-28g': '6 Pfeffer',
    '1fueralles-gewuerzmischung-90g': '1 für Alles', 'himalaya-mekong-gewuerzmischung-56-g': 'Mekong',
    'himalaya-poulet-gewuerzmischung-50-g': 'Swiss BBQ', 'himalaya-helvetica-gewuerzmischung-110-g': 'Helvetica',
    'saucen-und-suppen-270-g': 'Saucen & Suppen', 'himalaya-canada-gewuerzmischung-68-g': 'Canada',
    'himalaya-1-fuer-alles-gewuerzmischung-90g': '1 für Alles', 'himalaya-south-africa-bbq': 'South Africa',
    'himalaya-lemon-pepper-76g': 'Lemon Pepper', 'himalaya-yakitori-gewuerzmischung70g': 'Yakitori',
    'szechuan-gewuerzmischung-60g': 'Szechuan', 'costa-rica-gewuerzmischung-60g': 'Costa Rica',
    'paraguay-gewuerzmischung-60g': 'Paraguay', 'senegal-gewuerzmischung-65g': 'Senegal', 'sweden-gewuerzmischung-60g': 'Schweden',
    'finnland-gewuerzmischung-50g': 'Finnland', 'korea-gewuerzmischung-85g': 'Korea', 'kongo-gewuerzmischung-55g': 'Kongo',
    'aethiopien-gewuerzmischung-55g': 'Äthiopien', 'france-ab-690-chf': 'France', 'ruanda-ab-690-chf': 'Ruanda',
    'tunesien-ab-690-chf': 'Tunesien', 'angola-ab-690-chf': 'Angola', 'aegypten-ab-690-chf': 'Ägypten',
    'tansania-ab-690-chf': 'Tansania', 'capetown-bbq-ab-690-chf': 'Capetown', 'mauritius-ab-690-chf': 'Mauritius',
    'kenia-ab-690-chf': 'Kenia', 'shanghai-ab-690-chf': 'Shanghai', 'mosambik-ab-690-chf': 'Mosambik',
    'bolivien-ab-690-chf': 'Bolivien', 'kanton-ab-690-chf': 'Kanton', 'uruguay-ab-690-chf': 'Uruguay',
    'equador-ab-690-chf': 'Ecuador', 'peru-ab-690-chf': 'Peru', 'guyana-ab-690-chf': 'Guyana', 'cancun-ab-690-chf': 'Cancún',
    'puerto-rico-ab-690-chf': 'Puerto Rico', 'honduras-ab-690-chf': 'Honduras', 'dominikanische-republik-ab-690-chf': 'DomRep',
    'new-mexiko-ab-690-chf': 'New Mexiko', 'alaska-ab-690-chf': 'Alaska', 'quebec-ab-690-chf': 'Quebec',
    'louisiana-ab-690-chf': 'Louisiana', 'florida-ab-690-chf': 'Florida', 'pure-smoke-ab-890-chf': 'Pure Smoke',
    'texas-ab-690-chf': 'Texas', 'feuriges-suess': 'Feuriges Süsses',
}

# Glasfarben der Mischungen, die schon auf waskocheichheute.ch gezeichnet sind (assets/gerichte.js)
FARBE = {
    'kambotscha-wok': '#b9853f', 'puerto-rico-ab-690-chf': '#c27a2a', 'helvetica-110g': '#b9ae78', 'paella-70g': '#c0502a',
    'cajun': '#a8462a', 'bbq-sued-staaten': '#7b4a2c', 'argentinien': '#8a5a34', 'sued-indischer-curry': '#c99a2e',
    'korea-gewuerzmischung-85g': '#7a3a2a', 'peking-69g': '#a5462b', 'sandelholz1': '#8a6a3a', 'france-ab-690-chf': '#8f8a52',
    '1fueralles-gewuerzmischung-90g': '#9c8c5a', 'sweden-gewuerzmischung-60g': '#a89a5c', 'quebec-ab-690-chf': '#8a5a3a',
    'kosaken-bbq-gewuerzmischung': '#7d5a3a', 'new-mexiko-ab-690-chf': '#b0442a', 'aethiopien-gewuerzmischung-55g': '#9a3a1f',
}
# Alle anderen: aus der ersten prägenden Zutat geschätzt (im Entwurf so gekennzeichnet)
ZUTAT_FARBE = [
    (r'kurkuma|curry', '#c99a2e'), (r'chili|cayenne|harissa', '#b0442a'), (r'paprika', '#a8462a'),
    (r'rosmarin|thymian|oregano|basilikum|petersilie|dill|kräuter|majoran|estragon|bärlauch|schnittlauch', '#8f8a52'),
    (r'zimt|nelke|zucker|vanille', '#8a5a34'), (r'pfeffer', '#6b5a48'), (r'knoblauch|zwiebel|salz|senf', '#b9ae78'),
]

REGIONEN = [('asien', 'Asien'), ('afrika1', 'Afrika'), ('europa', 'Europa'), ('nordamerika-karibik', 'Nordamerika und Karibik'),
            ('suedamerika', 'Südamerika'), ('australien', 'Australien'), ('schweiz', 'Schweiz')]
REGION_KEY = {'asien': 'asien', 'afrika1': 'afrika', 'afrika': 'afrika', 'suedostasien': 'asien', 'indischer-sub-kontinent': 'asien',
              'indischer-ozean': 'afrika', 'karibik': 'nordamerika', 'europa': 'europa', 'nordamerika-karibik': 'nordamerika',
              'suedamerika': 'suedamerika', 'australien': 'australien', 'schweiz': 'schweiz'}

# Gewürze nach Art: Wortlisten aus dem Prototyp (Vorschlag, Simon entscheidet die Einteilung)
ARTEN = [
    ('grill', r'bbq|grill|rub\b|steak|asado|smoke|braai|churrasco|kentucky|argentin|südstaaten|carolina|spiess|brochette|sosatie'),
    ('curry', r'curry|tandoori|masala|tikka|korma|madras|vindaloo|berbere|tajine|muamba'),
    ('wok', r'wok|thai|szechuan|teriyaki|yakitori|shanghai|korea|vietnam|asia|laos|nasi|peking|mekong|tempura'),
    ('fisch', r'fisch|fish|seafood|crevet|marisco|lachs'),
    ('pfanne', r'gulasch|fajita|burrito|pfannen|eintopf|paella|empanada|arepa|olla|soul food|deftige|hackfleisch|gyros|kebab|inka|yassa|sufuria|guarani|kreolisch|provence|couscous'),
    ('pasta', r'pizza|pasta|tomaten|toscana|sizilien|italien'),
    ('klassiker', r'helvetica|1 ?für ?alles|raclette|fondue|urgew|swiss'),
    ('salz', r'salz|pfeffer|pepper|chili|scharfmacher'),
    ('kraeuter', r'kräuter|salat|dressing|dip\b|saucen|suppen'),
    ('suess', r'glühwein|punsch|zimt|vanille|kakao|süsses'),
]
ZU = [('fisch', ['fisch', 'crevetten', 'lachs', 'seafood', 'marisco', 'meeresfrüchte']), ('rind', ['rind', 'beef', 'steak']),
      ('poulet', ['geflügel', 'poulet', 'ente', 'chicken', 'huhn', 'hähnchen']), ('lamm', ['lamm']),
      ('schwein', ['schwein', 'pork']),
      ('gemuese', ['gemüse', 'linsen', 'bohnen', 'hülsen', 'mais', 'kartoffel', 'vegi', 'veggie', 'tofu', 'salat']),
      ('wild', ['wild', 'hirsch', 'reh', 'kaninchen'])]
FL = [('rahm', ['rahm', 'joghurt', 'milch', 'sahne']), ('tomate', ['tomate']), ('kokos', ['kokos']), ('soja', ['soja']),
      ('wasser', ['wasser', 'bouillon', 'brühe'])]

GRUPPE_KATS = {
    'feines': {'snaecks', 'auserlesenes', 'suesses'},
    'kueche': {'kuechenuntensilien', 'nachfueller'},
    'grill': {'heizer', 'holz-oefen', 'grills', 'smoker-und-grills', 'holzkohle-campinggrill', 'buchen-holzkohle'},
}
UNTER = ['heizer', 'holz-oefen', 'grills', 'smoker-und-grills', 'holzkohle-campinggrill', 'buchen-holzkohle',
         'kuechenuntensilien', 'nachfueller', 'snaecks', 'auserlesenes', 'suesses']

SET_SORTEN = {
    'die-welt-der-pilze-ab-35': ['france-ab-690-chf', '1fueralles-gewuerzmischung-90g', 'sweden-gewuerzmischung-60g', 'quebec-ab-690-chf', 'kosaken-bbq-gewuerzmischung'],
    'probierset-asia-total-35': ['korea-gewuerzmischung-85g', 'shanghai-ab-690-chf', 'thai-wok_1', 'vietnam-wok', 'yakitori'],
    'probierset-bbq-um-die-welt-total-35': ['bbq-sued-staaten', 'bbq-sued-afrika', 'bbq-kentucky', 'australian-bbq', 'argentinien'],
    'probierset-um-die-welt': ['argentinien', 'bbq-kentucky', 'sued-indischer-curry', '1fueralles-gewuerzmischung-90g', 'helvetica-110g'],
    'probierset-curry-um-die-welt-total-35': ['gelber-thaicurry', 'sued-afrika-curry', 'sansibar-curry-afrika', 'ceylon-curry-45g', 'karibik-curry'],
    'nuesse-total-3500': ['bandera-nuts-mandeln', 'big-mama-nuts-macadamia', 'captain-blackbeard-nuts-paranuss', 'hot-lovers-cashews', 'samba-nuts-pekanuss'],
}
SET_NAME = {
    'die-welt-der-pilze-ab-35': 'Die Welt der Pilze', 'probierset-asia-total-35': 'Asia Wok Set',
    'probierset-bbq-um-die-welt-total-35': 'Die Welt der BBQs', 'probierset-um-die-welt': 'Probierset Um die Welt',
    'probierset-curry-um-die-welt-total-35': 'Die bunte Welt der Currys', 'nuesse-total-3500': 'Nuss Reise Wilde Charaktere',
}

# Zeichnungen aus assets/gerichte.js, nur wo das Gericht wirklich dasselbe ist
ZEICHNUNG = {
    'Rindsplätzli Helvetica': 'plaetzli', 'Pollo del Sol': 'pollo', 'Smoky Soul Chicken': 'smoky', 'Jambalaya': 'jambalaya',
    'Mekong Kokos Chicken „Golden River“': 'goldenriver', 'Mok Sonnenbarsch „Mekong Breeze“': 'mok',
    'Kohlrabi-Steak „Mekong Garden“': 'kohlrabi', 'Gegrilltes Selleriesteak': 'sellerie',
}


def text_of(h):
    h = re.sub(r'(?s)<!--.*?-->', '', h or '')
    h = re.sub(r'(?i)<br\s*/?>|</p>|</div>|</li>', '\n', h)
    h = re.sub(r'<[^>]+>', '', h)
    h = html.unescape(h).replace('\xa0', ' ')
    h = re.sub(r'[ \t]+', ' ', h)
    h = re.sub(r'([a-zäöüß!.])(RedLine )', r'\1\n\2', h)  # Titelzeile klebt sonst am Text
    return re.sub(r'\n\s*\n+', '\n', h).strip()


def ohne_strich(s):
    """Keine Gedankenstriche im Entwurf: « – » wird zu Doppelpunkt oder Komma."""
    s = re.sub(r'^\s*[–—]\s*|\s*[–—]\s*$', '', s)          # Strich am Anfang oder Ende weg
    s = re.sub(r'(\w)\s*[–—]\s*(\w)', lambda m: m.group(1) + ('-' if m.group(0).strip(m.group(1) + m.group(2)) in ('–', '—') and ' ' not in m.group(0) else ', ') + m.group(2), s)
    return re.sub(r'\s*[–—]\s*', ', ', s).strip()


def felder(p):
    t = text_of(p.get('beschreibung_html') or p.get('beschreibung_kurz') or '')
    t = re.split(r'\n\s*Ingrédients|\nIngr[ée]dients', t)[0]
    out = {}
    for key, lab in [('zt', r'Zutaten'), ('hm', r'Harmoniert mit'), ('fl', r'Kochflüssigkeit'), ('rt', r'Regio[ -]?Tipp?'),
                     ('ds', r'Dosierung'), ('mr', r'Marinieren')]:
        m = re.search(r'(?im)^\s*' + lab + r'\s*:\s*(.*(?:\n(?![A-ZÄÖÜ][\w ./-]{2,24}:)(?!Enthält).*)*)', t)
        if m:
            out[key] = re.sub(r'\s*\n\s*', ', ', m.group(1)).strip(' ,')
    body = re.split(r'(?im)^\s*(Zutaten|Harmoniert mit|Kochflüssigkeit|Inspirationen)\s*:', t)[0].strip()
    lines = [l.strip() for l in body.split('\n') if l.strip()]
    claim = ''
    if lines and re.match(r'(?i)redline', lines[0]) and len(lines[0]) < 110:
        m = re.search(r'[–—-]\s*(.+)$', lines[0])
        claim = m.group(1).strip() if m else ''
        lines = lines[1:]
    out['claim'] = ohne_strich(claim)
    out['txt'] = [ohne_strich(l) for l in lines if not re.match(r'(?i)^(bequeme lieferung|tipp:|https?://)', l)][:4]
    out['frei'] = 'keine künstlichen Zusätze' in t
    return out


def gramm(menge):
    m = re.match(r'([\d.,]+)\s*(kg|g)', (menge or '').replace(' ', ''), re.I)
    if not m:
        return 0
    v = float(m.group(1).replace(',', '.'))
    return v * 1000 if m.group(2).lower() == 'kg' else v


def varianten(slug, gruppe):
    out = []
    for x in VAR.get(slug, []):
        if not x.get('preis'):
            continue
        art, menge = (x.get('art') or '').strip(), (x.get('menge') or '').strip()
        m = re.match(r'^(Dosen|Cancún|Pumpstreuer|Kanister)\s+([\d.,]+\s*k?g)$', art)
        if m:
            art, menge = {'Dosen': 'Dose', 'Cancún': 'Dose'}.get(m.group(1), m.group(1)), m.group(2)
        if re.match(r'^[\d.,]+\s*kg$', art):
            art, menge = 'Eimer', art
        if gruppe == 'set':
            art = '5 Dosen' if re.search(r'Dosen', x.get('name', '')) else '5 Streuer'
            if slug == 'nuesse-total-3500':
                art = '5 Beutel'
        if gruppe != 'set' and len(art) > 22:
            # Ersatzteile: den Teil nach dem Produktnamen als Variante zeigen
            art = x['name'].replace(PR[slug]['name'], '').strip() or art
        if slug == 'gewuerzstreuer':
            art = x['name'].replace('Gewürzglas & Ersatzteile', '').strip()
        g = gramm(menge)
        preis = float(x['preis'])
        out.append([art, menge.replace(' ', ''), preis, round(preis / g * 100, 2) if g else 0])
    if not out and PR[slug].get('preis'):
        out.append(['Stück', '', float(PR[slug]['preis']), 0])
    return out


def farbe(slug, zt):
    if slug in FARBE:
        return FARBE[slug]
    z = (zt or '').lower()
    best = None
    for rx, col in ZUTAT_FARBE:
        m = re.search(rx, z)
        if m and (best is None or m.start() < best[0]):
            best = (m.start(), col)
    if best is None:
        return '#a07a4a'
    # kleine, feste Abweichung pro Mischung, damit nebeneinander nicht alles gleich aussieht
    h = sum(ord(c) for c in slug) % 7 - 3
    r, g, b = int(best[1][1:3], 16), int(best[1][3:5], 16), int(best[1][5:7], 16)
    k = 1 + h * 0.035
    return '#%02x%02x%02x' % tuple(max(0, min(255, int(c * k))) for c in (r, g, b))


def ist_gewuerz(slug, p):
    k = set(p.get('kategorien', []))
    if slug in ('praezisionswaage', 'gemuese-bouillon-500g'):
        return False
    if k & {'snaecks', 'auserlesenes', 'suesses', 'redline-sets'} and slug != 'feuriges-suess':
        return False
    if re.search(r'cashew|nuss|nüsse|mandel|snack', p['name'], re.I):
        return False
    return bool(re.match(r'RedLine\b', p['name'], re.I) or 'alle' in k or 'produkte-mit-himalaya-salz' in k)


produkte = []
for slug, p in PR.items():
    k = p.get('kategorien', [])
    f = felder(p)
    if 'redline-sets' in k:
        gruppe = ['set']
    elif ist_gewuerz(slug, p):
        gruppe = ['gewuerz']
    else:
        gruppe = [g for g, ks in GRUPPE_KATS.items() if set(k) & ks]
        if slug == 'praezisionswaage':
            gruppe = ['kueche']
        if slug == 'gemuese-bouillon-500g':
            gruppe = ['feines']
        if 'grill' in gruppe and 'kueche' in gruppe:
            gruppe = ['grill', 'kueche']
        if not gruppe:
            gruppe = ['feines']
    name = re.sub(r'^RedLine\s+', '', p['name']).strip().rstrip(',')
    name = re.sub(r'\s+[–—]\s+', ': ', name).strip(' –')
    e = {'s': slug, 'n': name, 'g': gruppe, 'v': varianten(slug, gruppe[0]), 'lager': p.get('verfuegbar') == 'InStock',
         'url': p.get('url'), 'claim': f['claim'], 'txt': f['txt'], 'frei': f['frei']}
    for key in ('zt', 'hm', 'fl', 'rt', 'ds', 'mr'):
        if f.get(key):
            e[key] = ohne_strich(f[key])
    if gruppe[0] == 'gewuerz':
        kurz = KURZ.get(slug) or name.split()[0]
        e['k'] = kurz
        unter = name
        for w in kurz.split():
            unter = re.sub(r'(?i)(^|\s)' + re.escape(w) + r'(?=\s|$)', ' ', unter)
        unter = re.sub(r'\s+', ' ', unter.replace('Himalaya', '')).strip()
        if 'himalaya' in slug:
            unter = 'Gewürzsalz mit Himalaya-Salz'
            e['him'] = True
        e['u'] = unter
        e['c'] = farbe(slug, f.get('zt'))
        e['a'] = [a for a, rx in ARTEN if re.search(rx, p['name'], re.I)]
        hm = (f.get('hm') or '').lower()
        e['z'] = [key for key, ws in ZU if any(w in hm for w in ws)]
        fl = (f.get('fl') or '').lower()
        e['f'] = [key for key, ws in FL if any(w in fl for w in ws)]
        regs = [REGION_KEY[x] for x in k if x in REGION_KEY]
        andere = [r for r in regs if r != 'schweiz']
        e['r'] = sorted(set(regs))
        e['rh'] = andere[0] if andere else (regs[0] if regs else '')
    else:
        e['img'] = p.get('bild') or ''
        e['imgk'] = (p.get('bilder') or [''])[0] or e['img']
        e['kt'] = [x for x in k if x in UNTER]
    if gruppe[0] == 'set':
        e['k'] = SET_NAME.get(slug, name)
        e['so'] = SET_SORTEN.get(slug, [])
    produkte.append(e)

def nur_buchstaben(s):
    return re.sub(r'[^a-zäöüéè]', '', s.lower())


ZEICH_N = {nur_buchstaben(k): v for k, v in ZEICHNUNG.items()}

# Menü-Ideen (fünf Gerichte pro Gewürz, von waskocheichheute.ch/kochideen)
ideen = {}
for x in HITS:
    if not x.get('gerichte'):
        continue
    ideen[x['produkt']] = {
        't': ohne_strich(x['titel']), 'url': x.get('url'), 'pdf': x.get('pdf'),
        'gr': [{'a': g['art'], 't': ohne_strich(g['titel']), 'u': ohne_strich(g.get('unter') or ''), 'x': ohne_strich(g.get('text') or ''),
                'd': ZEICH_N.get(nur_buchstaben(g['titel']))} for g in x['gerichte']],
    }

# Rezepte pro Produkt (von waskocheichheute.ch/rezepte)
rez = {}
for r in REZ:
    for s in r.get('produkte') or []:
        rez.setdefault(s, []).append([ohne_strich(r['titel']).replace('T, Bone', 'T-Bone'), r['url'], (r.get('zutat') or [''])[0], (r.get('land') or [''])[0]])
rez = {s: {'n': len(l), 'l': l[:9]} for s, l in rez.items()}

KATS = {s: D['kategorien'][s]['titel'] for s in UNTER if s in D['kategorien']}
KATS.update({'buchen-holzkohle': 'Räuchern und Holzkohle', 'holz-oefen': 'Jiko Holzöfen', 'holzkohle-campinggrill': 'Tisch- und Campinggrills',
             'smoker-und-grills': 'Design-Grills und Smoker', 'grills': 'Fahrzeug-Grills', 'heizer': 'Holz-Heizer'})

out = {
    'stand': 'Daten aus dem Shop-Prototyp 2.2 (aus shop.waskocheichheute.ch), 30.10.2026',
    'produkte': produkte, 'ideen': ideen, 'rezepte': rez, 'kats': KATS,
    'bestseller': ['raclette-fondue', '1fueralles-gewuerzmischung-90g', 'helvetica-110g', 'poulet-gewuerzmischung-50g', 'bbq-kentucky'],
}
def saeubern(x):
    """Zum Schluss: in allen Texten (ausser Links) keine Gedankenstriche."""
    if isinstance(x, str):
        return x if x.startswith('http') or '–' not in x and '—' not in x else ohne_strich(x).strip(' ,')
    if isinstance(x, list):
        return [saeubern(v) for v in x]
    if isinstance(x, dict):
        return {k: saeubern(v) for k, v in x.items()}
    return x


out = saeubern(out)
with open(OUT, 'w', encoding='utf-8') as f:
    f.write('/* Shop-Daten, erzeugt aus dem Shop-Prototyp. Nicht von Hand ändern. */\nwindow.SHOP = ')
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

n_gew = sum(1 for p in produkte if p['g'][0] == 'gewuerz')
print('Produkte', len(produkte), 'Gewürze', n_gew, 'Ideen', len(ideen), 'Rezepte für', len(rez))
for g in ('set', 'feines', 'kueche', 'grill'):
    print(g, sum(1 for p in produkte if g in p['g']))
