<script setup lang="ts">
import type { FindingStatus } from "~/types/finding";

const props = defineProps<{
  status: FindingStatus;
}>();

const tone = computed(() => {
  if (props.status === "accepted" || props.status === "fixed") return "emerald";
  if (props.status === "reported") return "cyan";
  if (props.status === "ready") return "amber";
  if (props.status === "rejected" || props.status === "duplicate") return "red";
  return "zinc";
});
</script>

<template>
  <AppBadge :tone="tone">{{ props.status }}</AppBadge>
</template>
