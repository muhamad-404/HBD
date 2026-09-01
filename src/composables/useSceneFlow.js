import { ref } from 'vue'

const currentScene = ref('intro')

export function useSceneFlow() {
  function completeIntro() {
    currentScene.value = 'birthday'
  }

  function completeBirthday() {
    currentScene.value = 'wishes'
  }

  function completeWishes() {
    currentScene.value = 'finale'
  }

  function resetExperience() {
    currentScene.value = 'intro'
  }

  return {
    currentScene,
    completeIntro,
    completeBirthday,
    completeWishes,
    resetExperience,
  }
}
