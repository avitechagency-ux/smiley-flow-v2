#!/data/data/com.termux/files/usr/bin/sh
# Fast level maker for Termux: runs one worker per CPU core at the same time.
# Usage: sh fast.sh [from] [to] [workers]     (default 75 500, workers = number of cores)
# Safe to stop and run again: it skips levels that are already made.
cd "$(dirname "$0")" || exit 1
node -v >/dev/null 2>&1 || { echo "Node.js does not work. Run: pkg upgrade"; exit 1; }
termux-wake-lock 2>/dev/null
FROM=${1:-75}; TO=${2:-500}; N=${3:-$(nproc)}
echo "start $(date) levels $FROM-$TO workers $N" >> fast.log
i=0
while [ "$i" -lt "$N" ]; do
  node make.js "$FROM" "$TO" "$i" "$N" >> fast.log 2>&1 &
  i=$((i+1))
done
wait
node merge.js ../../js/levels.js >> fast.log 2>&1
echo "finished $(date)" >> fast.log
termux-wake-unlock 2>/dev/null
echo "Done. Levels made: $(ls out | wc -l)"
