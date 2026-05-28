<script setup lang="ts">
import type { Finding } from "~/types/finding";
import type { ProgramListItem } from "~/types/program";

defineProps<{
  findings: Finding[];
  programs: ProgramListItem[];
}>();

defineEmits<{
  edit: [finding: Finding];
  delete: [finding: Finding];
}>();
</script>

<template>
  <div class="finding-list">
    <FindingCard
      v-for="finding in findings"
      :key="finding.id"
      :finding="finding"
      :programs="programs"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
    />
  </div>
</template>

<style scoped>
.finding-list {
  display: grid;
  gap: 12px;
}
</style>
