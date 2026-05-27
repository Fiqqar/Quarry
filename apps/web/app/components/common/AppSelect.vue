<script setup lang="ts">
import { useId } from "vue";

type SelectOption = {
  label: string;
  value: string;
};

const model = defineModel<string | null>({ default: null });
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    error?: string | null;
    id?: string;
    label?: string;
    options: SelectOption[];
    placeholder?: string;
  }>(),
  {
    disabled: false,
    error: null,
    id: undefined,
    label: undefined,
    placeholder: "Select",
  },
);
const generatedId = useId();
const selectId = computed(() => props.id ?? generatedId);

function updateValue(event: Event) {
  const value = (event.target as HTMLSelectElement).value;

  model.value = value.length > 0 ? value : null;
}
</script>

<template>
  <label class="app-field" :for="selectId">
    <span v-if="props.label" class="app-field__label">{{ props.label }}</span>
    <select
      :id="selectId"
      :aria-invalid="Boolean(props.error)"
      class="app-field__control"
      :disabled="props.disabled"
      :value="model ?? ''"
      @change="updateValue"
    >
      <option value="">{{ props.placeholder }}</option>
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
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
  appearance: none;
  background:
    linear-gradient(45deg, transparent 50%, var(--q-text-muted) 50%) right 15px center / 6px 6px no-repeat,
    linear-gradient(135deg, var(--q-text-muted) 50%, transparent 50%) right 10px center / 6px 6px no-repeat,
    #111318;
  border: 1px solid var(--q-border);
  border-radius: 6px;
  color: var(--q-text);
  height: 40px;
  min-width: 0;
  padding: 0 34px 0 11px;
  width: 100%;
}

.app-field__control[aria-invalid="true"] {
  border-color: rgba(248, 113, 113, 0.7);
}

.app-field__error {
  color: var(--q-red);
  font-size: 13px;
}
</style>
