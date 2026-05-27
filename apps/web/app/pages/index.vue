<script setup lang="ts">
const auth = useAuthStore();

onMounted(async () => {
  if (!auth.initialized) {
    await auth.fetchMe();
  }

  await navigateTo(auth.isAuthenticated ? "/dashboard" : "/login");
});
</script>

<template>
  <LoadingState label="Opening Quarry" />
</template>
