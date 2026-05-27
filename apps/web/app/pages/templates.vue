<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <section class="placeholder-page">
    <div class="placeholder-page__header">
      <h2>Templates</h2>
      <AppBadge tone="amber">16 defaults</AppBadge>
    </div>
    <EmptyState
      text="Template browsing connects to the report template API in the report UI phase."
      title="Template library ready"
    />
  </section>
</template>

<style scoped>
.placeholder-page {
  display: grid;
  gap: 18px;
}

.placeholder-page__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

h2 {
  color: var(--q-text);
  font-size: 24px;
  font-weight: 850;
  margin: 0;
}
</style>
