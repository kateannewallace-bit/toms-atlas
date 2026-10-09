"""Draws the app icon (a chalk globe on a slate in a wooden frame, with a star at home) straight to PNG files.
Usage: python3 tools/make_icon.py <data-dir with countries-50m.json>
No image library needed: a tiny polygon filler with 4x supersampling."""
import json, math, os, struct, sys, zlib
w = json.load(open(os.path.join(sys.argv[1], 'countries-50m.json')))
t = w['transform']
arcs = []
for arc in w['arcs']:
    x = y = 0; pts = []
    for p in arc:
        x += p[0]; y += p[1]
        pts.append((x * t['scale'][0] + t['translate'][0], y * t['scale'][1] + t['translate'][1]))
    arcs.append(pts)
def ring(idxs):
    pts = []
    for i in idxs:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts
def ortho(lon, lat, l0=-100, p0=22):
    l, p, l0, p0 = map(math.radians, (lon, lat, l0, p0))
    c = math.sin(p0) * math.sin(p) + math.cos(p0) * math.cos(p) * math.cos(l - l0)
    return math.cos(p) * math.sin(l - l0), math.cos(p0) * math.sin(p) - math.sin(p0) * math.cos(p) * math.cos(l - l0), c
R, C = 150, 256
pt = lambda x, y: f'{C + R * x:.1f} {C - R * y:.1f}'
shapes = []  # (color, [rings]) painted in order, even-odd within each shape
def circle(cx, cy, r, n=180): return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]
def P(x, y): return (C + R * x, C - R * y)
WOOD, SLATE, SEA, CHALK, GREEN, YELLOW = (138, 98, 64), (38, 51, 45), (47, 74, 82), (238, 236, 227), (169, 217, 161), (243, 215, 122)
shapes.append((WOOD, [[(0, 0), (512, 0), (512, 512), (0, 512)]]))
shapes.append((SLATE, [[(34, 34), (478, 34), (478, 478), (34, 478)]]))
shapes.append((CHALK, [circle(C, C, R + 3)]))
shapes.append((SEA, [circle(C, C, R - 3)]))
def line(pts, wdt):
    quads = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L * wdt / 2, dx / L * wdt / 2
        quads.append([(x0 + nx, y0 + ny), (x1 + nx, y1 + ny), (x1 - nx, y1 - ny), (x0 - nx, y0 - ny)])
    return quads
GRAT = (82, 104, 108)
for lon in range(-180, 180, 30):
    seg = [P(x, y) for x, y, c in (ortho(lon, lat) for lat in range(-90, 91, 3)) if c > 0]
    for q in line(seg, 2): shapes.append((GRAT, [q]))
for lat in range(-60, 61, 30):
    seg = [P(x, y) for x, y, c in (ortho(lon, lat) for lon in range(-180, 181, 3)) if c > 0]
    for q in line(seg, 2): shapes.append((GRAT, [q]))
for g in w['objects']['countries']['geometries']:
    polys = [g['arcs']] if g['type'] == 'Polygon' else g['arcs']
    for poly in polys:
        pts = [ortho(*p) for p in ring(poly[0])]
        vis = [P(x, y) for x, y, c in pts if c > 0]
        if len(vis) < len(pts) * 0.6 or len(vis) < 4: continue
        shapes.append((GREEN, [vis[::max(1, len(vis) // 200)]]))
# a clean chalk rim over the edges of the land and lines
shapes.append((SLATE, [circle(C, C, R + 14), circle(C, C, R + 3)]))
shapes.append((CHALK, [circle(C, C, R + 3), circle(C, C, R - 2)]))
gx, gy = P(*ortho(-121.06, 39.22)[:2])
star = [(gx + (16 if i % 2 == 0 else 6.8) * math.cos(-math.pi / 2 + i * math.pi / 5), gy + (16 if i % 2 == 0 else 6.8) * math.sin(-math.pi / 2 + i * math.pi / 5)) for i in range(10)]
shapes.append((SLATE, [[(gx + (x - gx) * 1.35, gy + (y - gy) * 1.35) for x, y in star]]))
shapes.append((YELLOW, [star]))

def render(size, ss=4):
    n = size * ss; k = n / 512
    px = [bytearray(n * 3) for _ in range(n)]
    for color, rings in shapes:
        edges = []
        for r in rings:
            for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]):
                if y0 != y1: edges.append((x0 * k, y0 * k, x1 * k, y1 * k))
        if not edges: continue
        ymin = max(0, int(min(min(e[1], e[3]) for e in edges))); ymax = min(n - 1, int(max(max(e[1], e[3]) for e in edges)) + 1)
        cb = bytes(color)
        for yi in range(ymin, ymax + 1):
            y = yi + 0.5
            xs = sorted(x0 + (y - y0) * (x1 - x0) / (y1 - y0) for x0, y0, x1, y1 in edges if (y0 <= y < y1) or (y1 <= y < y0))
            row = px[yi]
            for a, b in zip(xs[::2], xs[1::2]):
                a = max(0, int(a + 0.5)); b = min(n, int(b + 0.5))
                if b > a: row[a * 3:b * 3] = cb * (b - a)
    out = bytearray()
    for y in range(size):
        out.append(0)
        rows = px[y * ss:(y + 1) * ss]
        for x in range(size):
            for ch in range(3):
                out.append(sum(r[(x * ss + i) * 3 + ch] for r in rows for i in range(ss)) // (ss * ss))
    def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(bytes(out), 9)) + chunk(b'IEND', b'')

here = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'icons')
for name, size in (('icon-512.png', 512), ('icon-192.png', 192), ('apple-touch-icon.png', 180)):
    open(os.path.join(here, name), 'wb').write(render(size, 4 if size < 300 else 2))
    print('wrote', name)
