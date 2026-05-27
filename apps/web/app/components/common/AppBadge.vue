<script setup lang="ts">
type BadgeTone = "zinc" | "amber" | "cyan" | "emerald" | "red";

const props = withDefaults(
  defineProps<{
    tone?: BadgeTone;
  }>(),
  {
    tone: "zinc",
  },
);
</script>

<template>
  <span :class="['app-badge', `app-badge--${props.tone}`]">
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  align-items: center;
  border: 1px solid currentColor;
  border-radius: 4px;
  display: inline-flex;
  font-size: 12px;
  font-weight: 800;
  height: 24px;
  letter-spacing: 0;
  padding: 0 8px;
}

.app-badge--zinc {
  background: rgba(161, 161, 170, 0.1);
  color: #c4c4cc;
}

.app-badge--amber {
  background: rgba(245, 196, 81, 0.12);
  color: var(--q-amber);
}

.app-badge--cyan {
  background: rgba(103, 232, 249, 0.11);
  color: var(--q-cyan);
}

.app-badge--emerald {
  background: rgba(52, 211, 153, 0.11);
  color: var(--q-emerald);
}

.app-badge--red {
  background: rgba(248, 113, 113, 0.12);
  color: var(--q-red);
}
</style>
