<script setup>
import { onMounted, computed } from 'vue'
import AppShell from './components/ui/AppShell.vue'
import AudioController from './components/audio/AudioController.vue'
import IntroScene from './components/scenes/IntroScene.vue'
import BirthdayScene from './components/scenes/BirthdayScene.vue'
import WishesScene from './components/scenes/WishesScene.vue'
import FinaleScene from './components/scenes/FinaleScene.vue'
import { useSceneFlow } from './composables/useSceneFlow.js'
import { useAudioController } from './composables/useAudioController.js'

const { currentScene, completeIntro, completeBirthday, completeWishes, resetExperience } =
  useSceneFlow()
const { init } = useAudioController()

const immersiveScenes = ['intro', 'birthday', 'wishes', 'finale']
const isImmersive = computed(() => immersiveScenes.includes(currentScene.value))

onMounted(() => {
  init(`${import.meta.env.BASE_URL}audio/background-music.mp3`)
})
</script>

<template>
  <AudioController />

  <AppShell :immersive="isImmersive">
    <Transition name="scene-fade" mode="out-in">
      <IntroScene
        v-if="currentScene === 'intro'"
        @complete="completeIntro"
      />
      <BirthdayScene
        v-else-if="currentScene === 'birthday'"
        @complete="completeBirthday"
      />
      <WishesScene
        v-else-if="currentScene === 'wishes'"
        @complete="completeWishes"
      />
      <FinaleScene
        v-else-if="currentScene === 'finale'"
        @replay="resetExperience"
      />
    </Transition>
  </AppShell>
</template>
