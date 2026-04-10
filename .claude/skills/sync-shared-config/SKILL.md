---
name: sync-shared-config
description: >
  Sync claude-shared-config resources from the installed npm package into this
  project. Supports update and verification workflows through the package CLI.
model: haiku
allowed-tools: Bash, Read, Glob
---

# Input

- `--check` (optional): verify sync status without writing files

# Steps

1. Verify that `.claude-sync.json` exists in the project root.
   If missing, stop and output:
   ```
   Error: .claude-sync.json not found.
   This project is not configured for claude-shared-config.
   Run: npx claude-shared-config init
   ```

2. Run the package CLI from the project root.
   - Default mode: `npx claude-shared-config sync`
   - Check mode: `npx claude-shared-config check`

3. If output contains `CONFLICT`, stop immediately.
   Display the conflict message verbatim and output:
   ```
   Action required: rename the conflicting file to proj-<name>.md then re-run /sync-shared-config.
   ```

4. Report the result in the format below.

# Output (STRICT)

```yaml
mode: "sync" | "check"
status: "updated" | "up-to-date" | "conflict" | "check-passed" | "check-failed"
```

# Rules

- `--check` is read-only
- Never bypass conflict detection
- If the CLI exits non-zero without conflict output, display stderr and stop
- Do not manually edit source files as part of this workflow
