<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    actionLabel?: string;
    text?: string;
    title: string;
  }>(),
  {
    actionLabel: undefined,
    text: undefined,
  },
);

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <div class="empty-state">
    <div aria-hidden="true" class="empty-state__mark" />
    <h2>{{ props.title }}</h2>
    <p v-if="props.text">{{ props.text }}</p>
    <AppButton v-if="props.actionLabel" variant="secondary" @click="emit('action')">
      {{ props.actionLabel }}
    </AppButton>
  </div>
</template>

<style scoped>
.empty-state {
  align-items: center;
  border: 1px dashed var(--q-border);
  border-radius: 8px;
  color: var(--q-text-muted);
  display: grid;
  gap: 10px;
  justify-items: center;
  min-height: 220px;
  padding: 28px;
  text-align: center;
}

.empty-state__mark {
  border: 2px solid var(--q-border);
  border-radius: 8px;
  height: 34px;
  position: relative;
  width: 34px;
}

.empty-state__mark::after {
  background: var(--q-amber);
  content: "";
  height: 2px;
  left: 8px;
  position: absolute;
  right: 8px;
  top: 15px;
}

h2 {
  color: var(--q-text);
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

p {
  margin: 0;
  max-width: 420px;
}
</style>
