<template>
  <div
    v-if="active"
    ref="rootEl"
    class="particle-burst"
    aria-hidden="true"
  >
    <span
      v-for="particle in particles"
      :key="particle.id"
      ref="particleRefs"
      class="particle-burst__particle"
      :style="{
        left: '50%',
        top: '50%',
      }"
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const active = ref(false)
const rootEl = ref(null)
const particleRefs = ref([])

const particles = Array.from({ length: 20 }, (_, i) => ({ id: i }))

async function burst() {
  active.value = true
  await nextTick()

  const els = particleRefs.value
  if (!els.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    active.value = false
    return
  }

  els.forEach((el, i) => {
    const angle = (i / els.length) * Math.PI * 2
    const distance = 60 + Math.random() * 80
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    gsap.fromTo(
      el,
      { x: 0, y: 0, opacity: 1, scale: 1 },
      {
        x,
        y,
        opacity: 0,
        scale: 0.2,
        duration: 1.2 + Math.random() * 0.4,
        ease: 'power2.out',
        delay: Math.random() * 0.1,
      },
    )
  })

  setTimeout(() => {
    active.value = false
  }, 1600)
}

defineExpose({ burst })
</script>

<style scoped>
.particle-burst {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.particle-burst__particle {
  position: absolute;
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(245, 208, 169, 0.8) 50%,
    transparent 100%
  );
  box-shadow: 0 0 6px rgba(232, 160, 180, 0.6);
}
</style>
