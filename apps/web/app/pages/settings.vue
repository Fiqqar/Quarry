<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { loading, logout, user } = useAuth();

async function handleLogout() {
  await logout();
  await navigateTo("/login");
}
</script>

<template>
  <section class="settings-page">
    <h2>Settings</h2>
    <AppCard>
      <div class="settings-page__account">
        <div>
          <span>Account</span>
          <strong>{{ user?.name || "Quarry User" }}</strong>
          <p>{{ user?.email }}</p>
        </div>
        <AppButton :loading="loading" variant="secondary" @click="handleLogout">Logout</AppButton>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.settings-page {
  display: grid;
  gap: 18px;
  max-width: 760px;
}

h2 {
  color: var(--q-text);
  font-size: 24px;
  font-weight: 850;
  margin: 0;
}

.settings-page__account {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

span {
  color: var(--q-text-soft);
  display: block;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 8px;
}

strong {
  color: var(--q-text);
  display: block;
  font-size: 18px;
}

p {
  color: var(--q-text-muted);
  margin: 4px 0 0;
}

@media (max-width: 640px) {
  .settings-page__account {
    align-items: flex-start;
    display: grid;
    gap: 16px;
  }
}
</style>
