#!/usr/bin/env python3
"""Link + asset checker for the generated site. Run from the project root."""
import os, re, html, json, sys
from urllib.parse import urlparse, unquote

root = os.getcwd()
pages = []
for dirpath, dirs, files in os.walk(root):
    dirs[:] = [d for d in dirs if d not in ('.git','build','AIyachts-Photos','node_modules')]
    for f in files:
        if f.endswith('.html'):
            pages.append(os.path.join(dirpath, f))

attr = re.compile(r'\b(href|src|srcset)="([^"]+)"')
bad, checked = [], 0
titles, descs = {}, {}
for p in sorted(pages):
    s = open(p, encoding='utf-8').read()
    base = os.path.dirname(p)
    rel = os.path.relpath(p, root)
    t = re.search(r'<title>(.*?)</title>', s, re.S)
    d = re.search(r'<meta name="description" content="([^"]*)"', s)
    titles[rel] = html.unescape(t.group(1)) if t else ''
    descs[rel]  = html.unescape(d.group(1)) if d else ''
    for name, val in attr.findall(s):
        vals = [v.strip().split(' ')[0] for v in val.split(',')] if name == 'srcset' else [val]
        for v in vals:
            v = html.unescape(v).strip()
            if not v or v.startswith(('http','mailto:','tel:','#','data:','javascript:')): continue
            u = urlparse(v)
            if not u.path: continue
            checked += 1
            target = os.path.normpath(os.path.join(base, unquote(u.path)))
            if not os.path.exists(target):
                bad.append((rel, v))

print(f'{len(pages)} pages · {checked} local references checked')
for pg, v in dict.fromkeys(bad):
    print('  MISSING:', pg, '->', v)

# SEO sanity
print('\nSEO checks')
seen_t, seen_d = {}, {}
for pg in titles:
    t, d = titles[pg], descs[pg]
    if not t: print('  no title:', pg)
    if not d: print('  no description:', pg)
    if len(t) > 65: print(f'  title {len(t)} chars: {pg} — {t}')
    if d and not (110 <= len(d) <= 170): print(f'  description {len(d)} chars: {pg}')
    seen_t.setdefault(t, []).append(pg)
    seen_d.setdefault(d, []).append(pg)
for t, pgs in seen_t.items():
    if len(pgs) > 1: print('  DUPLICATE TITLE:', t, pgs)
for d, pgs in seen_d.items():
    if len(pgs) > 1: print('  DUPLICATE DESCRIPTION:', pgs)

# JSON-LD validity
print('\nJSON-LD')
errs = 0
for p in sorted(pages):
    s = open(p, encoding='utf-8').read()
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try: json.load(__import__('io').StringIO(m.group(1)))
        except Exception as e:
            errs += 1; print('  INVALID:', os.path.relpath(p, root), e)
print('  all blocks parse' if not errs else f'  {errs} invalid blocks')

# one h1 per page
print('\nHeadings')
for p in sorted(pages):
    s = open(p, encoding='utf-8').read()
    n = len(re.findall(r'<h1[\s>]', s))
    if n != 1: print(f'  {n} h1 in', os.path.relpath(p, root))

# images without alt
print('\nImages')
missing_alt = 0
for p in sorted(pages):
    s = open(p, encoding='utf-8').read()
    for tag in re.findall(r'<img\b[^>]*>', s):
        if 'alt=' not in tag:
            missing_alt += 1; print('  no alt:', os.path.relpath(p, root), tag[:90])
print('  every <img> has an alt attribute' if not missing_alt else f'  {missing_alt} missing')
sys.exit(1 if bad else 0)
