<template>
  <section
    id="skills"
    ref="sectionEl"
    class="section skills section--bordered"
    data-section
    aria-labelledby="skills-title"
  >
    <div class="container">
      <SectionHeading
        number="02"
        label="CAPABILITIES"
        title="我能带来什么"
        lead="不是一份关键词清单，而是四组能独立交付的能力。它们共同覆盖从问题定义、系统设计到界面落地的完整链路。"
        title-id="skills-title"
      />

      <div class="skills__grid">
        <article
          v-for="group in skills"
          :key="group.id"
          class="skill-group"
          :aria-labelledby="`skill-title-${group.id}`"
        >
          <div class="skill-group__top">
            <span class="skill-group__index">{{ group.id }}</span>
            <span class="skill-group__en">{{ group.en }}</span>
          </div>
          <h3 :id="`skill-title-${group.id}`">{{ group.title }}</h3>
          <p>{{ group.summary }}</p>
          <ul class="tag-list" :aria-label="`${group.title} 技能`">
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>

      <div class="skills__note">
        <p>工具会变，判断力不会。</p>
        <span aria-hidden="true">— 2026</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import SectionHeading from './SectionHeading.vue'

const { skills } = inject('site')
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

    const grid = sectionEl.value.querySelector('.skills__grid')
    if (grid) {
      gsap.from(grid.querySelectorAll('.skill-group'), {
        scrollTrigger: { trigger: grid, start: 'top 88%', once: true },
        opacity: 0,
        y: 26,
        duration: 0.65,
        stagger: 0.07,
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
