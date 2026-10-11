# Online content (maps)

The game loads `worlds.js` and each map's `levels.js` with script tags, so it works from a phone, a WebView or GitHub, with no fetch or CORS problems.
The `.json` files are the sources. After changing them run (in `tools/level-generator`): `node online-js.js ../../online-content`.

# Online content (worlds)

This folder is NOT part of the app. Put it on GitHub and the app downloads worlds from it (needs internet).

## Set up
1. Create a public GitHub repo and upload this folder's files (keep the structure).
2. In the game, edit `ONLINE_BASE` in `js/config.js` to `https://cdn.jsdelivr.net/gh/<your-user>/<your-repo>@main/` (add `online-content/` at the end if the files sit in that folder).
3. Test locally: run `python3 -m http.server 8000` in the project folder and open `http://localhost:8000` (the default `ONLINE_BASE` is the local folder).

## Add a world
Add an entry to `worlds.json`: id, name, emoji, desc, fx, levels file, music file, animated emoji URLs. `fx` picks the look (`ice` exists now; other looks need code). Level files are made with `tools/level-generator/gen-world.js` (for example `node gen-world.js 9000 20 > jungle/levels.json`). Worlds shipped: Ice Cave, Jungle Ruins, Sky Islands and Star Station (20 levels each). `fx` can be `ice`, `jungle`, `sky` or `space`; `featured:true` puts a world in the big banner. Also make the `<world>/anim/` folder with your six animated emojis, and `music.mp3` per world.

## Animated emojis (host your own, small files)
Do not link to other people's repositories: they can be renamed, deleted or rate-limited, and some licenses are unclear. Download only the 6 you need (about 100-300 KB each), save them as animated WebP, 128x128, and put them in `ice-cave/anim/` in YOUR repo:
combo-2.webp, combo-3.webp, combo-4.webp, combo-5.webp, win.webp, lose.webp.
`worlds.json` already points at those names. Until the files exist, the game shows a CSS-animated emoji instead. Suggested source: Google's Noto animated emoji (googlefonts.github.io/noto-emoji-animation, check the license shown there; it requires credit). Credit the source in your About screen.
You can also put the same files in `assets/anim/` inside the app so they work offline.
