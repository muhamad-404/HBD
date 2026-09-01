<template>
  <div ref="rootEl" class="intro-bg" aria-hidden="true">
    <div class="intro-bg__layer intro-bg__layer--base" />
    <div ref="glowEl" class="intro-bg__layer intro-bg__layer--glow" />
    <div ref="pulseEl" class="intro-bg__layer intro-bg__layer--pulse" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rootEl = ref(null)
const glowEl = ref(null)
const pulseEl = ref(null)

defineExpose({
  glowEl,
  pulseEl,
})
</script>

<style scoped>
.intro-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.intro-bg__layer {
  position: absolute;
  inset: 0;
}

.intro-bg__layer--base {
  background: linear-gradient(
    160deg,
    #fff9f5 0%,
    #f8e8ee 35%,
    #f0d4e4 55%,
    #e8dff5 80%,
    #ede4f8 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 18s ease-in-out infinite;
}

.intro-bg__layer--glow {
  background: radial-gradient(
    ellipse 80% 60% at 50% 40%,
    rgba(255, 255, 255, 0.5) 0%,
    transparent 70%
  );
  opacity: 0.8;
}

.intro-bg__layer--pulse {
  background: radial-gradient(
    circle at 50% 55%,
    rgba(232, 160, 180, 0.35) 0%,
    transparent 55%
  );
  opacity: 0;
  transform: scale(0.8);
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro-bg__layer--base {
    animation: none;
  }
}
</style>
