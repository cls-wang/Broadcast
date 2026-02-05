# YouTube 播放清單隨機播放規格

## 概述

在現有的電台播放器中新增 YouTube 播放清單功能，支援隨機開始播放並自動連續隨機播放清單內的影片。此功能使用 YouTube IFrame Player API，提供與電台按鈕並列的獨立播放控制。

## 需求

### 功能需求
- 新增專用的「YouTube 播放清單」按鈕
- 點擊後開啟嵌入式 YouTube 播放器
- 首次播放時從清單中隨機選擇一個影片開始
- 影片結束後自動播放下一個隨機影片（不重複直到所有影片播放完）
- 提供播放、暫停、停止控制
- 支援多個不同的播放清單（可擴充）

### 非功能需求
- **效能要求**
  - YouTube API 載入不應阻塞主應用程式
  - 播放器切換應流暢無卡頓
- **相容性要求**
  - 支援手機端 Chrome 與 Safari
  - 適應不同螢幕尺寸的嵌入式播放器
- **使用者體驗要求**
  - 播放清單與電台功能互斥（同時只能播放一個）
  - 清楚的視覺狀態指示（播放中/暫停/停止）
  - 錯誤提示友善明確

## 技術規格

### Architecture

```
┌─────────────────────────────────────────────┐
│            RadioPlayer.vue                  │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Radio Buttons│  │ YouTube Playlist Btn │ │
│  └──────────────┘  └──────────────────────┘ │
│                                             │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Audio Player │  │  YouTubePlayer.vue   │ │
│  │  <audio />   │  │   (IFrame API)       │ │
│  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 資料結構

#### YouTubePlaylist Object

```javascript
{
  id: Number,              // 唯一識別碼
  name: String,            // 播放清單顯示名稱
  playlistId: String,      // YouTube Playlist ID (可選)
  videoIds: Array<String>  // YouTube Video IDs 陣列
}
```

#### 欄位說明

**`id`**
- **型別：** Number
- **必填：** 是
- **唯一性：** 必須唯一
- **用途：** 識別不同的播放清單

**`name`**
- **型別：** String
- **必填：** 是
- **長度限制：** 1-50 字元
- **用途：** 顯示在播放清單按鈕上

**`playlistId`**
- **型別：** String
- **必填：** 否（與 videoIds 二選一）
- **格式：** YouTube Playlist ID（例如：`PLxxxxxxxxxxxxxxx`）
- **用途：** 使用 YouTube 播放清單 ID 直接載入

**`videoIds`**
- **型別：** Array<String>
- **必填：** 是（如無 playlistId）
- **格式：** YouTube Video ID 陣列（例如：`['dQw4w9WgXcQ', 'abc123def45']`）
- **用途：** 手動指定播放清單內容，支援隨機播放邏輯

#### 範例資料

```javascript
// 方式一：使用 Video IDs（推薦，支援完整隨機功能）
{
  id: 1,
  name: '放鬆音樂',
  videoIds: [
    'dQw4w9WgXcQ',
    'jNQXAC9IVRw',
    'fJ9rUzIMcZQ',
    '2Vv-BfVoq4g',
    '9bZkp7q19f0'
  ]
}

// 方式二：使用 Playlist ID（簡化版）
{
  id: 2,
  name: '流行音樂',
  playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
  videoIds: [] // 空陣列或省略
}
```

### 狀態管理

```javascript
// 播放清單資料
const playlists = ref([
  { id: 1, name: '放鬆音樂', videoIds: [...] }
])

// 播放狀態
const currentPlaylist = ref(null)        // 當前播放的清單
const isYouTubePlayerActive = ref(false) // YouTube 播放器是否啟用
const youtubePlayer = ref(null)          // YouTube Player 實例

// 隨機播放狀態
const playedVideoIds = ref([])           // 已播放過的影片 ID
const currentVideoIndex = ref(-1)        // 當前影片在陣列中的索引
const shuffledVideoIds = ref([])         // 洗牌後的影片 ID 陣列
```

### YouTube IFrame Player API 整合

#### API 載入

```javascript
// utils/youtube.js
export const loadYouTubeAPI = () => {
  return new Promise((resolve, reject) => {
    // 檢查是否已載入
    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }

    // 動態載入 API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT)
    }

    tag.onerror = () => {
      reject(new Error('Failed to load YouTube API'))
    }

    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  })
}
```

#### 播放器初始化

```javascript
// components/YouTubePlayer.vue
import { ref, onMounted, watch } from 'vue'
import { loadYouTubeAPI } from '@/utils/youtube'

const player = ref(null)
const isReady = ref(false)

const initPlayer = async (videoId) => {
  try {
    const YT = await loadYouTubeAPI()

    player.value = new YT.Player('youtube-player', {
      height: '315',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 1,           // 自動播放
        controls: 1,           // 顯示控制列
        modestbranding: 1,     // 簡化 YouTube Logo
        rel: 0,                // 不顯示相關影片
        playsinline: 1         // iOS 行內播放
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    })
  } catch (error) {
    console.error('YouTube Player initialization failed:', error)
  }
}

const onPlayerReady = (event) => {
  isReady.value = true
  event.target.playVideo()
}

const onPlayerStateChange = (event) => {
  // YT.PlayerState.ENDED = 0
  if (event.data === 0) {
    playNextRandomVideo()
  }
}

const onPlayerError = (event) => {
  console.error('YouTube Player error:', event.data)
  // 跳到下一首
  playNextRandomVideo()
}
```

### 隨機播放邏輯

#### Fisher-Yates 洗牌演算法

```javascript
// utils/shuffle.js
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
```

#### 隨機播放實作

```javascript
// components/YouTubePlayer.vue
import { shuffleArray } from '@/utils/shuffle'

const playRandomPlaylist = (playlist) => {
  // 重置狀態
  playedVideoIds.value = []
  currentPlaylist.value = playlist

  // 洗牌影片 ID
  shuffledVideoIds.value = shuffleArray(playlist.videoIds)
  currentVideoIndex.value = 0

  // 播放第一個隨機影片
  const firstVideoId = shuffledVideoIds.value[0]
  playedVideoIds.value.push(firstVideoId)

  if (player.value) {
    player.value.loadVideoById(firstVideoId)
  } else {
    initPlayer(firstVideoId)
  }

  isYouTubePlayerActive.value = true
}

const playNextRandomVideo = () => {
  currentVideoIndex.value++

  // 如果播放完所有影片，重新洗牌
  if (currentVideoIndex.value >= shuffledVideoIds.value.length) {
    shuffledVideoIds.value = shuffleArray(currentPlaylist.value.videoIds)
    currentVideoIndex.value = 0
    playedVideoIds.value = []
  }

  const nextVideoId = shuffledVideoIds.value[currentVideoIndex.value]
  playedVideoIds.value.push(nextVideoId)

  if (player.value && isReady.value) {
    player.value.loadVideoById(nextVideoId)
  }
}
```

### UI 整合

#### 播放清單按鈕

```vue
<!-- RadioPlayer.vue -->
<template>
  <div class="container">
    <!-- 電台按鈕區 -->
    <div class="radio-buttons">
      <button
        v-for="radio in radios"
        :key="radio.id"
        @click="playRadio(radio)"
        class="radio-button"
        :class="{ 'active': currentRadio?.id === radio.id && !isYouTubePlayerActive }"
      >
        {{ radio.name }}
      </button>
    </div>

    <!-- YouTube 播放清單按鈕區 -->
    <div class="playlist-buttons mt-6">
      <h3 class="text-white text-xl font-semibold mb-4">YouTube 播放清單</h3>
      <button
        v-for="playlist in playlists"
        :key="playlist.id"
        @click="playPlaylist(playlist)"
        class="playlist-button"
        :class="{ 'active': currentPlaylist?.id === playlist.id && isYouTubePlayerActive }"
      >
        🎵 {{ playlist.name }}
      </button>
    </div>

    <!-- 播放器區 -->
    <div class="players mt-6">
      <!-- Audio Player (電台) -->
      <audio
        v-show="!isYouTubePlayerActive && currentRadio"
        ref="audioPlayer"
        controls
        autoplay
        class="w-full"
      />

      <!-- YouTube Player -->
      <YouTubePlayer
        v-if="isYouTubePlayerActive"
        :playlist="currentPlaylist"
        @stop="stopYouTubePlayer"
      />
    </div>
  </div>
</template>

<style scoped>
.playlist-button {
  @apply w-full bg-white text-gray-800 text-lg font-semibold px-6 py-3 rounded-lg shadow-lg;
  @apply hover:bg-red-50 hover:scale-105 active:scale-95;
  @apply transition-transform duration-200;
}

.playlist-button.active {
  @apply bg-red-500 text-white;
}
</style>
```

#### YouTubePlayer 元件

```vue
<!-- components/YouTubePlayer.vue -->
<template>
  <div class="youtube-player-container">
    <div class="player-header">
      <h3 class="text-white text-lg font-semibold">
        正在播放：{{ playlist?.name }}
      </h3>
      <button
        @click="$emit('stop')"
        class="stop-button"
      >
        停止播放
      </button>
    </div>

    <div id="youtube-player" class="player-frame"></div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { loadYouTubeAPI } from '@/utils/youtube'
import { shuffleArray } from '@/utils/shuffle'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['stop'])

const player = ref(null)
const isReady = ref(false)
const error = ref('')
const shuffledVideoIds = ref([])
const currentVideoIndex = ref(0)

// 初始化播放器
onMounted(async () => {
  try {
    shuffledVideoIds.value = shuffleArray(props.playlist.videoIds)
    const firstVideoId = shuffledVideoIds.value[0]
    await initPlayer(firstVideoId)
  } catch (err) {
    error.value = '載入播放器失敗，請重試'
    console.error(err)
  }
})

// 清理播放器
onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})

// ... (其他方法如前所述)
</script>

<style scoped>
.youtube-player-container {
  @apply bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4;
}

.player-header {
  @apply flex justify-between items-center mb-4;
}

.stop-button {
  @apply bg-red-500 text-white px-4 py-2 rounded-lg;
  @apply hover:bg-red-600 transition-colors;
}

.player-frame {
  @apply w-full rounded-lg overflow-hidden;
  aspect-ratio: 16/9;
}

.error-message {
  @apply text-red-300 mt-2 text-center;
}
</style>
```

### 互斥播放邏輯

```javascript
// RadioPlayer.vue
const playRadio = (radio) => {
  // 停止 YouTube 播放器
  if (isYouTubePlayerActive.value) {
    stopYouTubePlayer()
  }

  // 播放電台
  currentRadio.value = radio
  if (radio.url.startsWith('https://')) {
    if (audioPlayer.value) {
      audioPlayer.value.src = radio.url
      audioPlayer.value.play()
    }
  } else {
    // HTTP 外連邏輯
    showWarningModal.value = true
    pendingRadioUrl.value = radio.url
  }
}

const playPlaylist = (playlist) => {
  // 停止電台播放
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.src = ''
  }
  currentRadio.value = null

  // 播放 YouTube 清單
  isYouTubePlayerActive.value = true
  currentPlaylist.value = playlist
}

const stopYouTubePlayer = () => {
  isYouTubePlayerActive.value = false
  currentPlaylist.value = null
}
```

## 錯誤處理

### 播放器載入失敗

**情境：** YouTube API 載入失敗或網路問題

**處理策略：**
```javascript
try {
  await loadYouTubeAPI()
} catch (error) {
  alert('無法載入 YouTube 播放器，請檢查網路連線')
  emit('stop')
}
```

### 影片無法播放

**情境：** 影片已刪除、版權限制、地區限制

**處理策略：**
```javascript
const onPlayerError = (event) => {
  console.error('Video error:', event.data)
  // Error codes:
  // 2: Invalid video ID
  // 5: HTML5 player error
  // 100: Video not found
  // 101/150: Video restricted

  // 自動跳到下一首
  playNextRandomVideo()
}
```

### 播放清單為空

**情境：** videoIds 陣列為空

**處理策略：**
```javascript
const playRandomPlaylist = (playlist) => {
  if (!playlist.videoIds || playlist.videoIds.length === 0) {
    alert('此播放清單沒有影片')
    return
  }
  // 繼續播放邏輯...
}
```

### API 配額限制

**情境：** YouTube API 達到每日請求限制

**處理策略：**
- 使用 IFrame Player API（不計入配額）
- 避免使用 Data API
- 錯誤時提示使用者稍後再試

## 測試策略

### 單元測試

```javascript
// __tests__/shuffle.test.js
import { describe, it, expect } from 'vitest'
import { shuffleArray } from '@/utils/shuffle'

describe('shuffleArray', () => {
  it('should return array with same length', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result).toHaveLength(5)
  })

  it('should contain all original elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result.sort()).toEqual(input.sort())
  })

  it('should not mutate original array', () => {
    const input = [1, 2, 3, 4, 5]
    const original = [...input]
    shuffleArray(input)
    expect(input).toEqual(original)
  })

  it('should produce different order (probabilistic)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result1 = shuffleArray(input)
    const result2 = shuffleArray(input)
    // 非常低機率兩次洗牌結果完全相同
    expect(result1).not.toEqual(result2)
  })
})
```

```javascript
// __tests__/youtube.test.js
import { describe, it, expect, vi } from 'vitest'
import { loadYouTubeAPI } from '@/utils/youtube'

describe('loadYouTubeAPI', () => {
  it('should load YouTube API script', async () => {
    // Mock window.YT
    window.YT = { Player: vi.fn() }

    const result = await loadYouTubeAPI()
    expect(result).toBe(window.YT)
  })

  it('should not load twice if already loaded', async () => {
    window.YT = { Player: vi.fn() }

    const result1 = await loadYouTubeAPI()
    const result2 = await loadYouTubeAPI()

    expect(result1).toBe(result2)
  })
})
```

### 整合測試

```javascript
// __tests__/YouTubePlayer.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import YouTubePlayer from '@/components/YouTubePlayer.vue'

describe('YouTubePlayer', () => {
  const mockPlaylist = {
    id: 1,
    name: '測試清單',
    videoIds: ['video1', 'video2', 'video3']
  }

  beforeEach(() => {
    // Mock YouTube API
    window.YT = {
      Player: vi.fn(() => ({
        loadVideoById: vi.fn(),
        playVideo: vi.fn(),
        destroy: vi.fn()
      }))
    }
  })

  it('should render player container', () => {
    const wrapper = mount(YouTubePlayer, {
      props: { playlist: mockPlaylist }
    })

    expect(wrapper.find('.youtube-player-container').exists()).toBe(true)
  })

  it('should display playlist name', () => {
    const wrapper = mount(YouTubePlayer, {
      props: { playlist: mockPlaylist }
    })

    expect(wrapper.text()).toContain('測試清單')
  })

  it('should emit stop event when stop button clicked', async () => {
    const wrapper = mount(YouTubePlayer, {
      props: { playlist: mockPlaylist }
    })

    await wrapper.find('.stop-button').trigger('click')
    expect(wrapper.emitted('stop')).toBeTruthy()
  })
})
```

### 手動測試檢查清單

- [ ] YouTube API 成功載入
- [ ] 點擊播放清單按鈕後播放器正常顯示
- [ ] 首次播放為隨機影片（非第一個）
- [ ] 影片結束後自動播放下一個隨機影片
- [ ] 播放完所有影片後重新洗牌繼續播放
- [ ] 電台與 YouTube 播放器互斥（只能播放一個）
- [ ] 停止按鈕正常運作
- [ ] 手機端 Chrome 播放正常
- [ ] 手機端 Safari 播放正常（行內播放）
- [ ] 播放器大小響應式適配
- [ ] 錯誤影片自動跳過
- [ ] 網路錯誤時有適當提示

## 行動裝置優化

### iOS Safari 特殊處理

**問題：** iOS Safari 預設會全螢幕播放影片

**解決方案：**
```javascript
playerVars: {
  playsinline: 1  // 啟用行內播放
}
```

**額外配置：**
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 響應式播放器尺寸

```css
.player-frame {
  width: 100%;
  aspect-ratio: 16/9;
  max-width: 640px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .player-frame {
    aspect-ratio: 16/9;
  }
}
```

### 觸控優化

```css
.playlist-button {
  min-height: 44px;  /* iOS 最小觸控目標 */
  -webkit-tap-highlight-color: transparent;
}
```

## 效能考量

### 延遲載入 API

```javascript
// 只在需要時載入 YouTube API
const playPlaylist = async (playlist) => {
  if (!window.YT) {
    await loadYouTubeAPI()
  }
  // 繼續播放邏輯...
}
```

### 防止記憶體洩漏

```javascript
onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
})
```

### 預載入優化

```javascript
// 可選：預載下一個影片的縮圖
const preloadNextThumbnail = (videoId) => {
  const img = new Image()
  img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}
```

## 未來擴充

### 播放清單管理
- 新增/刪除播放清單
- 編輯播放清單（新增/移除影片）
- 匯入/匯出播放清單（JSON）

### 進階播放功能
- 重複播放模式（單曲重複、清單重複）
- 播放歷史記錄
- 跳過已播放影片的選項
- 手動切換上一首/下一首

### 播放清單來源
- 支援直接使用 YouTube Playlist URL
- 從 YouTube Data API 同步播放清單
- 支援 YouTube Music 播放清單

### 使用者偏好
- 記住上次播放的清單
- 儲存播放進度
- 自動播放設定（開/關）

### 視覺強化
- 顯示當前播放影片的標題與縮圖
- 顯示播放清單進度（已播 X/總共 Y）
- 播放清單內容預覽（展開顯示所有影片）

### 社群功能
- 分享播放清單
- 公開播放清單庫
- 使用者自訂播放清單

## 相關規格

- [播放邏輯](playback.md) - 電台播放邏輯，YouTube 播放器需與其互斥
- [資料結構](data-structure.md) - 電台資料結構，播放清單結構設計參考
- [UI 設計](ui-design.md) - 視覺設計系統，按鈕與播放器樣式一致性

## 實作優先順序

### Phase 1: 基礎功能（MVP）
1. YouTube API 載入工具
2. YouTubePlayer 元件基礎實作
3. 單一播放清單支援
4. 隨機開始播放
5. 自動連續播放（順序）

### Phase 2: 隨機播放
1. Fisher-Yates 洗牌演算法
2. 隨機連續播放功能
3. 防止重複播放（直到全部播完）

### Phase 3: UI 整合
1. 播放清單按鈕設計
2. 與電台互斥邏輯
3. 停止播放控制
4. 行動裝置樣式優化

### Phase 4: 錯誤處理與測試
1. 各種錯誤情境處理
2. 單元測試
3. 整合測試
4. 手動測試與除錯

### Phase 5: 優化與擴充（可選）
1. 播放清單管理功能
2. 進階播放控制
3. 使用者偏好設定
4. 效能優化

## 安全性考量

### API 金鑰管理
- IFrame Player API 不需要 API 金鑰（推薦使用）
- 如使用 Data API，需保護 API 金鑰（環境變數）

### 內容安全政策（CSP）
```html
<!-- 允許載入 YouTube IFrame -->
<meta http-equiv="Content-Security-Policy"
      content="frame-src 'self' https://www.youtube.com;">
```

### 使用者輸入驗證
```javascript
const validateVideoId = (videoId) => {
  // YouTube Video ID 格式：11 字元，包含 A-Z, a-z, 0-9, -, _
  const pattern = /^[A-Za-z0-9_-]{11}$/
  return pattern.test(videoId)
}
```

## 參考資源

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [YouTube Player Parameters](https://developers.google.com/youtube/player_parameters)
- [Fisher-Yates Shuffle Algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- [iOS Safari Video Playback](https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari)
