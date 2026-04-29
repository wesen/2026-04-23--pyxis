#!/usr/bin/env python3
"""Open GitOps image-bump pull requests for Pyxis deployment targets.

The script is intentionally usable both in CI and locally:

- CI mode clones the target GitOps repository, patches each manifest, commits,
  pushes, and opens a pull request with `gh pr create`.
- local dry-run mode can operate against an existing GitOps checkout with
  `--gitops-root` and reports the exact manifest edits without committing.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True)
class Target:
    name: str
    gitops_repo: str
    gitops_branch: str
    manifest_path: str
    container_name: str


def redact(value: str) -> str:
    token = os.getenv("GITOPS_PR_TOKEN")
    if token:
        value = value.replace(token, "***")
    return value


def run(cmd: list[str], *, cwd: Path | None = None, env: dict[str, str] | None = None, check: bool = True) -> subprocess.CompletedProcess[str]:
    print(redact(f"+ {' '.join(cmd)}"), file=sys.stderr)
    result = subprocess.run(cmd, cwd=cwd, env=env, check=False, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    if check and result.returncode != 0:
        print(redact(result.stdout), file=sys.stderr)
        raise subprocess.CalledProcessError(result.returncode, cmd, output=redact(result.stdout))
    return result


def load_targets(path: Path, selected: str | None) -> list[Target]:
    data = json.loads(path.read_text())
    targets = [Target(**item) for item in data.get("targets", [])]
    if selected:
        targets = [target for target in targets if target.name == selected]
    if not targets:
        raise SystemExit(f"no deployment targets found in {path}" + (f" for --target {selected}" if selected else ""))
    return targets


def patch_container_image(manifest: Path, container_name: str, image: str) -> bool:
    lines = manifest.read_text().splitlines(keepends=True)
    changed = False
    in_target_container = False
    target_indent: int | None = None

    name_pattern = re.compile(r"^(?P<indent>\s*)-\s+name:\s*['\"]?(?P<name>[^'\"\n]+)['\"]?\s*$")
    image_pattern = re.compile(r"^(?P<indent>\s*)image:\s*.*?(?P<newline>\r?\n?)$")

    for index, line in enumerate(lines):
        name_match = name_pattern.match(line)
        if name_match:
            candidate_indent = len(name_match.group("indent"))
            if in_target_container and target_indent is not None and candidate_indent <= target_indent:
                in_target_container = False
                target_indent = None
            if name_match.group("name") == container_name:
                in_target_container = True
                target_indent = candidate_indent
            continue

        if not in_target_container:
            continue

        image_match = image_pattern.match(line)
        if image_match:
            newline = image_match.group("newline") or "\n"
            replacement = f"{image_match.group('indent')}image: {image}{newline}"
            if lines[index] != replacement:
                lines[index] = replacement
                changed = True
            in_target_container = False
            target_indent = None
            break

    if in_target_container:
        raise RuntimeError(f"found container {container_name!r} in {manifest}, but no image field followed it")
    if not changed and image not in manifest.read_text():
        raise RuntimeError(f"did not find container {container_name!r} with image field in {manifest}")
    if changed:
        manifest.write_text("".join(lines))
    return changed


def repo_url(repo: str, token: str | None) -> str:
    if token:
        return f"https://x-access-token:{token}@github.com/{repo}.git"
    return f"https://github.com/{repo}.git"


def branch_name(target: Target, image: str) -> str:
    tag = image.rsplit(":", 1)[-1]
    safe_tag = re.sub(r"[^A-Za-z0-9._-]+", "-", tag)
    return f"deploy/{target.name}/{safe_tag}"


def ensure_clean(repo: Path) -> None:
    status = run(["git", "status", "--porcelain"], cwd=repo).stdout.strip()
    if status:
        raise RuntimeError(f"gitops checkout is not clean:\n{status}")


def process_target(target: Target, image: str, args: argparse.Namespace, token: str | None) -> None:
    tempdir: tempfile.TemporaryDirectory[str] | None = None
    if args.gitops_root:
        gitops_root = Path(args.gitops_root).resolve()
        if not gitops_root.exists():
            raise RuntimeError(f"--gitops-root does not exist: {gitops_root}")
    else:
        tempdir = tempfile.TemporaryDirectory(prefix=f"pyxis-gitops-{target.name}-")
        gitops_root = Path(tempdir.name)
        run(["git", "clone", "--branch", target.gitops_branch, repo_url(target.gitops_repo, token), str(gitops_root)])

    try:
        manifest = gitops_root / target.manifest_path
        if not manifest.exists():
            raise RuntimeError(f"target manifest does not exist: {manifest}")

        if not args.dry_run and not args.gitops_root:
            ensure_clean(gitops_root)
            run(["git", "checkout", "-b", branch_name(target, image)], cwd=gitops_root)

        original_manifest = manifest.read_text() if args.dry_run else None
        changed = patch_container_image(manifest, target.container_name, image)
        if not changed:
            print(f"{target.name}: already at {image}")
            return

        diff = run(["git", "diff", "--", target.manifest_path], cwd=gitops_root, check=False).stdout
        print(diff)

        if args.dry_run:
            if original_manifest is not None:
                manifest.write_text(original_manifest)
            print(f"{target.name}: dry-run only; not committing or opening PR")
            return

        run(["git", "add", target.manifest_path], cwd=gitops_root)
        run(["git", "commit", "-m", f"{target.name}: deploy {image}"], cwd=gitops_root)
        branch = branch_name(target, image)
        if args.gitops_root:
            current = run(["git", "branch", "--show-current"], cwd=gitops_root).stdout.strip()
            branch = current or branch
        else:
            run(["git", "push", "--set-upstream", "origin", branch], cwd=gitops_root)

        title = f"{target.name}: deploy {image}"
        body = "\n".join([
            f"Update `{target.manifest_path}` container `{target.container_name}` to `{image}`.",
            "",
            f"Source commit: `{args.source_sha}`" if args.source_sha else "Source commit: not provided",
            f"Workflow run: {args.workflow_url}" if args.workflow_url else "Workflow run: not provided",
        ])
        run([
            "gh", "pr", "create",
            "--repo", target.gitops_repo,
            "--base", target.gitops_branch,
            "--head", branch,
            "--title", title,
            "--body", body,
        ], cwd=gitops_root)
    finally:
        if tempdir is not None:
            tempdir.cleanup()


def parse_args(argv: Iterable[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--targets", default="deploy/gitops-targets.json", help="deployment target metadata JSON")
    parser.add_argument("--image", required=True, help="image reference to write, e.g. ghcr.io/wesen/pyxis:sha-abc123")
    parser.add_argument("--target", help="only update the named target")
    parser.add_argument("--gitops-root", help="existing GitOps checkout for local validation")
    parser.add_argument("--dry-run", action="store_true", help="patch and print diff without committing/pushing/opening PR")
    parser.add_argument("--source-sha", default=os.getenv("GITHUB_SHA", ""), help="source commit for PR body")
    parser.add_argument("--workflow-url", default=os.getenv("GITHUB_SERVER_URL", "") and f"{os.getenv('GITHUB_SERVER_URL')}/{os.getenv('GITHUB_REPOSITORY')}/actions/runs/{os.getenv('GITHUB_RUN_ID')}", help="workflow URL for PR body")
    return parser.parse_args(list(argv))


def main(argv: Iterable[str]) -> int:
    args = parse_args(argv)
    targets = load_targets(Path(args.targets), args.target)
    token = os.getenv("GITOPS_PR_TOKEN")
    if not args.dry_run and not args.gitops_root:
        missing = []
        if not token:
            missing.append("GITOPS_PR_TOKEN")
        if not shutil.which("gh"):
            missing.append("gh")
        if missing:
            raise RuntimeError(f"missing required CI dependency/credential: {', '.join(missing)}")
    for target in targets:
        process_target(target, args.image, args, token)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
