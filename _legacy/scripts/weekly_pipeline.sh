#!/bin/bash
# weekly_pipeline.sh — Full weekly pipeline cycle
# Runs: collect -> analyze -> build new landing pages -> deploy -> GO/NO-GO check
# Logs to /tmp/weekly-pipeline.log
# Do NOT register with launchd directly; run manually or via launchd later.

set -euo pipefail

LOG=/tmp/weekly-pipeline.log
PIPELINE_DIR=/Users/mac/projects/pipeline-factory/pipeline
PROJECT_DIR=/Users/mac/projects/pipeline-factory

# NVM + node
export NVM_DIR=~/.nvm
. "$NVM_DIR/nvm.sh" 2>/dev/null || true
export PATH=/Users/mac/.nvm/versions/node/v20.20.2/bin:$PATH

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "$LOG"
}

log "=== Weekly Pipeline Start ==="

# ---------------------------------------------------------------------------
# 1. Full collection cycle (orchestrator)
# ---------------------------------------------------------------------------
log "--- Step 1: Full collection cycle ---"
cd "$PIPELINE_DIR"
python3 orchestrator.py 2>&1 | tee -a "$LOG" || log "WARN: orchestrator.py exited non-zero"

# ---------------------------------------------------------------------------
# 2. Build landing pages for new hypotheses
# ---------------------------------------------------------------------------
log "--- Step 2: Build landing pages for new hypotheses ---"
cd "$PIPELINE_DIR"

# Find hypothesis files generated in the last 7 days
HYPOTHESES_DIR="$PIPELINE_DIR/data/hypotheses"
if [ -d "$HYPOTHESES_DIR" ]; then
  find "$HYPOTHESES_DIR" -name "*.json" -newer "$PROJECT_DIR/weekly_pipeline.sh" | while read -r hyp_file; do
    hyp_id=$(python3 -c "import json,sys; d=json.load(open('$hyp_file')); print(d.get('hypothesis_id',''))" 2>/dev/null || true)
    if [ -z "$hyp_id" ]; then
      log "  Skipping $hyp_file — no hypothesis_id"
      continue
    fi

    # Check if landing page already exists in validation_targets.json
    already_exists=$(python3 -c "
import json,pathlib
t=pathlib.Path('$PIPELINE_DIR/config/validation_targets.json')
if t.exists():
    d=json.load(open(t))
    print('yes' if '$hyp_id' in d else 'no')
else:
    print('no')
" 2>/dev/null || echo "no")

    if [ "$already_exists" = "yes" ]; then
      log "  $hyp_id already has a landing page — skipping build"
      continue
    fi

    log "  Building landing page for $hyp_id ($hyp_file)"
    python3 builders/landing.py --hypothesis-file "$hyp_file" 2>&1 | tee -a "$LOG" || {
      log "  WARN: landing page build failed for $hyp_id"
      continue
    }

    # Determine output dir
    slug_dir=$(python3 -c "
import json,re,pathlib
d=json.load(open('$hyp_file'))
hyp_id=d.get('hypothesis_id','H-XXX').lower().replace('-','').replace('_','')
title=d.get('title','landing')
title=title.split('—')[0] if '—' in title else title
slug=re.sub(r'[^a-z0-9\s-]','',title.lower())
slug=re.sub(r'\s+','-',slug.strip())[:50]
print(f'{hyp_id}-{slug}')
" 2>/dev/null || echo "")

    if [ -n "$slug_dir" ]; then
      LANDING_DIR="$PROJECT_DIR/landing-pages/$slug_dir"
      if [ -d "$LANDING_DIR" ]; then
        log "  Deploying $hyp_id -> $LANDING_DIR"
        python3 deployers/cloudflare.py \
          --hypothesis-id "$hyp_id" \
          --dir "$LANDING_DIR" \
          2>&1 | tee -a "$LOG" || log "  WARN: deploy failed for $hyp_id"
      fi
    fi
  done
else
  log "  No hypotheses directory found at $HYPOTHESES_DIR"
fi

# ---------------------------------------------------------------------------
# 3. GO/NO-GO check on hypotheses that are ~2 weeks old
# ---------------------------------------------------------------------------
log "--- Step 3: GO/NO-GO check (2-week-old hypotheses) ---"
cd "$PIPELINE_DIR"
python3 - 2>&1 | tee -a "$LOG" << 'PYEOF'
import json
from pathlib import Path
from datetime import datetime, timedelta, timezone

PIPELINE_DIR = Path("/Users/mac/projects/pipeline-factory/pipeline")
TARGETS_PATH = PIPELINE_DIR / "config" / "validation_targets.json"
ANALYTICS_DIR = PIPELINE_DIR / "data" / "analytics"

if not TARGETS_PATH.exists():
    print("  No validation_targets.json found")
    raise SystemExit(0)

with open(TARGETS_PATH) as f:
    targets = json.load(f)

now = datetime.now(timezone.utc)
two_weeks_ago = now - timedelta(days=14)

for hyp_id, config in targets.items():
    deployed_at = config.get("deployed_at")
    if not deployed_at:
        continue

    try:
        dt = datetime.fromisoformat(deployed_at.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
    except Exception:
        continue

    if dt > two_weeks_ago:
        age_days = (now - dt).days
        print(f"  {hyp_id}: deployed {age_days}d ago — too recent for GO/NO-GO")
        continue

    # Load latest report
    hyp_analytics = ANALYTICS_DIR / hyp_id
    reports = sorted(hyp_analytics.glob("report_*.json")) if hyp_analytics.exists() else []
    if not reports:
        print(f"  {hyp_id}: no analytics reports found — skipping GO/NO-GO")
        continue

    with open(reports[-1]) as f:
        report = json.load(f)

    landing = report.get("landing", {})
    views = landing.get("total_views", 0)
    signups = landing.get("total_signups", 0)
    conversion = landing.get("conversion_rate", 0)
    criteria = config.get("success_criteria", {})

    min_views = criteria.get("min_pageviews", 100)
    min_signups = criteria.get("min_waitlist_signups", 15)
    target_conv = criteria.get("target_conversion_rate", 0.10)

    checks = {
        "views_met": views >= min_views,
        "signups_met": signups >= min_signups,
        "conversion_met": conversion >= target_conv,
    }
    passed = sum(checks.values())
    verdict = "GO" if passed >= 2 else "NO-GO"

    print(f"\n  === GO/NO-GO: {hyp_id} ===")
    print(f"  Views: {views}/{min_views} {'OK' if checks['views_met'] else 'FAIL'}")
    print(f"  Signups: {signups}/{min_signups} {'OK' if checks['signups_met'] else 'FAIL'}")
    print(f"  Conversion: {conversion*100:.1f}%/{target_conv*100:.0f}% {'OK' if checks['conversion_met'] else 'FAIL'}")
    print(f"  VERDICT: {verdict} ({passed}/3 criteria met)")

    # Save verdict
    verdict_path = ANALYTICS_DIR / hyp_id / "verdict.json"
    (ANALYTICS_DIR / hyp_id).mkdir(parents=True, exist_ok=True)
    with open(verdict_path, "w") as f:
        json.dump({
            "hypothesis_id": hyp_id,
            "verdict": verdict,
            "checked_at": now.isoformat(),
            "checks": checks,
            "metrics": {"views": views, "signups": signups, "conversion": conversion},
        }, f, indent=2)
    print(f"  Verdict saved: {verdict_path}")
PYEOF

# ---------------------------------------------------------------------------
# 4. Analytics loop (collect fresh metrics for all hypotheses)
# ---------------------------------------------------------------------------
log "--- Step 4: Analytics loop ---"
cd "$PIPELINE_DIR"
python3 promoters/analytics_loop.py 2>&1 | tee -a "$LOG" || log "WARN: analytics_loop.py exited non-zero"

log "=== Weekly Pipeline Done ==="
