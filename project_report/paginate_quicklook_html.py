from __future__ import annotations

import re
from pathlib import Path


SRC = Path("/Users/alokranjan/Desktop/major/project_report/docx_preview_pages/UrbanEye_template_patched.docx.qlpreview/Preview.html")
OUT = Path("/Users/alokranjan/Desktop/major/project_report/docx_preview_pages/paged_preview.html")

PAGE_W = 595
PAGE_H = 842


def main():
    html = SRC.read_text(errors="ignore")
    match = re.search(r"<body[^>]*>(.*)</body>", html, re.S | re.I)
    if not match:
        raise RuntimeError("Could not locate body in Quick Look preview HTML")
    body = match.group(1)
    page_count = body.count("\f") + 1
    body = body.replace("\f", "")

    pages = []
    for i in range(page_count):
        offset = i * PAGE_H
        pages.append(
            f'<div class="page"><div class="slice" style="transform: translateY(-{offset}px)">{body}</div></div>'
        )

    paged = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Paged Preview</title>
<style>
@page {{
  size: {PAGE_W}px {PAGE_H}px;
  margin: 0;
}}
html, body {{
  margin: 0;
  padding: 0;
  background: white;
}}
.page {{
  position: relative;
  width: {PAGE_W}px;
  height: {PAGE_H}px;
  overflow: hidden;
  page-break-after: always;
  break-after: page;
  background: white;
}}
.page:last-child {{
  page-break-after: auto;
  break-after: auto;
}}
.slice {{
  position: relative;
  width: {PAGE_W}px;
}}
</style>
</head>
<body>
{''.join(pages)}
</body>
</html>
"""
    OUT.write_text(paged)
    print(f"Wrote {OUT} with {page_count} pages")


if __name__ == "__main__":
    main()
