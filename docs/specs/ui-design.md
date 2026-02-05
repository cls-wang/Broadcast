# UI 設計規格

## 概述

定義 Web Radio Player 的視覺設計系統、互動規範與手機端優化策略。

## 設計目標

- **手機優先：** 針對手機端 Chrome 與 Safari 優化
- **觸控友善：** 大按鈕、清晰的觸控目標
- **視覺吸引：** 現代化的漸層背景與流暢動畫
- **簡潔直觀：** 減少認知負擔，快速上手

## 目標平台

### 主要平台
- iOS Safari (Mobile)
- Android Chrome (Mobile)

### 次要平台
- Desktop Chrome
- Desktop Safari
- Desktop Firefox

## 響應式設計

### 斷點策略
- **Mobile：** < 768px（主要優化目標）
- **Tablet：** 768px - 1024px
- **Desktop：** > 1024px

### 布局規則
- 手機版：單欄，垂直堆疊
- 平板版：雙欄網格
- 桌面版：三欄網格（可選）

## 視覺設計系統

### 色彩系統

#### 主要漸層背景
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

#### 按鈕配色
- **電台按鈕：** 白色背景 + 陰影
- **Hover/Active：** 淺藍色背景 (`bg-blue-50`)
- **播放中：** 藍色背景 (`bg-blue-500`) + 白色文字

#### 文字顏色
- **主要文字：** 深灰色 (`text-gray-800`)
- **次要文字：** 中灰色 (`text-gray-600`)
- **反色文字：** 白色 (`text-white`)

### 間距系統

使用 Tailwind 的間距 scale：
- **元素內距：** `p-4` (1rem)
- **按鈕內距：** `px-6 py-3` (1.5rem x 0.75rem)
- **元素間距：** `gap-4` (1rem)
- **區塊間距：** `mb-6` (1.5rem)

### 字型系統

- **字型家族：** System font stack (Tailwind 預設)
- **標題大小：** `text-3xl` (1.875rem)
- **按鈕文字：** `text-lg` (1.125rem)
- **一般文字：** `text-base` (1rem)
- **字重：** `font-semibold` (600) 用於強調

### 圓角與陰影

- **按鈕圓角：** `rounded-lg` (0.5rem)
- **卡片圓角：** `rounded-2xl` (1rem)
- **陰影：** `shadow-xl` 用於浮起效果

## 互動設計

### 觸控目標

#### 最小尺寸
- **按鈕：** 至少 44x44px (iOS Human Interface Guidelines)
- **可點擊區域：** 完整按鈕區域，非僅文字

#### 實作
```css
/* Tailwind classes */
.radio-button {
  @apply px-6 py-3 min-h-[44px]
}
```

### 視覺回饋

#### Hover 狀態（桌面）
```css
hover:bg-blue-50 hover:scale-105
transition-transform duration-200
```

#### Active 狀態（觸控）
```css
active:scale-95
```

#### 播放中狀態
```css
bg-blue-500 text-white
```

### 動畫

#### 按鈕動畫
- **Transform：** `transition-transform duration-200`
- **Scale on hover：** `scale-105`
- **Scale on click：** `scale-95`

#### 彈窗動畫
- **淡入：** Fade in (可選)
- **背景模糊：** `backdrop-blur-sm`

## 元件設計

### 電台按鈕

**外觀：**
- 白色背景，大型圓角
- 深色文字，粗體
- 懸停時淺藍背景 + 放大效果
- 播放中時藍色背景 + 白色文字

**程式碼：**
```vue
<button
  class="w-full bg-white text-gray-800 text-lg font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-transform duration-200"
  :class="{ 'bg-blue-500 text-white': isCurrentRadio }"
>
  {{ radio.name }}
</button>
```

### 警告彈窗

**外觀：**
- 置中顯示
- 白色背景，圓角卡片
- 半透明黑色遮罩背景
- 標題 + 訊息 + 雙按鈕佈局

**結構：**
```
┌─────────────────────────────────┐
│  ⚠️ 提示                         │
│                                 │
│  此電台使用 HTTP 協定...          │
│                                 │
│  [取消]              [確定開啟]  │
└─────────────────────────────────┘
```

### Audio Player

**顯示方式：**
- 使用原生 `<audio>` 控制元件
- 位置：電台按鈕下方
- 僅在播放 HTTPS 電台時顯示

**程式碼：**
```vue
<audio
  ref="audioPlayer"
  controls
  autoplay
  class="w-full mt-4 rounded-lg shadow-lg"
/>
```

## 手機端優化

### Safari 特定處理

#### Autoplay 策略
- iOS Safari 需要使用者互動才能播放
- 解決方案：點擊按鈕時觸發 `play()`

#### 視窗高度問題
- 避免使用 `100vh`（Safari 位址列會改變高度）
- 使用 `min-h-screen` 確保完整顯示

### Chrome 特定處理

#### Autoplay 政策
- Chrome 需要設定 `autoplay` 屬性
- 確保有使用者互動（點擊事件）

### 觸控優化

- 使用 `-webkit-tap-highlight-color` 移除點擊高亮
- 避免雙擊縮放（viewport meta）
- 增加按鈕間距避免誤觸

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## 效能優化

### CSS 優化
- 使用 Tailwind 的 JIT 模式
- Purge 未使用的樣式
- 避免複雜的 CSS 選擇器

### 圖片優化
- 使用 WebP 格式（如有圖片）
- Lazy loading
- 適當尺寸的圖片

### 動畫效能
- 使用 `transform` 和 `opacity`（GPU 加速）
- 避免 `width`、`height`、`top`、`left` 動畫

## 無障礙設計

### 鍵盤導航
- 所有按鈕可用 Tab 鍵導航
- Enter/Space 觸發按鈕

### 螢幕閱讀器
- 使用語義化 HTML
- 提供 `aria-label`（如需要）

### 對比度
- 確保文字與背景對比度符合 WCAG AA 標準

## 相關規格

- [播放邏輯](playback.md) - 按鈕點擊後的行為
- [資料結構](data-structure.md) - 顯示的資料來源
