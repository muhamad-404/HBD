import { ref } from 'vue'
import { useAudioController } from './useAudioController.js'

const hasUnlocked = ref(false)

export function useAudioUnlock() {
  const { play, fadeIn } = useAudioController()

  function unlockFromInteraction() {
    if (!hasUnlocked.value) {
      hasUnlocked.value = true
      play()
      fadeIn(2)
    }
  }

  return {
    hasUnlocked,
    unlockFromInteraction,
  }
}
