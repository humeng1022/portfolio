<template>
  <section
    id="contact"
    ref="sectionEl"
    class="section contact"
    data-section
    aria-labelledby="contact-title"
  >
    <div class="container">
      <p class="eyebrow">
        <span class="eyebrow__line" aria-hidden="true"></span>
        <span>04</span>
        <span class="eyebrow__divider" aria-hidden="true">/</span>
        <span>CONTACT</span>
      </p>

      <h2 id="contact-title" ref="titleEl" class="contact__title">
        <span class="contact__title-muted">有想法？</span>
        <span>一起做点<span class="contact__title-tail"><span class="accent">有意思</span>的事。</span></span>
      </h2>

      <div ref="gridEl" class="contact__grid">
        <div>
          <p class="contact__note">{{ profile.availabilityNote }}</p>

          <div class="contact__email-row">
            <a class="contact__email" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
            <button class="copy-btn" type="button" @click="copyEmail">
              <span aria-hidden="true">{{ copyIcon }}</span>
              {{ copyLabel }}
            </button>
            <span class="sr-only" role="status" aria-live="polite">{{ copyAnnouncement }}</span>
          </div>

          <div class="contact__meta">
            <span>{{ profile.location }}</span>
            <span>上海时间 {{ localTime }}</span>
            <span>{{ profile.timezone }}</span>
          </div>
        </div>

        <nav class="contact__links" aria-label="社交与代码平台">
          <a
            v-for="social in profile.socials"
            :key="social.label"
            class="social-link"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="social-link__label">{{ social.label }}</span>
            <span class="social-link__handle">{{ social.handle }}</span>
            <span class="social-link__arrow" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>

      <footer class="footer">
        <div class="footer__left">
          <span>© {{ profile.year }} {{ profile.name }}</span>
          <span>{{ profile.footerNote }}</span>
        </div>
        <div class="footer__left">
          <a href="#hero">回到顶部 ↑</a>
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

const { profile } = inject('site')

const sectionEl = ref(null)
const titleEl = ref(null)
const gridEl = ref(null)

const copyState = ref('idle')
const localTime = ref('')
let copyTimer = 0
let clockTimer = 0
let animationContext = null

const copyLabel = computed(() => {
  if (copyState.value === 'copied') return '已复制'
  if (copyState.value === 'failed') return '复制失败'
  return '复制邮箱'
})

const copyIcon = computed(() => (copyState.value === 'copied' ? '✓' : '⧉'))

const copyAnnouncement = computed(() => {
  if (copyState.value === 'copied') return '邮箱已复制到剪贴板'
  if (copyState.value === 'failed') return '复制失败，请手动选择邮箱地址'
  return ''
})

function fallbackCopy(text) {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(field)
  if (!copied) throw new Error('execCommand copy failed')
}

async function copyEmail() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(profile.email)
    } else {
      fallbackCopy(profile.email)
    }
    copyState.value = 'copied'
  } catch (error) {
    console.warn('[portfolio] 邮箱复制失败。', error)
    copyState.value = 'failed'
  }

  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyState.value = 'idle'
  }, 2200)
}

function updateClock() {
  try {
    localTime.value = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date())
  } catch (error) {
    localTime.value = '—'
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  updateClock()
  clockTimer = window.setInterval(updateClock, 30000)

  const gsap = window.gsap
  if (!gsap || !sectionEl.value || prefersReducedMotion() || !window.ScrollTrigger) return

  animationContext = gsap.context(() => {
    const title = titleEl.value
    const grid = gridEl.value
    if (!title || !grid) return

    gsap.from([title, grid], {
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top 68%',
        once: true
      },
      opacity: 0,
      y: 30,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power2.out'
    })
  }, sectionEl.value)
})

onBeforeUnmount(() => {
  window.clearTimeout(copyTimer)
  window.clearInterval(clockTimer)
  animationContext?.revert()
  animationContext = null
})
</script>
