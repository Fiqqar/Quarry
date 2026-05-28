<script setup lang="ts">
import {
  FINDING_STATUSES,
  PRIORITIES,
  SEVERITIES,
  WEAKNESSES,
  type Finding,
  type FindingInput,
  type FindingStatus,
  type Priority,
  type Severity,
} from "~/types/finding";
import type { ProgramListItem } from "~/types/program";

const props = defineProps<{
  initial?: Finding | null;
  programs: ProgramListItem[];
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  submit: [input: FindingInput];
  cancel: [];
}>();

const form = reactive({
  programId: null as string | null,
  title: "",
  severity: "medium" as Severity,
  priority: "p3" as Priority | null,
  status: "draft" as FindingStatus,
  weakness: null as string | null,
  affectedUrl: "",
  affectedMethod: "",
  rootCause: "",
  impact: "",
  stepsToReproduce: "",
  remediation: "",
  internalNotes: "",
});
const localError = ref<string | null>(null);

const programOptions = computed(() => props.programs.map((program) => ({ label: program.name, value: program.id })));
const severityOptions = SEVERITIES.map((value) => ({ label: value, value }));
const priorityOptions = PRIORITIES.map((value) => ({ label: value, value }));
const statusOptions = FINDING_STATUSES.map((value) => ({ label: value, value }));
const weaknessOptions = WEAKNESSES.map((value) => ({ label: value, value }));

watch(
  () => [props.initial, props.programs] as const,
  ([finding, programs]) => {
    form.programId = finding?.programId ?? programs[0]?.id ?? null;
    form.title = finding?.title ?? "";
    form.severity = finding?.severity ?? "medium";
    form.priority = finding?.priority ?? "p3";
    form.status = finding?.status ?? "draft";
    form.weakness = finding?.weakness ?? null;
    form.affectedUrl = finding?.affectedUrl ?? "";
    form.affectedMethod = finding?.affectedMethod ?? "";
    form.rootCause = finding?.rootCause ?? "";
    form.impact = finding?.impact ?? "";
    form.stepsToReproduce = finding?.stepsToReproduce ?? "";
    form.remediation = finding?.remediation ?? "";
    form.internalNotes = finding?.internalNotes ?? "";
    localError.value = null;
  },
  { immediate: true },
);

function nullable(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function submitForm() {
  if (!form.programId) {
    localError.value = "Create a program before saving findings.";
    return;
  }

  if (form.title.trim().length < 3) {
    localError.value = "Finding title must be at least 3 characters.";
    return;
  }

  localError.value = null;
  emit("submit", {
    programId: form.programId,
    title: form.title.trim(),
    severity: form.severity,
    priority: form.priority,
    status: form.status,
    weakness: form.weakness,
    affectedUrl: nullable(form.affectedUrl),
    affectedMethod: nullable(form.affectedMethod),
    rootCause: nullable(form.rootCause),
    impact: nullable(form.impact),
    stepsToReproduce: nullable(form.stepsToReproduce),
    remediation: nullable(form.remediation),
    internalNotes: nullable(form.internalNotes),
  });
}
</script>

<template>
  <form class="finding-form" @submit.prevent="submitForm">
    <div>
      <h3>{{ props.initial ? "Edit finding" : "New finding" }}</h3>
      <p>Capture the report fields that will feed the markdown generator later.</p>
    </div>

    <ErrorState v-if="props.programs.length === 0" message="Create a program before adding a finding." title="No program available" />
    <ErrorState v-if="localError || props.error" :message="localError || props.error || ''" title="Finding not saved" />

    <div class="finding-form__grid">
      <AppSelect v-model="form.programId" label="Program" :options="programOptions" placeholder="Select program" />
      <AppInput v-model="form.title" label="Title" placeholder="Stored XSS in profile bio" required />
      <AppSelect v-model="form.severity" label="Severity" :options="severityOptions" placeholder="Severity" />
      <AppSelect v-model="form.priority" label="Priority" :options="priorityOptions" placeholder="Priority" />
      <AppSelect v-model="form.status" label="Status" :options="statusOptions" placeholder="Status" />
      <AppSelect v-model="form.weakness" label="Weakness" :options="weaknessOptions" placeholder="Select weakness" />
      <AppInput v-model="form.affectedMethod" label="Method" placeholder="GET, POST, PUT" />
      <AppInput v-model="form.affectedUrl" label="Affected URL" placeholder="https://target.example/path" />
    </div>

    <AppTextarea v-model="form.rootCause" label="Root cause" :rows="4" />
    <AppTextarea v-model="form.impact" label="Impact" :rows="4" />
    <AppTextarea v-model="form.stepsToReproduce" label="Steps to reproduce" :rows="5" />
    <AppTextarea v-model="form.remediation" label="Remediation" :rows="4" />
    <AppTextarea v-model="form.internalNotes" label="Internal notes" :rows="4" />

    <div class="finding-form__actions">
      <AppButton type="submit" :disabled="props.programs.length === 0" :loading="props.loading">
        {{ props.initial ? "Save" : "Create" }}
      </AppButton>
      <AppButton type="button" variant="secondary" @click="$emit('cancel')">Cancel</AppButton>
    </div>
  </form>
</template>

<style scoped>
.finding-form {
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

.finding-form__grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.finding-form__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

@media (max-width: 820px) {
  .finding-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
