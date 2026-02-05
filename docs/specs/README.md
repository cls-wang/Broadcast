# 功能規格文件

本目錄包含 Web Radio Player 的詳細功能規格，按照不同面向分類。

## 規格列表

### [播放邏輯 (playback.md)](playback.md)
- HTTPS/HTTP 電台的處理策略
- 播放器實作細節
- 外連警告機制

### [資料結構 (data-structure.md)](data-structure.md)
- 電台資料格式
- 狀態管理結構
- 資料驗證規則

### [UI 設計 (ui-design.md)](ui-design.md)
- 手機端優化規範
- 視覺設計系統
- 互動設計原則

### [YouTube 播放清單 (youtube-playlist.md)](youtube-playlist.md)
- YouTube IFrame Player API 整合
- 隨機播放與自動連續播放
- 播放清單資料結構
- 與電台播放器互斥邏輯

## 新增規格

當需要新增功能規格時：

1. 在 `docs/specs/` 目錄下建立新的 `.md` 文件
2. 使用清晰的檔名（例如：`feature-name.md`）
3. 在本文件中更新規格列表
4. 遵循現有規格文件的結構格式

## 規格文件結構

每個規格文件應包含：

```markdown
# 功能名稱

## 概述
簡短描述此功能的目的與範圍

## 需求
功能需求列表

## 技術規格
實作細節與技術要求

## 實作範例
程式碼範例（如適用）

## 相關規格
連結到其他相關的規格文件
```
