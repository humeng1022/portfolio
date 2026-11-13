<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="container site-header__inner">
      <a class="brand" href="#hero" aria-label="回到首屏">
        <span class="brand__mark" aria-hidden="true">CM</span>
        <span class="brand__text">
          <span class="brand__name">{{ profile.name }}</span>
          <span class="brand__sub">{{ profile.latinName }} / PORTFOLIO</span>
        </span>
      </a>

      <nav class="nav" aria-label="主要导航">
        <a
          v-for="item in nav"
          :key="item.id"
          :href="`#${item.id}`"
          class="nav__link"
          :class="{ 'is-active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'location' : undefined"
        >
          <span class="nav__index">{{ item.index }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="header__right">
        <span class="header__status">
          <span class="status-dot" aria-hidden="true"></span>
          {{ profile.availability }}
        </span>
        <button
          v-if="!reducedMotion"
          class="motion-toggle"
          type="button"
          :aria-pressed="motionPaused"
          :aria-label="motionPaused ? '播放背景动效' : '暂停背景动效'"
          :title="motionPaused ? '播放背景动效' : '暂停背景动效'"
          @click="emit('toggle-motion')"
        >
          <svg
            v-if="!motionPaused"
            class="motion-toggle__icon"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="2" y="1.5" width="2.8" height="9"></rect>
            <rect x="7.2" y="1.5" width="2.8" height="9"></rect>
          </svg>
          <svg
            v-else
            class="motion-toggle__icon"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2.5 1.4 10 6l-7.5 4.6z"></path>
          </svg>
        </button>
        <a class="header__cta" :href="`mailto:${profile.email}`">
          联系
          <span aria-hidden="true">↗</span>
        </a>
        <button
          class="menu-btn"
          type="button"
          aria-label="打开导航菜单"
          aria-haspopup="dialog"
          aria-controls="mobile-menu"
          @click="openMenu"
        >
          <span class="menu-btn__lines" aria-hidden="true"></span>
        </button>
      </div>
    </div>

    <div
      class="header__progress"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    ></div>

    <dialog
      id="mobile-menu"
      ref="menuDialog"
      class="mobile-menu"
      aria-label="站点导航"
      @close="onMenuClose"
      @click="onMenuBackdrop"
    >
      <div class="mobile-menu__inner">
        <div class="mobile-menu__top">
          <a class="brand" href="#hero" @click="closeMenu">
            <span class="brand__mark" aria-hidden="true">CM</span>
            <span class="brand__text">
              <span class="brand__name">{{ profile.name }}</span>
              <span class="brand__sub">{{ profile.latinName }} / PORTFOLIO</span>
            </span>
          </a>
          <button class="mobile-menu__close" type="button" aria-label="关闭导航菜单" @click="closeMenu">
            ×
          </button>
        </div>

        <nav class="mobile-menu__nav" aria-label="移动端导航">
          <a
            v-for="item in nav"
            :key="item.id"
            :href="`#${item.id}`"
            class="mobile-menu__link"
            @click="closeMenu"
          >
            <span>{{ item.label }}</span>
            <span>{{ item.index }}</span>
          </a>
        </nav>

        <div class="mobile-menu__foot">
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          <span>{{ profile.location }}</span>
          <span>{{ profile.availability }}</span>
        </div>
      </div>
    </dialog>
  </header>
</template>

<script setup>
import { inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const { nav, profile } = inject('site')

defineProps({
  activeSection: {
    type: String,
    default: 'hero'
  },
  motionPaused: {
    type: Boolean,
    default: false
  },
  reducedMotion: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-motion'])

const scrolled = ref(false)
const progress = ref(0)
const menuDialog = ref(null)
let ticking = false

function updateScrollState() {
  const y = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrolled.value = y > 24
  progress.value = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateScrollState()
    ticking = false
  })
}

function openMenu() {
  const dialog = menuDialog.value
  if (!dialog || dialog.open) return
  dialog.showModal()
  document.documentElement.classList.add('is-locked')
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: true }))
  nextTick(() => {
    dialog.querySelector('.mobile-menu__link')?.focus()
  })
}

function closeMenu() {
  const dialog = menuDialog.value
  if (dialog?.open) dialog.close()
}

function onMenuClose() {
  document.documentElement.classList.remove('is-locked')
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: false }))
}

function onMenuBackdrop(event) {
  if (event.target === menuDialog.value) closeMenu()
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  closeMenu()
  document.documentElement.classList.remove('is-locked')
  window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: false }))
})
</script>
