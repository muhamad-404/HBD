<template>
  <div
    class="app-shell"
    :class="{ 'app-shell--immersive': immersive }"
  >
    <div v-if="!immersive" class="app-shell__backdrop" aria-hidden="true">
      <div class="app-shell__glow" />
    </div>

    <main
      class="app-shell__content"
      :class="{ 'app-shell__content--immersive': immersive }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
defineProps({
  immersive: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  padding:
    var(--safe-top)
    var(--safe-right)
    var(--safe-bottom)
    var(--safe-left);
}

.app-shell--immersive {
  padding: 0;
}

.app-shell__backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: var(--gradient-dreamy);
  pointer-events: none;
}

.app-shell__glow {
  position: absolute;
  inset: 0;
  background: var(--gradient-glow);
}

.app-shell__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--shell-max-width);
  min-height: calc(100dvh - var(--safe-top) - var(--safe-bottom));
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
}

.app-shell__content--immersive {
  max-width: none;
  min-height: 100dvh;
  padding: 0;
}
</style>
