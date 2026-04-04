#!/bin/bash
cd /Users/mac/projects/pipeline-factory/pipeline
python3 promoters/bluesky_monitor.py >> /tmp/bluesky-monitor.log 2>&1
