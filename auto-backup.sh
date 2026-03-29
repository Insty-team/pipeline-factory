#!/bin/bash
cd /Users/mac/projects/pipeline-factory
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "auto-backup: $(date '+%Y-%m-%d %H:%M')"
  git push origin main 2>/dev/null
fi
