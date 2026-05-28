<script setup lang="ts">
import type { Finding } from "~/types/finding";
import type { ProgramListItem } from "~/types/program";

const props = defineProps<{
  finding: Finding;
  programs: ProgramListItem[];
}>();

defineEmits<{
  edit: [finding: Finding];
  delete: [finding: Finding];
}>();

const programName = computed(
  () => props.programs.find((program) => program.id === props.finding.programId)?.name ?? "Unknown program",
);
</script>

<template>
  <AppCard>
    <article class="finding-card">
      <div class="finding-card__header">
        <div>
          <h3>{{ finding.title }}</h3>
          <p>{{ programName }}</p>
        </div>
        <div class="finding-card__badges">
          <SeverityBadge :severity="finding.severity" />
          <StatusBadge :status="finding.status" />
          <PriorityBadge :priority="finding.priority" />
        </div>
      </div>

      <dl class="finding-card__meta">
        <div>
          <dt>Weakness</dt>
          <dd>{{ finding.weakness || "Not set" }}</dd>
        </div>
        <div>
          <dt>Affected</dt>
          <dd>{{ finding.affectedMethod || "GET" }} {{ finding.affectedUrl || "No URL" }}</dd>
        </div>
      </dl>

      <div class="finding-card__footer">
        <span>Updated {{ new Date(finding.updatedAt).toLocaleDateString() }}</span>
        <div>
          <AppButton type="button" variant="ghost" @click="$emit('edit', finding)">Edit</AppButton>
          <AppButton type="button" variant="danger" @click="$emit('delete', finding)">Delete</AppButton>
        </div>
      </div>
    </article>
  </AppCard>
</template>

<style scoped>
.finding-card {
  display: grid;
  gap: 12px;
}

.finding-card__header,
.finding-card__footer {
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

.finding-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.finding-card__meta {
  display: grid;
  gap: 10px;
  margin: 0;
}

dt {
  color: var(--q-text-soft);
  font-size: 12px;
  font-weight: 800;
}

dd {
  color: var(--q-text);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  margin: 3px 0 0;
  overflow-wrap: anywhere;
}

.finding-card__footer {
  border-top: 1px solid var(--q-border-soft);
  color: var(--q-text-soft);
  font-size: 13px;
  padding-top: 10px;
}

.finding-card__footer > div {
  display: flex;
  gap: 8px;
}

@media (max-width: 820px) {
  .finding-card__header,
  .finding-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .finding-card__badges {
    justify-content: flex-start;
  }
}
</style>
