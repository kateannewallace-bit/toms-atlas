# Tom's Atlas

Geography for young kids who aren't reading yet, on the same chalkboard and engine as [Tom's Chalkboard](https://github.com/kateannewallace-bit/toms-chalkboard). Every question is read aloud, and the child answers by tapping the real map.

- **Where we live:** our state, country, continent and ocean, with a star on home (Grass Valley, California) on every map.
- **Continents and oceans:** a voice asks "Where is Africa?" and the child taps it on a world map colored like a classroom globe.
- **Countries:** 65 countries in sets of six, from big and famous (the United States, Russia, Egypt, Greece) to smaller and farther. Four countries light up in different chalk colors; small countries get a close-up of their part of the world and a dashed ring that's easy to tap.
- **Flags:** "Which flag belongs to Japan?" with four flags, and once a country is known, "Whose flag is this? Tap the country!"
- **US states:** all fifty, starting with California and its neighbors.
- **Teach, then ask:** a new place is shown on the map with a short spoken fact first, and asked a couple of questions later. About four new places per round.
- **A wrong tap names the place** ("That's Kenya. Try again!"), so every tap teaches.
- **Say it:** places already known sometimes light up for the child to name out loud, then hear and check.
- **Levels and review:** each level adds a set of places. Missed places come back after 1, 3, 7, 14 and 30 days. Finishing a topic turns on the next one.
- The home screen fills in a map of every country and state the child knows. Rounds end with a cheer and an off-screen idea. The grown-ups page has a quick check, known places, levels, tricky places, printable maps to color, and sync.

## Run it

It's a static site with no build step:

```bash
python3 -m http.server 8782
```

On an iPad or iPhone, open the site in Safari and tap **Share → Add to Home Screen**. It then opens full screen and works offline.

## Sync between devices (optional)

Uses the same Supabase project and `supabase/schema.sql` as Tom's Chalkboard. Sync codes are hashed with a different prefix, so the apps never share a row.

## Changing things

- Places, facts, sets, home, cheers and off-screen ideas are in `places.js`. To live somewhere else, change `HOME` there (the star's position comes from `tools/build_maps.py`).
- `maps.js` is generated: `python3 tools/build_maps.py <data-dir>` (the script's top comment lists the three files to download). `tools/make_icon.py` draws the icons.
- After changing files, bump `VERSION` in `sw.js` so installed copies pick up the change.

Map data: [Natural Earth](https://www.naturalearthdata.com/) (public domain), via world-atlas and us-atlas.
