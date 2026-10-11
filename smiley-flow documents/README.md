# Smiley Flow

Path-connecting puzzle game. Plain HTML, CSS and JavaScript. No build step and no libraries.

## Run it
- Quick test: open `index.html` in Chrome.
- Better (local server): `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Structure
```
index.html          screens (Home, Levels, Game, Shop, Theme) and win/lose dialogs
css/style.css       plain fallback styles (navy and gold, light and dark)
css/theme.css       the code-drawn glossy look (buttons, SVG icons, diamond, stars, popups)
css/skin.css        styles that use your images from assets/ui/ (see ASSETS.md)
js/config.js        constants, emoji packs, line colors, TEST_UNLOCK
js/state.js         save data (localStorage), sound, coins and hints display
js/screens.js        home helpers, daily reward, settings popup, shop, emoji pack list
js/ui.js            screen switching, level list, shop, themes, emoji images
js/levels.js        precomputed levels (each has exactly one solution that fills the board)
js/gen.js            live random level maker (Random Level button)
js/generator.js     level loader and emoji picker per pair
js/fx.js            particle effects (trail sparks, bursts, rings, confetti)
js/online.js        online mode: world list, world levels, progress
js/world.js         world effects (snow and fog for the Ice Cave)
js/audio.js         music loops and voice clips
js/skin.js          detects your images in assets/ui/ and switches the matching style on
js/game.js          game engine: moves, drawing, hints, timer, win and lose
js/main.js          pointer input and startup
assets/ui/          your backgrounds, buttons and board art (see ASSETS.md)
assets/anim/        optional animated emojis for combos and dialogs
assets/packs/       emoji art, one folder per pack, files named by Unicode hex (1f600.webp)
tools/              zip makers that download emoji packs from jsDelivr (need internet)
```
Scripts load in the order listed in `index.html`. Do not reorder them.

## Packs
| Pack | Folder | Status |
|------|--------|--------|
| Faces | `assets/packs/faces` | 84 files, complete |
| Animals | `assets/packs/animals` | 80 files, complete |
| Fruits & Veg | `assets/packs/fruits-veg` | 31 of 33 (pea pod and ginger missing from the library) |
| Hearts | `assets/packs/hearts` | missing: run `tools/hearts-zip-maker.html` and unzip into this folder |
| Clocks | `assets/packs/time` | missing: run `tools/time-zip-maker.html` and unzip into this folder |

Until a pack folder has its images, the game shows the system emoji instead.

### Add a new pack
1. Put the `.webp` files in `assets/packs/<name>/`.
2. Add one entry in `PACKS` in `js/config.js`: `{dir:'<name>', n:'Display name', p:<coin price>, e:[...emoji characters]}`.
3. Optional: add `bad:(a,b)=>...` to stop two look-alike items appearing in the same level.

## Tuning (all in `js/config.js`, `js/generator.js`, `js/game.js`)
- `TEST_UNLOCK`: levels unlocked at start. Set to `1` for release.
- Board size and pair count per level: `mk()` in `generator.js`.
- Time limit per level: `G.lim` in `play()` in `game.js`.
- Prices: `buy(...)` in `index.html` and `p:` in `PACKS`.

## Credits and license
Emoji art: Microsoft Fluent Emoji, © Microsoft Corporation, MIT License. Keep this credit in the game's About screen and keep the MIT text with the assets.

## Levels
- **Built-in levels** are in `js/levels.js`. Each has exactly one solution that fills the board (checked by a solver).
- **Random Level** (Levels screen) makes a new 5x5 to 8x8 level on the phone every time, with the same solver, so every random level also has one solution. Reward: `RANDOM_REWARD` in `js/config.js`.
- **Make many more levels (500+):** the tool is in `tools/level-generator/`.
  - On GitHub (easiest from a phone): push the project, open the Actions tab, run "Generate levels" (from 75 to 500). It uses 8 machines at once, takes about 15-20 minutes, and commits the new `js/levels.js` for you.
  - On a computer: `cd tools/level-generator`, `node make.js 75 500`, then `node merge.js ../../js/levels.js`. It is resumable: it skips levels already in `out/`.
  - On Android with Termux (overnight): `sh night.sh 75 500` in `tools/level-generator`. Check progress with `ls out | wc -l` and `tail night.log`.
  - Faster on Termux: `sh fast.sh 75 500` runs one worker per CPU core (`sh fast.sh 75 500 4` to use 4).
  - Change the difficulty curve (board size and pair count per level number) in the `sched` function in `make.js`.

## Economy and rules (js/config.js)
Diamonds replace coins. Earn `LEVEL_REWARD` (1) per level. A hint costs `HINT_COST` (5). `UNDO_COST` is 0 now; set it to 3 for paid undo. A rewarded ad gives `AD_REWARD` (2) once `ADS_ENABLED` is true. A finished line is locked: it only disappears with Undo. Blocker tiles (striped squares) cannot be entered and do not need filling.

## Online mode
Home has an Online button (needs internet). Worlds, their levels, music and animated emoji URLs come from `ONLINE_BASE` (see `online-content/README.md`). Offline Play is unchanged. Music and voice files: see `AUDIO-PROMPTS.md`.

## Themes and unlocking
- Board and game-screen themes (Neon, Snowy Biome, Jungle, Sky, Space) are in `BG_THEMES` in `js/config.js` (price in diamonds, moving effect in `js/world.js`, colors in `css/theme.css`). Emoji packs are bought and chosen in the Shop.
- Levels unlock one at a time as the player finishes the previous one. To test with everything open, add `?unlock` to the end of the page address.
- Hint costs 5 diamonds and glows the path for one pair; the player draws it.

## Online page
Home > Online. Shows connection status, a featured world banner, a card for every world with progress, loading and offline/error states, and the last world list is cached so it opens fast. Worlds come from `online-content/worlds.json`; progress is saved per world.
