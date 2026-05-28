<script setup lang="ts">
import type { Finding, FindingInput, FindingStatus, Severity } from "~/types/finding";
import type { PaginationMeta, ProgramListItem } from "~/types/program";
import { toSafeErrorMessage } from "~/utils/api-error";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const findingsApi = useFindings();
const programsApi = usePrograms();
const findings = ref<Finding[]>([]);
const programs = ref<ProgramListItem[]>([]);
const meta = ref<PaginationMeta | undefined>();
const search = ref("");
const programId = ref<string | null>(null);
const severity = ref<Severity | null>(null);
const status = ref<FindingStatus | null>(null);
const page = ref(1);
const limit = 20;
const loading = ref(false);
const programsLoading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);
const formOpen = ref(false);
const editingFinding = ref<Finding | null>(null);
const deletingFinding = ref<Finding | null>(null);

const totalPages = computed(() => Math.max(1, Math.ceil((meta.value?.total ?? 0) / limit)));

async function loadPrograms() {
  programsLoading.value = true;

  try {
    const result = await programsApi.listPrograms({ limit: 100 });
    programs.value = result.data;
  } catch (loadError) {
    error.value = toSafeErrorMessage(loadError, "Unable to load programs.");
  } finally {
    programsLoading.value = false;
  }
}

async function loadFindings() {
  loading.value = true;
  error.value = null;

  try {
    const result = await findingsApi.listFindings({
      programId: programId.value,
      severity: severity.value,
      status: status.value,
      search: search.value,
      page: page.value,
      limit,
    });

    findings.value = result.data;
    meta.value = result.meta;
  } catch (loadError) {
    error.value = toSafeErrorMessage(loadError, "Unable to load findings.");
  } finally {
    loading.value = false;
  }
}

function openCreateForm() {
  editingFinding.value = null;
  formError.value = null;
  formOpen.value = true;
}

function openEditForm(finding: Finding) {
  editingFinding.value = finding;
  formError.value = null;
  formOpen.value = true;
}

async function saveFinding(input: FindingInput) {
  saving.value = true;
  formError.value = null;

  try {
    if (editingFinding.value) {
      await findingsApi.updateFinding(editingFinding.value.id, input);
    } else {
      await findingsApi.createFinding(input);
      page.value = 1;
    }

    formOpen.value = false;
    editingFinding.value = null;
    await loadFindings();
    await loadPrograms();
  } catch (saveError) {
    formError.value = toSafeErrorMessage(saveError, "Unable to save finding.");
  } finally {
    saving.value = false;
  }
}

async function confirmDeleteFinding() {
  if (!deletingFinding.value) {
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    await findingsApi.deleteFinding(deletingFinding.value.id);
    deletingFinding.value = null;

    if (findings.value.length === 1 && page.value > 1) {
      page.value -= 1;
    }

    await loadFindings();
    await loadPrograms();
  } catch (deleteError) {
    error.value = toSafeErrorMessage(deleteError, "Unable to delete finding.");
  } finally {
    saving.value = false;
  }
}

function applyFilters() {
  page.value = 1;
  void loadFindings();
}

function clearFilters() {
  search.value = "";
  programId.value = null;
  severity.value = null;
  status.value = null;
  page.value = 1;
  void loadFindings();
}

function goToPage(nextPage: number) {
  page.value = Math.min(totalPages.value, Math.max(1, nextPage));
  void loadFindings();
}

onMounted(async () => {
  await loadPrograms();
  await loadFindings();
});
</script>

<template>
  <section class="resource-page">
    <div class="resource-page__header">
      <div>
        <h2>Findings</h2>
        <p>Track vulnerability reports and report-ready narrative fields.</p>
      </div>
      <AppButton :disabled="programs.length === 0" @click="openCreateForm">New Finding</AppButton>
    </div>

    <FindingFilters
      v-model:program-id="programId"
      v-model:search="search"
      v-model:severity="severity"
      v-model:status="status"
      :programs="programs"
      @clear="clearFilters"
      @submit="applyFilters"
    />

    <ErrorState v-if="error" :message="error" />
    <LoadingState v-if="loading || programsLoading" label="Loading findings" />

    <EmptyState
      v-else-if="programs.length === 0"
      text="Create a program first. Findings must belong to one of your programs."
      title="No programs available"
    />
    <EmptyState
      v-else-if="findings.length === 0"
      text="Create a finding or adjust the active filters."
      title="No findings found"
    />
    <FindingList v-else :findings="findings" :programs="programs" @delete="deletingFinding = $event" @edit="openEditForm" />

    <div v-if="meta && meta.total > limit" class="pagination">
      <AppButton :disabled="page <= 1" type="button" variant="secondary" @click="goToPage(page - 1)">Previous</AppButton>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <AppButton :disabled="page >= totalPages" type="button" variant="secondary" @click="goToPage(page + 1)">Next</AppButton>
    </div>

    <div v-if="formOpen" class="overlay" role="presentation">
      <div class="dialog">
        <FindingForm
          :error="formError"
          :initial="editingFinding"
          :loading="saving"
          :programs="programs"
          @cancel="formOpen = false"
          @submit="saveFinding"
        />
      </div>
    </div>

    <div v-if="deletingFinding" class="overlay" role="presentation">
      <div class="dialog dialog--sm">
        <h3>Delete this finding?</h3>
        <p>This removes the finding record. This cannot be undone.</p>
        <div class="dialog__actions">
          <AppButton :loading="saving" type="button" variant="danger" @click="confirmDeleteFinding">Delete</AppButton>
          <AppButton type="button" variant="secondary" @click="deletingFinding = null">Cancel</AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resource-page {
  display: grid;
  gap: 18px;
}

.resource-page__header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

h2 {
  color: var(--q-text);
  font-size: 24px;
  font-weight: 850;
  margin: 0 0 4px;
}

p {
  color: var(--q-text-muted);
  margin: 0;
}

.pagination {
  align-items: center;
  color: var(--q-text-muted);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.78);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 50;
}

.dialog {
  background: var(--q-surface);
  border: 1px solid var(--q-border);
  border-radius: 8px;
  max-height: 90vh;
  max-width: 880px;
  overflow: auto;
  padding: 20px;
  width: min(880px, 100%);
}

.dialog--sm {
  max-width: 440px;
}

.dialog h3 {
  color: var(--q-text);
  margin: 0 0 8px;
}

.dialog__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 18px;
}

@media (max-width: 720px) {
  .resource-page__header,
  .pagination {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
