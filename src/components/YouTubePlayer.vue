<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { loadYouTubeAPI } from '../utils/youtube'
import { shuffleArray } from '../utils/shuffle'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['stop'])

const player = ref(null)
const isPlayerReady = ref(false)
const shuffledVideoIds = ref([])
const currentVideoIndex = ref(0)
const isPlayerError = ref(false)
const errorMessage = ref('')

// 初始化播放器
const initializePlayer = async () => {
  try {
    const YT = await loadYouTubeAPI()

    // 驗證播放清單
    if (!props.playlist.videoIds || props.playlist.videoIds.length === 0) {
      errorMessage.value = '播放清單為空'
      isPlayerError.value = true
      return
    }

    // 洗牌影片 ID
    shuffledVideoIds.value = shuffleArray(props.playlist.videoIds)
    currentVideoIndex.value = 0

    // 創建播放器
    player.value = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: shuffledVideoIds.value[0],
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        fs: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    })
  } catch (error) {
    console.error('YouTube Player initialization failed:', error)
    errorMessage.value = '無法載入 YouTube 播放器'
    isPlayerError.value = true
  }
}

// 播放器就緒
const onPlayerReady = (event) => {
  isPlayerReady.value = true
  event.target.playVideo()
}

// 播放器狀態改變
const onPlayerStateChange = (event) => {
  // YT.PlayerState.ENDED = 0
  if (event.data === 0) {
    playNextRandomVideo()
  }
}

// 播放器錯誤
const onPlayerError = (event) => {
  console.error('YouTube Player error:', event.data)
  // 錯誤代碼：
  // 2 - 無效的參數
  // 5 - HTML5 播放器錯誤
  // 100 - 影片不存在或被移除
  // 101, 150 - 影片不允許嵌入

  // 自動跳到下一個影片
  playNextRandomVideo()
}

// 播放下一個隨機影片
const playNextRandomVideo = () => {
  currentVideoIndex.value++

  // 如果播放完所有影片，重新洗牌
  if (currentVideoIndex.value >= shuffledVideoIds.value.length) {
    shuffledVideoIds.value = shuffleArray(props.playlist.videoIds)
    currentVideoIndex.value = 0
  }

  const nextVideoId = shuffledVideoIds.value[currentVideoIndex.value]
  if (player.value && isPlayerReady.value) {
    player.value.loadVideoById(nextVideoId)
  }
}

// 停止播放
const stopPlayer = () => {
  if (player.value) {
    player.value.stopVideo()
  }
  emit('stop')
}

// 組件掛載時初始化
onMounted(() => {
  initializePlayer()
})

// 組件卸載時清理
onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})

// 監聽播放清單變化
watch(() => props.playlist, () => {
  if (player.value) {
    player.value.destroy()
  }
  initializePlayer()
})
</script>

<template>
  <div class="w-full">
    <!-- 播放清單名稱 -->
    <div class="mb-4 text-center">
      <h2 class="text-xl font-semibold text-white sm:text-2xl">
        {{ playlist.name }}
      </h2>
      <p class="mt-1 text-sm text-slate-400">
        隨機播放模式
      </p>
    </div>

    <!-- YouTube 播放器 -->
    <div v-if="!isPlayerError" class="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      <!-- 16:9 寬高比容器 -->
      <div class="relative pb-[56.25%]">
        <div id="youtube-player" class="absolute inset-0"></div>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <div v-else class="rounded-2xl bg-red-500/20 p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="mt-4 text-lg font-medium text-red-300">{{ errorMessage }}</p>
    </div>

    <!-- 停止按鈕 -->
    <div class="mt-6 flex justify-center">
      <button
        @click="stopPlayer"
        class="flex h-12 items-center gap-2 rounded-full bg-red-500/20 px-6 text-red-400 transition-all duration-200 hover:bg-red-500/30 active:scale-95"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
        <span class="font-medium">停止播放</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* YouTube IFrame API 會自動管理播放器大小 */
</style>
