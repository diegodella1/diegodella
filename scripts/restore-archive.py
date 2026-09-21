"""Verify and extract a cleanup bundle into an empty directory."""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import tarfile


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def extract_files(archive, output):
    """Restore regular files and directories only, including on older Python."""
    for member in archive.getmembers():
        relative = PurePosixPath(member.name)
        if relative.is_absolute() or ".." in relative.parts or not (member.isfile() or member.isdir()):
            raise ValueError(f"Unsafe archive member: {member.name}")
        destination = Path(output) / member.name
        if member.isdir():
            destination.mkdir(parents=True, exist_ok=True)
            continue
        destination.parent.mkdir(parents=True, exist_ok=True)
        with archive.extractfile(member) as source, destination.open("xb") as target:
            shutil.copyfileobj(source, target)
        destination.chmod(member.mode & 0o777)
        os.utime(destination, (member.mtime, member.mtime))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--bundle", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text())
    bundle = next((item for item in manifest["bundles"] if item["category"] == args.bundle), None)
    if bundle is None:
        parser.error("Unknown bundle; inspect the manifest for available categories.")
    archive = args.manifest.resolve().parent / bundle["archive"]
    if archive.resolve().parent != args.manifest.resolve().parent:
        parser.error("Archive must be beside its manifest.")
    if sha256(archive) != bundle["sha256"]:
        parser.error("Archive checksum does not match its manifest.")
    if args.output.exists() and (not args.output.is_dir() or any(args.output.iterdir())):
        parser.error("Output must be a new or empty directory; existing files are never overwritten.")
    for record in bundle["files"]:
        path = PurePosixPath(record["path"])
        if path.is_absolute() or ".." in path.parts:
            parser.error("Manifest contains an unsafe path.")
    args.output.mkdir(parents=True, exist_ok=True)
    with tarfile.open(archive, "r:gz") as source:
        extract_files(source, args.output)
    for record in bundle["files"]:
        restored = args.output / record["path"]
        if sha256(restored) != record["sha256"]:
            raise SystemExit(f"Restored file checksum mismatch: {record['path']}")
    print(f"Restored and verified {len(bundle['files'])} files in {args.output.resolve()}")


if __name__ == "__main__":
    main()
