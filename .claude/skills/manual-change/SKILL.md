---
name: manual-change
description: >
  Generate a ManualChange declaration when a developer manually modifies AI-generated code
  in ways that affect behavior, API, database structure, queries, enums, flags, or routing.
  Use to prevent context drift in AI-assisted development.
model: haiku
allowed-tools: none
---

# Input

- reason: why the manual change was made
- scope: affected areas (FE | BE | SQL | API | Flags | Enum | Cache | Infra | CI | Docs)
- risk: potential side effects or affected areas
- verify: how to confirm the change is correct

# Output (STRICT)

```
ManualChange
- Reason: <one-line explanation>
- Scope: <FE | BE | SQL | API | Flags | Enum | Cache | Infra | CI | Docs>
- Risk: <affected areas or "Unknown">
- Verify: <unit | e2e | manual test | SQL query | not tested>
```

# Rules

- Output only the ManualChange block. No additional explanation.
- Scope must use defined categories only: FE | BE | SQL | API | Flags | Enum | Cache | Infra | CI | Docs
- If risk is unclear, output "Unknown".
- When a ManualChange declaration is present in context, AI must:
  - Not revert or overwrite the manual change.
  - Reason based on the latest logic only.
  - Flag design inconsistencies as risks instead of rewriting.
