<template>
  <div class="site">
    <a class="skip-link" href="#main">跳到主要内容</a>

    <SiteHeader
      :active-section="activeSection"
      :motion-paused="motionPaused"
      :reduced-motion="reducedMotion"
      @toggle-motion="toggleMotion"
    />

    <main id="main" tabindex="-1">
      <HomePage
        :motion-paused="motionPaused"
        @active-section="activeSection = $event"
      />
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import HomePage from './pages/home.vue'

const activeSection = ref('hero')
const initialReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const motionPaused = ref(initialReducedMotion)
const reducedMotion = ref(initialReducedMotion)

let motionQuery = null

function syncMotionPreference(event) {
  reducedMotion.value = event.matches
  motionPaused.value = event.matches
}

function toggleMotion() {
  if (reducedMotion.value) return
  motionPaused.value = !motionPaused.value
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncMotionPreference(motionQuery)
  motionQuery.addEventListener?.('change', syncMotionPreference)
})

onBeforeUnmount(() => {
  motionQuery?.removeEventListener?.('change', syncMotionPreference)
})
</script>
