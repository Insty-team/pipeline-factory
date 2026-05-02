#!/usr/bin/env python3
"""유어라인 블로그 크롤러 — Smart Editor 3 본문 추출."""
import re
import json
import urllib.request
import time
from pathlib import Path

ROOT = Path(__file__).parent
URL_FILE = ROOT / '네이버블로그게시글' / 'url_list.txt'
OUT_FILE = ROOT / '네이버블로그게시글' / 'crawled.json'
LOG_FILE = ROOT / '네이버블로그게시글' / 'crawl.log'

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

def clean(html_frag: str) -> str:
    txt = re.sub(r'<br\s*/?>', '\n', html_frag)
    txt = re.sub(r'<[^>]+>', '', txt)
    txt = txt.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#39;', "'").replace('​', '')
    return txt.strip()

def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read().decode('utf-8', errors='replace')

def extract(html: str) -> dict:
    title_m = re.search(r'<meta\s+property="og:title"\s+content="([^"]*)"', html)
    title = title_m.group(1) if title_m else ''
    desc_m = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"', html)
    desc = desc_m.group(1) if desc_m else ''
    # 작성일자 패턴 다수 시도
    date = ''
    for pat in [
        r'<span class="se_publishDate[^"]*">\s*([^<]+?)\s*</span>',
        r'<p class="blog_date[^"]*">\s*([^<]+?)\s*</p>',
        r'"publishDate"\s*:\s*"([^"]+)"',
        r'<span class="date[^"]*">\s*([^<]+?)\s*</span>',
    ]:
        m = re.search(pat, html)
        if m:
            date = m.group(1).strip()
            break
    # se-fs span (Smart Editor 3 텍스트 블록)
    spans = re.findall(r'<span[^>]*class="[^"]*se-fs[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL)
    body_lines = []
    for s in spans:
        c = clean(s)
        if c:
            body_lines.append(c)
    body = '\n'.join(body_lines)
    # 해시태그 (본문 + 메타 양쪽)
    tags = list(dict.fromkeys(re.findall(r'#([가-힣a-zA-Z0-9_]+)', body + ' ' + desc)))
    return {
        'title': title,
        'desc': desc,
        'date': date,
        'body': body,
        'body_chars': len(body),
        'tags': tags,
    }

def main():
    urls = [l.strip() for l in URL_FILE.read_text().splitlines() if l.strip()]
    log_lines = [f'총 URL (중복 포함): {len(urls)}']
    results = []
    seen = {}
    for i, url in enumerate(urls, 1):
        m = re.match(r'https://blog\.naver\.com/([^/]+?)(?:/(\d+))?/?$', url)
        if not m:
            log_lines.append(f'[{i}] SKIP (패턴 미일치): {url}')
            results.append({'idx': i, 'url': url, 'status': 'skip', 'reason': 'pattern'})
            continue
        blog_id, log_no = m.group(1), m.group(2)
        if not log_no:
            log_lines.append(f'[{i}] SKIP (메인 블로그 URL): {url}')
            results.append({'idx': i, 'url': url, 'status': 'skip', 'reason': 'main_blog'})
            continue
        key = (blog_id, log_no)
        if key in seen:
            log_lines.append(f'[{i}] DUP (이미 #{seen[key]} 처리됨): {log_no}')
            results.append({'idx': i, 'url': url, 'status': 'dup', 'of': seen[key], 'logNo': log_no})
            continue
        seen[key] = i
        post_url = f'https://blog.naver.com/PostView.naver?blogId={blog_id}&logNo={log_no}'
        try:
            html = fetch(post_url)
            data = extract(html)
            data.update({'idx': i, 'url': url, 'logNo': log_no, 'status': 'ok'})
            results.append(data)
            log_lines.append(f'[{i}] OK {log_no} | {data["date"]} | {data["body_chars"]}자 | tags={len(data["tags"])} | {data["title"][:30]}')
        except Exception as e:
            log_lines.append(f'[{i}] ERR {log_no}: {e}')
            results.append({'idx': i, 'url': url, 'logNo': log_no, 'status': 'err', 'error': str(e)})
        time.sleep(0.4)  # 폴라이트 딜레이
    OUT_FILE.write_text(json.dumps(results, ensure_ascii=False, indent=2))
    LOG_FILE.write_text('\n'.join(log_lines))
    print(f'완료: {OUT_FILE}')
    print(f'로그: {LOG_FILE}')
    ok = sum(1 for r in results if r.get('status') == 'ok')
    dup = sum(1 for r in results if r.get('status') == 'dup')
    err = sum(1 for r in results if r.get('status') == 'err')
    skip = sum(1 for r in results if r.get('status') == 'skip')
    print(f'OK={ok} DUP={dup} ERR={err} SKIP={skip}')

if __name__ == '__main__':
    main()
