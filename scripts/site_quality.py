#!/usr/bin/env python3
"""Dependency-light smoke audit for the AdLand Studio static site."""
from __future__ import annotations
import json
import posixpath
import re
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ASSET_EXTS = {".html", ".js", ".css", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".woff", ".woff2", ".json", ".webmanifest", ".zip", ".gif", ".pdf", ".mp4", ".webm"}
SKIP_SCHEMES = ("http:", "https:", "mailto:", "tel:", "data:", "javascript:", "blob:", "//")

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []
        self.ids = []
        self.inline_scripts = []
        self._script_attrs = None
        self._script_chunks = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        for attr in ("src", "href"):
            value = attrs.get(attr)
            if value:
                self.refs.append((tag, attr, value))
        if tag.lower() == "script":
            self._script_attrs = attrs
            self._script_chunks = []
    def handle_data(self, data):
        if self._script_attrs is not None:
            self._script_chunks.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._script_attrs is not None:
            attrs = self._script_attrs
            typ = (attrs.get("type") or "").lower()
            if not attrs.get("src") and typ not in ("application/json", "application/ld+json", "importmap"):
                source = "".join(self._script_chunks).strip()
                if source:
                    self.inline_scripts.append(source)
            self._script_attrs = None
            self._script_chunks = []

def norm(path: str) -> str:
    return posixpath.normpath(path).lstrip("./") if path else ""

def resolve(page: Path, raw: str) -> str | None:
    value = raw.strip()
    if not value or value.startswith(SKIP_SCHEMES) or value.startswith("#"):
        return None
    parsed = urlsplit(value)
    target = unquote(parsed.path)
    if not target:
        return None
    if target.startswith("/AdLandSite/"):
        target = target[len("/AdLandSite/"):]
    elif target.startswith("/"):
        target = target.lstrip("/")
    else:
        target = posixpath.join(page.parent.as_posix(), target)
    return posixpath.normpath(target).lstrip("./")

def check_refs(page: Path, parser: PageParser, errors: list[str]) -> None:
    for tag, attr, raw in parser.refs:
        target = resolve(page.relative_to(ROOT), raw)
        if target is None:
            continue
        p = ROOT / target
        ext = Path(target).suffix.lower()
        directory_ref = urlsplit(raw).path.endswith("/")
        should_exist = ext in ASSET_EXTS or directory_ref
        if should_exist:
            if p.is_dir():
                p = p / "index.html"
            if not p.is_file():
                errors.append(f"{page.relative_to(ROOT)}: missing local {attr} target {raw!r} -> {target}")

def run_node_check(path: Path, errors: list[str]) -> None:
    node = subprocess.run(["node", "--check", str(path)], cwd=ROOT, text=True, capture_output=True)
    if node.returncode:
        errors.append(f"JavaScript syntax: {path.relative_to(ROOT)}\n{node.stderr.strip() or node.stdout.strip()}")

def main() -> int:
    errors: list[str] = []
    manifest_path = ROOT / "app-manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        apps = manifest.get("apps", [])
        names = [app.get("name", "").strip().casefold() for app in apps]
        if len(names) != len(set(names)):
            errors.append("app-manifest.json: duplicate app names")
        sites = [app.get("site") for app in apps if app.get("site")]
        if len(sites) != len(set(sites)):
            errors.append("app-manifest.json: duplicate site routes")
        for app in apps:
            icon = app.get("icon")
            if icon and not (ROOT / icon).is_file():
                errors.append(f"app-manifest.json: icon missing for {app.get('name')}: {icon}")
            site = app.get("site")
            if site and not (ROOT / site / "index.html").is_file():
                errors.append(f"app-manifest.json: page missing for {app.get('name')}: {site}")
            archive = app.get("sourceArchive")
            if archive and not (ROOT / archive).is_file():
                errors.append(f"app-manifest.json: source archive missing for {app.get('name')}: {archive}")
    except Exception as exc:
        errors.append(f"app-manifest.json could not be validated: {exc}")

    pages = sorted(ROOT.rglob("*.html"))
    for page in pages:
        if any(part in {".git", "node_modules", "release"} for part in page.parts):
            continue
        parser = PageParser()
        try:
            parser.feed(page.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"HTML parse: {page.relative_to(ROOT)}: {exc}")
            continue
        duplicates = sorted({key for key in parser.ids if parser.ids.count(key) > 1})
        if duplicates:
            errors.append(f"{page.relative_to(ROOT)}: duplicate id(s): {', '.join(duplicates[:12])}")
        check_refs(page, parser, errors)
        for n, script in enumerate(parser.inline_scripts, 1):
            with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".js", delete=False) as tmp:
                tmp.write(script + "\n")
                temp_path = Path(tmp.name)
            try:
                run_node_check(temp_path, errors)
                if errors and errors[-1].startswith("JavaScript syntax: " + str(temp_path)):
                    errors[-1] = errors[-1].replace(str(temp_path), f"{page.relative_to(ROOT)} inline script #{n}")
            finally:
                temp_path.unlink(missing_ok=True)

    for js in sorted(ROOT.rglob("*.js")):
        if any(part in {".git", "node_modules", "release"} for part in js.parts):
            continue
        run_node_check(js, errors)

    home = (ROOT / "index.html").read_text(encoding="utf-8")
    if 'data-app-slug="face2face"' not in home or 'assets/adland-face2face.js' not in home:
        errors.append("Homepage is missing the Face2Face catalogue card or enhancement script.")
    if not (ROOT / "face2face" / "index.html").is_file():
        errors.append("Face2Face product page is missing.")
    if errors:
        print("SITE QUALITY CHECK FAILED:")
        print("\n".join(f"- {err}" for err in errors))
        return 1
    print(f"SITE QUALITY CHECK PASSED — {len(pages)} HTML pages, {len(manifest.get('apps', []))} manifest entries, local links/assets, inline scripts and JavaScript syntax.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
