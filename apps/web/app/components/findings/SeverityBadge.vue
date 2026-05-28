<script setup lang="ts">
import type { Severity } from "~/types/finding";

const props = defineProps<{
  severity: Severity;
}>();

const tone = computed(() => {
  if (props.severity === "critical") return "red";
  if (props.severity === "high") return "amber";
  if (props.severity === "medium") return "cyan";
  return "zinc";
});
</script>

<template>
  <AppBadge :tone="tone">{{ props.severity }}</AppBadge>
</template>
