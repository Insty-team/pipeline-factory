#!/bin/bash
export NVM_DIR=~/.nvm && . "$NVM_DIR/nvm.sh" 2>/dev/null
export PATH=/Users/mac/.nvm/versions/node/v20.20.2/bin:$PATH
cd /Users/mac/projects/pipeline-factory/pipeline
echo "$(date) === Daily Pipeline Start ===" >> /tmp/daily-pipeline.log
python3 promoters/analytics_loop.py >> /tmp/daily-pipeline.log 2>&1
python3 promoters/daily_content.py >> /tmp/daily-pipeline.log 2>&1
python3 promoters/bluesky_monitor.py >> /tmp/daily-pipeline.log 2>&1
python3 promoters/daily_report.py >> /tmp/daily-pipeline.log 2>&1
echo "$(date) === Daily Pipeline Done ===" >> /tmp/daily-pipeline.log
