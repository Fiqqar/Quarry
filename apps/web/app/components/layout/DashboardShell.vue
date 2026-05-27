<script setup lang="ts">
const sidebarOpen = ref(false);
</script>

<template>
  <div class="dashboard-shell">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <AppTopbar @toggle-sidebar="sidebarOpen = true" />
    <main class="dashboard-shell__main q-scrollbar">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
}

.dashboard-shell__main {
  margin-left: 240px;
  min-height: 100vh;
  overflow: auto;
  padding: 88px 28px 28px;
}

@media (max-width: 900px) {
  .dashboard-shell__main {
    margin-left: 0;
    padding: 84px 16px 20px;
  }
}
</style>
