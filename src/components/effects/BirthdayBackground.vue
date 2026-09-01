<template>
  <div ref="rootEl" class="birthday-bg" aria-hidden="true">
    <div ref="baseEl" class="birthday-bg__layer birthday-bg__layer--base" />
    <div class="birthday-bg__layer birthday-bg__layer--glow" />
    <div ref="pulseEl" class="birthday-bg__layer birthday-bg__layer--pulse" />
    <div ref="flashEl" class="birthday-bg__layer birthday-bg__layer--flash" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rootEl = ref(null)
const baseEl = ref(null)
const pulseEl = ref(null)
const flashEl = ref(null)

defineExpose({
  baseEl,
  pulseEl,
  flashEl,
})
</script>

<style scoped>
.birthday-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.birthday-bg__layer {
  position: absolute;
  inset: 0;
}

.birthday-bg__layer--base {
  background: linear-gradient(
    165deg,
    #fff9f5 0%,
    #fce4ec 25%,
    #f8e8ee 45%,
    #f0d4e4 65%,
    #e8dff5 85%,
    #ede4f8 100%
  );
  background-size: 200% 200%;
  animation: birthday-gradient 20s ease-in-out infinite;
}

.birthday-bg__layer--glow {
  background: radial-gradient(
    ellipse 90% 70% at 50% 35%,
    rgba(255, 255, 255, 0.55) 0%,
    transparent 65%
  );
}

.birthday-bg__layer--pulse {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(232, 160, 180, 0.3) 0%,
    transparent 50%
  );
  opacity: 0;
  transform: scale(0.85);
}

.birthday-bg__layer--flash {
  background: rgba(255, 255, 255, 0.7);
  opacity: 0;
}

@keyframes birthday-gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .birthday-bg__layer--base {
    animation: none;
  }
}
</style>
