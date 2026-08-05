# Site release and rollback runbook

Production serves an immutable release through `.releases/current`. Editing the
Git worktree must not change the public site.

## Deploy a verified commit

```bash
bash scripts/deploy_release.sh <git-ref>
curl -fsS http://127.0.0.1:3080/ >/dev/null
curl -fsS https://diegodella.ar/ >/dev/null
```

`<git-ref>` may be a commit, branch, or annotated tag. The script resolves it to
an exact commit, validates the site and contact tests, builds a public-file
allowlist, writes a SHA-256 manifest, and atomically switches `current`.

`--workspace` exists only for bootstrap and local recovery. Normal production
deploys must use committed refs.

## Revert a change and redeploy

Start from an up-to-date, clean branch:

```bash
git switch -c rollback/YYYYMMDD-description
git revert --no-commit <commit-to-revert>
node scripts/validate-site.mjs
node scripts/audit-theme.mjs
python3 -m unittest services/notify/test_app.py
git diff --check
git commit -m "revert: <description>"
git push -u origin rollback/YYYYMMDD-description
```

After review and integration into `main`:

```bash
bash scripts/deploy_release.sh main
git tag -a rollback/YYYYMMDD-HHMM -m "Rollback: <description>"
git push origin rollback/YYYYMMDD-HHMM
```

If validation fails before commit, run `git revert --abort`. Production remains
on its previous immutable release until the deploy script switches `current`.

## Emergency release switch

Repointing `.releases/current` is reserved for restoring availability while the
auditable Git revert is prepared. Record the activated release SHA and still
complete the revert workflow afterward.
