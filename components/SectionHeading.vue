<template>
  <header class="section-head">
    <div>
      <p class="eyebrow">
        <span class="eyebrow__line" aria-hidden="true"></span>
        <span>{{ number }}</span>
        <span class="eyebrow__divider" aria-hidden="true">/</span>
        <span>{{ label }}</span>
      </p>
      <h2 :id="titleId" class="section-head__title">{{ title }}</h2>
    </div>
    <p class="section-head__lead">{{ lead }}</p>
  </header>
</template>

<script setup>
defineProps({
  number: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  lead: {
    type: String,
    default: ''
  },
  titleId: {
    type: String,
    required: true
  }
})
</script>
