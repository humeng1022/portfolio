<template>
  <canvas ref="canvasEl" class="hero-particles" aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  paused: {
    type: Boolean,
    default: false
  }
})

const canvasEl = ref(null)

let ctx = null
let particles = []
let frameId = 0
let running = false
let visible = true
let documentHidden = false
let reducedMotion = false
let resizeTimer = 0
let observer = null

let width = 0
let height = 0
let dpr = 1

const pointer = { x: -1000, y: -1000 }

function particleCount() {
  return window.innerWidth < 768 ? 30 : 64
}

function createParticles() {
  const count = particleCount()
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.32,
    vy: (Math.random() - 0.5) * 0.32,
    r: Math.random() * 1.5 + 0.7,
    alpha: Math.random() * 0.26 + 0.12,
    accent: index % 5 === 0
  }))
}

function draw(update = true) {
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  if (update) {
    for (const particle of particles) {
      const dx = particle.x - pointer.x
      const dy = particle.y - pointer.y
      const distance = Math.hypot(dx, dy)

      if (distance > 0 && distance < 132) {
        const force = (1 - distance / 132) * 0.9
        particle.vx += (dx / distance) * force
        particle.vy += (dy / distance) * force
      }

      particle.vx *= 0.965
      particle.vy *= 0.965

      const speed = Math.hypot(particle.vx, particle.vy)
      if (speed > 1.5) {
        particle.vx = (particle.vx / speed) * 1.5
        particle.vy = (particle.vy / speed) * 1.5
      }

      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0) {
        particle.x = 0
        particle.vx *= -1
      } else if (particle.x > width) {
        particle.x = width
        particle.vx *= -1
      }

      if (particle.y < 0) {
        particle.y = 0
        particle.vy *= -1
      } else if (particle.y > height) {
        particle.y = height
        particle.vy *= -1
      }
    }
  }

  // 连线只在桌面绘制：移动端减少一半以上的绘制开销。
  if (width >= 768) {
    const maxDistance = 112
    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i]
      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const distance = Math.hypot(dx, dy)
        if (distance > maxDistance) continue
        const alpha = (1 - distance / maxDistance) * 0.1
        ctx.beginPath()
        ctx.strokeStyle = `rgba(242, 239, 231, ${alpha})`
        ctx.lineWidth = 1
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  for (const particle of particles) {
    ctx.beginPath()
    ctx.fillStyle = particle.accent
      ? `rgba(255, 92, 53, ${particle.alpha + 0.22})`
      : `rgba(242, 239, 231, ${particle.alpha})`
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop() {
  if (!running) return
  draw(true)
  frameId = requestAnimationFrame(loop)
}

function canRun() {
  return !reducedMotion && !props.paused && visible && !documentHidden
}

function start() {
  if (running || !canRun()) return
  running = true
  frameId = requestAnimationFrame(loop)
}

function stop() {
  running = false
  if (frameId) cancelAnimationFrame(frameId)
  frameId = 0
}

function resize() {
  const canvas = canvasEl.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  width = Math.max(1, rect.width)
  height = Math.max(1, rect.height)
  dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)

  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  createParticles()

  if (reducedMotion || props.paused) {
    draw(false)
  } else {
    draw(true)
    start()
  }
}

function onResize() {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(resize, 180)
}

function onPointerMove(event) {
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom

  if (inside) {
    pointer.x = event.clientX - rect.left
    pointer.y = event.clientY - rect.top
  } else {
    pointer.x = -1000
    pointer.y = -1000
  }
}

function onPointerLeave() {
  pointer.x = -1000
  pointer.y = -1000
}

function onVisibilityChange() {
  documentHidden = document.hidden
  if (documentHidden) stop()
  else start()
}

function onMotionPreferenceChange(event) {
  reducedMotion = event.matches
  if (reducedMotion) {
    stop()
    draw(false)
  } else {
    start()
  }
}

let motionQuery = null

watch(
  () => props.paused,
  (paused) => {
    if (paused) stop()
    else start()
  }
)

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = motionQuery.matches

  resize()

  observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true
      if (visible) start()
      else stop()
    },
    { threshold: 0 }
  )

  if (canvasEl.value) observer.observe(canvasEl.value)

  motionQuery.addEventListener?.('change', onMotionPreferenceChange)
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('blur', onPointerLeave)
  document.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  observer = null
  window.clearTimeout(resizeTimer)
  motionQuery?.removeEventListener?.('change', onMotionPreferenceChange)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('blur', onPointerLeave)
  document.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>
