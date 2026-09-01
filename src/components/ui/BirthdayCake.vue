<template>
  <div ref="rootEl" class="birthday-cake">
    <svg viewBox="0 0 200 160" class="birthday-cake__svg" aria-hidden="true">
      <defs>
        <linearGradient id="tierBottom" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fce4d6" />
          <stop offset="100%" stop-color="#e8a0b4" />
        </linearGradient>
        <linearGradient id="tierTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff9f5" />
          <stop offset="100%" stop-color="#f0d4e4" />
        </linearGradient>
        <linearGradient id="frosting" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fff" />
          <stop offset="100%" stop-color="#f8e8ee" />
        </linearGradient>
        <filter id="cakeShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#d4738f" flood-opacity="0.2" />
        </filter>
      </defs>

      <!-- Plate -->
      <ellipse cx="100" cy="148" rx="70" ry="8" fill="#e8dff5" opacity="0.5" />

      <!-- Bottom tier -->
      <g filter="url(#cakeShadow)">
        <rect x="40" y="95" width="120" height="48" rx="8" fill="url(#tierBottom)" />
        <rect x="40" y="95" width="120" height="10" rx="4" fill="url(#frosting)" opacity="0.8" />
      </g>

      <!-- Top tier -->
      <rect x="55" y="62" width="90" height="36" rx="6" fill="url(#tierTop)" />
      <rect x="55" y="62" width="90" height="8" rx="4" fill="url(#frosting)" opacity="0.8" />

      <!-- Age number -->
      <text
        x="100"
        y="118"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="22"
        font-weight="500"
        fill="#d4738f"
        opacity="0.85"
      >
        18
      </text>

      <!-- Candles -->
      <g v-for="(candle, i) in candles" :key="i">
        <rect
          :x="candle.x - 2"
          y="38"
          width="4"
          height="26"
          rx="1"
          :fill="candle.color"
        />
        <g :ref="(el) => setFlameRef(el, i)" class="birthday-cake__flame">
          <ellipse
            :cx="candle.x"
            cy="34"
            rx="3.5"
            ry="5"
            fill="#f5d0a9"
            opacity="0.9"
          />
          <ellipse
            :cx="candle.x"
            cy="33"
            rx="2"
            ry="3"
            fill="#fff9f5"
            opacity="0.7"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const rootEl = ref(null)
const flameEls = ref([])

const candles = [
  { x: 72, color: '#f5d0a9' },
  { x: 86, color: '#e8dff5' },
  { x: 100, color: '#f5d0a9' },
  { x: 114, color: '#e8dff5' },
  { x: 128, color: '#f5d0a9' },
]

let flickerTimeline = null

function setFlameRef(el, index) {
  if (el) flameEls.value[index] = el
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return

  flickerTimeline = gsap.timeline({ repeat: -1 })
  flameEls.value.forEach((flame, i) => {
    if (!flame) return
    flickerTimeline.to(
      flame,
      {
        scaleY: 1.15,
        scaleX: 0.9,
        opacity: 1,
        duration: 0.3 + i * 0.05,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: '50% 80%',
      },
      i * 0.1,
    )
  })
})

onUnmounted(() => {
  flickerTimeline?.kill()
})

function glowFlames() {
  return gsap.to(flameEls.value, {
    scale: 1.5,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
    transformOrigin: '50% 80%',
  })
}

function extinguish() {
  flickerTimeline?.kill()
  return gsap.to(flameEls.value, {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    transformOrigin: '50% 80%',
  })
}

defineExpose({
  rootEl,
  flameEls,
  glowFlames,
  extinguish,
})
</script>

<style scoped>
.birthday-cake {
  width: min(220px, 60vw);
  margin: 0 auto;
}

.birthday-cake__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
</style>
