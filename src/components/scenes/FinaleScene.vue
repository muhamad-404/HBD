<template>
  <section class="finale-scene" aria-label="Finale">
    <FinaleBackground ref="backgroundRef" />
    <StarField ref="starFieldRef" />
    <SparkleField />
    <div ref="flowersEl">
      <FloatingFlowers />
    </div>

    <div ref="contentEl" class="finale-scene__content">
      <!-- Phase A: entrance -->
      <template v-if="phase === 'entrance'">
        <p ref="openingEl" class="finale-scene__opening">
          Eighteen years. One beautiful beginning.
        </p>
        <button
          ref="ctaEl"
          class="finale-scene__cta"
          type="button"
          @click="handleCta"
        >
          One last thing...
        </button>
      </template>

      <!-- Phase B–D: message + settle -->
      <template v-else>
        <div ref="stanzasEl" class="finale-scene__stanzas">
          <p
            v-for="(stanza, i) in stanzas"
            :key="i"
            :ref="(el) => setStanzaRef(el, i)"
            class="finale-scene__stanza"
          >
            {{ stanza }}
          </p>
        </div>

        <p
          v-if="showClosing"
          ref="closingEl"
          class="finale-scene__closing"
        >
          May your path hold happiness, growth, peace, and moments worth keeping.
        </p>

        <p
          v-if="showFinal"
          ref="finalEl"
          class="finale-scene__final"
        >
          Happy 18th Birthday, Mimi.
          <svg class="finale-scene__heart" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 14s-5.5-3.5-5.5-7A3 3 0 018 5a3 3 0 015.5 2c0 3.5-5.5 7-5.5 7z"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
        </p>

        <ReplayButton
          v-if="showReplay"
          ref="replayRef"
          class="finale-scene__replay"
          @replay="handleReplay"
        />
      </template>
    </div>

    <ParticleBurst ref="burstRef" />
    <ConfettiEffect ref="confettiRef" />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import FinaleBackground from '../effects/FinaleBackground.vue'
import StarField from '../effects/StarField.vue'
import SparkleField from '../effects/SparkleField.vue'
import FloatingFlowers from '../effects/FloatingFlowers.vue'
import ParticleBurst from '../effects/ParticleBurst.vue'
import ConfettiEffect from '../effects/ConfettiEffect.vue'
import ReplayButton from '../ui/ReplayButton.vue'
import { useAudioController } from '../../composables/useAudioController.js'

const emit = defineEmits(['replay'])

const { fadeIn, fadeOut, swell, hasAudioFile } = useAudioController()

const backgroundRef = ref(null)
const starFieldRef = ref(null)
const flowersEl = ref(null)
const contentEl = ref(null)
const openingEl = ref(null)
const ctaEl = ref(null)
const stanzasEl = ref(null)
const stanzaRefs = ref([])
const closingEl = ref(null)
const finalEl = ref(null)
const replayRef = ref(null)
const burstRef = ref(null)
const confettiRef = ref(null)

const phase = ref('entrance')
const showClosing = ref(false)
const showFinal = ref(false)
const showReplay = ref(false)

const stanzas = [
  'Some moments are temporary.',
  'Some become memories.',
  'And some memories remain quietly beautiful.',
]

let entranceTimeline = null
let messageTimeline = null

function setStanzaRef(el, index) {
  if (el) stanzaRefs.value[index] = el
}

onMounted(async () => {
  await nextTick()

  if (hasAudioFile.value) {
    fadeIn(1.5)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bg = backgroundRef.value

  if (reducedMotion) {
    gsap.set(bg?.veilEl, { opacity: 0 })
    gsap.set([openingEl.value, ctaEl.value], { opacity: 1 })
    return
  }

  gsap.set([openingEl.value, ctaEl.value], { opacity: 0, y: 20 })
  gsap.set(ctaEl.value, { opacity: 0 })

  const starEls = starFieldRef.value?.starRefs?.filter(Boolean) || []
  gsap.set(starEls, { opacity: 0 })

  entranceTimeline = gsap.timeline()

  entranceTimeline.to(bg?.veilEl, {
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out',
  })

  entranceTimeline.to(
    starEls,
    { opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power2.out' },
    0.3,
  )

  entranceTimeline.to(
    openingEl.value,
    { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
    0.8,
  )

  entranceTimeline.to(
    ctaEl.value,
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    1.4,
  )
})

onUnmounted(() => {
  entranceTimeline?.kill()
  messageTimeline?.kill()
})

async function handleCta() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reducedMotion) {
    await gsap.to([openingEl.value, ctaEl.value], {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: 'power2.in',
    })
  }

  phase.value = 'message'
  await nextTick()

  if (reducedMotion) {
    showClosing.value = true
    showFinal.value = true
    showReplay.value = true
    return
  }

  gsap.set(stanzaRefs.value, { opacity: 0, y: 16 })

  messageTimeline = gsap.timeline()

  stanzaRefs.value.forEach((el, i) => {
    messageTimeline.to(
      el,
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      i * 1.2,
    )
  })

  const stanzaEnd = stanzas.length * 1.2 + 0.5

  messageTimeline.add(() => {
    showClosing.value = true
  }, stanzaEnd)

  messageTimeline.add(async () => {
    await nextTick()
    if (closingEl.value) {
      gsap.fromTo(
        closingEl.value,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      )
    }
  }, stanzaEnd + 0.1)

  messageTimeline.add(() => {
    showFinal.value = true
  }, stanzaEnd + 1.2)

  messageTimeline.add(async () => {
    await nextTick()
    if (finalEl.value) {
      gsap.fromTo(
        finalEl.value,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          textShadow: '0 0 24px rgba(232, 160, 180, 0.5), 0 0 48px rgba(245, 208, 169, 0.3)',
        },
      )
    }

    playCelebration()
  }, stanzaEnd + 1.3)
}

function playCelebration() {
  const bg = backgroundRef.value
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    showReplay.value = true
    return
  }

  confettiRef.value?.fireGentle()
  burstRef.value?.burst()

  if (bg?.glowEl) {
    gsap.to(bg.glowEl, {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    })
  }

  if (flowersEl.value) {
    gsap.to(flowersEl.value, {
      y: -20,
      duration: 2,
      ease: 'sine.out',
    })
  }

  if (hasAudioFile.value) {
    swell(1.15, 2)
  }

  gsap.delayedCall(3, async () => {
    if (finalEl.value) {
      gsap.to(finalEl.value, {
        textShadow: '0 0 16px rgba(232, 160, 180, 0.35)',
        duration: 1.5,
        ease: 'sine.inOut',
      })
    }

    showReplay.value = true
    await nextTick()

    if (replayRef.value?.rootEl) {
      gsap.fromTo(
        replayRef.value.rootEl,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      )
    }
  })
}

function handleReplay() {
  fadeOut(1)
  setTimeout(() => emit('replay'), 800)
}
</script>

<style scoped>
.finale-scene {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
}

.finale-scene__content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--space-md);
  padding-top: calc(var(--space-xl) + var(--safe-top));
  padding-bottom: calc(var(--space-xl) + var(--safe-bottom));
  text-align: center;
  gap: var(--space-lg);
}

.finale-scene__opening {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 4.5vw, 1.4rem);
  font-weight: 400;
  font-style: italic;
  color: var(--color-text-soft);
  line-height: 1.5;
  max-width: 20rem;
}

.finale-scene__cta {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.5);
  border: 1.5px solid var(--color-rose);
  border-radius: 999px;
  padding: 0.875rem 2rem;
  min-height: 48px;
  min-width: 180px;
  cursor: pointer;
  touch-action: manipulation;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(232, 160, 180, 0.15);
  transition: transform 0.2s var(--ease-soft);
}

.finale-scene__cta:active {
  transform: scale(0.97);
}

.finale-scene__stanzas {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 22rem;
}

.finale-scene__stanza {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 4.5vw, 1.35rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.55;
  color: var(--color-text-primary);
}

.finale-scene__closing {
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 3.5vw, 1rem);
  font-weight: 400;
  line-height: 1.65;
  color: var(--color-text-soft);
  max-width: 22rem;
  margin-top: var(--space-sm);
}

.finale-scene__final {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 7vw, 2.5rem);
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-text-primary);
  margin-top: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.finale-scene__heart {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-rose);
  vertical-align: middle;
}

.finale-scene__replay {
  margin-top: auto;
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .finale-scene__cta:hover {
    box-shadow: 0 4px 20px rgba(232, 160, 180, 0.25);
  }
}
</style>
