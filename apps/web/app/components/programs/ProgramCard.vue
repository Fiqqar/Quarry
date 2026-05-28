<script setup lang="ts">
import type { ProgramListItem } from "~/types/program";

defineProps<{
  program: ProgramListItem;
}>();

defineEmits<{
  edit: [program: ProgramListItem];
  delete: [program: ProgramListItem];
}>();
</script>

<template>
  <AppCard>
    <article class="program-card">
      <div class="program-card__main">
        <div>
          <h3>{{ program.name }}</h3>
          <p>{{ program.platform || "No platform" }}</p>
        </div>
        <AppBadge tone="amber">{{ program.findingCount }} findings</AppBadge>
      </div>

      <a v-if="program.programUrl" class="program-card__url" :href="program.programUrl" rel="noopener noreferrer" target="_blank">
        {{ program.programUrl }}
      </a>
      <p v-if="program.scopeNotes" class="program-card__notes">{{ program.scopeNotes }}</p>

      <div class="program-card__footer">
        <span>Updated {{ new Date(program.updatedAt).toLocaleDateString() }}</span>
        <div>
          <AppButton type="button" variant="ghost" @click="$emit('edit', program)">Edit</AppButton>
          <AppButton type="button" variant="danger" @click="$emit('delete', program)">Delete</AppButton>
        </div>
      </div>
    </article>
  </AppCard>
</template>

<style scoped>
.program-card {
  display: grid;
  gap: 12px;
}

.program-card__main,
.program-card__footer {
  align-items: start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

h3 {
  color: var(--q-text);
  font-size: 17px;
  margin: 0 0 4px;
}

p {
  color: var(--q-text-muted);
  margin: 0;
}

.program-card__url {
  color: var(--q-cyan);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  overflow-wrap: anywhere;
}

.program-card__notes {
  color: var(--q-text);
  line-height: 1.5;
  white-space: pre-wrap;
}

.program-card__footer {
  border-top: 1px solid var(--q-border-soft);
  color: var(--q-text-soft);
  font-size: 13px;
  padding-top: 10px;
}

.program-card__footer > div {
  display: flex;
  gap: 8px;
}

@media (max-width: 720px) {
  .program-card__main,
  .program-card__footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
