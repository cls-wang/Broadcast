# 部署到 GitHub Pages

自動執行打包並產出適合 GitHub Pages 的檔案。

## 執行步驟
1. 執行 `npm run build` 打包專案
2. 確認 `dist/` 目錄已產生
3. 列出 `dist/` 目錄內容供確認
4. 提示使用者可將 `dist/` 目錄內容推送至 GitHub Pages 分支

## 部署方式
- 使用 `gh-pages` 分支
- 或使用 GitHub Actions 自動部署
- 專案已配置 `base: './'` 支援子目錄部署
