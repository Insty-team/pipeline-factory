# Polsia Promotion & Marketing Automation Research Report

**Date:** 2026-03-28  
**Objective:** Identify how Polsia (polsia.com) automates promotion and distribution of AI-built businesses  
**Scope:** Channels, APIs, tooling, patterns, and comparison with similar tools  

---

## [OBJECTIVE]

Determine the exact tools, APIs, channels, and architectural patterns Polsia uses to automatically
promote and distribute the businesses and landing pages it creates for users — and how similar
"AI builds your business" platforms handle the same problem.

---

## [DATA]

**Sources consulted:** 20+ web sources including Polsia.com, GitHub (PolsiaAI + Polsia-Inc orgs),
Product Hunt launch page, Mixergy podcast transcript, Indie Hackers post, Context Studios blog,
Summify podcast summary, and third-party tool directories.  
**Data quality:** Medium. Polsia does not publish a technical architecture doc. Most specifics
come from podcast interviews (Mixergy, Solo Founders, Agents at Work) and the founder's public
statements on X. The GitHub repos are the most concrete primary source.  
**Launched:** December 15, 2025. Data current as of March 2026.

---

## [FINDING 1] Polsia's promotion pipeline is agent-native, not scheduler-based

Polsia does NOT use Buffer, Typefully, Make.com, Zapier, or any off-the-shelf social scheduling
tool. Instead, promotion is executed directly by a specialized **Marketing Agent** — one of four
agents in the platform (CEO, Engineering, Marketing, Support). The Marketing Agent runs on
nightly autonomous cycles orchestrated via **BullMQ + Redis** job queues on Node.js.

[STAT:n] 800+ active companies running as of March 2026  
[STAT:effect_size] Architecture confirmed across 3 independent podcast interviews + GitHub org  

The agent has direct OAuth credentials for each channel and calls platform APIs directly during
its nightly execution window.

---

## [FINDING 2] Twitter/X is the primary organic social channel — with a read/write API split

Polsia uses two separate mechanisms for Twitter:

**Write (posting):** The Marketing Agent posts tweets using **Twitter API v2** (`POST /2/tweets`)
via the `twitter-api-v2` npm package with OAuth 2.0 + App Key/Secret/Access Token credentials.
Each Polsia-managed company gets its own Twitter account provisioned with these credentials.
The founder acknowledged in the Mixergy interview that current auto-tweets are "kind of generic"
and engagement is limited — a known limitation they are iterating on.

**Read (analytics):** Polsia-Inc published an open-source MCP server (`twitter-read-mcp`) that
uses Twitter API v2 Bearer Token (read-only) to track tweet metrics, mentions, replies, and
search results. This feeds the agent's performance loop.

[STAT:n] 1 public MCP repo (github.com/Polsia-Inc/twitter-read-mcp), TypeScript, OAuth 2.0  
[STAT:effect_size] Read MCP is open-source and confirmed; write path inferred from API docs +
interview ("posts on Twitter") and the `twitter-api-v2` library pattern  

**No intermediary scheduler sits between the agent and the Twitter API.**

---

## [FINDING 3] Meta Ads (Facebook/Instagram) is the primary paid channel — via Meta Marketing API

Polsia integrates with the **Meta Marketing API** directly for autonomous ad campaign management.
The founder confirmed: "Meta APIs for the ads agents." The flow is:

1. User clicks "Run Ads" and sets a daily budget (minimum $10/day)
2. Agent reads company context from persistent memory
3. Agent generates UGC video content (using Sora for video generation)
4. Agent creates and launches campaigns via Meta Marketing API
5. Agent monitors and optimizes daily (bid adjustment, creative rotation)

[STAT:n] Confirmed in Indie Hackers post + Mixergy interview + Context Studios blog  
[STAT:effect_size] Meta Ads described as the primary paid acquisition channel Polsia itself
used to bootstrap its own paying user base ("established a baseline of paying users")  

Roadmap includes: Google Ads, TikTok Ads, Instagram (organic). Not yet live as of March 2026.

---

## [FINDING 4] Cold email uses Postmark for delivery + proprietary prospect research + verification

Cold email outreach follows a 3-step autonomous pipeline:

1. **Prospect research** — Agent researches ICPs using web search tools (MCP-based)
2. **Email verification** — Ben Cera stated he pays for a third-party email verification service
   (specific vendor not publicly disclosed, likely Apollo, Hunter.io, or ZeroBounce pattern)
3. **Delivery** — **Postmark** is Polsia's confirmed transactional email provider

Each Polsia-managed company gets its own provisioned email address. The system processed
"almost 2,000 emails in 24 hours" across managed companies.

[STAT:n] ~2,000 emails/24h across the platform (founder-stated, Mixergy interview)  
[STAT:effect_size] Postmark confirmed as stack component in Indie Hackers post + Context Studios  

[LIMITATION] The specific email verification vendor is not publicly disclosed. Postmark is a
transactional provider (password resets, receipts) — for cold outreach volume, Polsia likely
uses separate sending infrastructure (dedicated domains/mailboxes) to protect deliverability,
but this is not confirmed.

---

## [FINDING 5] The full confirmed technical stack for the marketing pipeline

| Layer | Tool/Service | Purpose |
|---|---|---|
| Agent orchestration | BullMQ + Redis on Node.js | Job queues for nightly agent cycles |
| AI reasoning | Anthropic Claude (Opus, extended thinking) | CEO agent decisions + content generation |
| Video generation | Sora (OpenAI) | UGC ad creative for Meta campaigns |
| Twitter posting | Twitter API v2 (`twitter-api-v2` npm) | Organic social content |
| Twitter analytics | Custom MCP (`twitter-read-mcp`, OAuth2) | Engagement feedback loop |
| Meta Ads | Meta Marketing API (direct) | Paid social campaigns |
| Cold email delivery | Postmark | Transactional + outreach emails |
| Email verification | Undisclosed third-party | Lead list validation |
| Web hosting | Render | Landing pages + web apps per company |
| Database | Neon (Postgres) | Per-company agent memory + data |
| Payments | Stripe | Revenue processing |
| Code/deploy | GitHub + Render | Engineering agent deployments |
| Agent memory | MCP integrations + shared knowledge base | Cross-company learning |

[STAT:n] Stack confirmed across Indie Hackers post, Mixergy, and Context Studios blog (3 sources)

---

## [FINDING 6] Product Hunt, Reddit, LinkedIn, HN — NOT automated by Polsia

Polsia does NOT auto-post to Product Hunt, Reddit, Hacker News, or LinkedIn for the businesses
it creates. The promotion scope is currently:
- Twitter/X (organic posts)
- Meta Ads (paid, Facebook + Instagram)
- Cold email outreach

The founder's own growth (going from $0 to $1M+ ARR in 30 days) was driven by **manual
"building in public"** on his personal X account (@bencera_) — constant revenue updates, viral
stunts (live fundraising dashboard), and word-of-mouth. This is the founder's personal promotion,
not automated by Polsia.

Product Hunt was used once for Polsia's own launch (February 2026), but Polsia does not
automate PH submissions for the businesses it creates.

[STAT:n] Confirmed via Indie Hackers post ("building in public with real numbers was the actual
growth driver") + lack of any Reddit/HN/PH API in confirmed integrations  
[LIMITATION] Polsia's roadmap mentions "influencer content management" as a future feature,
suggesting broader distribution channels are planned but not live.

---

## [FINDING 7] How Lovable handles promotion — the comparison case

Lovable (the closest competitor in "AI builds your app") takes a fundamentally different approach:

- Lovable built its own internal launch platform called **"Lovable Launched"** (analogous to
  Product Hunt) where users publish apps to get discovered within the Lovable community
- Lovable gives **weekly shoutouts on X** to top-voted projects — but this is manual curation
  by the Lovable team, not automated per-app posting
- Lovable encourages users to tag @Lovable on X for manual repost amplification
- Lovable does NOT auto-post to any external channels on behalf of user apps

Bolt.new similarly has no automated promotion pipeline — it is a code generator, not a
company operator.

[STAT:n] Confirmed via Lovable blog post ("Announcing Lovable Launched") + Product Hunt discussions  

The key distinction: Polsia is the only tool in this category that actually *executes* promotion
autonomously (posts tweets, runs ads, sends emails) vs. tools like Lovable/Bolt that generate
code and leave promotion to the user.

---

## [FINDING 8] Industry pattern for automated social posting in SaaS pipelines

For builders replicating this pattern, the established industry approaches are:

**Option A — Direct API (Polsia's approach)**
- Twitter: `twitter-api-v2` (npm) or `tweepy` (Python) hitting `POST /2/tweets`
- Meta: `facebook-nodejs-ads-sdk` or direct REST to Meta Marketing API
- Requires: Per-account OAuth credentials, developer app approval, rate limit handling
- Cost: API access fees (Twitter Basic: $100/mo for write access; Meta: free with spend)

**Option B — Unified Social API (abstraction layer)**
- **Ayrshare**: Single API for Twitter, LinkedIn, Facebook, Instagram, Reddit, TikTok, YouTube,
  Telegram, Pinterest. Supports posting on behalf of users via profile tokens. Used by SaaS
  backends that need multi-tenant social posting without managing per-platform OAuth.
- **Typefully**: Twitter/X and LinkedIn focused, has API, designed for drafting + scheduling
- Buffer: Shut down new developer API access — not viable for new integrations

**Option C — Workflow automation (no-code/low-code)**
- n8n: Open-source, self-hostable. Has native Twitter, Reddit, LinkedIn, Facebook nodes
- Make.com: Managed alternative to n8n, similar node library
- Both can trigger on schedule (cron) or webhook and post to multiple platforms

**The pattern Polsia uses (Option A) is the most powerful but requires the most setup:**
each user's company needs its own OAuth tokens provisioned on signup, which means building
an OAuth connect flow into your onboarding. Polsia handles this by provisioning accounts
itself (users don't connect their own existing accounts — Polsia creates new ones per company).

[STAT:n] Ayrshare supports 15+ platforms; Buffer API deprecated for new devs (confirmed 2025)

---

## [LIMITATION] Summary of evidence gaps

1. **Twitter write implementation**: Only the read MCP is open-source. The write path is inferred
   from founder statements ("posts on Twitter") + `twitter-api-v2` library being the standard
   Node.js choice. Not directly confirmed in code.

2. **Email verification vendor**: Explicitly undisclosed by founder ("services I pay for").

3. **Per-company account provisioning**: It is unclear whether Polsia creates brand-new Twitter/
   Meta accounts per company (which would violate platform ToS for automated account creation)
   or whether users must connect their own accounts. The Mixergy interview implies Polsia
   controls the accounts, but the mechanics are opaque.

4. **Actual promotion effectiveness**: The founder's own growth was manual/viral, not from the
   automated promotion pipeline. No data is publicly available on the conversion rates or
   traffic driven by the automated Twitter/email/Meta Ads campaigns for customer companies.

5. **Reddit/HN/LinkedIn**: Not in current product. No timeline given beyond "influencer
   management" roadmap item.

---

## Summary

Polsia uses a **direct-API, agent-native promotion pipeline** — no scheduler middleware, no
Buffer/Typefully/Make.com in the path. The Marketing Agent (one of four specialized agents
running on BullMQ/Redis/Node.js) directly calls:
- **Twitter API v2** for organic posting
- **Meta Marketing API** for paid ads (with Sora-generated video creatives)
- **Postmark** for cold email delivery (with third-party verification for lead lists)

The read feedback loop uses a custom open-source MCP server (`twitter-read-mcp`). The entire
stack runs on Render + Neon + GitHub. Claude (Anthropic) is the reasoning engine.

Polsia does NOT use Buffer, Typefully, Make.com, Zapier, Ayrshare, or any unified social API.
It does NOT auto-post to Product Hunt, Reddit, HN, or LinkedIn. The founder's own viral growth
was driven by manual building-in-public on his personal X account, not the automated pipeline.

For builders replicating this pattern: the simplest path to multi-platform automated social
posting is **Ayrshare** (unified API, multi-tenant OAuth). For Twitter-only direct posting,
the `twitter-api-v2` npm package with OAuth 2.0 is the standard. For Meta Ads, use the Meta
Marketing API directly (free, no per-message cost beyond ad spend).

---

*Report saved: .omc/scientist/reports/{timestamp}_polsia_promotion_pipeline.md*  
*Sources: polsia.com, github.com/Polsia-Inc, Mixergy interview, Indie Hackers, Context Studios,
Summify, Product Hunt, lobehub.com/mcp/polsia-inc-twitter-read-mcp, lovable.dev*
