---
name: ship-branch
description: >
  Push the current branch, open a PR to master, and merge it.
  Use after all changes are committed and ready to land.
  Invoke as /ship-branch.
model: sonnet
allowed-tools: Bash, Read
---

# Input

- `--dry-run` (optional): show what would happen without pushing, creating PR, or merging

# Steps

1. **Check branch**
   Run `git branch --show-current`.
   If the current branch is `master` or `main`, stop and output:
   ```
   Error: already on main branch. Create a feature/fix branch first.
   ```

2. **Check for uncommitted changes**
   Run `git status --porcelain`.
   If output is non-empty, stop and output:
   ```
   Error: uncommitted changes detected. Commit or stash before shipping.
   ```

3. **Determine base branch**
   Run `git remote show origin | grep "HEAD branch"` to detect whether the default branch is `master` or `main`.
   Use the detected name as `<base>` for all subsequent steps.

4. **Collect context for PR description**
   Run:
   ```bash
   git log origin/<base>..HEAD --oneline
   git diff origin/<base>...HEAD --stat
   ```
   Use this to draft a concise PR title and body (see Output format).

5. **Push branch**
   ```bash
   git push -u origin HEAD
   ```

6. **Create PR**
   ```bash
   gh pr create --base <base> --title "<title>" --body "<body>"
   ```
   Body format:
   ```
   ## Summary
   <1-3 bullet points derived from commits>

   ## Changes
   <file-level diff stat summary>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```

7. **Merge PR**
   ```bash
   gh pr merge --merge --delete-branch
   ```

8. **Switch to base branch and pull**
   ```bash
   git checkout <base> && git pull
   ```

9. **Report result** using the Output format below.

# Output (STRICT)

```yaml
branch: "<branch-name>"
base: "<base-branch>"
pr_url: "<url>"
merged: true | false
dry_run: true | false
```

# Rules

- In `--dry-run` mode: print planned actions but do NOT run push, `gh pr create`, or `gh pr merge`
- Never force-push
- Never merge if `gh pr create` fails
- If `gh pr merge` fails, output the error and leave the PR open for manual action
- Do not amend or rebase commits; ship what is on the branch
