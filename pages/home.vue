<template>
  <div class="home">
    <HeroSection :motion-paused="motionPaused" />

    <div class="marquee" :class="{ 'is-paused': motionPaused }" aria-hidden="true">
      <div class="marquee__track">
        <div v-for="copy in 2" :key="copy" class="marquee__group">
          <span v-for="item in marqueeItems" :key="`${copy}-${item}`" class="marquee__item">
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <ProjectsSection />
    <SkillsSection />
    <AboutSection />
    <ContactSection />
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import SkillsSection from '../components/SkillsSection.vue'
import AboutSection from '../components/AboutSection.vue'
import ContactSection from '../components/ContactSection.vue'

const { marqueeItems } = inject('site')

defineProps({
  motionPaused: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['active-section'])

let lenis = null
let lenisInitializing = false
let tickerHandler = null
let observer = null
let motionQuery = null
let resizeTimer = 0
let reducedMotion = false
let sectionRatios = new Map()

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

async function initLenis() {
  if (
    lenis ||
    lenisInitializing ||
    reducedMotion ||
    window.innerWidth < 768 ||
    !window.gsap
  ) {
    return
  }

  lenisInitializing = true

  try {
    // Lenis 属于渐进增强：CDN 不可用时静默回退到原生滚动，不影响内容可读性。
    const Lenis = await (window.__portfolioLenisReady ?? Promise.resolve(null))
    if (!Lenis) return

    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4
    })

    if (window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update)
    }

    tickerHandler = (time) => {
      lenis?.raf(time * 1000)
    }
    window.gsap.ticker.add(tickerHandler)
    window.gsap.ticker.lagSmoothing(0)
  } catch (error) {
    console.warn('[portfolio] Lenis 未加载，已使用原生滚动。', error)
    lenis = null
  } finally {
    lenisInitializing = false
  }
}

function destroyLenis() {
  if (tickerHandler && window.gsap) {
    window.gsap.ticker.remove(tickerHandler)
  }
  tickerHandler = null
  lenis?.destroy()
  lenis = null
}

function onScrollLock(event) {
  if (!lenis) return
  if (event.detail) lenis.stop()
  else lenis.start()
}

function onAnchorClick(event) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  const targetElement = event.target instanceof Element ? event.target : null
  const link = targetElement?.closest('a[href^="#"]')
  if (!link) return
  if (link.classList.contains('skip-link')) return

  const hash = link.getAttribute('href')
  if (!hash || hash === '#') return

  const target = document.querySelector(hash)
  if (!target) return

  event.preventDefault()

  if (lenis) {
    lenis.scrollTo(target, { offset: -84, duration: 1.1 })
  } else {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  try {
    window.history.replaceState(null, '', hash)
  } catch (error) {
    // file:// 或特殊嵌入环境可能禁止 history API，滚动本身不受影响。
  }
}

function onMotionPreferenceChange(event) {
  reducedMotion = event.matches
  if (reducedMotion) destroyLenis()
  else initLenis()
}

function onResize() {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    if (window.innerWidth < 768) destroyLenis()
    else initLenis()
  }, 200)
}

function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('[data-section]'))
  if (!sections.length) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
      })

      let activeId = ''
      let activeRatio = 0
      sectionRatios.forEach((ratio, id) => {
        if (ratio > activeRatio) {
          activeRatio = ratio
          activeId = id
        }
      })

      if (activeId) emit('active-section', activeId)
    },
    {
      rootMargin: '-42% 0px -50% 0px',
      threshold: [0, 0.2, 0.5, 0.8]
    }
  )

  sections.forEach((section) => observer.observe(section))
}

onMounted(() => {
  reducedMotion = prefersReducedMotion()
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener?.('change', onMotionPreferenceChange)

  initScrollSpy()
  initLenis()

  document.addEventListener('click', onAnchorClick)
  window.addEventListener('portfolio:scroll-lock', onScrollLock)
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.clearTimeout(resizeTimer)
  document.removeEventListener('click', onAnchorClick)
  window.removeEventListener('portfolio:scroll-lock', onScrollLock)
  window.removeEventListener('resize', onResize)
  motionQuery?.removeEventListener?.('change', onMotionPreferenceChange)
  observer?.disconnect()
  observer = null
  sectionRatios = new Map()
  destroyLenis()
})
</script>
