#!/usr/bin/env bash
set -euo pipefail

# Test whether a GitHub token can perform the exact Git-over-HTTPS operation
# required by Pyxis publish-image GitOps automation:
#   clone wesen/2026-03-27--hetzner-k3s
#   create a temporary branch
#   push it
#   delete it
#
# Usage options:
#   1. Paste token securely when prompted:
#        ./ttmp/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED--turn-pyxis-into-a-deployed-glazed-application-on-argocd-k3s/scripts/02-test-gitops-token-push.sh
#
#   2. Use an existing environment variable:
#        GITOPS_PR_TOKEN=github_pat_... ./ttmp/.../scripts/02-test-gitops-token-push.sh
#
# Optional env vars:
#   GITOPS_REPO=wesen/2026-03-27--hetzner-k3s
#   GITOPS_BASE_BRANCH=main
#   GITOPS_TEST_BRANCH_PREFIX=test/pyxis-token
#
# Notes:
#   - The script never prints the token.
#   - It disables credential helpers for the clone/push/delete commands so cached
#     local credentials do not hide token failures.
#   - If the push succeeds, it deletes the temporary branch before exiting.

GITOPS_REPO="${GITOPS_REPO:-wesen/2026-03-27--hetzner-k3s}"
GITOPS_BASE_BRANCH="${GITOPS_BASE_BRANCH:-main}"
GITOPS_TEST_BRANCH_PREFIX="${GITOPS_TEST_BRANCH_PREFIX:-test/pyxis-token}"

TOKEN="${GITOPS_PR_TOKEN:-}"
if [[ -z "${TOKEN}" ]]; then
  printf 'Paste GitOps token for %s: ' "${GITOPS_REPO}" >&2
  stty -echo
  read -r TOKEN
  stty echo
  printf '\n' >&2
fi

if [[ -z "${TOKEN}" ]]; then
  echo "error: no token provided" >&2
  exit 2
fi

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is required" >&2
  exit 2
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

REMOTE_FILE="${TMP_DIR}/remote.txt"
TOKEN="${TOKEN}" GITOPS_REPO="${GITOPS_REPO}" python3 - <<'PY' > "${REMOTE_FILE}"
import os
from urllib.parse import quote
repo = os.environ["GITOPS_REPO"]
token = quote(os.environ["TOKEN"], safe="")
print(f"https://x-access-token:{token}@github.com/{repo}.git")
PY
REMOTE="$(cat "${REMOTE_FILE}")"

LOG_FILE="${TMP_DIR}/gitops-token-test.log"
redact_log() {
  sed -E 's#https://x-access-token:[^@]+@github.com#https://x-access-token:***@github.com#g' "${LOG_FILE}" 2>/dev/null || true
}

run_git() {
  GIT_TERMINAL_PROMPT=0 \
    git -c credential.helper= \
        -c credential.useHttpPath=true \
        "$@"
}

printf 'Testing token Git write access to %s (%s)\n' "${GITOPS_REPO}" "${GITOPS_BASE_BRANCH}"
printf 'Working directory: %s\n' "${TMP_DIR}"

{
  echo "+ git clone --depth 1 --branch ${GITOPS_BASE_BRANCH} <redacted-remote> ${TMP_DIR}/gitops"
  run_git clone --depth 1 --branch "${GITOPS_BASE_BRANCH}" "${REMOTE}" "${TMP_DIR}/gitops"

  cd "${TMP_DIR}/gitops"
  git config user.name token-test
  git config user.email token-test@users.noreply.github.com

  BRANCH="${GITOPS_TEST_BRANCH_PREFIX}-$(date +%s)"
  echo "+ git checkout -b ${BRANCH}"
  git checkout -b "${BRANCH}"

  echo "+ git commit --allow-empty -m test-gitops-token-push"
  git commit --allow-empty -m "test-gitops-token-push"

  echo "+ git push --set-upstream origin ${BRANCH}"
  run_git push --set-upstream origin "${BRANCH}"

  echo "+ git push origin --delete ${BRANCH}"
  run_git push origin --delete "${BRANCH}"

  echo "OK: token can clone, push a branch, and delete it."
} >"${LOG_FILE}" 2>&1 || {
  STATUS=$?
  echo "FAILED: token did not complete the clone/push/delete test." >&2
  echo "--- redacted log ---" >&2
  redact_log >&2
  exit "${STATUS}"
}

redact_log
