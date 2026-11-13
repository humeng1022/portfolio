<template>
  <section id="hero" ref="sectionEl" class="hero" data-section aria-labelledby="hero-title">
    <HeroParticles :paused="motionPaused" />

    <div class="hero__inner container">
      <div class="hero__main">
        <p class="eyebrow">
          <span class="eyebrow__dot" aria-hidden="true"></span>
          <span>{{ profile.role }}</span>
          <span class="eyebrow__divider" aria-hidden="true">/</span>
          <span>PORTFOLIO {{ profile.year }}</span>
        </p>

        <h1 id="hero-title" ref="titleEl" class="hero__title">
          <span class="hero__title-line">把复杂系统，</span>
          <span class="hero__title-line">做成<span class="accent">简单</span>体验。</span>
        </h1>

        <p ref="introEl" class="hero__intro">{{ profile.intro }}</p>

        <div ref="actionsEl" class="hero__actions">
          <a class="btn btn--primary" href="#projects">
            浏览项目
            <span class="btn__icon" aria-hidden="true">↓</span>
          </a>
          <a class="btn btn--ghost" :href="`mailto:${profile.email}`">
            聊聊合作
            <span class="btn__icon" aria-hidden="true">↗</span>
          </a>
        </div>

        <dl ref="statsEl" class="hero__stats">
          <div v-for="stat in profile.stats" :key="stat.label" class="stat">
            <dt class="stat__label">{{ stat.label }}</dt>
            <dd class="stat__value">
              {{ stat.value }}<span>{{ stat.suffix }}</span>
            </dd>
          </div>
        </dl>
      </div>

      <div ref="cardEl" class="now-card" role="group" aria-label="当前状态">
        <span class="now-card__year" aria-hidden="true">{{ profile.year }}</span>
        <div class="now-card__top">
          <span class="now-card__label">{{ profile.nowLabel }}</span>
          <span class="now-card__status">
            <span class="status-dot" aria-hidden="true"></span>
            {{ profile.availability }}
          </span>
        </div>

        <dl class="now-card__list">
          <div v-for="item in profile.currently" :key="item.label" class="now-card__row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <div class="now-card__foot">
          <span>{{ profile.coordinates }}</span>
          <span>{{ profile.timezone }}</span>
        </div>
      </div>
    </div>

    <a ref="cueEl" class="hero__cue" href="#projects" aria-label="滚动到项目章节">
      <span class="hero__cue-line" aria-hidden="true"></span>
      <span>SCROLL TO EXPLORE</span>
    </a>
  </section>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import HeroParticles from './HeroParticles.vue'

const { profile } = inject('site')

defineProps({
  motionPaused: {
    type: Boolean,
    default: false
  }
})

const sectionEl = ref(null)
const titleEl = ref(null)
const introEl = ref(null)
const actionsEl = ref(null)
const statsEl = ref(null)
const cardEl = ref(null)
const cueEl = ref(null)

let split = null
let timeline = null
let mounted = true

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(async () => {
  const gsap = window.gsap
  if (!gsap || !titleEl.value || prefersReducedMotion()) return

  const title = titleEl.value
  const intro = introEl.value
  const actions = actionsEl.value
  const stats = statsEl.value
  const card = cardEl.value
  const cue = cueEl.value
  const items = [intro, actions, stats, card, cue].filter(Boolean)

  // 先把元素置于入场初始态，避免字体加载期间出现闪烁。
  gsap.set(title, { opacity: 0 })
  gsap.set(items, { opacity: 0, y: 26 })

  // 字体加载完成后再拆分标题；本地字体通常瞬间完成，超时仅用于字体失效时兜底。
  await Promise.race([
    (document.fonts?.ready ?? Promise.resolve()).catch(() => {}),
    new Promise((resolve) => window.setTimeout(resolve, 2500))
  ])

  if (!mounted) return

  try {
    if (window.SplitText) {
      split = new window.SplitText(title, {
        type: 'chars',
        aria: 'auto'
      })
      gsap.set(title, { opacity: 1 })

      timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from(split.chars, {
          yPercent: 72,
          opacity: 0,
          duration: 0.9,
          stagger: 0.028
        })
        .to(intro, { opacity: 1, y: 0, duration: 0.7 }, 0.34)
        .to(actions, { opacity: 1, y: 0, duration: 0.7 }, 0.43)
        .to(stats, { opacity: 1, y: 0, duration: 0.7 }, 0.51)
        .to(card, { opacity: 1, y: 0, duration: 0.8 }, 0.4)
        .to(cue, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
    } else {
      gsap.set(title, { opacity: 1 })
      timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline.from([title, ...items], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.06
      })
    }
  } catch (error) {
    console.warn('[portfolio] 首屏标题动画已降级为静态显示。', error)
    gsap.set([title, ...items], { opacity: 1, y: 0, clearProps: 'transform' })
  }
})

onBeforeUnmount(() => {
  mounted = false
  timeline?.kill()
  timeline = null
  split?.revert()
  split = null
})
</script>
