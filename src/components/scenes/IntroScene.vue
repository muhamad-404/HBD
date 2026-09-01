<template>
  <section class="intro-scene" aria-label="Introduction">
    <IntroBackground ref="backgroundRef" />
    <SparkleField />
    <FloatingDecor />

    <div ref="contentEl" class="intro-scene__content">
      <p ref="teaserEl" class="intro-scene__teaser">
        A little something for someone turning 18...
      </p>

      <GiftBox ref="giftRef" class="intro-scene__gift" />

      <button
        ref="ctaEl"
        class="intro-scene__cta"
        type="button"
        :disabled="isOpening"
        @click="handleOpen"
      >
        Open it ✨
      </button>
    </div>

    <ParticleBurst ref="burstRef" />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import IntroBackground from '../effects/IntroBackground.vue'
import SparkleField from '../effects/SparkleField.vue'
import FloatingDecor from '../effects/FloatingDecor.vue'
import ParticleBurst from '../effects/ParticleBurst.vue'
import GiftBox from '../ui/GiftBox.vue'
import { useAudioUnlock } from '../../composables/useAudioUnlock.js'

const emit = defineEmits(['complete'])

const { unlockFromInteraction } = useAudioUnlock()

const backgroundRef = ref(null)
const contentEl = ref(null)
const teaserEl = ref(null)
const giftRef = ref(null)
const ctaEl = ref(null)
const burstRef = ref(null)

const isOpening = ref(false)

let entranceTimeline = null

onMounted(async () => {
  await nextTick()

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const giftEl = giftRef.value?.rootEl

  if (reducedMotion) {
    gsap.set([teaserEl.value, giftEl, ctaEl.value], { opacity: 1 })
    return
  }

  gsap.set([teaserEl.value, giftEl, ctaEl.value], { opacity: 0, y: 20 })

  entranceTimeline = gsap.timeline({ delay: 0.3 })
  entranceTimeline
    .to(teaserEl.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .to(giftEl, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')
    .to(ctaEl.value, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
})

onUnmounted(() => {
  entranceTimeline?.kill()
})

async function handleOpen() {
  if (isOpening.value) return
  isOpening.value = true

  unlockFromInteraction()

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    emit('complete')
    return
  }

  const bg = backgroundRef.value
  const glowEl = bg?.glowEl
  const pulseEl = bg?.pulseEl

  const tl = gsap.timeline()

  tl.to([teaserEl.value, ctaEl.value], {
    opacity: 0,
    y: -12,
    duration: 0.4,
    ease: 'power2.in',
  })

  tl.add(() => giftRef.value?.open(), 0.1)

  tl.add(() => burstRef.value?.burst(), 0.5)

  if (pulseEl) {
    tl.to(pulseEl, {
      opacity: 1,
      scale: 1.2,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.4)
  }

  if (glowEl) {
    tl.to(glowEl, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.3)
  }

  tl.add(() => giftRef.value?.fadeOut(), 1.2)

  tl.to(contentEl.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
  }, 1.6)

  tl.add(() => emit('complete'), 2.1)
}
</script>

<style scoped>
.intro-scene {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.intro-scene__content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-md);
  width: 100%;
  max-width: var(--shell-max-width);
  min-height: 100dvh;
}

.intro-scene__teaser {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 4.5vw, 1.35rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.5;
  color: var(--color-text-soft);
  text-align: center;
  max-width: 20rem;
  letter-spacing: 0.01em;
}

.intro-scene__gift {
  margin: var(--space-sm) 0;
}

.intro-scene__cta {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.6);
  border: 1.5px solid var(--color-rose);
  border-radius: 999px;
  padding: 0.875rem 2rem;
  min-height: 48px;
  min-width: 160px;
  max-width: 280px;
  width: 100%;
  cursor: pointer;
  touch-action: manipulation;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    0 2px 12px rgba(232, 160, 180, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: transform 0.2s var(--ease-soft), box-shadow 0.2s var(--ease-soft);
}

.intro-scene__cta:active:not(:disabled) {
  transform: scale(0.97);
  box-shadow:
    0 1px 6px rgba(232, 160, 180, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.intro-scene__cta:disabled {
  opacity: 0.6;
  cursor: default;
}

@media (hover: hover) and (pointer: fine) {
  .intro-scene__cta:hover:not(:disabled) {
    box-shadow:
      0 4px 20px rgba(232, 160, 180, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}
</style>
