<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open?: boolean;
  }>(),
  {
    open: false,
  },
);
const emit = defineEmits<{
  close: [];
}>();
const navigation = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Programs", to: "/programs" },
  { label: "Findings", to: "/findings" },
  { label: "Templates", to: "/templates" },
  { label: "Settings", to: "/settings" },
];
</script>

<template>
  <aside :class="['app-sidebar', { 'app-sidebar--open': props.open }]">
    <div class="app-sidebar__brand">
      <NuxtLink class="app-sidebar__logo" to="/dashboard" @click="emit('close')">
        <span class="app-sidebar__logo-mark">Q</span>
        <span>
          <strong>Quarry</strong>
          <small>HTTP to report</small>
        </span>
      </NuxtLink>
      <button class="app-sidebar__close" type="button" @click="emit('close')">Close</button>
    </div>

    <nav aria-label="Primary navigation" class="app-sidebar__nav">
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        active-class="app-sidebar__link--active"
        class="app-sidebar__link"
        :to="item.to"
        @click="emit('close')"
      >
        <span aria-hidden="true" class="app-sidebar__dot" />
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>

  <button
    v-if="props.open"
    aria-label="Close navigation"
    class="app-sidebar__overlay"
    type="button"
    @click="emit('close')"
  />
</template>

<style scoped>
.app-sidebar {
  background: rgba(13, 14, 18, 0.98);
  border-right: 1px solid var(--q-border-soft);
  bottom: 0;
  left: 0;
  padding: 18px 14px;
  position: fixed;
  top: 0;
  width: 240px;
  z-index: 30;
}

.app-sidebar__brand {
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 44px;
}

.app-sidebar__logo {
  align-items: center;
  display: inline-flex;
  gap: 10px;
}

.app-sidebar__logo-mark {
  align-items: center;
  background: var(--q-amber);
  border-radius: 6px;
  color: #111113;
  display: inline-flex;
  font-weight: 900;
  height: 32px;
  justify-content: center;
  width: 32px;
}

strong,
small {
  display: block;
}

strong {
  color: var(--q-text);
  font-size: 15px;
}

small {
  color: var(--q-text-soft);
  font-size: 12px;
}

.app-sidebar__close {
  background: transparent;
  border: 0;
  color: var(--q-text-muted);
  display: none;
}

.app-sidebar__nav {
  display: grid;
  gap: 4px;
  margin-top: 24px;
}

.app-sidebar__link {
  align-items: center;
  border-radius: 6px;
  color: var(--q-text-muted);
  display: flex;
  font-weight: 700;
  gap: 10px;
  height: 38px;
  padding: 0 10px;
}

.app-sidebar__link:hover,
.app-sidebar__link--active {
  background: var(--q-amber-soft);
  color: var(--q-text);
}

.app-sidebar__link--active .app-sidebar__dot {
  background: var(--q-amber);
}

.app-sidebar__dot {
  background: var(--q-border);
  border-radius: 999px;
  height: 7px;
  width: 7px;
}

.app-sidebar__overlay {
  display: none;
}

@media (max-width: 900px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 180ms ease;
  }

  .app-sidebar--open {
    transform: translateX(0);
  }

  .app-sidebar__close {
    display: inline-flex;
  }

  .app-sidebar__overlay {
    background: rgba(0, 0, 0, 0.66);
    border: 0;
    bottom: 0;
    display: block;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 20;
  }
}
</style>
