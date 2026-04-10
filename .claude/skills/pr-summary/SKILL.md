---
name: pr-summary
description: Generate a structured pull request title and description.
model: sonnet
allowed-tools: none
---

# Input

- spec_summary
- diff_summary
- review_summary
- branch_name

# Output (STRICT)

```yaml
pr_title: "<type(scope): description>"
pr_description: |
  ## Summary
  <...>

  ## Changes
  - <bullet>

  ## Spec Reference
  - <path>

  ## Testing
  - <coverage>

  ## Risk Assessment
  - <risk>

  ## Checklist
  - [ ] Tests added or updated
  - [ ] No breaking changes
  - [ ] Documentation updated (if required)
```

# Rules

- Do not include additional explanation.
- Keep concise and structured.
