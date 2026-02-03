# 新增電台

將新電台加入 `src/data/stations.js` 資料清單。

## 參數
- $ARGUMENTS: 電台名稱與 URL（格式：名稱 URL）

## 執行步驟
1. 解析 $ARGUMENTS 取得電台名稱和 URL
2. **驗證 URL**：使用 `curl -I` 或 fetch 檢查該 URL
   - 必須回傳 HTTP 200 OK
   - `Content-Type` 必須包含 `audio`（如 `audio/mpeg`、`audio/aac`、`audio/ogg` 等）
   - 若驗證失敗，顯示錯誤訊息並中止執行
3. 讀取 `src/data/stations.js` 檔案
4. 產生新的 ID（取現有最大 ID + 1）
5. 將新電台物件加入陣列末端
6. 儲存更新後的檔案

## 驗證指令範例
```bash
curl -I --max-time 10 "https://stream.example.com/radio"
```
預期回應應包含：
- `HTTP/... 200` 或 `HTTP/... 200 OK`
- `Content-Type: audio/...`

## 範例
```
/add 中廣流行網 https://stream.example.com/pop
```
