<template>
  <Teleport to="body">
    <Transition name="wish-reveal">
      <div
        v-if="wish"
        class="wish-reveal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Wish: ${wish.label}`"
        @click.self="emit('close')"
      >
        <div ref="cardEl" class="wish-reveal__card" :style="cardStyle">
          <button
            class="wish-reveal__close"
            type="button"
            aria-label="Close wish"
            @click="emit('close')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>

          <p ref="labelEl" class="wish-reveal__label">{{ wish.label }}</p>
          <p ref="messageEl" class="wish-reveal__message">{{ wish.message }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  wish: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const cardEl = ref(null)
const labelEl = ref(null)
const messageEl = ref(null)

const cardStyle = computed(() => ({
  '--wish-color': props.wish?.color || 'var(--color-rose)',
}))

watch(
  () => props.wish,
  async (newWish) => {
    if (!newWish) return
    await nextTick()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !cardEl.value) return

    const anim = newWish.animation
    const tl = gsap.timeline()

    gsap.set([cardEl.value, labelEl.value, messageEl.value], { clearProps: 'all' })

    if (anim === 'sparkle') {
      gsap.set(cardEl.value, { scale: 0.6, opacity: 0, rotation: -5 })
      gsap.set(messageEl.value, { opacity: 0 })
      tl.to(cardEl.value, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' })
      tl.to(messageEl.value, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    } else if (anim === 'fade') {
      gsap.set(cardEl.value, { opacity: 0, filter: 'blur(8px)' })
      gsap.set(messageEl.value, { opacity: 0 })
      tl.to(cardEl.value, { opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' })
      tl.to(messageEl.value, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    } else if (anim === 'bloom') {
      gsap.set(cardEl.value, { scale: 0.3, opacity: 0 })
      gsap.set(messageEl.value, { opacity: 0, y: 10 })
      tl.to(cardEl.value, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' })
      tl.to(messageEl.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    } else if (anim === 'rise') {
      gsap.set(cardEl.value, { y: 40, opacity: 0 })
      gsap.set(messageEl.value, { opacity: 0 })
      tl.to(cardEl.value, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
      tl.to(messageEl.value, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    } else if (anim === 'float') {
      gsap.set(cardEl.value, { y: -30, opacity: 0 })
      gsap.set(messageEl.value, { opacity: 0 })
      tl.to(cardEl.value, { y: 0, opacity: 1, duration: 0.8, ease: 'sine.out' })
      tl.to(messageEl.value, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4')
    } else if (anim === 'glow') {
      gsap.set(cardEl.value, { scale: 0.9, opacity: 0, boxShadow: '0 0 0 rgba(232,160,180,0)' })
      gsap.set(messageEl.value, { opacity: 0 })
      tl.to(cardEl.value, {
        scale: 1,
        opacity: 1,
        boxShadow: '0 0 40px rgba(232, 160, 180, 0.3)',
        duration: 0.7,
        ease: 'power2.out',
      })
      tl.to(messageEl.value, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3')
    } else {
      gsap.set(cardEl.value, { scaleX: 0, opacity: 0, transformOrigin: 'center center' })
      gsap.set(messageEl.value, { opacity: 0 })
      tl.to(cardEl.value, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' })
      tl.to(messageEl.value, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    }
  },
)
</script>

<style scoped>
.wish-reveal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  padding-top: calc(var(--space-md) + var(--safe-top));
  padding-bottom: calc(var(--space-md) + var(--safe-bottom));
  background: rgba(74, 53, 64, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.wish-reveal__card {
  position: relative;
  width: 100%;
  max-width: 320px;
  padding: var(--space-lg) var(--space-md);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid color-mix(in srgb, var(--wish-color) 50%, transparent);
  box-shadow:
    0 8px 32px rgba(232, 160, 180, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  text-align: center;
}

.wish-reveal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(232, 160, 180, 0.1);
  color: var(--color-text-soft);
  cursor: pointer;
  touch-action: manipulation;
}

.wish-reveal__close svg {
  width: 16px;
  height: 16px;
}

.wish-reveal__label {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 5vw, 1.5rem);
  font-weight: 500;
  color: var(--wish-color);
  margin-bottom: var(--space-sm);
}

.wish-reveal__message {
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 3.8vw, 1.05rem);
  font-weight: 400;
  line-height: 1.65;
  color: var(--color-text-primary);
  font-style: italic;
}

.wish-reveal-enter-active,
.wish-reveal-leave-active {
  transition: opacity 0.3s var(--ease-soft);
}

.wish-reveal-enter-from,
.wish-reveal-leave-to {
  opacity: 0;
}
</style>
