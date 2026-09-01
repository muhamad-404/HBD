import { ref } from 'vue'
import gsap from 'gsap'

const audio = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(0.4)
const hasAudioFile = ref(false)
const isInitialized = ref(false)

let fadeTween = null

export function useAudioController() {
  function init(src) {
    if (isInitialized.value) return

    const el = new Audio()
    el.loop = true
    el.volume = 0
    el.preload = 'auto'

    el.addEventListener('canplaythrough', () => {
      hasAudioFile.value = true
    })

    el.addEventListener('error', () => {
      hasAudioFile.value = false
      isInitialized.value = true
    })

    el.addEventListener('play', () => {
      isPlaying.value = true
    })

    el.addEventListener('pause', () => {
      isPlaying.value = false
    })

    el.src = src
    audio.value = el
    isInitialized.value = true

    el.load()
  }

  async function play() {
    if (!hasAudioFile.value || !audio.value) return

    try {
      await audio.value.play()
      isPlaying.value = true
    } catch {
      isPlaying.value = false
    }
  }

  function pause() {
    if (!audio.value) return
    audio.value.pause()
    isPlaying.value = false
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function toggleMute() {
    if (!audio.value) return
    isMuted.value = !isMuted.value
    audio.value.muted = isMuted.value
  }

  function setVolume(value) {
    if (!audio.value) return
    const clamped = Math.max(0, Math.min(1, value))
    volume.value = clamped
    audio.value.volume = clamped
    if (clamped > 0 && isMuted.value) {
      isMuted.value = false
      audio.value.muted = false
    }
  }

  function fadeIn(duration = 2) {
    if (!hasAudioFile.value || !audio.value) return

    fadeTween?.kill()
    fadeTween = gsap.to(audio.value, {
      volume: volume.value,
      duration,
      ease: 'power2.out',
    })
  }

  function fadeOut(duration = 1) {
    if (!audio.value) return

    fadeTween?.kill()
    fadeTween = gsap.to(audio.value, {
      volume: 0,
      duration,
      ease: 'power2.in',
      onComplete: () => pause(),
    })
  }

  function swell(factor = 1.15, duration = 1) {
    if (!hasAudioFile.value || !audio.value) return

    const target = volume.value
    fadeTween?.kill()
    fadeTween = gsap
      .timeline()
      .to(audio.value, { volume: target * factor, duration: duration / 2, ease: 'sine.inOut' })
      .to(audio.value, { volume: target, duration: duration / 2, ease: 'sine.inOut' })
  }

  return {
    isPlaying,
    isMuted,
    volume,
    hasAudioFile,
    init,
    play,
    pause,
    togglePlay,
    toggleMute,
    setVolume,
    fadeIn,
    fadeOut,
    swell,
  }
}
