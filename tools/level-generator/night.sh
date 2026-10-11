#!/data/data/com.termux/files/usr/bin/sh
# Overnight level maker for Termux. Usage: sh night.sh [from] [to]   (default 75 500)
# Makes levels in batches of 25 and updates js/levels.js after every batch.
# Safe to stop and run again: it skips levels that are already made.
cd "$(dirname "$0")" || exit 1
node -v >/dev/null 2>&1 || { echo "Node.js does not work. Run: pkg upgrade"; exit 1; }
termux-wake-lock 2>/dev/null
FROM=${1:-75}; TO=${2:-500}
echo "start $(date) levels $FROM-$TO" >> night.log
S=$FROM
while [ "$S" -le "$TO" ]; do
  E=$((S+24)); [ "$E" -gt "$TO" ] && E=$TO
  node make.js "$S" "$E" >> night.log 2>&1
  node merge.js ../../js/levels.js >> night.log 2>&1
  echo "saved up to level $E at $(date)" >> night.log
  S=$((E+1))
done
echo "finished $(date)" >> night.log
termux-wake-unlock 2>/dev/null
