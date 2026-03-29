#!/bin/bash
# weekly_pipeline_runner.sh — Retry wrapper for weekly pipeline
# launchd calls this at: Fri 20:00, Sat 00:00, Sat 04:10
# Skips if this week already succeeded (success marker file).

WEEK_NUM=$(date +%Y-W%V)
SUCCESS_MARKER="/tmp/weekly-pipeline-success-${WEEK_NUM}"
LOG=/tmp/weekly-pipeline.log
ATTEMPT_NUM=$(($(cat /tmp/weekly-pipeline-attempt 2>/dev/null || echo 0) + 1))

log() {
  echo "$(date "+%Y-%m-%d %H:%M:%S") [runner] $*" | tee -a "$LOG"
}

# Already succeeded this week — skip
if [ -f "$SUCCESS_MARKER" ]; then
  log "Week $WEEK_NUM already succeeded (attempt $(cat "$SUCCESS_MARKER")). Skipping."
  exit 0
fi

log "=== Weekly Pipeline Runner — Week $WEEK_NUM, Attempt $ATTEMPT_NUM ==="
echo "$ATTEMPT_NUM" > /tmp/weekly-pipeline-attempt

# Run the actual pipeline
/Users/mac/projects/pipeline-factory/weekly_pipeline.sh
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  log "SUCCESS on attempt $ATTEMPT_NUM"
  echo "$ATTEMPT_NUM" > "$SUCCESS_MARKER"
  rm -f /tmp/weekly-pipeline-attempt
else
  log "FAILED on attempt $ATTEMPT_NUM (exit code: $EXIT_CODE)"
  if [ $ATTEMPT_NUM -ge 3 ]; then
    log "All 3 attempts exhausted. Manual intervention needed."
    rm -f /tmp/weekly-pipeline-attempt
  else
    log "Will retry at next scheduled time."
  fi
fi

exit $EXIT_CODE
