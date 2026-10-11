# Publishing Smiley Flow on Google Play

## 0. Before you build
- Finish the levels (10,000) and pull them into this folder (`js/levels.js` + `levels/`).
- Put `online-content/` on GitHub and set `ONLINE_BASE` in `src/config.js.txt` to your jsDelivr link, then run `node tools/build.js`:
  `https://cdn.jsdelivr.net/gh/<your-user>/<your-repo>@main/online-content/`
- Add your art (`assets/ui/`), music (`assets/music/`) and voice clips (`assets/voice/`) if you have them.

## 1. Turn the web game into an Android app (Capacitor)
The whole game folder becomes the app, so the 10,000 offline levels work without internet. Only the Online maps need internet.
1. Make an Android project that wraps this folder (Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/android`, `npx cap init`, set `webDir` to this folder, `npx cap add android`, `npx cap sync`).
2. Build a signed release bundle (.aab) with GitHub Actions (free). I can write that workflow for you once the levels are done.
3. Add the AdMob plugin (rewarded ads: `ADS_ENABLED=true` in `src/config.js.txt`) and Google Play Billing (diamond packs) later; the game works without them.

## 2. Play Console checklist
- Developer account (one-time fee) and a **privacy policy web page** (required, also because of ads).
- App signing: use Play App Signing and keep your upload key safe.
- Store listing: 512x512 icon, 1024x500 feature graphic, at least 2 phone screenshots, short and full description.
- Forms: Data safety, content rating, ads declaration, target audience.
- Target the API level Play Console currently requires.
- New personal developer accounts must run a **closed test** (about 12 testers for 14 days) before production. Check the current rule in Play Console.

## 3. Credits and licenses to keep in the app
- Microsoft Fluent Emoji (MIT license): shown in Settings. Keep the MIT text with the assets.
- Any animated emoji, music or voice you add: check each license and credit it.
