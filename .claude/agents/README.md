# Agents

Agents 是具有特定職責的 AI 助手，每個 agent 都有自己的系統提示詞和工具集。

## Available Agents

### spec-designer

**職責：** 設計與維護功能規格

**使用時機：**
- 開始開發新功能之前
- 需要更新現有規格時
- 需求不清晰，需要結構化設計時

**工作流程：**

```
使用者需求
    ↓
1. 啟動 spec-designer agent
    ↓
2. Agent 閱讀現有 specs，理解結構和風格
    ↓
3. Agent 設計新的規格（或更新現有規格）
    ↓
4. Agent 創建/更新 docs/specs/ 中的文件
    ↓
5. Agent 提供實作摘要給主 agent
    ↓
6. 主 agent 參考 specs 進行開發
```

**範例使用：**

```
User: 我想新增一個「最愛電台」功能

Claude (Main Agent):
讓我先啟動 spec-designer agent 來設計這個功能的規格。

[啟動 spec-designer agent]

Spec Designer Agent:
1. 閱讀現有規格文件...
2. 理解資料結構和 UI 模式...
3. 設計最愛功能規格...
4. 創建 docs/specs/favorites.md
5. 更新 docs/specs/README.md

## Spec Design Complete

### Created Files
- `docs/specs/favorites.md` - 最愛電台功能規格

### Key Points for Implementation
1. 在 Radio 資料結構增加 `isFavorite` 欄位
2. 使用 localStorage 持久化最愛清單
3. UI 需要愛心圖示按鈕和篩選功能

### Recommended Implementation Order
1. 更新資料結構，增加 isFavorite 欄位
2. 實作 localStorage 讀寫功能
3. 新增愛心按鈕 UI 元件
4. 實作篩選功能
5. 新增測試

[返回主 agent]

Claude (Main Agent):
好的，規格已經設計完成。讓我參考 docs/specs/favorites.md 來實作這個功能...
```

**輸出格式：**

Agent 完成後會提供：
- 創建或更新的文件清單
- 實作重點提示
- 建議的實作順序
- 測試重點領域

## How to Invoke Agents

使用 Task tool 調用 agent：

```javascript
Task(
  subagent_type: "general-purpose",
  prompt: "Use the spec-designer agent to design a favorites feature spec"
)
```

或者直接告訴 Claude：

```
請使用 spec-designer agent 來設計「最愛電台」功能的規格
```

## Agent Guidelines

### spec-designer

**Do:**
- ✅ 閱讀所有現有 specs 以理解風格
- ✅ 設計清晰、可執行的規格
- ✅ 提供充足的程式碼範例
- ✅ 更新 docs/specs/README.md 索引
- ✅ 交叉引用相關規格文件

**Don't:**
- ❌ 不要實作程式碼
- ❌ 不要修改 CLAUDE.md
- ❌ 不要修改 README.md
- ❌ 不要修改 src/ 目錄中的程式碼
- ❌ 只能在 docs/specs/ 目錄工作

## Benefits of Using Agents

1. **關注點分離：** Spec 設計與程式碼實作分離
2. **一致性：** Agent 確保所有規格遵循相同格式
3. **完整性：** Agent 使用 checklist 確保規格完整
4. **效率：** 主 agent 可以直接參考清晰的規格進行開發
5. **可追溯性：** 所有設計決策都有文件記錄

## Future Agents

可考慮新增的 agents：

- **test-designer** - 設計測試策略和測試案例
- **code-reviewer** - 程式碼審查
- **refactor-planner** - 重構規劃
- **performance-analyzer** - 效能分析與優化建議
```