# Art slots

Drop your generated images into `assets/ui/` using EXACTLY these names (PNG, transparent background where noted). Every slot is optional: a missing image keeps the plain fallback for that part. The game finds new images by itself, no code change needed. Refresh the page after adding files.

## Backgrounds (no transparency, portrait, about 1080x1920)
| File | Used on |
|------|---------|
| bg-home.png | Home screen |
| bg-levels.png | Levels, Shop and Theme screens |
| bg-game.png | Gameplay screen |

## Logo
| logo.png | Title on Home, transparent, about 900x500 (replaces the "SMILEY FLOW" text) |

## Text buttons (blank: the game writes the label on top, transparent, about 600x180)
| btn-primary.png | PLAY, Next level, +20 seconds |
| btn-secondary.png | Shop, Theme, Daily Puzzle, Retry, Levels |

## Icon buttons (the icon is inside the image, no text, transparent, 256x256)
btn-back.png, btn-undo.png, btn-reset.png, btn-hint.png, btn-help.png, btn-sound.png
(The sound button is dimmed automatically when sound is off. The hint and undo cost badges are drawn by the game.)

## Panels and board
| panel.png | Backgrounds for the diamond counter, stat pills and Theme/Shop rows, transparent, about 600x160, stretches |
| board-frame.png | Frame around the board, transparent in the middle, square, about 1024x1024. The board sits inside with a 4% margin |
| cell.png | One grid square, repeated across the board, 128x128 (optional) |
| block.png | Blocked / empty cell that lines cannot enter (drawn dark with no grid lines by default), 128x128 |

## Levels, stars, diamond, dialogs
| level-tile.png | Unlocked level button, about 256x256 |
| level-locked.png | Locked level button, about 256x256 |
| star-on.png / star-off.png | Earned and empty star, 128x128 transparent |
| diamond.png | Diamond icon (used everywhere a diamond is shown), 128x128 transparent |
| dialog.png | Background of the Level complete and Time's up popups, about 800x900, stretches |

## Animated emojis (assets/anim/, optional)
Animated WebP or GIF-converted WebP, about 128x128, transparent. Without them the game uses a CSS-animated emoji.
combo-2.webp (Nice), combo-3.webp (Great), combo-4.webp (Perfect), combo-5.webp (Unstoppable), win.webp (Level complete), lose.webp (Time's up).
