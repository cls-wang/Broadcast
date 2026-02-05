# 播放邏輯規格

## 概述

Web Radio Player 需要處理兩種不同協定的電台串流：HTTPS 與 HTTP。基於安全性與瀏覽器限制，兩者採用不同的播放策略。

## 需求

### 功能需求
- 支援 HTTPS 電台的站內直接播放
- 支援 HTTP 電台的外連播放
- 在開啟 HTTP 電台前顯示警告訊息
- 提供清晰的播放狀態回饋

### 非功能需求
- 播放切換應流暢無延遲
- 錯誤處理應友善明確
- 手機端播放體驗優化

## 技術規格

### HTTPS 電台播放

**處理方式：** 使用 HTML5 `<audio>` 元素直接播放

**實作要求：**
- 使用 Vue 的 `ref` 引用 audio 元素
- 設定 `controls` 屬性供使用者控制
- 啟用 `autoplay` 自動播放
- 實作載入中與錯誤狀態處理

**程式碼範例：**
```vue
<template>
  <audio ref="audioPlayer" controls autoplay />
</template>

<script setup>
import { ref } from 'vue'

const audioPlayer = ref(null)

const playRadio = (radio) => {
  if (audioPlayer.value) {
    audioPlayer.value.src = radio.url
    audioPlayer.value.play()
  }
}
</script>
```

### HTTP 電台播放

**處理方式：** 使用 `window.open()` 在新分頁開啟

**實作要求：**
- 在開啟前顯示警告彈窗
- 使用 `target="_blank"` 開啟新分頁
- 暫存待開啟的 URL 直到使用者確認
- 提供「取消」選項

**流程：**
1. 使用者點擊 HTTP 電台
2. 顯示警告彈窗，說明將開啟外部連結
3. 使用者確認後，開啟新分頁
4. 使用者取消則關閉彈窗，不執行任何動作

**程式碼範例：**
```javascript
const showWarningModal = ref(false)
const pendingRadioUrl = ref('')

const playRadio = (radio) => {
  if (radio.url.startsWith('https://')) {
    // HTTPS: 直接播放
    if (audioPlayer.value) {
      audioPlayer.value.src = radio.url
      audioPlayer.value.play()
    }
  } else {
    // HTTP: 顯示警告
    showWarningModal.value = true
    pendingRadioUrl.value = radio.url
  }
}

const confirmOpenExternal = () => {
  window.open(pendingRadioUrl.value, '_blank')
  showWarningModal.value = false
  pendingRadioUrl.value = ''
}
```

## 協定檢測

**檢測方式：** 使用 `String.prototype.startsWith()`

```javascript
const isHTTPS = url.startsWith('https://')
const isHTTP = url.startsWith('http://') && !isHTTPS
```

## 錯誤處理

### 播放失敗
- 監聽 `<audio>` 的 `error` 事件
- 顯示使用者友善的錯誤訊息
- 提供重試選項

### URL 無效
- 在新增電台時驗證 URL 格式
- 拒絕非 HTTP/HTTPS 協定的 URL

## 狀態管理

需要追蹤的狀態：
- `currentRadio` - 當前播放的電台
- `isPlaying` - 是否正在播放
- `showWarningModal` - 是否顯示警告彈窗
- `pendingRadioUrl` - 待開啟的外連 URL

## 相關規格

- [資料結構](data-structure.md) - 電台資料格式
- [UI 設計](ui-design.md) - 播放按鈕與警告彈窗設計
