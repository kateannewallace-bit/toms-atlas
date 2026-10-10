"""Builds maps.js from public map data, already projected so the app needs no map library.

Usage: python3 tools/build_maps.py <data-dir>
where <data-dir> holds:
  countries-50m.json      from https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
  states-albers-10m.json  from https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json
  countries.json          from https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json
  ne_50m_geography_marine_polys.geojson
                          from https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_50m_geography_marine_polys.geojson
Map data: Natural Earth (public domain) via world-atlas and us-atlas.
"""
import json, math, os, sys

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'maps.js')
HOME = (-121.0611, 39.2191)  # Grass Valley, California

# ---------- topojson ----------
def decode_arcs(topo):
    t = topo.get('transform')
    arcs = []
    for arc in topo['arcs']:
        x = y = 0
        pts = []
        for p in arc:
            if t:
                x += p[0]; y += p[1]
                pts.append((x * t['scale'][0] + t['translate'][0], y * t['scale'][1] + t['translate'][1]))
            else:
                pts.append((p[0], p[1]))
        arcs.append(pts)
    return arcs

def ring(arcs, idxs):
    pts = []
    for i in idxs:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts

def polygons(arcs, g):
    if g['type'] == 'Polygon':
        return [[ring(arcs, r) for r in g['arcs']]]
    if g['type'] == 'MultiPolygon':
        return [[ring(arcs, r) for r in poly] for poly in g['arcs']]
    return []

# ---------- clipping (Sutherland-Hodgman against one vertical line) ----------
def clip(pts, x0, keep_left):
    inside = (lambda p: p[0] <= x0) if keep_left else (lambda p: p[0] >= x0)
    out = []
    n = len(pts)
    for i in range(n):
        a, b = pts[i - 1], pts[i]
        ia, ib = inside(a), inside(b)
        if ia != ib:
            t = (x0 - a[0]) / (b[0] - a[0])
            out.append((x0, a[1] + t * (b[1] - a[1])))
        if ib:
            out.append(b)
    return out

def fix_antimeridian(r):
    """Rings that jump across 180° are unwrapped, then cut back into the -180..180 window."""
    if not any(abs(r[i][0] - r[i - 1][0]) > 180 for i in range(1, len(r))):
        return [r]
    u = [r[0]]
    for p in r[1:]:
        x = p[0]
        while x - u[-1][0] > 180: x -= 360
        while x - u[-1][0] < -180: x += 360
        u.append((x, p[1]))
    if abs(u[-1][0] - u[0][0]) > 180:
        return [r]  # a ring around the pole (Antarctica): the data already closes it along the edge
    out = []
    for shift in (-360, 0, 360):
        s = [(x + shift, y) for x, y in u]
        s = clip(clip(s, -180, False), 180, True)
        if len(s) > 2: out.append(s)
    return out

# ---------- Natural Earth projection ----------
def ne(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    p2 = p * p; p4 = p2 * p2
    x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)))
    y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))
    return x, y
XMAX = ne(180, 0)[0]
YMAX = ne(0, 90)[1]
W = 1000.0
K = W / (2 * XMAX)
H = round(2 * YMAX * K, 1)
def proj(lon, lat):
    x, y = ne(lon, lat)
    return (W / 2 + x * K, H / 2 - y * K)

# ---------- simplify and format ----------
def dp(pts, tol):
    if len(pts) < 4: return pts
    if pts[0] == pts[-1]:
        # a closed ring: simplify the two halves split at the point farthest from the start
        far = max(range(len(pts)), key=lambda i: (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2)
        if 0 < far < len(pts) - 1:
            return dp(pts[:far + 1], tol)[:-1] + dp(pts[far:], tol)
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1e-9
        best, bi = -1, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / L
            if d > best: best, bi = d, i
        if best > tol:
            keep[bi] = True
            stack += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]

def area(pts):
    return abs(sum(pts[i - 1][0] * pts[i][1] - pts[i][0] * pts[i - 1][1] for i in range(len(pts)))) / 2

def path(rings, tol=0.25, min_area=0.4):
    parts = []
    for r in rings:
        r = dp(r, tol)
        if len(r) < 3 or area(r) < min_area: continue
        pts, last = [], None
        for x, y in r:
            q = (round(x, 1), round(y, 1))
            if q != last: pts.append(q); last = q
        if len(pts) < 3: continue
        s = 'M' + 'L'.join(f'{x:g} {y:g}' for x, y in pts) + 'Z'
        parts.append(s)
    return ''.join(parts)

def biggest(rings):
    return max(rings, key=area) if rings else []

def centroid(r):
    a = cx = cy = 0
    for i in range(len(r)):
        x0, y0 = r[i - 1]; x1, y1 = r[i]
        f = x0 * y1 - x1 * y0
        a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f
    if abs(a) < 1e-9:
        return (sum(p[0] for p in r) / len(r), sum(p[1] for p in r) / len(r))
    return (cx / (3 * a), cy / (3 * a))

def bbox(rings):
    xs = [p[0] for r in rings for p in r]; ys = [p[1] for r in rings for p in r]
    return [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)]

# ---------- world ----------
world = json.load(open(os.path.join(SRC, 'countries-50m.json')))
meta = {c['ccn3']: c for c in json.load(open(os.path.join(SRC, 'countries.json'))) if c.get('ccn3')}
by_name = {c['name']['common']: c for c in meta.values()}
NAME_FIX = {'Kosovo': 'XK', 'N. Cyprus': 'CY', 'Somaliland': 'SO', 'Siachen Glacier': 'IN', 'Indian Ocean Ter.': 'AU', 'Ashmore and Cartier Is.': 'AU'}
cca2 = {c['cca2']: c for c in meta.values()}

def continent_of(c):
    r, s = c['region'], c.get('subregion', '')
    if r == 'Americas': return 'SA' if s == 'South America' else 'NA'
    if r == 'Antarctic': return 'AN'
    if r == 'Oceania': return 'AU' if c['cca2'] in ('AU',) else 'OC'
    return {'Africa': 'AF', 'Europe': 'EU', 'Asia': 'AS'}[r]

arcs = decode_arcs(world)
OVERSEAS = {
    'FR': lambda lon, lat: ('SA' if lat < 10 else 'NA') if lon < -30 else 'AF' if lon > 40 else None,
    'NL': lambda lon, lat: 'NA' if lon < -30 else None,
    'US': lambda lon, lat: 'OC' if lon < -150 and lat < 30 else None,
    'NO': lambda lon, lat: None,
}
shapes = []  # [code, continent, path, cx, cy, size, bbox]
for g in world['objects']['countries']['geometries']:
    name = g['properties']['name']
    c = meta.get(g.get('id')) or cca2.get(NAME_FIX.get(name, '')) or by_name.get(name)
    if not c and name == 'Kosovo':
        c = {'cca2': 'XK', 'region': 'Europe'}
    if not c:
        print('no metadata for', name, g.get('id')); continue
    code, cont = c['cca2'], continent_of(c)
    rings = []
    for poly in polygons(arcs, g):
        for r in poly:
            rings.extend(fix_antimeridian(r))
    pieces = [(code, cont, rings)]
    if code == 'RU':  # Europe west of the Urals, Asia east of them
        pieces = [('RU', 'EU', [clip(r, 60, True) for r in rings]), ('RU', 'AS', [clip(r, 60, False) for r in rings])]
    elif code in OVERSEAS:  # far-away parts (French Guiana, Hawaii…) belong to the continent they sit on
        groups = {}
        for r in rings:
            lon = sum(p[0] for p in r) / len(r); lat = sum(p[1] for p in r) / len(r)
            groups.setdefault(OVERSEAS[code](lon, lat) or cont, []).append(r)
        pieces = [(code, k, v) for k, v in groups.items()]
    for code_, cont_, rr in pieces:
        pr = [[proj(x, y) for x, y in r] for r in rr if len(r) > 2]
        pr = [r for r in pr if len(r) > 2]
        d = path(pr)
        if not d:
            d = path([biggest(pr)], tol=0.05, min_area=0)
        if not d: continue
        big = biggest(pr)
        cx, cy = centroid(big)
        size = sum(area(r) for r in pr)
        shapes.append([code_, cont_, d, round(cx, 1), round(cy, 1), round(size, 1), bbox([big])])

# ---------- oceans: lon/lat outlines drawn under the land ----------
def dense(poly, step=2):
    out = []
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        n = max(1, int(max(abs(b[0] - a[0]), abs(b[1] - a[1])) / step))
        for k in range(n):
            out.append((a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n))
    return [proj(x, y) for x, y in out]

OCEANS = {
    'pacific': [[(-180, 66), (-100, 66), (-100, 18), (-85, 18), (-85, 8.5), (-77, 8.5), (-77, -10), (-68, -10), (-68, -60), (-180, -60)],
                [(103, 66), (180, 66), (180, -60), (147, -60), (147, -25), (130, -25), (130, -9), (115, -8.7), (106, -6.5), (103, 0)]],
    'atlantic': [[(-100, 66), (42, 66), (42, 30), (30, 30), (30, -31), (25, -31), (25, -34.8), (20, -34.8), (20, -60), (-68, -60), (-68, -10), (-77, -10), (-77, 8.5), (-85, 8.5), (-85, 18), (-100, 18)]],
    'indian': [[(20, -60), (147, -60), (147, -25), (130, -25), (130, -9), (115, -8.7), (106, -6.5), (103, 0), (103, 30), (30, 30), (30, -31), (25, -31), (25, -34.8), (20, -34.8)]],
    'arctic': [[(-180, 90), (180, 90), (180, 66), (-180, 66)]],
    'southern': [[(-180, -60), (180, -60), (180, -90), (-180, -90)]],
}
# where each ocean's name is written, and where its "tap here" spot is
OCEAN_LABEL = {'pacific': (-140, 5), 'atlantic': (-35, 15), 'indian': (78, -22), 'arctic': (-150, 76), 'southern': (40, -63)}
oceans = {k: {'d': ''.join(path([dense(p)], tol=0.1, min_area=0) for p in polys), 'at': [round(v, 1) for v in proj(*OCEAN_LABEL[k])]} for k, polys in OCEANS.items()}
sphere = path([dense([(-180, 90), (180, 90), (180, -90), (-180, -90)])], tol=0.1, min_area=0)

# Close-up views (viewBox x, y, w, h) for small places, from lon/lat boxes
def view(lon0, lat0, lon1, lat1):
    pts = [proj(lon, lat) for lon in (lon0, (lon0 + lon1) / 2, lon1) for lat in (lat0, lat1)]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return [round(min(xs), 1), round(min(ys), 1), round(max(xs) - min(xs), 1), round(max(ys) - min(ys), 1)]
VIEWS = {
    'world': [0, 0, W, H],
    'NA': view(-170, 7, -50, 75), 'SA': view(-95, -57, -30, 14), 'EU': view(-25, 34, 45, 71),
    'AF': view(-20, -36, 54, 38), 'AS': view(25, -11, 150, 60), 'AU': view(110, -48, 180, 0), 'OC': view(110, -48, 180, 0),
    'AN': view(-180, -90, 180, -50), 'ME': view(24, 10, 64, 43), 'CB': view(-92, 7, -58, 27),
}

# ---------- seas, bays and gulfs: Natural Earth marine areas, each belonging to an ocean ----------
# Which ocean each marginal sea belongs to, following the IHO's Limits of Oceans and Seas
# (so Hudson Bay, Baffin Bay and the Norwegian Sea are Arctic). Anything not listed goes by where it sits.
SEA_OCEAN = {
    'arctic': ['Arctic Ocean', 'Baffin Bay', 'Barents Sea', 'Beaufort Sea', 'Chukchi Sea', 'Greenland Sea', 'Hudson Bay', 'James Bay',
               'Kara Sea', 'Laptev Sea', 'Melville Bay', 'White Sea', 'Amundsen Gulf', 'Ungava Bay', 'Norwegian Sea'],
    'atlantic': ['North Atlantic Ocean', 'South Atlantic Ocean', 'Bahía de Campeche', 'Bay of Biscay', 'Bay of Fundy', 'Chesapeake Bay',
                 'Golfe du Lion', 'Golfo San Jorge', 'Gulf of Bothnia', 'Gulf of Finland', 'Gulf of Guinea', 'Gulf of Honduras',
                 'Gulf of Maine', 'Gulf of Mexico', 'Gulf of Saint Lawrence', 'Río de la Plata', 'Adriatic Sea', 'Aegean Sea',
                 'Balearic Sea', 'Baltic Sea', 'Black Sea', 'Caribbean Sea', 'Inner Sea', 'Inner Seas', 'Ionian Sea', 'Irish Sea',
                 'Labrador Sea', 'Mediterranean Sea', 'North Sea', 'Sargasso Sea', 'Tyrrhenian Sea', 'Scotia Sea'],
    'indian': ['INDIAN OCEAN', 'Bay of Bengal', 'Gulf of Aden', 'Gulf of Kutch', 'Gulf of Mannar', 'Gulf of Oman', 'Persian Gulf',
               'Great Australian Bight', 'Andaman Sea', 'Arabian Sea', 'Laccadive Sea', 'Red Sea', 'Timor Sea'],
    'pacific': ['North Pacific Ocean', 'South Pacific Ocean', 'Bristol Bay', 'Cook Inlet', 'Bay of Plenty', 'Golfo de California',
                'Golfo de Panamá', 'Gulf of Alaska', 'Gulf of Thailand', 'Gulf of Tonkin', 'Shelikhova Gulf', 'Banda Sea', 'Bering Sea',
                'Bismarck Sea', 'Bo Hai', 'Celebes Sea', 'Ceram Sea', 'Coral Sea', 'East China Sea', 'Java Sea', 'Molucca Sea',
                'Philippine Sea', 'Sea of Japan', 'Sea of Okhotsk', 'Solomon Sea', 'South China Sea', 'Sulu Sea', 'Tasman Sea',
                'Yellow Sea', 'Arafura Sea', 'Gulf of Carpentaria'],
    'southern': ['SOUTHERN OCEAN', 'Amundsen Sea', 'Bellingshausen Sea', 'Ross Sea', 'Weddell Sea'],
    '': ['Caspian Sea'],  # a lake, not part of any ocean
}
OCEAN_OF = {name: k for k, names in SEA_OCEAN.items() for name in names}
def inside(pt, poly):
    x, y = pt; hit = False
    for i in range(len(poly)):
        (x0, y0), (x1, y1) = poly[i - 1], poly[i]
        if (y0 > y) != (y1 > y) and x < x0 + (y - y0) * (x1 - x0) / (y1 - y0): hit = not hit
    return hit
def ocean_at(lon, lat):
    for k, polys in OCEANS.items():
        if any(inside((lon, lat), p) for p in polys): return k
    return ''
import unicodedata
slug = lambda s: '-'.join(''.join(ch if ch.isascii() and ch.isalnum() else '' if unicodedata.combining(ch) else ' ' for ch in unicodedata.normalize('NFD', s.lower())).split())
marine = json.load(open(os.path.join(SRC, 'ne_50m_geography_marine_polys.geojson')))
water, seas = [], {}
for f in marine['features']:
    cla, name = f['properties']['featurecla'], f['properties']['name']
    g = f['geometry']
    polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
    rings = [r2 for poly in polys for r2 in fix_antimeridian([tuple(p) for p in poly[0]])]
    if not rings: continue
    big_ll = max(rings, key=area)
    ocean = OCEAN_OF.get(name)
    if ocean is None: ocean = ocean_at(*centroid(big_ll))
    pr = [[proj(x, y) for x, y in r] for r in rings]
    d = path(pr, tol=0.3, min_area=0.5)
    if not d: continue
    key = slug(name) if cla in ('sea', 'bay', 'gulf') else ''
    # oceans first, then seas on top, so every sea shows over the ocean around it
    water.append([0 if cla == 'ocean' else 1, ocean, key, d])
    if key:
        big = biggest(pr); cx, cy = centroid(big)
        seas[key] = [name, round(cx, 1), round(cy, 1), round(sum(area(r) for r in pr), 1), ocean]
water.sort(key=lambda w: w[0])
water = [w[1:] for w in water]

# ---------- United States (already projected, Albers with Alaska and Hawaii moved) ----------
us = json.load(open(os.path.join(SRC, 'states-albers-10m.json')))
uarcs = decode_arcs(us)
POSTAL = {'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'}
ushapes = []
for g in us['objects']['states']['geometries']:
    name = g['properties']['name']
    if name not in POSTAL: print('skipping', name); continue
    rings = [r for poly in polygons(uarcs, g) for r in poly]
    big = biggest(rings)
    cx, cy = centroid(big)
    ushapes.append([POSTAL[name], name, path(rings, tol=0.3, min_area=0.3), round(cx, 1), round(cy, 1), round(sum(area(r) for r in rings), 1), bbox([big])])
ub = us['bbox']

# Albers USA (lower 48), the same projection us-atlas used, to place home on the US map
def albers_usa(lon, lat):
    p0, p1 = math.radians(29.5), math.radians(45.5)
    n = (math.sin(p0) + math.sin(p1)) / 2
    c = 1 + math.sin(p0) * (2 * n - math.sin(p0))
    r0 = math.sqrt(c) / n
    def raw(l, p):
        l, p = math.radians(l), math.radians(p)
        r = math.sqrt(c - 2 * n * math.sin(p)) / n
        return r * math.sin(l * n), r0 - r * math.cos(l * n)
    x, y = raw(lon + 96, lat)
    cx, cy = raw(-0.6, 38.7)
    return (487.5 + 1300 * (x - cx), 305 - 1300 * (y - cy))

names = {c['cca2']: c['name']['common'] for c in meta.values()}
names['XK'] = 'Kosovo'
used = {sh[0] for sh in shapes}
data = {
    'world': {'w': W, 'h': H, 'sphere': sphere, 'shapes': shapes, 'names': {k: v for k, v in names.items() if k in used}, 'oceans': oceans, 'water': water, 'seas': seas, 'views': VIEWS},
    'us': {'w': 975, 'h': 610, 'shapes': ushapes},
    'home': {'world': [round(v, 1) for v in proj(*HOME)], 'us': [round(v, 1) for v in albers_usa(*HOME)]},
}
with open(OUT, 'w') as f:
    f.write('// Generated by tools/build_maps.py from Natural Earth data (public domain) via world-atlas and us-atlas. Do not edit by hand.\n')
    f.write('window.MAPS = ' + json.dumps(data, separators=(',', ':')) + ';\n')
print('world shapes', len(shapes), 'us shapes', len(ushapes), 'size', os.path.getsize(OUT), 'home', data['home'], 'H', H)
