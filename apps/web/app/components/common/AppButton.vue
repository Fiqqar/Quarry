<script setup lang="ts">
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const props = withDefaults(
  defineProps<{
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: ButtonVariant;
  }>(),
  {
    block: false,
    disabled: false,
    loading: false,
    type: "button",
    variant: "primary",
  },
);
</script>

<template>
  <button
    :class="['app-button', `app-button--${props.variant}`, { 'app-button--block': props.block }]"
    :disabled="props.disabled || props.loading"
    :type="props.type"
  >
    <span v-if="props.loading" aria-hidden="true" class="app-button__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  font-weight: 700;
  gap: 8px;
  height: 38px;
  justify-content: center;
  min-width: 96px;
  padding: 0 14px;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 120ms ease;
  white-space: nowrap;
}

.app-button:active:not(:disabled) {
  transform: translateY(1px);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.app-button--block {
  width: 100%;
}

.app-button--primary {
  background: var(--q-amber);
  color: #111113;
}

.app-button--primary:hover:not(:disabled) {
  background: #ffd56d;
}

.app-button--secondary {
  background: transparent;
  border-color: var(--q-border);
  color: var(--q-text);
}

.app-button--secondary:hover:not(:disabled) {
  background: #202127;
}

.app-button--ghost {
  background: transparent;
  color: var(--q-text-muted);
  min-width: auto;
}

.app-button--ghost:hover:not(:disabled) {
  background: #202127;
  color: var(--q-text);
}

.app-button--danger {
  background: transparent;
  border-color: rgba(248, 113, 113, 0.5);
  color: var(--q-red);
}

.app-button--danger:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.1);
}

.app-button__spinner {
  animation: app-button-spin 800ms linear infinite;
  border: 2px solid rgba(17, 17, 19, 0.3);
  border-top-color: #111113;
  border-radius: 999px;
  height: 14px;
  width: 14px;
}

.app-button--secondary .app-button__spinner,
.app-button--ghost .app-button__spinner,
.app-button--danger .app-button__spinner {
  border-color: rgba(228, 228, 231, 0.25);
  border-top-color: var(--q-text);
}

@keyframes app-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
