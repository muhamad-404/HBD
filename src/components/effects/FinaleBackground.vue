<template>
  <div ref="rootEl" class="finale-bg" aria-hidden="true">
    <div class="finale-bg__layer finale-bg__layer--base" />
    <div ref="glowEl" class="finale-bg__layer finale-bg__layer--glow" />
    <div ref="veilEl" class="finale-bg__layer finale-bg__layer--veil" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rootEl = ref(null)
const glowEl = ref(null)
const veilEl = ref(null)

defineExpose({
  rootEl,
  glowEl,
  veilEl,
})
</script>

<style scoped>
.finale-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.finale-bg__layer {
  position: absolute;
  inset: 0;
}

.finale-bg__layer--base {
  background: linear-gradient(
    175deg,
    #ede4f8 0%,
    #e8dff5 20%,
    #f0d4e4 45%,
    #f8e8ee 70%,
    #fce4ec 100%
  );
  background-size: 200% 200%;
  animation: finale-gradient 25s ease-in-out infinite;
}

.finale-bg__layer--glow {
  background: radial-gradient(
    ellipse 70% 55% at 50% 45%,
    rgba(255, 255, 255, 0.35) 0%,
    transparent 65%
  );
  opacity: 0.6;
}

.finale-bg__layer--veil {
  background: rgba(255, 255, 255, 0.75);
  opacity: 1;
}

@keyframes finale-gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .finale-bg__layer--base {
    animation: none;
  }
}
</style>
