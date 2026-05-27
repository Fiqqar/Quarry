<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { user } = useAuth();
const api = useApi();
const healthStatus = ref<"checking" | "online" | "offline">("checking");
const metrics = [
  { label: "Programs", value: "--", tone: "amber" },
  { label: "Findings", value: "--", tone: "cyan" },
  { label: "Reports", value: "--", tone: "emerald" },
  { label: "HTTP Artifacts", value: "--", tone: "zinc" },
] as const;

onMounted(async () => {
  try {
    await api.get<{ status: string }>("/health");
    healthStatus.value = "online";
  } catch {
    healthStatus.value = "offline";
  }
});
</script>

<template>
  <div class="dashboard-page">
    <section class="dashboard-page__header">
      <div>
        <AppBadge :tone="healthStatus === 'online' ? 'emerald' : healthStatus === 'offline' ? 'red' : 'zinc'">
          API {{ healthStatus }}
        </AppBadge>
        <h2>Welcome back{{ user?.name ? `, ${user.name}` : "" }}</h2>
        <p>Track programs, shape findings, and turn redacted HTTP evidence into reports.</p>
      </div>
      <div class="dashboard-page__actions">
        <NuxtLink class="dashboard-page__action" to="/programs">New Program</NuxtLink>
        <NuxtLink class="dashboard-page__action dashboard-page__action--primary" to="/findings">
          New Finding
        </NuxtLink>
      </div>
    </section>

    <section class="dashboard-page__metrics">
      <AppCard v-for="metric in metrics" :key="metric.label">
        <div class="metric-card">
          <AppBadge :tone="metric.tone">{{ metric.label }}</AppBadge>
          <strong>{{ metric.value }}</strong>
          <span>Ready for API-backed data in the next phase.</span>
        </div>
      </AppCard>
    </section>

    <AppCard>
      <div class="dashboard-page__workbench">
        <div>
          <h3>Workbench</h3>
          <p>Programs and findings screens are scaffolded. CRUD UI starts in the next phase.</p>
        </div>
        <AppBadge tone="amber">Frontend foundation</AppBadge>
      </div>
    </AppCard>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 18px;
}

.dashboard-page__header {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

h2 {
  color: var(--q-text);
  font-size: 28px;
  font-weight: 850;
  margin: 14px 0 7px;
}

h3 {
  color: var(--q-text);
  font-size: 18px;
  margin: 0 0 6px;
}

p {
  color: var(--q-text-muted);
  margin: 0;
}

.dashboard-page__actions {
  display: flex;
  gap: 10px;
}

.dashboard-page__action {
  align-items: center;
  border: 1px solid var(--q-border);
  border-radius: 6px;
  color: var(--q-text);
  display: inline-flex;
  font-weight: 800;
  height: 38px;
  padding: 0 14px;
}

.dashboard-page__action:hover {
  background: #202127;
}

.dashboard-page__action--primary {
  background: var(--q-amber);
  border-color: var(--q-amber);
  color: #111113;
}

.dashboard-page__metrics {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card {
  display: grid;
  gap: 12px;
}

.metric-card strong {
  color: var(--q-text);
  font-size: 30px;
  line-height: 1;
}

.metric-card span {
  color: var(--q-text-soft);
}

.dashboard-page__workbench {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 1000px) {
  .dashboard-page__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .dashboard-page__header,
  .dashboard-page__workbench {
    display: grid;
  }

  .dashboard-page__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
