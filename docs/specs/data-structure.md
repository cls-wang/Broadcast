# 資料結構規格

## 概述

定義 Web Radio Player 中所有資料物件的結構、驗證規則與儲存方式。

## 電台資料格式

### Radio Object

```javascript
{
  id: Number,        // 唯一識別碼
  name: String,      // 電台顯示名稱
  url: String        // 串流 URL (HTTP 或 HTTPS)
}
```

### 欄位說明

#### `id`
- **型別：** Number
- **必填：** 是
- **唯一性：** 必須唯一
- **生成方式：** 自動遞增（取當前最大 ID + 1）
- **用途：** Vue 的 `v-for` key 值，確保列表渲染效能

#### `name`
- **型別：** String
- **必填：** 是
- **長度限制：** 1-50 字元
- **驗證規則：** 不可為空字串或純空白
- **用途：** 顯示在電台按鈕上

#### `url`
- **型別：** String
- **必填：** 是
- **格式：** 必須是有效的 HTTP 或 HTTPS URL
- **驗證規則：**
  - 必須以 `http://` 或 `https://` 開頭
  - 必須符合 URL 格式規範
- **用途：** 電台串流來源

### 範例資料

```javascript
{
  id: 1,
  name: 'KISS Radio',
  url: 'https://stream.kissfm.com.tw/live'
}
```

```javascript
{
  id: 2,
  name: 'Hit FM 台北之音',
  url: 'http://cast.hifm.tw:8080/proxy/hifmg001?mp=/stream'
}
```

## 電台清單結構

### Radios Array

```javascript
const radios = ref([
  { id: 1, name: '電台1', url: 'https://...' },
  { id: 2, name: '電台2', url: 'http://...' },
  // ...
])
```

### 管理規則

- **儲存位置：** `App.vue` 元件內的 reactive state
- **初始資料：** 包含預設的電台清單
- **持久化：** 目前僅存在於記憶體（未來可擴充至 localStorage）

## 狀態管理結構

### 播放狀態

```javascript
const currentRadio = ref(null)      // 當前選中的電台 (Radio Object 或 null)
const isPlaying = ref(false)        // 是否正在播放
```

### UI 狀態

```javascript
const showWarningModal = ref(false) // 是否顯示警告彈窗
const pendingRadioUrl = ref('')     // 待開啟的外連 URL
```

## 資料驗證

### 新增電台時的驗證

```javascript
const validateRadio = (radio) => {
  // 檢查名稱
  if (!radio.name || radio.name.trim() === '') {
    return { valid: false, error: '電台名稱不可為空' }
  }
  if (radio.name.length > 50) {
    return { valid: false, error: '電台名稱不可超過 50 字元' }
  }

  // 檢查 URL
  if (!radio.url) {
    return { valid: false, error: 'URL 不可為空' }
  }
  if (!radio.url.startsWith('http://') && !radio.url.startsWith('https://')) {
    return { valid: false, error: 'URL 必須以 http:// 或 https:// 開頭' }
  }

  // 檢查是否重複
  if (radios.value.some(r => r.url === radio.url)) {
    return { valid: false, error: '此電台已存在' }
  }

  return { valid: true }
}
```

## ID 生成策略

```javascript
const generateNewId = () => {
  if (radios.value.length === 0) return 1
  const maxId = Math.max(...radios.value.map(r => r.id))
  return maxId + 1
}
```

## 未來擴充

### Local Storage 持久化

```javascript
// 儲存
const saveToLocalStorage = () => {
  localStorage.setItem('radios', JSON.stringify(radios.value))
}

// 載入
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('radios')
  if (saved) {
    radios.value = JSON.parse(saved)
  }
}
```

### 新增欄位建議

可考慮新增的欄位：
- `category: String` - 電台分類（音樂、新聞、談話等）
- `country: String` - 國家代碼
- `language: String` - 語言
- `logo: String` - 電台 Logo URL
- `description: String` - 電台簡介
- `isFavorite: Boolean` - 是否為最愛
- `playCount: Number` - 播放次數

## 相關規格

- [播放邏輯](playback.md) - 如何使用電台資料進行播放
- [UI 設計](ui-design.md) - 如何顯示電台資料
