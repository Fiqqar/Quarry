<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    rows?: number;
  }>(),
  {
    label: "Loading",
    rows: 4,
  },
);
</script>

<template>
  <div aria-live="polite" class="loading-state">
    <span class="loading-state__label">{{ props.label }}</span>
    <span v-for="row in props.rows" :key="row" class="loading-state__bar" />
  </div>
</template>

<style scoped>
.loading-state {
  display: grid;
  gap: 10px;
}

.loading-state__label {
  color: var(--q-text-muted);
  font-size: 13px;
  font-weight: 700;
}

.loading-state__bar {
  animation: pulse 1.3s ease-in-out infinite;
  background: linear-gradient(90deg, #1f2027, #2a2c34, #1f2027);
  border-radius: 6px;
  display: block;
  height: 38px;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}
</style>
