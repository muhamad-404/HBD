<template>
  <div ref="rootEl" class="star-field" aria-hidden="true">
    <span
      v-for="star in stars"
      :key="star.id"
      :ref="(el) => setStarRef(el, star.id)"
      class="star-field__star"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        animationDelay: `${star.delay}s`,
        animationDuration: `${star.duration}s`,
        width: `${star.size}px`,
        height: `${star.size}px`,
      }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rootEl = ref(null)
const starRefs = ref([])

const stars = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
  size: 1.5 + Math.random() * 2,
}))

function setStarRef(el, id) {
  if (el) starRefs.value[id] = el
}

defineExpose({ rootEl, starRefs })
</script>

<style scoped>
.star-field {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.star-field__star {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 4px rgba(245, 208, 169, 0.4);
  opacity: 0;
  animation: star-twinkle ease-in-out infinite;
}

@keyframes star-twinkle {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.9;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .star-field__star {
    animation: none;
    opacity: 0.5;
  }
}
</style>
