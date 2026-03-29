# n8n — Automated Social Media Posting

Self-hosted n8n instance for automating promotion posts to Twitter, Reddit, and LinkedIn.

**Important:** OAuth credentials (Twitter, Reddit, LinkedIn) are configured inside the n8n UI — not in our code. Our pipeline only sends HTTP requests to n8n webhook endpoints.

---

## Setup

### 1. Start n8n

```bash
cd /path/to/pipeline-factory/n8n
docker compose up -d
```

### 2. Open n8n

Navigate to http://localhost:5678

Login with:
- Username: `admin`
- Password: `pipeline2026`

### 3. Import workflows

In the n8n UI:
1. Click **Workflows** in the left sidebar
2. Click **Import from file** (or use the + button > Import)
3. Import each file from `n8n/workflows/`:
   - `twitter_post.json` — single Twitter post
   - `reddit_post.json` — single Reddit post
   - `linkedin_post.json` — single LinkedIn post
   - `multi_channel_post.json` — routes to Twitter/Reddit/LinkedIn/Indie Hackers based on `channel` field (with error handling)
   - `scheduled_validation.json` — cron-based validation check every 30min + notifications

### 4. Connect credentials

For each workflow, open it and click the credential node to configure OAuth:

**Twitter:**
1. Go to Credentials > New > Twitter OAuth1 API
2. Create a Twitter Developer app at https://developer.twitter.com
3. Enter your API Key, API Secret, Access Token, Access Token Secret

**Reddit:**
1. Go to Credentials > New > Reddit OAuth2 API
2. Create a Reddit app at https://www.reddit.com/prefs/apps (type: "script")
3. Enter your Client ID, Client Secret, username, password

**LinkedIn:**
1. Go to Credentials > New > LinkedIn OAuth2 API
2. Create a LinkedIn app at https://www.linkedin.com/developers/apps
3. Complete the OAuth2 flow in n8n

### 5. Activate workflows

Open each imported workflow and click the **Active** toggle (top right) to enable it.

### 6. Start the Pipeline API server

The scheduled validation workflow calls the pipeline API server. Start it before activating the scheduled workflow:

```bash
cd /path/to/pipeline-factory/pipeline
python3 api_server.py              # default port 8000
python3 api_server.py --port 9000  # custom port
```

Endpoints:
- `POST /api/validate` — run a validation cycle
- `POST /api/notify` — receive and log notifications
- `GET /api/health` — health check

### 7. Test with the pipeline

```bash
cd /path/to/pipeline-factory/pipeline

# Generate promotion posts first (if not already done)
python3 validate_loop.py --hypothesis H-006 --generate-promos

# See which channels are auto vs manual
python3 validate_loop.py --hypothesis H-006 --classify

# Auto-post all generated promotions via n8n
python3 validate_loop.py --hypothesis H-006 --auto-promote

# Post a specific variant
python3 validate_loop.py --hypothesis H-006 --auto-promote --variant B

# Trigger validation check via n8n (requires scheduled_validation workflow active)
python3 validate_loop.py --hypothesis H-006 --trigger
```

---

## How it works

```
validate_loop.py --auto-promote
    └── promoters/n8n_poster.py
            └── reads data/promotions/H-006_*.md
            └── parses content + metadata
            └── POST http://localhost:5678/webhook/multi-post
                    └── n8n routes by channel field
                            ├── "twitter"  → Twitter node (OAuth)
                            ├── "reddit"   → Reddit node (OAuth)
                            └── "linkedin" → LinkedIn node (OAuth)
            └── updates data/promotions/tracker.json
```

## Webhook payload format

The `multi-post` webhook accepts:

```json
{
  "channel": "twitter",
  "content": "The full post text",
  "hypothesis_id": "H-006",
  "variant": "A",
  "utm_link": "https://yoursite.com?utm_source=twitter",
  "title": "Post title (required for Reddit)",
  "subreddit": "SaaS"
}
```

## Configuration

Webhook paths are defined in `pipeline/config/n8n_config.json`.

To use a different n8n base URL, set in `pipeline/.env`:

```
N8N_WEBHOOK_BASE=http://your-n8n-host:5678
```

---

## Troubleshooting

**n8n not reachable:**
```bash
docker compose ps        # check container status
docker compose logs n8n  # check logs
```

**Webhook 404:**
- Workflow is not active — toggle the Active switch in n8n UI
- Webhook path mismatch — check `pipeline/config/n8n_config.json` matches the path in the Webhook trigger node

**OAuth errors:**
- Credentials not connected — open the workflow node and select your credential
- Token expired — re-authenticate in Credentials settings
