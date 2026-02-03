<script setup>
import { ref, onUnmounted } from 'vue'
import { stations } from '../data/stations.js'

const currentStation = ref(null)
const isPlaying = ref(false)
const audioElement = ref(null)

const isHttpsUrl = (url) => {
  return url.startsWith('https')
}

const playStation = (station) => {
  if (isHttpsUrl(station.url)) {
    // HTTPS stream - play with audio element
    if (currentStation.value?.id === station.id && isPlaying.value) {
      // Pause current station
      pauseAudio()
    } else {
      // Play new station or resume
      if (audioElement.value) {
        audioElement.value.pause()
      }

      audioElement.value = new Audio(station.url)
      audioElement.value.play()
        .then(() => {
          currentStation.value = station
          isPlaying.value = true
        })
        .catch((error) => {
          console.error('Error playing audio:', error)
          isPlaying.value = false
        })

      audioElement.value.addEventListener('ended', () => {
        isPlaying.value = false
      })

      audioElement.value.addEventListener('error', () => {
        isPlaying.value = false
        currentStation.value = null
      })
    }
  } else {
    // HTTP stream - open in new tab
    window.open(station.url, '_blank')
  }
}

const pauseAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    isPlaying.value = false
  }
}

const stopAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
  currentStation.value = null
  isPlaying.value = false
}

const isCurrentlyPlaying = (station) => {
  return currentStation.value?.id === station.id && isPlaying.value
}

const isCurrentStation = (station) => {
  return currentStation.value?.id === station.id
}

onUnmounted(() => {
  stopAudio()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-6 sm:px-6 sm:py-8">
    <div class="mx-auto max-w-2xl">
      <!-- Header -->
      <header class="mb-6 text-center sm:mb-8">
        <h1 class="text-2xl font-bold text-white sm:text-3xl">Radio Player</h1>
        <p class="mt-2 text-slate-400">Select a station to start listening</p>
      </header>

      <!-- Now Playing Indicator -->
      <div
        v-if="currentStation && isPlaying"
        class="mb-6 rounded-xl bg-emerald-500/20 p-4 backdrop-blur-sm"
      >
        <div class="flex items-center justify-center gap-3">
          <span class="relative flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <span class="text-emerald-100 font-medium">Now Playing: {{ currentStation.name }}</span>
        </div>
      </div>

      <!-- Station Cards -->
      <div class="flex flex-col gap-4">
        <div
          v-for="station in stations"
          :key="station.id"
          class="rounded-2xl bg-slate-800/50 p-4 backdrop-blur-sm transition-all duration-200 sm:p-5"
          :class="{
            'ring-2 ring-emerald-500 bg-slate-700/50': isCurrentStation(station),
            'hover:bg-slate-700/50 active:scale-[0.98]': !isCurrentStation(station)
          }"
        >
          <div class="flex items-center justify-between gap-4">
            <!-- Station Info -->
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-semibold text-white truncate sm:text-xl">
                {{ station.name }}
              </h2>
              <p class="mt-1 text-sm text-slate-400">
                {{ isHttpsUrl(station.url) ? 'Stream' : 'External Link' }}
              </p>
            </div>

            <!-- Play/Pause Button -->
            <button
              @click="playStation(station)"
              class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95 sm:h-16 sm:w-16"
              :class="{
                'bg-emerald-500 hover:bg-emerald-400 text-white': isCurrentlyPlaying(station),
                'bg-slate-600 hover:bg-slate-500 text-white': !isCurrentlyPlaying(station)
              }"
              :aria-label="isCurrentlyPlaying(station) ? 'Pause ' + station.name : 'Play ' + station.name"
            >
              <!-- Pause Icon -->
              <svg
                v-if="isCurrentlyPlaying(station)"
                class="h-6 w-6 sm:h-7 sm:w-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <!-- Play Icon -->
              <svg
                v-else-if="isHttpsUrl(station.url)"
                class="h-6 w-6 sm:h-7 sm:w-7 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <!-- External Link Icon -->
              <svg
                v-else
                class="h-6 w-6 sm:h-7 sm:w-7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          <!-- Playing Animation -->
          <div
            v-if="isCurrentlyPlaying(station)"
            class="mt-4 flex items-center justify-center gap-1"
          >
            <span
              v-for="n in 5"
              :key="n"
              class="w-1 bg-emerald-500 rounded-full animate-pulse"
              :style="{
                height: `${12 + Math.random() * 12}px`,
                animationDelay: `${n * 0.1}s`
              }"
            ></span>
          </div>
        </div>
      </div>

      <!-- Stop Button -->
      <div v-if="currentStation" class="mt-6 flex justify-center">
        <button
          @click="stopAudio"
          class="flex h-12 items-center gap-2 rounded-full bg-red-500/20 px-6 text-red-400 transition-all duration-200 hover:bg-red-500/30 active:scale-95"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
          <span class="font-medium">Stop</span>
        </button>
      </div>
    </div>
  </div>
</template>
