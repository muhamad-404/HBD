<template>
  <div ref="rootEl" class="floating-flowers" aria-hidden="true">
    <div
      v-for="flower in flowers"
      :key="flower.id"
      ref="itemRefs"
      class="floating-flowers__item"
      :style="{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        animationDelay: `${flower.delay}s`,
        color: flower.color,
      }"
    >
      <svg viewBox="0 0 24 24" class="floating-flowers__svg">
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
        <ellipse cx="12" cy="6" rx="4" ry="5" fill="currentColor" opacity="0.4" />
        <ellipse cx="12" cy="18" rx="4" ry="5" fill="currentColor" opacity="0.4" />
        <ellipse cx="6" cy="12" rx="5" ry="4" fill="currentColor" opacity="0.4" />
        <ellipse cx="18" cy="12" rx="5" ry="4" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const rootEl = ref(null)
const itemRefs = ref([])

const flowers = [
  { id: 0, x: 6, y: 20, delay: 0, color: 'var(--color-rose)' },
  { id: 1, x: 90, y: 30, delay: 1.2, color: 'var(--color-lilac)' },
  { id: 2, x: 10, y: 65, delay: 0.6, color: 'var(--color-peach)' },
  { id: 3, x: 88, y: 75, delay: 1.8, color: 'var(--color-rose-deep)' },
  { id: 4, x: 50, y: 8, delay: 2.4, color: 'var(--color-lilac)' },
]

const canParallax = window.matchMedia('(hover: hover) and (pointer: fine)').matches

function onMouseMove(e) {
  if (!canParallax || !rootEl.value) return

  const rect = rootEl.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  itemRefs.value.forEach((el, i) => {
    if (!el) return
    const depth = (i + 1) * 3
    el.style.transform = `translate(${x * depth}px, ${y * depth}px)`
  })
}

onMounted(() => {
  if (canParallax) {
    window.addEventListener('mousemove', onMouseMove)
  }
})

onUnmounted(() => {
  if (canParallax) {
    window.removeEventListener('mousemove', onMouseMove)
  }
})
</script>

<style scoped>
.floating-flowers {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.floating-flowers__item {
  position: absolute;
  animation: flower-float 8s ease-in-out infinite;
  transition: transform 0.3s ease-out;
}

.floating-flowers__svg {
  width: 22px;
  height: 22px;
  opacity: 0.65;
}

.floating-flowers__item:nth-child(2) .floating-flowers__svg,
.floating-flowers__item:nth-child(4) .floating-flowers__svg {
  width: 16px;
  height: 16px;
}

@keyframes flower-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(5deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-flowers__item {
    animation: none;
  }
}
</style>
