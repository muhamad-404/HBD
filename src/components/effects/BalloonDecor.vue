<template>
  <div ref="rootEl" class="balloon-decor" aria-hidden="true">
    <div
      v-for="balloon in balloons"
      :key="balloon.id"
      ref="balloonRefs"
      class="balloon-decor__item"
      :style="{ left: balloon.x, bottom: balloon.bottom }"
    >
      <svg viewBox="0 0 40 80" class="balloon-decor__svg">
        <line
          x1="20"
          y1="42"
          x2="20"
          y2="78"
          :stroke="balloon.stringColor"
          stroke-width="0.8"
          opacity="0.5"
        />
        <ellipse
          cx="20"
          cy="22"
          rx="16"
          ry="20"
          :fill="balloon.color"
          opacity="0.75"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="5"
          ry="7"
          fill="white"
          opacity="0.25"
        />
        <polygon
          points="20,40 16,44 24,44"
          :fill="balloon.color"
          opacity="0.75"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rootEl = ref(null)
const balloonRefs = ref([])

const balloons = [
  { id: 0, x: '8%', bottom: '12%', color: '#e8a0b4', stringColor: '#d4738f' },
  { id: 1, x: '82%', bottom: '8%', color: '#c9b8e8', stringColor: '#a898c8' },
  { id: 2, x: '88%', bottom: '22%', color: '#fce4d6', stringColor: '#e8a0b4' },
]

defineExpose({
  balloonRefs,
  rootEl,
})
</script>

<style scoped>
.balloon-decor {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.balloon-decor__item {
  position: absolute;
  animation: balloon-sway 6s ease-in-out infinite;
}

.balloon-decor__item:nth-child(2) {
  animation-delay: 1s;
}

.balloon-decor__item:nth-child(3) {
  animation-delay: 2s;
}

.balloon-decor__svg {
  width: 36px;
  height: 72px;
}

@keyframes balloon-sway {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .balloon-decor__item {
    animation: none;
  }
}
</style>
