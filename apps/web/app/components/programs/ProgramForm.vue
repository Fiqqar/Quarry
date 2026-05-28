<script setup lang="ts">
import type { Program, ProgramInput } from "~/types/program";

const props = defineProps<{
  initial?: Program | null;
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  submit: [input: ProgramInput];
  cancel: [];
}>();

const form = reactive({
  name: "",
  platform: "",
  programUrl: "",
  scopeNotes: "",
});
const localError = ref<string | null>(null);

watch(
  () => props.initial,
  (program) => {
    form.name = program?.name ?? "";
    form.platform = program?.platform ?? "";
    form.programUrl = program?.programUrl ?? "";
    form.scopeNotes = program?.scopeNotes ?? "";
    localError.value = null;
  },
  { immediate: true },
);

function nullable(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function submitForm() {
  if (form.name.trim().length === 0) {
    localError.value = "Program name is required.";
    return;
  }

  localError.value = null;
  emit("submit", {
    name: form.name.trim(),
    platform: nullable(form.platform),
    programUrl: nullable(form.programUrl),
    scopeNotes: nullable(form.scopeNotes),
  });
}
</script>

<template>
  <form class="program-form" @submit.prevent="submitForm">
    <div>
      <h3>{{ props.initial ? "Edit program" : "New program" }}</h3>
      <p>Track a bug bounty program or target group.</p>
    </div>

    <ErrorState v-if="localError || props.error" :message="localError || props.error || ''" title="Program not saved" />
    <AppInput id="program-name" v-model="form.name" label="Name" placeholder="Example Bug Bounty" required />
    <AppInput id="program-platform" v-model="form.platform" label="Platform" placeholder="HackerOne, Bugcrowd, VDP" />
    <AppInput id="program-url" v-model="form.programUrl" label="Program URL" placeholder="https://example.com/security" />
    <AppTextarea id="program-scope" v-model="form.scopeNotes" label="Scope notes" :rows="5" />

    <div class="program-form__actions">
      <AppButton type="submit" :loading="props.loading">{{ props.initial ? "Save" : "Create" }}</AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')">Cancel</AppButton>
    </div>
  </form>
</template>

<style scoped>
.program-form {
  display: grid;
  gap: 14px;
}

h3 {
  color: var(--q-text);
  font-size: 18px;
  margin: 0 0 4px;
}

p {
  color: var(--q-text-muted);
  margin: 0;
}

.program-form__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
