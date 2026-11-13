<template>
  <section
    id="about"
    ref="sectionEl"
    class="section about section--bordered"
    data-section
    aria-labelledby="about-title"
  >
    <div class="container">
      <SectionHeading
        number="03"
        label="ABOUT"
        title="关于我"
        lead="我相信好的工程不只是把功能做出来，而是让复杂的部分在用户面前安静下来。"
        title-id="about-title"
      />

      <div class="about__grid">
        <div class="about__aside">
          <p class="about__statement">
            {{ about.statement.lead }}<span class="accent">{{ about.statement.accent }}</span>
          </p>

          <span class="about__badge">
            <span class="status-dot" aria-hidden="true"></span>
            {{ profile.availability }} · {{ profile.location }}
          </span>

          <div class="about__mark" aria-hidden="true">
            <span>CM</span>
          </div>
        </div>

        <div class="about__content">
          <div class="about__paragraphs">
            <p v-for="paragraph in about.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </div>

          <div class="principles">
            <article v-for="principle in about.principles" :key="principle.index" class="principle">
              <span class="principle__index">{{ principle.index }}</span>
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.text }}</p>
              </div>
            </article>
          </div>

          <ol class="timeline" aria-label="工作与教育经历">
            <li
              v-for="item in experience"
              :key="`${item.period}-${item.org}`"
              class="timeline__item"
              :class="{ 'is-current': item.current }"
            >
              <p class="timeline__period">{{ item.period }}</p>
              <div>
                <h3 class="timeline__role">
                  <span>{{ item.role }}</span>
                  <span class="timeline__org">{{ item.org }}</span>
                  <span class="timeline__location">{{ item.location }}</span>
                  <span v-if="item.current" class="timeline__now">NOW</span>
                </h3>
                <ul class="timeline__points">
                  <li v-for="point in item.points" :key="point">{{ point }}</li>
                </ul>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import SectionHeading from './SectionHeading.vue'

const { about, experience, profile } = inject('site')
const sectionEl = ref(null)
let animationContext = null

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  const gsap = window.gsap
  if (!gsap || !sectionEl.value || prefersReducedMotion() || !window.ScrollTrigger) return

  animationContext = gsap.context(() => {
    const head = sectionEl.value.querySelector('.section-head')
    if (head) {
      gsap.from(head, {
        scrollTrigger: { trigger: head, start: 'top 88%', once: true },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out'
      })
    }

    const statement = sectionEl.value.querySelector('.about__statement')
    if (statement) {
      gsap.from(statement, {
        scrollTrigger: { trigger: statement, start: 'top 86%', once: true },
        opacity: 0,
        y: 34,
        duration: 0.8,
        ease: 'power2.out'
      })
    }

    const content = sectionEl.value.querySelector('.about__content')
    if (content) {
      gsap.from(
        content.querySelectorAll('.about__paragraphs p, .principle'),
        {
          scrollTrigger: { trigger: content, start: 'top 85%', once: true },
          opacity: 0,
          y: 22,
          duration: 0.55,
          stagger: 0.035,
          ease: 'power2.out'
        }
      )
    }

    const timeline = sectionEl.value.querySelector('.timeline')
    if (timeline) {
      gsap.from(timeline.querySelectorAll('.timeline__item'), {
        scrollTrigger: { trigger: timeline, start: 'top 88%', once: true },
        opacity: 0,
        y: 22,
        duration: 0.55,
        stagger: 0.05,
        ease: 'power2.out'
      })
    }
  }, sectionEl.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
  animationContext = null
})
</script>
