# Image prompts for Smiley Flow art

How to use: paste the STYLE line first, then the item prompt, in your image generator. Generate big (1024 px or more), remove the background (transparent PNG) where it says "transparent", resize to the size shown, and save with the exact file name into `assets/ui/` (or `assets/anim/`). Reload the game: each file switches on by itself. Generate every item in the same session so the style matches.

**STYLE (always include):** glossy cartoon mobile game UI, thick dark purple outlines, soft 3D candy look, bright orange, green and yellow gradients, rounded shapes, clean vector style, high contrast, no text, no watermark, centered.

## Backgrounds (portrait, no transparency, 1080x1920)
- **bg-home.png:** soft pastel pink, lavender and sky blue gradient background, large blurred faint 3D emoji faces scattered around, math-free, empty space in the middle for a logo and buttons, no text.
- **bg-levels.png:** same pastel pink and lavender style, quieter, fewer faces, lots of empty space for a grid of buttons, no text.
- **bg-game.png:** deep purple to dark navy neon background, faint glowing circuit lines and small glowing squares, empty center, no text.

## Logo (transparent, 900x500)
- **logo.png:** game logo with the words "SMILEY FLOW" in two lines, chunky cookie-like yellow-orange letters with a thick dark purple outline and a glossy highlight, one happy yellow emoji face sitting on top, transparent background.

## Buttons (transparent). Leave them blank: the game writes the label.
- **btn-primary.png (600x180):** wide rounded pill button, glossy orange gradient, thick dark outline, soft inner highlight, empty, no text, no icon.
- **btn-secondary.png (600x180):** same wide rounded pill button in glossy green, empty, no text, no icon.

## Icon buttons (transparent, 256x256). The icon is part of the image: no words.
Use "round glossy button, thick dark outline, [color], with a white [icon] icon in the center":
- **btn-back.png:** red, white left arrow.
- **btn-undo.png:** red, white curved undo arrow.
- **btn-reset.png:** purple, white circular refresh arrows.
- **btn-hint.png:** green, white glowing light bulb.
- **btn-help.png:** orange, white question mark.
- **btn-sound.png:** blue, white speaker with sound waves.

## Panels and board
- **panel.png (600x160, transparent):** wide rounded rectangle plate, dark teal with a golden border and soft gloss, empty, for holding a counter.
- **board-frame.png (1024x1024, transparent center):** square neon frame for a puzzle board, glowing purple and blue border with rounded corners, the inside completely transparent.
- **cell.png (128x128):** one dark navy-purple square tile with a thin glowing blue outline, flat, seamless when repeated.
- **block.png (128x128):** one empty blocked square, very dark navy, flat, no outline, no details (it sits next to other dark squares).

## Levels, stars, diamond, popup
- **level-tile.png (256x256, transparent):** rounded square button, glossy blue gradient, thick dark outline, empty.
- **level-locked.png (256x256, transparent):** the same rounded square button in grey, with a small dark padlock in the center.
- **star-on.png (128x128, transparent):** glossy golden star, thick dark outline.
- **star-off.png (128x128, transparent):** the same star shape in dull grey, empty.
- **diamond.png (128x128, transparent):** shiny cyan-blue diamond gem, glossy facets, dark outline.
- **dialog.png (800x900, transparent):** popup panel, rounded, glossy purple with a golden border, empty inside, small decorative ribbon at the top with no text.

## Animated emojis (assets/anim/, WebP, 128x128, transparent)
Make them from the Fluent animated set or any animated emoji tool, then convert to animated WebP:
combo-2.webp (cool face), combo-3.webp (fire), combo-4.webp (star-eyes face), combo-5.webp (rocket), win.webp (party popper), lose.webp (stopwatch).

## Tips
- Buttons and panels stretch to fit, so keep their edges simple and centered.
- If an image looks wrong, delete the file and the game goes back to the plain version of that part.
- Ask the generator for "same style as the previous image" to keep everything matching.
