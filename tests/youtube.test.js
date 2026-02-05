import { describe, it, expect, beforeEach } from 'vitest'
import { loadYouTubeAPI } from '../src/utils/youtube'

describe('loadYouTubeAPI', () => {
  beforeEach(() => {
    // 清理全域狀態
    delete window.YT
    delete window.onYouTubeIframeAPIReady
  })

  it('應該返回 Promise', () => {
    const result = loadYouTubeAPI()
    expect(result).toBeInstanceOf(Promise)
  })

  it('如果 API 已載入，應該立即 resolve', async () => {
    // 模擬 API 已載入
    window.YT = {
      Player: function() {}
    }

    const result = await loadYouTubeAPI()
    expect(result).toBe(window.YT)
  })

  it('多次呼叫應該返回相同的 Promise（避免重複載入）', () => {
    // 重置全域狀態以避免使用快取的 YT
    delete window.YT

    const promise1 = loadYouTubeAPI()
    const promise2 = loadYouTubeAPI()

    expect(promise1).toBe(promise2)
  })
})

/**
 * 注意：以下測試因 jsdom 環境限制而無法執行：
 *
 * 1. script 標籤動態插入測試
 *    - jsdom 不會實際載入和執行 script 標籤
 *    - 這些功能需要在實際瀏覽器環境中手動測試
 *
 * 2. API 載入完成回調測試
 *    - 依賴 script 標籤實際執行，在 jsdom 中無法模擬
 *    - 實際使用時，YouTube API 會自動呼叫 onYouTubeIframeAPIReady
 *
 * 這些功能會在整合測試和手動測試中驗證。
 */
