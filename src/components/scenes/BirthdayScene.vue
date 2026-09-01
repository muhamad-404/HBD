<template>
  <section class="birthday-scene" aria-label="Birthday celebration">
    <BirthdayBackground ref="backgroundRef" />
    <SparkleField />
    <FloatingFlowers />
    <BalloonDecor ref="balloonRef" />

    <div ref="contentEl" class="birthday-scene__content">
      <header class="birthday-scene__header">
        <p ref="headlineEl" class="birthday-headline">
          Happy 18th Birthday,
        </p>
        <h1 ref="nameEl" class="birthday-name">Maheen</h1>
        <p ref="nicknameEl" class="birthday-nickname">
          A new chapter begins, Mimi.
        </p>
        <p ref="supportEl" class="birthday-scene__support">
          May 18 bring you quiet confidence, beautiful adventures, and dreams
          that slowly come true.
        </p>
      </header>

      <BirthdayCake ref="cakeRef" class="birthday-scene__cake" />

      <button
        v-if="!wishMade"
        ref="ctaEl"
        class="birthday-scene__cta"
        type="button"
        :disabled="isWishing"
        @click="handleWish"
      >
        Make a wish ✨
      </button>

      <div v-else class="birthday-scene__after-wish">
        <p ref="wishMsgEl" class="birthday-scene__wish-msg">
          Your wish is in the stars now.
        </p>
        <button
          ref="continueEl"
          class="birthday-scene__cta birthday-scene__cta--continue"
          type="button"
          @click="emit('complete')"
        >
          Open your wishes ✨
        </button>
      </div>
    </div>

    <ParticleBurst ref="burstRef" />
    <ConfettiEffect ref="confettiRef" />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import BirthdayBackground from '../effects/BirthdayBackground.vue'
import SparkleField from '../effects/SparkleField.vue'
import FloatingFlowers from '../effects/FloatingFlowers.vue'
import BalloonDecor from '../effects/BalloonDecor.vue'
import ParticleBurst from '../effects/ParticleBurst.vue'
import ConfettiEffect from '../effects/ConfettiEffect.vue'
import BirthdayCake from '../ui/BirthdayCake.vue'
import { useAudioUnlock } from '../../composables/useAudioUnlock.js'
import { useAudioController } from '../../composables/useAudioController.js'

const emit = defineEmits(['complete'])

const { hasUnlocked, unlockFromInteraction } = useAudioUnlock()

const backgroundRef = ref(null)
const balloonRef = ref(null)
const contentEl = ref(null)
const headlineEl = ref(null)
const nameEl = ref(null)
const nicknameEl = ref(null)
const supportEl = ref(null)
const cakeRef = ref(null)
const ctaEl = ref(null)
const wishMsgEl = ref(null)
const continueEl = ref(null)
const burstRef = ref(null)
const confettiRef = ref(null)

const isWishing = ref(false)
const wishMade = ref(false)

let entranceTimeline = null

onMounted(async () => {
  await nextTick()

  if (!hasUnlocked.value) {
    unlockFromInteraction()
  } else {
    const { play, fadeIn } = useAudioController()
    play()
    fadeIn(1)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bg = backgroundRef.value
  const cakeEl = cakeRef.value?.rootEl

  if (reducedMotion) {
    gsap.set(
      [headlineEl.value, nameEl.value, nicknameEl.value, supportEl.value, cakeEl, ctaEl.value],
      { opacity: 1 },
    )
    return
  }

  gsap.set(
    [headlineEl.value, nameEl.value, nicknameEl.value, supportEl.value, cakeEl, ctaEl.value],
    { opacity: 0 },
  )
  gsap.set(cakeEl, { y: 40 })
  gsap.set(nameEl.value, { scale: 0.9 })
  gsap.set(bg?.flashEl, { opacity: 0.6 })

  entranceTimeline = gsap.timeline()

  entranceTimeline.to(bg?.flashEl, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  })

  entranceTimeline.to(
    headlineEl.value,
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    0.2,
  )

  entranceTimeline.to(
    nameEl.value,
    { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.2)' },
    0.5,
  )

  entranceTimeline.to(
    [nicknameEl.value, supportEl.value],
    { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 },
    0.8,
  )

  entranceTimeline.to(
    cakeEl,
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    1.0,
  )

  entranceTimeline.to(
    ctaEl.value,
    { opacity: 1, duration: 0.6, ease: 'power2.out' },
    1.3,
  )

  entranceTimeline.to(
    nameEl.value,
    {
      textShadow: '0 0 20px rgba(232, 160, 180, 0.5), 0 0 40px rgba(232, 160, 180, 0.2)',
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    },
    1.5,
  )
})

onUnmounted(() => {
  entranceTimeline?.kill()
})

async function handleWish() {
  if (isWishing.value || wishMade.value) return
  isWishing.value = true

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bg = backgroundRef.value

  if (reducedMotion) {
    wishMade.value = true
    cakeRef.value?.extinguish()
    return
  }

  const tl = gsap.timeline()

  tl.to(ctaEl.value, {
    opacity: 0,
    y: -8,
    duration: 0.3,
    ease: 'power2.in',
  })

  tl.add(() => cakeRef.value?.glowFlames(), 0.1)

  tl.to({}, { duration: 0.8 })

  tl.add(() => cakeRef.value?.extinguish(), 0.9)

  tl.add(() => confettiRef.value?.fire(), 1.0)
  tl.add(() => burstRef.value?.burst(), 1.0)

  if (bg?.pulseEl) {
    tl.to(bg.pulseEl, {
      opacity: 1,
      scale: 1.3,
      duration: 1,
      ease: 'power2.out',
    }, 1.0)
  }

  const balloonEls = balloonRef.value?.balloonRefs
  if (balloonEls?.length) {
    tl.to(balloonEls, {
      y: -30,
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.1,
    }, 1.0)
  }

  tl.to(nameEl.value, {
    textShadow: '0 0 30px rgba(232, 160, 180, 0.7), 0 0 60px rgba(245, 208, 169, 0.4)',
    duration: 0.8,
    ease: 'power2.out',
  }, 1.2)

  tl.add(async () => {
    wishMade.value = true
    await nextTick()
    if (wishMsgEl.value) {
      gsap.fromTo(
        wishMsgEl.value,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      )
    }
    if (continueEl.value) {
      gsap.fromTo(
        continueEl.value,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 },
      )
    }
  }, 1.4)
}
</script>

<style scoped>
.birthday-scene {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.birthday-scene__content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-md);
  padding-top: calc(var(--space-xl) + var(--safe-top));
  padding-bottom: calc(var(--space-lg) + var(--safe-bottom));
  width: 100%;
  max-width: var(--shell-max-width);
  min-height: 100dvh;
  text-align: center;
}

.birthday-scene__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.birthday-scene__support {
  font-family: var(--font-body);
  font-size: clamp(0.875rem, 3.5vw, 1rem);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-soft);
  max-width: 22rem;
  margin-top: var(--space-xs);
}

.birthday-scene__cake {
  margin: var(--space-sm) 0;
}

.birthday-scene__cta {
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

.birthday-scene__cta:active:not(:disabled) {
  transform: scale(0.97);
}

.birthday-scene__cta:disabled {
  opacity: 0.6;
  cursor: default;
}

.birthday-scene__after-wish {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.birthday-scene__cta--continue {
  opacity: 0;
}

.birthday-scene__wish-msg {
  font-family: var(--font-display);
  font-size: clamp(1rem, 4vw, 1.2rem);
  font-style: italic;
  color: var(--color-rose-deep);
  letter-spacing: 0.02em;
}

@media (hover: hover) and (pointer: fine) {
  .birthday-scene__cta:hover:not(:disabled) {
    box-shadow:
      0 4px 20px rgba(232, 160, 180, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}
</style>
