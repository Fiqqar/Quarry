<script setup lang="ts">
const emit = defineEmits<{
  toggleSidebar: [];
}>();
const route = useRoute();
const { loading, logout, user } = useAuth();
const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/programs": "Programs",
  "/findings": "Findings",
  "/templates": "Templates",
  "/settings": "Settings",
};
const title = computed(() => titleMap[route.path] ?? "Quarry");

async function handleLogout() {
  await logout();
  await navigateTo("/login");
}
</script>

<template>
  <header class="app-topbar">
    <div class="app-topbar__left">
      <button class="app-topbar__menu" type="button" @click="emit('toggleSidebar')">Menu</button>
      <div>
        <span class="app-topbar__eyebrow">Quarry</span>
        <h1>{{ title }}</h1>
      </div>
    </div>

    <div class="app-topbar__right">
      <AppBadge tone="emerald">Session</AppBadge>
      <span class="app-topbar__user">{{ user?.email }}</span>
      <AppButton :loading="loading" variant="secondary" @click="handleLogout">Logout</AppButton>
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  align-items: center;
  background: rgba(9, 9, 11, 0.86);
  border-bottom: 1px solid var(--q-border-soft);
  display: flex;
  height: 64px;
  justify-content: space-between;
  left: 240px;
  padding: 0 24px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 15;
}

.app-topbar__left,
.app-topbar__right {
  align-items: center;
  display: flex;
  gap: 12px;
  min-width: 0;
}

.app-topbar__eyebrow {
  color: var(--q-text-soft);
  display: block;
  font-size: 12px;
  font-weight: 800;
}

h1 {
  color: var(--q-text);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.1;
  margin: 0;
}

.app-topbar__menu {
  background: transparent;
  border: 1px solid var(--q-border);
  border-radius: 6px;
  color: var(--q-text);
  display: none;
  height: 36px;
  padding: 0 10px;
}

.app-topbar__user {
  color: var(--q-text-muted);
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .app-topbar {
    left: 0;
    padding: 0 16px;
  }

  .app-topbar__menu {
    display: inline-flex;
  }

  .app-topbar__right {
    gap: 8px;
  }

  .app-topbar__user {
    display: none;
  }
}
</style>
