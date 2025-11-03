<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { Slider } from '~/components/ui/slider'
import useAudioState from './useAudioState'
import { createInstanceId, formatTime, triggerDownload } from './utils'

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  downloadable: false,
  autoPlay: false,
})

const emits = defineEmits<Emits>()

const AUDIO_DEFAULT_ID_PREFIX = 'audio-player'

interface Props {
  src: string
  id?: string
  variant?: 'default' | 'compact'
  downloadable?: boolean
  autoPlay?: boolean
  class?: string
  containerClass?: string
  controlsClass?: string
  timelineClass?: string
}

interface Emits {
  'update:playing': [value: boolean]
  'play': []
  'pause': []
  'ended': []
  'error': [error: Error | string]
}

// State refs
const isLoading = ref(true)
const playing = ref(false)
const currentTime = ref('0:00')
const totalTime = ref('0:00')
const playingIndex = ref<number | null>(null)
const duration = ref<number>(0)
const timelineValue = ref<number>(0)
const invalidAudio = ref<boolean>(false)
const downloadLoading = ref<boolean>(false)

// DOM refs
const audioFile = ref<HTMLAudioElement | null>(null)
const timeline = ref<HTMLInputElement | null>(null)

// Computed values
const id = computed(() => props.id || createInstanceId(AUDIO_DEFAULT_ID_PREFIX))
const { currentId, setCurrent } = useAudioState()

// Check if we're in client-side environment
const isClient = typeof window !== 'undefined' && typeof window.Audio !== 'undefined'

function togglePlay() {
  const audio = audioFile.value
  if (!audio)
    return

  if (audio.paused) {
    audio.play()
    playingIndex.value = 0
    playing.value = true
    emits('play')
    emits('update:playing', true)
    setCurrent(id.value)
  }
  else {
    audio.pause()
    playing.value = false
    emits('pause')
    emits('update:playing', false)
  }
}

function updateTimeline(value: number[] | undefined) {
  if (!audioFile.value || !value || !value.length)
    return

  const newValue = value[0] || 0
  timelineValue.value = newValue
  audioFile.value.currentTime = newValue
}

function progressUpdate() {
  const audio = audioFile.value
  if (!timeline.value || !audio) {
    audio?.pause()
    return
  }

  currentTime.value = formatTime(audio.currentTime)
  timelineValue.value = audio.currentTime
}

function setAudioEventListeners() {
  const audio = audioFile.value
  if (!audio)
    return

  audio.addEventListener('loadedmetadata', () => {
    totalTime.value = formatTime(audio.duration)
    duration.value = audio.duration
    isLoading.value = false
    invalidAudio.value = false
  })

  audio.addEventListener('timeupdate', progressUpdate)

  audio.addEventListener('ended', () => {
    if (audio)
      audio.currentTime = 0
    playing.value = false
    emits('ended')
    emits('update:playing', false)
  })

  audio.addEventListener('error', () => {
    invalidAudio.value = true
    emits('error', 'Failed to load audio')
  })

  // Add canplay event listener to ensure audio is ready
  audio.addEventListener('canplay', () => {
    isLoading.value = false
  })
}

function detachEvents(audio: HTMLAudioElement) {
  audio.removeEventListener('loadedmetadata', () => {})
  audio.removeEventListener('timeupdate', progressUpdate)
  audio.removeEventListener('ended', () => {})
  audio.removeEventListener('error', () => {})
  audio.removeEventListener('canplay', () => {})
}

async function onDownload() {
  if (!props.src)
    return
  try {
    downloadLoading.value = true
    await triggerDownload(props.src)
  }
  catch (err) {
    emits('error', err instanceof Error ? err : String(err))
  }
  finally {
    downloadLoading.value = false
  }
}

onMounted(async () => {
  if (!isClient)
    return

  // Initialize audio directly
  if (props.src) {
    audioFile.value = new window.Audio(props.src)
    setAudioEventListeners()
    await nextTick()

    if (props.autoPlay)
      // Add a small delay to ensure the audio is ready
      setTimeout(() => togglePlay(), 500)
  }
})

onBeforeUnmount(() => {
  const audio = audioFile.value
  if (audio) {
    detachEvents(audio)
    audio.pause()
  }
})

// Pause this player if another instance becomes current
watch(currentId, (newId) => {
  if (newId && newId !== id.value && playing.value) {
    const audio = audioFile.value
    if (!audio)
      return

    audio.pause()
    playing.value = false
    emits('pause')
    emits('update:playing', false)
  }
})

// Reset when src changes
watch(() => props.src, () => {
  if (!isClient)
    return

  // Reset player state
  playing.value = false
  timelineValue.value = 0
  isLoading.value = true
  invalidAudio.value = false

  // Re-initialize audio with new source
  if (props.src) {
    audioFile.value = new window.Audio(props.src)
    setAudioEventListeners()
  }
}, { immediate: true })
</script>

<template>
  <div v-if="invalidAudio" class="bg-white rounded-full flex items-center px-2 w-fit" :class="{ 'px-0': props.variant === 'compact' }">
    <button class="bg-blue-normal size-7 flex items-center justify-center rounded-full" @click="togglePlay">
      <Icon name="subway:file-6" color="white" size="14" />
    </button>
    <p v-show="props.variant !== 'compact'" class="text-sm text-gray-500 my-3 text-center px-2">
      Audio is not available
    </p>
  </div>

  <div
    v-else
    :id="id"
    :class="cn(
      'audio audio-player h-[48px] pl-2.5 pr-3.5 w-full md:w-[240px]',
      props.variant === 'default' && props.downloadable && 'md:w-[251px]',
      props.variant === 'compact' && 'w-fit md:w-fit h-fit py-1 px-1',
      props.containerClass,
    )"
  >
    <div :class="cn('controls flex items-center gap-x-1', props.controlsClass)">
      <button
        type="button"
        class="bg-blue-normal size-7 flex items-center justify-center rounded-full shrink-0 grow-0 basis-auto"
        :class="{ 'cursor-not-allowed': isLoading }"
        data-cy="play-pause-btn"
        @click="togglePlay"
      >
        <Icon v-if="isLoading" name="line-md:loading-twotone-loop" color="white" size="16" />
        <Icon v-else :name="playing ? 'ph:pause-fill' : 'ph:play-fill'" color="white" size="14" />
      </button>

      <div v-show="props.variant === 'default'" class="flex items-center w-full">
        <span class="current-time">{{ currentTime }}</span>
        <div class="mx-1.5 flex-grow w-full">
          <Slider
            ref="timeline"
            :class="cn('w-full audio-timeline', props.timelineClass)"
            :max="duration"
            :model-value="[timelineValue]"
            @update:model-value="updateTimeline"
          />
        </div>
        <span class="total-time">{{ totalTime }}</span>
      </div>
    </div>
    <!-- Integrated DownloadButton -->
    <button
      v-if="props.downloadable"
      class="pl-2 cursor-pointer hover:opacity-70 flex items-center"
      data-cy="download-audio"
      @click="onDownload"
    >
      <Icon :name="downloadLoading ? 'line-md:downloading-loop' : 'lineicons:download-circle-1'" size="25" class="text-blue-normal" />
    </button>
  </div>
</template>

<style scoped>
.audio-timeline :deep(.bg-muted) {
  background-color: #D8D8D8;
  height: 4px;
}

.audio-timeline :deep(.bg-primary) {
  background-color: #194B89;
  height: 4px;
}

.audio-timeline :deep([data-slot="slider-thumb"]) {
  width: 10px;
  height: 10px;
  background-color: #194B89;
  border-color: #194B89;
}

.audio.audio-player {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, .07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 24px;
  user-select: none;
  -webkit-user-select: none;
  background-color: #F2F3F5;
}

.controls {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  line-height: 12px;
  color: #55606E;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
}

.current-time,
.total-time {
  color: #55606E;
}
</style>
