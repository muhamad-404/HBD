<template>
  <div class="sparkle-field" aria-hidden="true">
    <span
      v-for="sparkle in sparkles"
      :key="sparkle.id"
      class="sparkle-field__dot"
      :class="`sparkle-field__dot--${sparkle.type}`"
      :style="{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
        animationDelay: `${sparkle.delay}s`,
        animationDuration: `${sparkle.duration}s`,
      }"
    />
  </div>
</template>

<script setup>
const sparkles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 5 + Math.random() * 90,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 4,
  type: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'dot' : 'glow',
}))
</script>

<style scoped>
.sparkle-field {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.sparkle-field__dot {
  position: absolute;
  opacity: 0;
  animation: sparkle-drift ease-in-out infinite;
}

.sparkle-field__dot--dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 4px rgba(245, 208, 169, 0.6);
}

.sparkle-field__dot--star {
  width: 4px;
  height: 4px;
  background: transparent;
  box-shadow: none;
}

.sparkle-field__dot--star::before,
.sparkle-field__dot--star::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 1px;
}

.sparkle-field__dot--star::before {
  width: 4px;
  height: 1px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.sparkle-field__dot--star::after {
  width: 1px;
  height: 4px;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.sparkle-field__dot--glow {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 208, 169, 0.8) 0%,
    transparent 70%
  );
}

@keyframes sparkle-drift {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  20% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
    transform: translateY(-12px) scale(1);
  }
  80% {
    opacity: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sparkle-field__dot {
    animation: none;
    opacity: 0.4;
  }
}
</style>
