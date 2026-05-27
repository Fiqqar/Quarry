<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <section class="placeholder-page">
    <div class="placeholder-page__header">
      <h2>Programs</h2>
      <AppButton>New Program</AppButton>
    </div>
    <EmptyState
      text="Program CRUD UI is next. Backend endpoints are ready and protected."
      title="No programs loaded yet"
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
