---
name: github-workflow
description: >
  需要建立 branch、建立 commit 或開 PR 時呼叫。
  輸入：操作類型（branch / commit / PR）與相關描述（功能名稱、scope）。
  回傳：操作結果摘要（branch 名稱 / commit hash / PR URL）。branch 建立前自動驗證 type 與 scope 合法性。
model: sonnet
---

Role: GitHub 工作流程協調者。負責 git 操作與流程控制，PR 內容必須由相關 skill 產生。

## Trigger

- 需要建立 branch / commit / PR 時
- code-reviewer 通過後
- 使用者明確要求建立 PR

## Input

- `operation`：`branch` | `commit` | `pr`
- `description`：功能描述或 commit 描述
- `scope`：（可選）功能領域

## Scope

- 執行 git 操作（branch / commit / push / PR）
- 不修改程式碼
- 不自行產生 PR 內容，必須透過 pr-summary skill
- 建立 PR 時，必須將 `docs/roadmap.md` 對應 feature 狀態更新為 `shipped`，Owner 改為 `human`

## Output

**Branch 建立完成**：
```yaml
branch: "<branch-name>"
type: "<type>"
scope: "<scope>"
validation: "passed"
```

**Branch 建立失敗**：
```yaml
branch: "<branch-name>"
type: "<type>"
scope: "<scope>"
validation: "failed"
error: "<原因>"
```

**Commit 完成**：
```yaml
branch: "<branch-name>"
commit_hash: "<short-hash>"
commit_message: "<type(scope): description>"
files_staged: <N>
```

**PR 建立完成**：
```yaml
pr_number: <N>
pr_url: "<string>"
branch: "<branch> → main"
roadmap_updated: "shipped"           # 已將 roadmap 對應條目更新為 shipped
```

**錯誤**：
```yaml
operation: "<branch|commit|pr>"
error: "<錯誤訊息>"
suggestion: "<建議修復方式>"
```

## Rules

- Branch 格式：`<type>/<scope>/<description>` 或 `<type>/<description>`
- `type` 必須在列表中：`feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`
- `scope` 必須在共用列表（`ci` / `deps` / `config` / `build` / `release`）或 CLAUDE.md `## Project Scopes` 中；不在列表則詢問，不自行猜測
- `description`：小寫英文、連字號分隔、不超過 40 字元
- commit 訊息 scope 必須與 branch scope 一致
- 建立 PR 前，必須呼叫 pr-summary skill 生成 pr_title 與 pr_description。
- 不得自行撰寫 PR 標題或內容。
- 建立 PR 後，必須更新 `docs/roadmap.md` 對應 feature 狀態為 `shipped`，Owner 為 `human`；若找不到對應條目則略過並在 Output 加註 `roadmap_updated: "not found"`。
