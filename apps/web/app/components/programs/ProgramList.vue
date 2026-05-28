<script setup lang="ts">
import type { ProgramListItem } from "~/types/program";

defineProps<{
  programs: ProgramListItem[];
}>();

defineEmits<{
  edit: [program: ProgramListItem];
  delete: [program: ProgramListItem];
}>();
</script>

<template>
  <div class="program-list">
    <ProgramCard
      v-for="program in programs"
      :key="program.id"
      :program="program"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
    />
  </div>
</template>

<style scoped>
.program-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
</style>
