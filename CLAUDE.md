# Web Radio Player

## 技術棧
- Vue 3 (Composition API)
- Vite (Build Tool)
- Tailwind CSS (Styling)

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

## 部署
專案配置為 GitHub Pages 部署，打包後的檔案位於 `dist/` 目錄。

## 開發規範
- **自動提交規則**：每當完成一個功能修改並通過測試，必須自動執行 `git commit`，並使用規範的 Commit Message（格式：`<type>: <description>`，例如 `feat: 新增外連電台提示彈窗`）。
