<template>
  <span style="display: none" aria-hidden="true" />
</template>

<script setup>
import confetti from 'canvas-confetti'

const pastelColors = ['#f8e8ee', '#e8a0b4', '#e8dff5', '#f5d0a9', '#c9b8e8', '#fce4d6']

function fire() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.55 },
    colors: pastelColors,
    ticks: 200,
    gravity: 0.8,
    scalar: 0.9,
  })

  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.4, x: 0.3 },
      colors: pastelColors,
      ticks: 150,
    })
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.4, x: 0.7 },
      colors: pastelColors,
      ticks: 150,
    })
  }, 250)
}

function fireGentle() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return

  confetti({
    particleCount: 35,
    spread: 55,
    origin: { y: 0.5 },
    colors: pastelColors,
    ticks: 280,
    gravity: 0.45,
    scalar: 0.7,
    drift: 0.5,
  })

  setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 80,
      origin: { y: 0.35 },
      colors: pastelColors,
      ticks: 220,
      gravity: 0.35,
      scalar: 0.6,
    })
  }, 400)
}

defineExpose({ fire, fireGentle })
</script>
