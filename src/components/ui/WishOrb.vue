<template>
  <button
    ref="rootEl"
    class="wish-orb"
    :class="{ 'wish-orb--opened': isOpened }"
    type="button"
    :style="orbStyle"
    :aria-label="`Open wish: ${wish.label}`"
    :disabled="isActive"
    @click="emit('select', wish)"
  >
    <span class="wish-orb__glow" aria-hidden="true" />
    <span class="wish-orb__inner">
      <svg class="wish-orb__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          v-if="wish.icon === 'sparkle'"
          d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          v-else-if="wish.icon === 'moon'"
          d="M20 14.5A8 8 0 1115.5 4 6.5 6.5 0 0020 14.5z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <g v-else-if="wish.icon === 'flower'">
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <ellipse cx="12" cy="7" rx="3" ry="4" fill="currentColor" opacity="0.6" />
          <ellipse cx="12" cy="17" rx="3" ry="4" fill="currentColor" opacity="0.6" />
          <ellipse cx="7" cy="12" rx="4" ry="3" fill="currentColor" opacity="0.6" />
          <ellipse cx="17" cy="12" rx="4" ry="3" fill="currentColor" opacity="0.6" />
        </g>
        <path
          v-else-if="wish.icon === 'leaf'"
          d="M12 21C12 21 5 16 5 10C5 6 8 3 12 3C16 3 19 6 19 10C19 16 12 21 12 21z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          v-else-if="wish.icon === 'star'"
          d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z"
          fill="currentColor"
          opacity="0.75"
        />
        <path
          v-else-if="wish.icon === 'ribbon'"
          d="M4 8c4-4 12-4 16 0-2 4-6 6-8 10-2-4-6-6-8-10z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <g v-else>
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </g>
      </svg>
      <span class="wish-orb__label">{{ wish.label }}</span>
    </span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  wish: { type: Object, required: true },
  isOpened: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  delay: { type: Number, default: 0 },
})

const emit = defineEmits(['select'])

const rootEl = ref(null)

const orbStyle = computed(() => ({
  left: `${props.wish.position.x}%`,
  top: `${props.wish.position.y}%`,
  '--orb-color': props.wish.color,
  animationDelay: `${props.delay}s`,
}))

defineExpose({ rootEl })
</script>

<style scoped>
.wish-orb {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 72px;
  height: 72px;
  min-width: 72px;
  min-height: 72px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
  z-index: 6;
  animation: orb-float 5s ease-in-out infinite;
}

.wish-orb__glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--orb-color) 0%, transparent 70%);
  opacity: 0.35;
  transition: opacity 0.3s var(--ease-soft);
}

.wish-orb__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid rgba(232, 160, 180, 0.4);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(232, 160, 180, 0.15);
  transition: transform 0.25s var(--ease-soft), box-shadow 0.25s var(--ease-soft);
}

.wish-orb__icon {
  width: 20px;
  height: 20px;
  color: var(--orb-color);
}

.wish-orb__label {
  font-family: var(--font-body);
  font-size: 0.55rem;
  font-weight: 500;
  color: var(--color-text-soft);
  text-align: center;
  line-height: 1.1;
  max-width: 58px;
}

.wish-orb:active:not(:disabled) .wish-orb__inner {
  transform: scale(0.94);
}

.wish-orb--opened .wish-orb__inner {
  border-color: var(--orb-color);
  box-shadow: 0 0 16px color-mix(in srgb, var(--orb-color) 40%, transparent);
}

.wish-orb--opened .wish-orb__glow {
  opacity: 0.55;
}

@keyframes orb-float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wish-orb {
    animation: none;
  }
}

@media (hover: hover) and (pointer: fine) {
  .wish-orb:hover:not(:disabled) .wish-orb__inner {
    box-shadow: 0 4px 18px rgba(232, 160, 180, 0.25);
    transform: scale(1.05);
  }
}
</style>
