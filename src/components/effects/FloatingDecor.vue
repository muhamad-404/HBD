<template>
  <div
    ref="rootEl"
    class="floating-decor"
    aria-hidden="true"
  >
    <div
      v-for="item in decorItems"
      :key="item.id"
      ref="itemRefs"
      class="floating-decor__item"
      :style="{
        left: `${item.x}%`,
        top: `${item.y}%`,
        animationDelay: `${item.delay}s`,
      }"
    >
      <svg viewBox="0 0 24 24" class="floating-decor__svg">
        <template v-if="item.type === 'butterfly'">
          <path
            d="M12 4C10 4 8 6 7 8C6 6 4 4 2 5C1 7 2 9 4 10C2 11 1 13 2 15C4 16 6 14 7 12C8 14 10 16 12 16C14 16 16 14 17 12C18 14 20 16 22 15C23 13 22 11 20 10C22 9 23 7 22 5C20 4 18 6 17 8C16 6 14 4 12 4Z"
            fill="currentColor"
            opacity="0.5"
          />
          <line x1="12" y1="8" x2="12" y2="18" stroke="currentColor" stroke-width="0.8" opacity="0.4" />
        </template>
        <template v-else-if="item.type === 'star'">
          <path
            d="M12 2L13.5 9H21L15 13.5L17 21L12 16.5L7 21L9 13.5L3 9H10.5L12 2Z"
            fill="currentColor"
            opacity="0.45"
          />
        </template>
        <template v-else>
          <path
            d="M4 8C8 4 16 4 20 8C18 12 14 14 12 18C10 14 6 12 4 8Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            opacity="0.4"
          />
        </template>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const rootEl = ref(null)
const itemRefs = ref([])

const decorItems = [
  { id: 0, type: 'butterfly', x: 8, y: 15, delay: 0 },
  { id: 1, type: 'star', x: 88, y: 22, delay: 1.5 },
  { id: 2, type: 'ribbon', x: 12, y: 72, delay: 0.8 },
  { id: 3, type: 'star', x: 85, y: 68, delay: 2.2 },
]

const canParallax = window.matchMedia('(hover: hover) and (pointer: fine)').matches

function onMouseMove(e) {
  if (!canParallax || !rootEl.value) return

  const rect = rootEl.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  itemRefs.value.forEach((el, i) => {
    if (!el) return
    const depth = (i + 1) * 4
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
.floating-decor {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.floating-decor__item {
  position: absolute;
  color: var(--color-rose);
  animation: decor-float 7s ease-in-out infinite;
  transition: transform 0.3s ease-out;
}

.floating-decor__svg {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

.floating-decor__item:nth-child(2) .floating-decor__svg {
  width: 14px;
  height: 14px;
  color: var(--color-gold-sparkle);
}

.floating-decor__item:nth-child(3) .floating-decor__svg {
  width: 18px;
  height: 18px;
  color: var(--color-lilac);
}

@keyframes decor-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-decor__item {
    animation: none;
  }
}
</style>
