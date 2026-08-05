#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
release_root="$repo_root/.releases"
release_parent="$release_root/releases"
requested_ref="${1:-HEAD}"

mkdir -p "$release_parent"

temporary_root="$(mktemp -d)"
cleanup() {
  rm -rf "$temporary_root"
}
trap cleanup EXIT

if [[ "$requested_ref" == "--workspace" ]]; then
  source_root="$repo_root"
  release_id="workspace-$(date -u +%Y%m%dT%H%M%SZ)"
else
  commit_sha="$(git -C "$repo_root" rev-parse --verify "${requested_ref}^{commit}")"
  release_id="$commit_sha"
  source_root="$temporary_root/source"
  mkdir -p "$source_root"
  archive_path="$temporary_root/source.tar"
  git -C "$repo_root" archive --format=tar --output="$archive_path" "$commit_sha"
  tar -xf "$archive_path" -C "$source_root"
fi

node "$source_root/scripts/validate-site.mjs"
python3 -m unittest discover -s "$source_root/services/notify" -p 'test_*.py'

target="$release_parent/$release_id"
if [[ ! -d "$target" ]]; then
  staging="$release_parent/.staging-$release_id"
  rm -rf "$staging"
  mkdir -p "$staging/docs"

  for pattern in '*.html' '*.md' '*.css' '*.js' '*.png' '*.svg' '*.txt' '*.json'; do
    for source_file in "$source_root"/$pattern; do
      [[ -e "$source_file" ]] || continue
      cp -a "$source_file" "$staging/"
    done
  done

  cp -a "$source_root/styles" "$staging/styles"
  cp -a "$source_root/.well-known" "$staging/.well-known"
  cp -a "$source_root/docs/api.md" "$staging/docs/api.md"

  (
    cd "$staging"
    find . -type f -print0 | sort -z | xargs -0 sha256sum > RELEASE_MANIFEST.sha256
  )

  mv "$staging" "$target"
fi

next_link="$release_root/current.next"
ln -sfn "releases/$release_id" "$next_link"
mv -Tf "$next_link" "$release_root/current"

echo "Activated release $release_id"
echo "Path: $target"
