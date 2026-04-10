---
name: commit-history-analysis
description: Analyze structured commit messages and generate release notes.
model: sonnet
allowed-tools: none
---

# Input

- commit_log (already collected text)

# Output (STRICT)

```yaml
summary:
  total_commits: <N>
  features: <N>
  fixes: <N>
  breaking_changes: <N>

release_notes: |
  ## Features
  - ...

  ## Fixes
  - ...

  ## Breaking Changes
  - ...

recommended_version_bump: "<major|minor|patch>"
```

# Rules

- Do not execute git. Only analyze provided commit_log text.
- If breaking_changes > 0 → major.
- If features > 0 and breaking_changes == 0 → minor.
- Fixes only → patch.
