<template>
  <section class="app-card">
    <slot />
  </section>
</template>

<style scoped>
.app-card {
  background: rgba(24, 24, 27, 0.86);
  border: 1px solid var(--q-border-soft);
  border-radius: 8px;
  padding: 18px;
}
</style>
