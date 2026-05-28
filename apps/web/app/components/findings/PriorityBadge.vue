<script setup lang="ts">
import type { Priority } from "~/types/finding";

const props = defineProps<{
  priority: Priority | null;
}>();

const tone = computed(() => {
  if (props.priority === "p1") return "red";
  if (props.priority === "p2") return "amber";
  if (props.priority === "p3") return "cyan";
  return "zinc";
});
</script>

<template>
  <AppBadge :tone="tone">{{ props.priority || "none" }}</AppBadge>
</template>
