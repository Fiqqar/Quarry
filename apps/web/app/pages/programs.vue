<script setup lang="ts">
import type { Program, ProgramInput, ProgramListItem, PaginationMeta } from "~/types/program";
import { toSafeErrorMessage } from "~/utils/api-error";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const programsApi = usePrograms();
const programs = ref<ProgramListItem[]>([]);
const meta = ref<PaginationMeta | undefined>();
const search = ref("");
const page = ref(1);
const limit = 20;
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);
const formOpen = ref(false);
const editingProgram = ref<Program | null>(null);
const deletingProgram = ref<ProgramListItem | null>(null);

const totalPages = computed(() => Math.max(1, Math.ceil((meta.value?.total ?? 0) / limit)));

async function loadPrograms() {
  loading.value = true;
  error.value = null;

  try {
    const result = await programsApi.listPrograms({
      search: search.value,
      page: page.value,
      limit,
    });

    programs.value = result.data;
    meta.value = result.meta;
  } catch (loadError) {
    error.value = toSafeErrorMessage(loadError, "Unable to load programs.");
  } finally {
    loading.value = false;
  }
}

function openCreateForm() {
  editingProgram.value = null;
  formError.value = null;
  formOpen.value = true;
}

function openEditForm(program: ProgramListItem) {
  editingProgram.value = program;
  formError.value = null;
  formOpen.value = true;
}

async function saveProgram(input: ProgramInput) {
  saving.value = true;
  formError.value = null;

  try {
    if (editingProgram.value) {
      await programsApi.updateProgram(editingProgram.value.id, input);
    } else {
      await programsApi.createProgram(input);
      page.value = 1;
    }

    formOpen.value = false;
    editingProgram.value = null;
    await loadPrograms();
  } catch (saveError) {
    formError.value = toSafeErrorMessage(saveError, "Unable to save program.");
  } finally {
    saving.value = false;
  }
}

async function confirmDeleteProgram() {
  if (!deletingProgram.value) {
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    await programsApi.deleteProgram(deletingProgram.value.id);
    deletingProgram.value = null;

    if (programs.value.length === 1 && page.value > 1) {
      page.value -= 1;
    }

    await loadPrograms();
  } catch (deleteError) {
    error.value = toSafeErrorMessage(deleteError, "Unable to delete program.");
  } finally {
    saving.value = false;
  }
}

function applySearch() {
  page.value = 1;
  void loadPrograms();
}

function clearSearch() {
  search.value = "";
  page.value = 1;
  void loadPrograms();
}

function goToPage(nextPage: number) {
  page.value = Math.min(totalPages.value, Math.max(1, nextPage));
  void loadPrograms();
}

onMounted(() => {
  void loadPrograms();
});
</script>

<template>
  <section class="resource-page">
    <div class="resource-page__header">
      <div>
        <h2>Programs</h2>
        <p>Manage bug bounty programs and target groups.</p>
      </div>
      <AppButton @click="openCreateForm">New Program</AppButton>
    </div>

    <ProgramFilters v-model:search="search" @clear="clearSearch" @submit="applySearch" />
    <ErrorState v-if="error" :message="error" />
    <LoadingState v-if="loading" label="Loading programs" />

    <EmptyState
      v-else-if="programs.length === 0"
      text="Create a program to start organizing findings."
      title="No programs yet"
    />
    <ProgramList v-else :programs="programs" @delete="deletingProgram = $event" @edit="openEditForm" />

    <div v-if="meta && meta.total > limit" class="pagination">
      <AppButton :disabled="page <= 1" type="button" variant="secondary" @click="goToPage(page - 1)">Previous</AppButton>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <AppButton :disabled="page >= totalPages" type="button" variant="secondary" @click="goToPage(page + 1)">Next</AppButton>
    </div>

    <div v-if="formOpen" class="overlay" role="presentation">
      <div class="dialog">
        <ProgramForm
          :error="formError"
          :initial="editingProgram"
          :loading="saving"
          @cancel="formOpen = false"
          @submit="saveProgram"
        />
      </div>
    </div>

    <div v-if="deletingProgram" class="overlay" role="presentation">
      <div class="dialog dialog--sm">
        <h3>Delete this program?</h3>
        <p>This removes the program record. Findings linked to it may block deletion if the database requires it.</p>
        <div class="dialog__actions">
          <AppButton :loading="saving" type="button" variant="danger" @click="confirmDeleteProgram">Delete</AppButton>
          <AppButton type="button" variant="secondary" @click="deletingProgram = null">Cancel</AppButton>
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
  max-width: 680px;
  overflow: auto;
  padding: 20px;
  width: min(680px, 100%);
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
