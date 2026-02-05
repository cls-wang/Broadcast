---
description: Add new radio station or YouTube playlist to the application
allowed-tools: Read, Edit, AskUserQuestion, Bash(curl:*)
---

# 新增電台或 YouTube 播放清單

將新電台或 YouTube 播放清單加入應用程式。

## 使用方式

```bash
# 互動式新增（推薦）
/add

# 快速新增電台
/add radio <電台名稱> <URL>

# 快速新增 YouTube 播放清單
/add youtube <播放清單名稱> <video_id1,video_id2,...>
```

## 執行流程

### 步驟 1：確認新增類型

如果沒有提供參數或第一個參數不是 `radio` 或 `youtube`，使用 AskUserQuestion 詢問使用者：

```
Question: 您想要新增什麼類型的內容？
Options:
1. 電台（Radio Station）- 新增 HTTP/HTTPS 電台串流
2. YouTube 播放清單 - 新增 YouTube 影片播放清單（支援隨機播放）
```

### 步驟 2A：新增電台

**參數格式：**
- `$1` = "radio" 或由使用者選擇
- `$2` = 電台名稱
- `$3` = 串流 URL

**互動式輸入：**
如果缺少參數，詢問使用者：
1. 電台名稱（1-50 字元）
2. 串流 URL（HTTP 或 HTTPS）

**驗證步驟：**

1. **驗證名稱**
   - 不可為空
   - 長度：1-50 字元

2. **驗證 URL 格式**
   - 必須以 `http://` 或 `https://` 開頭
   - 建議使用 `curl -I --max-time 10 "<URL>"` 驗證：
     - 回傳 HTTP 200 OK
     - `Content-Type` 包含 `audio` (audio/mpeg, audio/aac, audio/ogg 等)
   - 若驗證失敗，顯示警告但仍允許新增（某些電台可能有特殊配置）

3. **檢查重複**
   - 確認 URL 不存在於現有電台清單中

**執行步驟：**

1. 讀取 `src/data/stations.js`
2. 解析 stations 陣列
3. 產生新 ID（取現有最大 ID + 1）
4. 建立新電台物件：
   ```javascript
   {
     id: <new_id>,
     name: '<station_name>',
     url: '<station_url>'
   }
   ```
5. 使用 Edit 工具將新電台加入陣列末端
6. 顯示成功訊息：
   ```
   ✅ 電台「{name}」已新增成功！
   URL: {url}
   ```

**範例：**
```bash
/add radio 中廣流行網 https://stream.example.com/pop
```

### 步驟 2B：新增 YouTube 播放清單

**參數格式：**
- `$1` = "youtube" 或由使用者選擇
- `$2` = 播放清單名稱
- `$3` = 影片 ID 清單（逗號分隔）

**互動式輸入：**
如果缺少參數，詢問使用者：
1. 播放清單名稱（1-50 字元）
2. YouTube 影片 ID 或 URL（多個請用逗號或換行分隔）

**支援的輸入格式：**

```
# 格式 1：直接輸入 Video ID
dQw4w9WgXcQ, jNQXAC9IVRw, fJ9rUzIMcZQ

# 格式 2：完整 YouTube URL
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://www.youtube.com/watch?v=jNQXAC9IVRw

# 格式 3：短網址
https://youtu.be/dQw4w9WgXcQ
https://youtu.be/jNQXAC9IVRw

# 格式 4：混合格式
dQw4w9WgXcQ, https://youtu.be/jNQXAC9IVRw, fJ9rUzIMcZQ
```

**影片 ID 提取邏輯：**

```javascript
function extractVideoIds(input) {
  const ids = []
  // 分割輸入（逗號、換行、空格）
  const parts = input.split(/[,\n\s]+/).map(s => s.trim()).filter(Boolean)

  for (const part of parts) {
    // 格式 1：直接 ID (11 字元)
    if (/^[a-zA-Z0-9_-]{11}$/.test(part)) {
      ids.push(part)
      continue
    }

    // 格式 2：youtube.com/watch?v=VIDEO_ID
    const match1 = part.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    if (match1) {
      ids.push(match1[1])
      continue
    }

    // 格式 3：youtu.be/VIDEO_ID
    const match2 = part.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (match2) {
      ids.push(match2[1])
      continue
    }

    // 無法識別，警告使用者
    console.warn(`無法識別的格式: ${part}`)
  }

  return ids
}
```

**驗證步驟：**

1. **驗證名稱**
   - 不可為空
   - 長度：1-50 字元

2. **驗證影片清單**
   - 至少需要 1 個有效的影片 ID
   - 每個 ID 必須是 11 字元的英數字串
   - 移除重複的 ID

**執行步驟：**

1. 讀取 `src/components/RadioPlayer.vue`
2. 找到 `playlists` ref 定義（約在第 24-35 行附近）
3. 解析現有 playlists 陣列
4. 產生新 ID（取現有最大 ID + 1）
5. 建立新播放清單物件：
   ```javascript
   {
     id: <new_id>,
     name: '<playlist_name>',
     videoIds: ['<video_id_1>', '<video_id_2>', ...]
   }
   ```
6. 使用 Edit 工具更新 playlists 陣列（注意保持正確的縮排和格式）
7. 顯示成功訊息：
   ```
   ✅ YouTube 播放清單「{name}」已新增成功！
   包含 {count} 首影片
   影片 ID: {videoIds.join(', ')}
   ```

**範例：**
```bash
# 使用 Video IDs
/add youtube 放鬆音樂 jfKfPfyJRdk,5qap5aO4i9A,DWcJFNfaw9c

# 使用完整 URLs
/add youtube 學習音樂 https://www.youtube.com/watch?v=jfKfPfyJRdk,https://youtu.be/5qap5aO4i9A
```

## 目標檔案位置

- **電台資料：** `src/data/stations.js`
- **YouTube 播放清單：** `src/components/RadioPlayer.vue` 中的 `playlists` ref

## 資料格式

### 電台格式
```javascript
{
  id: 1,
  name: '電台名稱',
  url: 'https://stream.example.com/radio'
}
```

### YouTube 播放清單格式
```javascript
{
  id: 1,
  name: '播放清單名稱 🎵',
  videoIds: [
    'jfKfPfyJRdk',
    '5qap5aO4i9A',
    'DWcJFNfaw9c'
  ]
}
```

## 錯誤處理

### 常見錯誤

1. **URL 驗證失敗（電台）**
   - 顯示警告但仍允許新增
   - 提示：「⚠️ 無法驗證 URL，但已新增。請手動測試是否正常播放。」

2. **無效的影片 ID（YouTube）**
   - 過濾掉無效 ID
   - 若全部無效，提示錯誤並中止
   - 提示：「❌ 沒有找到有效的影片 ID，請檢查輸入格式。」

3. **重複的 URL/ID**
   - 檢查是否已存在
   - 提示：「⚠️ 此電台/播放清單已存在，請確認後再試。」

4. **檔案讀取/寫入錯誤**
   - 顯示完整錯誤訊息
   - 提示：「❌ 無法更新檔案，請檢查檔案權限。」

## 提示與注意事項

- 電台 URL 建議使用 HTTPS 以確保安全性
- HTTP 電台在播放時會以外連方式開啟
- YouTube 播放清單支援隨機播放功能
- 建議每個播放清單包含 5-20 首影片以獲得最佳體驗
- 可以使用 emoji 讓播放清單名稱更生動（如：🎵 🎸 🎹 🎤）
