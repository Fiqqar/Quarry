<script setup lang="ts">
import { useId } from "vue";

const model = defineModel<string>({ default: "" });
const props = withDefaults(
  defineProps<{
    autocomplete?: string;
    disabled?: boolean;
    error?: string | null;
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
  }>(),
  {
    autocomplete: undefined,
    disabled: false,
    error: null,
    id: undefined,
    label: undefined,
    placeholder: undefined,
    required: false,
    type: "text",
  },
);
const generatedId = useId();
const inputId = computed(() => props.id ?? generatedId);
</script>

<template>
  <label class="app-field" :for="inputId">
    <span v-if="props.label" class="app-field__label">{{ props.label }}</span>
    <input
      :id="inputId"
      v-model="model"
      :aria-invalid="Boolean(props.error)"
      class="app-field__control"
      :autocomplete="props.autocomplete"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      :required="props.required"
      :type="props.type"
    />
    <span v-if="props.error" class="app-field__error">{{ props.error }}</span>
  </label>
</template>

<style scoped>
.app-field {
  display: grid;
  gap: 7px;
}

.app-field__label {
  color: var(--q-text-muted);
  font-size: 13px;
  font-weight: 700;
}

.app-field__control {
  background: #111318;
  border: 1px solid var(--q-border);
  border-radius: 6px;
  color: var(--q-text);
  height: 40px;
  min-width: 0;
  padding: 0 11px;
  width: 100%;
}

.app-field__control::placeholder {
  color: var(--q-text-soft);
}

.app-field__control:disabled {
  opacity: 0.65;
}

.app-field__control[aria-invalid="true"] {
  border-color: rgba(248, 113, 113, 0.7);
}

.app-field__error {
  color: var(--q-red);
  font-size: 13px;
}
</style>
