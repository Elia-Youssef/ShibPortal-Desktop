from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_json(relative_path: str) -> dict:
    path = ROOT / relative_path
    with path.open(encoding="utf-8-sig") as handle:
        return json.load(handle)


manifest = load_json("package.json")
load_json("config/config.json")

required_scripts = {"build", "typecheck", "check:repository"}
missing_scripts = required_scripts.difference(manifest.get("scripts", {}))
if missing_scripts:
    raise SystemExit(f"Missing package scripts: {sorted(missing_scripts)}")

npmrc = (ROOT / ".npmrc").read_text(encoding="utf-8")
expected_auth = "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}"
if expected_auth not in npmrc:
    raise SystemExit(".npmrc must obtain the GitHub Packages token from GITHUB_TOKEN")

print("Repository configuration checks passed.")
