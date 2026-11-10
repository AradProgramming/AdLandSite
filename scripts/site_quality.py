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

    # Keep the studio's requested slogan identical across every locale/bundle/page.
    slogan = "Creativity : Ulimited"
    forbidden_slogans = (
        "اینجا، <span>خلاقیت</span> تبدیل به تجربه می‌شود.",
        "اینجا، خلاقیت تبدیل به تجربه می‌شود.",
        "Where <span>creativity</span> becomes an experience.",
        "Where creativity becomes an experience.",
        "جایی که خلاقیت هیچ مرزی نمی‌شناسد.",
        "جایی که خلاقیت هیچ مرزی نمی\\u200cشناسد.",
        "Where creativity has no limits.",
        "Where Creativity Has No Limits.",
        "Creativity never ends.",
        "خلاقیت، ادامه دارد.",
    )
    text_suffixes = {".html", ".js", ".css", ".json", ".md", ".svg", ".xml"}
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in text_suffixes:
            continue
        if any(part in {".git", "node_modules", "release"} for part in path.parts):
            continue
        try:
            source = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for old in forbidden_slogans:
            if old.casefold() in source.casefold():
                errors.append(f"{path.relative_to(ROOT)}: legacy slogan remains: {old}")
    home = (ROOT / "index.html").read_text(encoding="utf-8")
    if 'data-fa="Creativity : Ulimited" data-en="Creativity : Ulimited"' not in home:
        errors.append("Homepage hero must use the exact slogan in both language variants.")
    if 'data-app-slug="face2face"' not in home or 'assets/adland-face2face.js' not in home:
        errors.append("Homepage is missing the Face2Face catalogue card or enhancement script.")
    if not (ROOT / "face2face" / "index.html").is_file():
        errors.append("Face2Face product page is missing.")
    try:
        system_js = (ROOT / "assets" / "adland-system.js").read_text(encoding="utf-8")
    except OSError as exc:
        system_js = ""
        errors.append(f"System catalogue controller could not be checked: {exc}")
    # Catalogue, visible totals and structured metadata must describe the same products.
    try:
        card_count = len(re.findall(r'<article class="app\b', home))
        if card_count != len(apps):
            errors.append(f"Homepage product cards ({card_count}) do not match app-manifest entries ({len(apps)}).")
        if 'id="alProductTotal">15</b> PRODUCTS' not in home:
            errors.append("Homepage hero product total is stale.")
        if "13 DESKTOP · 1 WEB · 1 CROSS-PLATFORM" not in home:
            errors.append("Homepage platform breakdown is stale.")
        if "const filters=[...qsa('.productFilter')" in home:
            errors.append("Legacy inline filters conflict with the unified catalogue controller.")
        if "const required = ['#nav', '#hero', '#apps', '#command'];" not in system_js:
            errors.append("Browser self-test should only require persistent page sections.")
        schema_match = re.search(
            r'<script type="application/ld\+json">([\s\S]*?)</script>', home
        )
        if not schema_match:
            errors.append("Homepage JSON-LD structured data is missing.")
        else:
            graph = json.loads(schema_match.group(1)).get("@graph", [])
            organization = next((item for item in graph if item.get("@type") == "Organization"), {})
            product_list = next((item for item in graph if item.get("@type") == "ItemList"), {})
            schema_names = {item.get("name") for item in product_list.get("itemListElement", [])}
            app_names = {item.get("name") for item in apps}
            if schema_names != app_names:
                errors.append("Homepage JSON-LD product list does not match app-manifest entries.")
            if "adland-logo-transparent.svg" not in str(organization.get("logo", "")):
                errors.append("Organization structured-data logo must use the current SVG brand asset.")
    except Exception as exc:
        errors.append(f"Catalogue consistency could not be validated: {exc}")
    # AdLand system layer: search, saved views, diagnostics and logo resilience.
    for asset in ("assets/adland-system.css", "assets/adland-system.js",
                  "assets/logo/adland-logo-transparent.svg", "assets/logo/adland-logo.svg"):
        if not (ROOT / asset).is_file():
            errors.append(f"Required system asset is missing: {asset}")
    for ref in ("assets/adland-system.css", "assets/adland-system.js",
                "assets/logo/adland-logo-transparent.svg"):
        if ref not in home:
            errors.append(f"Homepage is missing the system asset reference: {ref}")
    brand_tags = re.findall(r"<img\b[^>]*data-adland-brand-logo[^>]*>", home, re.IGNORECASE)
    if len(brand_tags) < 3:
        errors.append("Homepage must protect the boot, navigation and hero brand logos.")
    for tag in brand_tags:
        if not re.search(r"\balt\s*=\s*['\"][^'\"]+['\"]", tag, re.IGNORECASE):
            errors.append("Every protected AdLand logo must have descriptive alt text.")
    required_controls = ("id=\"adlandAppSearch\"", "id=\"alAppCount\"",
                         "id=\"alAppReset\"", "id=\"alAppEmpty\"",
                         "id=\"alHealthBtn\"", "id=\"adlandSelfTest\"",
                         "data-filter=\"favorites\"", "data-filter=\"recent\"")
    for control in required_controls:
        if control not in home:
            errors.append(f"Homepage is missing an AdLand system control: {control}")
    for filter_group in ("focus: ['nexus', 'roshd']",
                         "developer: ['forge', 'ai-tools', 'face2face']"):
        if filter_group not in system_js:
            errors.append(f"System catalogue category coverage is incomplete: {filter_group}")
    try:
        pwa_manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
        pwa_icons = pwa_manifest.get("icons", [])
        icon_sources = [item.get("src") for item in pwa_icons]
        if len(icon_sources) != len(set(icon_sources)):
            errors.append("manifest.json: duplicate PWA icon sources")
        if not any(str(item.get("type", "")).lower() == "image/svg+xml"
                   for item in pwa_icons):
            errors.append("manifest.json: scalable SVG app icon is missing")
    except Exception as exc:
        errors.append(f"manifest.json icons could not be validated: {exc}")
    try:
        not_found = (ROOT / "404.html").read_text(encoding="utf-8")
        if "data-adland-brand-logo" not in not_found or "adland-logo-transparent.svg" not in not_found:
            errors.append("404 page is missing its protected SVG brand logo.")
    except OSError as exc:
        errors.append(f"404 page could not be checked: {exc}")
    if errors:
        print("SITE QUALITY CHECK FAILED:")
        print("\n".join(f"- {err}" for err in errors))
        return 1
    print(f"SITE QUALITY CHECK PASSED — {len(pages)} HTML pages, {len(manifest.get('apps', []))} manifest entries, local links/assets, inline scripts and JavaScript syntax.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
