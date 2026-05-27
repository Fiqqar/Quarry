<template>
  <main class="auth-layout">
    <section class="auth-layout__panel">
      <div class="auth-layout__brand">
        <span class="auth-layout__mark">Q</span>
        <div>
          <strong>Quarry</strong>
          <span>HTTP evidence to markdown reports</span>
        </div>
      </div>
      <slot />
    </section>
  </main>
</template>

<style scoped>
.auth-layout {
  align-items: center;
  display: grid;
  min-height: 100vh;
  padding: 24px;
}

.auth-layout__panel {
  background: rgba(24, 24, 27, 0.82);
  border: 1px solid var(--q-border-soft);
  border-radius: 8px;
  justify-self: center;
  max-width: 430px;
  padding: 24px;
  width: 100%;
}

.auth-layout__brand {
  align-items: center;
  border-bottom: 1px solid var(--q-border-soft);
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
  padding-bottom: 18px;
}

.auth-layout__mark {
  align-items: center;
  background: var(--q-amber);
  border-radius: 6px;
  color: #111113;
  display: inline-flex;
  font-size: 16px;
  font-weight: 900;
  height: 34px;
  justify-content: center;
  width: 34px;
}

strong,
span {
  display: block;
}

strong {
  color: var(--q-text);
  font-size: 17px;
}

span {
  color: var(--q-text-muted);
}
</style>
