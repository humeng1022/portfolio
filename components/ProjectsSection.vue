<template>
  <section
    id="projects"
    ref="sectionEl"
    class="section projects section--bordered"
    data-section
    aria-labelledby="projects-title"
  >
    <div class="container">
      <SectionHeading
        number="01"
        label="SELECTED WORK"
        title="选中的项目"
        lead="六个从 0 到 1 的产品切片，覆盖实时协作、AI 工作流与设计系统。每个项目都记录了问题、取舍与结果。"
        title-id="projects-title"
      />

      <div class="projects__grid">
        <article
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          :aria-labelledby="`project-title-${project.id}`"
        >
          <div class="project-card__media">
            <img
              :src="project.image"
              :alt="`${project.title} 项目概念视觉`"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
            <div class="project-card__meta">
              <span>{{ project.index }}</span>
              <span>{{ project.year }}</span>
            </div>
          </div>

          <div class="project-card__body">
            <div class="project-card__tags">
              <span v-for="tag in project.tags" :key="tag" class="project-card__tag">
                {{ tag }}
              </span>
            </div>

            <h3 :id="`project-title-${project.id}`" class="project-card__title">
              {{ project.title }}
            </h3>
            <p class="project-card__subtitle">{{ project.subtitle }}</p>

            <p class="project-card__problem">
              <span>问题</span>
              {{ project.problem }}
            </p>

            <div class="project-card__footer">
              <ul class="tech-list" aria-label="技术栈">
                <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
              </ul>
              <span class="project-card__cta">
                阅读案例
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          </div>

          <button
            class="project-card__hit"
            type="button"
            :aria-label="`查看项目：${project.title}`"
            aria-haspopup="dialog"
            @click="openProject($event, project)"
          ></button>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <dialog
        ref="dialogEl"
        class="project-modal"
        aria-labelledby="project-modal-title"
        @keydown="onDialogKeydown"
        @close="onDialogClose"
        @click="onDialogBackdrop"
      >
        <div v-if="selected" class="project-modal__shell">
          <button
            class="project-modal__close"
            type="button"
            aria-label="关闭项目详情"
            @click="closeDialog"
          >
            ×
          </button>

          <div
            class="project-modal__scroll"
            role="region"
            aria-label="项目详情内容"
            tabindex="0"
          >
            <div class="project-modal__media">
              <img
                :src="selected.image"
                :alt="`${selected.title} 项目概念视觉`"
                width="1200"
                height="800"
                decoding="async"
              />
            </div>

            <div class="project-modal__content">
              <p class="eyebrow">
                <span class="eyebrow__dot" aria-hidden="true"></span>
                <span>CASE STUDY</span>
                <span class="eyebrow__divider" aria-hidden="true">/</span>
                <span>{{ selected.year }}</span>
              </p>

              <h2 id="project-modal-title" class="project-modal__title">
                {{ selected.title }}
              </h2>
              <p class="project-modal__subtitle">{{ selected.subtitle }}</p>
              <p class="project-modal__context">{{ selected.detail.context }}</p>

              <dl class="project-modal__meta">
                <div>
                  <dt>年份</dt>
                  <dd>{{ selected.year }}</dd>
                </div>
                <div>
                  <dt>角色</dt>
                  <dd>{{ selected.role }}</dd>
                </div>
                <div>
                  <dt>团队</dt>
                  <dd>{{ selected.team }}</dd>
                </div>
                <div>
                  <dt>技术栈</dt>
                  <dd>{{ selected.stack.join(' · ') }}</dd>
                </div>
              </dl>

              <div class="project-modal__grid">
                <div class="project-modal__block">
                  <h3>问题</h3>
                  <p>{{ selected.problem }}</p>
                </div>
                <div class="project-modal__block">
                  <h3>方案</h3>
                  <p>{{ selected.solution }}</p>
                </div>
              </div>

              <div class="project-modal__block project-modal__block--wide">
                <h3>关键动作</h3>
                <ul>
                  <li v-for="bullet in selected.detail.bullets" :key="bullet">{{ bullet }}</li>
                </ul>
              </div>

              <div class="project-modal__impact">
                <h3>结果</h3>
                <ul>
                  <li v-for="item in selected.impact" :key="item">{{ item }}</li>
                </ul>
              </div>

              <p class="project-modal__learning">“{{ selected.detail.learning }}”</p>

              <ul class="project-modal__tags" aria-label="项目标签">
                <li v-for="tag in selected.tags" :key="tag">{{ tag }}</li>
                <li v-for="tech in selected.stack" :key="tech">{{ tech }}</li>
              </ul>
            </div>
          </div>
        </div>
      </dialog>
    </Teleport>
  </section>
</template>

<script setup>
import { inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import SectionHeading from './SectionHeading.vue'

const projects = inject('projects')
const sectionEl = ref(null)
const dialogEl = ref(null)
const selected = ref(null)
let lastTrigger = null
let animationContext = null

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function lockPage() {
  document.documentElement.classList.add('is-locked')
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: true }))
}

function unlockPage() {
  document.documentElement.classList.remove('is-locked')
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: false }))
}

function openProject(event, project) {
  lastTrigger = event.currentTarget
  selected.value = project

  nextTick(() => {
    const dialog = dialogEl.value
    if (!dialog || dialog.open) return

    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')

    dialog.querySelector('.project-modal__scroll')?.scrollTo({ top: 0 })
    lockPage()
  })
}

function closeDialog() {
  if (dialogEl.value?.open) dialogEl.value.close()
}

function onDialogClose() {
  selected.value = null
  unlockPage()
  lastTrigger?.focus?.()
  lastTrigger = null
}

function onDialogBackdrop(event) {
  if (event.target === dialogEl.value) closeDialog()
}

function onDialogKeydown(event) {
  if (event.key !== 'Tab') return

  const dialog = dialogEl.value
  if (!dialog) return

  const focusable = Array.from(
    dialog.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => element.getClientRects().length > 0)

  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey) {
    if (active === first || !dialog.contains(active)) {
      event.preventDefault()
      last.focus()
    }
  } else if (active === last || !dialog.contains(active)) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  const gsap = window.gsap
  if (!gsap || !sectionEl.value || prefersReducedMotion()) return
  if (!window.ScrollTrigger) return

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

    const grid = sectionEl.value.querySelector('.projects__grid')
    if (grid) {
      gsap.from(grid.querySelectorAll('.project-card'), {
        scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
        opacity: 0,
        y: 42,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power2.out'
      })
    }
  }, sectionEl.value)
})

onBeforeUnmount(() => {
  if (dialogEl.value?.open) dialogEl.value.close()
  unlockPage()
  animationContext?.revert()
  animationContext = null
})
</script>
