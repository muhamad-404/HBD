<template>
  <div
    v-if="hasAudioFile"
    class="audio-controller"
    role="group"
    aria-label="Background music controls"
  >
    <button
      class="audio-controller__btn"
      type="button"
      :aria-label="isPlaying ? 'Pause music' : 'Play music'"
      @click="togglePlay"
    >
      <svg v-if="isPlaying" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
        <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
      </svg>
    </button>

    <button
      class="audio-controller__btn"
      type="button"
      :aria-label="isMuted ? 'Unmute music' : 'Mute music'"
      @click="toggleMute"
    >
      <svg v-if="!isMuted" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M11 5L6 9H3v6h3l5 4V5zm4.5 2.5a4 4 0 010 9"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M16 8.82a6 6 0 010 6.36"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M11 5L6 9H3v6h3l5 4V5z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <line x1="18" y1="8" x2="22" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="22" y1="8" x2="18" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <input
      class="audio-controller__volume"
      type="range"
      min="0"
      max="1"
      step="0.05"
      :value="volume"
      aria-label="Music volume"
      @input="onVolumeChange"
    />
  </div>
</template>

<script setup>
import { useAudioController } from '../../composables/useAudioController.js'

const { isPlaying, isMuted, volume, hasAudioFile, togglePlay, toggleMute, setVolume } =
  useAudioController()

function onVolumeChange(e) {
  setVolume(parseFloat(e.target.value))
}
</script>

<style scoped>
.audio-controller {
  position: fixed;
  top: calc(var(--safe-top) + var(--space-sm));
  right: calc(var(--safe-right) + var(--space-sm));
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(232, 160, 180, 0.35);
  border-radius: 999px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(232, 160, 180, 0.15);
}

.audio-controller__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  touch-action: manipulation;
}

.audio-controller__btn svg {
  width: 18px;
  height: 18px;
}

.audio-controller__btn:active {
  background: rgba(232, 160, 180, 0.15);
}

.audio-controller__volume {
  width: 56px;
  height: 4px;
  accent-color: var(--color-rose);
  cursor: pointer;
  margin: 0 0.25rem;
}

@media (max-width: 360px) {
  .audio-controller__volume {
    width: 40px;
  }
}
</style>
