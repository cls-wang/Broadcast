# Web Radio Player

## 技術棧
- Vue 3 (Composition API)
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Vitest (Testing Framework)

## 播放邏輯
- **HTTPS 電台**：使用 `<audio>` 標籤直接播放
- **HTTP 電台**：使用 `target="_blank"` 外連開啟新視窗播放

## 目標平台
- 優化手機端 Chrome 與 Safari 的操作體驗
- 觸控友善的大按鈕設計
- 響應式布局適配各種螢幕尺寸

## 電台資料格式
```javascript
{
  id: 1,
  name: '電台名稱',
  url: 'https://stream.example.com/radio'
}
```

## 開發指令
- `npm run dev` - 啟動開發伺服器
- `npm run build` - 打包生產版本
- `npm run preview` - 預覽生產版本
- `npm run test` - 執行測試（watch 模式）
- `npm run test:run` - 執行測試（單次）

## 部署
專案配置為 GitHub Pages 部署，打包後的檔案位於 `dist/` 目錄。

## 開發規範

### Git 工作流程
1. **分支規範**：除非是修改 `CLAUDE.md` 或 `README.md`，否則所有代碼修改必須在新的 feature branch 執行。
2. **自動命名**：根據任務內容自動命名分支，格式為 `<type>/<short-description>`，例如：
   - `feat/add-volume-control` - 新功能
   - `fix/audio-playback-error` - 錯誤修復
   - `refactor/optimize-modal` - 重構
   - `style/update-button-design` - 樣式調整
3. **開發流程**：
   - 建立新分支 → 開發功能 → 執行 `npm run test:run` 與 `npm run build`
   - 測試通過後自動 commit（使用規範的 Commit Message）
   - 提示使用者是否要合併回 `main` 並執行部署

### Commit 規範
- **自動提交規則**：每當完成一個功能修改並通過測試，必須自動執行 `git commit`，並使用規範的 Commit Message（格式：`<type>: <description>`，例如 `feat: 新增外連電台提示彈窗`）。
- **自動推送規則**：當使用者確認 commit 內容沒問題後，自動執行 `git push`，確保 GitHub 遠端倉庫永遠保持最新狀態。
