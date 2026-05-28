<script setup lang="ts">
import { FINDING_STATUSES, SEVERITIES, type FindingStatus, type Severity } from "~/types/finding";
import type { ProgramListItem } from "~/types/program";

const search = defineModel<string>("search", { default: "" });
const programId = defineModel<string | null>("programId", { default: null });
const severity = defineModel<Severity | null>("severity", { default: null });
const status = defineModel<FindingStatus | null>("status", { default: null });

const props = defineProps<{
  programs: ProgramListItem[];
}>();

defineEmits<{
  submit: [];
  clear: [];
}>();

const severityOptions = SEVERITIES.map((value) => ({ label: value, value }));
const statusOptions = FINDING_STATUSES.map((value) => ({ label: value, value }));
const programOptions = computed(() => [
  ...props.programs.map((program) => ({ label: program.name, value: program.id })),
]);
</script>

<template>
  <form class="finding-filters" @submit.prevent="$emit('submit')">
    <AppInput v-model="search" autocomplete="off" label="Search" placeholder="Title, weakness, or URL" />
    <AppSelect v-model="programId" label="Program" :options="programOptions" placeholder="All programs" />
    <AppSelect v-model="severity" label="Severity" :options="severityOptions" placeholder="All severity" />
    <AppSelect v-model="status" label="Status" :options="statusOptions" placeholder="All status" />
    <div class="finding-filters__actions">
      <AppButton type="submit" variant="secondary">Filter</AppButton>
      <AppButton type="button" variant="ghost" @click="$emit('clear')">Clear</AppButton>
    </div>
  </form>
</template>

<style scoped>
.finding-filters {
  align-items: end;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(220px, 1.4fr) minmax(170px, 1fr) minmax(150px, 0.8fr) minmax(150px, 0.8fr) auto;
}

.finding-filters__actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 1100px) {
  .finding-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .finding-filters {
    grid-template-columns: 1fr;
  }
}
</style>
