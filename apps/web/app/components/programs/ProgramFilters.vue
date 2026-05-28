<script setup lang="ts">
const search = defineModel<string>("search", { default: "" });

defineEmits<{
  submit: [];
  clear: [];
}>();
</script>

<template>
  <form class="program-filters" @submit.prevent="$emit('submit')">
    <AppInput
      id="program-search"
      v-model="search"
      autocomplete="off"
      label="Search"
      placeholder="Program name or platform"
    />
    <div class="program-filters__actions">
      <AppButton type="submit" variant="secondary">Search</AppButton>
      <AppButton type="button" variant="ghost" @click="$emit('clear')">Clear</AppButton>
    </div>
  </form>
</template>

<style scoped>
.program-filters {
  align-items: end;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(220px, 1fr) auto;
}

.program-filters__actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 720px) {
  .program-filters {
    grid-template-columns: 1fr;
  }
}
</style>
