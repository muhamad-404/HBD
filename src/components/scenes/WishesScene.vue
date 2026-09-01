<template>
  <section class="wishes-scene" aria-label="Birthday wishes">
    <BirthdayBackground ref="backgroundRef" />
    <SparkleField />
    <FloatingFlowers />

    <div ref="contentEl" class="wishes-scene__content">
      <header class="wishes-scene__header">
        <p ref="titleEl" class="wishes-scene__title">Wishes for you</p>
        <p ref="subtitleEl" class="wishes-scene__subtitle">
          Tap each one to open a little message
        </p>
      </header>

      <div ref="fieldEl" class="wishes-scene__field">
        <WishOrb
          v-for="(wish, index) in wishes"
          :key="wish.id"
          :ref="(el) => setOrbRef(el, index)"
          :wish="wish"
          :delay="index * 0.4"
          :is-opened="openedIds.has(wish.id)"
          :is-active="activeWish?.id === wish.id"
          @select="handleSelect"
        />
      </div>

      <p
        v-if="openedCount > 0"
        ref="progressEl"
        class="wishes-scene__progress"
      >
        {{ openedCount }} of {{ wishes.length }} wishes opened
      </p>

      <button
        v-if="allOpened"
        ref="continueEl"
        class="wishes-scene__continue"
        type="button"
        @click="emit('complete')"
      >
        One last thing...
      </button>
    </div>

    <WishReveal :wish="activeWish" @close="closeReveal" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import BirthdayBackground from '../effects/BirthdayBackground.vue'
import SparkleField from '../effects/SparkleField.vue'
import FloatingFlowers from '../effects/FloatingFlowers.vue'
import WishOrb from '../ui/WishOrb.vue'
import WishReveal from '../ui/WishReveal.vue'
import { wishes } from '../../data/wishes.js'

const emit = defineEmits(['complete'])

const backgroundRef = ref(null)
const contentEl = ref(null)
const titleEl = ref(null)
const subtitleEl = ref(null)
const fieldEl = ref(null)
const progressEl = ref(null)
const orbRefs = ref([])

const activeWish = ref(null)
const openedIds = ref(new Set())

const openedCount = computed(() => openedIds.value.size)
const allOpened = computed(() => openedCount.value === wishes.length)

let entranceTimeline = null

function setOrbRef(el, index) {
  if (el) orbRefs.value[index] = el
}

onMounted(async () => {
  await nextTick()

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    gsap.set([titleEl.value, subtitleEl.value], { opacity: 1 })
    return
  }

  gsap.set([titleEl.value, subtitleEl.value], { opacity: 0, y: 16 })

  const orbEls = orbRefs.value.map((o) => o?.rootEl).filter(Boolean)
  gsap.set(orbEls, { opacity: 0, scale: 0.5 })

  entranceTimeline = gsap.timeline({ delay: 0.2 })

  entranceTimeline.to(titleEl.value, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
  })

  entranceTimeline.to(
    subtitleEl.value,
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    '-=0.4',
  )

  entranceTimeline.to(
    orbEls,
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.5)',
      stagger: 0.08,
    },
    '-=0.2',
  )
})

onUnmounted(() => {
  entranceTimeline?.kill()
})

function handleSelect(wish) {
  activeWish.value = wish
  openedIds.value = new Set([...openedIds.value, wish.id])
}

function closeReveal() {
  activeWish.value = null
}
</script>

<style scoped>
.wishes-scene {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
}

.wishes-scene__content {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: var(--shell-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  padding-top: calc(var(--space-xl) + var(--safe-top));
  padding-bottom: calc(var(--space-lg) + var(--safe-bottom));
}

.wishes-scene__header {
  text-align: center;
  padding: 0 var(--space-md);
  margin-bottom: var(--space-sm);
}

.wishes-scene__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 7vw, 2.25rem);
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.wishes-scene__subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 3.5vw, 0.95rem);
  color: var(--color-text-soft);
  margin-top: var(--space-xs);
}

.wishes-scene__field {
  position: relative;
  width: 100%;
  height: calc(100dvh - 180px - var(--safe-top) - var(--safe-bottom));
  min-height: 380px;
  max-height: 600px;
}

.wishes-scene__progress {
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--color-rose);
  opacity: 0.7;
  padding: var(--space-sm);
  letter-spacing: 0.03em;
}

.wishes-scene__continue {
  display: block;
  margin: var(--space-sm) auto 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid var(--color-rose);
  border-radius: 999px;
  padding: 0.75rem 1.75rem;
  min-height: 48px;
  cursor: pointer;
  touch-action: manipulation;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: continue-fade-in 0.6s var(--ease-soft) both;
}

@keyframes continue-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
