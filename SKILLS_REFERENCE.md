# Cursor Skills Reference (Schedulo + Total Concept Kitchens)

**Last updated:** 2026-04-07  
**Global repo HEAD:** `c729a410` — [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) (`main`)

**Projects using this doc:** Schedulo; **Total Concept Kitchens** (`web/` Next.js site) — same global skill folders below.

## Where skills live

| Location | Purpose |
|----------|---------|
| `C:\Users\Humberto\.cursor\skills\skills\<name>\` | **Main skill library** (~1340 skills, each with `SKILL.md`). |
| `C:\Users\Humberto\.cursor\skills\skills_index.json` | Generated registry (search by `id` / `path`). |
| `C:\Users\Humberto\.cursor\skills\` (repo root) | Docs, `tools/scripts`, bundles; some extra top-level folders may exist. |
| `C:\Users\Humberto\.cursor\skills-cursor\` | Cursor-specific skill helpers (e.g. create-rule, create-skill). |
| `C:\Users\Humberto\.agents\skills\` | Azure / agent tooling skills (optional). |
| `C:\Users\Humberto\.codex\skills\` | Codex bundled skills (e.g. `.system` helpers). |

**Example path:** `C:\Users\Humberto\.cursor\skills\skills\postgres-best-practices\SKILL.md`

---

## High-value skills (paths under `skills/`)

Use for TCK web work: **`seo-fundamentals`**, **`seo-audit`**, **`web-performance-optimization`**, **`frontend-dev-guidelines`**, **`react-best-practices`**, **`lint-and-validate`**.

### Schedulo-focused (still useful for any full-stack app)

| Topic | Folder under `skills/` |
|-------|-------------------------|
| Postgres / Supabase | `postgres-best-practices` |
| API security | `api-security-best-practices` |
| Code review | `code-review-checklist` |
| Web perf | `web-performance-optimization` |
| React / TS frontend | `frontend-dev-guidelines`, `react-best-practices` |
| Lint / validate | `lint-and-validate` |
| Backend Node | `backend-dev-guidelines`, `nodejs-best-practices` |
| SEO | `seo-audit`, `seo-fundamentals` |
| Brainstorm / plan | `brainstorming`, `writing-plans` |

---

## Update global skills + index (run when you want latest upstream)

PowerShell, from **any** directory:

```powershell
cd $env:USERPROFILE\.cursor\skills
git fetch origin
git pull --rebase origin main
cd tools\scripts
python generate_index.py
```

- **Alternative:** `git reset --hard origin/main` matches upstream exactly but discards local commits. Prefer `pull` if you have local changes to merge.
- **Warning:** Hard reset drops **local** commits/edits in that clone. Stash or branch first if you customized skills.
- **Restart Cursor** (or reload window) so agents pick up changed skill files.

**Verify:** `skills_index.json` should report ~1340 skills (varies with upstream); last line of script: `Generated rich index with … skills`.

---

## Search the index

- Open `skills_index.json` and search for an `id` (e.g. `"stripe-integration"`).
- Or PowerShell:

  ```powershell
  (Get-Content "$env:USERPROFILE\.cursor\skills\skills_index.json" -Raw | ConvertFrom-Json) |
    Where-Object { $_.id -match 'postgres' } | Select id, path
  ```

---

## Project doc only

This file may live in **Schedulo** or **Total Concept Kitchens** repo roots. Updating global skills does not change project git—only this reference and `development_log.md` when we record the sync.
