<script setup lang="ts">
interface Props {
  label: string
  value: number | string
}

defineProps<Props>()
</script>

<template>
  <div class="rounded-lg border bg-white p-5">
    <div class="text-sm text-gray-500">{{ label }}</div>
    <div class="mt-1 text-2xl font-bold">{{ value }}</div>
  </div>
</template>
