#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
release_root="$repo_root/.releases"
release_parent="$release_root/releases"
requested_ref="${1:-HEAD}"
prepare_only="${2:-}"
mkdir -p "$release_parent"

activate() {
  local release_id="$1"
  [[ "$release_id" =~ ^[a-zA-Z0-9-]+$ ]] || { echo "Invalid release ID" >&2; exit 1; }
  [[ -f "$release_parent/$release_id/RELEASE_MANIFEST.sha256" ]] || { echo "Release not found: $release_id" >&2; exit 1; }
  (cd "$release_parent/$release_id" && sha256sum --quiet -c RELEASE_MANIFEST.sha256)
  ln -sfn "releases/$release_id" "$release_root/current.next"
  mv -Tf "$release_root/current.next" "$release_root/current"
  echo "Activated release $release_id"
}

if [[ "$requested_ref" == "--rollback" || "$requested_ref" == "--activate" ]]; then
  activate "${2:?Usage: deploy_release.sh --activate|--rollback RELEASE_ID}"
  exit 0
fi
[[ -z "$prepare_only" || "$prepare_only" == "--prepare" ]] || { echo "Unknown option: $prepare_only" >&2; exit 1; }
temporary_root="$(mktemp -d)"
trap 'rm -rf "$temporary_root"' EXIT
source_root="$temporary_root/source"
mkdir -p "$source_root"

if [[ "$requested_ref" == "--workspace" ]]; then
  release_id="workspace-$(date -u +%Y%m%dT%H%M%SZ)-$RANDOM"
  for entry in package.json package-lock.json astro.config.mjs tsconfig.json src public scripts infra tests; do
    cp -a "$repo_root/$entry" "$source_root/"
  done
  mkdir -p "$source_root/services/notify"
  for entry in "$repo_root"/services/notify/*.py "$repo_root"/services/notify/requirements*.txt; do
    [[ -f "$entry" ]] || continue
    cp -a "$entry" "$source_root/services/notify/"
  done
else
  release_id="$(git -C "$repo_root" rev-parse --verify "${requested_ref}^{commit}")"
  git -C "$repo_root" archive --format=tar --output="$temporary_root/source.tar" "$release_id"
  tar -xf "$temporary_root/source.tar" -C "$source_root"
fi

(
  cd "$source_root"
  npm ci --no-audit --no-fund
  npm run check
  npm run build
  node scripts/sync-discovery.mjs --check
  npm run validate
  npm test
  python3 -m unittest discover -s services/notify -p 'test_*.py'
)

target="$release_parent/$release_id"
if [[ ! -d "$target" ]]; then
  staging="$release_parent/.staging-$release_id"
  [[ ! -e "$staging" ]] || { echo "Staging path already exists: $staging" >&2; exit 1; }
  # Astro's public directory is the explicit asset allowlist. Only dist is released.
  cp -a "$source_root/dist" "$staging"
  (
    cd "$staging"
    find . -type f ! -name RELEASE_MANIFEST.sha256 -print0 | sort -z | xargs -0 sha256sum > RELEASE_MANIFEST.sha256
  )
  mv "$staging" "$target"
fi

echo "Prepared release: $target"
if [[ "$prepare_only" != "--prepare" ]]; then activate "$release_id"; fi
