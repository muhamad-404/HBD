<template>
  <div ref="rootEl" class="gift-box">
    <svg
      viewBox="0 0 160 180"
      class="gift-box__svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="boxBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8e8ee" />
          <stop offset="50%" stop-color="#e8a0b4" />
          <stop offset="100%" stop-color="#d4738f" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fce4d6" />
          <stop offset="100%" stop-color="#e8a0b4" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fff9f5" />
          <stop offset="100%" stop-color="#f5d0a9" />
        </linearGradient>
        <filter id="giftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#d4738f" flood-opacity="0.25" />
        </filter>
      </defs>

      <!-- Shadow -->
      <ellipse cx="80" cy="168" rx="52" ry="8" fill="#d4738f" opacity="0.15" />

      <!-- Box body -->
      <g ref="bodyEl" filter="url(#giftShadow)">
        <rect
          x="28"
          y="78"
          width="104"
          height="82"
          rx="6"
          fill="url(#boxBodyGrad)"
        />
        <!-- Vertical ribbon on body -->
        <rect x="74" y="78" width="12" height="82" fill="url(#ribbonGrad)" opacity="0.9" />
        <!-- Horizontal ribbon on body -->
        <rect x="28" y="114" width="104" height="10" fill="url(#ribbonGrad)" opacity="0.9" />
      </g>

      <!-- Inner glow (revealed on open) -->
      <g ref="innerGlowEl" opacity="0">
        <rect
          x="36"
          y="86"
          width="88"
          height="66"
          rx="4"
          fill="url(#ribbonGrad)"
          opacity="0.6"
        />
        <circle cx="80" cy="118" r="20" fill="white" opacity="0.5" />
      </g>

      <!-- Lid group -->
      <g ref="lidEl" class="gift-box__lid" style="transform-origin: 80px 78px">
        <rect
          x="24"
          y="52"
          width="112"
          height="28"
          rx="6"
          fill="url(#lidGrad)"
        />
        <!-- Ribbon on lid -->
        <rect x="74" y="52" width="12" height="28" fill="url(#ribbonGrad)" opacity="0.9" />
        <!-- Bow -->
        <g ref="bowEl">
          <ellipse cx="68" cy="48" rx="14" ry="10" fill="url(#ribbonGrad)" opacity="0.95" />
          <ellipse cx="92" cy="48" rx="14" ry="10" fill="url(#ribbonGrad)" opacity="0.95" />
          <circle cx="80" cy="50" r="6" fill="#f5d0a9" />
          <path
            d="M80 56 Q72 68 66 72"
            fill="none"
            stroke="url(#ribbonGrad)"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.8"
          />
          <path
            d="M80 56 Q88 68 94 72"
            fill="none"
            stroke="url(#ribbonGrad)"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.8"
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
const lidEl = ref(null)
const innerGlowEl = ref(null)
const bodyEl = ref(null)
const bowEl = ref(null)

let idleTimeline = null

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion || !rootEl.value) return

  idleTimeline = gsap.timeline({ repeat: -1, yoyo: true })
  idleTimeline.to(rootEl.value, {
    y: -6,
    duration: 2.5,
    ease: 'sine.inOut',
  })
})

onUnmounted(() => {
  idleTimeline?.kill()
})

function open() {
  return new Promise((resolve) => {
    idleTimeline?.kill()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      if (lidEl.value) lidEl.value.style.opacity = '0'
      if (innerGlowEl.value) innerGlowEl.value.setAttribute('opacity', '1')
      resolve()
      return
    }

    const tl = gsap.timeline({ onComplete: resolve })

    tl.to(lidEl.value, {
      rotation: -28,
      y: -40,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      transformOrigin: '50% 100%',
    }, 0)

    tl.to(bowEl.value, {
      y: -8,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 0)

    tl.to(innerGlowEl.value, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.3)

    tl.to(innerGlowEl.value?.querySelector('circle'), {
      attr: { r: 35 },
      opacity: 0.8,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.4)
  })
}

function fadeOut() {
  return gsap.to(rootEl.value, {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
  })
}

defineExpose({ open, fadeOut, rootEl })
</script>

<style scoped>
.gift-box {
  width: min(200px, 55vw);
  margin: 0 auto;
}

.gift-box__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

.gift-box__lid {
  transform-box: fill-box;
  transform-origin: center bottom;
}
</style>
