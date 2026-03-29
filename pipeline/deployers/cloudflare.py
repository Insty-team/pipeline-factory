"""
Cloudflare Pages deployer — deploy landing page dir via wrangler.
No AI required.

Usage:
  python3 deployers/cloudflare.py --hypothesis-id H-007-v3 --dir landing-pages/h007-passive-income
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
CONFIG_PATH = BASE_DIR / "config" / "validation_targets.json"

# NVM node path — source nvm and resolve node/npx
NVM_SETUP = "export NVM_DIR=~/.nvm && . \"$NVM_DIR/nvm.sh\""


def _project_name(hypothesis_id: str) -> str:
    """H-007-v3 -> h007-sidekick (slug from id)."""
    slug = hypothesis_id.lower().replace("-", "").replace("_", "")
    # Keep only alphanumeric, limit length
    slug = re.sub(r"[^a-z0-9]", "", slug)[:12]
    return f"{slug}-lp"


def _resolve_dir(dir_arg: str) -> Path:
    p = Path(dir_arg)
    if p.is_absolute():
        return p
    # Try relative to cwd first, then relative to project root
    if (Path.cwd() / p).exists():
        return Path.cwd() / p
    candidate = BASE_DIR.parent / p
    if candidate.exists():
        return candidate
    return Path.cwd() / p  # let wrangler fail with clear error


def deploy(hypothesis_id: str, landing_dir: Path, project_name: str = None) -> str:
    """
    Deploy landing_dir to Cloudflare Pages.
    Returns the deployed URL or raises RuntimeError.
    """
    if not landing_dir.exists():
        raise FileNotFoundError(f"Landing dir not found: {landing_dir}")

    if project_name is None:
        project_name = _project_name(hypothesis_id)

    print(f"Deploying {landing_dir} -> Cloudflare Pages project: {project_name}")

    cmd = (
        f'{NVM_SETUP} 2>/dev/null; '
        f'npx wrangler pages deploy "{landing_dir}" '
        f'--project-name "{project_name}" '
        f'--commit-dirty 2>&1'
    )

    result = subprocess.run(
        cmd, shell=True, executable="/bin/bash",
        capture_output=True, text=True
    )

    output = result.stdout + result.stderr
    print(output)

    if result.returncode != 0:
        raise RuntimeError(f"wrangler deploy failed (exit {result.returncode})")

    # Extract deployed URL from wrangler output
    # Wrangler prints lines like: "✨ Deployment complete! Take a peek over at https://..."
    url_match = re.search(r'https://[a-z0-9\-]+\.pages\.dev', output)
    if url_match:
        url = url_match.group(0)
    else:
        url = f"https://{project_name}.pages.dev"

    print(f"Deployed URL: {url}")
    return url


def update_validation_targets(hypothesis_id: str, landing_dir: Path, project_name: str, live_url: str):
    """Add or update hypothesis entry in config/validation_targets.json."""
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            targets = json.load(f)
    else:
        targets = {}

    # Compute relative dir path from pipeline dir
    try:
        rel_dir = "../" + str(landing_dir.relative_to(BASE_DIR.parent))
    except ValueError:
        rel_dir = str(landing_dir)

    if hypothesis_id not in targets:
        targets[hypothesis_id] = {}

    targets[hypothesis_id].update({
        "landing_page_dir": rel_dir,
        "pages_project": project_name,
        "live_url": live_url,
        "deployed_at": __import__("datetime").datetime.now().isoformat(),
        "metric_window_hours": 24,
        "success_criteria": {
            "min_pageviews": 100,
            "min_waitlist_signups": 15,
            "target_conversion_rate": 0.10,
            "strong_conversion_rate": 0.20,
            "min_scroll_50_rate": 0.35,
        },
    })

    with open(CONFIG_PATH, "w") as f:
        json.dump(targets, f, ensure_ascii=False, indent=2)
    print(f"Updated validation_targets.json: {hypothesis_id} -> {live_url}")


def main():
    parser = argparse.ArgumentParser(description="Deploy landing page to Cloudflare Pages")
    parser.add_argument("--hypothesis-id", required=True, help="e.g. H-007-v3")
    parser.add_argument("--dir", required=True, help="Landing page directory to deploy")
    parser.add_argument("--project-name", help="Override Cloudflare Pages project name")
    parser.add_argument("--skip-config-update", action="store_true",
                        help="Don't update validation_targets.json")
    args = parser.parse_args()

    landing_dir = _resolve_dir(args.dir)
    project_name = args.project_name or _project_name(args.hypothesis_id)

    try:
        url = deploy(args.hypothesis_id, landing_dir, project_name)
    except (FileNotFoundError, RuntimeError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)

    if not args.skip_config_update:
        update_validation_targets(args.hypothesis_id, landing_dir, project_name, url)

    print(f"\nDone. Live at: {url}")
    return url


if __name__ == "__main__":
    main()
