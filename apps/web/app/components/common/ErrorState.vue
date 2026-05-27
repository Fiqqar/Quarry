<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message: string;
    title?: string;
  }>(),
  {
    title: "Request failed",
  },
);
</script>

<template>
  <div class="error-state" role="alert">
    <strong>{{ props.title }}</strong>
    <span>{{ props.message }}</span>
  </div>
</template>

<style scoped>
.error-state {
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.28);
  border-left: 3px solid var(--q-red);
  border-radius: 8px;
  color: #fecaca;
  display: grid;
  gap: 4px;
  padding: 12px 13px;
}

strong {
  color: #fee2e2;
}
</style>
