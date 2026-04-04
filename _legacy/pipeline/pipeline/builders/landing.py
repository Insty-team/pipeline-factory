"""
Landing page generator — fills HTML template from hypothesis JSON.
No AI required. Template-based generation only.

Usage:
  python3 builders/landing.py --hypothesis-file data/hypotheses/H-007_v3_20260329.json
"""
import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

SUPABASE_URL = "https://hnoxlznbghhavnrsunij.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub3hsem5iZ2hoYXZucnN1bmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzA1NTUsImV4cCI6MjA5MDI0NjU1NX0"
    ".atRa2gCxh6PiuIyX_GF5uKg-n1ccsq3xdXDXLqRG1cI"
)

# ---------------------------------------------------------------------------
# HTML template — placeholders use {{VAR}} syntax
# ---------------------------------------------------------------------------
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TITLE}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "{{PRODUCT_NAME}}",
    "description": "{{SCHEMA_DESCRIPTION}}",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "{{FREE_PRICE}}",
      "priceCurrency": "USD",
      "description": "{{FREE_TIER_DESC}}"
    }
  }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); }
    @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fade-up 0.5s ease-out forwards; }
  </style>
</head>
<body class="bg-slate-950 text-white">

  <!-- Hero -->
  <section class="gradient-bg min-h-screen flex items-center relative overflow-hidden">
    <div class="max-w-3xl mx-auto text-center w-full px-4 py-16 relative z-10">

      <div class="inline-block bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-1 text-sm font-medium text-indigo-300 mb-6">
        {{BADGE_TEXT}}
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
        {{HERO_LINE1}}<br>
        <span class="text-indigo-400">{{HERO_LINE2}}</span>
      </h1>
      <p class="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
        {{HERO_SUB}}
      </p>

      <!-- Email capture -->
      <div class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
        <div class="text-xl font-bold mb-2">Join the waitlist</div>
        <p class="text-sm text-slate-400 mb-6">{{WAITLIST_DESC}}</p>
        <input id="email-input" type="email" placeholder="your@email.com"
          class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 mb-3 focus:outline-none focus:border-indigo-500">
        <button id="btn-signup"
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition">
          Get early access &rarr;
        </button>
        <p class="text-xs text-slate-500 mt-3">No spam. No income guarantees. Just a tool to help you build.</p>
      </div>

      <!-- Success -->
      <div id="step-success" class="hidden bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 max-w-lg mx-auto text-center mt-4">
        <div class="text-4xl mb-4">&#9989;</div>
        <div class="text-xl font-bold mb-2">You're on the list!</div>
        <p class="text-slate-400">We'll email you when it's your turn.</p>
      </div>

    </div>
  </section>

  <!-- How it works -->
  <section class="py-20 px-4 bg-slate-900">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">How it works</h2>
      <div class="space-y-8">
        {{HOW_IT_WORKS_STEPS}}
      </div>
    </div>
  </section>

  <!-- Trust signals -->
  <section class="py-20 px-4 bg-slate-950">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">Let's be honest</h2>
      <p class="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">We're not going to promise you'll get rich. Here's what we actually promise:</p>
      <div class="grid md:grid-cols-2 gap-4 text-left">
        <div class="bg-white/5 rounded-xl p-5 border border-white/10">
          <div class="font-bold mb-3 text-green-400">What this IS</div>
          <ul class="text-sm text-slate-300 space-y-2">
            {{TRUST_IS_ITEMS}}
          </ul>
        </div>
        <div class="bg-white/5 rounded-xl p-5 border border-white/10">
          <div class="font-bold mb-3 text-red-400">What this is NOT</div>
          <ul class="text-sm text-slate-300 space-y-2">
            {{TRUST_NOT_ITEMS}}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section class="py-20 px-4 bg-slate-900">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">Simple pricing</h2>
      <div class="grid md:grid-cols-{{PRICING_COLS}} gap-4 justify-center">
        {{PRICING_TIERS}}
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="py-20 px-4 bg-slate-950 text-center">
    <h2 class="text-3xl font-bold mb-4">{{CTA_HEADLINE}}</h2>
    <p class="text-slate-400 mb-6">{{CTA_SUB}}</p>
    <button onclick="window.scrollTo({top:0,behavior:'smooth'})"
      class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition text-lg">
      Start free &rarr;
    </button>
  </section>

  <footer class="py-8 px-4 bg-slate-900 text-center text-sm text-slate-500">
    {{PRODUCT_NAME}} &mdash; {{FOOTER_TAGLINE}}
    <br>No income guarantees. Results depend on your effort, market conditions, and product quality.
  </footer>

  <!-- Supabase tracking -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script>
    const SUPABASE_URL = '{{SUPABASE_URL}}';
    const SUPABASE_KEY = '{{SUPABASE_KEY}}';
    const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const HYP = '{{HYPOTHESIS_ID}}';
    const ref = new URLSearchParams(location.search).get('ref') || 'direct';

    function track(event, data = {}) {
      sb.from('events').insert({
        hypothesis: HYP, event,
        metadata: JSON.stringify({...data, source: ref, url: location.href}),
        created_at: new Date().toISOString()
      }).then(() => {});
    }

    track('page_view');

    // Scroll tracking
    let scrollTracked = {};
    window.addEventListener('scroll', () => {
      const pct = Math.round(100 * window.scrollY / (document.body.scrollHeight - window.innerHeight));
      [25, 50, 75, 90].forEach(threshold => {
        if (pct >= threshold && !scrollTracked[threshold]) {
          scrollTracked[threshold] = true;
          track('scroll', { depth: threshold });
        }
      });
    });

    // Signup
    document.getElementById('btn-signup').addEventListener('click', async () => {
      const email = document.getElementById('email-input').value.trim();
      if (!email || !email.includes('@')) {
        document.getElementById('email-input').style.borderColor = '#ef4444';
        return;
      }

      track('waitlist_signup', { email });

      await sb.from('waitlist').insert({
        hypothesis: HYP, email, source: ref,
        metadata: JSON.stringify({}),
        created_at: new Date().toISOString()
      });

      document.querySelector('.bg-white\\/5.backdrop-blur').classList.add('hidden');
      document.getElementById('step-success').classList.remove('hidden');
      track('signup_complete', { email });
    });
  </script>
</body>
</html>"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _slug(text: str) -> str:
    """Convert text to URL-safe slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text.strip())
    return text[:50]


def _step_html(number: int, title: str, desc: str) -> str:
    return (
        f'<div class="flex gap-4">'
        f'<div class="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">{number}</div>'
        f'<div><div class="font-bold text-lg">{title}</div>'
        f'<div class="text-slate-400">{desc}</div></div></div>'
    )


def _pricing_tier_html(tier: dict, highlight: bool = False) -> str:
    border = "border-indigo-500/40" if highlight else "border-white/10"
    bg = "bg-indigo-600/20" if highlight else "bg-white/5"
    name = tier.get("name", "")
    price = tier.get("price", "")
    includes = tier.get("includes", "")
    label_color = "text-indigo-300" if highlight else "text-slate-400"
    # Price split: "$20/월" -> "$20" + "/월"
    price_main = re.sub(r"(/.*)", "", price)
    price_suffix = re.search(r"(/.*)", price)
    price_suffix_html = f'<span class="text-lg font-normal text-slate-400">{price_suffix.group(1)}</span>' if price_suffix else ""
    return (
        f'<div class="{bg} rounded-xl p-6 border {border}">'
        f'<div class="text-sm {label_color} mb-1">{name}</div>'
        f'<div class="text-3xl font-bold mb-2">{price_main}{price_suffix_html}</div>'
        f'<div class="text-sm text-slate-300 text-left mt-3">{includes}</div>'
        f"</div>"
    )


def _trust_li(items: list) -> str:
    return "\n".join(f"<li>{item}</li>" for item in items)


# ---------------------------------------------------------------------------
# Core build function
# ---------------------------------------------------------------------------

def build_landing_page(hypothesis: dict) -> str:
    """Return complete HTML string for the given hypothesis."""
    hyp_id = hypothesis.get("hypothesis_id", "H-XXX")
    title_raw = hypothesis.get("title", "AI Side Hustle Tool")
    # Strip Korean suffix for English display
    product_name = title_raw.split("—")[0].strip() if "—" in title_raw else title_raw
    # Use English portion after em-dash if present, else full title
    if "—" in title_raw:
        parts = title_raw.split("—")
        product_name = parts[0].strip()
        tagline = parts[1].strip() if len(parts) > 1 else ""
    else:
        product_name = title_raw
        tagline = ""

    pain = hypothesis.get("pain_point", "")
    solution = hypothesis.get("solution", {})
    key_msg = hypothesis.get("key_message", {})
    pricing = hypothesis.get("pricing", {})
    tiers = pricing.get("tiers", [])

    # Hero text — use key_message.hero if available, else derive from pain_point
    hero_raw = key_msg.get("hero", pain)
    hero_lines = [l.strip() for l in hero_raw.split("\n") if l.strip()]
    hero_line1 = hero_lines[0] if hero_lines else "No idea where to start?"
    hero_line2 = hero_lines[1] if len(hero_lines) > 1 else "AI builds it with you."
    hero_sub = key_msg.get("sub", solution.get("한줄", ""))

    # How it works steps — use solution.flow
    flow = solution.get("flow", [])
    steps_html_parts = []
    for i, step_text in enumerate(flow, 1):
        # Strip leading number if present ("1. ..." -> "...")
        step_clean = re.sub(r"^\d+\.\s*", "", step_text)
        # Split on first " " after short title heuristic — just use full text as desc
        steps_html_parts.append(_step_html(i, f"Step {i}", step_clean))
    how_it_works_html = "\n".join(steps_html_parts)

    # Trust signals
    trust_signals = key_msg.get("trust_signals", [])
    trust_is = [s for s in trust_signals if not s.startswith("수익 보장")]
    trust_not = ["Not a get-rich-quick scheme", "Not passive income on autopilot",
                 "Not a guarantee of any revenue", "Not an investment — it's a tool subscription"]
    if not trust_is:
        trust_is = ["A tool that saves you time", "Your products, your accounts, your revenue",
                    "Market data to help you make better decisions", "Cancel anytime, no contract"]

    # Pricing
    pricing_tiers_html = ""
    num_tiers = len(tiers)
    for idx, tier in enumerate(tiers):
        highlight = idx == 1 and num_tiers >= 2  # middle tier highlighted
        pricing_tiers_html += _pricing_tier_html(tier, highlight=highlight)

    # Free tier details for schema.org
    free_tier = next((t for t in tiers if t.get("price", "").startswith("$0")), tiers[0] if tiers else {})
    free_price = "0"
    free_tier_desc = free_tier.get("includes", "Free tier")

    html = TEMPLATE
    replacements = {
        "TITLE": f"{product_name} — {tagline}" if tagline else product_name,
        "META_DESCRIPTION": hero_sub[:160] if hero_sub else pain[:160],
        "PRODUCT_NAME": product_name,
        "SCHEMA_DESCRIPTION": (hero_sub or pain)[:200],
        "FREE_PRICE": free_price,
        "FREE_TIER_DESC": free_tier_desc,
        "BADGE_TEXT": "Free to try — No credit card needed",
        "HERO_LINE1": hero_line1,
        "HERO_LINE2": hero_line2,
        "HERO_SUB": hero_sub,
        "WAITLIST_DESC": "We're onboarding the first 100 users. Get early access + free tier forever.",
        "HOW_IT_WORKS_STEPS": how_it_works_html,
        "TRUST_IS_ITEMS": _trust_li(trust_is),
        "TRUST_NOT_ITEMS": _trust_li(trust_not),
        "PRICING_COLS": str(min(num_tiers, 3)),
        "PRICING_TIERS": pricing_tiers_html,
        "CTA_HEADLINE": "Ready to get started?",
        "CTA_SUB": "First 100 users get the free tier forever.",
        "FOOTER_TAGLINE": tagline if tagline else "AI-powered side hustle tool.",
        "SUPABASE_URL": SUPABASE_URL,
        "SUPABASE_KEY": SUPABASE_KEY,
        "HYPOTHESIS_ID": hyp_id,
    }
    for key, val in replacements.items():
        html = html.replace("{{" + key + "}}", val)
    return html


# ---------------------------------------------------------------------------
# Output path
# ---------------------------------------------------------------------------

def output_path(hypothesis: dict, base_dir: Path) -> Path:
    hyp_id = hypothesis.get("hypothesis_id", "H-XXX").lower().replace("-", "")
    title = hypothesis.get("title", "landing")
    slug = _slug(title.split("—")[0] if "—" in title else title)
    dir_name = f"{hyp_id}-{slug}"
    out_dir = base_dir.parent / "landing-pages" / dir_name
    out_dir.mkdir(parents=True, exist_ok=True)
    return out_dir / "index.html"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Generate landing page from hypothesis JSON")
    parser.add_argument("--hypothesis-file", required=True, help="Path to hypothesis JSON file")
    parser.add_argument("--output-dir", help="Override output directory (default: landing-pages/{id}-{slug}/)")
    args = parser.parse_args()

    hyp_path = Path(args.hypothesis_file)
    if not hyp_path.is_absolute():
        hyp_path = Path.cwd() / hyp_path

    if not hyp_path.exists():
        print(f"ERROR: hypothesis file not found: {hyp_path}", file=sys.stderr)
        sys.exit(1)

    with open(hyp_path) as f:
        hypothesis = json.load(f)

    html = build_landing_page(hypothesis)

    if args.output_dir:
        out = Path(args.output_dir) / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
    else:
        out = output_path(hypothesis, BASE_DIR)

    out.write_text(html, encoding="utf-8")
    print(f"Landing page written: {out}")
    print(f"Hypothesis: {hypothesis.get('hypothesis_id')} — {hypothesis.get('title', '')[:60]}")
    return str(out)


if __name__ == "__main__":
    main()
