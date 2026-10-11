#!/data/data/com.termux/files/usr/bin/sh
# Gets Microsoft's animated Fluent emoji (animated PNG, stored with Git LFS) for the map cards.
# Needs internet, git and git-lfs:  pkg install git git-lfs && git lfs install
# Usage (from the project folder):  sh tools/get-animated.sh
# It finds each emoji by name; if one says NOT FOUND, tell me and I will fix the name.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
D="$HOME/fe-anim"
[ -d "$D/.git" ] || GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 --filter=blob:none --no-checkout https://github.com/microsoft/fluentui-emoji-animated.git "$D" || exit 1
git -C "$D" ls-tree -r --name-only HEAD > "$D/list.txt"
get() { # folder  emoji-name
  P=$(grep -i "/$2/" "$D/list.txt" | grep -i '\.png$' | head -1)
  if [ -z "$P" ]; then echo "NOT FOUND: $2"; return; fi
  git -C "$D" checkout HEAD -- "$P" 2>/dev/null
  git -C "$D" lfs pull --include="$P" 2>/dev/null
  mkdir -p "$ROOT/online-content/$1/anim"
  cp "$D/$P" "$ROOT/online-content/$1/anim/icon.png" && echo "OK: $1 <- $P"
}
get smiley-island "grinning face"
get animal-farm "cow face"
get love-town "red heart"
get time-map "alarm clock"
get ice-cave "ice"
get jungle "palm tree"
get sky "cloud"
get space "rocket"
echo "Done. Now: git add . && git commit -m animated && git push"
