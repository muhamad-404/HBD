<template>
  <button
    ref="rootEl"
    class="replay-btn"
    type="button"
    @click="emit('replay')"
  >
    Experience it again
  </button>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['replay'])
const rootEl = ref(null)

defineExpose({ rootEl })
</script>

<style scoped>
.replay-btn {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-soft);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(232, 160, 180, 0.35);
  border-radius: 999px;
  padding: 0.75rem 1.75rem;
  min-height: 48px;
  cursor: pointer;
  touch-action: manipulation;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  letter-spacing: 0.03em;
  transition: transform 0.2s var(--ease-soft), box-shadow 0.2s var(--ease-soft);
}

.replay-btn:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .replay-btn:hover {
    box-shadow: 0 2px 16px rgba(232, 160, 180, 0.2);
    color: var(--color-text-primary);
  }
}
</style>
