/**
 * YouTube IFrame Player API 載入工具
 * 動態載入 YouTube API 並提供 Promise 介面
 */

let apiLoadPromise = null

/**
 * 載入 YouTube IFrame Player API
 * @returns {Promise<YT>} YouTube API 物件
 */
export const loadYouTubeAPI = () => {
  // 如果已經載入，直接返回
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT)
  }

  // 如果正在載入，返回相同的 Promise
  if (apiLoadPromise) {
    return apiLoadPromise
  }

  // 創建新的載入 Promise
  apiLoadPromise = new Promise((resolve, reject) => {
    // 設置全域回調
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT)
    }

    // 動態插入 script 標籤
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true

    tag.onerror = () => {
      apiLoadPromise = null // 重置以允許重試
      reject(new Error('無法載入 YouTube API'))
    }

    const firstScriptTag = document.getElementsByTagName('script')[0]
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      // Fallback: 直接添加到 head
      document.head.appendChild(tag)
    }
  })

  return apiLoadPromise
}
